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

/**
 * Add AI / ML / DL showcase projects here.
 *
 * Example:
 * {
 *   title: "Clinical Risk Predictor",
 *   href: "https://github.com/inisalman/clinical-risk-predictor",
 *   dates: "2026",
 *   category: "Machine Learning",
 *   status: "Prototype",
 *   description:
 *     "Tabular classification model predicting patient readmission risk with SHAP explainability.",
 *   model: "XGBoost + SHAP",
 *   metrics: "ROC-AUC 0.91",
 *   technologies: ["Python", "Scikit-learn", "XGBoost", "Pandas", "Streamlit"],
 *   links: [
 *     {
 *       type: "Source",
 *       href: "https://github.com/inisalman/clinical-risk-predictor",
 *       icon: <Icons.github className="size-3" />,
 *     },
 *   ],
 *   image: "/ai/clinical-risk.webp",
 * }
 */
export const AI_PROJECTS: readonly AIProject[] = [];
