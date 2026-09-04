"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Link from "next/link";
import { animate, motion } from "motion/react";
import { Wordmark } from "@/components/portfolio/Wordmark";

/** Same hue sets as the footer tags. Origins follow the mockup triangle:
 *  top above ㅊ, then bottom-left, then bottom-right. */
const WASHES = [
  {
    name: "Orphéon",
    hues: [292, 268, 312, 250, 328],
    ox: "50%",
    oy: "28%",
  },
  {
    name: "Light Blue",
    hues: [205, 188, 222, 172, 236],
    ox: "28%",
    oy: "70%",
  },
  {
    name: "Thé Noir 29",
    hues: [62, 38, 78, 28, 95],
    ox: "72%",
    oy: "70%",
  },
] as const;

const LINKS = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
] as const;

const STAGGER_MS = 280;
const DOCK_MS = 1050;
/** Start the flight shortly after the mark reads as black — don't wait
 *  out the wash animation's invisible tail. */
const DOCK_AFTER_MS = 3450;
const EASE = [0.22, 1, 0.36, 1] as const;

type Ripple = { id: number; wash: number };

export function OpeningScreen({
  children,
  onLanded,
}: {
  children: ReactNode;
  onLanded?: () => void;
}) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [reduced, setReduced] = useState(false);
  const [docked, setDocked] = useState(false);
  const [landed, setLanded] = useState(false);
  const markRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);
  const flightRef = useRef<{ stop: () => void } | null>(null);

  const finish = () => {
    setLanded(true);
    onLanded?.();
  };

  const dock = () => {
    const mark = markRef.current;
    const slot = slotRef.current;
    if (!mark || !slot) {
      setDocked(true);
      finish();
      return;
    }

    const from = mark.getBoundingClientRect();
    const to = slot.getBoundingClientRect();
    const scale = to.width / from.width;
    const x = to.left - from.left;
    const y = to.top - from.top;

    mark.style.position = "fixed";
    mark.style.left = `${from.left}px`;
    mark.style.top = `${from.top}px`;
    mark.style.transformOrigin = "top left";
    mark.style.willChange = "transform";
    mark.style.zIndex = "30";
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
      setDocked(true);
      finish();
      return;
    }

    const spawn = (wash: number) => {
      nextId.current += 1;
      const id = nextId.current;
      setRipples((current) => [...current, { id, wash }]);
    };

    WASHES.forEach((_, index) => {
      timers.current.push(
        window.setTimeout(() => spawn(index), index * STAGGER_MS),
      );
    });

    timers.current.push(window.setTimeout(dock, DOCK_AFTER_MS));

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
        "relative flex w-full flex-col gap-[32px] bg-white",
        landed || reduced ? "min-h-screen" : "h-screen overflow-hidden",
      ].join(" ")}
    >
      {(reduced
        ? [{ id: -1, wash: 0 }]
        : ripples
      ).map((ripple) => {
        const wash = WASHES[ripple.wash];
        return (
          <div
            key={ripple.id}
            aria-hidden
            className={[
              "footer-wash opening-wash pointer-events-none fixed inset-0",
              reduced ? "is-held" : "is-rippling",
            ].join(" ")}
            style={
              {
                "--ox": wash.ox,
                "--oy": wash.oy,
                "--hue1": wash.hues[0],
                "--hue2": wash.hues[1],
                "--hue3": wash.hues[2],
                "--hue4": wash.hues[3],
                "--hue5": wash.hues[4],
              } as CSSProperties
            }
          />
        );
      })}

      <header className="pointer-events-none relative z-20 flex items-center justify-between px-2 sm:px-4">
        <Link
          href="/"
          aria-label="Joel Lim"
          className="pointer-events-auto p-3 text-black sm:p-4"
        >
          <span
            ref={slotRef}
            className={`inline-block ${landed || reduced ? "" : "opacity-0"}`}
          >
            <Wordmark className="w-[63px]" />
          </span>
        </Link>
        <nav
          aria-label="Pages"
          className="pointer-events-auto flex items-center"
        >
          {LINKS.map(({ href, label }) => (
            <motion.div
              key={href}
              initial={false}
              animate={{ opacity: settled ? 1 : 0 }}
              transition={{ duration: DOCK_MS / 1000, ease: EASE }}
              className={settled ? "" : "pointer-events-none"}
            >
              <Link
                href={href}
                aria-current={href === "/" ? "page" : undefined}
                className={`p-3 text-[16px] leading-[24px] tracking-[-1px] transition-colors sm:p-4 ${
                  href === "/"
                    ? "text-black"
                    : "text-black/50 hover:text-black"
                }`}
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </header>

      {reduced || landed ? null : (
        <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center">
          <Wordmark
            ref={markRef}
            className="opening-ink w-[700px] max-w-[90vw]"
          />
        </div>
      )}

      <motion.div
        data-opening-body
        className="relative z-10 flex flex-col gap-[32px]"
        initial={reduced ? false : { y: "48vh", opacity: 0 }}
        animate={
          settled ? { y: 0, opacity: 1 } : { y: "48vh", opacity: 0 }
        }
        transition={{ duration: DOCK_MS / 1000, ease: EASE }}
      >
        {children}
      </motion.div>
    </section>
  );
}
