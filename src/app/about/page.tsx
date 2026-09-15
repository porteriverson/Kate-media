import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Headshot } from "@/components/about/Headshot";
import { ClosingCta } from "@/components/home/ClosingCta";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { aboutIntro, approach, personal, qualifications, stats, story } from "@/content/about";
import { buildMetadata } from "@/lib/seo";

/* ---------------------------------------------------------------------------
   ABOUT / QUALIFICATIONS PAGE
   All copy lives in src/content/about.ts.
   --------------------------------------------------------------------------- */

export const metadata = buildMetadata({
  title: "About Kate",
  description:
    "Kate Iverson holds a degree in Public Relations and Strategic Communication from Utah Valley University, with hands-on social media and content experience across the travel and jewelry industries.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      {/* Intro + headshot */}
      <Section>
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blush-600">
              {aboutIntro.eyebrow}
            </p>
            <h1 className="mt-6 text-4xl leading-[1.1] text-ink sm:text-5xl">
              {aboutIntro.heading}
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-cocoa-500">{aboutIntro.lede}</p>
          </div>

          <div className="md:col-span-5 md:pl-6">
            <Headshot />
          </div>
        </div>
      </Section>

      {/* Her story */}
      <Section tone="ivory">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <h2 className="text-3xl leading-[1.15] text-ink">How I got here</h2>
            </div>
            <div className="flex flex-col gap-6 md:col-span-8">
              {story.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="leading-relaxed text-cocoa-500">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Results — TODO: real numbers go in src/content/about.ts */}
      <Section compact>
        <Reveal>
          <dl className="grid grid-cols-2 gap-8 sm:gap-6 lg:grid-cols-4">
            {stats.map((stat) => (
              // flex-col-reverse shows the number above its label while keeping
              // the definition-list order (term then description) valid.
              <div
                key={stat.label}
                className="flex flex-col-reverse items-center gap-2 text-center sm:items-start sm:text-left"
              >
                <dt className="text-sm leading-relaxed text-cocoa-500">{stat.label}</dt>
                <dd className="font-heading text-4xl text-blush-600 sm:text-5xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* How I work */}
      <Section tone="ivory">
        <Reveal>
          <h2 className="text-3xl leading-[1.15] text-ink">{approach.heading}</h2>
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {approach.principles.map((principle, index) => (
              <div key={principle.title} className="border-t border-cocoa-200 pt-6">
                <span className="font-heading text-sm text-blush-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-xl text-ink">{principle.title}</h3>
                <p className="mt-3 leading-relaxed text-cocoa-500">{principle.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Qualifications & experience */}
      <Section>
        <Reveal>
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <h2 className="text-3xl leading-[1.15] text-ink">Qualifications &amp; experience</h2>
              <p className="mt-5 leading-relaxed text-cocoa-500">
                A strategic communication background, applied to content across very different
                industries.
              </p>
            </div>

            <ul className="flex flex-col md:col-span-8">
              {qualifications.map((item) => (
                <li key={item.title} className="border-t border-cocoa-100 py-6 first:border-t-0 first:pt-0">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blush-600">
                    {item.meta}
                  </span>
                  <h3 className="mt-2 font-heading text-xl text-ink">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-cocoa-500">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>

      {/* Personal blurb */}
      <Section tone="ivory" compact>
        <Reveal>
          <div className="mx-auto max-w-2xl rounded-3xl border border-blush-200 bg-blush-50 px-8 py-10 text-center">
            <h2 className="font-heading text-2xl text-ink">{personal.heading}</h2>
            <p className="mt-4 leading-relaxed text-cocoa-500">{personal.body}</p>
            <Button href="/work" variant="ghost" className="mt-7">
              See what I&apos;ve been making
              <ArrowRightIcon />
            </Button>
          </div>
        </Reveal>
      </Section>

      <ClosingCta
        eyebrow="Say hello"
        heading="I'd love to hear about your brand"
        body="Whether you're ready to hand social off completely or just figuring out where to start, send me a message and let's talk it through."
        cta={{ label: "Get in touch", href: "/contact" }}
      />
    </>
  );
}
