"use client";

import Image from "next/image";
import { motion, type MotionValue } from "framer-motion";

type ClickWheelProps = {
  opacity: MotionValue<number> | number;
  onMenu?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onPlay?: () => void;
  onSelect?: () => void;
};

const WHEEL_LABEL =
  "absolute z-10 font-bold tracking-[0.06em] text-wheel-label outline-none transition-[filter] [text-shadow:0_1px_0_rgba(0,0,0,0.55)] hover:brightness-110 active:brightness-95";

export function ClickWheel({
  opacity,
  onMenu,
  onPrev,
  onNext,
  onPlay,
  onSelect,
}: ClickWheelProps) {
  return (
    <motion.div
      style={{ opacity }}
      className="relative mx-auto aspect-square w-full select-none"
      aria-label="iPod click wheel"
    >
      {/* Smooth matte rubber ring */}
      <div className="ipod-rubber-wheel absolute inset-0 overflow-hidden rounded-full" />

      <button
        type="button"
        onClick={onMenu}
        className={`${WHEEL_LABEL} left-1/2 top-[6%] -translate-x-1/2`}
        style={{ fontSize: "clamp(10px, 4.2cqi, 16px)" }}
      >
        MENU
      </button>

      <button
        type="button"
        onClick={onPrev}
        className="absolute left-[8%] top-1/2 z-10 h-[8%] w-[12%] -translate-y-1/2 opacity-85 transition hover:opacity-100"
        aria-label="Previous"
      >
        <Image
          src="/assets/ipod/prev.svg"
          alt=""
          fill
          className="object-contain opacity-80 brightness-0 invert -scale-x-100"
          unoptimized
        />
      </button>

      <button
        type="button"
        onClick={onNext}
        className="absolute right-[8%] top-1/2 z-10 h-[8%] w-[12%] -translate-y-1/2 opacity-85 transition hover:opacity-100"
        aria-label="Next"
      >
        <Image
          src="/assets/ipod/next.svg"
          alt=""
          fill
          className="object-contain opacity-80 brightness-0 invert"
          unoptimized
        />
      </button>

      <button
        type="button"
        onClick={onPlay}
        className="absolute bottom-[7%] left-1/2 z-10 h-[6%] w-[14%] -translate-x-1/2 opacity-85 transition hover:opacity-100"
        aria-label="Play or pause"
      >
        <Image
          src="/assets/ipod/play.svg"
          alt=""
          fill
          className="object-contain opacity-80 brightness-0 invert"
          unoptimized
        />
      </button>

      {/* Center select — clips a chassis-sized copy of the body sheen */}
      <button
        type="button"
        onClick={onSelect ?? onPlay}
        className="absolute left-1/2 top-1/2 z-10 size-[35.5%] -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-aqua-gel-light/70"
        aria-label="Select"
      >
        <span
          data-ipod-center
          className="ipod-aluminum-face absolute inset-0 overflow-hidden rounded-full ring-1 ring-black/25"
        >
          <span className="ipod-metal-grain pointer-events-none absolute inset-0" />
          <span className="ipod-metal-sheen pointer-events-none absolute" />
          <span className="ipod-metal-specular pointer-events-none absolute" />
        </span>
      </button>
    </motion.div>
  );
}
