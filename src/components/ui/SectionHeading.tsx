import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   SectionHeading
   The small pink eyebrow + heading + supporting paragraph used at the top of
   most sections. Keeps the heading hierarchy and rhythm consistent.
   --------------------------------------------------------------------------- */

type SectionHeadingProps = {
  eyebrow?: string;
  heading: string;
  body?: string;
  /** "center" is used on full-width sections, "left" inside split layouts. */
  align?: "left" | "center";
  /** Use h1 on the main heading of a page, h2 everywhere else. */
  as?: "h1" | "h2";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  heading,
  body,
  align = "center",
  as: Tag = "h2",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.22em]",
            tone === "dark" ? "text-blush-300" : "text-blush-600",
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <Tag
        className={cn(
          Tag === "h1"
            ? "text-4xl leading-[1.1] sm:text-5xl lg:text-[3.5rem]"
            : "text-3xl leading-[1.15] sm:text-4xl",
          tone === "dark" ? "text-cream" : "text-ink",
        )}
      >
        {heading}
      </Tag>

      {body ? (
        <p
          className={cn(
            "text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-cocoa-100" : "text-cocoa-500",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}
