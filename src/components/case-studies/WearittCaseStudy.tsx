import { CaseStudyLayout } from "@/components/case-studies/CaseStudyLayout";
import {
  Body,
  Em,
  Figure,
  Headline,
  Label,
  Takeaway,
} from "@/components/case-studies/CaseStudyPrimitives";
import { CASE_STUDY_TOC } from "@/data/caseStudyToc";

const asset = (file: string) => `/assets/case-studies/v4/wearitt/${file}`;
const ACCENT = "#924892";

function ProcessStepIcon({ name }: { name: "doc" | "pen" | "nodes" | "spark" }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-5 shrink-0 text-black",
    "aria-hidden": true,
  };
  if (name === "doc") {
    return (
      <svg {...common}>
        <path d="M7 3.5h7l4 4V20.5H7z" />
        <path d="M14 3.5V8h4" />
      </svg>
    );
  }
  if (name === "pen") {
    return (
      <svg {...common}>
        <path d="M4 20.5 8.2 19 19.5 7.7a2 2 0 0 0 0-2.8L18.1 3.5a2 2 0 0 0-2.8 0L4 14.8z" />
        <path d="m13.8 5 4.2 4.2" />
      </svg>
    );
  }
  if (name === "nodes") {
    return (
      <svg {...common}>
        <path d="M12 4.5 19 8.5v7l-7 4-7-4v-7z" />
        <path d="M12 12.5v7M5 8.5l7 4 7-4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3.5v17M5.5 7.5l13 9M5.5 16.5l13-9" />
    </svg>
  );
}

type WearittCaseStudyProps = {
  onReturn?: () => void;
};

