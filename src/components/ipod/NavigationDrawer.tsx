"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, Copy, SquareArrowOutUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  statusBarHeightCqi,
  type ChromeDensity,
} from "@/lib/chromeDensity";

export type NavTarget = "projects" | "about";

type NavEntry =
  | { type: "screen"; label: string; target: NavTarget }
  | {
      type: "link";
      label: string;
      href: string;
      action: "copy" | "external";
      /** Plain text to copy when action is "copy". */
      copyValue?: string;
    };

// TODO: keep these in sync with AboutScreen's contact links.
const NAV_ENTRIES: NavEntry[] = [
  { type: "screen", label: "Works", target: "projects" },
  { type: "screen", label: "About", target: "about" },
  {
    type: "link",
    label: "Email",
    href: "mailto:joel.c.lim@vanderbilt.edu",
    action: "copy",
    copyValue: "joel.c.lim@vanderbilt.edu",
  },
  {
    type: "link",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/joelchaelim/",
    action: "external",
  },
  {
    type: "link",
    label: "Resume",
    href: "https://drive.google.com/file/d/1EpfISujvPV3touQihCY63IkajsmWT4KS/view?usp=sharing",
    action: "external",
  },
];

type NavigationDrawerProps = {
  open: boolean;
  /** Which destination should read as "currently here" in the list. */
  active: NavTarget | null;
  onNavigate: (target: NavTarget) => void;
  onClose: () => void;
  /**
   * "stage" = zoomed full-bleed (slimmer on tablet/desktop).
   * "device" = on-iPod Menu glass (unchanged mobile-friendly width).
   */
  density?: ChromeDensity;
};

export function NavigationDrawer({
  open,
  active,
  onNavigate,
  onClose,
  density = "device",
}: NavigationDrawerProps) {
  const [emailCopied, setEmailCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stage = density === "stage";

  useEffect(() => {
    if (!open) {
      setEmailCopied(false);
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
        copiedTimerRef.current = null;
      }
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const copyEmail = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for older / restricted contexts
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setEmailCopied(true);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setEmailCopied(false), 1600);
  };

  const iconClass = stage
    ? "relative z-[1] size-[max(12px,2.4cqi)] shrink-0 text-black/45"
    : "relative z-[1] size-[max(10px,3.4cqi)] shrink-0 text-black/45";

  return (
    <AnimatePresence>
      {open ? (
        <div className="pointer-events-auto absolute inset-0 z-30 overflow-hidden">
          <motion.button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="absolute inset-0 bg-black/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className={`absolute inset-y-0 left-0 flex flex-col overflow-hidden bg-white shadow-[6px_0_18px_rgba(20,30,50,0.18)] ${
              stage
                ? "w-[54%] md:w-[38%] lg:w-[32%] md:max-w-[340px]"
                : "w-[54%]"
            }`}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
          >
            <div
              className={`ipod-status-bar flex min-h-[14px] shrink-0 items-center ${
                stage ? "px-[max(12px,2.2cqi)]" : "px-[3.2cqi]"
              }`}
              style={{ height: statusBarHeightCqi(density) }}
            >
              <p
                className={`truncate font-bold tracking-tight text-status-bar-text ${
                  stage
                    ? "text-[max(11px,2.35cqi)]"
                    : "text-[max(8px,3.6cqi)]"
                }`}
              >
                Navigation
              </p>
            </div>

            <ul className="flex flex-1 flex-col overflow-y-auto">
              {NAV_ENTRIES.map((entry) => {
                const isActive =
                  entry.type === "screen" && entry.target === active;
                const rowClass = `ipod-menu-row relative flex w-full items-center justify-between text-left font-bold transition-colors ${
                  stage
                    ? "px-[max(14px,2.4cqi)] py-[max(10px,1.7cqi)] text-[max(13px,2.35cqi)]"
                    : "px-[3.5cqi] py-[2.6cqi] text-[max(10px,3.4cqi)]"
                } ${
                  isActive
                    ? "ipod-gel-select"
                    : "text-black hover:bg-black/[0.04]"
                }`;

                if (entry.type === "screen") {
                  return (
                    <li key={entry.label}>
                      <button
                        type="button"
                        onClick={() => onNavigate(entry.target)}
                        className={rowClass}
                      >
                        <span className="relative z-[1]">{entry.label}</span>
                        {isActive ? (
                          <ChevronRight
                            className={`relative z-[1] shrink-0 text-white ${
                              stage
                                ? "size-[max(12px,2.4cqi)]"
                                : "size-[max(10px,3.4cqi)]"
                            }`}
                            strokeWidth={2.5}
                          />
                        ) : null}
                      </button>
                    </li>
                  );
                }

                if (entry.action === "copy") {
                  return (
                    <li key={entry.label}>
                      <button
                        type="button"
                        onClick={() => copyEmail(entry.copyValue ?? "")}
                        className={rowClass}
                        aria-label={
                          emailCopied
                            ? "Email copied"
                            : `Copy ${entry.copyValue ?? "email"}`
                        }
                      >
                        <span className="relative z-[1]">{entry.label}</span>
                        {emailCopied ? (
                          <span
                            className={`relative z-[1] flex items-center font-bold tracking-tight text-black/55 ${
                              stage
                                ? "gap-[0.55cqi] text-[max(11px,1.9cqi)]"
                                : "gap-[0.8cqi] text-[max(8px,2.6cqi)]"
                            }`}
                          >
                            <Check
                              className={
                                stage
                                  ? "size-[max(12px,2.4cqi)] shrink-0"
                                  : "size-[max(10px,3.4cqi)] shrink-0"
                              }
                              strokeWidth={2.5}
                            />
                            copied!
                          </span>
                        ) : (
                          <Copy className={iconClass} strokeWidth={2.25} />
                        )}
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={entry.label}>
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={onClose}
                      className={rowClass}
                    >
                      <span className="relative z-[1]">{entry.label}</span>
                      <SquareArrowOutUpRight
                        className={iconClass}
                        strokeWidth={2.25}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
