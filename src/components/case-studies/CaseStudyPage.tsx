"use client";

import { useRouter } from "next/navigation";
import type { Project } from "@/data/projects";
import { CaseStudyView } from "@/components/ipod/CaseStudyView";
import { CaseStudyBackButton } from "@/components/case-studies/CaseStudyBackButton";

export function CaseStudyPage({ project }: { project: Project }) {
  const router = useRouter();
  const onReturn = () => router.push("/");

  return (
    <div className="min-h-full bg-white">
      <CaseStudyBackButton onClick={onReturn} />
      <CaseStudyView project={project} onReturn={onReturn} />
    </div>
  );
}
