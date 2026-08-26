import { ArrowUpRight } from "lucide-react";

/** `external` adds the redirect arrow, marking targets that leave the site. */
export type CursorHint = { label: string; external?: boolean };

type CaseStudyCursorProps = {
  x: number;
  y: number;
  hint?: CursorHint | null;
};

const CURSOR_PURPLE = "#7C3AED";

export function CaseStudyCursor({ x, y, hint = null }: CaseStudyCursorProps) {
  const showLabel = Boolean(hint);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      <span
        className={`block rounded-full transition-opacity duration-150 ${
          showLabel ? "size-0 opacity-0" : "size-4 opacity-100"
        }`}
        style={{ backgroundColor: CURSOR_PURPLE }}
      />
      <span
        className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[3px] rounded-full px-3 py-1 font-sans text-[15px] leading-[18px] tracking-[-0.75px] whitespace-nowrap text-white transition-[opacity,transform] duration-200 ease-out ${
          showLabel ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
        style={{ backgroundColor: CURSOR_PURPLE }}
      >
        {hint?.label ?? ""}
        {hint?.external ? (
          <ArrowUpRight className="size-[14px] shrink-0" strokeWidth={2.5} />
        ) : null}
      </span>
    </div>
  );
}

const COVER_CARD = ".preserve-3d.will-change-transform";

function coverFromTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  if (target.closest(".is-dragging")) return null;

  const cover = target.closest(`.portfolio-coverflow ${COVER_CARD}`);
  return cover instanceof HTMLElement ? cover : null;
}

export function isCenterCoverTarget(target: EventTarget | null) {
  const cover = coverFromTarget(target);
  if (!cover) return false;

  const flow = cover.closest(".portfolio-coverflow");
  if (!flow) return false;

  let front: HTMLElement | null = null;
  let frontZ = -Infinity;
  flow.querySelectorAll(COVER_CARD).forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    const z = Number(getComputedStyle(el).zIndex);
    if (Number.isFinite(z) && z > frontZ) {
      frontZ = z;
      front = el;
    }
  });

  return cover === front;
}

export function getCursorHint(target: EventTarget | null): CursorHint | null {
  if (!(target instanceof Element)) return null;
  if (target.closest(".is-dragging")) return null;
  if (isCenterCoverTarget(target)) return { label: "view case study" };
  if (coverFromTarget(target)) return { label: "view" };

  const labeled = target.closest("[data-cursor]");
  if (!(labeled instanceof HTMLElement)) return null;

  switch (labeled.dataset.cursor) {
    case "click":
      return { label: "click!" };
    case "copy":
      return {
        label: labeled.dataset.copied === "true" ? "copied!" : "copy",
      };
    case "view":
      return { label: "view" };
    case "external":
      return { label: "view", external: true };
    default:
      return null;
  }
}
