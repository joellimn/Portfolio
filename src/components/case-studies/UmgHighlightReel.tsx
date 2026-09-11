"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Label } from "@/components/case-studies/CaseStudyPrimitives";

const ACCENT = "#2b84e9";

const SLIDES = [
  {
    src: "/assets/case-studies/v4/umg/highlight-to-get-here.png",
    alt: "Hardware Asset Management lookup results table",
    width: 4096,
    height: 2560,
    caption: "To get here,",
  },
  {
    src: "/assets/case-studies/v4/umg/highlight-through-this.png",
    alt: "Earlier Hardware Asset Management lookup with KPI cards",
    width: 2736,
    height: 1377,
    caption: "I had to go through this,",
  },
  {
    src: "/assets/case-studies/v4/umg/highlight-started-here.png",
    alt: "Original Power Apps barcode scanning app",
    width: 2736,
    height: 1458,
    caption: "But I started here.",
  },
] as const;

const FRAME = SLIDES.reduce((tallest, slide) =>
  slide.height / slide.width > tallest.height / tallest.width ? slide : tallest,
);

function SlideImage({ item }: { item: (typeof SLIDES)[number] }) {
  return (
    <div className="bg-[#f6faff] p-8">
      <div
        className="flex w-full items-center justify-center"
        style={{ aspectRatio: `${FRAME.width} / ${FRAME.height}` }}
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          className="h-auto w-full rounded-lg"
          unoptimized
        />
      </div>
    </div>
  );
}

function scrollRoot(node: HTMLElement | null) {
  return node?.closest('[role="dialog"]') as HTMLElement | null;
}

export function UmgHighlightReel() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = section.current;
    const root = scrollRoot(el);
    if (!el || !root) return;

    let frame = 0;
    const measure = () => {
      const rootBox = root.getBoundingClientRect();
      const box = el.getBoundingClientRect();
      const travel = el.offsetHeight - root.clientHeight;
      if (travel <= 0) return;
      const progress = Math.min(
        1,
        Math.max(0, (rootBox.top - box.top) / travel),
      );
      const last = SLIDES.length - 1;
      const next = progress * last;
      const slideW = track.current?.offsetWidth ?? 0;
      const gap = slideW ? 40 : 0;
      setOffset(next * (slideW + gap));
      setIndex(Math.min(last, Math.floor(next + 0.001)));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  const slide = SLIDES[index];

  return (
    <section
      ref={section}
      id="highlights"
      className={`scroll-mt-24 ${reduced ? "" : "h-[280vh]"}`}
    >
      <div
        className={
          reduced
            ? "flex flex-col gap-4"
            : "sticky top-0 flex min-h-[100dvh] flex-col justify-start bg-white"
        }
      >
        <Label color={ACCENT}>Highlights</Label>
        {reduced ? (
          <div className="flex flex-col gap-10 px-8">
            {SLIDES.map((item) => (
              <div key={item.src} className="flex flex-col gap-4">
                <p className="text-[24px] leading-[27.5px] text-black">
                  {item.caption}
                </p>
                <SlideImage item={item} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid min-h-[28px] px-8">
              <p
                key={slide.caption}
                className="col-start-1 row-start-1 text-[24px] leading-[27.5px] text-black"
              >
                {slide.caption}
              </p>
            </div>
            <div className="overflow-hidden px-8 pt-4">
              <div
                ref={track}
                className="flex w-full gap-10"
                style={{
                  transform: `translate3d(${-offset}px, 0, 0)`,
                }}
              >
                {SLIDES.map((item) => (
                  <div key={item.src} className="w-full min-w-full shrink-0">
                    <SlideImage item={item} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
