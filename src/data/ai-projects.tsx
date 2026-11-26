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
    dates: "2026",
    category: "Deep Learning",
    status: "Live",
    description:
      "Experimental 5-class wound tissue segmentation (epithelial, slough, granulation, necrotic, other) using U-Net ResNet34 exported to ONNX Runtime (~170 ms CPU inference).",
    model: "U-Net ResNet34",
    dataset: "LUTSeg",
    metrics: "Clinical-3 Dice 59.45%",
    technologies: ["ONNX Runtime", "PyTorch", "FastAPI", "Next.js"],
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
