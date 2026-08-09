"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pointer-driven metal + glass sheen. Off until hover.
 * [data-ipod-center] and [data-ipod-glass] clip a chassis-sized copy of
 * the lighting layers so body, screen, and center share one highlight.
 */
export function useIpodLighting(
  chassisRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const el = chassisRef.current;
    if (!el) return;

    const syncSheenWindow = (target: HTMLElement, chassisRect: DOMRect) => {
      const targetRect = target.getBoundingClientRect();
      if (targetRect.width < 1 || targetRect.height < 1) return;

      target.style.setProperty("--ipod-sheen-w", `${chassisRect.width}px`);
      target.style.setProperty("--ipod-sheen-h", `${chassisRect.height}px`);
      target.style.setProperty(
        "--ipod-sheen-left",
        `${chassisRect.left - targetRect.left}px`,
      );
      target.style.setProperty(
        "--ipod-sheen-top",
        `${chassisRect.top - targetRect.top}px`,
      );
    };

    const syncSheenWindows = () => {
      const chassisRect = el.getBoundingClientRect();
      if (chassisRect.width < 1) return;
      el.querySelectorAll<HTMLElement>(
        "[data-ipod-center], [data-ipod-glass]",
      ).forEach((node) => syncSheenWindow(node, chassisRect));
    };

    const setSheenOpacity = (value: number) => {
      el.style.setProperty("--ipod-sheen-opacity", String(value));
    };

    const applyLight = (xPct: number, yPct: number) => {
      el.style.setProperty("--ipod-light-x", `${xPct}%`);
      el.style.setProperty("--ipod-light-y", `${yPct}%`);
      syncSheenWindows();
    };

    setSheenOpacity(0);
    applyLight(50, 50);
    syncSheenWindows();

    if (!enabled) {
      window.addEventListener("resize", syncSheenWindows, { passive: true });
      return () => window.removeEventListener("resize", syncSheenWindows);
    }

    const coarse = window.matchMedia("(pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (coarse.matches || reduced.matches) {
      window.addEventListener("resize", syncSheenWindows, { passive: true });
      return () => window.removeEventListener("resize", syncSheenWindows);
    }

    let raf = 0;
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;
    let targetOpacity = 0;
    let currentOpacity = 0;
    let tracking = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      currentOpacity += (targetOpacity - currentOpacity) * 0.18;
      applyLight(currentX, currentY);
      setSheenOpacity(currentOpacity);

      const settled =
        Math.abs(targetX - currentX) < 0.05 &&
        Math.abs(targetY - currentY) < 0.05 &&
        Math.abs(targetOpacity - currentOpacity) < 0.01;
      if (!settled || tracking) {
        raf = requestAnimationFrame(tick);
      } else {
        if (targetOpacity === 0) setSheenOpacity(0);
        raf = 0;
      }
    };

    const ensureTick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      tracking = true;
      targetOpacity = 1;
      targetX = ((event.clientX - rect.left) / rect.width) * 100;
      targetY = ((event.clientY - rect.top) / rect.height) * 100;
      targetX = Math.min(100, Math.max(0, targetX));
      targetY = Math.min(100, Math.max(0, targetY));
      ensureTick();
    };

    const onLeave = () => {
      tracking = false;
      targetOpacity = 0;
      ensureTick();
    };

    window.addEventListener("resize", syncSheenWindows, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", syncSheenWindows);
      if (raf) cancelAnimationFrame(raf);
      setSheenOpacity(0);
    };
  }, [chassisRef, enabled]);
}
