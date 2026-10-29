import type { Ref } from "react";
import { ArrowUpRight } from "lucide-react";

/** `external` adds the redirect arrow, marking targets that leave the site. */
export type CursorHint = { label: string; external?: boolean };

/** The cursor normally re-reads its hint on pointer movement. Fire this when
 * the target changes underneath a stationary pointer — a copy confirmation,
 * say — so the label flips on the click instead of the next move. */
const CURSOR_REFRESH_EVENT = "portfolio:cursor-refresh";

export function refreshCursorHint() {
  window.dispatchEvent(new Event(CURSOR_REFRESH_EVENT));
}

export function onCursorRefresh(listener: () => void) {
  window.addEventListener(CURSOR_REFRESH_EVENT, listener);
  return () => window.removeEventListener(CURSOR_REFRESH_EVENT, listener);
}

type CaseStudyCursorProps = {
  ref?: Ref<HTMLDivElement>;
  hint?: CursorHint | null;
};

const CURSOR_AMBER = "#D97706";
const MORPH =
  "transition-[opacity,scale] duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)]";

export function CaseStudyCursor({ ref, hint = null }: CaseStudyCursorProps) {
  const showLabel = Boolean(hint);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
    >
      <span
        className={`absolute top-0 left-0 block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${MORPH} ${
          showLabel ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ backgroundColor: CURSOR_AMBER }}
      />
      <span
        className={`absolute top-0 left-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[3px] rounded-full px-3 py-1 font-sans text-[15px] leading-[18px] tracking-[-0.75px] whitespace-nowrap text-white ${MORPH} ${
          showLabel ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        style={{ backgroundColor: CURSOR_AMBER }}
      >
        {hint?.label ?? ""}
        {hint?.external ? (
          <ArrowUpRight className="size-[14px] shrink-0" strokeWidth={1.5} />
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
  if (target.closest("[data-native-cursor]")) return null;
  if (target.closest(".is-dragging")) return null;
  if (isCenterCoverTarget(target)) return { label: "View Case Study" };
  if (coverFromTarget(target)) return { label: "view" };

  const labeled = target.closest("[data-cursor]");
  if (!(labeled instanceof HTMLElement)) return null;

  const custom = labeled.dataset.cursorLabel?.trim();
  if (custom) {
    return {
      label: custom,
      external: labeled.dataset.cursor === "external",
    };
  }

  switch (labeled.dataset.cursor) {
    case "click":
      return { label: "click!" };
    case "copy":
      return {
        label: labeled.dataset.copied === "true" ? "copied!" : "copy",
      };
    case "view":
      return { label: "view" };
    case "case-study":
      return { label: "View Case Study" };
    case "external":
      return { label: "view", external: true };
    default:
      return null;
  }
}
