import Image from "next/image";
import type { CaseStudyBlock } from "@/data/projects";

const TONE_CLASS: Record<"blue" | "pink" | "yellow", string> = {
  blue: "ipod-callout-blue",
  pink: "ipod-callout-pink",
  yellow: "ipod-callout-yellow",
};

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="ipod-section-label text-[clamp(8px,1.95cqi,14px)] font-semibold uppercase">
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
  return (
    <div
      className={`${TONE_CLASS[tone]} px-[2.8cqi] py-[2.2cqi] text-[clamp(10.5px,2.55cqi,19px)] leading-[1.5]`}
    >
      {body}
    </div>
  );
}

function isVideoSrc(src: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(src);
}

function Media({
  src,
  alt,
  caption,
  size = "default",
}: {
  src: string;
  alt: string;
  caption?: string;
  /** Full-bleed screenshots read better slightly inset for recruiter scan. */
  size?: "default" | "inset";
}) {
  const video = isVideoSrc(src);

  return (
    <figure
      className={`flex flex-col gap-[1.1cqi] ${
        size === "inset" ? "mx-auto w-[64%]" : "w-full"
      }`}
    >
      <div className="relative w-full border border-black/10">
        {video ? (
          <video
            src={src}
            className="h-auto w-full"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={alt}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={900}
            className="h-auto w-full"
            unoptimized
          />
        )}
      </div>
      {caption ? (
        <figcaption className="text-center text-[clamp(9px,2.05cqi,15px)] leading-snug text-black/42">
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
    <div className="flex flex-1 flex-col gap-[1.15cqi]">
      {block.label ? <SectionLabel>{block.label}</SectionLabel> : null}
      <h3 className="text-[clamp(12px,2.95cqi,20px)] font-semibold leading-snug text-black">
        {block.heading}
      </h3>
      <p className="text-[clamp(10px,2.35cqi,17px)] leading-[1.55] text-black/70">
        {block.body}
      </p>
      {block.note ? <Callout tone={block.note.tone} body={block.note.body} /> : null}
    </div>
  );

  const media = (
    <div
      className={
        block.mediaPosition === "bottom"
          ? "w-full"
          : block.mediaWidth === "narrow"
            ? "w-[30%] shrink-0"
            : "w-[40%] shrink-0"
      }
    >
      <Media
        src={block.media.src}
        alt={block.media.alt}
        size={block.mediaPosition === "bottom" ? "inset" : "default"}
      />
    </div>
  );

  if (block.mediaPosition === "bottom") {
    return (
      <div className="flex w-full flex-col gap-[2.2cqi]">
        {text}
        {media}
      </div>
    );
  }

  return (
    <div className="flex w-full items-start gap-[3.2cqi]">
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
  const columns =
    block.items.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="flex w-full flex-col gap-[2cqi]">
      <div className="flex flex-col gap-[0.9cqi]">
        <SectionLabel>{block.label}</SectionLabel>
        <h3 className="text-[clamp(12px,2.95cqi,20px)] font-semibold leading-snug text-black">
          {block.heading}
        </h3>
      </div>
      <div className="flex w-full items-start gap-[3.2cqi]">
        <div className="flex min-w-0 flex-1 flex-col gap-[2cqi]">
          <div className="flex flex-col gap-[0.7cqi]">
            <h4 className="text-[clamp(10.5px,2.4cqi,17px)] font-semibold text-black">
              {block.subheading}
            </h4>
            <p className="text-[clamp(10px,2.3cqi,17px)] leading-[1.55] text-black/70">
              {block.body}
            </p>
          </div>
          <div className={`grid w-full grid-cols-1 gap-[1.4cqi] ${columns}`}>
            {block.items.map((item) => (
              <div key={item.heading} className="ipod-insight-cell pt-[1.2cqi]">
                <p className="text-[clamp(8.5px,2cqi,15px)] font-semibold leading-snug text-black">
                  {item.heading}
                </p>
                <p className="mt-[0.55cqi] text-[clamp(8px,1.9cqi,14px)] leading-[1.45] text-black/58">
                  {block.itemStyle === "finding"
                    ? item.quote
                    : `\u201C${item.quote}\u201D`}
                </p>
              </div>
            ))}
          </div>
        </div>
        {block.media ? (
          <div className="hidden w-[38%] shrink-0 sm:block">
            <Media src={block.media.src} alt={block.media.alt} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MediaPair({
  block,
}: {
  block: Extract<CaseStudyBlock, { type: "mediaPair" }>;
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-[2cqi] sm:grid-cols-2 sm:items-start">
      {[block.left, block.right].map((item) => (
        <figure key={item.src} className="flex w-full flex-col">
          <div className="relative w-full border border-black/10">
            <Image
              src={item.src}
              alt={item.alt}
              width={1200}
              height={900}
              className="h-auto w-full"
              unoptimized
            />
          </div>
        </figure>
      ))}
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
        <p className="text-[clamp(10.5px,2.45cqi,18px)] leading-[1.5] text-black/70">
          {block.intro}
        </p>
      </div>
      <ol className="flex flex-col gap-[1cqi]">
        {block.items.map((item, index) => (
          <li
            key={item}
            className={`${TONE_CLASS[block.tone]} flex gap-[1.6cqi] px-[2.4cqi] py-[1.8cqi]`}
          >
            <span className="shrink-0 text-[clamp(9.5px,2.2cqi,16px)] font-semibold tabular-nums text-black/35">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[clamp(10px,2.4cqi,17px)] leading-[1.5]">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function hasSectionLabel(block: CaseStudyBlock): boolean {
  return "label" in block && Boolean(block.label);
}

export function CaseStudyBlocks({ blocks }: { blocks: CaseStudyBlock[] }) {
  return (
    <div className="flex w-full flex-col gap-[4.2cqi]">
      {blocks.map((block, index) => {
        const sectionBreak =
          index > 0 && hasSectionLabel(block)
            ? "mt-[1.4cqi] border-t border-black/[0.07] pt-[4.2cqi]"
            : undefined;

        const node = (() => {
          switch (block.type) {
            case "text":
              return (
                <div className="flex w-full flex-col gap-[1.1cqi]">
                  {block.label ? <SectionLabel>{block.label}</SectionLabel> : null}
                  {block.heading ? (
                    <h3 className="text-[clamp(13px,3.2cqi,22px)] font-semibold leading-snug text-black">
                      {block.heading}
                    </h3>
                  ) : null}
                  {block.body ? (
                    <p className="text-[clamp(11px,2.6cqi,19px)] leading-[1.55] text-black/72">
                      {block.body}
                    </p>
                  ) : null}
                </div>
              );
            case "callout":
              return <Callout tone={block.tone} body={block.body} />;
            case "media":
              return (
                <Media
                  src={block.src}
                  alt={block.alt}
                  caption={block.caption}
                  size="inset"
                />
              );
            case "mediaPair":
              return <MediaPair block={block} />;
            case "split":
              return <SplitBlock block={block} />;
            case "insightGrid":
              return <InsightGrid block={block} />;
            case "calloutList":
              return <CalloutList block={block} />;
            default:
              return null;
          }
        })();

        if (!node) return null;

        return (
          <div key={index} className={sectionBreak}>
            {node}
          </div>
        );
      })}
    </div>
  );
}
