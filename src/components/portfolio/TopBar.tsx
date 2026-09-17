"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/portfolio/Wordmark";
import { RESUME } from "@/data/contact";
import { projects } from "@/data/projects";

const LINKS = [
  { href: "/", label: "Work" },
  { href: RESUME, label: "Resume", external: true },
  { href: "/about", label: "About" },
] as const;

const linkClass = (active: boolean) =>
  `p-3 text-[16px] leading-[24px] tracking-[-1px] transition-colors sm:p-4 ${
    active ? "text-black" : "text-black/50 hover:text-black"
  }`;

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
        {LINKS.map((item) => {
          if ("external" in item && item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="external"
                className={linkClass(false)}
              >
                {item.label}
              </a>
            );
          }

          const active =
            item.href === "/" ? isWork(pathname) : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={linkClass(active)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
