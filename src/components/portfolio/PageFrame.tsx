import type { ReactNode } from "react";
import { SiteFooter } from "@/components/portfolio/SiteFooter";
import { TopBar } from "@/components/portfolio/TopBar";

/** Shared chrome for the three pages. The 32px rhythm between top bar, content
 * and footer is the same gap the V4 frames use throughout. The frame is fluid:
 * the 1200px Figma width is the reference, not a cap. */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-[32px]">
      <TopBar />
      {children}
      <SiteFooter />
    </div>
  );
}
