"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { PearlLogo } from "@/components/portfolio/OpeningBanner";
import { SiteFooter } from "@/components/portfolio/SiteFooter";
import { TopBar } from "@/components/portfolio/TopBar";
import { OPENING_SEEN_ATTR, OPENING_SEEN_KEY } from "@/lib/opening";

const LIGHT_MS = 2000;
const FADE_MS = 1000;
const DOCK_MS = 1050;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Logo flight and page rise share one curve so they travel together. */
const FLIGHT_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const SKIP_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

const BLOOM_MS = 520;
const WIPE_SPAN_MS = FADE_MS - BLOOM_MS;
const COLS = 12;
const ROWS = 9;
/** Wipe layer overhangs the viewport so the blur never shows a soft edge. */
const BLEED = 0.15;

/** How deep the gaps between petals cut in (0 = circle). */
const PETAL_DEPTH = 0.5;
/** Petal outline r(θ) ∈ [1 - depth, 1], tips at 90° + k·60° like the logo. */
function petal(theta: number) {
  const lobe = Math.abs(Math.cos(3 * (theta - Math.PI / 2)));
  return 1 - PETAL_DEPTH + PETAL_DEPTH * lobe ** 1.5;
}

/** Inverse smoothstep: the bloom time at which the shrinking outline reaches t. */
function easedTime(t: number) {
  return 0.5 - Math.sin(Math.asin(1 - 2 * t) / 3);
}

/** Share of the wipe given to cells past the screen edge, so they creep in first. */
const HEAD_START = 0.12;

/** Wipe time (0–1) at which the outline has shrunk to depth t. */
function wipeTime(t: number) {
  return easedTime(Math.min(1, Math.max(0, (t + HEAD_START) / (1 + HEAD_START))));
}

/** How far the dark has shrunk (0 edge → 1 centre) when it closes over the logo. */
const LOGO_REACH = 0.82;
/** Pearl→ink swap starts as the wipe reaches the logo. */
const LOGO_SWAP_DELAY_MS = Math.round(wipeTime(LOGO_REACH) * WIPE_SPAN_MS);
/** The logo takes off as its ink settles, while the last of the dark clears. */
const FLIGHT_AT_MS = LOGO_SWAP_DELAY_MS + Math.round(BLOOM_MS * 0.6);

/**
 * Grid of slightly jittered circles. The dark that remains is a six-petal
 * flower shrinking into the logo: a circle blooms once the flower's outline
 * has shrunk past it.
 */
function makeBlooms(width: number, height: number) {
  const radius = Math.hypot(width, height) / 2;

  const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const jx = (((i * 37) % 11) / 11 - 0.5) * 0.03;
    const jy = (((i * 53) % 13) / 13 - 0.5) * 0.03;
    const x = col / (COLS - 1) + jx;
    const y = row / (ROWS - 1) + jy;
    const dx = (x * (1 + 2 * BLEED) - BLEED - 0.5) * width;
    const dy = (y * (1 + 2 * BLEED) - BLEED - 0.5) * height;
    const reach = Math.hypot(dx, dy) / radius / petal(Math.atan2(-dy, dx));
    return { x, y, depth: 1 - reach };
  });

  // Cells past the edge get a head start instead of all popping in at once.
  const lowest = Math.min(...cells.map((cell) => cell.depth));
  return cells.map(({ x, y, depth }) => ({
    x,
    y,
    delay: Math.round(
      wipeTime(depth >= 0 ? depth : (depth / -lowest) * HEAD_START) *
        WIPE_SPAN_MS,
    ),
  }));
}

/** The wipe is drawn at a quarter of the screen's resolution; upscaling softens it. */
const WIPE_RES = 0.25;
const BLOOM_VMAX = 0.4;

/** Soft white disc, matching a heavily blurred circle. */
function bloomSprite() {
  const size = 128;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = size;
  const ctx = sprite.getContext("2d")!;
  const r = size / 2;
  const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.3, "rgba(255,255,255,1)");
  gradient.addColorStop(0.55, "rgba(255,255,255,0.6)");
  gradient.addColorStop(0.8, "rgba(255,255,255,0.18)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return sprite;
}

