import type { Metadata } from "next";
import { PageFrame } from "@/components/portfolio/PageFrame";
import { NycPhotoCarousel } from "@/components/portfolio/NycPhotoCarousel";

export const metadata: Metadata = {
  title: "About — Joel Lim",
};

export default function AboutPage() {
  return (
    <PageFrame scents>
      <div className="-mt-3 flex flex-col gap-[32px] sm:-mt-4">
      <section className="w-full px-[32px] text-[24px] leading-[24px] tracking-[-1px]">
        {/* The frame is fluid, but reading measure is capped just above the
            1200 design width so long lines stay tractable on wide screens. */}
        <div className="flex max-w-[75ch] flex-col gap-[24px]">
          <p className="text-black">A little bit about myself</p>
          <p className="text-black/50">
            I am a student at{" "}
            <span className="text-black">Vanderbilt University</span> from{" "}
            <span className="text-black">Memphis, Tennessee.</span> Growing up, I
            was constantly{" "}
            <span className="text-black">surrounded by design</span> since my
            father was an interior designer. That early exposure sparked my own
            passion for creativity and problem-solving through design.
          </p>
          <p className="text-black/50">
            Outside of design, you can usually find me keeping up with{" "}
            <span className="text-black">One Piece</span>, cheering on{" "}
            <span className="text-black">Real Madrid</span>, or hunting down
            new additions for my{" "}
            <span className="text-black">fragrance collection.</span>
          </p>
        </div>
      </section>

      <section className="flex w-full flex-col">
        <NycPhotoCarousel />
        <p className="w-full text-center text-[16px] leading-[24px] tracking-[-1px] text-black">
          Photos from my recent trip to NYC
        </p>
      </section>
      </div>
    </PageFrame>
  );
}
