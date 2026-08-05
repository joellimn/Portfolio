"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ClickWheel } from "@/components/ipod/ClickWheel";
import { IpodStickers } from "@/components/ipod/IpodStickers";
import { StatusBar } from "@/components/ipod/StatusBar";
import {
  computeRestZoomGeometry,
  useIpodChassisSize,
} from "@/hooks/useIpodChassisSize";

type IpodDeviceProps = {
  /** 0 = resting (full chassis visible), 1 = fully zoomed in so the screen
   * fills the viewport and the rest of the chassis is out of frame. */
  zoomProgress: MotionValue<number>;
  /** When true, allow the full-bleed stage (About / case study). Menu→Works
   * stays on the chassis transform so the zoom never cuts to a new layout. */
  forceStage?: boolean;
  onStageModeChange?: (staged: boolean) => void;
  statusTitle: string;
  showPlaying?: boolean;
  onBack?: () => void;
  /** Shrink the LCD status bar while reading a scrolled case study. */
  statusCompact?: boolean;
  overlay?: React.ReactNode;
  children: React.ReactNode;
  onMenu?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onPlay?: () => void;
  onSelect?: () => void;
};

type ZoomGeometry = {
  originX: number;
  originY: number;
  tx: number;
  ty: number;
  scale: number;
};

const REST_GEOMETRY: ZoomGeometry = {
  originX: 0,
  originY: 0,
  tx: 0,
  ty: 0,
  scale: 1,
};

// No overshoot — Menu→Works stays on the chassis transform the whole way,
// so there's no stage handoff to soften.
const SCALE_OVERSHOOT = 1;

