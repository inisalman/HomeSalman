"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { Transition } from "motion/react";
import React from "react";

const transition: Transition = {
  duration: 2.5,
  ease: [0.175, 0.885, 0.32, 1],
  times: [0, 0.6, 0.6, 1],
  repeat: Infinity,
  repeatType: "mirror",
  repeatDelay: 0.2,
};

function AnalyzingImage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="status"
      aria-label="Analyzing image"
      className={cn("relative isolate shrink-0 overflow-hidden", className)}
      {...props}
    >
      <motion.div
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        animate={{
          clipPath: [
            "inset(0% 0% 0% 0%)",
            "inset(0% 105% 0% 0%)",
            "inset(0% 105% 0% 0%)",
            "inset(0% 0% 0% 0%)",
          ],
        }}
        transition={transition}
        className="absolute inset-0 z-10 bg-[var(--loading-ui-analyzing-image-background,hsl(var(--background)))]"
      >
        <svg
          className="size-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ transform: "translateX(1400%)" }}
        animate={{
          transform: [
            "translateX(1400%)",
            "translateX(-80%)",
            "translateX(-80%)",
            "translateX(1400%)",
          ],
        }}
        transition={transition}
        className="absolute inset-y-0 left-0 z-10 w-[7%] rounded-full bg-current"
      />

      <svg
        className="size-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>

      <span className="sr-only">Analyzing image</span>
    </div>
  );
}

export { AnalyzingImage };
