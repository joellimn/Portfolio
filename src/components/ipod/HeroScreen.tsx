"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type HeroScreenProps = {
  onEnter?: () => void;
};

export function HeroScreen({ onEnter }: HeroScreenProps) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
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
        Product Designer Prev @UMG
      </motion.p>

      <motion.button
        type="button"
        onClick={onEnter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="absolute bottom-[12%] flex flex-col items-center"
      >
        <p className="text-[clamp(10px,3.2cqi,12px)] text-black">
          Click to view works
        </p>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
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
      </motion.button>
    </div>
  );
}
