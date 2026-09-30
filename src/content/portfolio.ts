/* ===========================================================================
   PORTFOLIO  —  the video gallery on the Work page
   ---------------------------------------------------------------------------
   ✏️  EDIT ME: this is the only file you need to touch to add, remove or
   re-order videos. The layout takes care of itself.

   TO ADD A VIDEO:
     1. Upload the optimized video to the public Supabase `website-videos-public`
        bucket and use the resulting object path below.
     2. Add the matching `videoPath`, client, category, caption and thumbnail.
     3. Save. The public URL is built automatically from the Supabase project
        URL in `NEXT_PUBLIC_SUPABASE_URL`.

   SUPPORTED LINKS:
     TikTok     https://www.tiktok.com/@username/video/1234567890123456789
     Instagram  https://www.instagram.com/reel/ABC123xyz/
     YouTube    https://www.youtube.com/shorts/abc123  (or a normal watch URL)

   NOTES:
     • `featured: true` makes a video show up in the strip on the home page.
       Keep 3–4 videos featured for the best layout.
     • `category` must match one of the labels in `categories` below.
     • Social `url` entries remain supported for future external embeds.
     • Keep video paths versioned instead of replacing an existing Supabase
       object, so CDN/browser caches cannot show an older file.
   =========================================================================== */

import { getPortfolioVideoUrl } from "@/lib/media";

export type VideoItem = {
  /** Unique id — any short, lowercase, no-spaces label works. */
  id: string;
  /** Optional share URL for a TikTok, Instagram Reel, or YouTube Short. */
  url?: string;
  /** Optional direct URL for a self-hosted portfolio video. */
  videoUrl?: string;
  /** Versioned path inside the public Supabase Storage bucket. */
  videoPath?: string;
  /** Client or brand name shown under the video. */
  client: string;
  /** Must match one of the `categories` below — powers the filter buttons. */
  category: Category;
  /** One short line about the video: the goal, the result, or the idea. */
  caption: string;
  /** Set to true to show this in the home page preview strip. */
  featured?: boolean;
  /**
   * OPTIONAL cover image shown before the video is played. Drop the image in
   * /public/images/work/ and reference it here, e.g. "/images/work/travel-01.jpg".
   * If left out, a soft pink placeholder card is shown instead — the video
   * still plays exactly the same when clicked.
   */
  thumbnail?: string;
};

/* ---------------------------------------------------------------------------
   CATEGORIES — the filter buttons above the gallery.
   Add or rename freely; just make sure each video's `category` matches one.
   --------------------------------------------------------------------------- */
export const categories = [
  "Travel",
  "Jewelry",
  "Food & Drink",
  "Fitness",
  "Lifestyle",
] as const;

export type Category = (typeof categories)[number];

/* ---------------------------------------------------------------------------
   THE VIDEOS
   The four initial records use the names/content already laid out in the
   starter portfolio. Replace the client/caption text and add poster files as
   the real media is supplied. The uploaded object paths are wired in below.
   --------------------------------------------------------------------------- */
export const videos: VideoItem[] = [
  {
    id: "jewelry-01",
    videoPath: "v15044gf0000d9gp5vvog65k316bpc6g.MP4",
    videoUrl: getPortfolioVideoUrl("v15044gf0000d9gp5vvog65k316bpc6g.MP4"),
    client: "Retro Charm Co.",
    category: "Jewelry",
    caption: "Market day reel advertising new charms, custom bracelets, and friendship",
    featured: true,
  },
  {
    id: "travel-01",
    videoPath: "1e4d7dca99d24a028f5497b2ce2f27e9.MOV",
    videoUrl: getPortfolioVideoUrl("1e4d7dca99d24a028f5497b2ce2f27e9.MOV"),
    client: "Naxos, Greece",
    category: "Travel",
    caption: "Travel shots on the Greek island of Naxos.",
    featured: true,
  },
  {
    id: "travel-02",
    videoPath: "v15044gf0000d8t1f8fog65vilktdgsg.MP4",
    videoUrl: getPortfolioVideoUrl("v15044gf0000d8t1f8fog65vilktdgsg.MP4"),
    client: "Italy, Greece",
    category: "Travel",
    caption: "Travel is so much more than destinations and history, its about people and culture.",

    featured: true,
  },
  {
    id: "travel-03",
    videoPath: "77758cb1500942dab5d3858124a591ce.MOV",
    videoUrl: getPortfolioVideoUrl("77758cb1500942dab5d3858124a591ce.MOV"),
    client: "Tiffany's Tours",
    category: "Travel",
    caption: "Short form content highlighting the beauty of the Greek Islands.",
    featured: true,
  },
];

/** The videos shown in the home page preview strip. */
export const featuredVideos = videos.filter((video) => video.featured).slice(0, 4);
