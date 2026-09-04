import type { Metadata } from "next";
import { PageFrame } from "@/components/portfolio/PageFrame";

export const metadata: Metadata = {
  title: "Listening room — Joel Lim",
};

export default function ListeningRoomPage() {
  return (
    <PageFrame>
      <section className="flex w-full items-center px-[32px] py-[8px]">
        <p className="max-w-[75ch] text-[24px] leading-[24px] tracking-[-1px] text-black/50">
          A decade as a musician taught me that every song has a story. In
          product design, I carry that forward by{" "}
          <span className="text-black">
            telling stories through user-centric products and interactions.
          </span>
        </p>
      </section>

      {/* The player itself is the next pass — it reuses the V1 iPod with Cover
          Flow and play only, and is waiting on the MP3s. Capped on the same
          1600 ceiling as the footer assembly so it fills without ballooning. */}
      <section className="w-full p-[8px]">
        <div className="mx-auto aspect-[1184/497] w-full max-w-[1600px]" />
      </section>
    </PageFrame>
  );
}
