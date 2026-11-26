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
  Database,
  ExternalLink,
  Layers,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WoundVision AI",
  description:
    "Experimental wound tissue segmentation powered by U-Net ResNet34 and ONNX Runtime. Interactive demo analyzing epithelial, slough, granulation, necrotic, and other wound tissues.",
  openGraph: {
    title: "WoundVision AI | Experimental Wound Tissue Segmentation",
    description:
      "Interactive deep learning demo for 5-class wound tissue segmentation using U-Net ResNet34 exported to ONNX Runtime (~170 ms CPU inference).",
    type: "website",
  },
};

const BLUR_FADE_DELAY = 0.04;

const VALIDATION_METRICS: readonly {
  label: string;
  value: number;
  color: string;
  darkBorder?: boolean;
}[] = [
  {
    label: "Granulation Dice",
    value: 74.89,
    color: "#DC2626",
  },
  {
    label: "Necrotic Dice",
    value: 60.91,
    color: "#262626",
    darkBorder: true,
  },
  {
    label: "Slough Dice",
    value: 42.54,
    color: "#EAB308",
  },
];

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
                Experimental Wound Tissue Segmentation
              </p>
            </BlurFade>
          </div>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">U-Net ResNet34</Badge>
              <Badge variant="secondary">V5-Augmented</Badge>
              <Badge variant="outline">ONNX Runtime</Badge>
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
              Technical &amp; Engineering Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Architecture, patient-level validation benchmarks on LUTSeg, and
              lightweight CPU inference optimization.
            </p>
          </div>
        </BlurFade>

        {/* Architecture */}
        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <Card className="border">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Layers className="size-4 text-muted-foreground" aria-hidden="true" />
                Model Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5 pt-0">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-md border bg-muted/25 p-3">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Backbone
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    U-Net + ResNet34
                  </p>
                </div>
                <div className="rounded-md border bg-muted/25 p-3">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Output Classes
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    6 Classes (BG + 5 Tissues)
                  </p>
                </div>
                <div className="rounded-md border bg-muted/25 p-3">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Input Resolution
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                    320 × 320 px
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">
                  Segmented Tissue Classes
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

        {/* Validation Evaluation & Production Optimization */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BlurFade delay={BLUR_FADE_DELAY * 8}>
            <Card className="h-full border">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-semibold">
                  Validation Metrics (LUTSeg)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Evaluated with strict patient-level split to prevent data
                  leakage.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-1">
                <div className="rounded-lg border bg-muted/30 p-3.5">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Clinical-3 Macro Dice
                  </p>
                  <p className="mt-0.5 font-mono text-2xl font-bold tracking-tight text-foreground">
                    59.45%
                  </p>
                </div>

                <div className="space-y-3">
                  {VALIDATION_METRICS.map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">
                          {metric.label}
                        </span>
                        <span className="font-mono font-semibold text-foreground">
                          {metric.value.toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            metric.darkBorder &&
                              "dark:ring-1 dark:ring-inset dark:ring-white/25"
                          )}
                          style={{
                            width: `${metric.value}%`,
                            backgroundColor: metric.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <Card className="h-full border">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Cpu className="size-4 text-muted-foreground" aria-hidden="true" />
                  Production Optimization
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Exported for lean CPU-only deployment with no PyTorch runtime
                  in production.
                </p>
              </CardHeader>
              <CardContent className="space-y-3 p-5 pt-1">
                <div className="rounded-md border bg-muted/25 p-3">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Model Footprint (PyTorch to ONNX FP32)
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                    280 MB → 93.22 MB
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    100% pixel parity (max_logit_diff = 0.000027)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-md border bg-muted/25 p-3">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      CPU Latency
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                      ~170 ms/img
                    </p>
                  </div>
                  <div className="rounded-md border bg-muted/25 p-3">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Peak RAM
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                      ~272 MB
                    </p>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Running ONNX Runtime directly keeps the FastAPI container
                  compact and responsive on modest CPU instances without PyTorch
                  overhead.
                </p>
              </CardContent>
            </Card>
          </BlurFade>
        </div>

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

      {/* Dataset & Attribution */}
      <section id="woundvision-attribution">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <Card className="border bg-muted/20">
            <CardHeader className="p-5 pb-2.5">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Database
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                Dataset &amp; Attribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-0 text-xs leading-relaxed text-muted-foreground">
              <p>
                Model ini dilatih menggunakan dataset{" "}
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
                , Eleventh ISIC Skin Image Analysis Workshop @ MICCAI 2026),
                yang menggunakan citra sumber dari CO2Wounds (
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
              <p>
                Dataset dilisensikan di bawah{" "}
                <Link
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                >
                  CC BY 4.0
                </Link>
                . Citra medis bersifat sensitif dan model ini hanya untuk
                prototipe riset, bukan perangkat medis atau dasar keputusan
                klinis.
              </p>
              <div className="pt-1">
                <Link
                  href="https://huggingface.co/datasets/ksanchez84/LUTSeg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                >
                  <span>huggingface.co/datasets/ksanchez84/LUTSeg</span>
                  <ExternalLink className="size-3 opacity-70" aria-hidden="true" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      </section>
    </main>
  );
}
