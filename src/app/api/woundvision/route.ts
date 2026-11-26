import {
  WOUNDVISION_ALLOWED_MIME_TYPES,
  WOUNDVISION_MAX_FILE_SIZE_BYTES,
} from "@/types/woundvision";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEALTH_TIMEOUT_MS = 8_000;
const PREDICT_TIMEOUT_MS = 30_000;

const RATE_LIMIT_MAX_REQUESTS = 15;
const RATE_LIMIT_WINDOW_MS = 60_000;

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

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim();
  return realIp || "unknown";
}

function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();

  if (rateLimitStore.size > 500) {
    rateLimitStore.forEach((entry, key) => {
      if (entry.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    });
  }

  const existing = rateLimitStore.get(ip);
  if (!existing || existing.resetAt <= now) {
    const entry: RateLimitEntry = {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitStore.set(ip, entry);
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetAt: entry.resetAt,
    };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - existing.count),
    resetAt: existing.resetAt,
  };
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
        return detail;
      }
    } else {
      const text = (await response.text()).trim();
      if (text.length > 0 && text.length <= 240) {
        return text;
      }
    }
  } catch {
    // Fall back to default error message when body cannot be parsed.
  }
  return fallback;
}

export async function GET() {
  const { baseUrl, apiKey } = getApiConfig();

  if (!baseUrl) {
    return NextResponse.json(
      {
        status: "offline",
        configured: false,
        error: "WoundVision backend URL is not configured.",
      },
      { status: 503 }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

  try {
    const headers: HeadersInit = {};
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
        { status: upstream.status >= 500 ? 503 : upstream.status }
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
        ...upstreamData,
        status: "healthy",
        configured: true,
      },
      { status: 200 }
    );
  } catch (err) {
    if (isTimeoutError(err)) {
      return NextResponse.json(
        {
          status: "offline",
          configured: true,
          error: "Health check timed out while contacting the inference server.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        status: "offline",
        configured: true,
        error: "Unable to connect to the WoundVision inference server.",
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);

  const rateLimitHeaders: Record<string, string> = {
    "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
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
          ...rateLimitHeaders,
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
      { status: 503, headers: rateLimitHeaders }
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
        { status: 400, headers: rateLimitHeaders }
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
        { status: 400, headers: rateLimitHeaders }
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
        error: "Invalid request body. Expected multipart/form-data with a 'file' field.",
      },
      { status: 400, headers: rateLimitHeaders }
    );
  }

  const fileEntry = incomingFormData.get("file");
  if (!fileEntry || typeof fileEntry === "string") {
    return NextResponse.json(
      {
        success: false,
        error: "Missing image file. Provide an image in the 'file' form field.",
      },
      { status: 400, headers: rateLimitHeaders }
    );
  }

  if (fileEntry.size === 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Uploaded file is empty.",
      },
      { status: 400, headers: rateLimitHeaders }
    );
  }

  if (fileEntry.size > WOUNDVISION_MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      {
        success: false,
        error: "File size exceeds the 10 MB limit.",
      },
      { status: 413, headers: rateLimitHeaders }
    );
  }

  const mimeType = fileEntry.type.toLowerCase();
  const isAllowedMime = (
    WOUNDVISION_ALLOWED_MIME_TYPES as readonly string[]
  ).includes(mimeType);

  if (!isAllowedMime) {
    return NextResponse.json(
      {
        success: false,
        error: "Unsupported image format. Allowed formats: JPEG, PNG, and WebP.",
      },
      { status: 400, headers: rateLimitHeaders }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PREDICT_TIMEOUT_MS);

  try {
    const fileBuffer = await fileEntry.arrayBuffer();
    const forwardFormData = new FormData();
    const fileName =
      "name" in fileEntry && typeof fileEntry.name === "string" && fileEntry.name
        ? fileEntry.name
        : "wound-image.jpg";

    forwardFormData.append(
      "file",
      new Blob([fileBuffer], { type: mimeType }),
      fileName
    );

    const upstreamUrl = new URL(`${baseUrl}/predict`);
    upstreamUrl.searchParams.set("opacity", opacity.toFixed(2));
    upstreamUrl.searchParams.set("include_overlay", String(includeOverlay));

    const headers: HeadersInit = {};
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
        { status, headers: rateLimitHeaders }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data, { status: 200, headers: rateLimitHeaders });
  } catch (err) {
    if (isTimeoutError(err)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Inference request timed out. The server may be waking up or under heavy load.",
        },
        { status: 504, headers: rateLimitHeaders }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Could not reach the WoundVision inference server. Please try again later.",
      },
      { status: 502, headers: rateLimitHeaders }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
