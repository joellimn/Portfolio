"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AboutScreen } from "@/components/ipod/AboutScreen";
import { CaseStudyView } from "@/components/ipod/CaseStudyView";
import { CoverFlow, type CoverFlowHandle } from "@/components/ipod/CoverFlow";
import { HeroScreen } from "@/components/ipod/HeroScreen";
import { IpodDevice } from "@/components/ipod/IpodDevice";
import {
  NavigationDrawer,
  type NavTarget,
} from "@/components/ipod/NavigationDrawer";
import { projects } from "@/data/projects";

type Screen = "hero" | "projects" | "about" | "reading";

const screenVariants = {
  enter: { opacity: 0, y: 28 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -28 },
};

export function PortfolioExperience() {
  const studyScrollRef = useRef<HTMLDivElement>(null);
  const aboutScrollRef = useRef<HTMLDivElement>(null);
  const coverFlowRef = useRef<CoverFlowHandle>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [screen, setScreen] = useState<Screen>("hero");
  const [navOpen, setNavOpen] = useState(false);

  const activeProject = projects[activeIndex];

  const statusTitle = useMemo(() => {
    if (screen === "reading") return "Now Playing";
    if (screen === "projects") return "Projects";
    if (screen === "about") return "About";
    return "Menu";
  }, [screen]);

  const goProjects = useCallback(() => setScreen("projects"), []);

  const goAbout = useCallback(() => {
    setScreen("about");
    requestAnimationFrame(() => aboutScrollRef.current?.scrollTo({ top: 0 }));
  }, []);

  const goPrev = useCallback(() => {
    // Coming back from About lands on the last cover, mirroring the
    // forward transition that carried you into it.
    if (screen === "about") {
      setActiveIndex(projects.length - 1);
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
  }, [screen]);

  const goNext = useCallback(() => {
    if (screen === "about") return;
    // Pressing next on the last cover carries you forward into About,
    // instead of wrapping back around to the first cover.
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
      setScreen("projects");
    },
    [goAbout],
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <IpodDevice
        statusTitle={statusTitle}
        showPlaying={screen === "reading" && isPlaying}
        onBack={screen !== "hero" && !navOpen ? toggleNav : undefined}
        overlay={
          <NavigationDrawer
            open={navOpen}
            active={navActive}
            onNavigate={handleNavigate}
            onClose={() => setNavOpen(false)}
          />
        }
        onMenu={toggleNav}
        onPrev={navOpen ? undefined : goPrev}
        onNext={navOpen ? undefined : goNext}
        onPlay={navOpen ? undefined : togglePlay}
        onSelect={
          navOpen
            ? undefined
            : () => {
                if (screen === "hero") goProjects();
                else if (screen === "projects") openCaseStudy(activeIndex);
              }
        }
      >
        <AnimatePresence initial={false}>
          {screen === "hero" ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <HeroScreen onEnter={goProjects} />
            </motion.div>
          ) : screen === "projects" ? (
            <motion.div
              key="projects"
              variants={screenVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <CoverFlow
                ref={coverFlowRef}
                projects={projects}
                activeIndex={activeIndex}
                onActiveIndexChange={setActiveIndex}
                onSelect={openCaseStudy}
                onReachEnd={goAbout}
              />
            </motion.div>
          ) : screen === "about" ? (
            <motion.div
              key="about"
              variants={screenVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <AboutScreen scrollRef={aboutScrollRef} onScrollBack={goPrev} />
            </motion.div>
          ) : (
            <motion.div
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <CaseStudyView
                project={activeProject}
                scrollRef={studyScrollRef}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </IpodDevice>
    </div>
  );
}
