"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { XIcon, ChevronRightIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { createPortal } from "react-dom";

interface TrainingModalProps {
  logoUrl: string;
  school: string;
  degree?: string;
  period: string;
  description?: string;
  href?: string;
  renderUrl?: string;
}

export const TrainingModal = ({
  logoUrl,
  school,
  degree,
  period,
  description,
  href,
  renderUrl,
}: TrainingModalProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-pointer text-left"
      >
        <Card className="flex">
          <div className="flex-none">
            <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
              <AvatarImage
                src={logoUrl}
                alt={school}
                className="object-contain"
              />
              <AvatarFallback>{school[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow ml-4 items-center flex-col group">
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                  {school}
                  <ChevronRightIcon className="size-4 translate-x-0 transform transition-all duration-300 ease-out group-hover:translate-x-1" />
                </h3>
                <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                  {period}
                </div>
              </div>
              {degree && <div className="font-sans text-xs">{degree}</div>}
            </CardHeader>
          </div>
        </Card>
      </button>

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
                <Card className="p-6 shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="border size-12 bg-muted-background dark:bg-foreground">
                        <AvatarImage
                          src={logoUrl}
                          alt={school}
                          className="object-contain"
                        />
                        <AvatarFallback>{school[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-sm leading-tight">
                          {school}
                        </h3>
                        <div className="text-xs text-muted-foreground">
                          {period}
                        </div>
                      </div>
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

                  {degree && (
                    <div className="mt-5">
                      <Badge
                        variant="secondary"
                        className="align-middle text-xs"
                      >
                        Certification
                      </Badge>
                      <h4 className="mt-2 text-base font-semibold leading-snug">
                        {degree}
                      </h4>
                    </div>
                  )}

                  {description && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {description}
                    </p>
                  )}

                  {renderUrl && (
                    <div className="mt-5">
                      <img
                        src={renderUrl}
                        alt={`${degree || school} certificate`}
                        className="w-full h-auto rounded-lg border shadow-sm"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {href && (
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      View certificate
                      <ExternalLinkIcon className="size-3" />
                    </Link>
                  )}
                </Card>
              </motion.div>
            </motion.div>,
            document.body
          )}
    </>
  );
};