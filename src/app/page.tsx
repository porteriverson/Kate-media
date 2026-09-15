import { Hero } from "@/components/home/Hero";
import { IntroBlurb } from "@/components/home/IntroBlurb";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ClosingCta } from "@/components/home/ClosingCta";
import { closingCta } from "@/content/home";
import { buildMetadata } from "@/lib/seo";

/* ---------------------------------------------------------------------------
   HOME PAGE
   Each block below is its own component in src/components/home/, and all of
   the wording lives in src/content/home.ts. To reorder the page, just move
   these lines around.
   --------------------------------------------------------------------------- */

export const metadata = buildMetadata({
  title: "Kate Iverson Social Media | Short-Form Video & Social Media Management",
  description:
    "Kate Iverson is a social media manager creating short-form video that grows small brands — strategy, filming, editing and posting, handled end to end.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntroBlurb />
      <FeaturedWork />
      <ServicesPreview />
      <ClosingCta
        eyebrow={closingCta.eyebrow}
        heading={closingCta.heading}
        body={closingCta.body}
        cta={closingCta.primaryCta}
      />
    </>
  );
}
