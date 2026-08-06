import { ChevronLeft } from "lucide-react";
import { BatteryIcon } from "@/components/ipod/BatteryIcon";
import {
  statusBarHeightCqi,
  type ChromeDensity,
} from "@/lib/chromeDensity";

type StatusBarProps = {
  title: string;
  showPlaying?: boolean;
  /** When provided, shows a back chevron before the title for a quick,
   * one-step back navigation (mirrors the physical MENU action). */
  onBack?: () => void;
  /**
   * "device" = classic on-iPod LCD bar.
   * "stage" = slimmer full-bleed bar once zoomed into Works / About / case study.
   */
  density?: ChromeDensity;
};

export function StatusBar({
  title,
  showPlaying = false,
  onBack,
  density = "device",
}: StatusBarProps) {
  const stage = density === "stage";

  // No height transitions — density is fixed per surface so Menu→Works zoom
  // never animates the bar height mid-flight.
  return (
    <div
      className={`ipod-status-bar relative z-20 flex w-full items-center justify-between ${
        stage
          ? "min-h-[14px] px-[max(12px,2.2cqi)]"
          : "min-h-[16px] px-[3.2cqi]"
      }`}
      style={{ height: statusBarHeightCqi(density) }}
    >
      <div
        className={`relative z-[1] flex min-w-0 items-center ${
          stage ? "gap-[0.45cqi]" : "gap-[0.6cqi]"
        }`}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className={`flex shrink-0 items-center justify-center text-status-bar-text/80 transition hover:text-status-bar-text ${
              stage
                ? "-ml-[0.4cqi] p-[0.55cqi]"
                : "-ml-[0.8cqi] p-[0.8cqi]"
            }`}
          >
            <ChevronLeft
              className={
                stage
                  ? "size-[max(9px,2.8cqi)]"
                  : "size-[max(10px,4.2cqi)]"
              }
              strokeWidth={2.5}
            />
          </button>
        ) : null}
        <p
          className={`truncate font-bold tracking-tight text-status-bar-text ${
            stage
              ? "text-[max(11px,2.35cqi)]"
              : "text-[max(8px,3.6cqi)]"
          }`}
        >
          {title}
        </p>
      </div>
      <div
        className={`relative z-[1] flex shrink-0 items-center ${
          stage ? "gap-[1cqi]" : "gap-[1.4cqi]"
        }`}
      >
        {showPlaying ? (
          <span
            className={`inline-block text-aqua-accent drop-shadow-[0_1px_0_rgba(255,255,255,0.6)] ${
              stage
                ? "text-[max(8px,1.9cqi)]"
                : "text-[max(7px,2.8cqi)]"
            }`}
            aria-hidden
          >
            ▶
          </span>
        ) : null}
        <BatteryIcon
          className={`shrink-0 drop-shadow-[0_0.5px_0_rgba(255,255,255,0.75)] ${
            stage
              ? "h-[max(9px,2.6cqi)] w-[max(18px,5.6cqi)]"
              : "h-[max(9px,3.8cqi)] w-[max(20px,8.4cqi)]"
          }`}
        />
      </div>
    </div>
  );
}
