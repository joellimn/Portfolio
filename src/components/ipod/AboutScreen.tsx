"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, type RefObject } from "react";

type AboutScreenProps = {
  scrollRef?: RefObject<HTMLDivElement | null>;
  /** Fired when the user keeps scrolling up while already at the top —
   * carries the gesture back into the Cover Flow. */
  onScrollBack?: () => void;
};

// TODO: swap these for your real contact details / hosted resume.
const CONTACT_LINKS = [
  { label: "Email", href: "mailto:hello@joellim.design" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/joel-lim" },
  { label: "Resume", href: "/assets/about/resume.pdf" },
];

export function AboutScreen({ scrollRef, onScrollBack }: AboutScreenProps) {
  const elRef = useRef<HTMLDivElement | null>(null);

  // Keep our own handle to the scroll node while also forwarding it to
  // the caller's ref — done via a ref callback (commit phase), not a
  // direct `.current` write during render.
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      elRef.current = node;
      if (scrollRef) scrollRef.current = node;
    },
    [scrollRef],
  );

  const onScrollBackRef = useRef(onScrollBack);
  useEffect(() => {
    onScrollBackRef.current = onScrollBack;
  }, [onScrollBack]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let accumulator = 0;
    let lastTime = Date.now();

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      // Only an upward scroll while already at the very top should
      // carry the gesture back — anything else is normal scrolling.
      if (el.scrollTop > 1 || event.deltaY >= 0) {
        accumulator = 0;
        return;
      }

      const now = Date.now();
      if (now - lastTime > 200) accumulator = 0;
      lastTime = now;
      accumulator += event.deltaY;

      if (accumulator < -140) {
        event.preventDefault();
        onScrollBackRef.current?.();
        accumulator = 0;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div ref={setRef} className="h-full overflow-y-auto overscroll-contain">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-[3cqi] px-[4.5cqi] py-[3.5cqi]">
        <div className="flex items-start gap-[3.5cqi]">
          <div className="flex flex-1 flex-col gap-[1.4cqi]">
            <h1 className="text-[clamp(13px,4.2cqi,20px)] font-bold tracking-tight text-black">
              Nice to meet you, I&rsquo;m Joel!
            </h1>
            <p className="text-[clamp(9.5px,2.4cqi,13px)] font-light leading-relaxed text-black/70">
              I am a Student at Vanderbilt University from Memphis Tennessee.
              Growing up, I was constantly surrounded by design since my father
              was an interior designer. That early exposure sparked my own
              passion for creativity and problem-solving through design. Apart
              from design, I also love soccer, cooking, and playing guitar!
            </p>
          </div>
          <div className="relative aspect-[338/368] w-[30%] max-w-[180px] shrink-0 overflow-hidden rounded-[10px] shadow-md">
            <Image
              src="/assets/about/joel-photo.jpg"
              alt="Joel Lim"
              fill
              className="object-cover"
              sizes="180px"
              unoptimized
              priority
            />
          </div>
        </div>

        <div className="flex flex-col gap-[1.8cqi] border-t border-black/10 pt-[2.6cqi]">
          <div className="flex items-start justify-between gap-[2cqi]">
            <div>
              <p className="text-[clamp(11px,3cqi,16px)] font-bold text-black">
                End of the track.
              </p>
              <p className="mt-[0.4cqi] text-[clamp(9px,2.2cqi,12px)] text-black/60">
                Ready to start a new project together?
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-[0.3cqi]">
              <p className="text-[clamp(9px,2.2cqi,12px)] font-bold text-black">
                Contact
              </p>
              <ul className="flex flex-col items-end gap-[0.2cqi]">
                {CONTACT_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      className="text-[clamp(9px,2.2cqi,12px)] text-black/70 underline-offset-2 hover:text-accent-blue hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="pb-[0.5cqi] text-center text-[clamp(8px,1.9cqi,11px)] text-black/35">
            Scroll up to return to Cover Flow
          </p>
        </div>
      </div>
    </div>
  );
}
