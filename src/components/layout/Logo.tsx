import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/* ===========================================================================
   LOGO
   ---------------------------------------------------------------------------
   Right now this renders a typographic wordmark ("Kate Iverson" in the serif
   heading font, "social media" underneath).

   ✏️  TO USE THE REAL LOGO FILE:
     1. Drop the file into /public/images/  (e.g. /public/images/logo.svg)
     2. Set USE_LOGO_IMAGE to true below
     3. Update LOGO_SRC, LOGO_WIDTH and LOGO_HEIGHT to match the real file
   =========================================================================== */

const USE_LOGO_IMAGE = false; // TODO: flip to true once the logo file is added
const LOGO_SRC = "/images/logo.svg";
const LOGO_WIDTH = 180;
const LOGO_HEIGHT = 48;

export function Logo({
  tone = "light",
  className,
}: {
  /** "light" for use on cream backgrounds, "dark" for the brown footer. */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      {USE_LOGO_IMAGE ? (
        <Image
          src={LOGO_SRC}
          alt={site.name}
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority
          className="h-10 w-auto"
        />
      ) : (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-heading text-xl tracking-tight transition-colors duration-300",
              tone === "dark" ? "text-cream" : "text-ink group-hover:text-cocoa-600",
            )}
          >
            Kate Iverson
          </span>
          <span
            className={cn(
              "mt-1 text-[0.625rem] font-medium uppercase tracking-[0.3em]",
              tone === "dark" ? "text-blush-300" : "text-blush-600",
            )}
          >
            Social Media
          </span>
        </span>
      )}
    </Link>
  );
}
