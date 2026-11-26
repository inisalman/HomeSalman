import { AIShowcase } from "@/components/ai-showcase";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { TrainingModal } from "@/components/training-modal";
import { AI_PROJECTS } from "@/data/ai-projects";
import { DATA } from "@/data/resume";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI & ML Projects",
  description:
    "Artificial Intelligence, Machine Learning, and Deep Learning projects, experiments, and research by Salman Al Farisi.",
};

const BLUR_FADE_DELAY = 0.04;

const AI_TRAINING_KEYWORDS = ["machine learning", "python", "ai"];

export default function AIPage() {
  const aiTrainings = DATA.training.filter((item) =>
    AI_TRAINING_KEYWORDS.some((kw) => item.degree.toLowerCase().includes(kw))
  );

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10 pb-12">
      <section id="ai-hero" className="space-y-6">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to Home
          </Link>
        </BlurFade>

        <div className="space-y-3">
          <BlurFadeText
            delay={BLUR_FADE_DELAY * 2}
            className="text-3xl font-bold tracking-tighter sm:text-5xl/none"
            yOffset={8}
            text="AI & ML Projects"
          />
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <p className="max-w-[600px] text-sm text-muted-foreground sm:text-base">
              A dedicated space for my experiments, models, and applied AI
              projects — combining clinical healthcare experience with machine
              learning, deep learning, and intelligent agents.
            </p>
          </BlurFade>
        </div>
      </section>

      <section id="ai-projects">
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <AIShowcase projects={AI_PROJECTS} />
        </BlurFade>
      </section>

      {aiTrainings.length > 0 && (
        <section id="ai-foundations">
          <div className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
              <h2 className="text-xl font-bold">
                AI &amp; ML Certifications
              </h2>
            </BlurFade>
            {aiTrainings.map((training, id) => (
              <BlurFade
                key={training.school + training.degree}
                delay={BLUR_FADE_DELAY * 7 + id * 0.05}
              >
                <TrainingModal
                  logoUrl={training.logoUrl}
                  school={training.school}
                  degree={training.degree}
                  period={
                    training.end
                      ? `${training.start} - ${training.end}`
                      : training.start
                  }
                  description={training.description}
                  href={training.href}
                  renderUrl={training.renderUrl}
                />
              </BlurFade>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
