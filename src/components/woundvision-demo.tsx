"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  TISSUE_CLASSES,
  WOUNDVISION_ALLOWED_MIME_TYPES,
  WOUNDVISION_MAX_FILE_SIZE_BYTES,
  WOUNDVISION_SAMPLES,
  type WoundVisionHealthResponse,
  type WoundVisionResponse,
  type WoundVisionSample,
} from "@/types/woundvision";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  Download,
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
  RefreshCw,
  RotateCcw,
  ScanSearch,
  SlidersHorizontal,
  Upload,
  X,
  ZoomIn,
} from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

type ServerStatus = "checking" | "healthy" | "offline";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function validateImageFile(file: File): string | null {
  const mime = file.type.toLowerCase();
  const isAllowed = (
    WOUNDVISION_ALLOWED_MIME_TYPES as readonly string[]
  ).includes(mime);

  if (!isAllowed) {
    return "Unsupported format. Please select a JPG, PNG, or WebP image.";
  }
  if (file.size === 0) {
    return "Selected file is empty.";
  }
  if (file.size > WOUNDVISION_MAX_FILE_SIZE_BYTES) {
    return `File is too large (${formatFileSize(file.size)}). Maximum allowed size is 10 MB.`;
  }
  return null;
}

export function WoundVisionStatusBadge() {
  const [status, setStatus] = React.useState<ServerStatus>("checking");
  const [detail, setDetail] = React.useState<string>("");

  const checkHealth = React.useCallback(async (signal?: AbortSignal) => {
    setStatus("checking");
    try {
      const res = await fetch("/api/woundvision", {
        method: "GET",
        cache: "no-store",
        signal,
      });
      const data = (await res.json()) as WoundVisionHealthResponse;
      if (res.ok && data.status === "healthy") {
        setStatus("healthy");
        setDetail(
          data.model_version ? `Model ${data.model_version} ready` : "API healthy"
        );
      } else {
        setStatus("offline");
        setDetail(data.error ?? "Inference API unreachable");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setStatus("offline");
      setDetail("Unable to check server status");
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    void checkHealth(controller.signal);
    return () => controller.abort();
  }, [checkHealth]);

  return (
    <button
      type="button"
      onClick={() => void checkHealth()}
      title={detail || "Click to recheck API status"}
      aria-label={`Inference server status: ${status}. Click to refresh.`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        status === "healthy" &&
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400",
        status === "offline" &&
          "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15",
        status === "checking" &&
          "border-border bg-secondary text-muted-foreground"
      )}
    >
      {status === "checking" ? (
        <Loader2 className="size-3 animate-spin" aria-hidden="true" />
      ) : (
        <span
          className={cn(
            "size-1.5 rounded-full",
            status === "healthy" ? "bg-emerald-500" : "bg-destructive"
          )}
          aria-hidden="true"
        />
      )}
      <span>
        {status === "checking"
          ? "Checking API"
          : status === "healthy"
            ? "API Online"
            : "API Offline"}
      </span>
      {status !== "checking" && (
        <RefreshCw className="size-2.5 opacity-60" aria-hidden="true" />
      )}
    </button>
  );
}

export function WoundVisionDemo() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [activeSampleId, setActiveSampleId] = React.useState<string | null>(
    null
  );
  const [opacityPercent, setOpacityPercent] = React.useState<number>(50);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);

  const [isAnalyzing, setIsAnalyzing] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<WoundVisionResponse | null>(null);

  const [zoomedView, setZoomedView] = React.useState<
    "original" | "overlay" | null
  >(null);
  const [blurSamples, setBlurSamples] = React.useState<boolean>(true);
  const [availableSamples, setAvailableSamples] = React.useState<
    WoundVisionSample[]
  >([]);
  const [loadingSampleId, setLoadingSampleId] = React.useState<string | null>(
    null
  );

  const [showRawJson, setShowRawJson] = React.useState<boolean>(false);
  const [showFullBase64, setShowFullBase64] = React.useState<boolean>(false);
  const [copiedJson, setCopiedJson] = React.useState<boolean>(false);

  React.useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function probeSamples() {
      const checks = await Promise.all(
        WOUNDVISION_SAMPLES.map(async (sample) => {
          try {
            const res = await fetch(sample.src, {
              method: "HEAD",
              signal: controller.signal,
            });
            return res.ok ? sample : null;
          } catch {
            return null;
          }
        })
      );
      if (active) {
        setAvailableSamples(
          checks.filter((item): item is WoundVisionSample => item !== null)
        );
      }
    }

    void probeSamples();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  React.useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleSelectFile = React.useCallback(
    (file: File, sampleId: string | null = null) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      setResult(null);
      setSelectedFile(file);
      setActiveSampleId(sampleId);
    },
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSelectFile(file, null);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleSelectFile(file, null);
    }
  };

  const handleSelectSample = async (sample: WoundVisionSample) => {
    setError(null);
    setLoadingSampleId(sample.id);
    try {
      const res = await fetch(sample.src);
      if (!res.ok) {
        throw new Error("Could not load the selected sample image.");
      }
      const blob = await res.blob();
      const mimeType =
        blob.type && blob.type.startsWith("image/") ? blob.type : "image/jpeg";
      const file = new File([blob], sample.filename, { type: mimeType });
      handleSelectFile(file, sample.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load the selected sample image."
      );
    } finally {
      setLoadingSampleId(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const opacityDecimal = (opacityPercent / 100).toFixed(2);
      const res = await fetch(
        `/api/woundvision?opacity=${opacityDecimal}&include_overlay=true`,
        {
          method: "POST",
          body: formData,
        }
      );

      const payload = (await res.json()) as Partial<WoundVisionResponse> & {
        error?: string;
        detail?: string;
      };

      if (!res.ok || !payload.success || !payload.analysis) {
        throw new Error(
          payload.error ||
            payload.detail ||
            `Prediction failed with status ${res.status}.`
        );
      }

      setResult(payload as WoundVisionResponse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unexpected error occurred during wound analysis."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  React.useEffect(() => {
    if (!zoomedView) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomedView(null);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (!result?.overlay) return;
        setZoomedView((prev) => (prev === "original" ? "overlay" : "original"));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomedView, result?.overlay]);

  const handleReset = () => {
    setSelectedFile(null);
    setActiveSampleId(null);
    setResult(null);
    setError(null);
    setOpacityPercent(50);
    setZoomedView(null);
    setShowRawJson(false);
    setShowFullBase64(false);
    setCopiedJson(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadOverlay = () => {
    if (!result?.overlay) return;
    const link = document.createElement("a");
    link.href = result.overlay;
    const baseName = selectedFile?.name
      ? selectedFile.name.replace(/\.[^/.]+$/, "")
      : "woundvision";
    link.download = `${baseName}-overlay.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formattedJson = React.useMemo(() => {
    if (!result) return "";
    if (showFullBase64 || !result.overlay) {
      return JSON.stringify(result, null, 2);
    }
    return JSON.stringify(
      {
        ...result,
        overlay: `${result.overlay.slice(0, 64)}... (${result.overlay.length.toLocaleString()} chars)`,
      },
      null,
      2
    );
  }, [result, showFullBase64]);

  const handleCopyJson = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 1800);
    } catch {
      // Clipboard API may be unavailable in restricted contexts.
    }
  };

  const analysis = result?.analysis ?? null;

  return (
    <div className="space-y-6">
      {/* Input & Controls Card */}
      <Card className="border">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">
                Interactive Segmentation Workspace
              </CardTitle>
              <CardDescription className="text-xs">
                Upload a wound photograph (JPG, PNG, or WebP, max 10 MB) to run
                5-class tissue segmentation.
              </CardDescription>
            </div>
            {selectedFile && (
              <Badge variant="secondary" className="font-normal text-[11px]">
                {formatFileSize(selectedFile.size)}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5 pt-2">
          {/* Drag and Drop Upload Zone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload wound image by clicking or dragging a file here"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={cn(
              "group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              selectedFile && previewUrl ? "p-3" : "px-4 py-7",
              isDragging
                ? "border-foreground bg-accent"
                : "border-border bg-muted/30 hover:border-foreground/50 hover:bg-muted/50"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInputChange}
              className="sr-only"
              aria-hidden="true"
              tabIndex={-1}
            />

            {selectedFile && previewUrl ? (
              <div className="w-full space-y-3">
                <div className="overflow-hidden rounded-md border bg-background/80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Selected wound preview"
                    className="mx-auto max-h-72 w-full object-contain"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-left">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p
                      className="truncate text-sm font-medium text-foreground"
                      title={selectedFile.name}
                    >
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedFile.type.replace("image/", "").toUpperCase()} ·{" "}
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors group-hover:bg-accent">
                    Replace image
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex size-10 items-center justify-center rounded-full border bg-background">
                  <Upload
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">
                    Drop an image here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG, WebP up to 10 MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sample Image Selector (shown only when sample files exist) */}
          {availableSamples.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-foreground">
                  Or try a sample image
                </span>
                <button
                  type="button"
                  onClick={() => setBlurSamples((prev) => !prev)}
                  className="inline-flex min-h-[32px] items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-pressed={!blurSamples}
                >
                  {blurSamples ? (
                    <>
                      <Eye className="size-3.5" aria-hidden="true" />
                      <span>Reveal sensitive previews</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-3.5" aria-hidden="true" />
                      <span>Blur sensitive previews</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {availableSamples.map((sample) => {
                  const isSelected = activeSampleId === sample.id;
                  const isLoading = loadingSampleId === sample.id;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      disabled={isLoading || isAnalyzing}
                      onClick={() => void handleSelectSample(sample)}
                      className={cn(
                        "group flex flex-col overflow-hidden rounded-md border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isSelected
                          ? "border-foreground ring-1 ring-foreground"
                          : "border-border hover:border-foreground/50"
                      )}
                    >
                      <div className="relative h-20 w-full overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sample.src}
                          alt={sample.label}
                          className={cn(
                            "h-full w-full object-cover transition-all duration-200",
                            blurSamples && "scale-110 blur-md"
                          )}
                        />
                        {blurSamples && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/25 px-1.5 text-center text-[10px] font-medium text-white">
                            Sensitive Medical Content
                          </span>
                        )}
                        {isLoading && (
                          <span className="absolute inset-0 flex items-center justify-center bg-background/70">
                            <Loader2 className="size-4 animate-spin text-foreground" />
                          </span>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="truncate text-xs font-medium text-foreground">
                          {sample.label}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {sample.caption}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Controls: Opacity Slider + Actions */}
          <div className="flex flex-col gap-4 rounded-lg border bg-muted/20 p-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="overlay-opacity-slider"
                  className="inline-flex items-center gap-1.5 font-medium text-foreground"
                >
                  <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                  Overlay Opacity
                </label>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {opacityPercent}%
                </span>
              </div>
              <input
                id="overlay-opacity-slider"
                type="range"
                min={0}
                max={100}
                step={5}
                value={opacityPercent}
                onChange={(e) => setOpacityPercent(Number(e.target.value))}
                disabled={isAnalyzing}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:shrink-0">
              <Button
                type="button"
                onClick={() => void handleAnalyze()}
                disabled={!selectedFile || isAnalyzing}
                className="h-10 flex-1 gap-2 sm:flex-initial"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <ScanSearch className="size-4" aria-hidden="true" />
                    <span>{result ? "Re-analyze" : "Analyze Wound"}</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isAnalyzing && !selectedFile}
                className="h-10 gap-1.5"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                <span>Reset</span>
              </Button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-semibold">Unable to complete analysis</p>
                <p className="text-destructive/90">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Panel */}
      {isAnalyzing && (
        <Card className="border p-6">
          <div className="flex flex-col items-center justify-center space-y-3 py-8 text-center">
            <Loader2 className="size-6 animate-spin text-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Running ONNX segmentation...
              </p>
              <p className="text-xs text-muted-foreground">
                Resizing to 320×320 and computing per-pixel tissue probabilities.
              </p>
            </div>
          </div>
        </Card>
      )}

      {!isAnalyzing && !result && (
        <Card className="border border-dashed p-6">
          <div className="flex flex-col items-center justify-center space-y-2 py-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-full border bg-muted/50">
              <ImageIcon
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm font-medium text-foreground">
              {selectedFile
                ? "Image ready for segmentation"
                : "No segmentation output yet"}
            </p>
            <p className="max-w-md text-xs text-muted-foreground">
              {selectedFile
                ? "Adjust the overlay opacity if needed, then click Analyze Wound to inspect tissue composition."
                : "Upload a wound image above to view the side-by-side segmentation overlay, wound coverage, and 5-class tissue breakdown."}
            </p>
          </div>
        </Card>
      )}

      {!isAnalyzing && result && analysis && (
        <Card className="border">
          <CardHeader className="p-5 pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <CardTitle className="text-base font-semibold">
                  Segmentation Results
                </CardTitle>
                <CardDescription className="text-xs">
                  Model {result.model_version} · Overlay opacity {opacityPercent}%
                </CardDescription>
              </div>

              {result.overlay && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadOverlay}
                  className="h-9 gap-1.5 text-xs"
                >
                  <Download className="size-3.5" aria-hidden="true" />
                  <span>Download Overlay PNG</span>
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-5 pt-2">
            {/* Metric Pills */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/25 px-3.5 py-2.5">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Wound Detected
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      analysis.wound_detected
                        ? "bg-emerald-500"
                        : "bg-muted-foreground/60"
                    )}
                    aria-hidden="true"
                  />
                  {analysis.wound_detected ? "Yes" : "No"}
                </p>
              </div>

              <div className="rounded-lg border bg-muted/25 px-3.5 py-2.5">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Wound Coverage
                </p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                  {analysis.wound_detected &&
                  typeof analysis.wound_coverage === "number"
                    ? `${analysis.wound_coverage.toFixed(2)}%`
                    : "0.00%"}
                </p>
              </div>

              <div className="rounded-lg border bg-muted/25 px-3.5 py-2.5">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Inference Time
                </p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                  {result.inference_ms.toFixed(1)} ms
                </p>
              </div>
            </div>

            {/* Original vs Segmentation Overlay (Side-by-Side on Mobile & Desktop + Tap to Zoom) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Before &amp; After Comparison</span>
                <span className="inline-flex items-center gap-1">
                  <ZoomIn className="size-3" aria-hidden="true" />
                  Tap image to zoom
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <figure className="overflow-hidden rounded-lg border bg-muted/30">
                  {previewUrl ? (
                    <button
                      type="button"
                      onClick={() => setZoomedView("original")}
                      aria-label="Zoom original wound image"
                      className="group relative block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Original uploaded wound photograph"
                        className="h-44 w-full object-contain sm:h-64"
                      />
                      <span className="pointer-events-none absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-80 transition-opacity group-hover:opacity-100">
                        <ZoomIn className="size-3.5" aria-hidden="true" />
                      </span>
                    </button>
                  ) : (
                    <div className="flex h-44 items-center justify-center text-xs text-muted-foreground sm:h-64">
                      No preview available.
                    </div>
                  )}
                  <figcaption className="border-t bg-background px-2.5 py-2 text-[11px] font-medium text-muted-foreground sm:px-3">
                    Original
                  </figcaption>
                </figure>

                <figure className="overflow-hidden rounded-lg border bg-muted/30">
                  {result.overlay ? (
                    <button
                      type="button"
                      onClick={() => setZoomedView("overlay")}
                      aria-label="Zoom segmentation overlay image"
                      className="group relative block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result.overlay}
                        alt="Wound tissue segmentation overlay"
                        className="h-44 w-full object-contain sm:h-64"
                      />
                      <span className="pointer-events-none absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-80 transition-opacity group-hover:opacity-100">
                        <ZoomIn className="size-3.5" aria-hidden="true" />
                      </span>
                    </button>
                  ) : (
                    <div className="flex h-44 items-center justify-center px-2 text-center text-xs text-muted-foreground sm:h-64">
                      Overlay not included.
                    </div>
                  )}
                  <figcaption className="border-t bg-background px-2.5 py-2 text-[11px] font-medium text-muted-foreground sm:px-3">
                    Overlay ({opacityPercent}%)
                  </figcaption>
                </figure>
              </div>
            </div>

            {/* Tissue Composition Breakdown */}
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Tissue Composition Breakdown
                </h3>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {analysis.wound_pixels.toLocaleString()} /{" "}
                  {analysis.total_pixels.toLocaleString()} px
                </span>
              </div>

              {!analysis.wound_detected ? (
                <div className="rounded-lg border border-dashed bg-muted/20 p-5 text-center">
                  <p className="text-sm font-medium text-foreground">
                    No wound tissue detected in this image
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    All {analysis.total_pixels.toLocaleString()} analyzed pixels
                    were classified as background. Try a closer, well-lit crop
                    centered on the wound bed.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Stacked Composition Bar */}
                  <div
                    className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary"
                    role="img"
                    aria-label="Proportional tissue composition bar"
                  >
                    {TISSUE_CLASSES.map((tissue) => {
                      const pct = analysis.tissues[tissue.key]?.percentage ?? 0;
                      if (pct <= 0) return null;
                      return (
                        <div
                          key={tissue.key}
                          style={{
                            width: `${pct}%`,
                            backgroundColor: tissue.color,
                          }}
                          title={`${tissue.label}: ${pct.toFixed(2)}%`}
                        />
                      );
                    })}
                  </div>

                  {/* Per-Class Rows */}
                  <div className="space-y-2.5">
                    {TISSUE_CLASSES.map((tissue) => {
                      const stat = analysis.tissues[tissue.key];
                      const pixels = stat?.pixels ?? 0;
                      const pct = stat?.percentage ?? 0;
                      const clampedPct = Math.max(0, Math.min(100, pct));

                      return (
                        <div key={tissue.key} className="space-y-1">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "size-2.5 shrink-0 rounded-sm",
                                  tissue.darkBorder
                                    ? "ring-1 ring-black/20 dark:ring-white/30"
                                    : "ring-1 ring-black/10 dark:ring-white/15"
                                )}
                                style={{ backgroundColor: tissue.color }}
                                aria-hidden="true"
                              />
                              <span className="font-medium text-foreground">
                                {tissue.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5 font-mono text-[11px]">
                              <span className="text-muted-foreground">
                                {pixels.toLocaleString()} px
                              </span>
                              <span className="w-14 text-right font-semibold text-foreground">
                                {stat?.percentage === null
                                  ? "N/A"
                                  : `${pct.toFixed(2)}%`}
                              </span>
                            </div>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-300",
                                tissue.darkBorder &&
                                  "dark:ring-1 dark:ring-inset dark:ring-white/25"
                              )}
                              style={{
                                width: `${clampedPct}%`,
                                backgroundColor: tissue.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {result.disclaimer && (
              <p className="text-[11px] text-muted-foreground">
                API notice: {result.disclaimer}
              </p>
            )}

            {/* Collapsible Raw JSON Response */}
            <div className="rounded-lg border">
              <button
                type="button"
                aria-expanded={showRawJson}
                onClick={() => setShowRawJson((prev) => !prev)}
                className="flex min-h-[40px] w-full items-center justify-between px-3.5 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>Raw JSON Response</span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform duration-200",
                    showRawJson && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>

              {showRawJson && (
                <div className="border-t p-3 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={showFullBase64}
                        onChange={(e) => setShowFullBase64(e.target.checked)}
                        className="rounded border-input accent-foreground"
                      />
                      <span>Include full base64 overlay string</span>
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleCopyJson()}
                      className="h-7 gap-1.5 px-2 text-[11px]"
                    >
                      {copiedJson ? (
                        <>
                          <Check className="size-3" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" aria-hidden="true" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="max-h-72 overflow-auto rounded-md bg-muted/60 py-3 font-mono text-[11px] leading-relaxed text-foreground">
                    <div className="px-3">{formattedJson}</div>
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Fullscreen Zoom Lightbox */}
      {zoomedView &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              zoomedView === "original"
                ? "Zoomed original wound image"
                : "Zoomed segmentation overlay image"
            }
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setZoomedView(null)}
          >
            <div
              className="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/15 bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2 border-b px-3 py-2.5 sm:px-4">
                <div className="inline-flex items-center gap-1 rounded-md border bg-muted/50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setZoomedView("original")}
                    className={cn(
                      "min-h-[34px] rounded px-3 py-1 text-xs font-medium transition-colors",
                      zoomedView === "original"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Original
                  </button>
                  {result?.overlay && (
                    <button
                      type="button"
                      onClick={() => setZoomedView("overlay")}
                      className={cn(
                        "min-h-[34px] rounded px-3 py-1 text-xs font-medium transition-colors",
                        zoomedView === "overlay"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Overlay ({opacityPercent}%)
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {zoomedView === "overlay" && result?.overlay && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadOverlay}
                      className="h-9 gap-1.5 text-xs"
                    >
                      <Download className="size-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">Download PNG</span>
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={() => setZoomedView(null)}
                    aria-label="Close zoom view"
                    className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center bg-black/90 p-2 sm:p-4">
                {zoomedView === "original" && previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Original uploaded wound photograph (zoomed)"
                    className="max-h-[75vh] w-full object-contain"
                  />
                ) : zoomedView === "overlay" && result?.overlay ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.overlay}
                    alt="Wound tissue segmentation overlay (zoomed)"
                    className="max-h-[75vh] w-full object-contain"
                  />
                ) : null}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
