import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PackageCard } from "@/components/services/PackageCard";
import { ClosingCta } from "@/components/home/ClosingCta";
import { CheckIcon, ArrowRightIcon } from "@/components/icons/Icons";
import { addOns, customPackage, includedInEvery, packages, servicesIntro } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

/* ---------------------------------------------------------------------------
   SERVICES / PACKAGES PAGE
   Every price, package name and bullet point on this page comes from
   src/content/services.ts. Nothing here needs editing to change pricing.
   --------------------------------------------------------------------------- */

export const metadata = buildMetadata({
  title: "Services & Packages",
  description:
    "Monthly social media management packages from Kate Iverson — short-form video production, content strategy, posting, community management and analytics reporting.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Section compact>
        <SectionHeading
          as="h1"
          eyebrow={servicesIntro.eyebrow}
          heading={servicesIntro.heading}
          body={servicesIntro.body}
        />
      </Section>

      {/* Package comparison cards */}
      <Section tone="ivory" className="pt-4 sm:pt-6">
        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {packages.map((pkg, index) => (
            <Reveal key={pkg.id} delay={index * 90} className="h-full">
              <PackageCard pkg={pkg} />
            </Reveal>
          ))}
        </div>

        {/* What every package includes */}
        <Reveal>
          <div className="mt-16 rounded-3xl border border-cocoa-100 bg-cream p-8 sm:p-10">
            <h2 className="font-heading text-xl text-ink">Every package includes</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {includedInEvery.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blush-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>

      {/* Add-ons — delete the `addOns` array in services.ts to remove this. */}
      {addOns.length > 0 ? (
        <Section compact>
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center font-heading text-2xl text-ink">Add-ons</h2>
              <p className="mt-3 text-center text-cocoa-500">
                Available alongside any package, or on their own.
              </p>
              <ul className="mt-8 divide-y divide-cocoa-100 border-y border-cocoa-100">
                {addOns.map((addOn) => (
                  <li
                    key={addOn.name}
                    className="flex items-baseline justify-between gap-6 py-4 text-sm"
                  >
                    <span className="text-ink">{addOn.name}</span>
                    <span className="shrink-0 font-medium text-cocoa-600">{addOn.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Section>
      ) : null}

      {/* Custom package note */}
      <Section tone="ivory" compact>
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-blush-200 bg-blush-50 px-8 py-12 text-center">
            <h2 className="font-heading text-2xl text-ink sm:text-3xl">{customPackage.heading}</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-cocoa-500">{customPackage.body}</p>
            <Button href={customPackage.cta.href} size="lg" className="mt-8">
              {customPackage.cta.label}
              <ArrowRightIcon />
            </Button>
          </div>
        </Reveal>
      </Section>

      <ClosingCta
        eyebrow="Next step"
        heading="Not sure which package fits?"
        body="Send me a quick note about your brand and where you're at. I'll tell you honestly which one makes sense — or if you don't need one at all yet."
        cta={{ label: "Ask me anything", href: "/contact" }}
      />
    </>
  );
}
