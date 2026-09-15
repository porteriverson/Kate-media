import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PackageCard } from "@/components/services/PackageCard";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { packages } from "@/content/services";
import { servicesPreview } from "@/content/home";

/* ---------------------------------------------------------------------------
   ServicesPreview
   Short package cards on the home page. Pulls straight from
   src/content/services.ts, so prices only ever need updating in one place.
   --------------------------------------------------------------------------- */

export function ServicesPreview() {
  return (
    <Section tone="ivory">
      <SectionHeading
        eyebrow={servicesPreview.eyebrow}
        heading={servicesPreview.heading}
        body={servicesPreview.body}
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {packages.map((pkg, index) => (
          <Reveal key={pkg.id} delay={index * 90} className="h-full">
            <PackageCard pkg={pkg} variant="preview" />
          </Reveal>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button href={servicesPreview.cta.href} variant="ghost">
          {servicesPreview.cta.label}
          <ArrowRightIcon />
        </Button>
      </div>
    </Section>
  );
}
