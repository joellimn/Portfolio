"use client";

import { useRef, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type HeroScreenProps = {
  /** Touch / tablet: tap anywhere on the Menu screen to zoom into Works. */
  onEnterWorks?: () => void;
  /** When true, copy reads "Tap…" and the whole screen is the trigger. */
  touchMode?: boolean;
};

export function HeroScreen({ onEnterWorks, touchMode = false }: HeroScreenProps) {
  // Debounce so pointerup + click don't double-fire the zoom.
  const lastFireRef = useRef(0);

  const triggerEnter = () => {
    if (!onEnterWorks) return;
    const now = performance.now();
    if (now - lastFireRef.current < 400) return;
    lastFireRef.current = now;
    onEnterWorks();
  };

  const touchEnterProps =
    touchMode && onEnterWorks
      ? {
          role: "button" as const,
          tabIndex: 0,
          "aria-label": "Tap to view works",
          onPointerUp: (event: PointerEvent<HTMLDivElement>) => {
            event.preventDefault();
            triggerEnter();
          },
          onClick: (event: MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            triggerEnter();
          },
          onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              triggerEnter();
            }
          },
        }
      : undefined;

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center bg-white px-4 pb-[18%] text-center ${
        touchMode && onEnterWorks ? "cursor-pointer touch-manipulation" : ""
      }`}
      {...touchEnterProps}
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="pointer-events-none text-[clamp(14px,4.8cqi,22px)] font-bold text-black"
      >
        Joel Lim
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.5 }}
        className="pointer-events-none mt-1 text-[clamp(10px,3.4cqi,13px)] text-black/50"
      >
        Product Designer Previously @UMG
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="pointer-events-none absolute bottom-[12%] flex flex-col items-center"
      >
        {touchMode ? (
          <p className="text-[clamp(10px,3.2cqi,12px)] text-black">
            Tap to view works
          </p>
        ) : (
          <>
            <p className="text-[clamp(10px,3.2cqi,12px)] text-black">
              Scroll to view works
            </p>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.4,
                ease: "easeInOut",
              }}
              className="relative mt-1 size-4"
            >
              <Image
                src="/assets/ipod/arrow-down.svg"
                alt=""
                fill
                className="object-contain"
                unoptimized
              />
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
