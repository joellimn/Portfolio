"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";
import { AboutScreen } from "@/components/ipod/AboutScreen";
import { CaseStudyView } from "@/components/ipod/CaseStudyView";
import { CoverFlow, type CoverFlowHandle } from "@/components/ipod/CoverFlow";
import { HeroScreen } from "@/components/ipod/HeroScreen";
import { IpodDevice } from "@/components/ipod/IpodDevice";
import {
  NavigationDrawer,
  type NavTarget,
} from "@/components/ipod/NavigationDrawer";
import { StatusBar } from "@/components/ipod/StatusBar";
import { projects } from "@/data/projects";

type Screen = "hero" | "projects" | "about" | "reading";

// 1 = scroll forward into About, -1 = scroll back to Works.
// Enter and exit both travel through the same offset for a given
// direction so scroll-in and scroll-out feel like one continuous motion.
const screenVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction * 28,
  }),
  center: { opacity: 1, y: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction * -28,
  }),
};

const SCREEN_EASE = [0.22, 1, 0.36, 1] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const ZOOM_SCROLL_RANGE = 640;
const ZOOM_SPRING = { stiffness: 280, damping: 36, mass: 0.85 };
// Midpoint of the Menu→Cover Flow opacity crossfade [0.08, 0.48].
const TITLE_SWAP_AT = 0.28;

/**
 * Menu = zoomed-out frame of Works. Cover Flow stays mounted under the glass
 * for the whole session. About / case study are full-viewport overlays on top
 * — they never flip IpodDevice into stageMode, which was causing the
 * production flicker when zooming back out after About.
 */
