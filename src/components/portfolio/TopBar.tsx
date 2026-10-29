"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type Ref } from "react";
import { usePathname } from "next/navigation";
import { RESUME } from "@/data/contact";
import { projects } from "@/data/projects";

const LINKS = [
  { href: "/", label: "Work" },
  { href: RESUME, label: "Resume", external: true },
  { href: "/about", label: "About" },
] as const;

const linkClass = (active: boolean, last = false) =>
  `${last ? "pl-4 pr-0" : "px-4"} py-2 text-[16px] leading-[24px] font-light tracking-[-1px] transition-colors ${
    active ? "text-black" : "text-black/50 hover:text-black"
  }`;

/** Case studies live at `/{slug}` and read as part of Work, so the Work link
 * stays lit while one is open. */
function isWork(pathname: string) {
  return (
    pathname === "/" || projects.some((project) => pathname === `/${project.id}`)
  );
}

const LOGO_SPIN = "portfolio:logo-spin";

function spinNavFlower() {
  window.dispatchEvent(new Event(LOGO_SPIN));
}

function useShowName(enabled: boolean) {
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setShowName(false);
      return;
    }

    const mark = document.querySelector("[data-nav-swap]");
    if (!mark) {
      setShowName(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowName(!entry?.isIntersecting);
      },
      { rootMargin: "-56px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(mark);
    return () => observer.disconnect();
  }, [enabled]);

  return showName;
}

export function TopBar({
  logoSlotRef,
  hideLogo = false,
  hideNav = false,
  className = "",
  style,
}: {
  logoSlotRef?: Ref<HTMLSpanElement | null>;
  hideLogo?: boolean;
  hideNav?: boolean;
  className?: string;
  style?: CSSProperties;
} = {}) {
  const pathname = usePathname();
  const showName = useShowName(pathname === "/" && !hideLogo);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const start = () => {
      setSpinning(false);
      requestAnimationFrame(() => setSpinning(true));
    };
    window.addEventListener(LOGO_SPIN, start);
    return () => window.removeEventListener(LOGO_SPIN, start);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between bg-white/65 px-4 backdrop-blur-xl backdrop-saturate-150 ${className}`}
      style={style}
    >
      <Link
        href="/"
        aria-label="Joel Lim"
        className="relative grid py-2 text-[16px] leading-[24px] font-light tracking-[-1px] text-black"
        onClick={spinNavFlower}
      >
        <span
          ref={logoSlotRef}
          data-logo-slot
          className={`col-start-1 row-start-1 inline-block ${
            hideLogo
              ? "opacity-0"
              : `transition-opacity duration-300 ease-out ${
                  showName ? "opacity-0" : "opacity-100"
                }`
          }`}
        >
          <span
            className={`nav-flower${spinning ? " is-spinning" : ""}`}
            onAnimationEnd={() => setSpinning(false)}
          />
        </span>
        <span
          aria-hidden
          className={`col-start-1 row-start-1 whitespace-nowrap transition-opacity duration-300 ease-out ${
            showName && !hideLogo ? "opacity-100" : "opacity-0"
          }`}
        >
          Joel Lim
        </span>
      </Link>
      <nav
        aria-label="Pages"
        className={`flex items-center transition-opacity duration-1000 ${
          hideNav ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {LINKS.map((item, i) => {
          const last = i === LINKS.length - 1;
          if ("external" in item && item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="external"
                className={linkClass(false, last)}
              >
                {item.label}
              </a>
            );
          }

          const active =
            item.href === "/" ? isWork(pathname) : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={linkClass(active, last)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
