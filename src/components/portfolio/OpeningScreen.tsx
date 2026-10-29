"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PearlLogo } from "@/components/portfolio/OpeningBanner";
import { SiteFooter } from "@/components/portfolio/SiteFooter";
import { TopBar } from "@/components/portfolio/TopBar";
import { OPENING_SEEN_ATTR, OPENING_SEEN_KEY } from "@/lib/opening";

const LIGHT_MS = 2000;
const FADE_MS = 1000;
const HOLD_MS = 180;
const DOCK_MS = 1050;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const SKIP_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

function hasSeenOpening() {
  try {
    return sessionStorage.getItem(OPENING_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberOpening() {
  try {
    sessionStorage.setItem(OPENING_SEEN_KEY, "1");
  } catch {}
}

export function OpeningScreen({
  children,
  onLanded,
}: {
  children: ReactNode;
  onLanded?: () => void;
}) {
  const [instant, setInstant] = useState(false);
  const [faded, setFaded] = useState(false);
  const [docked, setDocked] = useState(false);
  const [landed, setLanded] = useState(false);
  const [flyerGone, setFlyerGone] = useState(false);
  const markRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const timers = useRef<number[]>([]);
  const flightRef = useRef<Animation | null>(null);
  const instantRef = useRef<boolean | null>(null);
  const dockingRef = useRef(false);

  const finish = () => {
    setLanded(true);
    onLanded?.();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlyerGone(true));
    });
  };

  const dock = () => {
    if (dockingRef.current) return;
    dockingRef.current = true;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];

    const mark = markRef.current;
    const slot = slotRef.current;
    const dest = slot?.querySelector(".nav-flower") ?? slot;
    setFaded(true);
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
    setDocked(true);

    const flight = mark.animate(
      [
        { transform: "translate3d(0, 0, 0) scale(1)" },
        { transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` },
      ],
      { duration: DOCK_MS, easing: EASE, fill: "forwards" },
    );
    flight.onfinish = finish;
    flightRef.current = flight;
  };

  useLayoutEffect(() => {
    if (instantRef.current === null) {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      instantRef.current = reduced || hasSeenOpening();
    }
    if (instantRef.current) {
      setInstant(true);
      setFaded(true);
      setDocked(true);
      finish();
    }
    // runs once; finish only sets state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (instant) document.documentElement.removeAttribute(OPENING_SEEN_ATTR);
  }, [instant]);

  useEffect(() => {
    if (instantRef.current) return;
    rememberOpening();

    timers.current.push(window.setTimeout(() => setFaded(true), LIGHT_MS));
    timers.current.push(
      window.setTimeout(dock, LIGHT_MS + FADE_MS + HOLD_MS),
    );

    const skip = () => dock();
    SKIP_EVENTS.forEach((type) =>
      window.addEventListener(type, skip, { passive: true, once: true }),
    );

    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
      SKIP_EVENTS.forEach((type) => window.removeEventListener(type, skip));
      flightRef.current?.cancel();
      dockingRef.current = false;
    };
    // dock only reads refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (landed || instant) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [landed, instant]);

  const settled = docked || instant;

  return (
    <section
      data-opening-root
      className={[
        "relative flex w-full flex-col gap-[32px] bg-white font-source",
        flyerGone || instant ? "min-h-screen" : "h-screen overflow-hidden",
      ].join(" ")}
    >
      {instant ? null : (
        <div
          aria-hidden
          data-opening-overlay
          className="pointer-events-none fixed inset-0 z-20 bg-white"
          style={{
            opacity: docked ? 0 : 1,
            transition: `opacity ${DOCK_MS}ms ${EASE}`,
          }}
        >
          <div
            className="absolute inset-0 bg-[#101010]"
            style={{
              opacity: faded ? 0 : 1,
              transition: `opacity ${FADE_MS}ms ${EASE}`,
            }}
          />
        </div>
      )}

      <TopBar
        logoSlotRef={slotRef}
        hideLogo={!landed && !instant}
        hideNav={!settled}
        className={`transition-opacity ${
          faded || instant ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: `${FADE_MS}ms` }}
      />

      {instant || flyerGone ? null : (
        <div
          data-opening-flyer
          className="pointer-events-none fixed inset-0 z-[35] flex items-center justify-center"
        >
          <PearlLogo markRef={markRef} once faded={faded} />
        </div>
      )}

      <div
        data-opening-body
        className="relative z-10 flex flex-col gap-[32px]"
        style={{
          opacity: settled ? 1 : 0,
          transform: settled ? "none" : "translateY(48vh)",
          transition: instant
            ? "none"
            : `transform ${DOCK_MS}ms ${EASE}, opacity ${DOCK_MS}ms ${EASE}`,
        }}
      >
        {children}
        <SiteFooter />
      </div>
    </section>
  );
}
