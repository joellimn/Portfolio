"use client";

import { motion } from "framer-motion";

type HeroScreenProps = {
  /** Reserved for touch-specific hero affordances (tap still enters early). */
  touchMode?: boolean;
};

export function HeroScreen({ touchMode: _touchMode = false }: HeroScreenProps) {
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

      {/* Auto-zoom to Works after ~2.5s — no scroll/tap cue needed. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute bottom-[12%] flex flex-col items-center"
        aria-hidden
      >
        <p className="text-[clamp(10px,3.2cqi,12px)] text-black/70">
          Entering works…
        </p>
      </motion.div>
    </div>
  );
}
