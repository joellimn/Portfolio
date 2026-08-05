"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type HeroScreenProps = {
  /** Touch / tablet: tap the CTA text to zoom into Works. */
  onEnterWorks?: () => void;
  /** When true, copy reads "Tap…" (no arrow) and the text is the trigger. */
  touchMode?: boolean;
};

export function HeroScreen({ onEnterWorks, touchMode = false }: HeroScreenProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-white px-4 pb-[18%] text-center">
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
        className="absolute bottom-[12%] z-[100] flex flex-col items-center"
      >
        {touchMode && onEnterWorks ? (
          <button
            type="button"
            aria-label="Tap to view works"
            onPointerDown={(event) => {
              // Fire on press — more reliable than click inside transformed
              // chassis trees on mobile / in-app browsers.
              event.preventDefault();
              event.stopPropagation();
              onEnterWorks();
            }}
            className="pointer-events-auto relative z-[100] -m-4 touch-manipulation px-4 py-4 text-[clamp(10px,3.2cqi,12px)] text-black outline-none active:opacity-60"
          >
            Tap to view works
          </button>
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
