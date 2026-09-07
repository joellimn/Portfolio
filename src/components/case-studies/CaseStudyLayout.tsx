import type { ReactNode } from "react";
import Image from "next/image";
import { CaseStudyBody } from "@/components/case-studies/CaseStudyToc";
import type { TocItem } from "@/data/caseStudyToc";
import {
  CASE_STUDY_FOOTER,
  SiteFooter,
} from "@/components/portfolio/SiteFooter";

export function CaseStudyHero({
  src,
  alt,
  tall = false,
  contain = false,
}: {
  src: string;
  alt: string;
  tall?: boolean;
  contain?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${
        tall ? "aspect-[1200/483]" : "aspect-[1200/400]"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className={contain ? "object-contain" : "object-cover"}
        priority
        unoptimized
      />
    </div>
  );
}

export function CaseStudyIntro({
  title,
  meta,
}: {
  title: string;
  meta: { label: string; value: string }[];
}) {
  return (
    <div>
      <h1 className="px-8 py-4 text-[32px] leading-[40px] text-black">
        {title}
      </h1>
      <div className="flex flex-col gap-8 px-8 py-8 sm:flex-row sm:gap-0">
        {meta.map((item) => (
          <div
            key={item.label}
            className="flex min-w-0 flex-1 flex-col gap-2 px-4"
          >
            <p className="text-[16px] leading-[24px] text-black">{item.label}</p>
            <p className="text-[16px] leading-[21px] text-black/80">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CaseStudyLayout({
  hero,
  heroAlt,
  tallHero,
  containHero,
  title,
  meta,
  toc,
  onHome,
  projectId,
  children,
}: {
  hero: string;
  heroAlt: string;
  tallHero?: boolean;
  containHero?: boolean;
  title: string;
  meta: { label: string; value: string }[];
  toc: TocItem[];
  onHome?: () => void;
  projectId: keyof typeof CASE_STUDY_FOOTER;
  children: ReactNode;
}) {
  return (
    <article className="bg-white">
      <CaseStudyHero
        src={hero}
        alt={heroAlt}
        tall={tallHero}
        contain={containHero}
      />
      <CaseStudyBody items={toc} onHome={onHome}>
        <CaseStudyIntro title={title} meta={meta} />
        {children}
      </CaseStudyBody>
      <SiteFooter next={CASE_STUDY_FOOTER[projectId]} />
    </article>
  );
}
