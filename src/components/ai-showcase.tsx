"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
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
import { FlaskConical, Github, Sparkles } from "lucide-react";
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredProjects.map((project, idx) => {
            const extraTags = [
              project.category,
              ...(project.model ? [project.model] : []),
              ...(project.metrics ? [project.metrics] : []),
              ...project.technologies,
            ];

            return (
              <BlurFade key={project.title} delay={0.04 + idx * 0.05}>
                <ProjectCard
                  href={project.href}
                  title={project.title}
                  description={project.description}
                  dates={
                    project.status
                      ? `${project.dates} · ${project.status}`
                      : project.dates
                  }
                  tags={extraTags}
                  image={project.image}
                  images={project.images}
                  video={project.video}
                  links={project.links}
                />
              </BlurFade>
            );
          })}
        </div>
      )}
    </div>
  );
}
