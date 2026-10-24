"use client";

import Image from "next/image";
import { GradientBackground } from "@/components/portfolio/GradientBackground";

export function NissanCover() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#B82E2E]">
      <GradientBackground className="absolute inset-0 h-full w-full" />
      <Image
        src="/assets/work/v5/nissan-texture.png"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="pointer-events-none object-cover opacity-[0.07]"
        quality={95}
        unoptimized
        priority
      />
      <Image
        src="/assets/work/v5/nissan-logo.png?v=2"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="pointer-events-none object-cover"
        unoptimized
        priority
      />
    </div>
  );
}
