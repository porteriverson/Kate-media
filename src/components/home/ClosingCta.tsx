import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { site } from "@/content/site";

/* ---------------------------------------------------------------------------
   ClosingCta
   The warm brown band at the bottom of a page. Reused on Home, Work,
   Services and About — pass in whatever wording each page needs.
   --------------------------------------------------------------------------- */

export function ClosingCta({
  eyebrow,
  heading,
  body,
  cta,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  cta: { label: string; href: string };
}) {
  return (
    <Section tone="dark">
      <Reveal>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blush-300">
            {eyebrow}
          </p>
          <h2 className="mt-5 text-3xl leading-[1.15] text-cream sm:text-4xl">{heading}</h2>
          <p className="mt-6 text-base leading-relaxed text-cocoa-100 sm:text-lg">{body}</p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button href={cta.href} variant="onDark" size="lg">
              {cta.label}
              <ArrowRightIcon />
            </Button>
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-cocoa-100 underline-offset-4 transition-colors duration-300 hover:text-cream hover:underline"
            >
              or email {site.email}
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
