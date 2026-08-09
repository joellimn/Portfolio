"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
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
import { useIpodLighting } from "@/hooks/useIpodLighting";
import { statusBarHeightCqi } from "@/lib/chromeDensity";

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
  /** Hide the viewport-native sharp chrome (About / reading cover it). */
  suppressSharpChrome?: boolean;
  overlay?: React.ReactNode;
  children: React.ReactNode;
  onMenu?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onPlay?: () => void;
  onSelect?: () => void;
  /**
   * Touch Menu: tap anywhere on the LCD glass (same action as the center
   * wheel button). Rendered as a real full-glass <button> so iOS hit-testing
   * under chassis transforms stays reliable.
   */
  onScreenTap?: () => void;
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
  suppressSharpChrome = false,
  overlay,
  children,
  onMenu,
  onPrev,
  onNext,
  onPlay,
  onSelect,
  onScreenTap,
}: IpodDeviceProps) {
  const { widthPx, screenAspect } = useIpodChassisSize();
  const chassisRef = useRef<HTMLDivElement>(null);
  const screenContentRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const geometryRef = useRef<ZoomGeometry>(REST_GEOMETRY);
  // Bumped whenever geometryRef changes so chassis transforms re-read it
  // even if zoomProgress is already settled (deep link / refresh on /works).
  const geometryTick = useMotionValue(0);
  const [transformOrigin, setTransformOrigin] = useState(
    `${REST_GEOMETRY.originX}px ${REST_GEOMETRY.originY}px`,
  );
  const [portalReady, setPortalReady] = useState(false);

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

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const applyGeometry = useCallback((next: ZoomGeometry) => {
    geometryRef.current = next;
    setTransformOrigin(`${next.originX}px ${next.originY}px`);
    geometryTick.set(geometryTick.get() + 1);
  }, [geometryTick]);

  const seedExitGeometry = useCallback(() => {
    const { widthPx: w, screenAspect: aspect } = sizeRef.current;
    applyGeometry(
      computeRestZoomGeometry(
        w,
        aspect,
        window.innerWidth,
        window.innerHeight,
      ),
    );
  }, [applyGeometry]);

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

  // Deep links / refresh can land with zoom already at 1. DOM measure while
  // transformed is wrong, and skipping measure leaves scale=1 (zoomed out).
  // Always seed from layout math; refine with getBoundingClientRect only at rest.
  useLayoutEffect(() => {
    if (stageMode) return;

    const seedComputed = () => {
      applyGeometry(
        computeRestZoomGeometry(
          widthPx,
          screenAspect,
          window.innerWidth,
          window.innerHeight,
        ),
      );
    };

    const measure = () => {
      const chassis = chassisRef.current;
      const glassEl = glassRef.current ?? screenContentRef.current;
      if (!chassis || !glassEl) {
        seedComputed();
        return;
      }

      if (zoomProgress.get() > 0.001 || zoomRender.get() > 0.001) {
        seedComputed();
        return;
      }

      const chassisRect = chassis.getBoundingClientRect();
      const glassRect = glassEl.getBoundingClientRect();
      if (glassRect.width < 1 || glassRect.height < 1) {
        seedComputed();
        return;
      }

      const glassCenterX = glassRect.left + glassRect.width / 2;
      const glassCenterY = glassRect.top + glassRect.height / 2;
      applyGeometry({
        originX: glassCenterX - chassisRect.left,
        originY: glassCenterY - chassisRect.top,
        tx: window.innerWidth / 2 - glassCenterX,
        ty: window.innerHeight / 2 - glassCenterY,
        scale: Math.max(
          window.innerWidth / glassRect.width,
          window.innerHeight / glassRect.height,
        ),
      });
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [
    widthPx,
    screenAspect,
    zoomProgress,
    zoomRender,
    stageMode,
    applyGeometry,
  ]);

  const chassisX = useTransform(
    [zoomRender, stageBlend, geometryTick],
    (latest) => {
      const [progress, staged] = latest as [number, number, number];
      return staged ? 0 : geometryRef.current.tx * progress;
    },
  );
  const chassisY = useTransform(
    [zoomRender, stageBlend, geometryTick],
    (latest) => {
      const [progress, staged] = latest as [number, number, number];
      return staged ? 0 : geometryRef.current.ty * progress;
    },
  );
  const chassisScale = useTransform(
    [zoomRender, stageBlend, geometryTick],
    (latest) => {
      const [progress, staged] = latest as [number, number, number];
      if (staged) return 1;
      const target = geometryRef.current.scale * SCALE_OVERSHOOT;
      return 1 + (target - 1) * progress;
    },
  );

  const screenBorderRadius = useTransform(zoomRender, [0, 0.88], [8, 0]);
  const chassisRadius = useTransform(zoomRender, [0, 0.8], [38, 0]);
  const chromeOpacity = useTransform(zoomRender, [0, 0.12], [1, 0]);
  const wheelOpacity = useTransform(zoomRender, [0, 0.35], [1, 0]);
  const wheelPointerEvents = useTransform(zoomRender, (progress) =>
    progress > 0.02 ? "none" : "auto",
  );

  // HTML chrome (status bar / nav) re-rasterizes soft under the chassis
  // scale — same reason Cover Flow titles are canvas. Keep the in-glass
  // bar on the chassis transform for the whole zoom, then swap to a
  // viewport-native overlay only at the very end (once sizes already
  // match) so the top bar doesn't appear to race ahead of the screen.
  const glassUiOpacity = useTransform(zoomRender, [0.97, 1], [1, 0]);
  const sharpUiOpacity = useTransform(zoomRender, [0.97, 1], [0, 1]);
  const [sharpChrome, setSharpChrome] = useState(
    () => !stageMode && zoomRender.get() >= 0.97,
  );

  useMotionValueEvent(zoomRender, "change", (progress) => {
    setSharpChrome((prev) => {
      if (stageMode) return false;
      // Hysteresis so the portal stays mounted through the crossfade.
      if (prev) return progress >= 0.96;
      return progress >= 0.97;
    });
  });

  useEffect(() => {
    if (stageMode) {
      setSharpChrome(false);
      return;
    }
    setSharpChrome(zoomRender.get() >= 0.97);
  }, [stageMode, zoomRender]);

  const statusBarCqi = statusBarHeightCqi("device");
  const showSharpPortal =
    portalReady && sharpChrome && !suppressSharpChrome;

  // Sheen / glass glare only on the resting Menu — never in zoomed Works /
  // About / case study (stageMode stays false for Works; use zoom instead).
  const [menuRest, setMenuRest] = useState(() => zoomProgress.get() < 0.04);
  useMotionValueEvent(zoomRender, "change", (value) => {
    setMenuRest(value < 0.04);
  });
  useIpodLighting(chassisRef, menuRest && !stageMode);

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
            aria-hidden
          >
            {/* Brushed aluminum layers */}
            <div className="ipod-metal-grain absolute inset-0" />
            <div className="ipod-metal-sheen absolute inset-0" />
            <div className="ipod-metal-specular absolute inset-0" />
            {/* Soft isotropic grit on top of the brush */}
            <div
              className="absolute inset-0 opacity-[0.14] mix-blend-soft-light"
              style={{
                backgroundImage: "url(/assets/ipod/noise.png)",
                backgroundSize: "cover",
              }}
            />
            <IpodStickers />
            <div className="absolute inset-x-[8%] top-0 h-[3%] rounded-full bg-gradient-to-b from-black/35 to-transparent blur-md" />
            <div className="absolute inset-x-0 bottom-0 h-[12%] rounded-full bg-gradient-to-t from-black/45 to-transparent blur-md" />
            <div
              className="absolute left-[-6%] top-[4%] h-[96%] w-[12%] rounded-full blur-md opacity-80"
              style={{
                backgroundImage: "url(/assets/ipod/shadow-left.png)",
                backgroundSize: "cover",
              }}
            />
            <div
              className="absolute right-[-5%] top-[4%] h-[96%] w-[11%] rounded-full blur-md opacity-80"
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
                ["--status-bar-h" as string]: statusBarCqi,
              }}
            >
              <motion.div
                className={
                  showSharpPortal ? "pointer-events-none" : undefined
                }
                style={{
                  opacity:
                    stageMode || !showSharpPortal ? 1 : glassUiOpacity,
                }}
                aria-hidden={showSharpPortal || undefined}
              >
                <StatusBar
                  title={statusTitle}
                  showPlaying={showPlaying}
                  onBack={onBack}
                  density="device"
                />
              </motion.div>
              <div
                className="absolute inset-x-0 bottom-0 overflow-hidden"
                style={{ top: statusBarCqi }}
              >
                {children}
              </div>
              {onScreenTap ? (
                <button
                  type="button"
                  aria-label="Tap to view works"
                  onClick={onScreenTap}
                  className="absolute inset-0 z-[25] touch-manipulation bg-transparent"
                />
              ) : null}
              {/* Glass reflection — Menu at rest only (not zoomed Works/etc.) */}
              {menuRest && !stageMode ? (
                <div
                  data-ipod-glass
                  className="ipod-glass-reflect pointer-events-none absolute inset-0 z-[28] overflow-hidden"
                  aria-hidden
                >
                  <div className="ipod-glass-tint absolute inset-0" />
                  <div className="ipod-glass-gloss absolute inset-0" />
                  <div className="ipod-metal-sheen absolute" />
                  <div className="ipod-metal-specular absolute" />
                </div>
              ) : null}
              {/*
                Always pointer-events-none: NavigationDrawer only opts back in
                when open. An empty inset wrapper here used to sit above the
                Menu tap target and swallow all LCD touches on mobile.
              */}
              {overlay && (stageMode || !showSharpPortal) ? (
                <div className="pointer-events-none absolute inset-0 z-30">
                  {overlay}
                </div>
              ) : null}
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

      {showSharpPortal
        ? createPortal(
            <motion.div
              className="pointer-events-none fixed inset-0 z-[15] [container-type:size]"
              style={{ opacity: sharpUiOpacity }}
            >
              <div className="pointer-events-auto relative z-20 w-full">
                <StatusBar
                  title={statusTitle}
                  showPlaying={showPlaying}
                  onBack={onBack}
                  density="stage"
                />
              </div>
              {overlay}
            </motion.div>,
            document.body,
          )
        : null}
    </motion.div>
  );
}
