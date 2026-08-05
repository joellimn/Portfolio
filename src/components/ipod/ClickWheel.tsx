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
      className="relative mx-auto mt-[14%] aspect-square w-[61%] select-none"
      aria-label="iPod click wheel"
    >
      <div className="absolute inset-0 overflow-hidden rounded-full bg-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_1px_3px_rgba(0,0,0,0.12)]">
        <Image
          src="/assets/ipod/wheel.svg"
          alt=""
          fill
          className="object-cover opacity-90"
          unoptimized
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full opacity-20 mix-blend-soft-light"
          style={{
            backgroundImage: "url(/assets/ipod/noise-center.png)",
            backgroundSize: "cover",
          }}
        />
      </div>

      <button
        type="button"
        onClick={onMenu}
        className="absolute left-1/2 top-[6%] z-10 -translate-x-1/2 font-bold tracking-wide text-wheel-label opacity-90 transition hover:opacity-100"
        style={{ fontSize: "clamp(10px, 4.2cqi, 16px)" }}
      >
        MENU
      </button>

      <button
        type="button"
        onClick={onPrev}
        className="absolute left-[8%] top-1/2 z-10 h-[8%] w-[12%] -translate-y-1/2 opacity-90 transition hover:opacity-100"
        aria-label="Previous"
      >
        <Image
          src="/assets/ipod/prev.svg"
          alt=""
          fill
          className="object-contain"
          unoptimized
        />
      </button>

      <button
        type="button"
        onClick={onNext}
        className="absolute right-[8%] top-1/2 z-10 h-[8%] w-[12%] -translate-y-1/2 opacity-90 transition hover:opacity-100"
        aria-label="Next"
      >
        <Image
          src="/assets/ipod/next.svg"
          alt=""
          fill
          className="object-contain"
          unoptimized
        />
      </button>

      <button
        type="button"
        onClick={onPlay}
        className="absolute bottom-[7%] left-1/2 z-10 h-[6%] w-[14%] -translate-x-1/2 opacity-90 transition hover:opacity-100"
        aria-label="Play or pause"
      >
        <Image
          src="/assets/ipod/play.svg"
          alt=""
          fill
          className="object-contain"
          unoptimized
        />
      </button>

      <button
        type="button"
        onClick={onSelect ?? onPlay}
        className="absolute left-1/2 top-1/2 z-10 size-[35.5%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-label="Select"
      >
        <span className="absolute inset-0 overflow-hidden rounded-full bg-gradient-to-b from-[#e8e8e8] to-[#b8b8b8] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.15)]">
          <Image
            src="/assets/ipod/center.svg"
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
          <span
            className="absolute inset-0 rounded-full opacity-20 mix-blend-soft-light"
            style={{
              backgroundImage: "url(/assets/ipod/noise-center.png)",
              backgroundSize: "cover",
            }}
          />
        </span>
      </button>
    </motion.div>
  );
}
