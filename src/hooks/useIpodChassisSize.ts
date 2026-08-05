"use client";

import { useEffect, useState } from "react";

// Per Figma's "Mobile Scale" / "Desktop Scale" reference frames: the
// on-device screen always shares the same aspect ratio as the page's own
// viewport — landscape on a wide window, portrait on a narrow/tall one —
// and the chassis continuously reshapes around it rather than snapping
// between fixed breakpoints.

const MIN_VIEWPORT_ASPECT = 0.42; // taller than typical phones in portrait
const MAX_VIEWPORT_ASPECT = 2.1; // wider than typical ultrawide monitors

// Fractional layout constants mirrored from the chassis markup — side
// padding, top/bottom padding, and the click wheel's margin/size, all as
// fractions of the chassis width (see IpodDevice's `px-[8%] pb-[10%]
// pt-[6.5%]` and ClickWheel's `mt-[14%] w-[61%]`). Keep these in sync if
// those values ever change — they let us derive the chassis's own
// (height / width) ratio from the screen's aspect ratio alone, without
// needing to measure anything after render.
const SIDE_PAD_FRACTION = 0.08;
const TOP_PAD_FRACTION = 0.065;
const BOTTOM_PAD_FRACTION = 0.1;
const WHEEL_TOP_MARGIN_FRACTION = 0.14;
const WHEEL_WIDTH_FRACTION = 0.61;
const CONTENT_WIDTH_FRACTION = 1 - SIDE_PAD_FRACTION * 2;

const MAX_WIDTH_PX = 360;
const MIN_WIDTH_PX = 220;
const WIDTH_VIEWPORT_FRACTION = 0.86;
const HEIGHT_VIEWPORT_FRACTION = 0.85;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export type IpodChassisSize = {
  /** Target chassis width, in pixels. */
  widthPx: number;
  /** Screen's aspect ratio (width / height) — mirrors the viewport's. */
  screenAspect: number;
};

/** Chassis height ÷ width for a given screen aspect (matches IpodDevice layout). */
export function chassisHeightRatio(screenAspect: number) {
  return (
    TOP_PAD_FRACTION +
    BOTTOM_PAD_FRACTION +
    CONTENT_WIDTH_FRACTION * WHEEL_TOP_MARGIN_FRACTION +
    CONTENT_WIDTH_FRACTION * WHEEL_WIDTH_FRACTION +
    CONTENT_WIDTH_FRACTION / screenAspect
  );
}

/**
 * Zoom transform that maps the resting on-device glass to cover the viewport.
 * Used when leaving full-bleed stage so the chassis handoff matches visually.
 */
export function computeRestZoomGeometry(
  widthPx: number,
  screenAspect: number,
  viewportWidth: number,
  viewportHeight: number,
) {
  const chassisW = widthPx;
  const chassisH = chassisW * chassisHeightRatio(screenAspect);
  const chassisLeft = (viewportWidth - chassisW) / 2;
  const chassisTop = (viewportHeight - chassisH) / 2;

  const contentLeft = chassisLeft + chassisW * SIDE_PAD_FRACTION;
  const contentTop = chassisTop + chassisW * TOP_PAD_FRACTION;
  const contentW = chassisW * CONTENT_WIDTH_FRACTION;
  // Bezel padding is 1.9% of the bezel box (content width).
  const bezelPad = contentW * 0.019;
  const glassW = contentW - bezelPad * 2;
  const glassH = glassW / screenAspect;
  const glassLeft = contentLeft + bezelPad;
  const glassTop = contentTop + bezelPad;
  const glassCenterX = glassLeft + glassW / 2;
  const glassCenterY = glassTop + glassH / 2;

  return {
    originX: glassCenterX - chassisLeft,
    originY: glassCenterY - chassisTop,
    tx: viewportWidth / 2 - glassCenterX,
    ty: viewportHeight / 2 - glassCenterY,
    scale: Math.max(viewportWidth / glassW, viewportHeight / glassH),
  };
}

function computeSize(
  viewportWidth: number,
  viewportHeight: number,
): IpodChassisSize {
  const screenAspect = clamp(
    viewportWidth / viewportHeight,
    MIN_VIEWPORT_ASPECT,
    MAX_VIEWPORT_ASPECT,
  );

  const chassisAspect = chassisHeightRatio(screenAspect);

  const widthPx = clamp(
    Math.min(
      MAX_WIDTH_PX,
      viewportWidth * WIDTH_VIEWPORT_FRACTION,
      (viewportHeight * HEIGHT_VIEWPORT_FRACTION) / chassisAspect,
    ),
    MIN_WIDTH_PX,
    MAX_WIDTH_PX,
  );

  return { widthPx, screenAspect };
}

// A fixed, arbitrary default used only for the very first render, so the
// server-rendered HTML and the client's initial hydration pass agree
// (reading window.innerWidth up front would mismatch SSR and cause a
// hydration error). The real size is applied a moment later from an
// effect, which only ever runs on the client after hydration completes.
const SSR_FALLBACK = computeSize(1280, 800);

/**
 * Continuously reshapes the iPod to match the page's own aspect ratio.
 * Recomputed on every resize/orientation change — no discrete breakpoints.
 */
export function useIpodChassisSize(): IpodChassisSize {
  const [size, setSize] = useState<IpodChassisSize>(SSR_FALLBACK);

  useEffect(() => {
    const update = () =>
      setSize(computeSize(window.innerWidth, window.innerHeight));
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return size;
}
