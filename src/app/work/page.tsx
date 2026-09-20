import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkGallery } from "@/components/work/WorkGallery";
import { ClosingCta } from "@/components/home/ClosingCta";
import { buildMetadata } from "@/lib/seo";

/* ---------------------------------------------------------------------------
   WORK / PORTFOLIO PAGE
   The gallery builds itself from src/content/portfolio.ts — that's the only
   file to edit when adding videos.
   --------------------------------------------------------------------------- */

export const metadata = buildMetadata({
  title: "My Work",
  description:
    "A portfolio of short-form video work by Kate Iverson: Instagram Reels and brand videos made for brands in travel, jewelry, food, fitness and lifestyle.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <Section compact>
        <SectionHeading
          as="h1"
          eyebrow="Portfolio"
          heading="A look at recent work"
          body="A mix of what I make most: brand videos, product stories and founder-led content. Filter by industry, or just start tapping."
        />
      </Section>

      <Section tone="ivory" className="pt-4 sm:pt-6">
        <WorkGallery />
      </Section>

      <ClosingCta
        eyebrow="Your turn"
        heading="Want content like this for your brand?"
        body="Tell me what you're working on and I'll show you what the first month could look like."
        cta={{ label: "Get in touch", href: "/contact" }}
      />
    </>
  );
}
