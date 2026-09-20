import { SocialIcon } from "@/components/icons/Icons";
import { socialLinks } from "@/content/site";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   SocialLinks
   The row of social icons. Edit the links themselves
   in src/content/site.ts.
   --------------------------------------------------------------------------- */

export function SocialLinks({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {socialLinks.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label} (opens in a new tab)`}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition duration-300 hover:-translate-y-0.5",
              tone === "dark"
                ? "border-cocoa-600 text-cream hover:border-blush-300 hover:text-blush-300"
                : "border-cocoa-200 text-cocoa-600 hover:border-blush-300 hover:bg-blush-50 hover:text-blush-600",
            )}
          >
            <SocialIcon name={link.icon} className="h-[18px] w-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
