import type { ReactNode } from "react";
import Image from "next/image";

const asset = (file: string) => `/assets/case-studies/wearitt/${file}`;

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
    <p className={`${className} text-[20px] leading-[27.5px] text-[#924892]`}>
      {children}
    </p>
  );
}

function BleedFade({
  to,
  hold = "50%",
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

function Frame({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "block h-auto w-full",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
      priority={priority}
    />
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
    <div className="flex w-full items-start gap-4 rounded-[32px] bg-[#faf1fa] p-4">
      <div className="flex h-[88px] shrink-0 items-center px-2 py-4">
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

type WearittCaseStudyProps = {
  onReturn?: () => void;
};

export function WearittCaseStudy({ onReturn }: WearittCaseStudyProps) {
  return (
    <article className="w-full bg-white pb-16 font-sans">
      <BleedFade to="#fff5ff">
        <Shell>
          <header className="flex flex-col items-center pt-16 pb-4 tracking-[-1px]">
            <h1 className="text-center text-[56px] font-medium leading-[44px] text-black">
              Wearitt
            </h1>
          </header>
          <Frame
            src={asset("framed-hero.png")}
            alt="Wearitt color tokens, spacing system, and component library"
            width={2400}
            height={1023}
            priority
          />
        </Shell>
      </BleedFade>

      <div className="bg-[#fff5ff]">
        <Shell>
          <p className="py-4 text-center text-[20px] leading-[27.5px] text-black">
            Building a design system for mobile wardrobe app
          </p>
          <div className="flex items-start justify-center px-12 py-8">
            {[
              { label: "Role", value: "UX Design Intern" },
              { label: "Timeline", value: "December 2025 - May 2026" },
              {
                label: "Team",
                value: "2 UX Design Interns\n3 UX Designers",
              },
              { label: "Tools/Skills", value: "Figma, Design Systems" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex min-w-0 flex-1 flex-col gap-2 px-4"
              >
                <p className="text-[12px] font-medium uppercase leading-[17.25px] tracking-[1.61px] text-black/40">
                  {item.label}
                </p>
                <p className="whitespace-pre-line text-[16px] leading-[20.625px] text-black/80">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <Label className="px-12 py-8">Highlights</Label>
          <p className="px-12 py-4 text-center text-[24px] leading-[27.5px] text-black/50">
            Created a <Em>scalable design system</Em> to turn disjointed tools
            into <Em>one focused experience.</Em>
          </p>
          <Frame
            src={asset("framed-highlights.png")}
            alt="Wearitt account, profile, closet, and collage screens from the design system"
            width={2400}
            height={3624}
          />
        </Shell>
      </div>

      <div className="h-[60px] bg-white" />

      <Shell>
        <section>
          <Label className="px-12 py-8">Context</Label>
          <div className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-4 py-8">
            <p className="text-center text-[48px] leading-[48px] text-black">
              Too many features.
            </p>
            <p className="text-center text-[16px] leading-6 text-black/50">
              Wearitt was <Em>fractured</Em> across{" "}
              <Em>four competing features:</Em> Virtual Try-On, Collage Maker,
              Digital Closet, and an Inspiration Feed.
            </p>
          </div>
          <div className="flex flex-col items-center p-4">
            <Frame
              src={asset("framed-homescreen.png")}
              alt="Current Wearitt homescreen"
              width={528}
              height={1155}
              className="h-auto w-[264px]"
            />
            <p className="w-[264px] text-right text-[12px] leading-[28.5px] text-black/50">
              Current Wearitt Homescreen
            </p>
          </div>
          <p className="px-12 py-4 text-center text-[40px] leading-[40px] text-black/50">
            <Em>How might we</Em> create a <Em>unified framework</Em> that pulls
            four disconnected features into one seamless flow?
          </p>
        </section>
      </Shell>

      <Shell>
        <div className="h-[60px]" />
        <Label>Design</Label>
        <p className="px-12 py-4 text-[40px] leading-[40px] text-black">
          The Solution: Design System.
        </p>
        <p className="px-12 pb-10 pt-4 text-[20px] leading-[20.5px] text-black/50">
          Applied <Em>Brad Frost’s Atomic Design framework</Em> to build a
          centralized component library that resolved feature fragmentation
          across the app.
        </p>

        <p className="px-16 pb-4 pt-8 text-[24px] leading-[27.5px] text-black">
          Atoms
        </p>
        <div className="flex flex-col items-start gap-8 px-16 py-4 md:flex-row">
          <Frame
            src={asset("framed-atoms.png")}
            alt="Wearitt color tokens, typography, and spacing foundations"
            width={1552}
            height={1721}
            className="h-auto w-full max-w-[776px] shrink-0"
          />
          <p className="w-full max-w-[264px] text-[20px] leading-[27.5px] text-black/50">
            Established <Em>core visual rules</Em>, including an{" "}
            <Em>8pt grid,</Em> tokenized <Em>color palettes, typography</Em>{" "}
            scales, and unified button states.
          </p>
        </div>

        <p className="px-16 pb-4 pt-8 text-[24px] leading-[27.5px] text-black">
          Molecules
        </p>
        <div className="flex flex-col items-start gap-8 px-16 py-8 md:flex-row">
          <p className="w-full max-w-[360px] text-right text-[20px] leading-[27.5px] text-black/50">
            Paired foundational tokens into <Em>reusable units,</Em> like
            view-selection tabs (Closet vs. Wishlist) and{" "}
            <Em>standardized tagging inputs.</Em>
          </p>
          <Frame
            src={asset("framed-molecules.png")}
            alt="Wearitt buttons, chips, tabs, and navigation icon molecules"
            width={1360}
            height={1188}
            className="h-auto w-full max-w-[680px] shrink-0"
          />
        </div>

        <p className="px-16 pb-4 pt-8 text-[24px] leading-[27.5px] text-black">
          Organisms
        </p>
        <div className="flex flex-col items-start justify-center gap-8 px-16 py-4 md:flex-row">
          <Frame
            src={asset("framed-organisms.png")}
            alt="Wearitt bottom navigation bar states"
            width={849}
            height={1364}
            className="h-auto w-full max-w-[424px] shrink-0"
          />
          <p className="w-full max-w-[220px] text-[20px] leading-[27.5px] text-black/50">
            Assembled molecules into complex global components, including{" "}
            <Em>shared navigation bars,</Em> canvas modals, and responsive feed
            cards.
          </p>
        </div>
      </Shell>

      <Shell>
        <section>
          <Label>Challenges</Label>
          <p className="px-12 py-4 text-[48px] leading-[48px] text-black">
            Navigating an established project.
          </p>
          <div className="flex flex-col gap-10 px-16 py-12 md:flex-row md:items-stretch">
            <div className="flex min-w-0 flex-1 flex-col rounded-[32px] bg-[#faf1fa] p-4">
              <p className="p-2 text-[24px] leading-[27.5px] text-black">
                Context
              </p>
              <p className="p-2 text-[20px] leading-[27.5px] text-black/50">
                Joining a live product established in 2023 meant navigating
                substantial existing design debt for the first time.
              </p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col rounded-[32px] bg-[#f4d5f4] p-4">
              <p className="p-2 text-[24px] leading-[27.5px] text-black">
                Approach
              </p>
              <p className="p-2 text-[20px] leading-[27.5px] text-black/50">
                Rather than jumping straight into new UI screens, I audited
                historical product documentation and legacy files to understand
                the core mission.
              </p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col rounded-[32px] bg-[#f7c1f7] p-4">
              <p className="p-2 text-[24px] leading-[27.5px] text-black">
                Outcome
              </p>
              <p className="p-2 text-[20px] leading-[27.5px] text-black/50">
                Uncovered the root cause of feature fragmentation, uncovering an
                urgent need for a standardized design system.
              </p>
            </div>
          </div>
        </section>
      </Shell>

      <Shell>
        <section>
          <Label>Takeaways</Label>
          <div className="flex flex-col gap-10 px-16 py-12">
            <Takeaway title="Scalable Architecture">
              Treated design systems as <Em>functional infrastructure</Em> for
              team alignment and clean dev handoffs.
            </Takeaway>
            <Takeaway title="Legacy Adaptability">
              Balanced <Em>existing product footprints</Em> with modern UX
              upgrades without breaking current workflows.
            </Takeaway>
            <Takeaway title="Logic-Driven Feedback">
              Grounded <Em>daily peer reviews</Em> in clear user goals rather
              than personal design preferences.
            </Takeaway>
          </div>
        </section>

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
