import {
  WOUNDVISION_ALLOWED_MIME_TYPES,
  WOUNDVISION_MAX_FILE_SIZE_BYTES,
} from "@/types/woundvision";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEALTH_TIMEOUT_MS = 8_000;
const PREDICT_TIMEOUT_MS = 30_000;

// Allow small multipart boundary overhead above the 10 MB file limit.
const MAX_MULTIPART_BODY_BYTES = WOUNDVISION_MAX_FILE_SIZE_BYTES + 256 * 1024;

const RATE_LIMIT_WINDOW_MS = 60_000;
const PREDICT_RATE_LIMIT_MAX = 15;
const HEALTH_RATE_LIMIT_MAX = 60;

const SECURITY_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
  "X-Content-Type-Options": "nosniff",
};

type AllowedMime = (typeof WOUNDVISION_ALLOWED_MIME_TYPES)[number];

const MIME_TO_SAFE_FILENAME: Record<AllowedMime, string> = {
  "image/jpeg": "wound-upload.jpg",
  "image/png": "wound-upload.png",
  "image/webp": "wound-upload.webp",
};

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function getApiConfig() {
  const rawUrl = process.env.WOUNDVISION_API_URL?.trim() ?? "";
  const baseUrl = rawUrl.replace(/\/+$/, "");
  const apiKey = process.env.WOUNDVISION_API_KEY?.trim() ?? "";
  return { baseUrl, apiKey };
}

/**
 * Prioritize reverse-proxy-overwritten headers (Cloudflare / Nginx) over
 * client-spoofable X-Forwarded-For.
 */
function getClientIp(request: NextRequest): string {
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return "unknown";
}

function checkRateLimit(
  bucketKey: string,
  maxRequests: number
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();

  if (rateLimitStore.size > 1000) {
    rateLimitStore.forEach((entry, key) => {
      if (entry.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    });
  }

  const existing = rateLimitStore.get(bucketKey);
  if (!existing || existing.resetAt <= now) {
    const entry: RateLimitEntry = {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitStore.set(bucketKey, entry);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: entry.resetAt,
    };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - existing.count),
    resetAt: existing.resetAt,
  };
}

/**
 * Inspect file signature (magic bytes) to verify the actual binary format
 * rather than trusting the client-supplied Content-Type header alone.
 */
function detectImageMimeFromBytes(buffer: ArrayBuffer): AllowedMime | null {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 12) return null;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  // WebP: "RIFF" at 0..3 and "WEBP" at 8..11
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

function isTimeoutError(err: unknown): boolean {
  return (
    err instanceof Error &&
    (err.name === "AbortError" || err.name === "TimeoutError")
  );
}

