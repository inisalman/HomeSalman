import { Icons } from "@/components/icons";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  WoundVisionDemo,
  WoundVisionStatusBadge,
} from "@/components/woundvision-demo";
import { cn } from "@/lib/utils";
import { TISSUE_CLASSES } from "@/types/woundvision";
import {
  AlertTriangle,
  ArrowLeft,
  Cpu,
  Crop,
  Database,
  ExternalLink,
  Layers,
  ScanSearch,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WoundVision AI (V6-TwoStage)",
  description:
    "WoundVision AI V6-TwoStage: experimental coarse-to-fine wound tissue segmentation powered by Two-Stage U-Net (ResNet18 + ResNet34) and ONNX Runtime with 0% healthy-skin false positive rate.",
  openGraph: {
    title: "WoundVision AI (V6-TwoStage) | Experimental Wound Tissue Segmentation",
    description:
      "Two-Stage U-Net (ResNet18 + ResNet34) coarse-to-fine wound localization and 5-class tissue segmentation on ONNX Runtime (64.04% Clinical-3 Macro Dice, 0% healthy-skin FPR).",
    type: "website",
  },
};

const BLUR_FADE_DELAY = 0.04;

const SUMMARY_BENCHMARKS: readonly {
  metric: string;
  subtitle?: string;
  v5: string;
  v6: string;
  delta: string;
}[] = [
  {
    metric: "Wound Detection Dice (Binary)",
    v5: "81.18%",
    v6: "85.94%",
    delta: "+4.76%",
  },
  {
    metric: "Clinical-3 Macro Dice",
    subtitle: "Slough / Granulation / Necrotic",
    v5: "59.45%",
    v6: "64.04%",
    delta: "+4.59%",
  },
  {
    metric: "Macro Tissue Dice (5 classes)",
    v5: "43.16%",
    v6: "47.04%",
    delta: "+3.88%",
  },
  {
    metric: "Pixel Accuracy",
    v5: "90.54%",
    v6: "92.19%",
    delta: "+1.65%",
  },
];

const PER_CLASS_BENCHMARKS: readonly {
  label: string;
  v5: number;
  v6: number;
  delta: string;
  color: string;
  darkBorder?: boolean;
}[] = [
  {
    label: "Granulation",
    v5: 74.89,
    v6: 78.02,
    delta: "+3.13%",
    color: "#DC2626",
  },
  {
    label: "Necrotic",
    v5: 60.91,
    v6: 65.91,
    delta: "+5.00%",
    color: "#262626",
    darkBorder: true,
  },
  {
    label: "Slough",
    v5: 42.54,
    v6: 48.18,
    delta: "+5.64%",
    color: "#EAB308",
  },
  {
    label: "Epithelial",
    v5: 37.43,
    v6: 43.09,
    delta: "+5.66%",
    color: "#EC4899",
  },
];

const PIPELINE_STAGES = [
  {
    step: "Stage 1",
    title: "Binary Wound Localizer",
    spec: "U-Net ResNet18 · ONNX FP32 54.66 MB · 320×320 + H-Flip TTA",
    description:
      "Detects wound boundaries and rejects healthy skin upfront (0.0% False Positive Rate). When no wound is found, Stage 2 is skipped automatically.",
    icon: ScanSearch,
  },
  {
    step: "ROI Bridge",
    title: "Square ROI Auto-Crop (+18% margin)",
    spec: "Aspect-ratio-preserving bounding box expansion",
    description:
      "Crops a square region around the Stage 1 wound mask so Stage 2 receives 3–5× sharper effective tissue resolution without ratio distortion.",
    icon: Crop,
  },
  {
    step: "Stage 2",
    title: "ROI Tissue Segmenter",
    spec: "U-Net ResNet34 · ONNX FP32 93.22 MB · 320×320",
    description:
      "Classifies 5 wound tissue classes (Epithelial, Slough, Granulation, Necrotic, Other) inside the wound ROI trained with color-preserving augmentation.",
    icon: Layers,
  },
] as const;

