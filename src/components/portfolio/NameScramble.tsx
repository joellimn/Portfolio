"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const LATIN = "Joel Lim";
const HANGUL = "임채건";
const HANGUL_POOL = "임채건김이박최정강조윤장한서유진";
const LATIN_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function randomFrom(pool: string) {
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function NameScramble() {
  const [text, setText] = useState(LATIN);
  const [width, setWidth] = useState<number | null>(null);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const measured = measureRef.current?.getBoundingClientRect().width;
      if (measured) setWidth(Math.ceil(measured) + 4);
    };

    measure();
    void document.fonts.ready.then(measure);

    const node = measureRef.current;
    if (!node) return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;

    const stop = () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const scrambleTo = (target: string, pool: string) => {
      stop();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setText(target);
        return;
      }

      let iteration = 0;

      intervalRef.current = window.setInterval(() => {
        setText(
          target
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) return char;
              return randomFrom(pool);
            })
            .join(""),
        );

        iteration += 1 / 3;

        if (iteration >= target.length) {
          setText(target);
          stop();
        }
      }, 32);
    };

    const enter = () => scrambleTo(HANGUL, HANGUL_POOL);
    const leave = () => scrambleTo(LATIN, LATIN_POOL);

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);

    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      stop();
    };
  }, []);

  const hangul = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/.test(text);

  return (
    <span
      ref={nodeRef}
      data-name-scramble
      className="relative inline-block text-center align-baseline whitespace-nowrap"
      style={{
        width: width ?? undefined,
        fontFamily: hangul ? "var(--font-hangul)" : undefined,
      }}
    >
      <span
        ref={measureRef}
        aria-hidden
        className="invisible absolute whitespace-pre"
      >
        {LATIN}
      </span>
      {text}
    </span>
  );
}
