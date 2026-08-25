import type { ReactNode } from "react";
import Image from "next/image";
import { CaseStudyVideo } from "@/components/case-studies/CaseStudyVideo";

const asset = (file: string) => `/assets/case-studies/soar/${file}`;

function Em({ children }: { children: ReactNode }) {
  return <span className="text-black">{children}</span>;
}

function Shell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] ${className}`}>{children}</div>
  );
}

function Label({ children }: { children: string }) {
  return (
    <p className="px-12 pt-8 pb-4 text-[20px] leading-[27.5px] text-[#8a7a45]">
      {children}
    </p>
  );
}

function Frame({
  src,
  alt,
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="block h-auto w-full"
      unoptimized
      priority={priority}
    />
  );
}

function BleedFade({
  to,
  hold = "54%",
  children,
}: {
  to: string;
  hold?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, #fff 0%, #fff ${hold}, ${to} 100%)`,
      }}
    >
      {children}
    </div>
  );
}

function Card({
  title,
  children,
  tone,
}: {
  title: string;
  children: ReactNode;
  tone: "white" | "cream-1" | "cream-2" | "cream-3";
}) {
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
      className={`flex min-w-0 flex-1 flex-col rounded-[32px] border border-solid border-[#f6f0de] p-4 ${bg}`}
    >
      <p className="p-2 text-[24px] leading-[27.5px] text-black">{title}</p>
      <p className="p-2 text-[20px] leading-[27.5px] text-black/50">{children}</p>
    </div>
  );
}

function Takeaway({
  title,
  children,
  tone,
}: {
  title: string;
  children: ReactNode;
  tone: "cream-1" | "cream-2" | "cream-3";
}) {
  const bg =
    tone === "cream-1"
      ? "bg-[#f7f2de]"
      : tone === "cream-2"
        ? "bg-[#f6eed5]"
        : "bg-[#f2e7c4]";

  return (
    <div
      className={`flex w-full items-start gap-4 rounded-[32px] border border-solid border-[#f6f0de] p-4 ${bg}`}
    >
      <div className="flex h-[115px] shrink-0 items-center px-2 py-4">
        <div className="size-8 overflow-clip">
          <img
            src={asset("star.svg")}
            alt=""
            width={32}
            height={32}
            className="size-full"
          />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="p-2 text-[24px] leading-[27.5px] text-black">{title}</p>
        <p className="p-2 text-[20px] leading-[27.5px] text-black/50">{children}</p>
      </div>
    </div>
  );
}

type SoarCaseStudyProps = {
  onReturn?: () => void;
};

