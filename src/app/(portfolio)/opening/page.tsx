import type { Metadata } from "next";
import { OpeningBanner } from "@/components/portfolio/OpeningBanner";

export const metadata: Metadata = {
  title: "Opening — Joel Lim",
};

export default function OpeningPage() {
  return <OpeningBanner />;
}
