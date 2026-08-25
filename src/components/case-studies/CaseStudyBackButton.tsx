"use client";

import { ArrowLeft } from "lucide-react";

type CaseStudyBackButtonProps = {
  onClick: () => void;
};

export function CaseStudyBackButton({ onClick }: CaseStudyBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed top-8 left-8 z-50 flex items-center gap-1 rounded-2xl bg-black/[0.06] px-2 py-1 font-sans text-[16px] leading-[28.5px] text-black backdrop-blur-md transition-colors hover:bg-black/10"
    >
      <ArrowLeft className="size-6" strokeWidth={1.5} aria-hidden />
      Back
    </button>
  );
}
