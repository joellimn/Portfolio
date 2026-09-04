import type { Metadata } from "next";
import { OpeningScreen } from "@/components/portfolio/OpeningScreen";
import { SiteFooter } from "@/components/portfolio/SiteFooter";
import { WorkBody } from "@/components/portfolio/WorkPage";

export const metadata: Metadata = {
  title: "Opening — Joel Lim",
};

export default function OpeningPage() {
  return (
    <OpeningScreen>
      <WorkBody />
      <SiteFooter />
    </OpeningScreen>
  );
}
