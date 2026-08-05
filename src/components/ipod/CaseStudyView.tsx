"use client";

import type { RefObject } from "react";
import type { Project } from "@/data/projects";
import { CaseStudyBlocks } from "@/components/ipod/CaseStudyBlocks";
import { CoverWithReflection } from "@/components/ipod/CoverWithReflection";

type CaseStudyViewProps = {
  project: Project;
  scrollRef?: RefObject<HTMLDivElement | null>;
  /** End-of-track control — returns to Cover Flow / Works. */
  onReturn?: () => void;
};

export function CaseStudyView({
  project,
  scrollRef,
  onReturn,
}: CaseStudyViewProps) {
  const hasRichContent = Boolean(project.blocks?.length);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto overscroll-contain"
    >
      <div className="flex w-full flex-col gap-[5.5cqi] px-[max(32px,15cqi)] py-[4.5cqi]">
        {/* Classic Now Playing hero — same cover + reflection as Cover Flow */}
        <div className="flex w-full items-start gap-[4.5cqi]">
          <CoverWithReflection
            project={project}
            className="w-[30%] shrink-0"
            priority
            rotateY={-16}
          />

          <div className="flex min-w-0 flex-1 flex-col gap-[2.8cqi] pt-[0.2cqi]">
            <div className="flex flex-col gap-[0.35cqi]">
              <h1 className="text-[clamp(16px,5.2cqi,36px)] font-bold leading-[1.12] tracking-tight text-black">
                {project.title}
              </h1>
              <p className="text-[clamp(10px,2.55cqi,19px)] font-semibold leading-snug text-black/55">
                {project.subtitle}
              </p>
            </div>

            {project.meta ? (
              <div className="grid w-full grid-cols-2 gap-x-[2.2cqi] gap-y-[1.8cqi] border-t border-black/[0.08] pt-[2.4cqi] sm:grid-cols-4">
                {project.meta.map((item) => (
                  <div key={item.label} className="flex flex-col gap-[0.4cqi]">
                    <p className="text-[clamp(6.5px,1.6cqi,11.5px)] font-bold uppercase tracking-[0.14em] text-black/35">
                      {item.label}
                    </p>
                    <div className="text-[clamp(8px,1.95cqi,15px)] font-medium leading-snug text-black/80">
                      {item.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {hasRichContent ? (
          <CaseStudyBlocks blocks={project.blocks!} />
        ) : (
          project.sections.map((section) => (
            <section key={section.heading} className="space-y-[1.2cqi]">
              <h2 className="text-[clamp(13px,3.6cqi,24px)] font-semibold text-black">
                {section.heading}
              </h2>
              <p className="text-[clamp(11.5px,2.9cqi,19px)] leading-[1.55] text-black/72">
                {section.body}
              </p>
            </section>
          ))
        )}

        <button
          type="button"
          onClick={onReturn}
          className="w-full pb-[2cqi] text-center text-[clamp(8.5px,2cqi,15px)] text-black/32 transition-colors hover:text-black/55"
        >
          Return to works
        </button>
      </div>
    </div>
  );
}
