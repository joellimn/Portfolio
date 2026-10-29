"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  CaseStudyCursor,
  getCursorHint,
  onCursorRefresh,
  type CursorHint,
} from "@/components/portfolio/CaseStudyCursor";

function sameHint(a: CursorHint | null, b: CursorHint | null) {
  return a?.label === b?.label && a?.external === b?.external;
}

/** Position is written straight to the cursor's transform; React state only
 * changes when the cursor shows, hides, or swaps its label. */
export function PortfolioCursorRoot({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [hint, setHint] = useState<CursorHint | null>(null);
  const position = useRef({ x: 0, y: 0 });
  const node = useRef<HTMLDivElement | null>(null);

  const place = useCallback((el: HTMLDivElement | null) => {
    node.current = el;
    if (!el) return;
    const { x, y } = position.current;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  const updateHint = (next: CursorHint | null) =>
    setHint((prev) => (sameHint(prev, next) ? prev : next));

  useEffect(
    () =>
      onCursorRefresh(() => {
        const { x, y } = position.current;
        updateHint(getCursorHint(document.elementFromPoint(x, y)));
      }),
    [],
  );

  const updateCursor = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (
      event.target instanceof Element &&
      event.target.closest("[data-native-cursor]")
    ) {
      setVisible(false);
      return;
    }
    position.current = { x: event.clientX, y: event.clientY };
    place(node.current);
    setVisible(true);
    updateHint(getCursorHint(event.target));
  };

  return (
    <div
      className="portfolio-cursor-root min-h-screen"
      onPointerMove={updateCursor}
      onPointerLeave={() => setVisible(false)}
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") return;
        const { clientX, clientY } = event;
        window.setTimeout(() => {
          updateHint(getCursorHint(document.elementFromPoint(clientX, clientY)));
        }, 0);
      }}
    >
      {children}
      {visible ? <CaseStudyCursor ref={place} hint={hint} /> : null}
    </div>
  );
}
