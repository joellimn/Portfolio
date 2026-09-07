"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  useEmailCopy,
} from "@/components/portfolio/contactLinks";
import { LINKEDIN, RESUME } from "@/data/contact";

const DESIGN_W = 1200;
/** Extra drop so the line sits lower; bottles are a bit smaller than the
 * original hang. */
const LINE_DROP = 72;
const TAG_SCALE = 0.8;
/** Tall enough for Cococay plus the flatter sag, with a little air. */
const DESIGN_H = 340 + LINE_DROP;
const MAX_ASSEMBLY_W = 1600;

/** Flatter than the Figma spec (~103px sag → ~60px on 1200). */
const LINE_FX = [0, 466.3 / DESIGN_W, 729.008 / DESIGN_W, 1] as const;
const LINE_Y = [
  1 + LINE_DROP,
  60 + LINE_DROP,
  61 + LINE_DROP,
  1 + LINE_DROP,
] as const;

const TAGS = [
  {
    src: "/assets/footer/tag-the-noir.png?v=3",
    alt: "Le Labo Thé Noir 29",
    w: 94,
    h: 200,
    hole: 8,
    fx: 0.14,
    hues: [62, 38, 78, 28, 95],
  },
  {
    src: "/assets/footer/tag-light-blue.png?v=3",
    alt: "Dolce & Gabbana Light Blue",
    w: 117,
    h: 194,
    hole: 8,
    fx: 0.32,
    hues: [205, 188, 222, 172, 236],
  },
  {
    src: "/assets/footer/tag-orpheon.png?v=3",
    alt: "Diptyque Orphéon",
    w: 134,
    h: 220,
    hole: 8,
    fx: 0.5,
    hues: [292, 268, 312, 250, 328],
  },
  {
    src: "/assets/footer/tag-explorer.png?v=3",
    alt: "Montblanc Explorer",
    w: 98,
    h: 212,
    hole: 8,
    fx: 0.68,
    hues: [108, 82, 132, 68, 148],
  },
  {
    src: "/assets/footer/tag-cococay.png?v=4",
    alt: "Granhand Cococay",
    w: 105,
    h: 209,
    hole: 8,
    fx: 0.86,
    hues: [86, 52, 102, 38, 74],
  },
] as const;

const PAGES = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
] as const;

const CASE_PAGES = [
  { href: "/", label: "Work" },
  { href: "/listening-room", label: "Listening room" },
  { href: "/about", label: "About" },
] as const;

export type CaseStudyFooterNext = {
  href: string;
  kicker: string;
  title: string;
  tag: number;
  fx?: number;
};

/** Next-project footers from the V4 Figma specs, in work-page order. */
export const CASE_STUDY_FOOTER: Record<string, CaseStudyFooterNext> = {
  umg: {
    href: "/soar",
    kicker: "See also:",
    title: "My interaction design work with the U.S. Army",
    tag: 0,
  },
  soar: {
    href: "/wearitt",
    kicker: "Next Project:",
    title: "Building a design system for a mobile wardrobe app.",
    tag: 2,
    fx: 0.64,
  },
  wearitt: {
    href: "/wttin",
    kicker: "See also:",
    title: "Designing and deploying a mobile app for a non-profit",
    tag: 4,
  },
  wttin: {
    href: "/umg",
    kicker: "Next Project:",
    title: "Redesigning low-code tools with AI.",
    tag: 3,
  },
};

const columnHeading =
  "px-[8px] py-[4px] text-[16px] leading-normal font-medium text-black";
const columnLink =
  "px-[8px] py-[4px] text-[16px] leading-normal text-black/50 transition-colors hover:text-black";

function bezier(t: number, p: readonly number[]) {
  const u = 1 - t;
  return (
    u * u * u * p[0] +
    3 * u * u * t * p[1] +
    3 * u * t * t * p[2] +
    t * t * t * p[3]
  );
}

