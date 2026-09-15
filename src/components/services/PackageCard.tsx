import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/icons/Icons";
import type { Package } from "@/content/services";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   PackageCard
   One pricing tier. Used at full size on the Services page and in a shorter
   "preview" form on the home page.

   Everything it displays comes from src/content/services.ts.
   --------------------------------------------------------------------------- */

export function PackageCard({
  pkg,
  variant = "full",
}: {
  pkg: Package;
  /** "preview" trims the bullet list down for the home page. */
  variant?: "full" | "preview";
}) {
  const isPreview = variant === "preview";
  const bullets = isPreview ? pkg.includes.slice(0, 3) : pkg.includes;
  const hiddenCount = pkg.includes.length - bullets.length;

  return (
    <div
      id={pkg.id}
      className={cn(
        "flex h-full flex-col rounded-3xl border p-8 transition duration-500 ease-gentle hover:-translate-y-1 hover:shadow-lg",
        pkg.highlighted
          ? "border-blush-300 bg-blush-50 shadow-md"
          : "border-cocoa-100 bg-cream shadow-sm",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-2xl text-ink">{pkg.name}</h3>
        {pkg.highlighted ? (
          <span className="shrink-0 rounded-full bg-blush-300 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-cocoa-800">
            Most popular
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-cocoa-500">{pkg.bestFor}</p>

      {/* TODO: real pricing lives in src/content/services.ts */}
      <p className="mt-7 flex items-baseline gap-2">
        <span className="font-heading text-4xl text-ink">{pkg.price}</span>
        <span className="text-sm text-cocoa-400">{pkg.priceNote}</span>
      </p>

      <ul className="mt-7 flex flex-1 flex-col gap-3.5">
        {bullets.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blush-500" />
            <span>{item}</span>
          </li>
        ))}
        {hiddenCount > 0 ? (
          <li className="text-sm italic text-cocoa-400">+ {hiddenCount} more</li>
        ) : null}
      </ul>

      <Button
        href={`/contact?package=${pkg.id}`}
        variant={pkg.highlighted ? "primary" : "secondary"}
        size="lg"
        className="mt-8 w-full"
      >
        {isPreview ? "Learn more" : `Enquire about ${pkg.name}`}
      </Button>
    </div>
  );
}
