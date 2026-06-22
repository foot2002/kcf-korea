import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Auto-apply scroll-reveal animations to common page elements.
 * - Adds `.reveal` to sections, headings, cards, tables, lists, etc.
 * - Adds `.reveal-stagger` to grids of cards.
 * - Uses IntersectionObserver to toggle `.is-visible` when in viewport.
 * - Re-runs on route changes so newly mounted pages get animated too.
 */
export function useScrollReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const observed = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    const tagReveal = (el: Element) => {
      if (observed.has(el)) return;
      observed.add(el);
      if (
        !el.classList.contains("reveal") &&
        !el.classList.contains("reveal-stagger")
      ) {
        el.classList.add("reveal");
      }
      // If already in viewport on mount, mark visible immediately.
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        el.classList.add("is-visible");
        return;
      }
      observer.observe(el);
    };

    const apply = () => {
      const main = document.querySelector("main");
      if (!main) return;
      const selectors = [
        "section",
        "section > .container-page > *",
        ".kcf-card",
        "h1, h2, h3",
        "table",
        "[data-reveal]",
      ];
      const nodes = main.querySelectorAll<HTMLElement>(selectors.join(", "));
      nodes.forEach(tagReveal);

      // Auto-stagger grids of cards
      main
        .querySelectorAll<HTMLElement>(
          ".grid:not(.reveal-stagger):not([data-no-reveal])",
        )
        .forEach((grid) => {
          if (grid.children.length >= 2 && grid.children.length <= 12) {
            grid.classList.add("reveal-stagger");
            observed.add(grid);
            const rect = grid.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
              grid.classList.add("is-visible");
            } else {
              observer.observe(grid);
            }
          }
        });
    };

    // Defer until DOM is painted for the new route.
    raf = window.requestAnimationFrame(() => {
      apply();
      // Run again shortly after to catch lazily mounted children.
      window.setTimeout(apply, 250);
    });

    const mo = new MutationObserver(() => {
      window.requestAnimationFrame(apply);
    });
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(raf);
      mo.disconnect();
      observer.disconnect();
    };
  }, [pathname]);
}
