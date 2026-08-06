"use client";

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import { CoverArt } from "@/components/ipod/CoverArt";
import { STATUS_BAR_FRACTION } from "@/lib/chromeDensity";
import type { Project } from "@/data/projects";

// Adapted from ashishgogula/coverflow (MIT) — https://coverflow.ashishgogula.in/
// Same spring-driven 3D carousel (covers fan out left/right, rotateY).
// Desktop: vertical drag + wheel. Touch: horizontal swipe.

export type CoverFlowHandle = {
  scrollToIndex: (index: number) => void;
};

type CoverFlowProps = {
  projects: Project[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelect: (index: number) => void;
  /** Fired when the user keeps scrolling/dragging/pressing forward past the
   * last cover — used to carry the gesture into the next screen (About). */
  onReachEnd?: () => void;
  /** Fired on every wheel tick while scrolling backward past the first
   * cover, carrying the raw (negative) deltaY — the parent scrubs the
   * Menu-screen zoom-out by this amount. A drag overshoot or keyboard
   * press reports a single large delta to snap all the way back. */
  onReachStart?: (deltaY: number) => void;
  /** Shared with the parent so Cover Flow can tell when a zoom-out is
   * already in progress (progress < 1) and keep scrubbing both ways
   * until it finishes or reverses fully. */
  zoomProgress?: MotionValue<number>;
  /** When false, Cover Flow stays mounted (for layout/preload) but ignores
   * wheel/drag/keyboard — used while the blank stage curtain is up. */
  active?: boolean;
  /**
   * When false, cover videos stay on their static art (used until the
   * Menu→Works zoom spring has fully settled).
   */
  videoReady?: boolean;
  /** Fires once the container has a real measured size so the parent can
   * lift the blank curtain without a size-0 → full-size flicker. */
  onReady?: () => void;
  /** Touch / tablet: swipe horizontally through covers. */
  touchMode?: boolean;
};

const ITEM_SIZE = 200;
const STACK_SPACING = 58;
const CENTER_GAP = 130;
const ROTATION = 55;
const SCROLL_THRESHOLD = 260;
// A single large delta reported to onReachStart for discrete gestures
// (drag overshoot, keyboard) — big enough to fully collapse the parent's
// zoom-out scrub range in one shot, snapping straight back to the Menu.
const ZOOM_SNAP_DELTA = 1e6;

function clampIndex(index: number, length: number) {
  return Math.min(Math.max(index, 0), Math.max(length - 1, 0));
}

export const CoverFlow = forwardRef<CoverFlowHandle, CoverFlowProps>(
  function CoverFlow(
    {
      projects,
      activeIndex,
      onActiveIndexChange,
      onSelect,
      onReachEnd,
      onReachStart,
      zoomProgress,
      active = true,
      videoReady = true,
      onReady,
      touchMode = false,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
    const readySentRef = useRef(false);

    const activeIndexRef = useRef(activeIndex);
    activeIndexRef.current = activeIndex;

    const onReachEndRef = useRef(onReachEnd);
    onReachEndRef.current = onReachEnd;

    const onReachStartRef = useRef(onReachStart);
    onReachStartRef.current = onReachStart;

    const zoomProgressRef = useRef(zoomProgress);
    zoomProgressRef.current = zoomProgress;

    const activeRef = useRef(active);
    activeRef.current = active;

    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    const scrollX = useMotionValue(activeIndex);
    const springX = useSpring(scrollX, {
      stiffness: 280,
      damping: 34,
      mass: 0.8,
    });

    // Match zoomed (stage) StatusBar height so the destination frame equals
    // the full-bleed Works layout under the slim chrome.
    // the Cover Flow content box below the status bar.
    const measureContainer = useCallback(() => {
      const container = containerRef.current;
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      setContainerSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
      if (!readySentRef.current && width > 1 && height > 1) {
        readySentRef.current = true;
        onReadyRef.current?.();
      }
    }, []);

    // Sync before paint whenever the parent re-renders (e.g. stageMode flip).
    // ResizeObserver alone is a frame late — that lag remounted/resized covers
    // and read as a "reload" at the end of the zoom.
    useLayoutEffect(() => {
      measureContainer();
    });

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const updateViewport = () => {
        setViewportSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      updateViewport();
      window.addEventListener("resize", updateViewport);

      const ro = new ResizeObserver(() => {
        measureContainer();
      });
      ro.observe(container);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", updateViewport);
      };
    }, [measureContainer]);

    const hasSize = containerSize.width > 1 && containerSize.height > 1;
    const hasViewport = viewportSize.width > 1 && viewportSize.height > 1;

    // Destination = staged full-bleed content area (below the status bar).
    // Covers are always painted at this size; a CSS fit-scale shrinks the
    // whole stage into the on-device glass. Stage swap only changes the
    // fit-scale (→1) — cover bitmaps never remount/resize.
    const destWidth = hasViewport ? viewportSize.width : 0;
    const destHeight = hasViewport
      ? Math.max(
          1,
          viewportSize.height - viewportSize.width * STATUS_BAR_FRACTION,
        )
      : 0;

    const size =
      destWidth > 0 && destHeight > 0
        ? Math.max(
            36,
            Math.round(Math.min(destHeight * 0.5, destWidth * 0.62)),
          )
        : 0;

    const fitScale =
      hasSize && destWidth > 0 && destHeight > 0
        ? Math.min(
            containerSize.width / destWidth,
            containerSize.height / destHeight,
            1,
          )
        : 1;

    // Keep spacing proportional to cover size so the fan looks the same
    // whether we're inside the tiny on-device screen or the full-bleed stage.
    const stackSpacing = Math.round(size * (STACK_SPACING / ITEM_SIZE));
    const centerGap = Math.round(size * (CENTER_GAP / ITEM_SIZE));
    // Match @ashishgogula/coverflow — reflection strip is ~42% of cover height.
    const reflectionHeight = Math.round(size * 0.42);

    // On wide/landscape frames the stack reads low — give more air above
    // the covers and less below (reflection + title already eat the bottom).
    const stageAspect =
      destWidth > 0 && destHeight > 0 ? destWidth / destHeight : 1;
    const wideT = Math.min(1, Math.max(0, (stageAspect - 1) / 0.75));
    const coverPadTop = Math.round(
      reflectionHeight * (0.35 + wideT * 0.45),
    );
    const coverPadBottom = Math.round(
      reflectionHeight * (0.75 - wideT * 0.4),
    );

    // Keep the spring in sync when the index changes from outside
    // (click wheel prev/next, auto-advance) rather than from a drag.
    useEffect(() => {
      if (!isDragging) scrollX.set(activeIndex);
    }, [activeIndex, isDragging, scrollX]);

    const jumpToIndex = useCallback(
      (index: number) => {
        const clamped = clampIndex(index, projects.length);
        if (clamped === activeIndexRef.current) return;
        onActiveIndexChange(clamped);
      },
      [projects.length, onActiveIndexChange],
    );

    useImperativeHandle(
      ref,
      () => ({
        scrollToIndex: (index: number) => {
          onActiveIndexChange(clampIndex(index, projects.length));
        },
      }),
      [projects.length, onActiveIndexChange],
    );

    // Vertical wheel / trackpad scroll drives the horizontal stack —
    // accumulate deltaY and jump one cover at a time past the threshold.
    // Listen on window (not just the cover hit-area) so zoom-out / cover
    // navigation work with the cursor anywhere on the page.
    // Touch devices use horizontal drag instead.
    useEffect(() => {
      if (touchMode) return;
      let accumulator = 0;
      let lastTime = Date.now();
      let lastJump = 0;
      // Once the user has scrolled far enough past the first cover, further
      // upward ticks scrub the Menu zoom-out. Resets when the gesture pauses
      // or reverses, so resting on WTTIN and scrolling up a little never
      // starts the zoom.
      let pastFirstCover = false;
      // Coalesce zoom-scrub deltas to one motion update per frame so a
      // burst of trackpad wheel events can't thrash the main thread.
      let pendingZoomDelta = 0;
      let zoomRaf = 0;

      const flushZoomDelta = () => {
        zoomRaf = 0;
        const delta = pendingZoomDelta;
        pendingZoomDelta = 0;
        if (delta !== 0) onReachStartRef.current?.(delta);
      };

      const queueZoomDelta = (deltaY: number) => {
        pendingZoomDelta += deltaY;
        if (!zoomRaf) zoomRaf = requestAnimationFrame(flushZoomDelta);
      };

      const handleWheel = (event: WheelEvent) => {
        if (!activeRef.current) return;
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

        const now = Date.now();
        if (now - lastTime > 200) {
          accumulator = 0;
          pastFirstCover = false;
        }
        lastTime = now;
        accumulator += event.deltaY;

        const threshold = SCROLL_THRESHOLD;
        const shouldJump =
          (accumulator > threshold || accumulator < -threshold) &&
          now - lastJump > 150;

        const dir = accumulator > 0 ? 1 : -1;
        const atFirstCover = activeIndexRef.current === 0;
        const zoom = zoomProgressRef.current?.get() ?? 1;
        const midZoomOut = atFirstCover && zoom < 1;
        const atStart = atFirstCover && dir < 0;
        const atEnd =
          activeIndexRef.current === projects.length - 1 && dir > 0;

        // Already scrubbing the Menu zoom — keep ownership of the wheel
        // until the zoom fully closes or reopens, so a small downward
        // flick doesn't leave the chassis half-visible over Cover Flow.
        if (midZoomOut) {
          event.preventDefault();
          queueZoomDelta(event.deltaY);
          if (event.deltaY > 0 && (zoomProgressRef.current?.get() ?? 1) >= 1) {
            pastFirstCover = false;
            accumulator = 0;
          }
          return;
        }

        if (atStart) {
          event.preventDefault();
          // Require a full cover-jump's worth of upward scroll before the
          // zoom-out scrub begins — same weight as moving between covers.
          // Resting on WTTIN and scrolling up a little stays put.
          if (!pastFirstCover) {
            if (!shouldJump) return;
            pastFirstCover = true;
            accumulator = 0;
            lastJump = now;
          }
          queueZoomDelta(event.deltaY);
          return;
        }

        // Scrolling forward again cancels any in-progress "past first cover"
        // commitment so a later upward gesture has to re-earn the threshold.
        if (dir > 0) pastFirstCover = false;

        if (atEnd) {
          // Keep scrolling forward past the last cover carries the
          // gesture into the next screen instead of doing nothing.
          if (shouldJump) {
            onReachEndRef.current?.();
            accumulator = 0;
            lastJump = now;
          }
          return;
        }

        event.preventDefault();
        if (shouldJump) {
          jumpToIndex(activeIndexRef.current + dir);
          accumulator = 0;
          lastJump = now;
        }
      };

      window.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        window.removeEventListener("wheel", handleWheel);
        if (zoomRaf) cancelAnimationFrame(zoomRaf);
      };
    }, [jumpToIndex, projects.length, touchMode]);

    // Desktop: vertical drag through the horizontal stack.
    // Touch: horizontal swipe (left = next, right = previous).
    const onDrag = useCallback(
      (_: unknown, info: PanInfo) => {
        const delta = touchMode ? info.delta.x : info.delta.y;
        scrollX.set(scrollX.get() - delta / (centerGap * 0.8 || 1));
      },
      [centerGap, scrollX, touchMode],
    );

    const onDragEnd = useCallback(
      (_: unknown, info: PanInfo) => {
        setIsDragging(false);
        const velocity = touchMode ? info.velocity.x : info.velocity.y;
        const projected = scrollX.get() - velocity * 0.002;
        const clamped = clampIndex(Math.round(projected), projects.length);
        scrollX.set(clamped);
        onActiveIndexChange(clamped);
        // A deliberate overshoot past the last cover carries the drag
        // into the next screen (About); overshooting before the first
        // cover carries it back into the Menu screen.
        if (
          clamped === projects.length - 1 &&
          projected > projects.length - 1 + 0.4
        ) {
          onReachEndRef.current?.();
        } else if (clamped === 0 && projected < -0.4) {
          onReachStartRef.current?.(-ZOOM_SNAP_DELTA);
        }
      },
      [projects.length, onActiveIndexChange, scrollX, touchMode],
    );

    const onKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (!activeRef.current) return;
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          event.preventDefault();
          if (activeIndexRef.current === 0) {
            onReachStartRef.current?.(-ZOOM_SNAP_DELTA);
          } else {
            jumpToIndex(activeIndexRef.current - 1);
          }
        }
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          event.preventDefault();
          if (activeIndexRef.current === projects.length - 1) {
            onReachEndRef.current?.();
          } else {
            jumpToIndex(activeIndexRef.current + 1);
          }
        }
      },
      [jumpToIndex, projects.length],
    );

    if (projects.length === 0) return null;

    return (
      <motion.div
        ref={containerRef}
        className={`relative h-full w-full select-none overflow-hidden focus:outline-none ${
          touchMode ? "touch-none" : "touch-pan-x"
        } ${
          !active
            ? "cursor-default"
            : isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
        }`}
        role="region"
        aria-label="Cover Flow"
        aria-hidden={!active}
        tabIndex={active ? 0 : -1}
        onKeyDown={onKeyDown}
        drag={active ? (touchMode ? "x" : "y") : false}
        dragConstraints={
          touchMode ? { left: 0, right: 0 } : { top: 0, bottom: 0 }
        }
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      >
        {/* Viewport-sized stage, CSS-scaled into the current glass. Title
            rides along so it doesn't jump when the container query context
            swaps at stageMode. */}
        <div
          className="absolute left-1/2 top-1/2 flex flex-col"
          style={{
            width: destWidth || "100%",
            height: destHeight || "100%",
            transform: `translate(-50%, -50%) scale(${fitScale})`,
            transformOrigin: "center center",
          }}
        >
          <div
            className="pointer-events-none relative z-0 min-h-0 w-full flex-1"
            style={{ perspective: 900, transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transformStyle: "preserve-3d",
                // Keep reflections above the title band, with a little
                // extra headroom above the covers (more on wide screens).
                paddingTop: coverPadTop,
                paddingBottom: coverPadBottom,
              }}
            >
              {size > 0
                ? projects.map((project, index) => (
                    <CoverFlowCard
                      key={project.id}
                      project={project}
                      index={index}
                      scrollX={springX}
                      size={size}
                      reflectionHeight={reflectionHeight}
                      stackSpacing={stackSpacing}
                      centerGap={centerGap}
                      rotation={ROTATION}
                      isActive={index === activeIndex}
                      playing={index === activeIndex && videoReady}
                      onCardClick={() => {
                        if (!activeRef.current) return;
                        if (index === activeIndex) {
                          onSelect(index);
                        } else {
                          jumpToIndex(index);
                        }
                      }}
                    />
                  ))
                : null}
            </div>
          </div>

          <CoverFlowLabel
            title={hasSize ? (projects[activeIndex]?.title ?? "") : ""}
            subtitle={hasSize ? (projects[activeIndex]?.subtitle ?? "") : ""}
            width={destWidth}
            wideT={wideT}
          />
        </div>
      </motion.div>
    );
  },
);

