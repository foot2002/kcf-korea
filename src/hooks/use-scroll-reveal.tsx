import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Adds a section-level entrance effect to the first block under each section.
 * The hidden state applies only after `html.js-reveal` is set, so prerender
 * HTML stays visible before JavaScript runs.
 */
export function useScrollReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("js-reveal");

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
      main.querySelectorAll("section").forEach((section) => {
        const first = section.firstElementChild;
        if (first) tagReveal(first);
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
