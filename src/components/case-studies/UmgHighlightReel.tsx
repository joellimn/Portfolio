"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Label } from "@/components/case-studies/CaseStudyPrimitives";

const ACCENT = "#2b84e9";
const TOOL_BAR = "#e8f7ff";
const END_HOLD = 0.16;
const CAPTION_FADE = 0.08;

function remapProgress(progress: number) {
  if (progress <= END_HOLD) return 0;
  if (progress >= 1 - END_HOLD) return 1;
  return (progress - END_HOLD) / (1 - END_HOLD * 2);
}

function captionOpacity(slideAt: number, index: number) {
  const dist = Math.abs(slideAt - index);
  const start = 0.5 - CAPTION_FADE;
  const end = 0.5 + CAPTION_FADE;
  if (dist <= start) return 1;
  if (dist >= end) return 0;
  return 1 - (dist - start) / (CAPTION_FADE * 2);
}

const SLIDES = [
  {
    src: "/assets/case-studies/v4/umg/highlight-to-get-here.png?v=3",
    alt: "Figma redesign of Hardware Asset Management lookup results",
    width: 2868,
    height: 1758,
    caption: "To get here,",
    tools: [
      {
        src: "/assets/case-studies/v4/umg/logo-figma.png",
        label: "Figma",
        width: 385,
        height: 578,
      },
    ],
  },
  {
    src: "/assets/case-studies/v4/umg/highlight-through-this.png?v=3",
    alt: "Codex and Gemini rebuild of Hardware Asset Management",
    width: 2868,
    height: 1743,
    caption: "I had to go through this,",
    tools: [
      {
        src: "/assets/case-studies/v4/umg/logo-codex.png?v=2",
        label: "Codex",
        width: 51,
        height: 50,
      },
      {
        src: "/assets/case-studies/v4/umg/logo-gemini.png",
        label: "Gemini",
        width: 922,
        height: 742,
      },
    ],
  },
  {
    src: "/assets/case-studies/v4/umg/highlight-started-here.png?v=3",
    alt: "Original Microsoft Power Apps Hardware Asset Management screen",
    width: 2868,
    height: 1743,
    caption: "But I started here.",
    tools: [
      {
        src: "/assets/case-studies/v4/umg/logo-powerapps.png",
        label: "Microsoft PowerApps",
        width: 620,
        height: 596,
      },
    ],
  },
] as const;

const FRAME = SLIDES.reduce((tallest, slide) =>
  slide.height / slide.width > tallest.height / tallest.width ? slide : tallest,
);

function ToolBar({ tools }: { tools: (typeof SLIDES)[number]["tools"] }) {
  return (
    <div
      className="flex items-center px-8 py-2"
      style={{ backgroundColor: TOOL_BAR }}
    >
      <div className="flex items-center gap-6">
        {tools.map((tool) => (
          <div key={tool.label} className="flex items-center gap-2">
            <Image
              src={tool.src}
              alt=""
              width={tool.width}
              height={tool.height}
              className="h-8 w-auto object-contain"
              unoptimized
            />
            <span className="text-[20px] leading-normal text-black">
              {tool.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideImage({ item }: { item: (typeof SLIDES)[number] }) {
  return (
    <div>
      <ToolBar tools={item.tools} />
      <div
        className="flex w-full items-center justify-center bg-[#f6faff]"
        style={{ aspectRatio: `${FRAME.width} / ${FRAME.height}` }}
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          className="h-auto w-full"
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
  const [slideAt, setSlideAt] = useState(0);
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
      const progress = remapProgress(
        Math.min(1, Math.max(0, (rootBox.top - box.top) / travel)),
      );
      const last = SLIDES.length - 1;
      const next = progress * last;
      const slideW = track.current?.offsetWidth ?? 0;
      const gap = slideW ? 40 : 0;
      setOffset(next * (slideW + gap));
      setSlideAt(next);
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

  return (
    <section
      ref={section}
      id="highlights"
      className={`scroll-mt-24 ${reduced ? "" : "h-[340vh]"}`}
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
              {SLIDES.map((item, i) => (
                <p
                  key={item.caption}
                  className="pointer-events-none col-start-1 row-start-1 text-[24px] leading-[27.5px] text-black"
                  style={{ opacity: captionOpacity(slideAt, i) }}
                  aria-hidden={Math.round(slideAt) !== i}
                >
                  {item.caption}
                </p>
              ))}
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
