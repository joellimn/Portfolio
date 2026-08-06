"use client";

import type { RefObject } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { CaseStudyBlocks } from "@/components/ipod/CaseStudyBlocks";
import { CoverWithReflection } from "@/components/ipod/CoverWithReflection";

type CaseStudyViewProps = {
  project: Project;
  scrollRef?: RefObject<HTMLDivElement | null>;
  /** End-of-track control — returns to Cover Flow / Works. */
  onReturn?: () => void;
};

function MetaGrid({ project }: { project: Project }) {
  if (!project.meta?.length) return null;

  return (
    <div className="grid w-full grid-cols-2 gap-x-[2.2cqi] gap-y-[1.8cqi] @[32rem]:grid-cols-4">
      {project.meta.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col gap-[0.4cqi]">
          <p className="text-[clamp(6.5px,1.6cqi,11.5px)] font-bold uppercase tracking-[0.14em] text-black/35">
            {item.label}
          </p>
          <div className="min-w-0 text-[clamp(8px,1.95cqi,15px)] font-medium leading-snug break-words text-black/80">
            {item.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CaseStudyView({
  project,
  scrollRef,
  onReturn,
}: CaseStudyViewProps) {
  const hasRichContent = Boolean(project.blocks?.length);
  const useBannerHero = Boolean(project.heroBanner);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto overscroll-contain"
    >
      <div className="flex w-full flex-col gap-[5.5cqi] py-[4.5cqi]">
        {useBannerHero && project.heroBanner ? (
          // Traditional case-study hero (banner → title → meta), Sofi-inspired.
          // Shorter Figma banners (930×500) sit wider than the reading column
          // so the mockups read larger without eating the viewport.
          <div className="@container flex w-full flex-col gap-[3.2cqi]">
            <div className="px-[max(12px,5cqi)]">
              <div className="relative w-full overflow-hidden rounded-[max(6px,0.9cqi)] bg-white">
                <Image
                  src={project.heroBanner.src}
                  alt={project.heroBanner.alt}
                  width={3720}
                  height={2000}
                  className="h-auto w-full object-cover"
                  sizes="100vw"
                  priority
                  unoptimized
                />
              </div>
            </div>

            <div className="flex flex-col gap-[1.6cqi] px-[max(32px,15cqi)]">
              <div className="flex flex-col gap-[0.55cqi]">
                <h1 className="text-[clamp(22px,5.6cqi,40px)] font-bold leading-[1.1] tracking-tight text-black">
                  {project.title}
                </h1>
                <p className="max-w-[52ch] text-[clamp(12px,2.7cqi,20px)] font-medium leading-snug text-black/55">
                  {project.subtitle}
                </p>
              </div>

              <div className="border-t border-black/[0.08] pt-[2.4cqi]">
                <MetaGrid project={project} />
              </div>
            </div>
          </div>
        ) : (
          // Classic Now Playing hero — album cover + reflection.
          <div className="flex w-full items-start gap-[4.5cqi] px-[max(32px,15cqi)]">
            <CoverWithReflection
              project={project}
              className="w-[min(42%,280px)] shrink-0"
              priority
              rotateY={-16}
            />

            <div className="@container flex min-w-0 flex-1 flex-col gap-[2.8cqi] pt-[0.2cqi]">
              <div className="flex flex-col gap-[0.35cqi]">
                <h1 className="text-[clamp(16px,5.2cqi,36px)] font-bold leading-[1.12] tracking-tight text-black">
                  {project.title}
                </h1>
                <p className="text-[clamp(10px,2.55cqi,19px)] font-semibold leading-snug text-black/55">
                  {project.subtitle}
                </p>
              </div>

              <div className="border-t border-black/[0.08] pt-[2.4cqi]">
                <MetaGrid project={project} />
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full flex-col gap-[5.5cqi] px-[max(32px,15cqi)]">
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
    </div>
  );
}
