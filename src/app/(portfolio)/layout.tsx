import { PortfolioCursorRoot } from "@/components/portfolio/PortfolioCursorRoot";
import { PortfolioShell } from "@/components/portfolio/PortfolioShell";

/**
 * Portfolio routes share this layout so homepage and case studies stay on
 * the same white page chrome — the iPod experience is no longer mounted.
 * Home stays mounted so a case study can slide over it.
 */
export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortfolioCursorRoot>
      <main className="min-h-screen bg-white">
        <PortfolioShell>{children}</PortfolioShell>
      </main>
    </PortfolioCursorRoot>
  );
}
