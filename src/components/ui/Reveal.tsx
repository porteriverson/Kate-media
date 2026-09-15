"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Reveal
   Fades content up gently the first time it scrolls into view. Deliberately
   subtle — it should read as polish, not as an effect.

   Content is always in the DOM (so it stays accessible and indexable by
   search engines), and the animation is skipped entirely for anyone with
   "reduce motion" turned on, which is handled in globals.css.
   --------------------------------------------------------------------------- */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Stagger in milliseconds — useful for grids of cards. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const show = () => element.classList.add("reveal-visible");

    // If the browser can't observe scrolling, just show the content.
    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
