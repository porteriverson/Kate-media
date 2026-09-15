import { Button } from "@/components/ui/Button";
import { Highlighted } from "@/components/ui/Highlighted";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { hero, heroProof } from "@/content/home";

/* ---------------------------------------------------------------------------
   Hero
   The first thing visitors see. Copy lives in src/content/home.ts.
   --------------------------------------------------------------------------- */

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft decorative wash — purely visual, hidden from screen readers. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-blush-100 blur-3xl" />
        <div className="absolute -left-40 top-40 h-80 w-80 rounded-full bg-cocoa-50 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center animate-rise">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blush-600">
            {hero.eyebrow}
          </p>

          <h1 className="mt-6 font-heading text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
            <Highlighted text={hero.headline} />
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-cocoa-500 sm:text-lg">
            {hero.subhead}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
              <ArrowRightIcon />
            </Button>
            <Button href={hero.secondaryCta.href} variant="secondary" size="lg">
              {hero.secondaryCta.label}
            </Button>
          </div>

          <p className="mt-10 text-sm text-cocoa-400">{heroProof}</p>
        </div>
      </div>
    </section>
  );
}