async function extractBackendError(
  response: Response,
  fallback: string
): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const payload = (await response.json()) as Record<string, unknown>;
      const detail = payload.detail ?? payload.error ?? payload.message;
      if (typeof detail === "string" && detail.trim().length > 0) {
        return detail.trim().slice(0, 240);
      }
    }
  } catch {
    // Fall back to default safe error message when body cannot be parsed.
  }
  return fallback;
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`health:${ip}`, HEALTH_RATE_LIMIT_MAX);

  if (!limit.allowed) {
    const retryAfter = Math.max(
      1,
      Math.ceil((limit.resetAt - Date.now()) / 1000)
    );
    return NextResponse.json(
      {
        status: "offline",
        error: "Rate limit exceeded for health checks.",
      },
      {
        status: 429,
        headers: {
          ...SECURITY_HEADERS,
          "Retry-After": String(retryAfter),
        },
      }
    );
  }

  const { baseUrl, apiKey } = getApiConfig();

  if (!baseUrl) {
    return NextResponse.json(
      {
        status: "offline",
        configured: false,
        error: "WoundVision backend URL is not configured.",
      },
      { status: 503, headers: SECURITY_HEADERS }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

  try {
    const headers: HeadersInit = {
      Accept: "application/json",
    };
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    const upstream = await fetch(`${baseUrl}/health`, {
      method: "GET",
      headers,
      cache: "no-store",
      signal: controller.signal,
    });

    if (!upstream.ok) {
      const message = await extractBackendError(
        upstream,
        "Inference server reported an unhealthy status."
      );
      return NextResponse.json(
        {
          status: "offline",
          configured: true,
          error: message,
        },
        {
          status: upstream.status >= 500 ? 503 : upstream.status,
          headers: SECURITY_HEADERS,
        }
      );
    }

    let upstreamData: Record<string, unknown> = {};
    try {
      upstreamData = (await upstream.json()) as Record<string, unknown>;
    } catch {
      upstreamData = {};
    }

    return NextResponse.json(
      {
        status: "healthy",
        configured: true,
        model_version:
          typeof upstreamData.model_version === "string"
            ? upstreamData.model_version
            : undefined,
      },
      { status: 200, headers: SECURITY_HEADERS }
    );
  } catch (err) {
    if (isTimeoutError(err)) {
      return NextResponse.json(
        {
          status: "offline",
          configured: true,
          error: "Health check timed out while contacting the inference server.",
        },
        { status: 504, headers: SECURITY_HEADERS }
      );
    }

    return NextResponse.json(
      {
        status: "offline",
        configured: true,
        error: "Unable to connect to the WoundVision inference server.",
      },
      { status: 502, headers: SECURITY_HEADERS }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`predict:${ip}`, PREDICT_RATE_LIMIT_MAX);

  const responseHeaders: Record<string, string> = {
    ...SECURITY_HEADERS,
    "X-RateLimit-Limit": String(PREDICT_RATE_LIMIT_MAX),
    "X-RateLimit-Remaining": String(limit.remaining),
    "X-RateLimit-Reset": String(Math.ceil(limit.resetAt / 1000)),
  };

  if (!limit.allowed) {
    const retryAfter = Math.max(
      1,
      Math.ceil((limit.resetAt - Date.now()) / 1000)
    );
    return NextResponse.json(
      {
        success: false,
        error: `Too many requests. Please wait ${retryAfter}s before trying again.`,
      },
      {
        status: 429,
        headers: {
          ...responseHeaders,
          "Retry-After": String(retryAfter),
        },
      }
    );
  }

  const { baseUrl, apiKey } = getApiConfig();
  if (!baseUrl) {
    return NextResponse.json(
      {
        success: false,
        error: "WoundVision inference backend is not configured on this server.",
      },
      { status: 503, headers: responseHeaders }
    );
  }

  // Reject oversized payloads early before buffering multipart body in memory.
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (Number.isFinite(contentLength) && contentLength > MAX_MULTIPART_BODY_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: "Request payload exceeds the 10 MB image size limit.",
        },
        { status: 413, headers: responseHeaders }
      );
    }
  }

  const contentTypeHeader = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentTypeHeader.includes("multipart/form-data")) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid Content-Type. Expected multipart/form-data.",
      },
      { status: 400, headers: responseHeaders }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const opacityRaw = searchParams.get("opacity");
  const includeOverlayRaw = searchParams.get("include_overlay");

  let opacity = 0.5;
  if (opacityRaw !== null && opacityRaw !== "") {
    const parsedOpacity = Number(opacityRaw);
    if (
      !Number.isFinite(parsedOpacity) ||
      parsedOpacity < 0 ||
      parsedOpacity > 1
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter 'opacity' must be a number between 0.0 and 1.0.",
        },
        { status: 400, headers: responseHeaders }
      );
    }
    opacity = parsedOpacity;
  }

  let includeOverlay = true;
  if (includeOverlayRaw !== null && includeOverlayRaw !== "") {
    const normalized = includeOverlayRaw.toLowerCase();
    if (normalized === "true") {
      includeOverlay = true;
    } else if (normalized === "false") {
      includeOverlay = false;
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter 'include_overlay' must be 'true' or 'false'.",
        },
        { status: 400, headers: responseHeaders }
      );
    }
  }

  let incomingFormData: FormData;
  try {
    incomingFormData = await request.formData();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid request body. Expected multipart/form-data with a 'file' field.",
      },
      { status: 400, headers: responseHeaders }
    );
  }

  const fileEntry = incomingFormData.get("file");
  if (!fileEntry || typeof fileEntry === "string") {
    return NextResponse.json(
      {
        success: false,
        error: "Missing image file. Provide an image in the 'file' form field.",
      },
      { status: 400, headers: responseHeaders }
    );
  }

  if (fileEntry.size === 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Uploaded file is empty.",
      },
      { status: 400, headers: responseHeaders }
    );
  }

  if (fileEntry.size > WOUNDVISION_MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      {
        success: false,
        error: "File size exceeds the 10 MB limit.",
      },
      { status: 413, headers: responseHeaders }
    );
  }

  const declaredMime = fileEntry.type.toLowerCase();
  const isAllowedDeclaredMime = (
    WOUNDVISION_ALLOWED_MIME_TYPES as readonly string[]
  ).includes(declaredMime);

  if (!isAllowedDeclaredMime) {
    return NextResponse.json(
      {
        success: false,
        error: "Unsupported image format. Allowed formats: JPEG, PNG, and WebP.",
      },
      { status: 400, headers: responseHeaders }
    );
  }

  const fileBuffer = await fileEntry.arrayBuffer();
  const detectedMime = detectImageMimeFromBytes(fileBuffer);

  if (!detectedMime) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid image file signature. File content must be a valid JPEG, PNG, or WebP image.",
      },
      { status: 400, headers: responseHeaders }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PREDICT_TIMEOUT_MS);

  try {
    const forwardFormData = new FormData();
    forwardFormData.append(
      "file",
      new Blob([fileBuffer], { type: detectedMime }),
      MIME_TO_SAFE_FILENAME[detectedMime]
    );

    const upstreamUrl = new URL(`${baseUrl}/predict`);
    upstreamUrl.searchParams.set("opacity", opacity.toFixed(2));
    upstreamUrl.searchParams.set("include_overlay", String(includeOverlay));

    const headers: HeadersInit = {
      Accept: "application/json",
    };
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    const upstream = await fetch(upstreamUrl.toString(), {
      method: "POST",
      headers,
      body: forwardFormData,
      cache: "no-store",
      signal: controller.signal,
    });

    if (!upstream.ok) {
      const fallbackMessages: Record<number, string> = {
        400: "Invalid image or prediction parameters.",
        401: "Inference server rejected authentication credentials.",
        413: "Image file is too large for the inference server.",
        503: "Inference service is temporarily unavailable.",
      };
      const status = upstream.status;
      const errorMessage = await extractBackendError(
        upstream,
        fallbackMessages[status] ?? `Inference server returned error (${status}).`
      );

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status, headers: responseHeaders }
      );
    }

    const upstreamContentType =
      upstream.headers.get("content-type")?.toLowerCase() ?? "";
    if (!upstreamContentType.includes("application/json")) {
      return NextResponse.json(
        {
          success: false,
          error: "Inference server returned an unexpected non-JSON response.",
        },
        { status: 502, headers: responseHeaders }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data, { status: 200, headers: responseHeaders });
  } catch (err) {
    if (isTimeoutError(err)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Inference request timed out. The server may be waking up or under heavy load.",
        },
        { status: 504, headers: responseHeaders }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Could not reach the WoundVision inference server. Please try again later.",
      },
      { status: 502, headers: responseHeaders }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
