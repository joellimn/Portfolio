"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/data/projects";
import { CaseStudyView } from "@/components/ipod/CaseStudyView";

export function CaseStudyPage({ project }: { project: Project }) {
  const router = useRouter();
  const onReturn = () => router.push("/");

  return (
    <div className="min-h-full bg-white">
      <button
        type="button"
        onClick={onReturn}
        className="fixed top-8 left-8 z-50 inline-flex items-center gap-1 text-[16px] leading-[27.5px] text-black/50 transition-colors hover:text-black lg:hidden"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden />
        Home
      </button>
      <CaseStudyView project={project} onReturn={onReturn} />
    </div>
  );
}
