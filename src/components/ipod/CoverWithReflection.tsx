import type { Project } from "@/data/projects";
import { CoverArt } from "@/components/ipod/CoverArt";

type CoverWithReflectionProps = {
  project: Project;
  /** Extra classes on the outer column (e.g. width). */
  className?: string;
  priority?: boolean;
  /**
   * Static Y rotation for Now Playing–style heroes.
   * Cover Flow applies rotateY via motion on a parent instead — leave 0.
   */
  rotateY?: number;
  /** Dim overlay opacity for inactive Cover Flow cards (0–1). */
  dimOpacity?: number;
};

/**
 * Flat cover + floor reflection — same recipe as Cover Flow
 * (@ashishgogula/coverflow): short scaleY strip, slight rotateX, white fade.
 */
export function CoverWithReflection({
  project,
  className = "w-[30%] shrink-0",
  priority = false,
  rotateY = 0,
  dimOpacity = 0,
}: CoverWithReflectionProps) {
  return (
    <div className={className} style={{ perspective: 900 }}>
      {/* Reserve cover + ~42% reflection so following content doesn't cover it */}
      <div className="relative w-full" style={{ aspectRatio: "1 / 1.45" }}>
        <div
          className="absolute inset-x-0 top-0 aspect-square w-full"
          style={{
            transform: rotateY ? `rotateY(${rotateY}deg)` : undefined,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative size-full overflow-hidden border border-black/10 shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
            <CoverArt
              project={project}
              className="size-full"
              priority={priority}
            />
            {dimOpacity > 0 ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-black"
                style={{ opacity: dimOpacity }}
              />
            ) : null}
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute left-0 overflow-hidden"
            style={{
              top: "100%",
              width: "100%",
              height: "42%",
              marginTop: 1,
              transformOrigin: "top center",
              transform: "rotateX(12deg) translateZ(0)",
            }}
          >
            <div
              className="relative size-full"
              style={{
                transform: "scaleY(-1)",
                opacity: 0.5,
              }}
            >
              <CoverArt project={project} className="size-full" />
              {dimOpacity > 0 ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-black"
                  style={{ opacity: dimOpacity }}
                />
              ) : null}
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.78) 38%, rgba(255,255,255,0.2) 70%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
