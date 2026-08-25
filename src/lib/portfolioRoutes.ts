import { projects } from "@/data/projects";

export type PortfolioScreen = "hero" | "projects" | "about" | "reading";

export type PortfolioRoute = {
  screen: PortfolioScreen;
  /** Set when screen is "reading". */
  projectIndex: number;
};

function isCaseStudyId(id: string) {
  return projects.some((project) => project.id === id);
}

export function pathForRoute(route: PortfolioRoute): string {
  switch (route.screen) {
    case "hero":
      return "/";
    case "projects":
      return "/#works";
    case "about":
      return "/#about";
    case "reading": {
      const id = projects[route.projectIndex]?.id;
      return id ? `/${id}` : "/#works";
    }
    default:
      return "/";
  }
}

export function routeFromPath(pathname: string): PortfolioRoute {
  const id = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  if (id && isCaseStudyId(id)) {
    return {
      screen: "reading",
      projectIndex: projects.findIndex((project) => project.id === id),
    };
  }
  return { screen: "hero", projectIndex: 0 };
}

/** Menu ↔ Works uses replace so zoom doesn't spam history. */
export function shouldReplaceHistory(
  fromPath: string,
  toPath: string,
): boolean {
  if (fromPath === toPath) return true;

  const fromMenuWorks = fromPath === "/" || fromPath === "/#works";
  const toMenuWorks = toPath === "/" || toPath === "/#works";
  if (fromMenuWorks && toMenuWorks) return true;

  const fromId = fromPath.replace(/^\/+/, "").replace(/\/+$/, "");
  const toId = toPath.replace(/^\/+/, "").replace(/\/+$/, "");
  if (isCaseStudyId(fromId) && isCaseStudyId(toId)) {
    return true;
  }

  if (toPath === "/#works" && (fromPath === "/#about" || isCaseStudyId(fromId))) {
    return true;
  }

  return false;
}
