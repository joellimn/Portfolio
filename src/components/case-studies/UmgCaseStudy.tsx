import type { ReactNode } from "react";
import { CaseStudyLayout } from "@/components/case-studies/CaseStudyLayout";
import {
  Em,
  Figure,
  Label,
  Takeaway,
} from "@/components/case-studies/CaseStudyPrimitives";
import { UmgHighlightReel } from "@/components/case-studies/UmgHighlightReel";
import { CASE_STUDY_TOC } from "@/data/caseStudyToc";

const v4 = (file: string) => `/assets/case-studies/v4/umg/${file}`;
const ACCENT = "#2b84e9";
const BORDER = "#75b5fe";

function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col self-stretch rounded bg-[#f6faff] p-4">
      <p className="p-2 text-[24px] leading-[27.5px] text-black">{title}</p>
      <p className="p-2 text-[20px] leading-[27.5px] text-black/50">
        {children}
      </p>
    </div>
  );
}

type UmgCaseStudyProps = {
  onReturn?: () => void;
};

export function UmgCaseStudy({ onReturn }: UmgCaseStudyProps) {
  return (
    <div className="w-full bg-white pb-16 font-sans">
      <CaseStudyLayout
        onHome={onReturn}
        hero="/assets/case-studies/heroes/umg.png"
        heroAlt="Universal Music Group wordmark"
        tallHero
        containHero
        title="Universal Music Group"
        meta={[
          { label: "Role", value: "UX Design Intern" },
          { label: "Timeline", value: "June 2026 - August 2026" },
          { label: "Team", value: "UMG Collaboration Tech" },
          {
            label: "Tools/Skills",
            value:
              "Figma, Gemini Enterprise Agent Platform, MCP, Codex, MS Power Platform",
          },
        ]}
        toc={CASE_STUDY_TOC.umg}
        projectId="umg"
      >
        <UmgHighlightReel />

        <section id="problem" className="scroll-mt-24">
          <Label color={ACCENT}>Problem</Label>
          <p className="px-8 text-[32px] leading-[40px] text-black">
            Outdated enterprise apps.
          </p>
          <div className="flex flex-col items-center gap-6 px-8 py-4 md:flex-row md:items-center">
            <p className="min-w-0 flex-1 text-[20px] leading-6 text-black/50">
              Universal Music Group relies on hundreds of outdated,{" "}
              <Em>low-code internal apps</Em> built on{" "}
              <Em>Microsoft Power Apps.</Em> Most of these tools were{" "}
              <Em>created for routine, single-purpose tasks</Em>
              —such as tracking company hardware, coordinating release
              schedules, and ordering catering.
            </p>
            <img
              src={v4("stats.png")}
              alt="800-plus PowerApps and 1500-plus Power Automate flows"
              width={738}
              height={322}
              className="h-auto w-full max-w-[369px] shrink-0"
            />
          </div>
          <p className="px-8 pt-8 text-[32px] leading-[40px] text-black">
            Brand fragmentation.
          </p>
          <Figure
            src={v4("brands.png")}
            alt="UMG and its labels including Interscope, Capitol, Republic, and Def Jam"
            width={1912}
            height={765}
          />
          <p className="px-8 text-[20px] leading-[27.5px] text-black/50">
            There are over <Em>50 labels and brands under UMG.</Em> Unifying
            the distinct identities across UMG’s labels wasn’t the goal of this
            migration, but the{" "}
            <Em>scattered visual landscape created friction</Em>. My focus was{" "}
            <Em>
              creating baseline UX clarity and structural cohesion without
              disrupting label-specific branding.
            </Em>
          </p>
        </section>

        <section id="goal" className="scroll-mt-24">
          <Label color={ACCENT}>Goal</Label>
          <p className="px-8 pb-8 text-[32px] leading-[40px] text-black/50">
            I was tasked with <Em>systematically migrating</Em> these legacy
            tools to <Em>code-based applications</Em> while{" "}
            <Em>upgrading their user experience.</Em>
          </p>
        </section>

        <section id="process" className="scroll-mt-24">
          <Label color={ACCENT}>Process</Label>
          <p className="px-8 text-[32px] leading-[40px] text-black">
            Here’s the quick overview of my workflow.
          </p>
          <Figure
            src={v4("workflow.png")}
            alt="Export, Document, Build, and Refine workflow across Power Apps, Gemini, Codex, and Figma MCP"
            width={1912}
            height={859}
          />
          <p className="px-8 pt-4 text-[24px] leading-[27.5px] text-black/50">
            Why <Em>Documentation</Em> Made or Broke the Migration.
          </p>
          <p className="px-8 pt-4 text-[20px] leading-[27.5px] text-black/50">
            The documentation phase was{" "}
            <Em>the most critical step in the workflow.</Em> It was the only
            stage capable of operating at{" "}
            <Em>
              true scale without being gated by stakeholder feedback,
            </Em>{" "}
            and every downstream phase{" "}
            <Em>
              hinged directly on the quality of the generated rebuild plans.
            </Em>
          </p>
          <p className="px-8 pt-8 text-[24px] leading-[27.5px] text-black/50">
            Finding the right <Em>AI</Em> for the job.
          </p>
          <p className="px-8 pt-4 text-[20px] leading-[27.5px] text-black/50">
            To ensure high-accuracy rebuild plans, I ran a{" "}
            <Em>controlled benchmark</Em>: three agents, identical prompt
            parameters, and a test suite of <Em>30 sample applications</Em>{" "}
            evaluated across{" "}
            <Em>OpenAI, Glean, and Gemini Enterprise (Vertex AI).</Em>
          </p>
          <Figure
            src={v4("ai-cards.png")}
            alt="Benchmark cards comparing Glean, OpenAI, and Gemini Enterprise"
            width={1912}
            height={608}
          />
          <p className="px-8 text-[20px] leading-[27.5px] text-black/50">
            Backed by these results, we moved forward with using our{" "}
            <Em>Gemini Enterprise Agent.</Em>
          </p>
          <p className="px-8 pt-8 text-[24px] leading-[27.5px] text-black/50">
            Why <Em>Codex</Em> over <Em>Gemini?</Em>
          </p>
          <div className="flex flex-col items-start gap-8 px-8 pt-4 md:flex-row">
            <img
              src={v4("codex-gemini.png")}
              alt="Codex chosen over Gemini for the build step"
              width={776}
              height={360}
              className="h-auto w-full max-w-[368px] shrink-0"
            />
            <p className="min-w-0 flex-1 text-[20px] leading-[27.5px] text-black/50">
              While sticking with the Gemini ecosystem would have created a{" "}
              <Em>smoother handoff </Em>
              from documentation to code, we chose Codex for long-term
              organizational adoption.{" "}
              <Em>
                Codex was UMG’s standardized, &quot;birthright&quot; AI coding
                tool
              </Em>{" "}
              available to every developer across the company. Standardizing on
              it ensured downstream maintainability, meaning any internal team
              could <Em>easily step in to tweak, refactor, or debug</Em> these
              applications long after our initial migration.
            </p>
          </div>
          <p className="px-8 pt-8 text-[24px] leading-[27.5px] text-black">
            We measured success by throughput, then polished the
            highest-urgency apps.
          </p>
          <p className="px-8 pt-4 text-[20px] leading-[27.5px] text-black/50">
            We measured success by throughput: our Gemini and Codex pipeline
            documented over 100 legacy Power Apps, rebuilt 23 into production
            code, and drove 5 through end-to-end Figma UX polish.{" "}
            <Em>
              Apps were prioritized by migration urgency, stakeholder access,
              and usability needs.
            </Em>
          </p>
          <Figure
            src={v4("metrics.png")}
            alt="100-plus apps exported, 100-plus documented, 23 built, 5 refined"
            width={1912}
            height={661}
          />
        </section>

        <section id="design" className="scroll-mt-24">
          <Label color={ACCENT}>Design</Label>
          <p className="px-8 text-[32px] leading-[40px] text-black">
            Example: Hardware Asset Management App
          </p>
          <p className="px-8 pt-4 text-[20px] leading-[27.5px] text-black/50">
            The original legacy application running on
            <Em> MS Power Apps before migration. </Em>
            The interface suffered from{" "}
            <Em>
              outdated default styling, misaligned typography, and erratic
              padding and spacing across screens,
            </Em>{" "}
            creating visual noise and friction for daily internal users.
          </p>
          <Figure
            src={v4("powerapps.png")}
            alt="Legacy Hardware Asset Management app in Microsoft Power Apps"
            width={1912}
            height={1060}
            caption="Microsoft PowerApps"
            priority
          />
          <div className="flex flex-col items-start gap-8 px-8 py-4 md:flex-row">
            <p className="min-w-0 flex-1 text-[20px] leading-[27.5px] text-black/50 md:max-w-[220px]">
              Codex rebuilt the Power App directly into code,{" "}
              <Em>
                refreshing the overall styling and executing the minor UX
                improvements suggested in Gemini’s rebuild plan
              </Em>{" "}
              while staying faithful to the original app structure.
            </p>
            <img
              src={v4("codex.png")}
              alt="Codex rebuild of the hardware asset management app"
              width={1360}
              height={1391}
              className="h-auto w-full min-w-0 flex-1"
            />
          </div>
          <p className="px-8 pt-2 text-[16px] leading-6 text-black/50">
            Early agent runs tended to generate{" "}
            <Em>bloated, low-value KPI headers </Em>
            that wasted prime screen space.{" "}
            <Em>I iterated on Gemini&apos;s prompt framework</Em> to explicitly
            identify and strip out these UI mistakes
          </p>
          <div className="flex flex-col items-start gap-8 px-8 py-8 md:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-8 rounded bg-[#f6faff] p-8">
              <img
                src={v4("figma-lookup.png")}
                alt="Figma redesign of Hardware Asset Management, lookup tab"
                width={4096}
                height={2560}
                className="h-auto w-full rounded-lg"
              />
              <img
                src={v4("figma-scan.png")}
                alt="Figma redesign of Hardware Asset Management, scan tab"
                width={4096}
                height={2560}
                className="h-auto w-full rounded-lg"
              />
            </div>
            <p className="min-w-0 flex-1 text-[20px] leading-[27.5px] text-black/50 md:max-w-[220px]">
              In Figma, I focused on <Em>structural clarity</Em> over
              surface-level cosmetics. I established high-contrast, unambiguous{" "}
              <Em>CTAs</Em>, eliminated low-value clutter to{" "}
              <Em>give essential data more space</Em>, and separated the app’s
              two primary operational modes into{" "}
              <Em>clean tabs for faster daily navigation.</Em>
            </p>
          </div>
          <p className="px-8 text-[20px] leading-[27.5px] text-black/50">
            Implemented conventional <Em>filter facets and sort controls</Em> to
            simplify data discovery and make search significantly easier.
          </p>
          <Figure
            src={v4("filters.png")}
            alt="Filter and sort facets for hardware asset search"
            width={2868}
            height={848}
          />
          <p className="px-8 text-[16px] leading-6 text-black/50">
            Previously senseless <Em>KPIs were repositioned</Em> where they
            actually belong, providing meaningful context rather than visual
            noise.
          </p>
        </section>

        <section id="iteration" className="scroll-mt-24">
          <Label color={ACCENT}>Iteration</Label>
          <div className="flex flex-col gap-8 px-8 pb-4">
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              <div className="min-w-0 flex-1 md:text-right">
                <p className="text-[24px] leading-[27.5px] text-black">
                  Agent Iteration
                </p>
                <p className="pt-2 text-[20px] leading-[27.5px] text-black/50">
                  With our main goal centered on streamlining the end-to-end
                  migration, most of our iteration went into
                  <Em> refining the Gemini documentation process.</Em> Dialing
                  in the agent’s output early on proved to be the
                  highest-leverage way to{" "}
                  <Em>
                    prevent errors from compounding later in the workflow.
                  </Em>
                </p>
              </div>
              <img
                src={v4("iteration-gemini.png")}
                alt=""
                width={314}
                height={332}
                className="h-auto w-[157px] shrink-0"
              />
            </div>
            <div className="flex flex-col-reverse items-center gap-8 md:flex-row md:items-start">
              <img
                src={v4("iteration-users.png")}
                alt=""
                width={294}
                height={294}
                className="h-auto w-[147px] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[24px] leading-[27.5px] text-black">
                  User Testing
                </p>
                <p className="pt-2 text-[20px] leading-[27.5px] text-black/50">
                  Even with an AI-accelerated workflow,{" "}
                  <Em>
                    every completed application underwent thorough user
                    testing.
                  </Em>{" "}
                  All five pilots were reviewed with stakeholders and daily
                  users. Feedback was positive enough to continue the
                  pipeline; I did not run a scored survey.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="impact" className="scroll-mt-24">
          <Label color={ACCENT}>Impact</Label>
          <div className="flex flex-col gap-10 px-8 py-4 md:flex-row md:items-stretch">
            <Card title="AI Agent">
              <Em>Benchmarked 3 AI models </Em>
              across <Em>30 legacy apps</Em>; built a custom Gemini Enterprise
              agent that cut architectural hallucinations to drive rapid Codex
              code generation.
            </Card>
            <Card title="Figma MCP Pipeline">
              Linked agents to Figma via MCP so code generation could read
              live tokens, cutting a manual handoff step and reducing visual
              drift.
            </Card>
            <Card title="Enterprise UX at Scale">
              Redesigned navigation, removed vanity KPIs, and standardized
              search filters across 5 pilot apps.
            </Card>
          </div>
        </section>

        <section id="takeaways" className="scroll-mt-24">
          <Label color={ACCENT}>Takeaways</Label>
          <div className="flex flex-col gap-10 px-8 py-4">
            <Takeaway
              title="Leveraging AI"
              star={v4("star.svg")}
              border={BORDER}
            >
              Leveraged AI for repetitive code migration, allowing me to focus
              on <Em>high-impact UX improvements</Em> and interface polish.
            </Takeaway>
            <Takeaway
              title="Enterprise UX"
              star={v4("star.svg")}
              border={BORDER}
            >
              Navigated large-scale organizational workflows, shifting focus
              from surface-level UI to sustainable,{" "}
              <Em>long-term architectural scalability.</Em>
            </Takeaway>
            <div className="flex flex-col items-center gap-2 py-8">
              <img
                src={v4("team.png")}
                alt="Joel at UMG Nashville headquarters"
                width={1912}
                height={862}
                className="h-auto w-full"
              />
              <p className="text-center text-[12px] leading-[28.5px] text-black">
                UMG Nashville headquarters
              </p>
            </div>
          </div>
        </section>
      </CaseStudyLayout>
    </div>
  );
}
