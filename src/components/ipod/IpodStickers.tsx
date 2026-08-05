"use client";

import Image from "next/image";

type Sticker = {
  src: string;
  alt: string;
  /** Position + size + rotation. Width is % of chassis. */
  className: string;
  /** Darkened/clipped twin that peeks past the rounded edge (fold wrap). */
  foldClassName?: string;
};

/**
 * Die-cut stickers on the chassis — one of each. Pieces that hang past the
 * body get clipped by `.ipod-chassis { overflow: hidden }`, reading as
 * wrapped over the edge. Fold twins are darkened duplicates shifted off-edge.
 */
const STICKERS: Sticker[] = [
  {
    src: "/assets/ipod/stickers/grizzlies-sticker.png",
    alt: "Memphis Grizzlies",
    // Left rail beside the click wheel — clear of the screen bezel.
    className:
      "left-[-5%] top-[58%] w-[22%] -rotate-[18deg] drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]",
    foldClassName:
      "left-[-12%] top-[57%] w-[13%] origin-right -rotate-[18deg] brightness-[0.45] contrast-125 saturate-75",
  },
  {
    src: "/assets/ipod/stickers/kfa-sticker.png",
    alt: "KFA",
    // Right rail beside the click wheel — clear of the screen bezel.
    className:
      "right-[-4%] top-[56%] w-[16%] rotate-[12deg] drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]",
    foldClassName:
      "right-[-10%] top-[55%] w-[10%] origin-left rotate-[12deg] brightness-[0.45] contrast-125 saturate-75",
  },
  {
    src: "/assets/ipod/stickers/vandy-sticker.png",
    alt: "Vanderbilt V",
    className:
      "left-[4%] bottom-[8%] w-[20%] rotate-[9deg] drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]",
  },
];

function StickerImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={240}
        height={240}
        className="h-auto w-full select-none"
        unoptimized
        draggable={false}
      />
    </div>
  );
}

export function IpodStickers() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      {STICKERS.map((sticker) => (
        <div key={sticker.src}>
          {sticker.foldClassName ? (
            <StickerImage
              src={sticker.src}
              alt=""
              className={sticker.foldClassName}
            />
          ) : null}
          <StickerImage
            src={sticker.src}
            alt={sticker.alt}
            className={sticker.className}
          />
        </div>
      ))}
    </div>
  );
}
