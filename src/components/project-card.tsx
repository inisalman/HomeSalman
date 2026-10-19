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
import { motion } from "framer-motion";
import { XIcon } from "lucide-react";
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
  video,
  links,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);

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
          {image && (
            <Image
              src={image}
              alt={title}
              width={500}
              height={300}
              className="h-40 w-full overflow-hidden object-cover object-top"
            />
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
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
                {!video && image && (
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
          </motion.div>,
          document.body
        )}
    </>
  );
}
