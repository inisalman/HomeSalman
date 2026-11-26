import { cn } from "@/lib/utils";
import { TISSUE_CLASSES } from "@/types/woundvision";
import React from "react";

export function WoundVisionCardPreview() {
  return (
    <div className="flex h-40 w-full flex-col justify-between border-b bg-muted/40 p-4 text-left">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-medium text-muted-foreground">
          U-Net ResNet34 · ONNX FP32
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-[10px] font-medium text-foreground">
          <span
            className="size-1.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
          Live Demo
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div style={{ width: "44%", backgroundColor: "#DC2626" }} />
          <div style={{ width: "22%", backgroundColor: "#EAB308" }} />
          <div style={{ width: "16%", backgroundColor: "#262626" }} />
          <div style={{ width: "12%", backgroundColor: "#EC4899" }} />
          <div style={{ width: "6%", backgroundColor: "#A855F7" }} />
        </div>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {TISSUE_CLASSES.map((tissue) => (
            <span
              key={tissue.key}
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"
            >
              <span
                className={cn(
                  "size-2 rounded-[2px]",
                  tissue.darkBorder
                    ? "ring-1 ring-black/20 dark:ring-white/30"
                    : "ring-1 ring-black/10 dark:ring-white/15"
                )}
                style={{ backgroundColor: tissue.color }}
                aria-hidden="true"
              />
              {tissue.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
        <span>320×320 · 6 Classes</span>
        <span>~170 ms CPU</span>
      </div>
    </div>
  );
}
