"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { OpeningScreen } from "@/components/portfolio/OpeningScreen";
import { PageFrame } from "@/components/portfolio/PageFrame";
import { SiteFooter } from "@/components/portfolio/SiteFooter";

/** Survives client navigations, resets on refresh — so a reload of `/`
 * still plays the intro, but About → Work does not. */
let openingPlayed = false;

export function WorkIntro({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [skip] = useState(() => openingPlayed || pathname !== "/");

  if (skip) {
    return <PageFrame>{children}</PageFrame>;
  }

  return (
    <OpeningScreen
      onLanded={() => {
        openingPlayed = true;
      }}
    >
      {children}
      <SiteFooter />
    </OpeningScreen>
  );
}
