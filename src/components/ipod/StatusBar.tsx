import { ChevronLeft } from "lucide-react";
import { BatteryIcon } from "@/components/ipod/BatteryIcon";

type StatusBarProps = {
  title: string;
  showPlaying?: boolean;
  /** When provided, shows a back chevron before the title for a quick,
   * one-step back navigation (mirrors the physical MENU action). */
  onBack?: () => void;
  /** Slimmer bar while a case study is scrolled — frees vertical space. */
  compact?: boolean;
};

export function StatusBar({
  title,
  showPlaying = false,
  onBack,
  compact = false,
}: StatusBarProps) {
  // Classic LCD title bar: glassy gradient, etched type, blue play pip.
  // No height transitions — cqi jumps on stage swap (e.g. Works → About)
  // would otherwise ease and read as a top-tab animation.
  return (
    <div
      className={`ipod-status-bar relative z-20 flex w-full items-center justify-between px-[3.2cqi] ${
        compact ? "min-h-[14px]" : "min-h-[16px]"
      }`}
      style={{ height: compact ? "5.2cqi" : "8.5cqi" }}
    >
      <div className="relative z-[1] flex min-w-0 items-center gap-[0.6cqi]">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="-ml-[0.8cqi] flex shrink-0 items-center justify-center p-[0.8cqi] text-status-bar-text/80 transition hover:text-status-bar-text"
          >
            <ChevronLeft
              className={
                compact
                  ? "size-[max(9px,3.4cqi)]"
                  : "size-[max(10px,4.2cqi)]"
              }
              strokeWidth={2.5}
            />
          </button>
        ) : null}
        <p
          className={`truncate font-bold tracking-tight text-status-bar-text ${
            compact
              ? "text-[max(7px,2.9cqi)]"
              : "text-[max(8px,3.6cqi)]"
          }`}
        >
          {title}
        </p>
      </div>
      <div className="relative z-[1] flex shrink-0 items-center gap-[1.4cqi]">
        {showPlaying ? (
          <span
            className={`inline-block text-aqua-accent drop-shadow-[0_1px_0_rgba(255,255,255,0.6)] ${
              compact
                ? "text-[max(6px,2.2cqi)]"
                : "text-[max(7px,2.8cqi)]"
            }`}
            aria-hidden
          >
            ▶
          </span>
        ) : null}
        <BatteryIcon
          className={`shrink-0 drop-shadow-[0_0.5px_0_rgba(255,255,255,0.75)] ${
            compact
              ? "h-[max(8px,3.2cqi)] w-[max(17px,7cqi)]"
              : "h-[max(9px,3.8cqi)] w-[max(20px,8.4cqi)]"
          }`}
        />
      </div>
    </div>
  );
}
