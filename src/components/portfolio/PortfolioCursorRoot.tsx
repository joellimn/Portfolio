"use client";

import { useState, type PointerEvent, type ReactNode } from "react";
import {
  CaseStudyCursor,
  getCursorLabel,
} from "@/components/portfolio/CaseStudyCursor";

export function PortfolioCursorRoot({ children }: { children: ReactNode }) {
  const [cursor, setCursor] = useState<{
    x: number;
    y: number;
    label: string | null;
  } | null>(null);

  const updateCursor = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    setCursor({
      x: event.clientX,
      y: event.clientY,
      label: getCursorLabel(event.target),
    });
  };

  return (
    <div
      className="portfolio-cursor-root min-h-screen"
      onPointerMove={updateCursor}
      onPointerLeave={() => setCursor(null)}
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") return;
        const { clientX, clientY } = event;
        window.setTimeout(() => {
          setCursor({
            x: clientX,
            y: clientY,
            label: getCursorLabel(document.elementFromPoint(clientX, clientY)),
          });
        }, 0);
      }}
    >
      {children}
      {cursor ? (
        <CaseStudyCursor x={cursor.x} y={cursor.y} label={cursor.label} />
      ) : null}
    </div>
  );
}