export default function WoundVisionPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col space-y-10 pb-20">
      {/* Header & Medical Disclaimer */}
      <section id="woundvision-header" className="space-y-5">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <Link
            href="/ai"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to AI &amp; ML Projects
          </Link>
        </BlurFade>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <BlurFadeText
              delay={BLUR_FADE_DELAY * 2}
              className="text-3xl font-bold tracking-tighter sm:text-5xl/none"
              yOffset={8}
              text="WoundVision AI"
            />
            <BlurFade delay={BLUR_FADE_DELAY * 2.5}>
              <p className="text-base font-medium text-muted-foreground sm:text-lg">
                Experimental Wound Tissue Segmentation · V6-TwoStage
              </p>
            </BlurFade>
          </div>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">
                Two-Stage U-Net (ResNet18 + ResNet34)
              </Badge>
              <Badge variant="secondary">V6-TwoStage</Badge>
              <Badge variant="outline">ONNX Runtime</Badge>
              <Badge variant="outline">0% Healthy-Skin FPR</Badge>
              <WoundVisionStatusBadge />
            </div>
          </BlurFade>
        </div>

        {/* Medical Disclaimer Banner */}
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div
            role="note"
            className="flex items-start gap-3 rounded-lg border border-amber-500/35 bg-amber-500/10 p-3.5 text-xs text-amber-950 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100"
          >
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <p className="leading-relaxed">
              <span className="font-semibold">Research Disclaimer: </span>
              Experimental research prototype. Not clinically validated and not
              intended for diagnosis or clinical decision-making.
            </p>
          </div>
        </BlurFade>
      </section>

      {/* Interactive Demo Workspace */}
      <section id="woundvision-demo">
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <WoundVisionDemo />
        </BlurFade>
      </section>

      <Separator />

      {/* Technical & Engineering Section */}
      <section id="woundvision-engineering" className="space-y-6">
        <BlurFade delay={BLUR_FADE_DELAY * 6}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
              Architecture &amp; Production Engineering
            </h2>
            <p className="text-sm text-muted-foreground">
              Two-Stage Coarse-to-Fine pipeline built for sharper tissue
              resolution, zero healthy-skin false positives, and lean CPU
              inference.
            </p>
          </div>
        </BlurFade>

        {/* Two-Stage Pipeline Card */}
        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <Card className="border">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Layers
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                Two-Stage Coarse-to-Fine Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-5 pt-0">
              <div className="space-y-3">
                {PIPELINE_STAGES.map((stage) => {
                  const Icon = stage.icon;
                  return (
                    <div
                      key={stage.step}
                      className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3.5"
                    >
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                        <Icon
                          className="size-4 text-foreground"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="px-1.5 py-0 text-[10px] font-semibold"
                          >
                            {stage.step}
                          </Badge>
                          <h3 className="text-sm font-semibold text-foreground">
                            {stage.title}
                          </h3>
                        </div>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {stage.spec}
                        </p>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tissue Class Legend */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">
                  Stage 2 Tissue Classes
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {TISSUE_CLASSES.map((tissue) => (
                    <div
                      key={tissue.key}
                      className="flex items-start gap-2.5 rounded-md border bg-background p-2.5"
                    >
                      <span
                        className={cn(
                          "mt-0.5 size-3 shrink-0 rounded-sm",
                          tissue.darkBorder
                            ? "ring-1 ring-black/20 dark:ring-white/30"
                            : "ring-1 ring-black/10 dark:ring-white/15"
                        )}
                        style={{ backgroundColor: tissue.color }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground">
                          {tissue.label}{" "}
                          <span className="font-mono text-[10px] font-normal text-muted-foreground">
                            {tissue.color}
                          </span>
                        </p>
                        <p className="text-[11px] leading-snug text-muted-foreground">
                          {tissue.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Production Footprint Card */}
        <BlurFade delay={BLUR_FADE_DELAY * 8}>
          <Card className="border">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Cpu
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                Production Footprint
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Pure ONNX Runtime inference container with zero PyTorch
                dependency in production.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-0">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-md border bg-muted/25 p-3">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Stage 1 ONNX
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                    54.66 MB
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    ResNet18 FP32
                  </p>
                </div>
                <div className="rounded-md border bg-muted/25 p-3">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Stage 2 ONNX
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                    93.22 MB
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    ResNet34 FP32
                  </p>
                </div>
                <div className="rounded-md border bg-muted/25 p-3">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Peak RAM
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                    ~304 MB
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Both models loaded
                  </p>
                </div>
                <div className="rounded-md border bg-muted/25 p-3">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    PyTorch Parity
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                    100%
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    diff ≤ 0.000024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Evaluation & V5 -> V6 Progress */}
        <BlurFade delay={BLUR_FADE_DELAY * 9}>
          <Card className="border">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <TrendingUp
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    Validation Benchmarks: V5-Augmented → V6-TwoStage
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    LUTSeg validation split (30 images, strict patient-level
                    split).
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  <span>0.0% Normal Skin FPR</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 p-5 pt-1">
              {/* Summary Comparison Table */}
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b bg-muted/40 text-[11px] text-muted-foreground">
                      <th className="px-3.5 py-2.5 font-medium">Metric</th>
                      <th className="px-3 py-2.5 text-right font-medium">
                        V5-Augmented
                      </th>
                      <th className="px-3 py-2.5 text-right font-medium text-foreground">
                        V6-TwoStage
                      </th>
                      <th className="px-3.5 py-2.5 text-right font-medium">
                        Gain
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {SUMMARY_BENCHMARKS.map((row) => (
                      <tr key={row.metric} className="bg-background">
                        <td className="px-3.5 py-2.5">
                          <span className="font-medium text-foreground">
                            {row.metric}
                          </span>
                          {row.subtitle && (
                            <span className="block text-[10px] text-muted-foreground">
                              {row.subtitle}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {row.v5}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-semibold text-foreground">
                          {row.v6}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          {row.delta}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/20">
                      <td className="px-3.5 py-2.5 font-medium text-foreground">
                        Normal Skin False Positive Rate
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                        N/A
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-semibold text-foreground">
                        0.0%
                      </td>
                      <td className="px-3.5 py-2.5 text-right text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        Stage 1 gate
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Per-Class Dice Progression */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-foreground">
                  Per-Class Tissue Dice (V5 → V6)
                </p>
                <div className="space-y-3">
                  {PER_CLASS_BENCHMARKS.map((item) => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "size-2.5 shrink-0 rounded-sm",
                              item.darkBorder
                                ? "ring-1 ring-black/20 dark:ring-white/30"
                                : "ring-1 ring-black/10 dark:ring-white/15"
                            )}
                            style={{ backgroundColor: item.color }}
                            aria-hidden="true"
                          />
                          <span className="font-medium text-foreground">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-muted-foreground">
                            {item.v5.toFixed(2)}%
                          </span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-semibold text-foreground">
                            {item.v6.toFixed(2)}%
                          </span>
                          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                            {item.delta}
                          </span>
                        </div>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            item.darkBorder &&
                              "dark:ring-1 dark:ring-inset dark:ring-white/25"
                          )}
                          style={{
                            width: `${item.v6}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Open-Source Links */}
        <BlurFade delay={BLUR_FADE_DELAY * 10}>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Link
              href="https://github.com/inisalman/woundvision-ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="h-9 gap-2 text-xs">
                <Icons.github className="size-3.5" aria-hidden="true" />
                <span>GitHub Repository</span>
                <ExternalLink className="size-3 opacity-60" aria-hidden="true" />
              </Button>
            </Link>
            <Link
              href="https://huggingface.co/salmanid/woundvision-ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="h-9 gap-2 text-xs">
                <Icons.globe className="size-3.5" aria-hidden="true" />
                <span>Hugging Face Model</span>
                <ExternalLink className="size-3 opacity-60" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </BlurFade>
      </section>

      <Separator />

      {/* Dataset, Attribution & Disclaimer */}
      <section id="woundvision-attribution">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <Card className="border bg-muted/20">
            <CardHeader className="p-5 pb-2.5">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Database
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                Dataset, Attribution &amp; Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 p-5 pt-0 text-xs leading-relaxed text-muted-foreground">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  Primary Tissue Segmentation Dataset (LUTSeg &amp; CO2Wounds)
                </p>
                <p>
                  Trained on{" "}
                  <Link
                    href="https://huggingface.co/datasets/ksanchez84/LUTSeg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                  >
                    LUTSeg
                  </Link>{" "}
                  (
                  <em>
                    LUTSeg: A Longitudinal Multi-Expert Dataset for Ulcer Tissue
                    Segmentation
                  </em>
                  , Eleventh ISIC Skin Image Analysis Workshop @ MICCAI 2026,{" "}
                  <Link
                    href="https://huggingface.co/papers/2608.25866"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                  >
                    Paper
                  </Link>
                  ), licensed under{" "}
                  <Link
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                  >
                    CC BY 4.0
                  </Link>
                  . Source images originate from{" "}
                  <Link
                    href="https://data.mendeley.com/datasets/nkw5gx57hw/1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                  >
                    CO2Wounds
                  </Link>{" "}
                  (
                  <Link
                    href="https://doi.org/10.1016/j.compbiomed.2023.107753"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                  >
                    DOI: 10.1016/j.compbiomed.2023.107753
                  </Link>
                  ).
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  Stage 1 Auxiliary Research Cohorts
                </p>
                <p>
                  Stage 1 wound localization incorporates{" "}
                  <Link
                    href="https://huggingface.co/datasets/praveen202/DFU_Datasets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                  >
                    praveen202/DFU_Datasets
                  </Link>{" "}
                  (FUSeg 2021 &amp; DFUC2022 reference cohorts, for
                  non-commercial research and demonstration) and{" "}
                  <Link
                    href="https://huggingface.co/datasets/rupeshsah/wound"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                  >
                    rupeshsah/wound
                  </Link>{" "}
                  (
                  <span className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
                    normal_*.png
                  </span>{" "}
                  healthy-skin hard negatives, Apache 2.0).
                </p>
              </div>

              <div className="rounded-md border bg-background/70 p-3">
                <p className="font-semibold text-foreground">
                  Medical Disclaimer
                </p>
                <p className="mt-0.5">
                  WoundVision AI is an{" "}
                  <em>experimental research prototype</em>, not a certified
                  medical device, and is not intended for clinical diagnosis,
                  triage, or treatment decision-making. Medical wound imagery is
                  sensitive and should be handled responsibly.
                </p>
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      </section>
    </main>
  );
}
