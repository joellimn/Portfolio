"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";
import { useReducedMotion } from "motion/react";

const PHASE_MS = 200;

type WorkCoverProps = {
  cover: string;
  video?: string;
  playOnHover?: boolean;
  fit?: "cover" | "contain";
};

function CoverImage({ cover, className }: { cover: string; className: string }) {
  return (
    <Image
      src={cover}
      alt=""
      fill
      sizes="(max-width: 640px) 100vw, 50vw"
      className={className}
      quality={95}
      unoptimized
      priority
    />
  );
}

/** Loops only while on screen — off-screen autoplay chokes iOS. */
function AutoplayVideo({
  cover,
  video,
  objectFit,
}: {
  cover: string;
  video: string;
  objectFit: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      poster={cover}
      className={`absolute inset-0 h-full w-full ${objectFit}`}
    >
      <source src={encodeURI(video)} type="video/mp4" />
    </video>
  );
}

export function WorkCover({
  cover,
  video,
  playOnHover = false,
  fit = "cover",
}: WorkCoverProps) {
  const objectFit = fit === "contain" ? "object-contain" : "object-cover";
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const resetTimer = useRef<number>(0);

  if (!video || (reduced && !playOnHover)) {
    return <CoverImage cover={cover} className={objectFit} />;
  }

  if (!playOnHover) {
    return <AutoplayVideo cover={cover} video={video} objectFit={objectFit} />;
  }

  const phaseIn = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(resetTimer.current);
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {});
  };

  const phaseOut = () => {
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      const el = videoRef.current;
      if (!el) return;
      el.pause();
      el.currentTime = 0;
    }, PHASE_MS);
  };

  return (
    <div
      className="group/cover absolute inset-0"
      onPointerEnter={phaseIn}
      onPointerLeave={phaseOut}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full ${objectFit} opacity-0 transition-opacity duration-200 ease-out group-hover/cover:opacity-100 motion-reduce:transition-none`}
      >
        <source src={encodeURI(video)} type="video/mp4" />
      </video>
      <CoverImage
        cover={cover}
        className={`${objectFit} transition-opacity duration-200 ease-out group-hover/cover:opacity-0 motion-reduce:transition-none`}
      />
    </div>
  );
}
