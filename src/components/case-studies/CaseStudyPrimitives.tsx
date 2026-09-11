import type { ReactNode } from "react";
import Image from "next/image";

export function Em({ children }: { children: ReactNode }) {
  return <span className="text-black">{children}</span>;
}

export function Label({
  children,
  color,
}: {
  children: string;
  color: string;
}) {
  return (
    <p
      className="px-8 pt-8 pb-4 text-[20px] leading-[27.5px]"
      style={{ color }}
    >
      {children}
    </p>
  );
}

export function Headline({ children }: { children: ReactNode }) {
  return (
    <p className="px-8 text-[32px] leading-[40px] text-black">{children}</p>
  );
}

export function Body({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="px-8 text-[20px] leading-[27.5px] text-black/50">
      {children}
    </p>
  );
}

const MEDIA_MAT = {
  cream: "bg-[#faf7ed]",
  gold: "bg-[#f2e7c4] border border-solid border-[#f3ebcf]",
  blue: "bg-[#f0f4f8] border border-solid border-[#e7eef5]",
} as const;

/** 4px mat used around product recordings in the V4 Figma frames. */
export function MediaMat({
  tone,
  children,
  className = "",
}: {
  tone: keyof typeof MEDIA_MAT;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded ${MEDIA_MAT[tone]} ${className}`}
    >
      {children}
    </div>
  );
}

export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
}) {
  return (
    <figure className="px-8 py-4">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="block h-auto w-full"
        unoptimized
        priority={priority}
      />
      {caption ? (
        <figcaption className="pt-1 text-right text-[16px] leading-[28.5px] text-black/50">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function Takeaway({
  title,
  star,
  border,
  children,
}: {
  title: string;
  star: string;
  border: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex w-full items-start gap-4 rounded-[32px] border border-solid bg-white p-4 shadow-[4px_4px_5px_rgba(0,0,0,0.05)]"
      style={{ borderColor: border }}
    >
      <div className="flex h-[88px] w-12 shrink-0 items-center justify-center overflow-clip">
        <img src={star} alt="" width={32} height={32} className="size-8" />
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
