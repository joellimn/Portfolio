import Link from "next/link";
import { NameScramble } from "@/components/portfolio/NameScramble";
import { WorkCover } from "@/components/portfolio/WorkCover";
import { WorkIntro } from "@/components/portfolio/WorkIntro";

/** UMG / Wearitt autoplay (Figma: no hover needed). SOAR phases into its
 * video on hover. WTTIN stays a still. */
const WORKS = [
  {
    id: "umg",
    cover: "/assets/work/umg.png?v=3",
    video: "/assets/Cover Videos/Umg Cover Video.mp4?v=3",
    kicker: "Universal Music Group - Summer 2026",
    title: "Redesigning low-code tools with AI",
    tags: ["Enterprise Design", "AI", "Figma MCP", "Codex", "Gemini Enterprise"],
  },
  {
    id: "soar",
    cover: "/assets/work/soar.png",
    video: "/assets/Cover Videos/SOAR Cover Video.mp4",
    playOnHover: true,
    kicker: "U.S. Army - Spring 2026",
    title: "Modernizing Manual Application Review",
    tags: ["Class project", "Dashboard Design", "Interaction Design", "Figma Make"],
  },
  {
    id: "wearitt",
    cover: "/assets/work/wearitt.png",
    video: "/assets/Cover Videos/Wearitt Cover Video.mp4",
    kicker: "Wearitt - Winter 2026",
    title: "Building a design system for mobile wardrobe app",
    tags: ["Design System"],
  },
  {
    id: "wttin",
    cover: "/assets/work/wttin.png?v=2",
    kicker: "Where to Turn in Nashville - Fall 2025",
    title: "Designing and deploying a mobile app for a non-profit",
    tags: ["Prototyping", "End to end", "Internal beta"],
  },
] as const;

export function WorkBody() {
  return (
    <>
      <section className="w-full px-[32px] py-[8px] text-[24px]">
        <div className="flex max-w-[75ch] flex-col gap-[16px] tracking-[-1px]">
          <p className="text-[24px] leading-[24px] text-black">
            <NameScramble /> is a product designer who turns dense, complex
            workflows into intuitive digital experiences.
          </p>
          <p className="text-[20px] leading-[24px] text-black/50">
            Studying Human and Organizational Development and Computer Science
            <span className="text-black"> @ Vanderbilt University</span>
            <br />
            Previously UX Intern
            <span className="text-black"> @ Universal Music Group</span>
          </p>
        </div>
      </section>

      <section
        aria-label="Selected work"
        className="grid w-full grid-cols-1 gap-x-[16px] gap-y-[16px] px-[32px] sm:grid-cols-2"
      >
        {WORKS.map((work) => (
          <Link
            key={work.id}
            href={`/${work.id}`}
            data-cursor="case-study"
            className="flex flex-col gap-[16px]"
            aria-label={`${work.kicker} case study`}
          >
            <div className="relative aspect-[552/400] w-full overflow-hidden rounded-[2px] bg-white">
              <WorkCover
                cover={work.cover}
                video={"video" in work ? work.video : undefined}
                playOnHover={"playOnHover" in work && work.playOnHover}
              />
            </div>
            <div className="flex flex-col px-[8px] py-[8px] text-black">
              <p className="text-[16px] leading-[28px] font-light">{work.kicker}</p>
              <p className="text-[20px] leading-[28px]">{work.title}</p>
              <p className="flex flex-wrap gap-x-[12px] text-[12px] leading-[24px] font-light text-black/50">
                {work.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}

export function WorkPage() {
  return (
    <WorkIntro>
      <WorkBody />
    </WorkIntro>
  );
}
