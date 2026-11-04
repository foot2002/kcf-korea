import cardConsulting from "@/assets/card-consulting.jpg";
import cardNbo from "@/assets/card-nbo.jpg";
import cardYouth from "@/assets/card-youth.jpg";
import heroFreePlatform from "@/assets/illustrations/hero-free-platform.svg";
import heroResearch from "@/assets/illustrations/hero-research.svg";
import heroWebinar from "@/assets/illustrations/hero-webinar.svg";
import { FOUNDATION_SLIDES } from "@/data/kcf";
import { SLIDES, type HomeSlide } from "@/data/privacy-home";
import { useSlides } from "@/lib/content/load";
import type { ContentSlide, SlideImageId } from "@/lib/content/types";

const IMAGES: Record<SlideImageId, { src: string; kind: "visual" | "photo" }> = {
  "hero-free-platform": { src: heroFreePlatform, kind: "visual" },
  "hero-research": { src: heroResearch, kind: "visual" },
  "hero-webinar": { src: heroWebinar, kind: "visual" },
  "foundation-consulting": { src: cardConsulting, kind: "photo" },
  "foundation-nbo": { src: cardNbo, kind: "photo" },
  "foundation-youth": { src: cardYouth, kind: "photo" },
};

export function toHomeSlides(items: ContentSlide[], area: "privacy" | "foundation", fallback: readonly HomeSlide[]): HomeSlide[] {
  const published = items.filter((item) => item.published && item.area === area).sort((a, b) => a.order - b.order);
  if (published.length === 0) return [...fallback];
  return published.map((item) => {
    const image = IMAGES[item.image] ?? IMAGES["hero-free-platform"];
    const [path, hash] = (item.buttonLink || "/").split("#");
    return {
      id: item.id,
      eyebrow: item.eyebrow,
      title: item.title,
      body: item.body,
      tab: item.eyebrow || item.title || "슬라이드",
      layout: image.kind === "photo" ? "split" : "visual",
      visual: image.kind === "visual" ? image.src : undefined,
      photo: image.kind === "photo" ? image.src : undefined,
      panel: area === "foundation" ? "navy" : undefined,
      eyebrowTone: area === "foundation" ? "navy" : "teal",
      primary: {
        label: item.buttonLabel || "자세히 보기",
        to: path.startsWith("/") || path.startsWith("http") ? path : "/",
        hash: hash || undefined,
      },
    };
  });
}

export function usePrivacySlides(): HomeSlide[] {
  return toHomeSlides(useSlides(), "privacy", SLIDES);
}

export function useFoundationSlides(): HomeSlide[] {
  return toHomeSlides(useSlides(), "foundation", FOUNDATION_SLIDES);
}
