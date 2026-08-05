import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export default function CaseStudyPage() {
  return null;
}
