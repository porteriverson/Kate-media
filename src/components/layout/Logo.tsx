import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/* ===========================================================================
   LOGO
   ---------------------------------------------------------------------------
   Two versions of the logo live in /public/images/:

     logo.png        full colour — used on the cream background (header)
     logo-light.png  reversed    — pink + cream, so it reads on the dark
                                   brown footer

   ✏️  TO UPDATE THE LOGO: replace those two files, keeping the same names.
   If the new files are a different shape, update WIDTH and HEIGHT below to
   match so the image doesn't stretch.
   =========================================================================== */

const WIDTH = 900;
const HEIGHT = 408;

export function Logo({
  tone = "light",
  priority = false,
  className,
  imageClassName = "h-14 w-auto sm:h-[4.5rem]",
}: {
  /** "light" for cream backgrounds, "dark" for the brown footer. */
  tone?: "light" | "dark";
  /** Set true for the header logo so it loads immediately. */
  priority?: boolean;
  className?: string;
  /** Controls how big the logo renders. Height only — width follows. */
  imageClassName?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name}, home`}
      className={cn(
        "inline-flex items-center transition-opacity duration-300 hover:opacity-75",
        className,
      )}
    >
      <Image
        src={tone === "dark" ? "/images/logo-light.png" : "/images/logo.png"}
        /* The link above is already labelled, so the image itself is
           decorative — this avoids screen readers reading the name twice. */
        alt=""
        width={WIDTH}
        height={HEIGHT}
        priority={priority}
        className={imageClassName}
      />
    </Link>
  );
}
