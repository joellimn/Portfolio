"use client";

import { useEffect, useState } from "react";

/**
 * True when the primary pointing device is touch (phones / tablets).
 * Desktop trackpads and mice stay on the scroll/vertical Cover Flow model.
 */
export function useIsTouchScreen() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const noHover = window.matchMedia("(hover: none)");

    const update = () => {
      setIsTouch(coarse.matches || noHover.matches);
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
