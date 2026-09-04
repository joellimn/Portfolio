import type { ReactNode } from "react";
import Image from "next/image";
import { CaseStudyBody } from "@/components/case-studies/CaseStudyToc";
import { CASE_STUDY_TOC } from "@/data/caseStudyToc";

const asset = (file: string) => `/assets/case-studies/umg/${file}`;
const EMAIL = "joel.c.lim@vanderbilt.edu";

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

function Label({
  children,
  className = "px-12 pt-8 pb-4",
}: {
  children: string;
  className?: string;
}) {
  return (
    <p className={`${className} text-[20px] leading-[27.5px] text-[#6fb2c3]`}>
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

function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-[32px] bg-[#f3f3f3] p-4 shadow-[4px_4px_5px_rgba(0,0,0,0.05)]">
      <p className="p-2 text-[24px] leading-[27.5px] text-black">{title}</p>
      <p className="p-2 text-[20px] leading-[27.5px] text-black/50">{children}</p>
    </div>
  );
}

function Takeaway({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full items-start gap-4 rounded-[32px] bg-[#f3f3f3] p-4 shadow-[4px_4px_5px_rgba(0,0,0,0.05)]">
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
        <p className="p-2 text-[20px] leading-[27.5px] text-black/50">
          {children}
        </p>
      </div>
    </div>
  );
}

type UmgCaseStudyProps = {
  onReturn?: () => void;
};

export function UmgCaseStudy({ onReturn }: UmgCaseStudyProps) {
  return (
    <article className="w-full bg-white pb-16 font-sans">
      <Shell>
        <header className="flex flex-col items-center pt-16 pb-4 tracking-[-1px]">
          <h1 className="text-center text-[56px] font-medium leading-[44px] text-black">
            Universal Music Group
          </h1>
          <p className="text-center text-[16px] leading-[44px] text-black/50">
            Summer 2026
          </p>
        </header>
        <Frame
          src={asset("framed-hero.png")}
          alt="Power Apps to Figma to MCP to Codex migration workflow"
          width={2400}
          height={706}
          priority
        />
        <p className="py-4 text-center text-[20px] leading-[27.5px] text-black">
          Redesigning low-code tools with AI
        </p>
        <div className="flex items-start justify-center px-12 py-8">
          {[
            { label: "Role", value: "User Experience Intern" },
            { label: "Timeline", value: "June 2026 – Aug 2026" },
            { label: "Team", value: "UMG Collaboration Tech" },
            {
              label: "Tools/Skills",
              value: "Figma, Figma MCP, Codex, MS Power Platform",
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

        <div className="px-16 py-8">
          <p className="rounded-[32px] bg-[#eafbff] px-12 py-4 text-center text-[24px] leading-[27.5px] text-black/50">
            Much of this work is under <Em>NDA.</Em> If you’re curious to hear
            the full story,{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="underline decoration-solid underline-offset-[3px]"
            >
              Shoot me an email
            </a>{" "}
            — I’d love to chat.
          </p>
        </div>

        <CaseStudyBody items={CASE_STUDY_TOC.umg} onHome={onReturn}>
        <section id="context" className="scroll-mt-24">
          <Label>Context &amp; Challenge</Label>
          <p className="px-12 py-4 text-center text-[24px] leading-[27.5px] text-black/50">
            <Em>Universal Music Group</Em> relied on hundreds of{" "}
            <Em>outdated</Em>, low-code internal apps. I was tasked with
            systematically migrating these legacy tools to code-based
            applications while <Em>upgrading their user experience.</Em>
          </p>
        </section>

        <section id="impact" className="scroll-mt-24">
          <Label>Impact</Label>
          <div className="flex flex-col gap-10 px-16 py-12 md:flex-row md:items-stretch">
            <Card title="AI Agent">
              Built AI pipelines to parse legacy low-code logic, rapidly
              refactoring apps into production-ready code.
            </Card>
            <Card title="Figma MCP Pipeline">
              Connected AI agents to Figma via MCP, feeding live tokens straight
              into code generation with zero manual handoff.
            </Card>
            <Card title="Enterprise UX at Scale">
              Used the Figma MCP pipeline to fix UI flaws, standardize tokens,
              and elevate interface quality before final compilation.
            </Card>
          </div>
        </section>

        <section id="takeaways" className="scroll-mt-24">
          <Label>Takeaways</Label>
          <div className="flex flex-col gap-10 px-16 py-12">
            <Takeaway title="Leveraging AI">
              Leveraged AI for repetitive code migration, allowing me to focus
              on <Em>high-impact UX improvements</Em> and interface polish.
            </Takeaway>
            <Takeaway title="Enterprise Level Collaboration">
              Navigated large-scale organizational workflows, shifting focus
              from surface-level UI to sustainable,{" "}
              <Em>long-term architectural scalability.</Em>
            </Takeaway>
            <div>
              <Frame
                src={asset("framed-team.png")}
                alt="Joel at UMG Nashville headquarters and the lobby floor logo"
                width={2184}
                height={898}
              />
              <p className="pt-2 text-center text-[12px] leading-[28.5px] text-black">
                UMG Nashville headquarters
              </p>
            </div>
          </div>
        </section>

        </CaseStudyBody>

        {onReturn ? (
          <button
            type="button"
            onClick={onReturn}
            className="w-full pb-8 text-center font-sans text-[15px] text-black/32 transition-colors hover:text-black/55"
          >
            Return to works
          </button>
        ) : null}
      </Shell>
    </article>
  );
}
