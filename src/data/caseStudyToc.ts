export type TocItem = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

/** V4 gutter labels, taken from the case-study frames. */
export const CASE_STUDY_TOC: Record<string, TocItem[]> = {
  soar: [
    { id: "problem", label: "Problem" },
    { id: "goal", label: "Goal" },
    { id: "design", label: "Design" },
    { id: "process", label: "Process" },
    { id: "impact", label: "Impact" },
    { id: "takeaways", label: "Takeaways" },
  ],
  wearitt: [
    { id: "problem", label: "Problem" },
    { id: "goal", label: "Goal" },
    { id: "process", label: "Process" },
    { id: "design-language", label: "Design Language" },
    { id: "components", label: "Components" },
    { id: "result", label: "Result" },
    { id: "challenges", label: "Challenges" },
    { id: "takeaways", label: "Takeaways" },
  ],
  wttin: [
    { id: "problem", label: "Problem" },
    { id: "goal", label: "Goal" },
    { id: "design", label: "Design" },
    { id: "challenges", label: "Challenges" },
    { id: "takeaways", label: "Takeaways" },
  ],
  umg: [
    { id: "problem", label: "Problem" },
    { id: "goal", label: "Goal" },
    { id: "process", label: "Process" },
    { id: "design", label: "Design" },
    { id: "impact", label: "Impact" },
    { id: "takeaways", label: "Takeaways" },
  ],
};
