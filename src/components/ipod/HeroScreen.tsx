"use client";

import { motion } from "framer-motion";

type HeroScreenProps = {
  /** Reserved for touch-specific hero affordances (tap still enters early). */
  touchMode?: boolean;
  /** First visit: show the loading cue. After they return, show a click CTA. */
  autoZoom?: boolean;
  onViewWorks?: () => void;
};

export function HeroScreen({
  touchMode: _touchMode = false,
  autoZoom = true,
  onViewWorks,
}: HeroScreenProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-white px-4 pb-[18%] text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="text-[clamp(14px,4.8cqi,22px)] font-bold text-black"
      >
        Joel Lim
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.5 }}
        className="mt-1 text-[clamp(10px,3.4cqi,13px)] text-black/50"
      >
        Product Designer Previously @UMG
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: autoZoom ? 0.45 : 0.7 }}
        transition={{ delay: autoZoom ? 0.7 : 0, duration: 0.6 }}
        className="absolute bottom-[12%] flex flex-col items-center"
      >
        {autoZoom ? (
          <p
            className="text-[clamp(10px,3.2cqi,12px)] text-black/70"
            aria-hidden
          >
            Entering works
            <span className="inline-flex w-[1.2em] justify-start">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "linear",
                    times: [0, 0.2, 0.7, 1],
                  }}
                >
                  .
                </motion.span>
              ))}
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={onViewWorks}
            className="pointer-events-auto text-[clamp(10px,3.2cqi,12px)] text-black/70 underline-offset-2 hover:underline"
          >
            Click to view works
          </button>
        )}
      </motion.div>
    </div>
  );
}
