import { projects } from "@/data/projects";

export type PortfolioScreen = "hero" | "projects" | "about" | "reading";

export type PortfolioRoute = {
  screen: PortfolioScreen;
  /** Set when screen is "reading". */
  projectIndex: number;
};

export function pathForRoute(route: PortfolioRoute): string {
  switch (route.screen) {
    case "hero":
      return "/";
    case "projects":
      return "/works";
    case "about":
      return "/about";
    case "reading": {
      const id = projects[route.projectIndex]?.id;
      return id ? `/works/${id}` : "/works";
    }
    default:
      return "/";
  }
}

export function routeFromPath(pathname: string): PortfolioRoute {
  if (pathname === "/works") {
    return { screen: "projects", projectIndex: 0 };
  }
  if (pathname === "/about") {
    return { screen: "about", projectIndex: 0 };
  }
  const caseMatch = pathname.match(/^\/works\/([^/]+)\/?$/);
  if (caseMatch) {
    const index = projects.findIndex((project) => project.id === caseMatch[1]);
    if (index >= 0) {
      return { screen: "reading", projectIndex: index };
    }
    return { screen: "projects", projectIndex: 0 };
  }
  return { screen: "hero", projectIndex: 0 };
}

/** Menu ↔ Works uses replace so zoom doesn't spam history. */
export function shouldReplaceHistory(
  fromPath: string,
  toPath: string,
): boolean {
  if (fromPath === toPath) return true;

  const fromMenuWorks = fromPath === "/" || fromPath === "/works";
  const toMenuWorks = toPath === "/" || toPath === "/works";
  if (fromMenuWorks && toMenuWorks) return true;

  // Switching between case studies keeps a single history entry.
  if (fromPath.startsWith("/works/") && toPath.startsWith("/works/")) {
    return true;
  }

  // Closing About / case study back to Works.
  if (toPath === "/works" && (fromPath === "/about" || fromPath.startsWith("/works/"))) {
    return true;
  }

  return false;
}
