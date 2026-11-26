import { Icons } from "@/components/icons";
import { ArrowUpRight } from "lucide-react";
import React from "react";

export type AIProjectCategory = "AI" | "Machine Learning" | "Deep Learning";

export type AIProjectStatus = "Live" | "Prototype" | "Research" | "In Progress";

export interface AIProjectLink {
  type: string;
  href: string;
  icon: React.ReactNode;
}

export interface AIProject {
  title: string;
  href?: string;
  directLink?: boolean;
  dates: string;
  category: AIProjectCategory;
  status?: AIProjectStatus;
  description: string;
  model?: string;
  dataset?: string;
  metrics?: string;
  technologies: readonly string[];
  links?: readonly AIProjectLink[];
  image?: string;
  images?: readonly string[];
  video?: string;
  preview?: React.ReactNode;
}

export const AI_CATEGORIES: readonly ("All" | AIProjectCategory)[] = [
  "All",
  "AI",
  "Machine Learning",
  "Deep Learning",
] as const;

export const AI_PROJECTS: readonly AIProject[] = [
  {
    title: "WoundVision AI",
    href: "/ai/woundvision",
    directLink: true,
    dates: "2026",
    category: "Deep Learning",
    status: "Live",
    description:
      "V6-TwoStage coarse-to-fine wound localization and 5-class tissue segmentation using Two-Stage U-Net (ResNet18 + ResNet34) on ONNX Runtime (64.04% Clinical-3 Dice, 0% healthy-skin FPR).",
    model: "Two-Stage U-Net (ResNet18 + ResNet34)",
    dataset: "LUTSeg",
    metrics: "Clinical-3 Dice 64.04%",
    technologies: [
      "V6-TwoStage",
      "Two-Stage U-Net",
      "ONNX Runtime",
      "0% Healthy-Skin FPR",
      "FastAPI",
      "Next.js",
    ],
    video: "/woundvision.mp4",
    links: [
      {
        type: "Live Demo",
        href: "/ai/woundvision",
        icon: <ArrowUpRight className="size-3" />,
      },
      {
        type: "GitHub",
        href: "https://github.com/inisalman/woundvision-ai",
        icon: <Icons.github className="size-3" />,
      },
      {
        type: "Hugging Face",
        href: "https://huggingface.co/salmanid/woundvision-ai",
        icon: <Icons.globe className="size-3" />,
      },
    ],
  },
];
