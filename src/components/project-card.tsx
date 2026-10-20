"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { createPortal } from "react-dom";
import Markdown from "react-markdown";

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  images?: readonly string[];
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  images,
  video,
  links,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [slide, setSlide] = React.useState(0);

  const hasGallery = Boolean(images && images.length > 0);
  const coverImage = hasGallery ? images![0] : image;

  const goPrev = React.useCallback(() => {
    if (!images || images.length === 0) return;
    setSlide((s) => (s - 1 + images.length) % images.length);
  }, [images]);

  const goNext = React.useCallback(() => {
    if (!images || images.length === 0) return;
    setSlide((s) => (s + 1) % images.length);
  }, [images]);

  // reset slide & handle keyboard nav when modal opens
  React.useEffect(() => {
    if (!open) return;
    setSlide(0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext]);

  return (
    <>
      <Card
        className={
          "flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full"
        }
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open ${title} details`}
          className={cn("block w-full cursor-pointer", className)}
        >
          {video && (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="pointer-events-none mx-auto h-40 w-full object-cover object-top" // needed because random black line at bottom of video
            />
          )}
          {!video && coverImage && (
            <div className="relative">
              <Image
                src={coverImage}
                alt={title}
                width={500}
                height={300}
                className="h-40 w-full overflow-hidden object-cover object-top"
              />
              {hasGallery && (
                <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
                  {images!.length} photos
                </span>
              )}
            </div>
          )}
        </button>
        <CardHeader className="px-2">
          <div className="space-y-1">
            <CardTitle className="mt-1 text-base">{title}</CardTitle>
            <time className="font-sans text-xs">{dates}</time>
            <div className="hidden font-sans text-xs underline print:visible">
              {link
                ?.replace("https://", "")
                .replace("www.", "")
                .replace("/", "")}
            </div>
            <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
              {description}
            </Markdown>
          </div>
        </CardHeader>
        <CardContent className="mt-auto flex flex-col px-2">
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags?.map((tag) => (
                <Badge
                  className="px-1 py-0 text-[10px]"
                  variant="secondary"
                  key={tag}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="px-2 pb-2">
          {links && links.length > 0 && (
            <div className="flex flex-row flex-wrap items-start gap-1">
              {links?.map((link, idx) => (
                <Link href={link?.href} key={idx} target="_blank">
                  <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                    {link.icon}
                    {link.type}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardFooter>
      </Card>

      {open &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key="project-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ willChange: "opacity", WebkitBackdropFilter: "blur(4px)" }}
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transform-gpu"
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ willChange: "transform, opacity" }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl transform-gpu"
              >
              <Card className="overflow-hidden shadow-xl">
                {video && (
                  <video
                    src={video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="max-h-[60vh] w-full bg-black object-contain"
                  />
                )}
                {!video && hasGallery && (
                  <div className="relative bg-black">
                    <Image
                      src={images![slide]}
                      alt={`${title} — ${slide + 1}`}
                      width={800}
                      height={450}
                      className="max-h-[60vh] w-full object-contain"
                    />
                    {images!.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={goPrev}
                          aria-label="Previous image"
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
                        >
                          <ChevronLeftIcon className="size-5" />
                        </button>
                        <button
                          type="button"
                          onClick={goNext}
                          aria-label="Next image"
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
                        >
                          <ChevronRightIcon className="size-5" />
                        </button>
                        <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white">
                          {slide + 1} / {images!.length}
                        </span>
                        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                          {images!.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSlide(idx)}
                              aria-label={`Go to image ${idx + 1}`}
                              className={cn(
                                "size-1.5 rounded-full transition-all",
                                idx === slide
                                  ? "w-4 bg-white"
                                  : "bg-white/50 hover:bg-white/80"
                              )}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                {!video && !hasGallery && image && (
                  <Image
                    src={image}
                    alt={title}
                    width={800}
                    height={450}
                    className="max-h-[60vh] w-full object-contain"
                  />
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold leading-tight">
                        {title}
                      </h3>
                      <time className="font-sans text-xs text-muted-foreground">
                        {dates}
                      </time>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Close"
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>

                  {description && (
                    <Markdown className="prose mt-3 max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
                      {description}
                    </Markdown>
                  )}

                  {tags && tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <Badge
                          className="px-1 py-0 text-[10px]"
                          variant="secondary"
                          key={tag}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {links && links.length > 0 && (
                    <div className="mt-5 flex flex-row flex-wrap items-center gap-2">
                      {links.map((l, idx) => (
                        <Link
                          href={l.href}
                          key={idx}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" className="gap-1.5">
                            {l.icon}
                            {l.type}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
