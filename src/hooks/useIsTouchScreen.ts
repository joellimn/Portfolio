"use client";

import { useEffect, useState } from "react";

/**
 * True on phones / tablets / touch-primary devices — not hybrid
 * touchscreen laptops that also have a mouse or trackpad.
 *
 * Hybrid laptops report maxTouchPoints > 0, so we never use that alone.
 * We still keep a touch-points fallback for mobile browsers that spoof a
 * fine pointer while remaining non-hover (some in-app “desktop” modes).
 */
export function useIsTouchScreen() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const noHover = window.matchMedia("(hover: none)");
    const anyFine = window.matchMedia("(any-pointer: fine)");
    const anyHover = window.matchMedia("(any-hover: hover)");

    const update = () => {
      // Mouse/trackpad present → desktop interaction model (scroll, hover).
      const hybridDesktop = anyFine.matches && anyHover.matches;
      if (hybridDesktop) {
        setIsTouch(false);
        return;
      }

      const hasTouchPoints =
        typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

      setIsTouch(
        coarse.matches || noHover.matches || hasTouchPoints,
      );
    };

    update();
    coarse.addEventListener("change", update);
    noHover.addEventListener("change", update);
    anyFine.addEventListener("change", update);
    anyHover.addEventListener("change", update);
    return () => {
      coarse.removeEventListener("change", update);
      noHover.removeEventListener("change", update);
      anyFine.removeEventListener("change", update);
      anyHover.removeEventListener("change", update);
    };
  }, []);

  return isTouch;
}
