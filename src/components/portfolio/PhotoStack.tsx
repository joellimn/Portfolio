"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useTickAudio } from "@/hooks/useTickAudio";

const NYC_PHOTOS = [
  {
    src: "/assets/portfolio-v2/nyc/01-front.jpg",
    alt: "Joel in New York, making a heart over an I Love NY shirt",
  },
  {
    src: "/assets/portfolio-v2/nyc/02-img-6033.jpg",
    alt: "Joel and friends in New York with the Empire State Building",
  },
  {
    src: "/assets/portfolio-v2/nyc/03-img-6497.jpg",
    alt: "New York City photo",
  },
  {
    src: "/assets/portfolio-v2/nyc/04-img-6475.jpg",
    alt: "New York City photo",
  },
  {
    src: "/assets/portfolio-v2/nyc/05-img-6113.jpg",
    alt: "New York City photo",
  },
  {
    src: "/assets/portfolio-v2/nyc/06-img-6482.jpg",
    alt: "New York City photo",
  },
  {
    src: "/assets/portfolio-v2/nyc/07-img-6290.jpg",
    alt: "New York City photo",
  },
] as const;

type Photo = (typeof NYC_PHOTOS)[number];

const STACK = [
  { rotate: 0, x: 0, y: 0, scale: 1 },
  { rotate: -7.5, x: -10, y: 8, scale: 0.98 },
  { rotate: 6.5, x: 12, y: 14, scale: 0.96 },
  { rotate: -4, x: -4, y: 20, scale: 0.94 },
] as const;

export function PhotoStack() {
  const [photos, setPhotos] = useState<Photo[]>(() => [...NYC_PHOTOS]);
  const [flyingSrc, setFlyingSrc] = useState<string | null>(null);
  const flyTimer = useRef<number | null>(null);
  const playTick = useTickAudio(true);

  useEffect(() => {
    return () => {
      if (flyTimer.current != null) window.clearTimeout(flyTimer.current);
    };
  }, []);

  const showNext = () => {
    if (flyingSrc || photos.length < 2) return;
    const leaving = photos[0];
    playTick("right", 180);
    setFlyingSrc(leaving.src);
    flyTimer.current = window.setTimeout(() => {
      setPhotos((current) => {
        const [first, ...rest] = current;
        if (first.src !== leaving.src) return current;
        return [...rest, first];
      });
      setFlyingSrc(null);
      flyTimer.current = null;
    }, 420);
  };

  const rest = photos
    .filter((photo) => photo.src !== flyingSrc)
    .slice(0, STACK.length);
  const flying = photos.find((photo) => photo.src === flyingSrc) ?? null;
  const layered = flying ? [flying, ...rest] : rest;

  return (
    <button
      type="button"
      onClick={showNext}
      aria-label="Show next photo"
      data-cursor="click"
      className="relative h-[360px] w-[340px] shrink-0"
    >
      {layered.map((photo, index) => {
        const isFlying = flyingSrc === photo.src;
        const poseIndex = isFlying ? 0 : flyingSrc ? index - 1 : index;
        const pose = STACK[Math.max(poseIndex, 0)] ?? STACK[0];
        const isTop = !flyingSrc && index === 0;

        return (
          <motion.div
            key={photo.src}
            className="absolute top-[12px] left-[16px] h-[336px] w-[308px] overflow-hidden rounded-[32px] bg-neutral-100 shadow-[4px_8px_20px_rgba(0,0,0,0.12)]"
            style={{ transformOrigin: "center 80%" }}
            initial={false}
            animate={
              isFlying
                ? { x: 220, y: -28, rotate: 18, opacity: 0, scale: 1, zIndex: 50 }
                : {
                    rotate: pose.rotate,
                    x: pose.x,
                    y: pose.y,
                    scale: pose.scale,
                    opacity: 1,
                    zIndex: layered.length - index,
                  }
            }
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            whileHover={
              isTop ? { y: pose.y - 6, scale: 1.02 } : undefined
            }
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="640px"
              quality={95}
              priority={index < 2}
            />
          </motion.div>
        );
      })}
    </button>
  );
}