/** Renders title/subtitle as a dest-resolution bitmap so nested zoom
 * scales stay sharp the same way cover art does (HTML text would
 * re-rasterize soft under the chassis transform). */
function CoverFlowLabel({
  title,
  subtitle,
  width,
  wideT = 0,
}: {
  title: string;
  subtitle: string;
  width: number;
  /** 0 = square/portrait, 1 = wide — trims bottom label padding. */
  wideT?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleSize = Math.round(Math.min(48, Math.max(11, width * 0.021)));
  const subtitleSize = Math.round(Math.min(28, Math.max(10, width * 0.017)));
  const padX = Math.max(12, Math.round(width * 0.02));
  const height = Math.ceil(titleSize + 6 + subtitleSize * 2.35 + width * 0.045);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width < 1 || !title) return;

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    canvas.width = Math.max(1, Math.ceil(width * dpr));
    canvas.height = Math.max(1, Math.ceil(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const fontStack = '"Helvetica Neue", Helvetica, Arial, sans-serif';
    const maxW = width - padX * 2;
    const cx = width / 2;

    const truncate = (text: string, font: string) => {
      ctx.font = font;
      if (ctx.measureText(text).width <= maxW) return text;
      let t = text;
      while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) {
        t = t.slice(0, -1);
      }
      return `${t}…`;
    };

    const wrap = (text: string, font: string, maxLines: number) => {
      ctx.font = font;
      const words = text.split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      let line = "";
      for (let i = 0; i < words.length; i++) {
        const word = words[i]!;
        const next = line ? `${line} ${word}` : word;
        if (ctx.measureText(next).width <= maxW) {
          line = next;
          continue;
        }
        if (line) lines.push(line);
        line = word;
        if (lines.length >= maxLines - 1) {
          const rest = [line, ...words.slice(i + 1)].join(" ");
          lines.push(truncate(rest, font));
          return lines.slice(0, maxLines);
        }
      }
      if (line) lines.push(line);
      return lines.slice(0, maxLines);
    };

    const titleFont = `500 ${titleSize}px ${fontStack}`;
    ctx.fillStyle = "#000000";
    ctx.font = titleFont;
    ctx.fillText(truncate(title, titleFont), cx, 0);

    if (subtitle) {
      const subFont = `400 ${subtitleSize}px ${fontStack}`;
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      const lines = wrap(subtitle, subFont, 2);
      let y = titleSize + Math.max(4, titleSize * 0.18);
      ctx.font = subFont;
      for (const line of lines) {
        ctx.fillText(line, cx, y);
        y += subtitleSize * 1.25;
      }
    }
  }, [title, subtitle, width, height, titleSize, subtitleSize, padX]);

  if (!title || width < 1) return null;

  return (
    <div
      className="pointer-events-none relative z-[1100] flex shrink-0 justify-center bg-white"
      style={{
        paddingBottom: `${4.5 - wideT * 2.2}%`,
        paddingTop: "0.4%",
      }}
      aria-hidden
    >
      <canvas ref={canvasRef} />
      {/* Accessible text for screen readers — canvas is visual-only */}
      <span className="sr-only">
        {title}. {subtitle}
      </span>
    </div>
  );
}

