import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { intro } from "@/content/home";

/* ---------------------------------------------------------------------------
   IntroBlurb
   The short "who I am" block on the home page. Copy: src/content/home.ts.
   --------------------------------------------------------------------------- */

export function IntroBlurb() {
  return (
    <Section tone="ivory">
      <Reveal>
        <div className="grid gap-10 md:grid-cols-12 md:items-start md:gap-16">
          <div className="md:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blush-600">
              {intro.eyebrow}
            </p>
            <h2 className="mt-5 text-3xl leading-[1.15] text-ink sm:text-4xl">{intro.heading}</h2>
          </div>

          <div className="md:col-span-7">
            <div className="flex flex-col gap-5">
              {intro.body.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-cocoa-500 sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
            <Button href={intro.cta.href} variant="ghost" className="mt-7">
              {intro.cta.label}
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
