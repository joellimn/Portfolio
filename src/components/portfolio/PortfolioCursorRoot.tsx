"use client";

import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import {
  CaseStudyCursor,
  getCursorHint,
  onCursorRefresh,
  type CursorHint,
} from "@/components/portfolio/CaseStudyCursor";

export function PortfolioCursorRoot({ children }: { children: ReactNode }) {
  const [cursor, setCursor] = useState<{
    x: number;
    y: number;
    hint: CursorHint | null;
  } | null>(null);

  useEffect(
    () =>
      onCursorRefresh(() =>
        setCursor((prev) =>
          prev
            ? {
                ...prev,
                hint: getCursorHint(document.elementFromPoint(prev.x, prev.y)),
              }
            : prev,
        ),
      ),
    [],
  );

  const updateCursor = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    setCursor({
      x: event.clientX,
      y: event.clientY,
      hint: getCursorHint(event.target),
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
            hint: getCursorHint(document.elementFromPoint(clientX, clientY)),
          });
        }, 0);
      }}
    >
      {children}
      {cursor ? (
        <CaseStudyCursor x={cursor.x} y={cursor.y} hint={cursor.hint} />
      ) : null}
    </div>
  );
}
