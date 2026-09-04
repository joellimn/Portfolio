import { type Ref } from "react";

type WordmarkProps = {
  className?: string;
  ref?: Ref<HTMLSpanElement>;
};

/** ㅇ ㅊ ㄱ graphic. Color follows `currentColor`. */
export function Wordmark({ className = "", ref }: WordmarkProps) {
  return (
    <span
      ref={ref}
      aria-hidden
      className={`inline-block aspect-[1024/461] bg-current ${className}`}
      style={{
        WebkitMaskImage: "url('/assets/wordmark-c2.png')",
        maskImage: "url('/assets/wordmark-c2.png')",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskMode: "luminance",
        maskMode: "luminance",
      }}
    />
  );
}
