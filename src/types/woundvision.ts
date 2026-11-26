export type TissueKey =
  | "epithelial"
  | "slough"
  | "granulation"
  | "necrotic"
  | "other";

export interface TissueStat {
  pixels: number;
  percentage: number | null;
}

export interface WoundAnalysis {
  total_pixels: number;
  wound_pixels: number;
  wound_detected: boolean;
  wound_coverage: number;
  tissues: Record<TissueKey, TissueStat>;
}

export interface WoundVisionResponse {
  success: boolean;
  model_version: string;
  inference_ms: number;
  analysis: WoundAnalysis;
  overlay?: string | null;
  disclaimer?: string;
}

export interface WoundVisionHealthResponse {
  status: "healthy" | "offline";
  model_version?: string;
  uptime_seconds?: number;
  configured?: boolean;
  error?: string;
}

export interface TissueClassMeta {
  key: TissueKey;
  label: string;
  color: string;
  description: string;
  darkBorder?: boolean;
}

export const TISSUE_CLASSES: readonly TissueClassMeta[] = [
  {
    key: "granulation",
    label: "Granulation",
    color: "#DC2626",
    description: "Healthy vascularized tissue indicating active healing",
  },
  {
    key: "slough",
    label: "Slough",
    color: "#EAB308",
    description: "Yellow fibrous non-viable exudate covering the wound bed",
  },
  {
    key: "necrotic",
    label: "Necrotic",
    color: "#262626",
    description: "Dark eschar or devitalized tissue requiring assessment",
    darkBorder: true,
  },
  {
    key: "epithelial",
    label: "Epithelial",
    color: "#EC4899",
    description: "Pink resurfacing tissue regenerating along wound margins",
  },
  {
    key: "other",
    label: "Other",
    color: "#A855F7",
    description: "Secondary or ambiguous wound-bed regions",
  },
] as const;

export const WOUNDVISION_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const WOUNDVISION_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export interface WoundVisionSample {
  id: string;
  label: string;
  caption: string;
  src: string;
  filename: string;
}

/**
 * Sample wound images stored under `public/images/woundvision/`.
 * Missing files are detected automatically at runtime and hidden gracefully.
 */
export const WOUNDVISION_SAMPLES: readonly WoundVisionSample[] = [
  {
    id: "sample-1",
    label: "Sample 1",
    caption: "Granulation & slough mix",
    src: "/images/woundvision/sample-1.jpg",
    filename: "sample-1.jpg",
  },
  {
    id: "sample-2",
    label: "Sample 2",
    caption: "Necrotic & exudate bed",
    src: "/images/woundvision/sample-2.jpg",
    filename: "sample-2.jpg",
  },
  {
    id: "sample-3",
    label: "Sample 3",
    caption: "Epithelializing margin",
    src: "/images/woundvision/sample-3.jpg",
    filename: "sample-3.jpg",
  },
] as const;