export function SoarCaseStudy({ onReturn }: SoarCaseStudyProps) {
  return (
    <article className="w-full bg-white pb-16 font-sans">
      <BleedFade to="#fffef5" hold="50%">
        <Shell>
          <header className="flex flex-col items-center pt-16 pb-4 tracking-[-1px]">
            <h1 className="text-center text-[56px] font-medium leading-[44px] text-black">
              160th SOAR
            </h1>
            <p className="text-center text-[16px] leading-[44px] text-black/50">
              U.S. Army - Spring 2026
            </p>
          </header>

          <Frame
            src={asset("framed-hero.png")}
            alt="160th SOAR assessment packet inbox overlapping a packet overview"
            width={4800}
            height={2288}
            priority
          />
        </Shell>
      </BleedFade>

      <div className="bg-[#fffef5]">
        <Shell>
          <p className="py-4 text-center text-[20px] leading-[27.5px] text-black">
            Compressing 44-page packets into a standardized scoring dashboard
          </p>
          <div className="flex px-12 py-8">
            {[
              {
                label: "Role",
                value: "Design Lead - Interaction Design, Rapid Prototyping",
              },
              { label: "Timeline", value: "January 2026 – May 2026" },
              { label: "Team", value: "Product Manager, UX Researcher" },
              {
                label: "Tools/Skills",
                value: "User Research, Figma Make, Figma, Miro",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex min-w-0 flex-1 flex-col gap-2 px-4"
              >
                <p className="text-[12px] font-medium uppercase leading-[17.25px] tracking-[1.61px] text-black/40">
                  {item.label}
                </p>
                <p className="text-[16px] leading-[20.625px] text-black/80">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <Label>Highlights</Label>
          <p className="px-12 py-4 text-center text-[24px] leading-[27.5px] text-black/50">
            Transformed a <Em>90-day review cycle</Em> across 5 stakeholder tiers
            into a <Em>centralized dashboard</Em>, standardizing{" "}
            <Em>44-page candidate</Em> packets with a seamless digital rubric and
            voting process.
          </p>
          <Frame
            src={asset("framed-highlights.png")}
            alt="SOAR assessment inbox, packet flags, scoring, and success state"
            width={2400}
            height={4155}
          />
        </Shell>
      </div>

      <div className="h-[60px] bg-white" />

      <Shell>
      <section>
        <Label>Context</Label>
        <div className="mx-auto flex w-full max-w-[624px] flex-col items-center gap-4 py-4">
          <p className="text-center text-[48px] leading-[48px] text-black">
            44 Pages, reviewed manually...
          </p>
          <p className="px-12 text-center text-[16px] leading-6 text-black/50">
            Evaluating 160th SOAR officer candidates was bogged down by a
            fragmented, 90-day review cycle. Reviewers relied on{" "}
            <Em>manual SharePoint</Em> workflows to evaluate dense 44-page
            packets across separate battalions, leading to severe administrative{" "}
            <Em>bottlenecks</Em> and subjective <Em>&quot;gut-feel&quot;</Em>{" "}
            scoring.
          </p>
        </div>
        <Frame
          src={asset("framed-sharepoint.png")}
          alt="Old SharePoint portal used to review candidate packets"
          width={4800}
          height={1432}
        />
        <p className="px-12 py-4 text-center text-[40px] leading-[40px] text-black/50">
          <Em>How might we</Em> standardize candidate scoring with a{" "}
          <Em>single, unified review dashboard?</Em>
        </p>
      </section>
      </Shell>

      <Shell>
      <section>
        <Label>Design</Label>
        <p className="px-12 py-4 text-[40px] leading-[27.5px] text-black/50">
          At its core - <Em>The Evaluation Rubric.</Em>
        </p>
        <p className="px-12 pb-10 pt-4 text-center text-[20px] italic leading-[20.5px] text-black/50">
          &quot;Our decisions and what we do... is like extremely{" "}
          <Em>schizophrenic</Em> and changes and is a lot of like{" "}
          <Em>intuition and gut feel.</Em>&quot;
          <br />
          <span className="not-italic">— Assessment Officer</span>
        </p>
        <Frame
          src={asset("framed-rubric.png")}
          alt="Evaluation rubric with 1–5 benchmarked scores"
          width={4800}
          height={2712}
        />
        <p className="px-16 py-8 text-[24px] leading-[27.5px] text-black/50">
          What started as a <Em>simple pdf...</Em>
        </p>
        <Frame
          src={asset("framed-pdf-pair.png")}
          alt="Initial PDF packet beside the first digital prototype"
          width={4800}
          height={1935}
        />
        <p className="px-16 py-8 text-[24px] leading-[27.5px] text-black/50">
          evolved into an{" "}
          <span className="text-[#928559]">interactive digital experience.</span>
        </p>
        <div className="flex items-center gap-10 px-16 py-4">
          <div className="min-w-0 flex-[1.6] rounded-[32px] bg-[#fffef5] p-10">
            <CaseStudyVideo
              src={asset("rubric-extended.mp4")}
              label="Collapsible rubric details expanding over 1–5 benchmark scores"
            />
          </div>
          <p className="min-w-0 flex-1 text-[20px] leading-[27.5px] text-black/50">
            Introduced collapsible sections to{" "}
            <Em>maximize screen real estate</Em> and{" "}
            <Em>reduce cognitive load</Em> during dense packet reviews.
          </p>
        </div>
        <Frame
          src={asset("framed-scoring.png")}
          alt="Automated scoring row on the evaluation rubric"
          width={4800}
          height={1295}
        />
      </section>
      </Shell>

      <BleedFade to="#fffbef">
        <Shell>
          <p className="px-12 pt-8 text-center text-[20px] leading-[27.5px] text-black/50">
            Split-screen view allows for seamless cross-referencing, cutting
            review time
          </p>
          <div className="px-16 py-8">
            <CaseStudyVideo
              src={asset("rubric-splitscreen.mp4")}
              label="Split-screen packet and rubric view"
            />
          </div>
        </Shell>
      </BleedFade>

      <div className="bg-[#fffbef]">
        <Shell>
          <div className="flex flex-col gap-2 px-12 pb-8 pt-16">
            <p className="text-[40px] leading-[27.5px] text-black/50">
              Remember, our users are <Em>military.</Em>
            </p>
            <p className="text-[20px] leading-[27.5px] text-black/50">
              Designed for <Em>non-technical</Em> military personnel to pick up
              and use immediately, without second-guessing icons or workflows.
            </p>
          </div>
          <div className="flex items-start gap-8 px-12 pb-8">
            <div className="min-w-0 flex-1 pt-8">
              <CaseStudyVideo
                src={asset("icon-tooltips.mp4")}
                label="Hover tooltips explaining dashboard icon actions"
                cropX={3}
                cropTop={3}
                cropBottom={3}
              />
              <p className="mt-6 text-[20px] leading-[27.5px] text-black/50">
                Hover <Em>tooltips</Em> over icons so you never have to guess
                what a button does.
              </p>
            </div>
            <div className="min-w-0 flex-[1.45]">
              <Frame
                src={asset("framed-onboarding.png")}
                alt="Onboarding popups to guide users through their next steps"
                width={2752}
                height={2204}
              />
            </div>
          </div>
        </Shell>
      </div>

      <Shell>
      <section>
        <div className="flex flex-col gap-4 px-12 pb-8 pt-16">
          <p className="text-[40px] leading-[27.5px] text-black/50">
            Simple interactions. <Em>Faster</Em> decisions.
          </p>
          <p className="text-center text-[20px] italic leading-[27px] text-black/50">
            The timeline from application to assessment: &quot;average is, I
            think, <Em>3 to 4 months...</Em> but it sometimes pushes to{" "}
            <Em>9 months.</Em>&quot;
            <br />
            <span className="not-italic">— Assessment Officer</span>
          </p>
        </div>
        <Frame
          src={asset("framed-flags.png")}
          alt="Flags disqualifiers early in the packet review"
          width={4800}
          height={1846}
        />
        <Frame
          src={asset("framed-activity.png")}
          alt="Live activity log of packet reviews and handoffs"
          width={4800}
          height={1788}
        />
      </section>

      <section>
        <Label>Here&apos;s the twist</Label>
        <div className="flex flex-col gap-6 px-12 py-4">
          <p className="text-[48px] leading-[27.5px] text-black">
            Rapid Prototyping with AI.
          </p>
          <p className="text-[48px] leading-[27.5px] text-[#ab9334]">Why?</p>
        </div>
        <div className="flex gap-10 px-16 py-12">
          <Card title="Sprint Velocity" tone="cream-1">
            Spun up a functional baseline in days, speeding up feedback loops
            between stakeholder reviews.
          </Card>
          <Card title="Realistic Synthetic Data" tone="cream-2">
            Generated complex edge-case candidate files (flight hour minimums,
            legal/drug flags, diverse ratings) instantly.
          </Card>
          <Card title="Live Flow Validation" tone="cream-3">
            Let key stakeholders test real, interactive queues instead of
            clicking through static mockups.
          </Card>
        </div>
        <p className="px-12 py-8 text-[40px] leading-[27.5px] text-black/50">
          A <Em>solid foundation</Em>. A necessary <Em>redesign.</Em>
        </p>
        <p className="px-12 pb-4 text-[24px] leading-[27.5px] text-black">
          Figma Make Design Comparison
        </p>
        <Frame
          src={asset("figma-make-comparison.png")}
          alt="Figma Make assessment tracker beside the redesigned packet inbox"
          width={1072}
          height={399}
        />
        <div className="flex items-center gap-10 px-12 py-10">
          <div className="min-w-0 flex-1">
            <p className="text-[24px] leading-[27.5px] text-black">
              Jakob’s Law:{" "}
              <span className="text-black/50">Traditional Sidebar</span>
            </p>
            <p className="mt-4 text-[20px] leading-[27.5px] text-black/50">
              Replaced non-standard navigation with a familiar left sidebar,
              reclaiming core screen real estate and eliminating learning curves
              for reviewers.
            </p>
          </div>
          <div className="w-[420px] shrink-0 rounded-[32px] bg-[#fffef5] p-8">
            <CaseStudyVideo
              src={asset("sidebar-expand.mp4")}
              label="Sidebar expanding from icon rail to a traditional navigation list"
            />
          </div>
        </div>
        <Frame
          src={asset("framed-success.png")}
          alt="Peak-End Rule success state after submitting a vote"
          width={4288}
          height={1905}
        />
      </section>
      </Shell>

      <div className="bg-gradient-to-b from-[#fffbef] to-white">
        <Shell>
          <Label>Impact</Label>
          <div className="flex flex-col gap-4 px-16 py-4">
            <p className="text-center text-[48px] leading-[48px] text-black/50">
              &quot;This is again, this is awesome.{" "}
              <Em>I wish it wasn&apos;t a prototype.</Em>&quot;
            </p>
            <p className="text-center text-[20px] leading-[48px] text-black/50">
              — Personnel Officer (S1)
            </p>
          </div>
          <div className="flex gap-10 px-16 py-12">
            <Card title="Cut Admin Overhead" tone="white">
              Condensed 44-page dossiers into a single view, ending manual data
              entry and email threads.
            </Card>
            <Card title="Standardized Scoring" tone="white">
              Swapped &quot;gut-feel&quot; reviews for objective benchmarks across
              4 core evaluation areas.
            </Card>
            <Card title="Accelerated Review Time" tone="white">
              Real-time tracking cuts down the volatile 3–9 month candidate
              turnaround time.
            </Card>
          </div>
        </Shell>
      </div>

      <Shell>
      <section>
        <Label>Takeaways</Label>
        <div className="flex flex-col gap-10 px-16 py-12">
          <Takeaway title="User Research" tone="cream-1">
            <Em>8 rounds</Em> of <Em>interviewing real operators</Em> cuts
            through operational complexity and grounds design decisions in
            actual user pain points, not assumptions.
          </Takeaway>
          <Takeaway title="Using AI as a Tool" tone="cream-2">
            AI is great for spinning up functional prototypes in days,{" "}
            <Em>
              but hands-on design craft is what makes the product actually
              intuitive.
            </Em>
          </Takeaway>
          <Takeaway title="User-Centered Interactions" tone="cream-3">
            Building familiar, frictionless micro-interactions flattens the
            learning curve for <Em>non-technical users</Em> in{" "}
            <Em>high-stakes environments.</Em>
          </Takeaway>
          <Frame
            src={asset("framed-team.png")}
            alt="EDT Spring 26 team at Fort Campbell"
            width={4288}
            height={2267}
          />
        </div>
      </section>

      {onReturn ? (
        <button
          type="button"
          onClick={onReturn}
          className="w-full pb-8 text-center text-[15px] text-black/32 transition-colors hover:text-black/55"
        >
          Return to works
        </button>
      ) : null}
      </Shell>
    </article>
  );
}