/**
 * Six-petal wipe on a single small canvas: one layer for the compositor
 * instead of a hundred, and nothing left to repaint once it finishes.
 */
function CornerWipe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const blooms = makeBlooms(vw, vh);
    const width = Math.ceil(vw * (1 + 2 * BLEED) * WIPE_RES);
    const height = Math.ceil(vh * (1 + 2 * BLEED) * WIPE_RES);
    canvas.width = width;
    canvas.height = height;
    const sprite = bloomSprite();
    const full = Math.max(vw, vh) * BLOOM_VMAX * WIPE_RES;
    const last = Math.max(...blooms.map((b) => b.delay)) + BLOOM_MS;

    let start = 0;
    let frame = 0;
    const draw = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      ctx.clearRect(0, 0, width, height);
      for (const bloom of blooms) {
        const t = Math.min(1, Math.max(0, (elapsed - bloom.delay) / BLOOM_MS));
        if (t <= 0) continue;
        const eased = 1 - (1 - t) ** 4;
        const size = full * (0.6 + 0.4 * eased);
        ctx.globalAlpha = eased;
        ctx.drawImage(
          sprite,
          bloom.x * width - size / 2,
          bloom.y * height - size / 2,
          size,
          size,
        );
      }
      if (elapsed < last) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute block"
      style={{
        left: `-${BLEED * 100}%`,
        top: `-${BLEED * 100}%`,
        width: `${100 + BLEED * 200}%`,
        height: `${100 + BLEED * 200}%`,
      }}
    />
  );
}

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
  const [wiped, setWiped] = useState(false);
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
      { duration: DOCK_MS, easing: FLIGHT_EASE, fill: "forwards" },
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

    // Decode the page's images while the logo holds, not mid-slide.
    document
      .querySelectorAll<HTMLImageElement>("[data-opening-body] img")
      .forEach((img) => {
        img.loading = "eager";
        img.decode().catch(() => {});
      });

    timers.current.push(window.setTimeout(() => setFaded(true), LIGHT_MS));
    timers.current.push(
      window.setTimeout(dock, LIGHT_MS + FLIGHT_AT_MS),
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
    if (!faded || instant) return;
    const timer = window.setTimeout(() => setWiped(true), FADE_MS + 60);
    return () => window.clearTimeout(timer);
  }, [faded, instant]);

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
          {wiped ? null : (
            <div className="absolute inset-0 overflow-hidden bg-[#101010]">
              {faded ? <CornerWipe /> : null}
            </div>
          )}
        </div>
      )}

      <TopBar
        logoSlotRef={slotRef}
        hideLogo={!landed && !instant}
        hideNav={!settled}
        className={`transition-opacity duration-200 ${
          wiped || instant ? "opacity-100" : "opacity-0"
        }`}
      />

      {instant || flyerGone ? null : (
        <div
          data-opening-flyer
          style={
            {
              "--logo-swap-delay": `${LOGO_SWAP_DELAY_MS}ms`,
              "--logo-swap-ms": `${BLOOM_MS}ms`,
            } as CSSProperties
          }
          className="pointer-events-none fixed inset-0 z-[35] flex items-center justify-center"
        >
          <PearlLogo markRef={markRef} once faded={faded} />
        </div>
      )}

      <div
        data-opening-body
        className="relative z-10 flex flex-col gap-[32px]"
        style={{
          // The white overlay reveals the page, so only transform animates;
          // fading the whole page would force an offscreen render pass.
          opacity: settled ? 1 : 0,
          transform: settled ? "none" : "translateY(48vh)",
          transition: instant ? "none" : `transform ${DOCK_MS}ms ${FLIGHT_EASE}`,
        }}
      >
        {children}
        <SiteFooter />
      </div>
    </section>
  );
}
