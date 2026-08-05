import Image from "next/image";
import { ChevronLeft } from "lucide-react";

type StatusBarProps = {
  title: string;
  showPlaying?: boolean;
  /** When provided, shows a back chevron before the title for a quick,
   * one-step back navigation (mirrors the physical MENU action). */
  onBack?: () => void;
};

export function StatusBar({ title, showPlaying = false, onBack }: StatusBarProps) {
  return (
    <div className="relative z-20 flex h-[8.5cqi] min-h-[16px] w-full items-center justify-between bg-status-bar px-[3.2cqi]">
      <div className="flex min-w-0 items-center gap-[0.6cqi]">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="-ml-[0.8cqi] flex shrink-0 items-center justify-center p-[0.8cqi] text-black/70 transition hover:text-black"
          >
            <ChevronLeft
              className="size-[clamp(10px,4.2cqi,17px)]"
              strokeWidth={2.5}
            />
          </button>
        ) : null}
        <p className="truncate text-[clamp(8px,3.6cqi,15px)] font-medium text-black">
          {title}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-[1.4cqi]">
        {showPlaying ? (
          <span
            className="inline-block text-[clamp(7px,3cqi,12px)] text-accent-green"
            aria-hidden
          >
            ▶
          </span>
        ) : null}
        <div className="relative size-[clamp(10px,5cqi,20px)]">
          <Image
            src="/assets/ipod/battery.svg"
            alt=""
            fill
            className="rotate-90 object-contain"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
