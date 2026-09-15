import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Builds the per-page SEO metadata (title, description, social share tags).
 *
 * ✏️  To change a page's title or description, edit the `buildMetadata(...)`
 * call at the top of that page file in src/app/.
 */
/* The share card that appears when a link is texted, posted or messaged.
   The image files themselves are src/app/opengraph-image.jpg and
   src/app/twitter-image.jpg — replace those files to change the picture.

   Next.js applies them automatically, but ONLY to pages that don't set their
   own `openGraph` block. Every page here does (for its own title and
   description), and that replaces the whole block — so the image has to be
   repeated explicitly, or inner pages would share with no picture at all. */
const shareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Kate Iverson Media — short-form video and social media management",
};

export function buildMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${site.url}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [shareImage],
    },
  };
}
