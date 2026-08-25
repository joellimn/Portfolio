"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CoverFlow,
  type CoverFlowItem,
  type RenderImageProps,
} from "@ashishgogula/coverflow";
import { motion, useReducedMotion } from "motion/react";
import { PhotoStack } from "@/components/portfolio/PhotoStack";
import { SectionReveal } from "@/components/portfolio/SectionReveal";
import { projects } from "@/data/projects";
import { EASE_OUT, FADE_DURATION } from "@/lib/motion";

const lineVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: FADE_DURATION, ease: EASE_OUT },
  },
};

const introVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const EMAIL = "joel.c.lim@vanderbilt.edu";
const LINKEDIN = "https://www.linkedin.com/in/joelchaelim/";
const RESUME = "/Joel-Lim-Resume.pdf";

const COVER_V2: Record<string, string> = {
  soar: "/assets/covers/v2/soar.png",
  umg: "/assets/covers/v2/umg.png",
  wearitt: "/assets/covers/v2/wearitt.png",
  wttin: "/assets/covers/v2/wttin.png",
};

const SOAR_INDEX = projects.findIndex((project) => project.id === "soar");

const COVER_ITEMS: CoverFlowItem[] = projects.map((project) => ({
  id: project.id,
  image: COVER_V2[project.id] ?? project.coverSrc,
  title: project.title,
  subtitle: undefined,
}));

function renderCoverImage(props: RenderImageProps) {
  return (
    <Image
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      className={props.className.replace("object-cover", "object-contain")}
      draggable={props.draggable}
      sizes={props.sizes}
      priority={props.priority}
      unoptimized
    />
  );
}

