"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayIcon } from "@/components/icons/Icons";
import { getEmbedUrl, getPlatform, platformLabels } from "@/lib/embeds";
import type { VideoItem } from "@/content/portfolio";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   VideoCard
   One video in the gallery, shown in a 9:16 short-form frame.

   PERFORMANCE NOTE: the actual TikTok / Instagram / YouTube embed is only
   loaded after the visitor clicks play. Embeds are heavy (each one pulls in
   its platform's own scripts), so loading a page full of them up front would
   make the site slow — especially on phones. Until then we show a lightweight
   cover card, which keeps the page fast without changing how it looks.
   --------------------------------------------------------------------------- */

export function VideoCard({ item, className }: { item: VideoItem; className?: string }) {
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const platform = getPlatform(item.url ?? "");
  const embedUrl = item.url ? getEmbedUrl(item.url) : null;
  const directVideo = item.videoUrl;
  const videoMimeType = item.videoPath?.toLowerCase().endsWith(".mov")
    ? "video/quicktime"
    : "video/mp4";
  const canPlay = Boolean(directVideo || embedUrl);
  const platformLabel = directVideo ? "Portfolio video" : platformLabels[platform];
  const title = `${item.client}: ${item.caption}`;

  return (
    <figure className={cn("group flex flex-col", className)}>
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-cocoa-100 bg-blush-100 shadow-sm transition duration-500 ease-gentle group-hover:shadow-md">
        {playing && directVideo && !videoError ? (
          <video
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={item.thumbnail}
            onError={() => setVideoError(true)}
            aria-label={title}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={directVideo} type={videoMimeType} />
            Your browser does not support the video tag.
          </video>
        ) : playing && embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : videoError ? (
          <VideoError item={item} />
        ) : (
          <Cover
            item={item}
            embeddable={canPlay}
            platformLabel={platformLabel}
            onPlay={() => {
              setVideoError(false);
              setPlaying(true);
            }}
          />
        )}
      </div>

      <figcaption className="mt-4 px-1">
        <div className="flex items-baseline justify-between gap-3">
          {/* TODO: swap the placeholder client names in src/content/portfolio.ts */}
          <h3 className="font-heading text-lg text-ink">{item.client}</h3>
          <span className="shrink-0 text-xs font-medium uppercase tracking-[0.14em] text-blush-600">
            {item.category}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-cocoa-500">{item.caption}</p>
      </figcaption>
    </figure>
  );
}

function VideoError({ item }: { item: VideoItem }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-blush-100 px-6 text-center">
      <p className="text-sm leading-relaxed text-cocoa-600">
        This video could not be loaded right now.
      </p>
      {item.videoUrl ? (
        <a
          href={item.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-cocoa-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cream transition hover:bg-cocoa-800"
        >
          Open video
        </a>
      ) : item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-cocoa-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cream transition hover:bg-cocoa-800"
        >
          Open original
        </a>
      ) : null}
    </div>
  );
}

/* The lightweight cover shown before the embed loads. */
function Cover({
  item,
  embeddable,
  platformLabel,
  onPlay,
}: {
  item: VideoItem;
  embeddable: boolean;
  platformLabel: string;
  onPlay: () => void;
}) {
  const inner = (
    <>
      {item.thumbnail ? (
        <Image
          src={item.thumbnail}
          alt={`Still frame from a video made for ${item.client}`}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover transition duration-700 ease-gentle group-hover:scale-[1.03]"
        />
      ) : (
        /* Placeholder cover — replace by adding a `thumbnail` to the video
           in src/content/portfolio.ts, or just leave it as is. */
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-blush-100 via-blush-200 to-cocoa-100"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-cocoa-800/45 via-transparent to-transparent" />

      <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-cocoa-600">
        {platformLabel}
      </span>

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/95 text-cocoa-700 shadow-md transition duration-300 ease-gentle group-hover:scale-110 group-hover:bg-blush-300 group-hover:text-cocoa-800">
          <PlayIcon className="ml-0.5 h-6 w-6" />
        </span>
      </span>

      <span className="absolute inset-x-3 bottom-3 text-xs font-medium text-cream/95">
        {embeddable
          ? "Tap to play"
          : item.url
            ? `Watch on ${platformLabel}`
            : "Video coming soon"}
      </span>
    </>
  );

  // If the link isn't one we can embed, send people to the post itself.
  if (!embeddable && item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch the video made for ${item.client} on ${platformLabel} (opens in a new tab)`}
        className="absolute inset-0 block"
      >
        {inner}
      </a>
    );
  }

  if (!embeddable) {
    return <div className="absolute inset-0 block">{inner}</div>;
  }

  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play the video made for ${item.client}`}
      className="absolute inset-0 block h-full w-full cursor-pointer"
    >
      {inner}
    </button>
  );
}
