import type { ReactNode } from "react";
import Image from "next/image";
import { CaseStudyVideo } from "@/components/case-studies/CaseStudyVideo";

const asset = (file: string) => `/assets/case-studies/wttin/${file}`;

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
    <p className={`${className} text-[20px] leading-[27.5px] text-[#82a0ba]`}>
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

function Takeaway({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full items-start gap-4 rounded-[32px] border border-solid border-[#e7eef5] bg-[#f0f4f8] p-4">
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

type WttinCaseStudyProps = {
  onReturn?: () => void;
};

export function WttinCaseStudy({ onReturn }: WttinCaseStudyProps) {
  return (
    <article className="w-full bg-white pb-16 font-sans">
      <div
        className="flex flex-col"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #fff 0%, #fff 37.119%, #f3faff 87.81%, #eef8ff 100%)",
        }}
      >
        <Shell>
          <header className="flex flex-col items-center pt-16 pb-4 tracking-[-1px]">
            <h1 className="text-center text-[56px] font-medium leading-[44px] text-black">
              Where to Turn in Nashville
            </h1>
            <p className="text-center text-[16px] leading-[44px] text-black/50">
              Fall 2025 - Spring 2026
            </p>
          </header>
          <Frame
            src={asset("framed-hero.png")}
            alt="WTTIN AI chat and map of nearby resources on overlapping iPhones"
            width={2400}
            height={1126}
            priority
          />
        </Shell>

        <Shell>
          <p className="py-4 text-center text-[20px] leading-[27.5px] text-black">
            Designing and deploying a mobile app for a local non-profit
          </p>
          <div className="flex items-start justify-center px-12 py-8">
            {[
              { label: "Role", value: "Lead UX Designer" },
              { label: "Timeline", value: "September 2025 - April 2026" },
              {
                label: "Team",
                value:
                  "1 Product Manager\n1 Engineering Manager\n1 Product Designer\n8 Developers",
              },
              { label: "Tools/Skills", value: "Figma, User Research, Prototyping" },
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
        </Shell>
      </div>

      <div className="bg-[#eef8ff]">
        <Shell>
          <Label className="px-12 py-8">Highlights</Label>
          <p className="px-12 py-4 text-center text-[24px] leading-[27.5px] text-black/50">
            Led <Em>end-to-end design</Em> for an emergency relief services mobile
            application.
          </p>
          <Frame
            src={asset("framed-highlights.png")}
            alt="WTTIN splash, directory, map, and AI chat screens"
            width={1200}
            height={2283}
          />
        </Shell>
      </div>

      <div className="h-[60px] bg-white" />

      <Shell>
        <section>
          <Label className="px-12 py-8">Context</Label>
          <div className="mx-auto flex w-full max-w-[624px] flex-col items-center gap-4 py-4">
            <p className="text-center text-[48px] leading-[48px] text-black">
              Printed guides are inaccessible
            </p>
            <p className="px-12 text-center text-[16px] leading-6 text-black/50">
              While Where to Turn in Nashville reached <Em>100,000+ people</Em>{" "}
              through print booklets and a desktop portal, users needed a{" "}
              <Em>fast way to find local aid instantly.</Em>
            </p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="rounded-[32px] bg-[#f0f4f8] p-8">
              <div className="rounded-2xl bg-white p-2 shadow-[4px_2px_5px_rgba(0,0,0,0.05)]">
                <Image
                  src={asset("guide-source.png")}
                  alt="Where to Turn in Nashville printed guide access point"
                  width={2580}
                  height={1574}
                  className="block h-auto w-full max-w-[736px]"
                  unoptimized
                />
              </div>
            </div>
            <p className="w-full max-w-[816px] text-right text-[12px] leading-[28.5px] text-black/50">
              Printed guide access point
            </p>
          </div>
          <p className="px-12 py-4 text-center text-[40px] leading-[40px] text-black/50">
            <Em>How might we</Em> turn a massive resource database into a{" "}
            <Em>fast, mobile lifeline</Em> for emergency aid?
          </p>
        </section>
      </Shell>

      <div
        style={{
          backgroundImage:
            "linear-gradient(180deg, #fff 0%, #fff 87.223%, #f2f9ff 100%)",
        }}
      >
        <Shell>
          <div className="h-[60px] bg-white" />
          <Label>Design</Label>
          <p className="px-12 py-4 text-[40px] leading-[27.5px] text-black">
            Easy Access - Search by Map
          </p>
          <p className="px-12 pb-10 pt-4 text-center text-[20px] italic leading-[20.5px] text-black/50">
            &quot;There&apos;s no clear way to see what{" "}
            <Em>resources are near me.&quot;</Em>
            <br />
            <span className="not-italic">— WTTIN User</span>
          </p>
          <div className="flex flex-col items-center gap-8 px-16 py-4 md:flex-row md:items-start">
            <div className="w-full max-w-[756px] shrink-0">
              <Frame
                src={asset("framed-map.png")}
                alt="Map view and nearby resource list"
                width={756}
                height={710}
              />
            </div>
            <p className="min-w-0 flex-1 text-[20px] leading-[27.5px] text-black/50">
              Plots <Em>directory</Em> aid onto a <Em>live map</Em> centered on
              the <Em>user&apos;s location.</Em>
            </p>
          </div>
          <p className="px-16 py-8 text-[24px] leading-[27.5px] text-black/50">
            <Em>Simple Interactions</Em> that accelerate discovery and minimize
            friction.
          </p>
          <div className="flex flex-col items-center justify-center gap-12 px-16 py-4 md:flex-row md:items-start">
            <figure className="flex w-full max-w-[400px] flex-col items-center gap-3">
              <CaseStudyVideo
                src={asset("map-select.mp4")}
                label="Tap a nearby resource on the map"
                radius="phone"
              />
              <figcaption className="text-center text-[12px] leading-[28.5px] text-black/50">
                Click any resource near you
              </figcaption>
            </figure>
            <figure className="flex w-full max-w-[400px] flex-col items-center gap-3">
              <CaseStudyVideo
                src={asset("map-filter.mp4")}
                label="Filter map results by distance and category"
                radius="phone"
                cropX={2}
                cropBottom={1}
              />
              <figcaption className="text-center text-[12px] leading-[28.5px] text-black/50">
                Filter results near you
              </figcaption>
            </figure>
          </div>
          <div className="h-[92px]" />
          <p className="px-12 py-8 text-[40px] leading-[27.5px] text-black">
            Ah yes, another AI Chatbot
          </p>
          <div className="flex flex-col items-center gap-4 px-16 py-8">
            <Frame
              src={asset("framed-chat.png")}
              alt="WTTIN AI chat start state and a nearby-resources reply"
              width={1072}
              height={726}
            />
            <p className="text-center text-[20px] leading-[27.5px] text-black/50">
              <Em>Eliminates navigation drop-off points</Em> by routing
              plain-language queries directly to the right services.
            </p>
          </div>
        </Shell>
      </div>

      <div className="bg-[#f2f9ff]">
        <Shell>
          <div className="flex flex-col gap-2 px-12 pb-8 pt-16">
            <p className="text-[40px] leading-[27.5px] text-black/50">
              Understanding Our Users: <Em>Offline Devices</Em>
            </p>
            <p className="text-[20px] leading-[27.5px] text-black/50">
              <Em>Usability testing</Em> exposed a critical blind spot: much of
              our target audience <Em>lacks reliable internet access.</Em>
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 px-16 py-8 md:flex-row md:items-center">
            <Image
              src={asset("offline.png")}
              alt="Offline mode with no internet connection state"
              width={282}
              height={612}
              className="h-auto w-[282px] rounded-[20px]"
              unoptimized
            />
            <p className="max-w-[432px] text-[24px] leading-[27.5px] text-black/50">
              I introduced an <Em>Offline Mode</Em> that{" "}
              <Em>preserves critical directory</Em> info while clearly flagging
              internet-dependent features.
            </p>
          </div>
        </Shell>
      </div>

      <div className="h-[60px] bg-white" />

      <Shell>
        <section>
          <Label className="px-12 py-8">Takeaways</Label>
          <div className="flex flex-col gap-10 px-16 py-12">
            <Takeaway title="User Research">
              <Em>Discovery interviews and usability testing</Em> highlighted key
              details and <Em>assumptions</Em> I had been making about my users.
            </Takeaway>
            <Takeaway title="Collaboration">
              Collaborating closely with <Em>product and engineering leads</Em>{" "}
              taught me to design within real constraints early, avoiding late
              redesigns and <Em>keeping our team aligned.</Em>
            </Takeaway>
            <div className="flex flex-col items-center gap-2 py-8">
              <div className="flex w-full justify-center rounded-[32px] border border-solid border-[#e7eef5] bg-[#f0f4f8] py-8">
                <Image
                  src={asset("team.jpg")}
                  alt="Where to Turn in Nashville team photo"
                  width={1600}
                  height={1200}
                  className="h-auto w-full max-w-[538px] rounded-[32px] shadow-[4px_4px_5px_rgba(0,0,0,0.05)]"
                  unoptimized
                />
              </div>
              <p className="text-center text-[12px] leading-[28.5px] text-black">
                Where to Turn in Nashville Team 25-26
              </p>
            </div>
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