export function PortfolioV2() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [view, setView] = useState<"cover" | "grid">("cover");
  const [activeIndex, setActiveIndex] = useState(
    SOAR_INDEX >= 0 ? SOAR_INDEX : 0,
  );
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    if (!emailCopied) return;
    const timer = window.setTimeout(() => setEmailCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [emailCopied]);

  const openProject = (id: string) => {
    router.push(`/${id}`);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setEmailCopied(true);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-[64px] pt-[50px] pb-[64px]">
        <motion.section
          className="flex w-full items-center justify-center px-8 py-[8px] lg:px-[256px]"
          variants={introVariants}
          initial={reduced ? false : "hidden"}
          animate="show"
        >
          <div className="min-w-0 flex-1 text-[24px] leading-[24px] tracking-[-1px]">
            <motion.p variants={lineVariants}>Joel Lim</motion.p>
            <motion.p className="text-black/50" variants={lineVariants}>
              Product Designer
            </motion.p>
            <p className="h-[24px]" aria-hidden>
              &nbsp;
            </p>
            <motion.p variants={lineVariants}>
              <span className="text-black/50">
                A decade as a musician taught me that every song has a story. In
                product design, I carry that forward by{" "}
              </span>
              <span>
                telling stories through user-centric products and interactions.
              </span>
            </motion.p>
            <p className="h-[24px]" aria-hidden>
              &nbsp;
            </p>
            <motion.p variants={lineVariants}>
              <span className="text-black/50">Previously UX Intern at</span>
              <span> Universal Music Group</span>
            </motion.p>
          </div>
        </motion.section>

        <section
          id="works"
          className="portfolio-works-enter flex w-full flex-col gap-[16px]"
        >
            <div className="flex w-full flex-col items-end px-8 lg:px-[256px]">
              <div
                role="group"
                aria-label="Works view"
                className="grid grid-cols-2 items-center rounded-[24px] bg-black/10 p-[3px] shadow-[3px_3px_7.5px_0px_rgba(0,0,0,0.05)]"
              >
                <button
                  type="button"
                  onClick={() => setView("cover")}
                  className={`flex items-center justify-center rounded-[24px] px-[8px] py-[3px] transition-[background-color,box-shadow,opacity] duration-200 ${
                    view === "cover"
                      ? "bg-white shadow-[3px_3px_7.5px_0px_rgba(0,0,0,0.05)]"
                      : "opacity-50 hover:opacity-80"
                  }`}
                  aria-pressed={view === "cover"}
                >
                  <span className="text-[15px] leading-[18px] tracking-[-0.75px] whitespace-nowrap text-black">
                    Cover view
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`flex items-center justify-center rounded-[24px] px-[8px] py-[3px] transition-[background-color,box-shadow,opacity] duration-200 ${
                    view === "grid"
                      ? "bg-white shadow-[3px_3px_7.5px_0px_rgba(0,0,0,0.05)]"
                      : "opacity-50 hover:opacity-80"
                  }`}
                  aria-pressed={view === "grid"}
                >
                  <span className="text-[15px] leading-[18px] tracking-[-0.75px] whitespace-nowrap text-black">
                    Grid view
                  </span>
                </button>
              </div>
            </div>

            <div className="relative w-full">
              <div
                className={`portfolio-coverflow h-[568px] w-full transition-opacity duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  view === "cover"
                    ? "relative opacity-100"
                    : "pointer-events-none invisible absolute inset-x-0 top-0 overflow-hidden opacity-0"
                }`}
                aria-hidden={view !== "cover"}
                inert={view !== "cover" ? true : undefined}
              >
                <CoverFlow
                  items={COVER_ITEMS}
                  itemWidth={520}
                  itemHeight={492}
                  stackSpacing={90}
                  centerGap={280}
                  rotation={50}
                  initialIndex={activeIndex}
                  enableReflection={false}
                  enableClickToSnap
                  enableScroll
                  scrollThreshold={800}
                  enableAudio
                  className="[&>.absolute]:hidden"
                  onIndexChange={setActiveIndex}
                  onItemClick={(item) => openProject(String(item.id))}
                  renderImage={renderCoverImage}
                />
              </div>
              <div
                className={`grid w-full grid-cols-1 gap-8 px-8 transition-opacity duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:grid-cols-2 lg:px-[64px] ${
                  view === "grid"
                    ? "relative opacity-100"
                    : "pointer-events-none absolute inset-x-0 top-0 opacity-0"
                }`}
                aria-hidden={view !== "grid"}
                inert={view !== "grid" ? true : undefined}
              >
                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => openProject(project.id)}
                    tabIndex={view === "grid" ? 0 : -1}
                    className="group relative aspect-[600/568] rounded-[32px] shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
                    aria-label={`${project.title} case study`}
                  >
                    <span className="block size-full overflow-hidden rounded-[32px]">
                      <Image
                        src={COVER_V2[project.id] ?? project.coverSrc}
                        alt={project.title}
                        width={600}
                        height={568}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                        unoptimized
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
        </section>

        <section
          id="about"
          className="flex w-full flex-col items-start gap-6 px-8 lg:px-[256px]"
        >
          <SectionReveal className="min-w-0 flex-1 text-[24px] leading-[28px] tracking-[-1px]">
            <p>A little bit about myself</p>
            <p className="mt-4">
              <span className="text-black/50">I am a student at </span>
              <span>Vanderbilt University</span>
              <span className="text-black/50"> from </span>
              <span>Memphis, Tennessee.</span>
              <span className="text-black/50">
                {" "}
                Growing up, I was constantly{" "}
              </span>
              <span>surrounded by design</span>
              <span className="text-black/50">
                {" "}
                since my father was an interior designer. That early exposure
                sparked my own passion for creativity and problem-solving
                through design.{" "}
              </span>
            </p>
            <p className="mt-4 text-black/50">
              Apart from design, I also love soccer, cooking, and playing
              guitar!
            </p>
          </SectionReveal>
          <SectionReveal className="flex w-full flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
            <p className="min-w-0 text-right text-[20px] leading-normal text-black/50 md:flex-1">
              Pictures from my recent trip to NYC.
            </p>
            <PhotoStack />
          </SectionReveal>
        </section>

        <SectionReveal className="w-full">
          <section
            id="contact"
            className="flex w-full flex-col items-center pt-24 text-[20px] leading-normal"
          >
            <div className="flex w-full items-center justify-center px-[8px] py-[4px]">
              <p className="font-medium text-black">Contact</p>
            </div>
            <button
              type="button"
              onClick={copyEmail}
              data-cursor="copy"
              data-copied={emailCopied ? "true" : undefined}
              className="px-[8px] py-[4px] text-center text-black/50 transition-colors hover:text-black"
            >
              {emailCopied ? "Copied" : "Email"}
            </button>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              className="flex w-full items-center justify-center px-[8px] py-[4px] text-black/50 transition-colors hover:text-black"
            >
              LinkedIn
            </a>
            <a
              href={RESUME}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              className="flex w-full items-center justify-center px-[8px] py-[4px] text-black/50 transition-colors hover:text-black"
            >
              Resume
            </a>
          </section>
        </SectionReveal>
      </div>
    </div>
  );
}
