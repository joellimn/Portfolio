"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { WorkPage } from "@/components/portfolio/WorkPage";
import { projects } from "@/data/projects";
import { EASE_OUT, SHEET_DURATION } from "@/lib/motion";

function caseStudyIdFromPath(pathname: string) {
  return projects.find((project) => pathname === `/${project.id}`)?.id;
}

export function PortfolioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const caseId = caseStudyIdFromPath(pathname);
  const firstPaint = useRef(true);
  const [sheet, setSheet] = useState<{ id: string; node: ReactNode } | null>(
    () => (caseId ? { id: caseId, node: children } : null),
  );
  const [open, setOpen] = useState(Boolean(caseId));

  useEffect(() => {
    firstPaint.current = false;
  }, []);

  useLayoutEffect(() => {
    if (caseId) {
      setSheet({ id: caseId, node: children });
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [caseId, children]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [open]);

  const skipEnter = firstPaint.current && Boolean(caseId);
  const homeCovered = open || Boolean(sheet);

  // Only Work and the case studies that slide over it need the persistent base.
  // The other pages render on their own.
  if (pathname !== "/" && !caseId) return <>{children}</>;

  return (
    <>
      <div inert={homeCovered ? true : undefined}>
        <WorkPage />
      </div>
      <AnimatePresence
        onExitComplete={() => {
          if (!caseId) setSheet(null);
        }}
      >
        {open && sheet ? (
          <motion.div
            key={sheet.id}
            role="dialog"
            aria-modal="true"
            aria-label="Case study"
            className="fixed inset-0 z-40 overflow-y-auto scroll-smooth bg-white"
            initial={
              skipEnter ? false : reduced ? { opacity: 0 } : { y: "100%" }
            }
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: SHEET_DURATION, ease: EASE_OUT }}
          >
            {sheet.node}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