function lineYAt(x: number, xs: readonly number[], ys: readonly number[]) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i += 1) {
    const mid = (lo + hi) / 2;
    if (bezier(mid, xs) < x) lo = mid;
    else hi = mid;
  }
  return bezier((lo + hi) / 2, ys);
}

export function SiteFooter({ next }: { next?: CaseStudyFooterNext } = {}) {
  const { copied, copyEmail } = useEmailCopy();
  const footer = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef<{ x: number; y: number } | null>(null);
  const pendula = useRef(TAGS.map(() => ({ theta: 0, vel: 0 })));
  const [width, setWidth] = useState(DESIGN_W);
  const [stageTop, setStageTop] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [washes, setWashes] = useState<number[]>([]);
  const [reduced, setReduced] = useState(false);
  const activeRef = useRef<number | null>(null);
  const playing = useRef(TAGS.map(() => false));
  const visible = next ? [next.tag] : TAGS.map((_, index) => index);
  const pages = next ? CASE_PAGES : PAGES;
  const featured = next ? TAGS[next.tag] : null;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min(width, MAX_ASSEMBLY_W) / DESIGN_W;
  const height = DESIGN_H * scale;
  const xs = LINE_FX.map((fraction) => fraction * width);
  const ys = LINE_Y.map((y) => y * scale);
  const tagFx = (index: number) =>
    next?.tag === index && next.fx != null ? next.fx : TAGS[index].fx;
  const hangs = TAGS.map((tag, index) => {
    const x = tagFx(index) * width;
    return { x, y: lineYAt(x, xs, ys) };
  });
  useEffect(() => {
    const footerEl = footer.current;
    const stageEl = stage.current;
    if (!footerEl || !stageEl) return;
    const sync = () => {
      setStageTop(
        stageEl.getBoundingClientRect().top -
          footerEl.getBoundingClientRect().top,
      );
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, [width]);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const pointer = mouse.current;

      TAGS.forEach((tag, index) => {
        const p = pendula.current[index];
        const hangX = tagFx(index) * width;
        let acc = -22 * Math.sin(p.theta);

        if (pointer && active === index) {
          acc += ((pointer.x - hangX) / 70) * 16;
        }

        p.vel = (p.vel + acc * dt) * 0.935;
        p.theta = Math.max(-0.4, Math.min(0.4, p.theta + p.vel * dt));
        const node = tagRefs.current[index];
        if (node) {
          node.style.transform = `rotate(${p.theta}rad)`;
        }
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduced, width]);

  const hitTest = (x: number, y: number) => {
    for (const i of visible) {
      const tag = TAGS[i];
      const hang = hangs[i];
      const tw = tag.w * scale * TAG_SCALE;
      const th = tag.h * scale * TAG_SCALE;
      const left = hang.x - tw / 2;
      const top = hang.y - tag.hole * scale * TAG_SCALE;
      if (x >= left && x <= left + tw && y >= top && y <= top + th) {
        return i;
      }
    }
    return null;
  };

  const spawnRipple = (index: number) => {
    if (reduced) return;
    if (playing.current[index]) return;
    playing.current[index] = true;
    setWashes((current) =>
      current.includes(index) ? current : [...current, index],
    );
  };

  const locate = (event: React.PointerEvent<HTMLElement>) => {
    const stageBox = stage.current?.getBoundingClientRect();
    if (!stageBox) return undefined;
    const x = event.clientX - stageBox.left;
    const y = event.clientY - stageBox.top;
    mouse.current = { x, y };
    return hitTest(x, y);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const hit = locate(event);
    if (hit === undefined) return;
    if (hit !== activeRef.current) {
      activeRef.current = hit;
      setActive(hit);
      if (hit !== null) spawnRipple(hit);
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const hit = locate(event);
    if (hit === undefined || hit === null) return;
    activeRef.current = hit;
    setActive(hit);
    spawnRipple(hit);
  };

  const onPointerLeave = () => {
    mouse.current = null;
    activeRef.current = null;
    setActive(null);
  };

  return (
    <footer
      ref={footer}
      className="relative flex w-full flex-col items-start overflow-hidden py-[32px]"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerLeave}
    >
      {(reduced && active !== null ? [active] : washes).map((index) => {
        const tag = TAGS[index];
        const hang = hangs[index];
        return (
          <div
            key={index}
            aria-hidden
            className={[
              "footer-wash pointer-events-none absolute inset-0",
              reduced ? "is-held" : "is-rippling",
            ].join(" ")}
            style={
              {
                "--ox": `${hang.x}px`,
                "--oy": `${stageTop + hang.y + tag.h * scale * TAG_SCALE * 0.42}px`,
                "--hue1": tag.hues[0],
                "--hue2": tag.hues[1],
                "--hue3": tag.hues[2],
                "--hue4": tag.hues[3],
                "--hue5": tag.hues[4],
              } as CSSProperties
            }
            onAnimationEnd={(event) => {
              if (event.animationName !== "footer-ripple") return;
              playing.current[index] = false;
              setWashes((current) => current.filter((item) => item !== index));
            }}
          />
        );
      })}

      {next ? null : (
        <div className="relative z-10 flex w-full flex-col items-start px-[32px]">
          <p className="text-[24px] leading-normal text-black">
            Inspired by my favorite scents.
          </p>
          <p className="font-serif text-[24px] leading-normal text-white italic">
            This website smells good.
          </p>
        </div>
      )}

      <div ref={stage} className="relative z-10 w-full" style={{ height }}>
        {next && featured ? (
          <div
            className={`absolute z-10 max-w-[min(100%-4rem,566px)] ${
              featured.fx < 0.45 ? "right-8 left-1/2" : "left-8 right-1/2"
            }`}
            style={{
              top: hangs[next.tag].y + featured.h * scale * TAG_SCALE * 0.28,
            }}
          >
            <p className="text-[24px] leading-normal text-black">{next.kicker}</p>
            <Link
              href={next.href}
              data-cursor="case-study"
              className="block text-[24px] leading-normal text-black transition-colors hover:text-black/60"
            >
              {next.title}
            </Link>
          </div>
        ) : null}
        {visible.map((index) => {
          const tag = TAGS[index];
          const hang = hangs[index];
          const tw = tag.w * scale * TAG_SCALE;
          const th = tag.h * scale * TAG_SCALE;
          const hole = tag.hole * scale * TAG_SCALE;
          return (
            <div
              key={tag.src}
              ref={(node) => {
                tagRefs.current[index] = node;
              }}
              className="footer-tag-wrap absolute"
              style={{
                left: hang.x - tw / 2,
                top: hang.y - hole,
                width: tw,
                height: th,
                transformOrigin: `${tw / 2}px ${hole}px`,
              }}
            >
              <Image
                src={tag.src}
                alt={tag.alt}
                fill
                sizes="15vw"
                className="footer-tag object-fill"
                unoptimized
              />
            </div>
          );
        })}

        <svg
          aria-hidden
          viewBox={`0 0 ${width} ${height}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <path
            d={`M ${xs[0]} ${ys[0]} C ${xs[1]} ${ys[1]}, ${xs[2]} ${ys[2]}, ${xs[3]} ${ys[3]}`}
            fill="none"
            stroke="#c4a06a"
            strokeWidth={2 * scale}
          />
        </svg>
      </div>

      <div className="relative z-10 flex w-full items-start justify-end gap-[64px] px-[32px]">
        <nav aria-label="Pages, footer" className="flex flex-col items-start">
          <p className={columnHeading}>Page</p>
          {pages.map(({ href, label }) => (
            <Link key={href} href={href} className={columnLink}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-start">
          <p className={columnHeading}>Contact</p>
          <button
            type="button"
            onClick={copyEmail}
            data-cursor="copy"
            data-copied={copied}
            className={`${columnLink} text-left`}
          >
            Email
          </button>
          <ExternalLink
            href={LINKEDIN}
            label="LinkedIn"
            className={columnLink}
          />
          <ExternalLink href={RESUME} label="Resume" className={columnLink} />
        </div>
      </div>
    </footer>
  );
}
