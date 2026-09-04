"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/portfolio/Wordmark";
import { projects } from "@/data/projects";

const LINKS = [
  { href: "/", label: "Work" },
  { href: "/listening-room", label: "Listening room" },
  { href: "/about", label: "About" },
] as const;

/** Case studies live at `/{slug}` and read as part of Work, so the Work link
 * stays lit while one is open. */
function isWork(pathname: string) {
  return (
    pathname === "/" || projects.some((project) => pathname === `/${project.id}`)
  );
}

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-2 sm:px-4">
      <Link
        href="/"
        aria-label="Joel Lim"
        className="p-3 text-black sm:p-4"
      >
        <Wordmark className="w-[63px]" />
      </Link>
      <nav aria-label="Pages" className="flex items-center">
        {LINKS.map(({ href, label }) => {
          const active = href === "/" ? isWork(pathname) : pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`p-3 text-[16px] leading-[24px] tracking-[-1px] transition-colors sm:p-4 ${
                active ? "text-black" : "text-black/50 hover:text-black"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
