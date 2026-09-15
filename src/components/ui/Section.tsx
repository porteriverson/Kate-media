import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Section
   Wraps each block of the page with consistent vertical spacing and a
   centered, max-width container. Keeps the generous white space consistent
   everywhere without repeating the same padding classes.

   `tone` sets the background: "cream" (default), "ivory" (subtle alternate),
   or "dark" (warm brown band, used for the closing CTAs).
   --------------------------------------------------------------------------- */

type SectionProps = {
  children: React.ReactNode;
  id?: string;
  tone?: "cream" | "ivory" | "dark";
  className?: string;
  /** Tightens the top/bottom padding for smaller blocks. */
  compact?: boolean;
};

const tones = {
  cream: "bg-cream text-ink",
  ivory: "bg-ivory text-ink",
  dark: "bg-cocoa-700 text-cream",
};

export function Section({
  children,
  id,
  tone = "cream",
  className,
  compact = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(tones[tone], compact ? "py-14 sm:py-16" : "py-20 sm:py-24 lg:py-28", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">{children}</div>
    </section>
  );
}
