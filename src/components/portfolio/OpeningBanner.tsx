import type { Ref } from "react";
import Link from "next/link";

export function PearlLogo({
  once = false,
  faded = false,
  markRef,
}: {
  once?: boolean;
  faded?: boolean;
  markRef?: Ref<HTMLSpanElement>;
}) {
  const onceClass = once ? " is-once" : "";

  return (
    <span
      ref={markRef}
      className={`opening-logo-wrap relative${faded ? " is-faded" : ""}`}
    >
      <span className={`opening-logo-glow${onceClass}`} aria-hidden />
      <span className="opening-logo">
        <span className="opening-logo-pearl" />
        <span className={`opening-logo-holo${onceClass}`} />
        <span className={`opening-logo-sheen${onceClass}`} />
        <span className="opening-logo-ink" />
      </span>
    </span>
  );
}

/** Full-bleed opening: Figma black field + mother-of-pearl logo, with a
 *  holographic CSS wash and a light that travels left to right. */
export function OpeningBanner() {
  return (
    <section
      aria-label="Opening"
      className="opening-banner relative flex min-h-svh items-center justify-center overflow-hidden bg-[#101010]"
    >
      <Link href="/" aria-label="Enter work">
        <PearlLogo />
      </Link>
    </section>
  );
}
