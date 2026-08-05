import Image from "next/image";
import type { Project } from "@/data/projects";

type CoverArtProps = {
  project: Project;
  className?: string;
  priority?: boolean;
};

export function CoverArt({
  project,
  className = "",
  priority = false,
}: CoverArtProps) {
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <Image
        src={project.coverSrc}
        alt={`${project.title} cover`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 60vw, 400px"
        priority={priority}
        unoptimized
        draggable={false}
      />
    </div>
  );
}