export function PortfolioExperience() {
  const studyScrollRef = useRef<HTMLDivElement>(null);
  const aboutScrollRef = useRef<HTMLDivElement>(null);
  const coverFlowRef = useRef<CoverFlowHandle>(null);
  const zoomOpenRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [screen, setScreen] = useState<Screen>("hero");
  const [navOpen, setNavOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [statusCompact, setStatusCompact] = useState(false);
  const [slideDirection, setSlideDirection] = useState(1);

  const zoomProgress = useMotionValue(0);
  const zoomRender = useSpring(zoomProgress, ZOOM_SPRING);
  const menuOverlayOpacity = useTransform(zoomRender, [0.08, 0.48], [1, 0]);

  const screenRef = useRef(screen);
  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  useEffect(() => {
    if (screen !== "reading") {
      setStatusCompact(false);
      return;
    }

    let cancelled = false;
    let detach: (() => void) | undefined;

    const attach = () => {
      if (cancelled) return;
      const el = studyScrollRef.current;
      if (!el) {
        requestAnimationFrame(attach);
        return;
      }
      const onScroll = () => {
        const y = el.scrollTop;
        setStatusCompact((prev) => {
          if (prev) return y > 6;
          return y > 28;
        });
      };
      onScroll();
      el.addEventListener("scroll", onScroll, { passive: true });
      detach = () => el.removeEventListener("scroll", onScroll);
    };
    attach();

    return () => {
      cancelled = true;
      detach?.();
    };
  }, [screen, activeIndex]);

  const activeProject = projects[activeIndex];
  const overlayOpen = screen === "about" || screen === "reading";
  const coversLive = screen === "projects" && zoomOpen;

  const [projectsTitle, setProjectsTitle] = useState(false);
  const projectsTitleRef = useRef(false);

  const glassStatusTitle = projectsTitle ? "Works" : "Menu";

  const enterProjects = useCallback(() => {
    zoomProgress.set(1);
    setZoomOpen(true);
    zoomOpenRef.current = true;
    setProjectsTitle(true);
    projectsTitleRef.current = true;
    setScreen("projects");
  }, [zoomProgress]);

  const goAbout = useCallback(() => {
    setSlideDirection(1);
    zoomProgress.set(1);
    setZoomOpen(true);
    zoomOpenRef.current = true;
    setProjectsTitle(true);
    projectsTitleRef.current = true;
    setScreen("about");
    requestAnimationFrame(() => aboutScrollRef.current?.scrollTo({ top: 0 }));
  }, [zoomProgress]);

  const handleStageModeChange = useCallback((staged: boolean) => {
    if (staged && screenRef.current === "hero") {
      startTransition(() => setScreen("projects"));
    }
  }, []);

  useMotionValueEvent(zoomRender, "change", (value) => {
    const open = value >= 0.98;
    if (open !== zoomOpenRef.current) {
      zoomOpenRef.current = open;
      setZoomOpen(open);
    }
    const titled = value >= TITLE_SWAP_AT;
    if (titled !== projectsTitleRef.current) {
      projectsTitleRef.current = titled;
      setProjectsTitle(titled);
    }
  });

  useEffect(() => {
    if (screen !== "hero") return;

    let pendingDelta = 0;
    let raf = 0;

    const flush = () => {
      raf = 0;
      const next = clamp(
        zoomProgress.get() + pendingDelta / ZOOM_SCROLL_RANGE,
        0,
        1,
      );
      pendingDelta = 0;
      zoomProgress.set(next);
      if (next >= 1) {
        startTransition(() => setScreen("projects"));
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY <= 0) {
        return;
      }
      event.preventDefault();
      pendingDelta += event.deltaY;
      if (!raf) raf = requestAnimationFrame(flush);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [screen, zoomProgress]);

  useEffect(() => {
    if (screen !== "projects") return;

    let pendingDelta = 0;
    let raf = 0;

    const flush = () => {
      raf = 0;
      if (zoomProgress.get() >= 1) {
        pendingDelta = 0;
        return;
      }
      const next = clamp(
        zoomProgress.get() + pendingDelta / ZOOM_SCROLL_RANGE,
        0,
        1,
      );
      pendingDelta = 0;
      zoomProgress.set(next);
      if (next <= 0) {
        startTransition(() => setScreen("hero"));
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (zoomProgress.get() >= 1) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      pendingDelta += event.deltaY;
      if (!raf) raf = requestAnimationFrame(flush);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [screen, zoomProgress]);

  const handleReachStart = useCallback(
    (deltaY: number) => {
      if (Math.abs(deltaY) >= 1e5) {
        zoomProgress.set(0);
        startTransition(() => setScreen("hero"));
        return;
      }
      const next = clamp(
        zoomProgress.get() + deltaY / ZOOM_SCROLL_RANGE,
        0,
        0.999,
      );
      zoomProgress.set(next);
    },
    [zoomProgress],
  );

  const goPrev = useCallback(() => {
    if (screen === "about") {
      setSlideDirection(-1);
      setActiveIndex(projects.length - 1);
      zoomProgress.set(1);
      setZoomOpen(true);
      zoomOpenRef.current = true;
      setScreen("projects");
      requestAnimationFrame(() =>
        coverFlowRef.current?.scrollToIndex(projects.length - 1),
      );
      return;
    }
    setActiveIndex((i) => {
      const next = (i - 1 + projects.length) % projects.length;
      if (screen === "reading") {
        studyScrollRef.current?.scrollTo({ top: 0 });
      } else {
        coverFlowRef.current?.scrollToIndex(next);
      }
      return next;
    });
  }, [screen, zoomProgress]);

  const goNext = useCallback(() => {
    if (screen === "about") return;
    if (screen === "projects" && activeIndex === projects.length - 1) {
      goAbout();
      return;
    }
    setActiveIndex((i) => {
      const next = (i + 1) % projects.length;
      if (screen === "reading") {
        studyScrollRef.current?.scrollTo({ top: 0 });
      } else {
        coverFlowRef.current?.scrollToIndex(next);
      }
      return next;
    });
  }, [screen, activeIndex, goAbout]);

  const openCaseStudy = useCallback((index: number) => {
    setActiveIndex(index);
    setScreen("reading");
    requestAnimationFrame(() => studyScrollRef.current?.scrollTo({ top: 0 }));
  }, []);

  const backToCoverFlow = useCallback(() => {
    const index = screen === "about" ? projects.length - 1 : activeIndex;
    if (screen === "about") setSlideDirection(-1);
    zoomProgress.set(1);
    setZoomOpen(true);
    zoomOpenRef.current = true;
    setActiveIndex(index);
    setScreen("projects");
    requestAnimationFrame(() => coverFlowRef.current?.scrollToIndex(index));
  }, [zoomProgress, activeIndex, screen]);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);
  const toggleNav = useCallback(() => setNavOpen((open) => !open), []);

  const navActive: NavTarget | null =
    screen === "about" ? "about" : screen === "hero" ? null : "projects";

  const handleNavigate = useCallback(
    (target: NavTarget) => {
      setNavOpen(false);
      if (target === "about") {
        goAbout();
        return;
      }
      if (screenRef.current === "about") setSlideDirection(-1);
      enterProjects();
    },
    [goAbout, enterProjects],
  );

  const glassBack =
    navOpen
      ? undefined
      : projectsTitle
        ? toggleNav
        : undefined;

  const overlayBack =
    navOpen
      ? undefined
      : screen === "reading"
        ? backToCoverFlow
        : screen === "about"
          ? toggleNav
          : undefined;

  const drawer = (
    <NavigationDrawer
      open={navOpen}
      active={navActive}
      onNavigate={handleNavigate}
      onClose={() => setNavOpen(false)}
    />
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-white">
      <IpodDevice
        zoomProgress={zoomProgress}
        forceStage={false}
        suppressSharpChrome={overlayOpen}
        onStageModeChange={handleStageModeChange}
        statusTitle={glassStatusTitle}
        showPlaying={false}
        onBack={overlayOpen ? undefined : glassBack}
        statusCompact={false}
        overlay={overlayOpen ? undefined : drawer}
        onMenu={overlayOpen ? undefined : toggleNav}
        onPrev={navOpen || !coversLive || overlayOpen ? undefined : goPrev}
        onNext={navOpen || !coversLive || overlayOpen ? undefined : goNext}
        onPlay={navOpen || overlayOpen ? undefined : togglePlay}
        onSelect={
          navOpen || overlayOpen
            ? undefined
            : () => {
                if (screen === "hero") enterProjects();
                else if (screen === "projects" && coversLive) {
                  openCaseStudy(activeIndex);
                }
              }
        }
      >
        {/* Cover Flow stays mounted forever — About/Reading never remount it. */}
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-0">
            <CoverFlow
              ref={coverFlowRef}
              projects={projects}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
              onSelect={openCaseStudy}
              onReachEnd={goAbout}
              onReachStart={handleReachStart}
              zoomProgress={zoomProgress}
              active={coversLive}
            />
          </div>

          <motion.div
            className="absolute inset-0 z-[1] bg-white"
            style={{
              opacity: menuOverlayOpacity,
              pointerEvents: screen === "hero" ? "auto" : "none",
            }}
            aria-hidden={screen !== "hero"}
          >
            <HeroScreen />
          </motion.div>
        </div>
      </IpodDevice>

      <AnimatePresence initial={false} custom={slideDirection}>
        {screen === "about" ? (
          <motion.div
            key="about"
            custom={slideDirection}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: SCREEN_EASE }}
            className="fixed inset-0 z-20 bg-white [container-type:size]"
            style={{
              ["--status-bar-h" as string]: "8.5cqi",
            }}
          >
            {/* Status bar is painted in a counter-moving layer so it stays
                visually fixed while the page slides — same enter and exit. */}
            <motion.div
              custom={slideDirection}
              variants={{
                enter: (direction: number) => ({ y: direction * -28 }),
                center: { y: 0 },
                exit: (direction: number) => ({ y: direction * 28 }),
              }}
              transition={{ duration: 0.45, ease: SCREEN_EASE }}
              className="relative z-20"
            >
              <StatusBar title="About" onBack={overlayBack} />
            </motion.div>
            <div
              className="absolute inset-x-0 bottom-0 overflow-hidden"
              style={{ top: "var(--status-bar-h)" }}
            >
              <AboutScreen
                scrollRef={aboutScrollRef}
                onScrollBack={goPrev}
              />
            </div>
            {drawer}
          </motion.div>
        ) : null}

        {screen === "reading" ? (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-white [container-type:size]"
            style={{
              ["--status-bar-h" as string]: statusCompact ? "5.2cqi" : "8.5cqi",
            }}
          >
            <StatusBar
              title="Now Playing"
              showPlaying={isPlaying}
              onBack={overlayBack}
              compact={statusCompact}
            />
            <div
              className="absolute inset-x-0 bottom-0 overflow-hidden"
              style={{ top: statusCompact ? "5.2cqi" : "8.5cqi" }}
            >
              <CaseStudyView
                project={activeProject}
                scrollRef={studyScrollRef}
                onReturn={backToCoverFlow}
              />
            </div>
            {drawer}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
