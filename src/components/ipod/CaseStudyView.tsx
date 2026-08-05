"use client";

import Image from "next/image";
import { useCallback, useState, type RefObject, type UIEvent } from "react";
import type { Project } from "@/data/projects";
import { CoverArt } from "@/components/ipod/CoverArt";
import { CaseStudyBlocks } from "@/components/ipod/CaseStudyBlocks";

type CaseStudyViewProps = {
  project: Project;
  scrollRef?: RefObject<HTMLDivElement | null>;
};

export function CaseStudyView({ project, scrollRef }: CaseStudyViewProps) {
  const hasRichContent = Boolean(project.blocks?.length);
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0);
  }, []);

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="h-full overflow-y-auto overscroll-contain"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-[4cqi] px-[4.5cqi] py-[4cqi]">
        {/* Now Playing hero — kept side-by-side at every size, per design. */}
        <div className="flex w-full flex-col gap-[2.6cqi]">
          <div className="flex w-full items-start gap-[3.5cqi]">
            {project.heroArt ? (
              <div className="relative aspect-square w-[24%] shrink-0 overflow-hidden border border-black/15">
                <Image
                  src={project.heroArt.src}
                  alt={project.heroArt.alt}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              </div>
            ) : (
              <CoverArt
                project={project}
                className="aspect-square w-[24%] shrink-0 border border-black/15"
                priority
              />
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-[2cqi]">
              <div className="flex flex-col gap-[0.4cqi]">
                <h1 className="text-[clamp(11px,4.4cqi,22px)] font-bold tracking-tight text-black">
                  {project.title}
                </h1>
                <p className="text-[clamp(8px,2.2cqi,13px)] text-black/55">
                  {project.subtitle}
                </p>
              </div>

              {project.meta ? (
                <div className="grid w-full grid-cols-4 gap-x-[1.4cqi]">
                  {project.meta.map((item) => (
                    <div key={item.label} className="flex flex-col gap-[0.3cqi]">
                      <p className="text-[clamp(5.5px,1.5cqi,8.5px)] font-semibold uppercase tracking-[0.1em] text-black/40">
                        {item.label}
                      </p>
                      <div className="text-[clamp(6px,1.6cqi,9px)] leading-snug text-black/75">
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

          {project.meta ? (
            <>
              <div className="h-px w-full bg-black/15" />
              <div className="h-[1.6cqi] min-h-[6px] w-full border border-black/15">
                <div
                  className="h-full bg-accent-blue"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </>
          ) : null}
        </div>

        {hasRichContent ? (
          <CaseStudyBlocks blocks={project.blocks!} />
        ) : (
          project.sections.map((section) => (
            <section key={section.heading} className="space-y-[1cqi]">
              <h2 className="text-[clamp(12px,3.6cqi,19px)] font-semibold text-black">
                {section.heading}
              </h2>
              <p className="text-[clamp(11px,2.8cqi,15px)] leading-relaxed text-black/70">
                {section.body}
              </p>
            </section>
          ))
        )}

        <p className="pb-[3cqi] text-center text-[clamp(9px,2.2cqi,13px)] text-black/40">
          End of track — press MENU to return to Cover Flow
        </p>
      </div>
    </div>
  );
}
