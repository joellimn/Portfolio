import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { CaseStudyPage } from "@/components/case-studies/CaseStudyPage";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export default async function CaseStudySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  if (!project) notFound();
  return <CaseStudyPage project={project} />;
}
