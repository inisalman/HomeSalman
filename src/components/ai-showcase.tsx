"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AI_CATEGORIES,
  type AIProject,
  type AIProjectCategory,
} from "@/data/ai-projects";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { ArrowUpRight, FlaskConical, Github, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

interface AIShowcaseProps {
  projects: readonly AIProject[];
}

export function AIShowcase({ projects }: AIShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<
    "All" | AIProjectCategory
  >("All");

  const filteredProjects = React.useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const countByCategory = React.useCallback(
    (category: "All" | AIProjectCategory) => {
      if (category === "All") return projects.length;
      return projects.filter((p) => p.category === category).length;
    },
    [projects]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Project Showcase</h2>
        <div
          className="flex flex-wrap gap-1.5"
          role="tablist"
          aria-label="Filter AI projects by category"
        >
          {AI_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            const count = countByCategory(category);
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <span>{category}</span>
                {projects.length > 0 && (
                  <span
                    className={cn(
                      "text-[10px]",
                      isActive ? "text-background/80" : "text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center space-y-3">
            <div className="flex size-11 items-center justify-center rounded-full border bg-muted/50">
              <FlaskConical className="size-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold tracking-tight">
                AI / ML / DL Showcase Coming Soon
              </h3>
              <p className="text-sm text-muted-foreground">
                Currently building and documenting upcoming machine learning
                models, deep learning experiments, and healthcare AI prototypes.
                Projects, notebooks, and interactive demos will appear here
                soon.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <Badge variant="secondary" className="text-[11px]">
                <Sparkles className="mr-1 size-3" />
                In Progress
              </Badge>
              <Badge variant="outline" className="text-[11px]">
                Python
              </Badge>
              <Badge variant="outline" className="text-[11px]">
                Scikit-learn
              </Badge>
              <Badge variant="outline" className="text-[11px]">
                PyTorch
              </Badge>
              <Badge variant="outline" className="text-[11px]">
                LLM Agents
              </Badge>
            </div>
            <div className="pt-2">
              <Link
                href={DATA.contact.social.GitHub.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Github className="size-3.5" />
                  Follow progress on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card className="border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No projects in <span className="font-medium text-foreground">{selectedCategory}</span> yet.
          </p>
        </Card>
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 gap-4",
            filteredProjects.length > 1 && "sm:grid-cols-2"
          )}
        >
          {filteredProjects.map((project, idx) => {
            const isInternal = Boolean(project.href?.startsWith("/"));
            const externalLinks =
              project.links?.filter((item) => !item.href.startsWith("/")) ?? [];
            const specs = [
              project.model ? { label: "Model", value: project.model } : null,
              project.dataset
                ? { label: "Dataset", value: project.dataset }
                : null,
              project.metrics
                ? { label: "Validation", value: project.metrics }
                : null,
            ].filter(
              (item): item is { label: string; value: string } => item !== null
            );

            return (
              <BlurFade key={project.title} delay={0.04 + idx * 0.05}>
                <Card
                  className={cn(
                    "group relative flex h-full flex-col justify-between border p-5 transition-all duration-200 hover:border-foreground/40 hover:shadow-md",
                    project.href && "cursor-pointer"
                  )}
                >
                  <div className="space-y-4">
                    {/* Top Meta Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className="px-2 py-0.5 text-[11px] font-medium"
                        >
                          {project.category}
                        </Badge>
                        {project.status && (
                          <Badge
                            variant="outline"
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium"
                          >
                            {project.status === "Live" && (
                              <span
                                className="size-1.5 rounded-full bg-emerald-500"
                                aria-hidden="true"
                              />
                            )}
                            {project.status}
                          </Badge>
                        )}
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {project.dates}
                      </time>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      {project.href ? (
                        <Link
                          href={project.href}
                          target={isInternal ? undefined : "_blank"}
                          rel={isInternal ? undefined : "noopener noreferrer"}
                          className="inline-flex items-center gap-1.5 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:underline after:absolute after:inset-0 after:z-0 focus-visible:outline-none focus-visible:underline"
                        >
                          <span>{project.title}</span>
                          <ArrowUpRight
                            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                            aria-hidden="true"
                          />
                        </Link>
                      ) : (
                        <h3 className="text-lg font-semibold tracking-tight text-foreground">
                          {project.title}
                        </h3>
                      )}
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {project.description}
                      </p>
                    </div>

                    {/* Model / Dataset / Validation Metrics */}
                    {specs.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 rounded-md border bg-muted/25 p-3 sm:grid-cols-3">
                        {specs.map((spec) => (
                          <div key={spec.label} className="space-y-0.5">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                              {spec.label}
                            </p>
                            <p className="text-xs font-semibold text-foreground">
                              {spec.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack */}
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="px-2 py-0.5 text-[11px] font-normal"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t pt-3.5">
                    {project.href && isInternal ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                        Open Live Demo
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </span>
                    ) : (
                      <span />
                    )}

                    {externalLinks.length > 0 && (
                      <div className="relative z-10 flex flex-wrap items-center gap-1.5">
                        {externalLinks.map((item) => (
                          <Link
                            key={item.type}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-accent"
                          >
                            {item.icon}
                            <span>{item.type}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </BlurFade>
            );
          })}
        </div>
      )}
    </div>
  );
}
