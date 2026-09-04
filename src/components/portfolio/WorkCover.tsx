"use client";

import Image from "next/image";
import { useRef } from "react";

const PHASE_MS = 700;

type WorkCoverProps = {
  cover: string;
  video?: string;
  playOnHover?: boolean;
};

export function WorkCover({
  cover,
  video,
  playOnHover = false,
}: WorkCoverProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const resetTimer = useRef<number>(0);

  if (!video) {
    return (
      <Image
        src={cover}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover"
        quality={95}
        unoptimized
        priority
      />
    );
  }

  if (!playOnHover) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={cover}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={encodeURI(video)} type="video/mp4" />
      </video>
    );
  }

  const phaseIn = () => {
    window.clearTimeout(resetTimer.current);
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play();
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
      onMouseEnter={phaseIn}
      onMouseLeave={phaseOut}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-out group-hover/cover:opacity-100 motion-reduce:transition-none"
      >
        <source src={encodeURI(video)} type="video/mp4" />
      </video>
      <Image
        src={cover}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover transition-opacity duration-700 ease-out group-hover/cover:opacity-0 motion-reduce:transition-none"
        quality={95}
        unoptimized
        priority
      />
    </div>
  );
}
