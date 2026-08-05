"use client";

import { useEffect, useState } from "react";

/**
 * True on phones / tablets / touch-primary devices.
 * Includes maxTouchPoints so mobile browsers that spoof a fine pointer
 * (e.g. some in-app browsers requesting “desktop” layout) still get the
 * touch interaction model.
 */
export function useIsTouchScreen() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const noHover = window.matchMedia("(hover: none)");

    const update = () => {
      setIsTouch(
        coarse.matches ||
          noHover.matches ||
          (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0),
      );
    };

    update();
    coarse.addEventListener("change", update);
    noHover.addEventListener("change", update);
    return () => {
      coarse.removeEventListener("change", update);
      noHover.removeEventListener("change", update);
    };
  }, []);

  return isTouch;
}
