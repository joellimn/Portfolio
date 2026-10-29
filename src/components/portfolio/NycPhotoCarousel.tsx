"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const PHOTOS = [
  {
    src: "/assets/portfolio-v2/nyc/04-img-6475.jpg",
    alt: "Standing with friends on the steps of the Met",
    position: "center bottom",
  },
  {
    src: "/assets/portfolio-v2/nyc/05-img-6113.jpg",
    alt: "Sitting in front of the carousel at Pier 17",
    position: "center 56%",
  },
  {
    src: "/assets/portfolio-v2/nyc/01-front.jpg",
    alt: "Wearing an I Love NY shirt with the skyline behind",
    position: "center bottom",
  },
  {
    src: "/assets/portfolio-v2/nyc/06-img-6482.jpg",
    alt: "With friends in front of a row of high-rises",
    position: "center",
  },
  {
    src: "/assets/portfolio-v2/nyc/03-img-6497.jpg",
    alt: "The Oculus at the World Trade Center",
    position: "center",
  },
  {
    src: "/assets/portfolio-v2/nyc/07-img-6290.jpg",
    alt: "On the Brooklyn Bridge with the Manhattan skyline behind",
    position: "center 28%",
  },
  {
    src: "/assets/portfolio-v2/nyc/10-img-5690.jpg",
    alt: "Iced matcha latte on a cafe counter",
    position: "center",
  },
  {
    src: "/assets/portfolio-v2/nyc/11-img-6258.jpg",
    alt: "Fragrance display at Le Labo",
    position: "center",
  },
  {
    src: "/assets/portfolio-v2/nyc/12-img-6311.jpg",
    alt: "Cheers with friends and a table of drinks",
    position: "center",
  },
] as const;

function PhotoSet({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="nyc-set" aria-hidden={hidden || undefined}>
      {PHOTOS.map((photo) => (
        <div
          key={`${hidden ? "dup-" : ""}${photo.src}`}
          className="nyc-slide relative aspect-[308/336] overflow-hidden"
        >
          <Image
            src={photo.src}
            alt={hidden ? "" : photo.alt}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
        </div>
      ))}
    </div>
  );
}

/** Pauses off screen, on keyboard focus, and on tap or click — anything that
 * moves for longer than five seconds needs a way to stop it. */
export function NycPhotoCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setOffscreen(!entry?.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="region"
      tabIndex={0}
      data-paused={offscreen || held ? "" : undefined}
      onClick={() => setHeld((value) => !value)}
      className="nyc-carousel overflow-hidden px-[32px] py-[16px] outline-none focus-visible:ring-2 focus-visible:ring-black/20"
      aria-label="Photos from my recent trip to NYC"
    >
      <div className="nyc-track">
        <PhotoSet />
        <PhotoSet hidden />
      </div>
    </div>
  );
}
