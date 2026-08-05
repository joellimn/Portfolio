"use client";

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
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
import type { Project } from "@/data/projects";

// Adapted from ashishgogula/coverflow (MIT) — https://coverflow.ashishgogula.in/
// Same spring-driven 3D carousel (covers fan out left/right, rotateY), but
// navigated with vertical input: drag up/down and vertical wheel scroll
// move through the horizontal stack instead of a left/right swipe.

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
};

const ITEM_SIZE = 200;
const STACK_SPACING = 58;
const CENTER_GAP = 130;
const ROTATION = 55;
const SCROLL_THRESHOLD = 260;

function clampIndex(index: number, length: number) {
  return Math.min(Math.max(index, 0), Math.max(length - 1, 0));
}

export const CoverFlow = forwardRef<CoverFlowHandle, CoverFlowProps>(
  function CoverFlow(
    { projects, activeIndex, onActiveIndexChange, onSelect, onReachEnd },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const activeIndexRef = useRef(activeIndex);
    activeIndexRef.current = activeIndex;

    const onReachEndRef = useRef(onReachEnd);
    onReachEndRef.current = onReachEnd;

    const scrollX = useMotionValue(activeIndex);
    const springX = useSpring(scrollX, {
      stiffness: 210,
      damping: 30,
      mass: 1,
    });

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const ro = new ResizeObserver(([entry]) => {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });
      ro.observe(container);
      return () => ro.disconnect();
    }, []);

    const scale =
      containerSize.height > 0
        ? Math.min(
            1,
            (containerSize.height * 0.6) / ITEM_SIZE,
            (containerSize.width * 0.62) / ITEM_SIZE,
          )
        : 1;
    const size = Math.max(36, Math.round(ITEM_SIZE * scale));
    const stackSpacing = Math.round(STACK_SPACING * scale);
    const centerGap = Math.round(CENTER_GAP * scale);

    // Covers are vertically centered in the container, so only half its
    // height minus half the cover is free below — clamp the reflection to
    // that space so it never gets silently clipped by the overflow bound.
    const availableBelow = Math.max(
      0,
      containerSize.height / 2 - size / 2 - 6,
    );
    const reflectionHeight = Math.max(0, Math.min(size * 0.6, availableBelow));

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
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let accumulator = 0;
      let lastTime = Date.now();
      let lastJump = 0;

      const handleWheel = (event: WheelEvent) => {
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

        const now = Date.now();
        if (now - lastTime > 200) accumulator = 0;
        lastTime = now;
        accumulator += event.deltaY;

        const threshold = SCROLL_THRESHOLD;
        const shouldJump =
          (accumulator > threshold || accumulator < -threshold) &&
          now - lastJump > 150;

        const dir = accumulator > 0 ? 1 : -1;
        const atStart = activeIndexRef.current === 0 && dir < 0;
        const atEnd =
          activeIndexRef.current === projects.length - 1 && dir > 0;

        if (atStart) return;

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

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }, [jumpToIndex, projects.length]);

    // Vertical drag moves through the horizontal stack: dragging up
    // advances forward, dragging down goes back.
    const onDrag = useCallback(
      (_: unknown, info: PanInfo) => {
        scrollX.set(scrollX.get() - info.delta.y / (centerGap * 0.8 || 1));
      },
      [centerGap, scrollX],
    );

    const onDragEnd = useCallback(
      (_: unknown, info: PanInfo) => {
        setIsDragging(false);
        const projected = scrollX.get() - info.velocity.y * 0.002;
        const clamped = clampIndex(Math.round(projected), projects.length);
        scrollX.set(clamped);
        onActiveIndexChange(clamped);
        // A deliberate overshoot past the last cover carries the drag
        // into the next screen (About).
        if (
          clamped === projects.length - 1 &&
          projected > projects.length - 1 + 0.4
        ) {
          onReachEndRef.current?.();
        }
      },
      [projects.length, onActiveIndexChange, scrollX],
    );

    const onKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          event.preventDefault();
          jumpToIndex(activeIndexRef.current - 1);
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
      <div className="relative flex h-full w-full flex-col">
        <motion.div
          ref={containerRef}
          className={`relative min-h-0 flex-1 touch-pan-x select-none overflow-hidden focus:outline-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ perspective: 900 }}
          role="region"
          aria-label="Cover Flow"
          tabIndex={0}
          onKeyDown={onKeyDown}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
        >
          <div
            className="pointer-events-none relative flex h-full w-full items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {projects.map((project, index) => (
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
                onCardClick={() => {
                  if (index === activeIndex) {
                    onSelect(index);
                  } else {
                    jumpToIndex(index);
                  }
                }}
              />
            ))}
          </div>
        </motion.div>

        <p className="pointer-events-none shrink-0 truncate px-3 pb-2 pt-1 text-center text-[clamp(11px,4.2cqi,20px)] font-medium text-black">
          {projects[activeIndex]?.title}
        </p>
      </div>
    );
  },
);

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

  const filterStyle = useTransform(
    scrollX,
    (value) => `brightness(${Math.abs(index - value) < 0.5 ? 1 : 0.55})`,
  );

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 cursor-pointer"
      style={{
        width: size,
        height: size,
        marginTop: -size / 2,
        marginLeft: -size / 2,
        x,
        z,
        rotateY,
        zIndex,
        filter: filterStyle,
        pointerEvents: "auto",
        transformStyle: "preserve-3d",
      }}
      onClick={onCardClick}
    >
      <CoverArt
        project={project}
        className="size-full border border-black/10 shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
        priority={isActive}
      />

      {/* Mirrored, fading reflection — classic Cover Flow "floor" effect.
          A mask (not an opaque overlay) fades the mirrored art itself to
          transparent, so the reflection stays a true dissolving copy of
          the cover instead of washing out to a flat white/gray block. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-full w-full overflow-hidden"
        style={{
          height: reflectionHeight,
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0) 100%)",
        }}
      >
        <div
          className="w-full"
          style={{ height: size, transform: "scaleY(-1)", transformOrigin: "top" }}
        >
          <CoverArt project={project} className="size-full" />
        </div>
      </div>
    </motion.div>
  );
});
