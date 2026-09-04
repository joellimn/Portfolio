"use client";

import { useEffect, useState } from "react";
import { refreshCursorHint } from "@/components/portfolio/CaseStudyCursor";
import { EMAIL } from "@/data/contact";

/** Confirms on the click itself rather than waiting on the clipboard promise,
 * and takes it back only if the write actually fails. The label never changes —
 * the "copied!" confirmation lives on the custom cursor. */
export function useEmailCopy() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    refreshCursorHint();
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyEmail = () => {
    setCopied(true);
    const written = navigator.clipboard?.writeText(EMAIL);
    if (!written) {
      setCopied(false);
      window.location.href = `mailto:${EMAIL}`;
      return;
    }
    written.catch(() => {
      setCopied(false);
      window.location.href = `mailto:${EMAIL}`;
    });
  };

  return { copied, copyEmail };
}

/** Outbound link. The "view" affordance and its redirect arrow live entirely on
 * the custom cursor, so the label itself never changes. */
export function ExternalLink({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="external"
      className={className}
    >
      {label}
    </a>
  );
}
