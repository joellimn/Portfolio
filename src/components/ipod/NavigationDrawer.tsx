"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, Copy, SquareArrowOutUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
    href: "https://drive.google.com/file/d/1P24MR7nEEZTLqnmhrntTwrwoh5J873Je/view?usp=sharing",
    action: "external",
  },
];

const ICON_CLASS =
  "relative z-[1] size-[max(10px,3.4cqi)] shrink-0 text-black/45";

type NavigationDrawerProps = {
  open: boolean;
  /** Which destination should read as "currently here" in the list. */
  active: NavTarget | null;
  onNavigate: (target: NavTarget) => void;
  onClose: () => void;
};

export function NavigationDrawer({
  open,
  active,
  onNavigate,
  onClose,
}: NavigationDrawerProps) {
  const [emailCopied, setEmailCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
            className="absolute inset-y-0 left-0 flex w-[54%] flex-col overflow-hidden bg-white shadow-[6px_0_18px_rgba(20,30,50,0.18)]"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
          >
            <div className="ipod-status-bar flex h-[8.5cqi] min-h-[16px] shrink-0 items-center px-[3.2cqi]">
              <p className="truncate text-[max(8px,3.6cqi)] font-bold tracking-tight text-status-bar-text">
                Navigation
              </p>
            </div>

            <ul className="flex flex-1 flex-col overflow-y-auto">
              {NAV_ENTRIES.map((entry) => {
                const isActive =
                  entry.type === "screen" && entry.target === active;
                const rowClass = `ipod-menu-row relative flex w-full items-center justify-between px-[3.5cqi] py-[2.6cqi] text-left text-[max(10px,3.4cqi)] font-bold transition-colors ${
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
                            className="relative z-[1] size-[max(10px,3.4cqi)] shrink-0 text-white"
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
                          <span className="relative z-[1] flex items-center gap-[0.8cqi] text-[max(8px,2.6cqi)] font-bold tracking-tight text-black/55">
                            <Check
                              className="size-[max(10px,3.4cqi)] shrink-0"
                              strokeWidth={2.5}
                            />
                            copied!
                          </span>
                        ) : (
                          <Copy className={ICON_CLASS} strokeWidth={2.25} />
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
                        className={ICON_CLASS}
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
