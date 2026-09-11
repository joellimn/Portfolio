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

const v4 = (file: string) => `/assets/case-studies/v4/wttin/${file}`;
const media = (file: string) => `/assets/case-studies/wttin/${file}`;
const ACCENT = "#82a0ba";

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

type WttinCaseStudyProps = {
  onReturn?: () => void;
};

export function WttinCaseStudy({ onReturn }: WttinCaseStudyProps) {
  return (
    <div className="w-full bg-white pb-16 font-sans">
      <CaseStudyLayout
        onHome={onReturn}
        hero="/assets/case-studies/heroes/wttin.png?v=2"
        heroAlt="WTTIN AI chat and map of nearby resources on overlapping iPhones"
        title="WTTIN: Designing and deploying a mobile app for a non-profit"
        meta={[
          { label: "Role", value: "Lead UX Designer" },
          { label: "Timeline", value: "September 2025 - April 2026" },
          {
            label: "Team",
            value:
              "1 Product Manager  1 Engineering Manager  1 Product Designer  8 Developers",
          },
          { label: "Tools/Skills", value: "Figma, User Research, Prototyping" },
        ]}
        toc={CASE_STUDY_TOC.wttin}
        projectId="wttin"
      >
        <section id="problem" className="scroll-mt-24">
          <Label color={ACCENT}>Problem</Label>
          <p className="px-8 text-[32px] leading-[48px] text-black">
            Printed guides are inaccessible.
          </p>
          <p className="px-8 pt-4 text-[16px] leading-6 text-black/50">
            While Where to Turn in Nashville reached 100,000+ people through
            print booklets and a desktop portal, users needed a fast way to find
            local aid instantly.
          </p>
          <Figure
            src={v4("printed-guide.png")}
            alt="Printed Where to Turn in Nashville guide access point"
            width={4080}
            height={2361}
            priority
          />
        </section>

        <section id="goal" className="scroll-mt-24">
          <Label color={ACCENT}>Goal</Label>
          <p className="px-8 pb-8 text-[32px] leading-[40px] text-black/50">
            <Em>How might we</Em> turn a massive resource database into a{" "}
            <Em>fast, mobile lifeline</Em> for emergency aid?
          </p>
        </section>

        <section id="research" className="scroll-mt-24">
          <Label color={ACCENT}>Research</Label>
          <p className="px-8 text-[24px] leading-8 text-black">
            Speaking to Real Users:{" "}
            <span className="text-black/50">First, I analyzed </span>
            existing gaps
            <span className="text-black/50">
              {" "}
              to map out the necessary features for the mobile solution.
            </span>
          </p>
          <p className="px-8 pt-4 text-[17px] leading-[26px] text-black/70">
            I conducted discovery interviews with 4 vendors from The
            Contributor, who are part of the high-need population and represent
            WTTIN&apos;s primary user base.
          </p>
          <div className="flex flex-col gap-4 px-8 py-8 md:flex-row">
            <Card title="Need for mapping">
              &ldquo;There&apos;s no clear way to see{" "}
              <Em>what resources are near me.</Em>&rdquo;
            </Card>
            <Card title="Need for live status">
              &ldquo;I don&apos;t know which places are{" "}
              <Em>open or closed.</Em>&rdquo;
            </Card>
            <Card title="Need for easier search">
              &ldquo;The <Em>search bar</Em> on the website doesn&apos;t work
              sometimes.&rdquo;
            </Card>
          </div>
          <p className="px-8 text-[24px] leading-8 text-black">
            Stakeholder Discovery:{" "}
            <span className="text-black/50">Interviewed </span>
            three primary stakeholders
            <span className="text-black/50">
              {" "}
              to establish the precise categorization and flow for the 2025
              handbook.
            </span>
          </p>
          <p className="px-8 pt-4 text-[17px] leading-[26px] text-black/70">
            This allowed me to build a rigorous, logic-driven User Flow Chart to
            ensure that multi-tier navigation pathways systematically resolve
            into clear, actionable physical help locations.
          </p>
          <figure className="px-8 py-4">
            <MediaMat tone="blue" className="w-full p-8">
              <Image
                src={v4("flowchart.png")}
                alt="User flow chart mapping multi-tier navigation to help locations"
                width={2111}
                height={1481}
                className="h-auto w-full max-w-[582px] rounded-[16px] shadow-[4px_4px_10px_rgba(0,0,0,0.05)]"
                unoptimized
              />
            </MediaMat>
            <figcaption className="pt-1 text-right text-[12px] leading-[28.5px] text-black/50">
              User Flow Chart
            </figcaption>
          </figure>
        </section>

        <section id="design" className="scroll-mt-24">
          <Label color={ACCENT}>Design</Label>
          <p className="px-8 text-[32px] leading-[40px] text-black">
            Easy Access - Search by Map
          </p>
          <p className="px-8 pt-4 text-[20px] leading-[21px] text-black/50">
            &quot;There&apos;s no clear way to see what{" "}
            <Em>resources are near me.&quot;</Em> — WTTIN User
          </p>
          <p className="px-8 pt-4 text-[24px] leading-[27.5px] text-black/50">
            Designed around the Google Maps API to deliver a live map, helping
            users quickly locate community resources near them.
          </p>
          <figure className="px-8 py-4">
            <MediaMat tone="blue" className="w-full px-6 py-8">
              <CaseStudyVideo
                src={media("map-overview.mp4")}
                label="Map of nearby resources with a pull-up list of directory results"
                width={662}
                height={1448}
                className="w-full max-w-[410px]"
              />
            </MediaMat>
            <figcaption className="pt-1 text-center text-[12px] leading-[23.5px] text-black">
              Plots <Em>directory</Em> aid onto a <Em>live map</Em> centered on
              the <Em>user&apos;s location.</Em>
            </figcaption>
          </figure>
          <p className="px-8 pt-8 text-[24px] leading-[27.5px] text-black/50">
            <Em>Simple Interactions</Em> that accelerate discovery and minimize
            friction.
          </p>
          <div className="flex flex-col gap-8 px-8 py-4 md:flex-row">
            <figure className="flex min-w-0 flex-1 flex-col items-center">
              <MediaMat tone="blue" className="w-full px-6 py-8">
                <CaseStudyVideo
                  src={`${media("map-select.mp4")}?v=3`}
                  label="Tap a nearby resource on the map"
                  width={662}
                  height={724}
                  className="w-full max-w-[410px]"
                />
              </MediaMat>
              <figcaption className="w-full text-center text-[12px] leading-[23.5px] text-black">
                Click any resource near you
              </figcaption>
            </figure>
            <figure className="flex min-w-0 flex-1 flex-col items-center">
              <MediaMat tone="blue" className="w-full px-6 py-8">
                <CaseStudyVideo
                  src={`${media("map-filter.mp4")}?v=5`}
                  label="Filter map results by distance and category"
                  width={662}
                  height={1086}
                  className="w-full max-w-[410px]"
                />
              </MediaMat>
              <figcaption className="w-full text-center text-[12px] leading-[23.5px] text-black">
                Filter results near you
              </figcaption>
            </figure>
          </div>
          <p className="px-8 pt-8 text-[20px] leading-[27.5px] text-black/50">
            The app was released as an internal beta with the WTTIN team.
          </p>
        </section>

        <section id="challenges" className="scroll-mt-24">
          <Label color={ACCENT}>Challenges</Label>
          <p className="px-8 text-[32px] leading-[27.5px] text-black/50">
            Understanding Our Users: <Em>Offline Devices</Em>
          </p>
          <p className="px-8 pt-2 text-[20px] leading-[27.5px] text-black/50">
            <Em>Usability testing</Em> exposed a critical blind spot: much of
            our target audience <Em>lacks reliable internet access.</Em>
          </p>
          <div className="flex flex-col items-start justify-center gap-8 px-16 py-8 md:flex-row">
            <Image
              src={`${v4("offline-phone.png")}?v=2`}
              alt="Offline mode with no internet connection state"
              width={1130}
              height={2450}
              className="h-auto w-[282px] rounded-[17px]"
              unoptimized
            />
            <p className="max-w-[432px] text-[20px] leading-[27.5px] text-black/50">
              I introduced an <Em>Offline Mode</Em> that{" "}
              <Em>preserves critical directory</Em> info while clearly flagging
              internet-dependent features.
            </p>
          </div>
        </section>

        <section id="takeaways" className="scroll-mt-24">
          <Label color={ACCENT}>Takeaways</Label>
          <div className="flex flex-col gap-10 px-8 py-12">
            <Takeaway
              title="User Research"
              star={v4("star.svg")}
              border="#75b5fe"
            >
              <Em>Discovery interviews and usability testing</Em> highlighted
              key details and <Em>assumptions</Em> I had been making about my
              users.
            </Takeaway>
            <Takeaway
              title="Collaboration"
              star={v4("star.svg")}
              border="#75b5fe"
            >
              Collaborating closely with <Em>product and engineering leads</Em>{" "}
              taught me to design within real constraints early, avoiding late
              redesigns and <Em>keeping our team aligned.</Em>
            </Takeaway>
            <div className="flex flex-col items-center gap-2 py-8">
              <div className="flex w-full justify-center rounded bg-[#f0f4f8] py-8">
                <Image
                  src="/assets/case-studies/wttin/team.jpg"
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
      </CaseStudyLayout>
    </div>
  );
}
