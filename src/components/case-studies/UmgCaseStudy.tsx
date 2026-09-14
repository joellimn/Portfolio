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
  tone = "blue",
}: {
  title: string;
  children: ReactNode;
  tone?: "blue" | "green" | "yellow" | "red";
}) {
  const bg =
    tone === "green"
      ? "bg-[#ecffe2]"
      : tone === "yellow"
        ? "bg-[#fffae2]"
        : tone === "red"
          ? "bg-[#ffe2e2]"
          : "bg-[#f6faff]";

  return (
    <div
      className={`flex min-w-0 flex-1 flex-col self-stretch rounded ${bg} p-4`}
    >
      <p className="p-2 text-[24px] leading-[27.5px] text-black">{title}</p>
      <p className="p-2 text-[20px] leading-[27.5px] text-black/50">
        {children}
      </p>
    </div>
  );
}

function StepLabel({
  icon,
  label,
  className = "",
}: {
  icon: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 px-8 py-4 ${className}`}>
      <img src={icon} alt="" width={24} height={24} className="size-6" />
      <p className="text-[16px] leading-[27.5px] text-black">{label}</p>
    </div>
  );
}

function ToolFrame({
  logo,
  label,
  children,
}: {
  logo: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 bg-[#e8f7ff] px-8 py-2">
        <img src={logo} alt="" className="h-8 w-auto object-contain" />
        <span className="text-[20px] leading-normal text-black">{label}</span>
      </div>
      <div className="bg-[#f6faff] p-8">{children}</div>
    </div>
  );
}

const REFINE_STEPS = [
  {
    icon: v4("icon-select.svg"),
    title: "App Selection",
    body: (
      <>
        My manager{" "}
        <Em>picked out the outdated, high-use tools from the catalog </Em>
        and introduced me directly to the teams using them every day.
      </>
    ),
  },
  {
    icon: v4("icon-search.svg"),
    title: "User Research",
    body: (
      <>
        <Em>I shadowed and interviewed the daily users</Em> to map out their
        workflow, focusing on points of{" "}
        <Em>friction and core user pain points.</Em>
      </>
    ),
  },
  {
    icon: v4("icon-design.svg"),
    title: "Design",
    body: (
      <>
        I added these <Em>pain points to Gemini’s rebuild specs</Em>, but{" "}
        <Em>Codex wasn&apos;t perfect.</Em>{" "}
        <Em>In Figma, I made targeted UI fixes </Em>
        directly tied to that friction.
      </>
    ),
  },
  {
    icon: v4("icon-repeat.svg"),
    title: "Iteration",
    body: (
      <>
        The final step was iterating the Gemini agent{" "}
        <Em>so these UI and UX errors wouldn&apos;t repeat.</Em>
      </>
    ),
  },
] as const;

type UmgCaseStudyProps = {
  onReturn?: () => void;
};

export function UmgCaseStudy({ onReturn }: UmgCaseStudyProps) {
  return (
    <div className="w-full bg-white pb-16 font-sans">
      <CaseStudyLayout
        onHome={onReturn}
        hero="/assets/case-studies/heroes/umg.png?v=3"
        heroAlt="Hardware Asset Management lookup and scan screens"
        tallHero
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
              , such as tracking company hardware, coordinating release
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
            src={v4("workflow.png?v=2")}
            alt="Export, Document, Build, and Refine workflow across Power Apps, Gemini, Codex, and Figma MCP"
            width={2868}
            height={1288}
          />

          <StepLabel
            icon={v4("icon-export.png")}
            label="Export"
            className="pt-10"
          />
          <p className="px-8 text-[32px] leading-[40px] text-black/50">
            Exporting apps as <Em>solutions.</Em>
          </p>
          <p className="px-8 pt-4 text-[20px] leading-[27.5px] text-black/50">
            Apps were exported as full solutions. This{" "}
            <Em>
              bundled both the Power Apps and their underlying Power Automate
              flows together
            </Em>
            , giving our documentation agent the <Em>full context </Em>
            it needed to actually understand how each tool worked.
          </p>

          <StepLabel
            icon={v4("icon-document.png")}
            label="Document"
            className="pt-16"
          />
          <p className="px-8 text-[32px] leading-[40px] text-black/50">
            Why <Em>documentation</Em> made or broke the migration.
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
            Backed by these results, I moved forward with using our{" "}
            <Em>Gemini Enterprise Agent.</Em>
          </p>

          <StepLabel
            icon={v4("icon-build.png")}
            label="Build"
            className="pt-16"
          />
          <p className="px-8 text-[32px] leading-[40px] text-black/50">
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
              from documentation to code, I chose Codex for long-term
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

          <StepLabel
            icon={v4("icon-refine.png")}
            label="Refine"
            className="pt-16"
          />
          <p className="px-8 text-[32px] leading-[40px] text-black">
            Refining could not run at bulk.
          </p>
          <p className="px-8 pt-4 text-[20px] leading-[27.5px] text-black/50">
            Unlike documentation, refining UI’s on{" "}
            <Em>Figma required direct user research</Em> with the people who
            ran these legacy tools daily. Here’s my workflow:
          </p>
          <div className="flex flex-col gap-4 px-8 py-8 md:flex-row md:items-stretch">
            {REFINE_STEPS.map((step, index) => (
              <div key={step.title} className="contents">
                {index > 0 ? (
                  <img
                    src={v4("icon-arrow.svg")}
                    alt=""
                    width={36}
                    height={16}
                    className="hidden h-4 w-9 shrink-0 self-center md:block"
                  />
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded bg-[#f6faff]">
                  <div className="flex items-center justify-center gap-2 bg-[#e8eeff] px-2 py-4">
                    <img
                      src={step.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="size-6"
                    />
                    <p className="text-[16px] leading-[27.5px] text-black">
                      {step.title}
                    </p>
                  </div>
                  <p className="p-4 text-[16px] leading-6 text-black/50">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="design" className="scroll-mt-24">
          <Label color={ACCENT}>Design</Label>
          <p className="px-8 text-[32px] leading-[40px] text-black">
            Example: Hardware Asset Management App
          </p>
          <p className="px-8 pt-4 text-[20px] leading-[27.5px] text-black/50">
            Let&apos;s take a closer look and walk{" "}
            <Em>step by step through my refining process</Em> with an example
            app.
          </p>

          <StepLabel
            icon={v4("icon-select.svg")}
            label="App Selection"
            className="pt-10"
          />
          <p className="px-8 text-[20px] leading-[27.5px] text-black/50">
            The first tool my manager selected for deep UX refinement was the
            Hardware Asset Management app. This app was a great first pick due
            to its <Em>simple functions and high usage.</Em>
          </p>
          <div className="grid gap-4 px-8 py-4 md:grid-cols-3">
            <div>
              <p className="p-2 text-[20px] leading-[27.5px] text-black/50">
                Users
              </p>
              <p className="p-2 text-[20px] leading-6 text-black">
                Asset Operations team
              </p>
            </div>
            <div>
              <p className="p-2 text-[20px] leading-[27.5px] text-black/50">
                Function
              </p>
              <p className="p-2 text-[20px] leading-6 text-black">
                Scan and track hardware inventory
              </p>
            </div>
            <div>
              <p className="p-2 text-[20px] leading-[27.5px] text-black/50">
                Usage
              </p>
              <p className="p-2 text-[20px] leading-6 text-black">
                High daily usage, managing over 2,000 assets across the app
              </p>
            </div>
          </div>
          <div className="px-8 py-4">
            <ToolFrame
              logo={v4("logo-powerapps.png")}
              label="Microsoft PowerApps"
            >
              <img
                src={v4("powerapps.png?v=2")}
                alt="Legacy Hardware Asset Management app in Microsoft Power Apps"
                width={2868}
                height={1590}
                className="h-auto w-full rounded-lg"
              />
            </ToolFrame>
            <p className="pt-2 text-right text-[16px] leading-[27.5px] text-black/50">
              The original application running on
              <Em> MS Power Apps before migration</Em>
            </p>
          </div>

          <StepLabel
            icon={v4("icon-search.svg")}
            label="User Research"
            className="pt-16"
          />
          <p className="px-8 text-[24px] leading-normal text-black">
            Interviewing daily users.
          </p>
          <p className="px-8 pt-4 text-[20px] leading-[27.5px] text-black/50">
            I ran a <Em>contextual interview </Em>
            with a daily user from the tech ops team. To be clear, this was{" "}
            <Em>conducted directly on the live Power Apps version</Em>. After{" "}
            <Em>observing them perform their routine tasks as usual</Em>, I
            asked targeted questions to{" "}
            <Em>dig deeper into where the friction and pain points</Em> were
            coming from.
          </p>
          <p className="px-8 pt-8 text-[20px] leading-[27.5px] text-black/50">
            <Em>I identified three key pain points </Em>
            that I could help <Em>mitigate with targeted UI edits.</Em>
          </p>
          <div className="flex flex-col gap-4 px-8 py-4 md:flex-row md:items-stretch">
            <Card title="Information Architecture">
              The user had to click through &quot;Scan Hardware&quot; to access
              hardware lookup. When asked about this, he explained that he
              regularly submitted empty scans just to reach the lookup page.
            </Card>
            <Card title="Lack of Screen Space">
              The user reported running out of visible space and having to
              scroll constantly during large batch scans.
            </Card>
            <Card title="Outdated Styling">
              The user noted that the interface felt dated. Inconsistent
              spacing and typography also made reviewing asset data confusing.
            </Card>
          </div>

          <StepLabel
            icon={v4("icon-design.svg")}
            label="Design"
            className="pt-16"
          />
          <p className="px-8 text-[20px] leading-[27.5px] text-black/50">
            With these pain points identified, <Em>Codex</Em> provided a solid
            baseline.{" "}
            <Em>
              While largely cloning the Power Apps version to preserve core
              functionality, it introduced a few targeted UI changes:
            </Em>
          </p>
          <div className="flex flex-col gap-2 px-8 py-4 md:flex-row md:items-stretch">
            <Card title="What it Fixed" tone="green">
              Modernized the visual styling with consistent typography,
              standardized spacing, and rounded corners,{" "}
              <Em>which noticeably improved data readability.</Em>
            </Card>
            <Card title="What it Failed to Fix" tone="yellow">
              Attempted to address the IA problem by adding a &quot;Lookup
              Results&quot; navigation button. However, the button only
              appeared after reaching the results view,{" "}
              <Em>which still required submitting an empty scan first.</Em>
            </Card>
            <Card title="What it Half-solved" tone="red">
              Added unnecessary KPI headers at the top of the view, consuming
              valuable vertical screen real estate and
              <Em> worsening the workspace constraint.</Em>
            </Card>
          </div>
          <div className="px-8 py-4">
            <ToolFrame logo={v4("logo-codex.png")} label="Codex">
              <div className="flex flex-col gap-4">
                <img
                  src={v4("codex-lookup.png")}
                  alt="Codex rebuild of Hardware Asset Management lookup with annotated KPI headers"
                  width={2776}
                  height={1407}
                  className="h-auto w-full"
                />
                <img
                  src={v4("codex-scan.png")}
                  alt="Codex rebuild of Hardware Asset Management scan flow"
                  width={2776}
                  height={1407}
                  className="h-auto w-full"
                />
              </div>
            </ToolFrame>
          </div>
          <div className="flex flex-col items-start gap-8 px-8 py-4 md:flex-row">
            <div className="min-w-0 flex-1">
              <ToolFrame logo={v4("logo-figma.png")} label="Figma">
                <div className="flex flex-col gap-8">
                  <img
                    src={v4("figma-lookup.png?v=2")}
                    alt="Figma redesign of Hardware Asset Management, lookup tab"
                    width={4096}
                    height={2560}
                    className="h-auto w-full rounded-lg"
                  />
                  <img
                    src={v4("figma-scan.png?v=2")}
                    alt="Figma redesign of Hardware Asset Management, scan tab"
                    width={4096}
                    height={2560}
                    className="h-auto w-full rounded-lg"
                  />
                </div>
              </ToolFrame>
            </div>
            <p className="min-w-0 text-[20px] leading-[27.5px] text-black/50 md:w-[220px] md:shrink-0">
              In Figma, I addressed the remaining pain points that Codex left
              unresolved. <Em>I introduced a traditional tab layout </Em>
              to enable direct switching between &quot;Scan Hardware&quot; and
              &quot;Lookup Results,&quot;
              <Em> then eliminated the unnecessary KPI headers</Em> and slimmed
              down the top navigation bar to{" "}
              <Em>create maximum screen real estate for asset data.</Em>
            </p>
          </div>
          <p className="px-8 pt-4 text-[20px] leading-[27.5px] text-black/50">
            I also implemented conventional{" "}
            <Em>filter facets and sort controls</Em> to simplify data discovery
            and make search significantly easier.
          </p>
          <Figure
            src={v4("filters.png?v=2")}
            alt="Filter and sort facets for hardware asset search"
            width={2868}
            height={848}
          />
          <p className="px-8 text-right text-[16px] leading-[27.5px] text-black/50">
            Previously senseless <Em>KPIs were repositioned</Em> where they
            actually belong, providing meaningful context rather than visual
            noise.
          </p>
          <p className="px-8 pt-8 text-[20px] leading-[27.5px] text-black/50">
            With the Figma MCP,{" "}
            <Em>Codex easily translated these UI updates into code.</Em>
          </p>

          <StepLabel
            icon={v4("icon-repeat.svg")}
            label="Iteration"
            className="pt-16"
          />
          <div className="flex flex-col items-start gap-8 px-8 pb-4 md:flex-row">
            <div className="flex h-[127px] w-[127px] shrink-0 items-center justify-center rounded-[20px] border border-[#a7f48c] bg-[#ecffe2] shadow-[4px_4px_5px_rgba(0,0,0,0.05)]">
              <img
                src={v4("logo-gemini.png")}
                alt=""
                width={103}
                height={68}
                className="h-[68px] w-auto object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
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
          </div>
          <div className="px-8 py-4">
            <div className="bg-[#f6faff] p-8">
              <img
                src={v4("kpi-headers.png")}
                alt="Codex rebuild with bloated KPI headers circled"
                width={2868}
                height={651}
                className="h-auto w-full"
              />
            </div>
          </div>
          <p className="px-8 text-[20px] leading-[27.5px] text-black/50">
            Early agent runs tended to generate{" "}
            <Em>bloated, low-value KPI headers </Em>
            that wasted prime screen space. I later{" "}
            <Em>iterated on Gemini&apos;s prompt framework</Em> to explicitly
            identify and strip out these UI mistakes
          </p>
          <div className="flex flex-col-reverse items-start gap-8 px-8 py-8 md:flex-row">
            <div className="min-w-0 flex-1 md:text-right">
              <p className="text-[24px] leading-[27.5px] text-black">
                User Testing
              </p>
              <p className="pt-2 text-[20px] leading-[27.5px] text-black/50">
                Even with an AI-accelerated workflow,{" "}
                <Em>
                  every completed application underwent thorough user testing.
                </Em>{" "}
                All five pilots were reviewed with stakeholders and daily
                users.
                <Em>
                  {" "}
                  Feedback was positive enough to continue the pipeline; I did
                  not run a scored survey.
                </Em>
              </p>
            </div>
            <div className="flex h-[127px] w-[127px] shrink-0 items-center justify-center rounded-[20px] border border-[#75b5fe] bg-white shadow-[4px_4px_5px_rgba(0,0,0,0.05)]">
              <img
                src={v4("icon-users.svg")}
                alt=""
                width={61}
                height={61}
                className="size-[61px]"
              />
            </div>
          </div>
        </section>

        <section id="impact" className="scroll-mt-24">
          <Label color={ACCENT}>Impact</Label>
          <div className="flex flex-col gap-10 px-8 py-4 md:flex-row md:items-stretch">
            <Card title="Enterprise UX at Scale">
              Redesigned navigation, removed vanity KPIs, and standardized
              search filters across 5 pilot apps.
            </Card>
            <Card title="Figma MCP Pipeline">
              Linked agents to Figma via MCP so code generation could read
              live tokens, cutting a manual handoff step and reducing visual
              drift.
            </Card>
            <Card title="AI Agent">
              <Em>Benchmarked 3 AI models </Em>
              across <Em>30 legacy apps</Em>; built a custom Gemini Enterprise
              agent that cut architectural hallucinations to drive rapid Codex
              code generation.
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
              title="Enterprise Level Collaboration"
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
              <p className="text-center text-[16px] leading-[28.5px] text-black">
                UMG Nashville headquarters
              </p>
            </div>
          </div>
        </section>
      </CaseStudyLayout>
    </div>
  );
}
