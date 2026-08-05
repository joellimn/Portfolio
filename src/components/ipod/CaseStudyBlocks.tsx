import Image from "next/image";
import type { CaseStudyBlock } from "@/data/projects";

const TONE_STYLES: Record<
  "blue" | "pink" | "yellow",
  { bg: string; border: string; text: string }
> = {
  blue: {
    bg: "bg-[#e4f6fd]",
    border: "border-[#bce7f6]",
    text: "text-[#1f4d63]",
  },
  pink: {
    bg: "bg-[#fde3e3]",
    border: "border-[#f6c3c3]",
    text: "text-[#7a3030]",
  },
  yellow: {
    bg: "bg-[#fdf1d6]",
    border: "border-[#f2dda0]",
    text: "text-[#6b4f16]",
  },
};

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[clamp(8.5px,2.1cqi,11px)] font-semibold uppercase tracking-[0.18em] text-accent-blue/90">
      {children}
    </p>
  );
}

function Callout({
  tone,
  body,
}: {
  tone: "blue" | "pink" | "yellow";
  body: string;
}) {
  const styles = TONE_STYLES[tone];
  return (
    <div
      className={`border ${styles.border} ${styles.bg} ${styles.text} px-[3.2cqi] py-[2.6cqi] text-[clamp(10px,2.6cqi,14px)] font-medium leading-relaxed`}
    >
      {body}
    </div>
  );
}

function Media({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="flex w-full flex-col gap-[1.2cqi]">
      <div className="relative w-full overflow-hidden border border-black/15">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={900}
          className="h-auto w-full object-cover"
          unoptimized
        />
      </div>
      {caption ? (
        <figcaption className="text-center text-[clamp(9px,2.1cqi,12px)] text-black/45">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function SplitBlock({
  block,
}: {
  block: Extract<CaseStudyBlock, { type: "split" }>;
}) {
  const text = (
    <div className="flex flex-1 flex-col gap-[1.2cqi]">
      {block.label ? <SectionLabel>{block.label}</SectionLabel> : null}
      <h3 className="text-[clamp(10px,2.7cqi,14px)] font-semibold text-black">
        {block.heading}
      </h3>
      <p className="text-[clamp(8.5px,2.1cqi,12px)] leading-relaxed text-black/70">
        {block.body}
      </p>
      {block.note ? <Callout tone={block.note.tone} body={block.note.body} /> : null}
    </div>
  );

  const media = (
    <div className={block.mediaPosition === "bottom" ? "w-full" : "w-[42%] shrink-0"}>
      <Media src={block.media.src} alt={block.media.alt} />
    </div>
  );

  if (block.mediaPosition === "bottom") {
    return (
      <div className="flex w-full flex-col gap-[2.4cqi]">
        {text}
        {media}
      </div>
    );
  }

  return (
    <div className="flex w-full items-start gap-[3cqi]">
      {block.mediaPosition === "start" ? media : null}
      {text}
      {block.mediaPosition === "end" ? media : null}
    </div>
  );
}

function InsightGrid({
  block,
}: {
  block: Extract<CaseStudyBlock, { type: "insightGrid" }>;
}) {
  return (
    <div className="flex w-full flex-col gap-[2cqi]">
      <SectionLabel>{block.label}</SectionLabel>
      <h3 className="text-[clamp(10px,2.7cqi,14px)] font-semibold text-black">
        {block.heading}
      </h3>
      <div className="flex w-full items-start gap-[3cqi]">
        <div className="flex flex-1 flex-col gap-[1.6cqi]">
          <div className="flex flex-col gap-[0.8cqi]">
            <h4 className="text-[clamp(9px,2.3cqi,12px)] font-semibold text-black">
              {block.subheading}
            </h4>
            <p className="text-[clamp(8px,2cqi,11px)] leading-relaxed text-black/70">
              {block.body}
            </p>
          </div>
          <div className="grid w-full grid-cols-3 gap-[0.8cqi]">
            {block.items.map((item) => (
              <div
                key={item.heading}
                className="border border-accent-blue/30 px-[1.2cqi] py-[1cqi]"
              >
                <p className="text-[clamp(6px,1.7cqi,9px)] font-semibold text-black">
                  {item.heading}
                </p>
                <p className="mt-[0.4cqi] text-[clamp(5.5px,1.5cqi,8px)] italic leading-snug text-black/55">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[42%] shrink-0">
          <Media src={block.media.src} alt={block.media.alt} />
        </div>
      </div>
    </div>
  );
}

function CalloutList({
  block,
}: {
  block: Extract<CaseStudyBlock, { type: "calloutList" }>;
}) {
  return (
    <div className="flex w-full flex-col gap-[1.8cqi]">
      <div className="flex flex-col gap-[0.8cqi]">
        <SectionLabel>{block.label}</SectionLabel>
        <p className="text-[clamp(10px,2.5cqi,14px)] text-black/70">
          {block.intro}
        </p>
      </div>
      <div className="flex flex-col gap-[1.2cqi]">
        {block.items.map((item) => (
          <Callout key={item} tone={block.tone} body={item} />
        ))}
      </div>
    </div>
  );
}

export function CaseStudyBlocks({ blocks }: { blocks: CaseStudyBlock[] }) {
  return (
    <div className="flex w-full flex-col gap-[4.5cqi]">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "text":
            return (
              <div key={index} className="flex w-full flex-col gap-[1.2cqi]">
                {block.label ? <SectionLabel>{block.label}</SectionLabel> : null}
                {block.heading ? (
                  <h3 className="text-[clamp(11.5px,3.1cqi,16px)] font-semibold text-black">
                    {block.heading}
                  </h3>
                ) : null}
                {block.body ? (
                  <p className="text-[clamp(10px,2.5cqi,14px)] leading-relaxed text-black/70">
                    {block.body}
                  </p>
                ) : null}
              </div>
            );
          case "callout":
            return (
              <Callout key={index} tone={block.tone} body={block.body} />
            );
          case "media":
            return (
              <Media
                key={index}
                src={block.src}
                alt={block.alt}
                caption={block.caption}
              />
            );
          case "split":
            return <SplitBlock key={index} block={block} />;
          case "insightGrid":
            return <InsightGrid key={index} block={block} />;
          case "calloutList":
            return <CalloutList key={index} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
