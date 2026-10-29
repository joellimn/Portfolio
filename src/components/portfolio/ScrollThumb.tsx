"use client";

import { useEffect, useRef } from "react";

const MARGIN = 2;
const MIN_THUMB = 40;
const HIDE_AFTER_MS = 400;
const ROOT_CLASS = "has-scroll-thumb";

type Scroller = {
  el: HTMLElement;
  events: HTMLElement | Window;
  view: () => number;
};

/**
 * Locomotive-style scrollbar: hidden at rest, shown while scrolling, dragging,
 * or hovering the right edge. `target="window"` tracks the page; otherwise it
 * tracks the scroll container it is rendered in.
 */
export function ScrollThumb({ target = "parent" }: { target?: "window" | "parent" }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    let scroller: Scroller;
    if (target === "window") {
      const root = document.scrollingElement as HTMLElement;
      root.classList.add(ROOT_CLASS);
      scroller = { el: root, events: window, view: () => window.innerHeight };
    } else {
      const parent = track.parentElement;
      if (!parent) return;
      scroller = { el: parent, events: parent, view: () => parent.clientHeight };
    }
    const { el } = scroller;

    let hideTimer = 0;
    let frame = 0;
    let dragging = false;
    let dragStartY = 0;
    let dragStartTop = 0;
    let lastSize = -1;

    const metrics = () => {
      const view = scroller.view();
      const room = view - MARGIN * 2;
      const size = Math.max(MIN_THUMB, (view / el.scrollHeight) * room);
      return { room, size, max: el.scrollHeight - view };
    };

    const place = () => {
      frame = 0;
      const { room, size, max } = metrics();
      track.hidden = max <= 1;
      if (max <= 1) return;
      const y = MARGIN + (el.scrollTop / max) * (room - size);
      if (size !== lastSize) {
        lastSize = size;
        thumb.style.height = `${size}px`;
      }
      thumb.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };

    const onScroll = () => {
      schedule();
      track.dataset.scrolling = "";
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        delete track.dataset.scrolling;
      }, HIDE_AFTER_MS);
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      track.dataset.dragging = "";
      dragStartY = event.clientY;
      dragStartTop = el.scrollTop;
      thumb.setPointerCapture(event.pointerId);
      event.preventDefault();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const { room, size, max } = metrics();
      el.scrollTo({
        top: dragStartTop + ((event.clientY - dragStartY) * max) / Math.max(1, room - size),
        behavior: "instant",
      });
    };

    const onPointerUp = () => {
      dragging = false;
      delete track.dataset.dragging;
    };

    place();
    const resize = new ResizeObserver(schedule);
    resize.observe(target === "window" ? document.body : el);
    if (target !== "window" && el.firstElementChild) {
      resize.observe(el.firstElementChild);
    }

    scroller.events.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    thumb.addEventListener("pointerdown", onPointerDown);
    thumb.addEventListener("pointermove", onPointerMove);
    thumb.addEventListener("pointerup", onPointerUp);
    thumb.addEventListener("pointercancel", onPointerUp);

    return () => {
      if (target === "window") el.classList.remove(ROOT_CLASS);
      window.clearTimeout(hideTimer);
      cancelAnimationFrame(frame);
      resize.disconnect();
      scroller.events.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      thumb.removeEventListener("pointerdown", onPointerDown);
      thumb.removeEventListener("pointermove", onPointerMove);
      thumb.removeEventListener("pointerup", onPointerUp);
      thumb.removeEventListener("pointercancel", onPointerUp);
    };
  }, [target]);

  return (
    <div ref={trackRef} aria-hidden className="scroll-thumb">
      <div ref={thumbRef} className="scroll-thumb-bar" />
    </div>
  );
}
