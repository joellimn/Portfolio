"use client";

import { ClickWheel } from "@/components/ipod/ClickWheel";
import { StatusBar } from "@/components/ipod/StatusBar";

type IpodDeviceProps = {
  statusTitle: string;
  showPlaying?: boolean;
  onBack?: () => void;
  /** Rendered above the status bar and screen content, e.g. the
   * Navigation drawer overlay. */
  overlay?: React.ReactNode;
  children: React.ReactNode;
  onMenu?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onPlay?: () => void;
  onSelect?: () => void;
};

export function IpodDevice({
  statusTitle,
  showPlaying = false,
  onBack,
  overlay,
  children,
  onMenu,
  onPrev,
  onNext,
  onPlay,
  onSelect,
}: IpodDeviceProps) {
  return (
    <div className="relative mx-auto w-[min(360px,86vw,58vh)] origin-center [container-type:inline-size]">
      <div className="relative overflow-hidden rounded-[38px] bg-gradient-to-b from-aluminum-light to-aluminum-dark shadow-[0_24px_60px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light"
          style={{
            backgroundImage: "url(/assets/ipod/noise.png)",
            backgroundSize: "cover",
          }}
        />

        <div className="pointer-events-none absolute inset-x-[8%] top-0 h-[3%] rounded-full bg-gradient-to-b from-black/40 to-transparent blur-md" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[12%] rounded-full bg-gradient-to-t from-black/55 to-transparent blur-md" />
        <div
          className="pointer-events-none absolute left-[-6%] top-[4%] h-[96%] w-[12%] rounded-full blur-md"
          style={{
            backgroundImage: "url(/assets/ipod/shadow-left.png)",
            backgroundSize: "cover",
          }}
        />
        <div
          className="pointer-events-none absolute right-[-5%] top-[4%] h-[96%] w-[11%] rounded-full blur-md"
          style={{
            backgroundImage: "url(/assets/ipod/shadow-right.png)",
            backgroundSize: "cover",
          }}
        />

        <div className="relative px-[8%] pb-[10%] pt-[6.5%]">
          <div className="screen-frame relative overflow-hidden rounded-[8px] border-[6px] border-solid border-bezel bg-white">
            <div className="relative aspect-[318/242] w-full bg-white">
              <StatusBar
                title={statusTitle}
                showPlaying={showPlaying}
                onBack={onBack}
              />
              <div className="absolute inset-x-0 bottom-0 top-[8.5cqi] overflow-hidden">
                {children}
              </div>
              {overlay}
            </div>
          </div>

          <ClickWheel
            opacity={1}
            onMenu={onMenu}
            onPrev={onPrev}
            onNext={onNext}
            onPlay={onPlay}
            onSelect={onSelect}
          />
        </div>
      </div>
    </div>
  );
}
