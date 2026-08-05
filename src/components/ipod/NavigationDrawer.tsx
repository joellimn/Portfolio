"use client";

import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type NavTarget = "projects" | "about";

type NavEntry =
  | { type: "screen"; label: string; target: NavTarget }
  | { type: "link"; label: string; href: string };

// TODO: keep these in sync with AboutScreen's contact links.
const NAV_ENTRIES: NavEntry[] = [
  { type: "screen", label: "Works", target: "projects" },
  { type: "screen", label: "About", target: "about" },
  { type: "link", label: "Email", href: "mailto:hello@joellim.design" },
  { type: "link", label: "LinkedIn", href: "https://www.linkedin.com/in/joel-lim" },
  { type: "link", label: "Resume", href: "/assets/about/resume.pdf" },
];

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
  return (
    <AnimatePresence>
      {open ? (
        <div className="absolute inset-0 z-30 overflow-hidden">
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
            className="absolute inset-y-0 left-0 flex w-[54%] flex-col overflow-hidden bg-white shadow-[6px_0_18px_rgba(0,0,0,0.16)]"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
          >
            <div className="flex h-[8.5cqi] min-h-[16px] shrink-0 items-center bg-status-bar px-[3.2cqi]">
              <p className="truncate text-[clamp(8px,3.6cqi,15px)] font-medium text-black">
                Navigation
              </p>
            </div>

            <ul className="flex flex-1 flex-col overflow-y-auto">
              {NAV_ENTRIES.map((entry) => {
                const isActive =
                  entry.type === "screen" && entry.target === active;
                const rowClass = `flex w-full items-center justify-between px-[3.5cqi] py-[2.6cqi] text-left text-[clamp(10px,3.4cqi,15px)] transition-colors ${
                  isActive
                    ? "bg-accent-blue text-white"
                    : "text-black hover:bg-black/5"
                }`;

                if (entry.type === "screen") {
                  return (
                    <li key={entry.label}>
                      <button
                        type="button"
                        onClick={() => onNavigate(entry.target)}
                        className={rowClass}
                      >
                        <span>{entry.label}</span>
                        {isActive ? (
                          <ChevronRight
                            className="size-[clamp(10px,3.4cqi,15px)] shrink-0"
                            strokeWidth={2.5}
                          />
                        ) : null}
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={entry.label}>
                    <a
                      href={entry.href}
                      target={entry.href.startsWith("http") ? "_blank" : undefined}
                      rel={entry.href.startsWith("http") ? "noreferrer" : undefined}
                      onClick={onClose}
                      className={rowClass}
                    >
                      <span>{entry.label}</span>
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
