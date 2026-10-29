import Link from "next/link";
import { NissanCover } from "@/components/portfolio/NissanCover";
import { WorkCover } from "@/components/portfolio/WorkCover";
import { WorkIntro } from "@/components/portfolio/WorkIntro";

type Work = {
  id: string;
  cover: string;
  video?: string;
  playOnHover?: boolean;
  href?: string;
  external?: boolean;
  hoverLabel?: string;
  kicker: string;
  engagement?: string;
  title: string;
  tags: string[];
  aspect: `${number}/${number}`;
  fit?: "cover" | "contain";
  coverBg?: string;
};

const NISSAN: Work = {
  id: "nissan",
  cover: "/assets/work/v5/nissan.png",
  hoverLabel: "Coming Soon",
  kicker: "Nissan - Present",
  engagement: "Fellowship",
  title: "Nissan Intelligent Key",
  tags: ["Enterprise Design", "Cross Functional Collaboration"],
  aspect: "552/355",
};

const UMG: Work = {
  id: "umg",
  cover: "/assets/work/v5/umg.png",
  video: "/assets/Cover Videos/Umg Cover Video.mp4?v=3",
  playOnHover: true,
  href: "/umg",
  kicker: "Universal Music Group - Summer 2026",
  engagement: "Internship",
  title: "Redesigning internal tools with AI",
  tags: ["Enterprise Design", "AI", "Figma MCP", "Codex", "Gemini Enterprise"],
  aspect: "560/397",
};

const SOAR: Work = {
  id: "soar",
  cover: "/assets/work/v5/soar.png",
  video: "/assets/Cover Videos/SOAR Cover Video.mp4",
  playOnHover: true,
  href: "/soar",
  kicker: "U.S. Army - Spring 2026",
  engagement: "Class project",
  title: "Modernizing Manual Application Review",
  tags: ["Dashboard Design", "Interaction Design", "Figma Make"],
  aspect: "552/400",
};

const WOVEN: Work = {
  id: "woven",
  cover: "/assets/work/v5/woven.png?v=11",
  video: "/assets/work/v5/woven.mp4?v=11",
  href: "https://woven-rust-iota.vercel.app/welcome",
  external: true,
  hoverLabel: "Open Prototype",
  kicker: "Woven - Fall 2026",
  engagement: "Competition",
  title: "Imagining a Connected Digital Reading Experience",
  tags: ["Prototyping", "Interaction Design"],
  aspect: "560/482",
  coverBg: "#C8C9E3",
};

const WTTIN: Work = {
  id: "wttin",
  cover: "/assets/work/v5/wttin.png",
  href: "/wttin",
  kicker: "Where to Turn in Nashville - Fall 2025",
  engagement: "Internship",
  title: "Designing and deploying a mobile app for a non-profit",
  tags: ["Prototyping", "End to end", "Internal beta"],
  aspect: "552/539",
};

const WEARITT: Work = {
  id: "wearitt",
  cover: "/assets/work/v5/wearitt.png",
  video: "/assets/work/v5/wearitt.mp4",
  href: "/wearitt",
  kicker: "Wearitt - Winter 2026",
  engagement: "Internship",
  title: "Building a design system for mobile wardrobe app",
  tags: ["Design System"],
  aspect: "552/415",
};

const LEFT = [NISSAN, SOAR, WTTIN] as const;
const RIGHT = [UMG, WOVEN, WEARITT] as const;
const STACKED = [NISSAN, UMG, SOAR, WOVEN, WTTIN, WEARITT] as const;

function WorkCard({ work, fill }: { work: Work; fill?: boolean }) {
  const frameClass = `flex flex-col gap-[8px]${fill ? " min-h-0 flex-1" : ""}`;
  const cursorType = work.hoverLabel
    ? work.external
      ? "external"
      : "label"
    : work.href
      ? work.external
        ? "external"
        : "case-study"
      : undefined;
  const cover = (
    <div
      data-cursor={cursorType}
      data-cursor-label={work.hoverLabel}
      className={`relative w-full overflow-hidden rounded-[2px]${fill ? " min-h-0 flex-1" : ""}`}
      style={{
        backgroundColor: work.coverBg ?? "#ffffff",
        ...(fill ? {} : { aspectRatio: work.aspect }),
      }}
    >
      {work.id === "nissan" ? (
        <NissanCover />
      ) : (
        <WorkCover
          cover={work.cover}
          video={work.video}
          playOnHover={work.playOnHover}
          fit={work.fit}
        />
      )}
    </div>
  );

  const caption = (
    <div className="flex flex-col pt-[16px] pb-[8px] text-black">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[16px] leading-[28px] font-light">{work.kicker}</p>
        {work.engagement ? (
          <p className="shrink-0 text-[12px] leading-[24px] font-light text-black/50">
            {work.engagement}
          </p>
        ) : null}
      </div>
      <p className="text-[20px] leading-[28px] font-light capitalize">{work.title}</p>
      <p className="flex flex-wrap gap-x-[12px] text-[12px] leading-[24px] font-light text-black/50">
        {work.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </p>
    </div>
  );

  if (work.href && work.external) {
    return (
      <a
        href={work.href}
        target="_blank"
        rel="noreferrer"
        className={frameClass}
        aria-label={`${work.hoverLabel ?? "Open"} — ${work.title}`}
      >
        {cover}
        {caption}
      </a>
    );
  }

  if (work.href) {
    return (
      <Link
        href={work.href}
        className={frameClass}
        aria-label={`${work.kicker} case study`}
      >
        {cover}
        {caption}
      </Link>
    );
  }

  return (
    <article className={frameClass}>
      {cover}
      {caption}
    </article>
  );
}

export function WorkBody() {
  return (
    <div className="-mt-3 flex flex-col gap-[50px] sm:-mt-4">
      <section className="w-full px-[32px]">
        <div className="flex w-full flex-col gap-[16px]">
          <p className="text-[32px] leading-[40px] font-light text-black">
            Joel Lim is a product designer who builds operational products
            with an AI-enhanced workflow.
          </p>
          <p
            data-nav-swap
            className="text-[24px] leading-[30px] font-light text-black/50"
          >
            Studying{" "}
            <span className="text-black">
              Human and Organizational Development and Computer Science @
              Vanderbilt University
            </span>
            <br />
            Previously UX Intern
            <span className="text-black"> @ Universal Music Group</span>
          </p>
        </div>
      </section>

      <section aria-label="Selected work" className="w-full px-[32px]">
        <div className="flex flex-col gap-[16px] sm:hidden">
          {STACKED.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
        <div className="hidden gap-[16px] sm:flex">
          <div className="flex min-w-0 flex-1 flex-col gap-[16px]">
            {LEFT.map((work, i) => (
              <WorkCard
                key={work.id}
                work={work}
                fill={i === LEFT.length - 1}
              />
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[16px]">
            {RIGHT.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function WorkPage() {
  return (
    <WorkIntro>
      <WorkBody />
    </WorkIntro>
  );
}
