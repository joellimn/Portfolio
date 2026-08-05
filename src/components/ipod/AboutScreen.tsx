"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
type AboutScreenProps = {
  scrollRef?: RefObject<HTMLDivElement | null>;
  /** Fired when the user keeps scrolling up while already at the top —
   * carries the gesture back into the Cover Flow. */
  onScrollBack?: () => void;
};

const EMAIL = "joel.c.lim@vanderbilt.edu";

type ContactLink =
  | { label: "Email"; action: "copy"; value: string }
  | { label: "LinkedIn"; action: "external"; href: string }
  | { label: "Resume"; action: "external"; href: string };

// TODO: keep in sync with NavigationDrawer contact entries.
const CONTACT_LINKS: ContactLink[] = [
  { label: "Email", action: "copy", value: EMAIL },
  {
    label: "LinkedIn",
    action: "external",
    href: "https://www.linkedin.com/in/joelchaelim/",
  },
  {
    label: "Resume",
    action: "external",
    href: "https://drive.google.com/file/d/1CnOXT6j9lh1PY3xZLCoUdvbnxyD5iYKv/view?usp=sharing",
  },
];

export function AboutScreen({ scrollRef, onScrollBack }: AboutScreenProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

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

  const copyEmail = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setEmailCopied(true);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setEmailCopied(false), 1600);
  };

  return (
    <div ref={setRef} className="h-full overflow-y-auto overscroll-contain">
      {/* Snapshot 5: bio fills the screen; footer sits on the bottom rule. */}
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col justify-start px-[max(28px,6.2cqi)] pb-[3cqi] pt-[max(18px,4cqi)]">
          <div className="flex items-start gap-[max(16px,3.5cqi)]">
            <div className="flex min-w-0 flex-1 flex-col gap-[1.2cqi]">
              <h1 className="text-[clamp(14px,2.85cqi,32px)] font-bold tracking-tight text-black">
                Nice to meet you, I&rsquo;m Joel!
              </h1>
              <p className="max-w-[36em] text-[clamp(11px,2.1cqi,24px)] font-light leading-[1.35] text-black">
                I am a Student at Vanderbilt University from Memphis Tennessee.
                Growing up, I was constantly surrounded by design since my
                father was an interior designer. That early exposure sparked my
                own passion for creativity and problem-solving through design.
                Apart from design, I also love soccer, cooking, and playing
                guitar!
              </p>
            </div>
            <div className="relative aspect-[338/368] w-[min(32%,354px)] max-w-[338px] shrink-0 overflow-hidden">
              <Image
                src="/assets/about/joel-photo.jpg"
                alt="Joel Lim"
                fill
                className="object-cover"
                sizes="338px"
                unoptimized
                priority
              />
            </div>
          </div>
        </div>

        <footer className="mt-auto shrink-0 border-t border-black/15 px-[max(28px,6.2cqi)] pb-[max(14px,2.2cqi)] pt-[max(16px,2.4cqi)]">
          <div className="flex items-center justify-between gap-[max(16px,4cqi)]">
            <div className="min-w-0 flex-1">
              <p className="text-[clamp(12px,2.1cqi,24px)] font-bold text-black">
                Thanks for tuning in.
              </p>
              <p className="mt-[0.6cqi] text-[clamp(10px,1.75cqi,20px)] text-black">
                Ready to start a new project together?
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-[0.15cqi]">
              <p className="px-[0.4cqi] py-[0.2cqi] text-[clamp(10px,1.75cqi,20px)] font-bold text-black">
                Contact
              </p>
              <ul className="flex flex-col items-stretch">
                {CONTACT_LINKS.map((link) => {
                  const rowClass =
                    "px-[0.4cqi] py-[0.35cqi] text-left text-[clamp(10px,1.75cqi,20px)] text-black transition-colors hover:text-accent-blue";

                  if (link.action === "copy") {
                    return (
                      <li key={link.label}>
                        <button
                          type="button"
                          onClick={() => copyEmail(link.value)}
                          className={rowClass}
                          aria-label={
                            emailCopied
                              ? "Email copied"
                              : `Copy ${link.value}`
                          }
                        >
                          {emailCopied ? "copied!" : link.label}
                        </button>
                      </li>
                    );
                  }

                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`block ${rowClass}`}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <p className="mt-[1.4cqi] pb-[0.5cqi] text-center text-[clamp(8px,1.9cqi,11px)] text-black/35">
            Scroll up to return to works
          </p>
        </footer>
      </div>
    </div>
  );
}
