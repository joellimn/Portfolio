import type { ReactNode } from "react";
import Image from "next/image";
import { CaseStudyLayout } from "@/components/case-studies/CaseStudyLayout";
import { CaseStudyVideo } from "@/components/case-studies/CaseStudyVideo";
import {
  Em,
  Figure,
  Label,
  MediaMat,
  Takeaway,
} from "@/components/case-studies/CaseStudyPrimitives";
import { CASE_STUDY_TOC } from "@/data/caseStudyToc";

const v4 = (file: string) => `/assets/case-studies/v4/soar/${file}`;
const media = (file: string) => `/assets/case-studies/soar/${file}`;
const ACCENT = "#8a7a45";

function Card({
  title,
  children,
  tone,
}: {
  title: string;
  children: ReactNode;
  tone: "white" | "cream-1" | "cream-2" | "cream-3";
}) {
  const cream = tone !== "white";
  const bg =
    tone === "cream-1"
      ? "bg-[#f7f2de]"
      : tone === "cream-2"
        ? "bg-[#f6eed5]"
        : tone === "cream-3"
          ? "bg-[#f2e7c4]"
          : "bg-white shadow-[4px_4px_5px_rgba(0,0,0,0.05)]";

  return (
    <div
      className={`flex min-w-0 flex-1 flex-col self-stretch border border-solid border-[#f6f0de] p-4 ${
        cream ? "rounded" : "rounded-[32px]"
      } ${bg}`}
    >
      <p className="p-2 text-[24px] leading-[27.5px] text-black">{title}</p>
      <p className="p-2 text-[20px] leading-[27.5px] text-black/50">{children}</p>
    </div>
  );
}

type SoarCaseStudyProps = {
  onReturn?: () => void;
};

