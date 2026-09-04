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
      className={`wordmark inline-block aspect-[1024/461] bg-current ${className}`}
    />
  );
}
