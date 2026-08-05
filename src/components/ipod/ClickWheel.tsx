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
  "absolute z-10 font-bold tracking-[0.06em] text-wheel-label outline-none transition-[filter] [text-shadow:0_1px_0_rgba(255,255,255,0.85)] hover:brightness-95 active:brightness-90";

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
      {/* Radial gel disc — Aqua click-wheel recipe */}
      <div
        className="absolute inset-0 overflow-hidden rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-3px_6px_rgba(20,30,50,0.12),0_1px_2px_rgba(20,30,50,0.1)]"
        style={{
          background:
            "radial-gradient(circle at 50% 32%, #fcfdfe, #e2e5ea 62%, #d0d4db 100%)",
        }}
      >
        <Image
          src="/assets/ipod/wheel.svg"
          alt=""
          fill
          className="object-cover opacity-40 mix-blend-multiply"
          unoptimized
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full opacity-25 mix-blend-soft-light"
          style={{
            backgroundImage: "url(/assets/ipod/noise-center.png)",
            backgroundSize: "cover",
          }}
        />
      </div>

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
        className="absolute left-[8%] top-1/2 z-10 h-[8%] w-[12%] -translate-y-1/2 opacity-90 transition hover:opacity-100"
        aria-label="Previous"
      >
        <Image
          src="/assets/ipod/prev.svg"
          alt=""
          fill
          className="object-contain opacity-70 -scale-x-100"
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
          className="object-contain opacity-70"
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
          className="object-contain opacity-70"
          unoptimized
        />
      </button>

      <button
        type="button"
        onClick={onSelect ?? onPlay}
        className="absolute left-1/2 top-1/2 z-10 size-[35.5%] -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-aqua-gel-light/70"
        aria-label="Select"
      >
        <span
          className="absolute inset-0 overflow-hidden rounded-full shadow-[inset_0_2px_5px_rgba(20,30,50,0.18),0_1px_0_rgba(255,255,255,0.9)]"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, #f7f8fa, #dcdfe5 70%, #ced2d9 100%)",
          }}
        >
          <Image
            src="/assets/ipod/center.svg"
            alt=""
            fill
            className="object-cover opacity-35 mix-blend-multiply"
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