export function SoarCaseStudy({ onReturn }: SoarCaseStudyProps) {
  return (
    <div className="w-full bg-white pb-16 font-sans">
      <CaseStudyLayout
        onHome={onReturn}
        hero="/assets/case-studies/heroes/soar.png"
        heroAlt="160th SOAR assessment packet inbox overlapping a packet overview"
        tallHero
        title="Modernizing Manual Application Review"
        meta={[
          {
            label: "Role",
            value: "Design Lead - Interaction Design, Rapid Prototyping",
          },
          { label: "Timeline", value: "January 2026 – May 2026" },
          { label: "Team", value: "Project Manager, UX Researcher" },
          {
            label: "Tools/Skills",
            value: "User Research, Figma Make, Figma, Miro",
          },
        ]}
        toc={CASE_STUDY_TOC.soar}
      >
        <section id="problem" className="scroll-mt-24">
          <Label color={ACCENT}>Problem</Label>
          <p className="px-8 text-[32px] leading-[40px] text-black">
            44 Pages, reviewed manually...
          </p>
          <p className="px-8 pt-4 text-[16px] leading-6 text-black/50">
            Evaluating 160th SOAR officer candidates was bogged down by a
            fragmented, 90-day review cycle. Reviewers relied on{" "}
            <Em>manual SharePoint</Em> workflows to evaluate dense 44-page
            packets across separate battalions, leading to severe administrative{" "}
            <Em>bottlenecks</Em> and subjective <Em>&quot;gut-feel&quot;</Em>{" "}
            scoring.
          </p>
        </section>

        <section id="goal" className="scroll-mt-24">
          <Label color={ACCENT}>Goal</Label>
          <p className="px-8 pb-8 text-[32px] leading-[40px] text-black/50">
            <Em>How might we</Em> standardize candidate scoring with a{" "}
            <Em>single, unified review dashboard?</Em>
          </p>
        </section>

        <section id="design" className="scroll-mt-24">
          <Label color={ACCENT}>Design</Label>
          <p className="px-8 text-[32px] leading-[40px] text-black">
            At its core - The Evaluation Rubric.
          </p>
          <p className="px-8 pt-4 text-[20px] leading-[27.5px] text-black/50">
            &quot;Our decisions and what we do... is like extremely{" "}
            <Em>schizophrenic</Em> and changes and is a lot of like{" "}
            <Em>intuition and gut feel.</Em>&quot; — Assessment Officer
          </p>
          <Figure
            src={v4("rubric.png")}
            alt="Evaluation rubric with 1–5 benchmarked scores"
            width={3824}
            height={2924}
          />
          <p className="px-8 pt-8 text-[24px] leading-[27.5px] text-black">
            What started as a <Em>simple pdf...</Em>
          </p>
          <Figure
            src={v4("pdf.png")}
            alt="Initial PDF packet beside the first digital prototype"
            width={3824}
            height={2055}
          />
          <p className="px-8 pt-4 text-[24px] leading-[27.5px] text-black">
            evolved into an <Em>interactive digital experience.</Em>
          </p>
          <div className="flex flex-col gap-4 px-8 py-8">
            <MediaMat tone="cream" className="w-full p-8">
              <CaseStudyVideo
                src={media("rubric-extended.mp4")}
                label="Collapsible rubric details expanding over 1–5 benchmark scores"
                width={1254}
                height={356}
                className="w-full"
              />
            </MediaMat>
            <p className="text-[20px] leading-[27.5px] text-black/50">
              Introduced collapsible sections to{" "}
              <Em>maximize screen real estate</Em> and{" "}
              <Em>reduce cognitive load</Em> during dense packet reviews.
            </p>
          </div>
          <Figure
            src={v4("scoring.png")}
            alt="Automated scoring row on the evaluation rubric"
            width={3825}
            height={1287}
          />
          <p className="px-8 pt-8 text-[24px] leading-[27.5px] text-black/50">
            Split-screen view allows for seamless cross-referencing, cutting
            review time
          </p>
          <figure className="px-8 py-4">
            <MediaMat tone="cream" className="w-full p-8">
              <CaseStudyVideo
                src={media("rubric-splitscreen.mp4")}
                label="Split-screen packet and rubric view"
                width={1436}
                height={1022}
                className="w-full max-w-[760px]"
              />
            </MediaMat>
          </figure>
          <p className="px-8 pt-8 text-[32px] leading-[40px] text-black">
            Remember, our users are <Em>military.</Em>
          </p>
          <p className="px-8 pt-4 text-[20px] leading-[27.5px] text-black/50">
            Designed for <Em>non-technical</Em> military personnel to pick up
            and use immediately, without second-guessing icons or workflows.
          </p>
          <div className="grid grid-cols-1 items-start gap-8 px-8 py-8 md:grid-cols-3">
            <div className="flex flex-col items-center gap-8">
              <CaseStudyVideo
                src={media("icon-tooltips.mp4")}
                label="Hover tooltips explaining dashboard icon actions"
                radius="clip"
                width={592}
                height={294}
                cropX={3}
                cropTop={3}
                cropBottom={3}
                className="w-full border border-solid border-[#f8e575]"
              />
              <p className="p-2 text-[24px] leading-[27.5px] text-black/50">
                Hover <Em>tooltips</Em> over icons so you never have to guess
                what a button does.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Image
                src={v4("onboarding.png")}
                alt="Getting Started onboarding checklist"
                width={1184}
                height={1576}
                className="h-auto w-full"
                unoptimized
              />
              <p className="p-2 text-[24px] leading-[27.5px] text-black/50">
                <Em>Onboarding</Em> popups to guide users through their next
                steps.
              </p>
            </div>
            <Image
              src={v4("onboarding-expanded.png")}
              alt="Onboarding popup with a packet overview preview"
              width={1168}
              height={2008}
              className="h-auto w-full"
              unoptimized
            />
          </div>
          <p className="px-8 pt-8 text-[32px] leading-[40px] text-black">
            Simple interactions. <Em>Faster</Em> decisions.
          </p>
          <p className="px-8 pt-4 text-[20px] leading-[27.5px] text-black/50">
            The timeline from application to assessment: &quot;average is, I
            think, <Em>3 to 4 months...</Em> but it sometimes pushes to{" "}
            <Em>9 months.</Em>&quot; — Assessment Officer
          </p>
          <Figure
            src={v4("flags.png")}
            alt="Flags disqualifiers early in the packet review"
            width={3824}
            height={1846}
          />
          <Figure
            src={v4("activity.png")}
            alt="Live activity log of packet reviews and handoffs"
            width={3824}
            height={1718}
          />
        </section>

        <section id="process" className="scroll-mt-24">
          <Label color={ACCENT}>Process</Label>
          <p className="px-8 text-[32px] leading-[27.5px] text-black">
            Rapid Prototyping with AI.
          </p>
          <p className="px-8 pt-6 text-[32px] leading-[27.5px] text-[#ab9334]">
            Why?
          </p>
          <div className="flex flex-col gap-8 px-8 py-8 md:flex-row md:items-stretch">
            <Card title="Sprint Velocity" tone="cream-1">
              Spun up a functional baseline in days, speeding up feedback loops
              between stakeholder reviews.
            </Card>
            <Card title="Realistic Synthetic Data" tone="cream-2">
              Generated complex edge-case candidate files (flight hour
              minimums, legal/drug flags, diverse ratings) instantly.
            </Card>
            <Card title="Live Flow Validation" tone="cream-3">
              Let key stakeholders test real, interactive queues instead of
              clicking through static mockups.
            </Card>
          </div>
          <p className="px-8 text-[32px] leading-[32px] text-black">
            A <Em>solid foundation</Em>. A necessary <Em>redesign.</Em>
          </p>
          <Figure
            src={v4("figma-make.png")}
            alt="Figma Make assessment tracker beside the redesigned packet inbox"
            width={3824}
            height={1511}
          />
          <div className="flex flex-col items-start gap-10 px-8 py-8 md:flex-row">
            <div className="min-w-0 flex-1 py-4 text-right">
              <p className="text-[24px] leading-[27.5px] text-black/50">
                <Em>Jakob’s Law</Em>: Traditional Sidebar
              </p>
              <p className="mt-2 text-[16px] leading-[27.5px] text-black/50">
                Replaced non-standard navigation with a{" "}
                <Em>familiar left sidebar</Em>, reclaiming core screen real
                estate and eliminating learning curves for reviewers.
              </p>
            </div>
            <MediaMat tone="gold" className="w-full shrink-0 p-8 md:w-auto">
              <CaseStudyVideo
                src={media("sidebar-expand.mp4")}
                label="Sidebar expanding from icon rail to a traditional navigation list"
                width={508}
                height={670}
                cropX={3}
                cropTop={3}
                cropBottom={3}
                className="w-[min(100%,420px)]"
              />
            </MediaMat>
          </div>
          <Figure
            src={v4("success.png")}
            alt="Peak-End Rule success state after submitting a vote"
            width={3824}
            height={1905}
          />
        </section>

        <section id="impact" className="scroll-mt-24">
          <Label color={ACCENT}>Impact</Label>
          <p className="px-8 text-center text-[32px] leading-[48px] text-black/50">
            &quot;This is again, this is awesome.{" "}
            <Em>I wish it wasn&apos;t a prototype.</Em>&quot;
          </p>
          <p className="px-8 text-center text-[20px] leading-[48px] text-black/50">
            — Personnel Officer (S1)
          </p>
          <div className="flex flex-col gap-10 px-8 py-12 md:flex-row">
            <Card title="Cut Admin Overhead" tone="white">
              Condensed 44-page dossiers into a single view, ending manual data
              entry and email threads.
            </Card>
            <Card title="Standardized Scoring" tone="white">
              Swapped &quot;gut-feel&quot; reviews for objective benchmarks
              across 4 core evaluation areas.
            </Card>
            <Card title="Accelerated Review Time" tone="white">
              Real-time tracking cuts down the volatile 3–9 month candidate
              turnaround time.
            </Card>
          </div>
        </section>

        <section id="takeaways" className="scroll-mt-24">
          <Label color={ACCENT}>Takeaways</Label>
          <div className="flex flex-col gap-10 px-8 py-12">
            <Takeaway
              title="User Research"
              star={v4("star.svg")}
              border="#f8e575"
            >
              <Em>8 rounds</Em> of <Em>interviewing real operators</Em> cuts
              through operational complexity and grounds design decisions in
              actual user pain points, not assumptions.
            </Takeaway>
            <Takeaway
              title="Using AI as a Tool"
              star={v4("star.svg")}
              border="#f8e575"
            >
              AI is great for spinning up functional prototypes in days,{" "}
              <Em>
                but hands-on design craft is what makes the product actually
                intuitive.
              </Em>
            </Takeaway>
            <Takeaway
              title="User-Centered Interactions"
              star={v4("star.svg")}
              border="#f8e575"
            >
              Building familiar, frictionless micro-interactions flattens the
              learning curve for <Em>non-technical users</Em> in{" "}
              <Em>high-stakes environments.</Em>
            </Takeaway>
            <div className="flex flex-col items-center gap-2 py-8">
              <div className="flex w-full justify-center rounded bg-[#f2e7c4] py-8">
                <Image
                  src={v4("team.png")}
                  alt="EDT Spring 26 team at Fort Campbell"
                  width={1076}
                  height={804}
                  className="h-auto w-full max-w-[538px] rounded-2xl shadow-[4px_4px_5px_rgba(0,0,0,0.05)]"
                  unoptimized
                />
              </div>
              <p className="text-center text-[12px] leading-[28.5px] text-black">
                EDT Spring 26 @ Fort Campbell
              </p>
            </div>
          </div>
        </section>
      </CaseStudyLayout>
    </div>
  );
}