type CardProps = {
  project: Project;
  index: number;
  scrollX: MotionValue<number>;
  size: number;
  reflectionHeight: number;
  stackSpacing: number;
  centerGap: number;
  rotation: number;
  isActive: boolean;
  /** Start cover-video reveal (center cover + zoom settled). */
  playing: boolean;
  onCardClick: () => void;
};

const CoverFlowCard = memo(function CoverFlowCard({
  project,
  index,
  scrollX,
  size,
  reflectionHeight,
  stackSpacing,
  centerGap,
  rotation,
  isActive,
  playing,
  onCardClick,
}: CardProps) {
  const rotateY = useTransform(scrollX, (value) => {
    const pos = index - value;
    const absPos = Math.abs(pos);
    return absPos < 0.5
      ? -pos * (rotation * 2)
      : pos < 0
        ? rotation
        : -rotation;
  });

  const x = useTransform(scrollX, (value) => {
    const pos = index - value;
    const absPos = Math.abs(pos);
    if (absPos < 1) return pos * centerGap;
    return pos < 0
      ? -centerGap - (absPos - 1) * stackSpacing
      : centerGap + (absPos - 1) * stackSpacing;
  });

  const z = useTransform(scrollX, (value) => {
    const absPos = Math.abs(index - value);
    return absPos > 0.5 ? -200 : absPos * -400;
  });

  const zIndex = useTransform(scrollX, (value) =>
    Math.round(1000 - Math.abs(index - value) * 10),
  );

  // Dim inactive covers with an overlay instead of CSS filter:brightness —
  // filters force a paint on every spring frame and are the main Cover
  // Flow hitch on trackpad scrolls.
  const dimOpacity = useTransform(scrollX, (value) =>
    Math.abs(index - value) < 0.5 ? 0 : 0.42,
  );

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 cursor-pointer"
      style={{
        width: size,
        height: size,
        // Bias up so reflections clear the titles, but leave headroom above.
        marginTop: -size / 2 - reflectionHeight * 0.4,
        marginLeft: -size / 2,
        x,
        z,
        rotateY,
        zIndex,
        pointerEvents: "auto",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      onClick={onCardClick}
    >
      <div className="relative size-full overflow-hidden border border-black/10 shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
        <CoverArt
          project={project}
          className="size-full"
          priority={isActive}
          playing={playing}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: dimOpacity }}
        />
      </div>

      {/*
        Reflection from @ashishgogula/coverflow:
        - short strip under the cover (not a full-height flip clipped empty)
        - scaleY(-1) on the strip itself
        - slight rotateX so it reads as a floor plane
        - opacity + white fade overlay (mask alone was too faint on light art)
      */}
      {reflectionHeight > 0 ? (
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 overflow-hidden"
          style={{
            top: "100%",
            width: size,
            height: reflectionHeight,
            marginTop: 1,
            transformOrigin: "top center",
            transform: "rotateX(12deg) translateZ(0)",
            willChange: "transform",
          }}
        >
          <div
            className="relative size-full"
            style={{
              transform: "scaleY(-1)",
              opacity: 0.5,
            }}
          >
            <CoverArt
              project={project}
              className="size-full"
              playing={playing}
            />
            <motion.div
              className="absolute inset-0 bg-black"
              style={{ opacity: dimOpacity }}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.78) 38%, rgba(255,255,255,0.2) 70%, transparent 100%)",
            }}
          />
        </div>
      ) : null}
    </motion.div>
  );
});
