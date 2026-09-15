"use client";

import { useMemo, useState } from "react";
import { VideoCard } from "@/components/work/VideoCard";
import { Reveal } from "@/components/ui/Reveal";
import { categories, videos } from "@/content/portfolio";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   WorkGallery
   The filterable video grid on the Work page.

   Both the filter buttons and the videos are generated from
   src/content/portfolio.ts — adding a video or a new category there is all it
   takes. Categories with no videos in them are hidden automatically, so
   nothing ever leads to an empty page.
   --------------------------------------------------------------------------- */

const ALL = "All";

export function WorkGallery() {
  const [active, setActive] = useState<string>(ALL);

  // Only show filters that actually have videos behind them.
  const filters = useMemo(() => {
    const used = categories.filter((category) =>
      videos.some((video) => video.category === category),
    );
    return [ALL, ...used];
  }, []);

  const visible = active === ALL ? videos : videos.filter((video) => video.category === active);

  return (
    <div>
      {/* Filter buttons — hidden entirely if there's only one category. */}
      {filters.length > 2 ? (
        <div
          role="group"
          aria-label="Filter work by industry"
          className="mb-12 flex flex-wrap justify-center gap-2"
        >
          {filters.map((filter) => {
            const isActive = filter === active;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActive(filter)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition duration-300 ease-gentle",
                  isActive
                    ? "bg-blush-300 font-medium text-cocoa-800"
                    : "border border-cocoa-200 text-cocoa-500 hover:border-cocoa-400 hover:text-ink",
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>
      ) : null}

      {/* 1 column on mobile, 2 on tablet, 3 on desktop. */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((video, index) => (
          <Reveal key={video.id} delay={Math.min(index, 5) * 70}>
            <VideoCard item={video} />
          </Reveal>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-cocoa-500">
          No videos in this category yet. Check back soon.
        </p>
      ) : null}

      <p className="mt-14 text-center text-sm text-cocoa-400">
        Videos play right here on the page. Tap any cover to load it.
      </p>
    </div>
  );
}
