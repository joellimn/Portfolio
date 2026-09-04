"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { ArrowLeft } from "lucide-react";
import type { TocItem } from "@/data/caseStudyToc";

function collectIds(items: TocItem[]) {
  return items.flatMap((item) => [
    item.id,
    ...(item.children?.map((child) => child.id) ?? []),
  ]);
}

/** Sticky gutter from the V4 frames: 180px, 16/27.5, current section in black
 * and the rest at 50%. Observes the fullscreen case-study sheet, not window. */
export function CaseStudyToc({
  items,
  onHome,
}: {
  items: TocItem[];
  onHome?: () => void;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const ids = collectIds(items);
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (!nodes.length) return;

    const root = nodes[0]?.closest('[role="dialog"]') ?? null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        const next = visible[0]?.target.id;
        if (next) setActive(next);
      },
      { root, rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setActive(id);
    const node = document.getElementById(id);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="On this page"
      className="sticky top-0 hidden w-[180px] shrink-0 self-start px-5 py-4 lg:block"
    >
      {onHome ? (
        <button
          type="button"
          onClick={onHome}
          className="mb-4 inline-flex items-center gap-1 text-left text-[16px] leading-[27.5px] text-black/50 transition-colors hover:text-black"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden />
          Home
        </button>
      ) : null}
      {items.map((item) => {
        const current =
          active === item.id ||
          item.children?.some((child) => child.id === active);
        return (
          <div key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => goTo(event, item.id)}
              className={`block text-[16px] leading-[27.5px] transition-colors ${
                current ? "text-black" : "text-black/50 hover:text-black"
              }`}
            >
              {item.label}
            </a>
            {item.children && current ? (
              <div className="flex flex-col pb-1 pl-3">
                {item.children.map((child) => (
                  <a
                    key={child.id}
                    href={`#${child.id}`}
                    onClick={(event) => goTo(event, child.id)}
                    className={`block text-[13px] leading-[22px] transition-colors ${
                      active === child.id
                        ? "text-black"
                        : "text-black/40 hover:text-black"
                    }`}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

export function CaseStudyBody({
  items,
  onHome,
  children,
}: {
  items: TocItem[];
  onHome?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] items-start">
      <CaseStudyToc items={items} onHome={onHome} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
