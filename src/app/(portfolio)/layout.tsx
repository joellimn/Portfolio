import { PortfolioExperience } from "@/components/portfolio/PortfolioExperience";

/**
 * Portfolio routes share this layout so Menu / Works / About / case studies
 * keep one mounted experience — URL changes won't remount the iPod zoom.
 */
export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white">
      <PortfolioExperience />
      {children}
    </main>
  );
}
