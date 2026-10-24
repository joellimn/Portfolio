"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion } from "motion/react";
import { PearlLogo } from "@/components/portfolio/OpeningBanner";
import { SiteFooter } from "@/components/portfolio/SiteFooter";
import { TopBar } from "@/components/portfolio/TopBar";

const LIGHT_MS = 2000;
const FADE_MS = 1000;
const HOLD_MS = 180;
const DOCK_MS = 1050;
const EASE = [0.22, 1, 0.36, 1] as const;

export function OpeningScreen({
  children,
  onLanded,
}: {
  children: ReactNode;
  onLanded?: () => void;
}) {
  const [reduced, setReduced] = useState(false);
  const [faded, setFaded] = useState(false);
  const [docked, setDocked] = useState(false);
  const [landed, setLanded] = useState(false);
  const [flyerGone, setFlyerGone] = useState(false);
  const markRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const timers = useRef<number[]>([]);
  const flightRef = useRef<{ stop: () => void } | null>(null);

  const finish = () => {
    setLanded(true);
    onLanded?.();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlyerGone(true));
    });
  };

  const dock = () => {
    const mark = markRef.current;
    const slot = slotRef.current;
    const dest = slot?.querySelector(".nav-flower") ?? slot;
    if (!mark || !dest) {
      setDocked(true);
      finish();
      return;
    }

    const from = mark.getBoundingClientRect();
    const to = dest.getBoundingClientRect();
    const scale = to.height / from.height;
    const x = to.left - from.left;
    const y = to.top - from.top;

    mark.style.position = "fixed";
    mark.style.left = `${from.left}px`;
    mark.style.top = `${from.top}px`;
    mark.style.transformOrigin = "top left";
    mark.style.willChange = "transform";
    mark.style.zIndex = "35";
    mark.style.backfaceVisibility = "hidden";
    setDocked(true);

    const flight = animate(
      mark,
      { x, y, scale },
      {
        duration: DOCK_MS / 1000,
        ease: EASE,
        onComplete: finish,
      },
    );
    flightRef.current = flight;
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setReduced(true);
      setFaded(true);
      setDocked(true);
      finish();
      return;
    }

    timers.current.push(window.setTimeout(() => setFaded(true), LIGHT_MS));
    timers.current.push(
      window.setTimeout(dock, LIGHT_MS + FADE_MS + HOLD_MS),
    );

    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
      flightRef.current?.stop();
    };
    // dock only reads refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (landed || reduced) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [landed, reduced]);

  const settled = docked || reduced;

  return (
    <section
      className={[
        "relative flex w-full flex-col gap-[32px] bg-white font-source",
        flyerGone || reduced ? "min-h-screen" : "h-screen overflow-hidden",
      ].join(" ")}
    >
      {reduced ? null : (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-20"
          initial={{ backgroundColor: "#101010" }}
          animate={{
            backgroundColor: faded ? "#ffffff" : "#101010",
            opacity: docked ? 0 : 1,
          }}
          transition={{
            backgroundColor: { duration: FADE_MS / 1000, ease: EASE },
            opacity: { duration: DOCK_MS / 1000, ease: EASE },
          }}
        />
      )}

      <TopBar
        logoSlotRef={slotRef}
        hideLogo={!landed && !reduced}
        hideNav={!settled}
        className={`transition-opacity ${
          faded || reduced ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: `${FADE_MS}ms` }}
      />

      {reduced || flyerGone ? null : (
        <div className="pointer-events-none fixed inset-0 z-[35] flex items-center justify-center">
          <PearlLogo markRef={markRef} once faded={faded} />
        </div>
      )}

      <motion.div
        data-opening-body
        className="relative z-10 flex flex-col gap-[32px]"
        initial={reduced ? false : { y: "48vh", opacity: 0 }}
        animate={settled ? { y: 0, opacity: 1 } : { y: "48vh", opacity: 0 }}
        transition={{ duration: DOCK_MS / 1000, ease: EASE }}
      >
        {children}
        <SiteFooter />
      </motion.div>
    </section>
  );
}
