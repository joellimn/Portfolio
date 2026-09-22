"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "@/components/case-studies/CaseStudyPrimitives";

const ACCENT = "#2b84e9";
const TOOL_BAR = "#e8f7ff";

const SLIDES = [
  {
    src: "/assets/case-studies/v4/umg/highlight-to-get-here.png?v=4",
    alt: "Figma redesign of Hardware Asset Management lookup results",
    width: 2868,
    height: 1758,
    caption:
      "Redesigned 5 internal apps, including a hardware management platform tracking 2,000+ assets",
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
    src: "/assets/case-studies/v4/umg/highlight-through-this.png?v=4",
    alt: "Codex rebuild of Hardware Asset Management",
    width: 2868,
    height: 1758,
    caption:
      "Redesigned 5 internal apps, including a hardware management platform tracking 2,000+ assets",
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
    src: "/assets/case-studies/v4/umg/highlight-started-here.png?v=4",
    alt: "Original Microsoft Power Apps Hardware Asset Management screen",
    width: 2868,
    height: 1758,
    caption:
      "Redesigned 5 internal apps, including a hardware management platform tracking 2,000+ assets",
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

export function UmgHighlightReel() {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const last = SLIDES.length - 1;

  useEffect(() => {
    const strip = scroller.current;
    if (!strip) return;

    const onScroll = () => {
      const width = strip.clientWidth;
      if (!width) return;
      setIndex(Math.round(strip.scrollLeft / width));
    };

    strip.addEventListener("scroll", onScroll, { passive: true });
    return () => strip.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (next: number) => {
    const strip = scroller.current;
    if (!strip) return;
    const clamped = Math.min(last, Math.max(0, next));
    strip.scrollTo({ left: clamped * strip.clientWidth, behavior: "smooth" });
    setIndex(clamped);
  };

  return (
    <section id="highlights" className="scroll-mt-24">
      <Label color={ACCENT}>Highlights</Label>
      <div className="flex items-center gap-4 px-8">
        <p className="min-w-0 flex-1 text-[24px] leading-[27.5px] text-black">
          {SLIDES[index].caption}
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="Previous highlight"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
            className="flex size-8 items-center justify-center text-black transition-opacity disabled:opacity-25"
          >
            <ChevronLeft className="size-6" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next highlight"
            disabled={index === last}
            onClick={() => goTo(index + 1)}
            className="flex size-8 items-center justify-center text-black transition-opacity disabled:opacity-25"
          >
            <ChevronRight className="size-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="px-8 pt-4">
        <div
          ref={scroller}
          className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SLIDES.map((item) => (
            <div
              key={item.src}
              className="w-full min-w-full shrink-0 snap-start"
            >
              <SlideImage item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
