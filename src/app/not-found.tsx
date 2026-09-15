import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

/* Shown when someone lands on a URL that doesn't exist. */
export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blush-600">404</p>
        <h1 className="mt-6 text-4xl text-ink sm:text-5xl">This page wandered off</h1>
        <p className="mt-6 leading-relaxed text-cocoa-500">
          The link may be out of date. Let&apos;s get you back to something useful.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Back to home
          </Button>
          <Button href="/work" variant="secondary" size="lg">
            See my work
          </Button>
        </div>
      </div>
    </Section>
  );
}
