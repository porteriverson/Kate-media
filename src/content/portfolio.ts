/* ===========================================================================
   PORTFOLIO  —  the video gallery on the Work page
   ---------------------------------------------------------------------------
   ✏️  EDIT ME: this is the only file you need to touch to add, remove or
   re-order videos. The layout takes care of itself.

   TO ADD A VIDEO:
     1. Open the post on TikTok / Instagram / YouTube and copy its URL
        (the "Share > Copy link" option).
     2. Copy one of the blocks below, paste it at the top of the list, and
        update the url, client, category and caption.
     3. Save. That's it — the right embed is detected from the URL.

   SUPPORTED LINKS:
     TikTok     https://www.tiktok.com/@username/video/1234567890123456789
     Instagram  https://www.instagram.com/reel/ABC123xyz/
     YouTube    https://www.youtube.com/shorts/abc123  (or a normal watch URL)

   NOTES:
     • `featured: true` makes a video show up in the strip on the home page.
       Keep 3–4 videos featured for the best layout.
     • `category` must match one of the labels in `categories` below.
     • Every video currently uses a PLACEHOLDER link and a PLACEHOLDER client
       name — swap in the real ones as they're ready.
   =========================================================================== */

export type VideoItem = {
  /** Unique id — any short, lowercase, no-spaces label works. */
  id: string;
  /** Full share URL of the post (TikTok, Instagram Reel, or YouTube Short). */
  url: string;
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
   TODO: every entry below is a placeholder. Replace the `url`, `client` and
   `caption` values with real posts. Delete any extras you don't need.
   --------------------------------------------------------------------------- */
export const videos: VideoItem[] = [
  {
    id: "travel-01",
    url: "https://www.tiktok.com/@tiktok/video/7365424000000000000", // TODO: real TikTok link
    client: "Coastal Tours Co.",
    category: "Travel",
    caption: "Destination teaser that drove a spike in booking inquiries.",
    featured: true,
  },
  {
    id: "jewelry-01",
    url: "https://www.instagram.com/reel/C1234567890/", // TODO: real Instagram Reel link
    client: "Wren & Gold Jewelry",
    category: "Jewelry",
    caption: "Close-up product story built around a new collection launch.",
    featured: true,
  },
  {
    id: "food-01",
    url: "https://www.youtube.com/shorts/dQw4w9WgXcQ", // TODO: real YouTube Short link
    client: "Marigold Cafe",
    category: "Food & Drink",
    caption: "Behind-the-counter Short introducing the seasonal menu.",
    featured: true,
  },
  {
    id: "fitness-01",
    url: "https://www.tiktok.com/@tiktok/video/7365424000000000001", // TODO: real link
    client: "Studio Six Pilates",
    category: "Fitness",
    caption: "Founder-led trend format that doubled the account's reach.",
    featured: true,
  },
  {
    id: "lifestyle-01",
    url: "https://www.instagram.com/reel/C0987654321/", // TODO: real link
    client: "The Linen House",
    category: "Lifestyle",
    caption: "Soft, slow-living aesthetic for a home goods brand.",
  },
  {
    id: "travel-02",
    url: "https://www.youtube.com/shorts/aqz-KE-bpKQ", // TODO: real link
    client: "Alpine Escapes",
    category: "Travel",
    caption: "Itinerary walkthrough repurposed across all three platforms.",
  },
  {
    id: "jewelry-02",
    url: "https://www.tiktok.com/@tiktok/video/7365424000000000002", // TODO: real link
    client: "Wren & Gold Jewelry",
    category: "Jewelry",
    caption: "Styling series that became the account's best-performing format.",
  },
  {
    id: "food-02",
    url: "https://www.instagram.com/reel/C1122334455/", // TODO: real link
    client: "Marigold Cafe",
    category: "Food & Drink",
    caption: "User-generated-style review that ran as a paid ad.",
  },
  {
    id: "fitness-02",
    url: "https://www.youtube.com/shorts/ScMzIvxBSi4", // TODO: real link
    client: "Studio Six Pilates",
    category: "Fitness",
    caption: "Class-preview Short used to fill a new time slot.",
  },
];

/** The videos shown in the home page preview strip. */
export const featuredVideos = videos.filter((video) => video.featured).slice(0, 4);
