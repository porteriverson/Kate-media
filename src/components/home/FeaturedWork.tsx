import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { VideoCard } from "@/components/work/VideoCard";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { featuredVideos } from "@/content/portfolio";
import { workPreview } from "@/content/home";

/* ---------------------------------------------------------------------------
   FeaturedWork
   The strip of 3–4 videos on the home page. To change which ones appear,
   set `featured: true` on the videos you want in src/content/portfolio.ts.
   --------------------------------------------------------------------------- */

export function FeaturedWork() {
  if (featuredVideos.length === 0) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow={workPreview.eyebrow}
        heading={workPreview.heading}
        body={workPreview.body}
      />

      <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {featuredVideos.map((video, index) => (
          <Reveal key={video.id} delay={index * 80}>
            <VideoCard item={video} />
          </Reveal>
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <Button href={workPreview.cta.href} variant="secondary" size="lg">
          {workPreview.cta.label}
          <ArrowRightIcon />
        </Button>
      </div>
    </Section>
  );
}