export function IpodDevice({
  zoomProgress,
  forceStage = false,
  onStageModeChange,
  statusTitle,
  showPlaying = false,
  onBack,
  statusCompact = false,
  overlay,
  children,
  onMenu,
  onPrev,
  onNext,
  onPlay,
  onSelect,
}: IpodDeviceProps) {
  const { widthPx, screenAspect } = useIpodChassisSize();
  const chassisRef = useRef<HTMLDivElement>(null);
  const screenContentRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const geometryRef = useRef<ZoomGeometry>(REST_GEOMETRY);
  const [transformOrigin, setTransformOrigin] = useState(
    `${REST_GEOMETRY.originX}px ${REST_GEOMETRY.originY}px`,
  );

  const zoomRender = useSpring(zoomProgress, {
    stiffness: 280,
    damping: 36,
    mass: 0.85,
  });

  const [stageMode, setStageMode] = useState(
    () => forceStage && zoomProgress.get() >= 1,
  );
  const stageBlend = useMotionValue(stageMode ? 1 : 0);
  const forceStageRef = useRef(forceStage);
  const onStageModeChangeRef = useRef(onStageModeChange);
  const sizeRef = useRef({ widthPx, screenAspect });
  sizeRef.current = { widthPx, screenAspect };

  useEffect(() => {
    forceStageRef.current = forceStage;
    onStageModeChangeRef.current = onStageModeChange;
  }, [forceStage, onStageModeChange]);

  const seedExitGeometry = useCallback(() => {
    const { widthPx: w, screenAspect: aspect } = sizeRef.current;
    const next = computeRestZoomGeometry(
      w,
      aspect,
      window.innerWidth,
      window.innerHeight,
    );
    geometryRef.current = next;
    setTransformOrigin(`${next.originX}px ${next.originY}px`);
  }, []);

  const syncStage = useCallback(() => {
    const open = zoomProgress.get() >= 1;
    const settled = zoomRender.get() >= 0.995;
    const alreadyStaged = stageBlend.get() === 1;
    // Stage only while About / case study need full-bleed. Leaving those
    // (or zooming out) must drop stage immediately — staying staged until
    // mid-zoom-out caused a geometry-less layout swap that flickered on
    // production. Seed rest zoom geometry first so the chassis transform
    // picks up at the same visual scale.
    const next =
      open && forceStageRef.current && (settled || alreadyStaged);
    if (alreadyStaged === next) return;
    if (alreadyStaged && !next) seedExitGeometry();
    stageBlend.set(next ? 1 : 0);
    setStageMode(next);
    onStageModeChangeRef.current?.(next);
  }, [stageBlend, zoomProgress, zoomRender, seedExitGeometry]);

  useMotionValueEvent(zoomProgress, "change", syncStage);
  useMotionValueEvent(zoomRender, "change", syncStage);

  useEffect(() => {
    syncStage();
  }, [forceStage, syncStage]);

  useEffect(() => {
    if (stageMode) return;

    const measure = () => {
      const chassis = chassisRef.current;
      // Zoom to the white glass (inside the dark bezel), so the bezel
      // scales off-screen by the time the screen fills the viewport.
      const glassEl = glassRef.current ?? screenContentRef.current;
      if (!chassis || !glassEl) return;
      if (zoomProgress.get() > 0.001 || zoomRender.get() > 0.001) return;

      const chassisRect = chassis.getBoundingClientRect();
      const glassRect = glassEl.getBoundingClientRect();
      const glassCenterX = glassRect.left + glassRect.width / 2;
      const glassCenterY = glassRect.top + glassRect.height / 2;
      const scale = Math.max(
        window.innerWidth / glassRect.width,
        window.innerHeight / glassRect.height,
      );
      geometryRef.current = {
        originX: glassCenterX - chassisRect.left,
        originY: glassCenterY - chassisRect.top,
        tx: window.innerWidth / 2 - glassCenterX,
        ty: window.innerHeight / 2 - glassCenterY,
        scale,
      };
      setTransformOrigin(
        `${geometryRef.current.originX}px ${geometryRef.current.originY}px`,
      );
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [widthPx, screenAspect, zoomProgress, zoomRender, stageMode]);

  const chassisX = useTransform([zoomRender, stageBlend], (latest) => {
    const [progress, staged] = latest as [number, number];
    return staged ? 0 : geometryRef.current.tx * progress;
  });
  const chassisY = useTransform([zoomRender, stageBlend], (latest) => {
    const [progress, staged] = latest as [number, number];
    return staged ? 0 : geometryRef.current.ty * progress;
  });
  const chassisScale = useTransform([zoomRender, stageBlend], (latest) => {
    const [progress, staged] = latest as [number, number];
    if (staged) return 1;
    const target = geometryRef.current.scale * SCALE_OVERSHOOT;
    return 1 + (target - 1) * progress;
  });

  const screenBorderRadius = useTransform(zoomRender, [0, 0.88], [8, 0]);
  const chassisRadius = useTransform(zoomRender, [0, 0.8], [38, 0]);
  const chromeOpacity = useTransform(zoomRender, [0, 0.12], [1, 0]);
  const wheelOpacity = useTransform(zoomRender, [0, 0.35], [1, 0]);
  const wheelPointerEvents = useTransform(zoomRender, (progress) =>
    progress > 0.02 ? "none" : "auto",
  );

  return (
    <motion.div
      ref={chassisRef}
      className={
        stageMode
          ? "fixed inset-0 z-10"
          : "relative mx-auto origin-center"
      }
      style={
        stageMode
          ? {
              width: "100%",
              height: "100%",
              x: chassisX,
              y: chassisY,
              scale: chassisScale,
            }
          : {
              width: widthPx,
              x: chassisX,
              y: chassisY,
              scale: chassisScale,
              transformOrigin,
              willChange: "transform",
            }
      }
    >
      <motion.div
        className={
          stageMode
            ? "relative flex h-full w-full flex-col overflow-hidden bg-white"
            : "ipod-chassis relative overflow-hidden"
        }
        style={stageMode ? undefined : { borderRadius: chassisRadius }}
      >
        {!stageMode ? (
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ opacity: chromeOpacity }}
          >
            <div
              className="absolute inset-0 opacity-20 mix-blend-soft-light"
              style={{
                backgroundImage: "url(/assets/ipod/noise.png)",
                backgroundSize: "cover",
              }}
            />
            <IpodStickers />
            <div className="absolute inset-x-[8%] top-0 h-[3%] rounded-full bg-gradient-to-b from-black/40 to-transparent blur-md" />
            <div className="absolute inset-x-0 bottom-0 h-[12%] rounded-full bg-gradient-to-t from-black/55 to-transparent blur-md" />
            <div
              className="absolute left-[-6%] top-[4%] h-[96%] w-[12%] rounded-full blur-md"
              style={{
                backgroundImage: "url(/assets/ipod/shadow-left.png)",
                backgroundSize: "cover",
              }}
            />
            <div
              className="absolute right-[-5%] top-[4%] h-[96%] w-[11%] rounded-full blur-md"
              style={{
                backgroundImage: "url(/assets/ipod/shadow-right.png)",
                backgroundSize: "cover",
              }}
            />
          </motion.div>
        ) : null}

        <div
          className={
            stageMode
              ? "relative flex min-h-0 flex-1 flex-col"
              : "relative z-[2] px-[8%] pb-[10%] pt-[6.5%]"
          }
        >
          <motion.div
            ref={screenContentRef}
            className={
              stageMode
                ? "relative min-h-0 w-full flex-1 overflow-hidden bg-white"
                : "ipod-screen-bezel relative w-full overflow-hidden p-[1.9%]"
            }
            style={stageMode ? undefined : { borderRadius: screenBorderRadius }}
          >
            <div
              ref={glassRef}
              className={
                stageMode
                  ? "absolute inset-0 overflow-hidden bg-white [container-type:size]"
                  : "relative w-full overflow-hidden rounded-[1px] bg-white [container-type:size]"
              }
              style={{
                ...(stageMode ? undefined : { aspectRatio: screenAspect }),
                ["--status-bar-h" as string]: statusCompact
                  ? "5.2cqi"
                  : "8.5cqi",
              }}
            >
              <StatusBar
                title={statusTitle}
                showPlaying={showPlaying}
                onBack={onBack}
                compact={statusCompact}
              />
              <div
                className="absolute inset-x-0 bottom-0 overflow-hidden"
                style={{ top: statusCompact ? "5.2cqi" : "8.5cqi" }}
              >
                {children}
              </div>
              {overlay}
            </div>
          </motion.div>

          {!stageMode ? (
            <motion.div
              className="relative mx-auto mt-[14%] w-[61%] overflow-hidden"
              style={{
                opacity: wheelOpacity,
                pointerEvents: wheelPointerEvents,
              }}
            >
              <ClickWheel
                opacity={1}
                onMenu={onMenu}
                onPrev={onPrev}
                onNext={onNext}
                onPlay={onPlay}
                onSelect={onSelect}
              />
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
