import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { headshot } from "@/content/about";

/* ---------------------------------------------------------------------------
   Headshot
   Shows Kate's photo — or a tidy placeholder frame if the photo hasn't been
   added yet.

   ✏️  TO ADD THE REAL PHOTO: drop the file into /public/images/ and name it
   to match `headshot.src` in src/content/about.ts (currently
   /images/kate-headshot.jpg). The placeholder disappears on its own.

   A portrait-shaped image around 900x1200px works best.
   --------------------------------------------------------------------------- */

function imageExists(src: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", src));
  } catch {
    return false;
  }
}

export function Headshot() {
  const hasPhoto = imageExists(headshot.src);

  return (
    <div className="relative">
      {/* Soft pink offset frame behind the photo. */}
      <div
        aria-hidden="true"
        className="absolute -left-4 -top-4 h-full w-full rounded-3xl border border-blush-200 bg-blush-50"
      />

      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-cocoa-100 bg-cocoa-50">
        {hasPhoto ? (
          <Image
            src={headshot.src}
            alt={headshot.alt}
            fill
            priority
            sizes="(max-width: 768px) 90vw, 40vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-blush-100 via-cream to-cocoa-100 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/80 font-heading text-2xl text-cocoa-500">
              KI
            </span>
            {/* This note only ever appears while the photo is missing. */}
            <p className="text-xs uppercase tracking-[0.18em] text-cocoa-400">
              Headshot placeholder
            </p>
            <p className="max-w-[14rem] text-xs leading-relaxed text-cocoa-400">
              Add the photo to /public/images/ to replace this.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