export function WearittCaseStudy({ onReturn }: WearittCaseStudyProps) {
  return (
    <div className="w-full bg-white pb-16 font-sans">
      <CaseStudyLayout
        onHome={onReturn}
        hero="/assets/case-studies/heroes/wearitt.png?v=2"
        heroAlt="Wearitt logo and design-system components"
        title="Wearitt: Building a design system for mobile wardrobe app"
        meta={[
          { label: "Role", value: "UX Design Intern" },
          { label: "Timeline", value: "December 2025 - May 2026" },
          { label: "Team", value: "2 UX Design Interns  3 UX Designers" },
          { label: "Tools/Skills", value: "Figma, Design Systems" },
        ]}
        toc={CASE_STUDY_TOC.wearitt}
        projectId="wearitt"
      >
        <section id="problem" className="scroll-mt-24">
          <Label color={ACCENT}>Problem</Label>
          <div className="flex flex-col gap-4 px-8 pb-4">
            <p className="text-[32px] leading-[32px] text-black">
              Too many features.
            </p>
            <p className="max-w-[520px] text-[20px] leading-[27.5px] text-black/50">
              Wearitt was <Em>fractured</Em> across{" "}
              <Em>four competing features:</Em> Virtual Try-On, Collage Maker,
              Digital Closet, and an Inspiration Feed.
            </p>
          </div>
          <Figure
            src={asset("problem-features.png")}
            alt="Wearitt home, look generator, product, and collage screens"
            width={3824}
            height={2075}
            caption="Wearitt features"
            priority
          />
        </section>

        <section id="goal" className="scroll-mt-24">
          <Label color={ACCENT}>Goal</Label>
          <p className="px-8 pb-8 text-[32px] leading-[40px] text-black/50">
            <Em>How might we</Em> create a <Em>unified framework</Em> that pulls
            four disconnected features into one seamless flow?
          </p>
        </section>

        <section id="process" className="scroll-mt-24">
          <Label color={ACCENT}>Process</Label>
          <Headline>
            Create a scalable design system that unifies the fragmentation
            across Wearitt’s features.
          </Headline>
          <div className="px-8 pt-2 pb-8">
            <p className="text-[20px] leading-[27.5px] text-black/50">
              Started by <Em>auditing Wearitt’s active features</Em> alongside{" "}
              <Em>industry design systems</Em> to identify recurring UI
              patterns. I mapped out which components needed strict
              standardization, which required flexibility, and which were
              feature-specific.
            </p>
          </div>
          <div
            className="flex flex-col items-stretch gap-3 px-8 py-4 sm:flex-row sm:items-center"
            aria-label="Audit, Design, Component, Implement"
          >
            {(
              [
                { label: "Audit", icon: "doc" },
                { label: "Design", icon: "pen" },
                { label: "Component", icon: "nodes" },
                { label: "Implement", icon: "spark" },
              ] as const
            ).map((step, i) => (
              <div key={step.label} className="flex min-w-0 flex-1 items-center">
                {i > 0 ? (
                  <span
                    aria-hidden
                    className="hidden px-2 text-[20px] font-light text-black/40 sm:block"
                  >
                    →
                  </span>
                ) : null}
                <div className="flex w-full items-center justify-center gap-3 rounded-full border border-[#f3e6f3] bg-white px-4 py-3">
                  <ProcessStepIcon name={step.icon} />
                  <span className="text-[20px] leading-[27.5px] font-light text-black">
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="design-language" className="scroll-mt-24">
          <Label color={ACCENT}>Design Language</Label>
          <Headline>Defining core visual rules.</Headline>
          <div className="px-8 pt-2 pb-4">
            <p className="text-[20px] leading-[27.5px] text-black/50">
              Established <Em>core visual rules</Em>, including color palettes,
              typography scales, spacing, and icons.
            </p>
          </div>

          <p className="px-8 pt-8 pb-2 text-[24px] leading-[27.5px] text-black">
            Color
          </p>
          <Body>
            Primary and secondary colors inspired by the existing brand logo.
          </Body>
          <Figure
            src={asset("color-palette.png")}
            alt="Wearitt primary purple and secondary orange color scales"
            width={3824}
            height={2012}
          />
          <div className="px-8 pt-2">
            <p className="text-[20px] leading-[27.5px] text-black/50">
              Light and dark tones selected to support accessibility, meeting
              WCAG AA contrast standards. Furthermore, gradient tones used in
              special brand moments.
            </p>
          </div>
          <Figure
            src={asset("color-a11y.png")}
            alt="Contrast checker and gradient brand moments"
            width={3824}
            height={1372}
          />

          <p className="px-8 pt-8 pb-2 text-[24px] leading-[27.5px] text-black">
            Typography
          </p>
          <Body>
            Typography needed to stay consistent and simple to accommodate for
            mobile usage.
          </Body>
          <Figure
            src={asset("typography.png")}
            alt="Wearitt type scale"
            width={3824}
            height={2012}
          />

          <p className="px-8 pt-8 pb-2 text-[24px] leading-[27.5px] text-black">
            Spacing
          </p>
          <Body>
            Margins and spacing were all over the place. Followed consistent 16pt
            spacing and margins to ensure cohesiveness.
          </Body>
          <Figure
            src={asset("spacing.png")}
            alt="16pt spacing and margin system"
            width={3824}
            height={1524}
          />

          <p className="px-8 pt-8 pb-2 text-[24px] leading-[27.5px] text-black">
            Icons
          </p>
          <Body>
            Set range of icons with various colors for different states and
            usages.
          </Body>
          <Figure
            src={asset("icons.png")}
            alt="Wearitt icon set in multiple states"
            width={3824}
            height={732}
          />
        </section>

        <section id="components" className="scroll-mt-24">
          <Label color={ACCENT}>Components</Label>
          <Headline>Building blocks.</Headline>
          <div className="px-8 pt-2">
            <p className="text-[20px] leading-[27.5px] text-black/50">
              Identified commonly used components to assemble foundational
              tokens into <Em>reusable units.</Em>
            </p>
          </div>
          <Figure
            src={`${asset("components.png")}?v=3`}
            alt="Buttons, cards, navigation bars, and text fields"
            width={3824}
            height={760}
            notes={
              <div className="grid grid-cols-2 text-center text-[16px] leading-[24px] font-light text-black md:grid-cols-4">
                <p>Buttons</p>
                <p>Cards</p>
                <p>Navigation Bars</p>
                <p>Text fields</p>
              </div>
            }
            noteClassName=""
          />
          <p className="px-8 pt-8 pb-2 text-[24px] leading-[27.5px] text-black">
            Properties
          </p>
          <Body>
            Various properties allow for quick changes and modifications.
          </Body>
          <Figure
            src={asset("properties.png")}
            alt="Button and item-card component properties"
            width={3824}
            height={1272}
          />
        </section>

        <section id="result" className="scroll-mt-24">
          <Label color={ACCENT}>Result</Label>
          <Headline>
            A structured, cohesive app with clear visual and functional clarity.
          </Headline>
          <p className="px-8 pt-8 pb-2 text-[24px] leading-[27.5px] text-black">
            Before and after
          </p>
          <Figure
            src={asset("result.png")}
            alt="Before and after profile and account screens"
            width={3824}
            height={1856}
          />
        </section>

        <section id="challenges" className="scroll-mt-24">
          <Label color={ACCENT}>Challenges</Label>
          <p className="px-8 text-[32px] leading-[27.5px] text-black">
            Navigating an established project.
          </p>
          <div className="flex flex-col items-stretch gap-4 px-8 py-12 md:flex-row">
            {(
              [
                {
                  title: "Context",
                  body: "Joining a live product established in 2023 meant navigating substantial existing design debt for the first time.",
                  bg: "bg-[#faf1fa]",
                },
                {
                  title: "Approach",
                  body: "Rather than jumping straight into new UI screens, I audited historical product documentation and legacy files to understand the core mission.",
                  bg: "bg-[#f4d5f4]",
                },
                {
                  title: "Outcome",
                  body: "Uncovered the root cause of feature fragmentation, uncovering an urgent need for a standardized design system.",
                  bg: "bg-[#f7c1f7]",
                },
              ] as const
            ).map((card) => (
              <div
                key={card.title}
                className={`flex min-w-0 flex-1 flex-col rounded p-4 ${card.bg}`}
              >
                <p className="p-2 text-[24px] leading-[27.5px] text-black">
                  {card.title}
                </p>
                <p className="p-2 text-[20px] leading-[27.5px] text-black/50">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="takeaways" className="scroll-mt-24">
          <Label color={ACCENT}>Takeaways</Label>
          <div className="flex flex-col gap-10 px-8 py-8">
            <Takeaway
              title="Scalable Architecture"
              star={asset("star.svg")}
              border="#fce5fc"
            >
              Treated design systems as <Em>functional infrastructure</Em> for
              team alignment and clean dev handoffs.
            </Takeaway>
            <Takeaway
              title="Legacy Adaptability"
              star={asset("star.svg")}
              border="#fce5fc"
            >
              Balanced <Em>existing product footprints</Em> with modern UX
              upgrades without breaking current workflows.
            </Takeaway>
            <Takeaway
              title="Logic-Driven Feedback"
              star={asset("star.svg")}
              border="#fce5fc"
            >
              Grounded <Em>daily peer reviews</Em> in clear user goals rather
              than personal design preferences.
            </Takeaway>
          </div>
        </section>
      </CaseStudyLayout>
    </div>
  );
}
