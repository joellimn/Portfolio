"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";

type CoverArtProps = {
  project: Project;
  className?: string;
  priority?: boolean;
  /** When true and the project has cover reveal media, reveal after a short delay. */
  playing?: boolean;
};

const VIDEO_REVEAL_DELAY_MS = 500;
const VIDEO_CROSSFADE_MS = 450;

type CoverVideoLayout = {
  background: string;
  left: string;
  top: string;
  width: string;
  height: string;
  /** CSS border-radius for the video frame. */
  radius: string;
  /** Optional object-fit tweaks (e.g. mild letterbox crop). */
  videoStyle?: CSSProperties;
};

/**
 * Figma "Case study Covers" video frames (400×400 artboards).
 * WTTIN: phone portrait. SOAR: landscape dashboard window.
 * Wearitt uses a full-bleed still (no framed layout).
 */
const COVER_VIDEO_LAYOUTS: Record<string, CoverVideoLayout> = {
  wttin: {
    background: "linear-gradient(to bottom, #d0f1ff, #ffffff)",
    left: "33.25%",
    top: "13.25%",
    width: "33.5%",
    height: "73.25%",
    // 20px on 134×293 phone
    radius: "14.925% / 6.826%",
    videoStyle: {
      objectPosition: "center 54%",
      transform: "scale(1.025)",
    },
  },
  soar: {
    background: "#231f20",
    left: "11%",
    top: "22.25%",
    width: "78.25%",
    height: "55.75%",
    // 5px on 313×223 window
    radius: "1.597% / 2.242%",
  },
};

function isVideoSrc(src: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(src);
}

export function CoverArt({
  project,
  className = "",
  priority = false,
  playing = false,
}: CoverArtProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealSrc = project.coverVideoSrc;
  const hasReveal = Boolean(revealSrc);
  const revealIsVideo = Boolean(revealSrc && isVideoSrc(revealSrc));
  const layout = COVER_VIDEO_LAYOUTS[project.id];
  const [showReveal, setShowReveal] = useState(false);
  const [revealMounted, setRevealMounted] = useState(false);

  // Center cover: keep the original art briefly, then crossfade to reveal.
  // Leaving center: crossfade back, then unmount the reveal layer.
  useEffect(() => {
    if (!hasReveal) {
      setShowReveal(false);
      setRevealMounted(false);
      return;
    }

    if (!playing) {
      setShowReveal(false);
      const unmountTimer = window.setTimeout(() => {
        setRevealMounted(false);
      }, VIDEO_CROSSFADE_MS);
      return () => window.clearTimeout(unmountTimer);
    }

    setRevealMounted(true);
    const revealTimer = window.setTimeout(() => {
      setShowReveal(true);
    }, VIDEO_REVEAL_DELAY_MS);

    return () => window.clearTimeout(revealTimer);
  }, [playing, hasReveal]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !revealMounted || !revealIsVideo) return;

    // Start during the reveal delay so the crossfade lands on a live frame.
    video.currentTime = 0;
    const playAttempt = video.play();
    if (playAttempt) {
      playAttempt.catch(() => {
        // Autoplay can be blocked until a user gesture; Cover Flow
        // interaction usually unlocks it on the next settle.
      });
    }

    return () => {
      video.pause();
    };
  }, [revealMounted, revealIsVideo, revealSrc]);

  if (!hasReveal || !revealSrc) {
    return (
      <div className={`relative overflow-hidden bg-white ${className}`}>
        <Image
          src={project.coverSrc}
          alt={`${project.title} cover`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 60vw, 400px"
          priority={priority}
          unoptimized
          draggable={false}
        />
      </div>
    );
  }

  const frame = layout ?? COVER_VIDEO_LAYOUTS.wttin;

  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <Image
        src={project.coverSrc}
        alt={`${project.title} cover`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 60vw, 400px"
        priority={priority}
        unoptimized
        draggable={false}
      />

      {revealMounted ? (
        revealIsVideo ? (
          <div
            className="absolute inset-0 [container-type:size]"
            style={{
              background: frame.background,
              opacity: showReveal ? 1 : 0,
              transition: `opacity ${VIDEO_CROSSFADE_MS}ms ease-in-out`,
            }}
            aria-hidden={!showReveal}
          >
            <div
              className="absolute overflow-hidden border border-black/[0.08] bg-white"
              style={{
                left: frame.left,
                top: frame.top,
                width: frame.width,
                height: frame.height,
                borderRadius: frame.radius,
              }}
            >
              <video
                ref={videoRef}
                className="pointer-events-none absolute inset-0 size-full object-cover"
                style={frame.videoStyle}
                src={revealSrc}
                muted
                loop
                playsInline
                preload="auto"
                aria-label={`${project.title} cover video`}
              />
            </div>
          </div>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              opacity: showReveal ? 1 : 0,
              transition: `opacity ${VIDEO_CROSSFADE_MS}ms ease-in-out`,
            }}
            aria-hidden={!showReveal}
          >
            <Image
              src={revealSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 60vw, 400px"
              unoptimized
              draggable={false}
            />
          </div>
        )
      ) : null}
    </div>
  );
}
