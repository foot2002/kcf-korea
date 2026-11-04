import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { HomeIcon } from "@/components/privacy/home/icons";
import { SitePathLink } from "@/components/site/SitePathLink";
import { HOME_UI, SLIDES } from "@/data/privacy-home";

const INTERVAL_MS = 6000;

export type HomeSlide = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  stats?: readonly { value: string; label: string }[];
  badges?: readonly string[];
  image?: string;
  icon?: string;
  primary: { label: string; to: string; hash?: string };
  secondary?: { label: string; to: string; hash?: string };
};

type SliderLabels = {
  carouselLabel: string;
  prevSlide: string;
  nextSlide: string;
  pause: string;
  play: string;
  slideMove: string;
  markAlt: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function HomeSlider({
  slides = SLIDES as readonly HomeSlide[],
  labels = HOME_UI,
}: {
  slides?: readonly HomeSlide[];
  labels?: SliderLabels;
} = {}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const slide = slides[index] ?? slides[0];
  const total = slides.length;
  const stopped = paused || reduced;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || reduced) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [focused, hovered, paused, reduced, total]);

  function move(next: number) {
    setIndex((next + total) % total);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(index - 1);
    }
  }

  return (
    <section
      className="privacy-hero-dark bg-[#0B3A6E] text-white"
      aria-roledescription="carousel"
      aria-label={labels.carouselLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) setFocused(false);
      }}
      onKeyDown={onKeyDown}
    >
      <div className="container-page flex flex-col py-8 lg:min-h-[440px] lg:py-10">
        <div
          className="grid flex-1 items-center gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.65fr)]"
          aria-roledescription="slide"
          aria-label={`${index + 1} / ${total}`}
        >
          <div>
            <p className="inline-flex rounded-md bg-[#0F766E] px-2.5 py-1 text-[13px] font-bold text-white">
              {slide.eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-balance text-white">{slide.title}</h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white">{slide.body}</p>
            {slide.stats ? (
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {slide.stats.map((stat) => (
                  <li key={stat.label} className="rounded-lg border border-white px-3 py-3">
                    <p className="text-[22px] font-bold leading-none">{stat.value}</p>
                    <p className="mt-2 text-[13px] leading-snug text-white">{stat.label}</p>
                  </li>
                ))}
              </ul>
            ) : null}
            {slide.badges ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {slide.badges.map((badge) => (
                  <li key={badge} className="rounded-md border border-white px-2.5 py-1 text-[13px] font-semibold">
                    {badge}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <SitePathLink to={slide.primary.to} hash={slide.primary.hash} className="btn-hero-light">
                {slide.primary.label}
              </SitePathLink>
              {slide.secondary ? (
                <SitePathLink to={slide.secondary.to} hash={slide.secondary.hash} className="btn-hero-outline">
                  {slide.secondary.label}
                </SitePathLink>
              ) : null}
            </div>
          </div>
          {slide.image ? (
            <div className="hidden justify-center lg:flex">
              <div className="flex h-56 w-56 items-center justify-center rounded-lg bg-white p-6">
                <img
                  src={`${import.meta.env.BASE_URL}${slide.image}`}
                  alt={labels.markAlt}
                  className="max-h-full w-full object-contain"
                />
              </div>
            </div>
          ) : null}
          {slide.icon ? (
            <div className="hidden justify-center lg:flex" aria-hidden="true">
              <HomeIcon name={slide.icon} className="h-40 w-40 stroke-[1.25] text-white/35" />
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white text-white hover:bg-white/10"
            aria-label={labels.prevSlide}
            onClick={() => move(index - 1)}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white text-white hover:bg-white/10"
            aria-label={labels.nextSlide}
            onClick={() => move(index + 1)}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <p className="px-2 text-[14px] font-bold tabular-nums" aria-hidden="true">
            {pad(index + 1)} / {pad(total)}
          </p>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white text-white hover:bg-white/10"
            aria-label={stopped ? labels.play : labels.pause}
            aria-pressed={stopped}
            onClick={() => {
              if (!reduced) setPaused((current) => !current);
            }}
          >
            {stopped ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
          </button>
          <div className="ml-auto flex items-center gap-2">
            {slides.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                className={`h-3 w-3 rounded-full border border-white ${itemIndex === index ? "bg-white" : "bg-transparent"}`}
                aria-label={`${itemIndex + 1}${labels.slideMove}`}
                aria-current={itemIndex === index ? "true" : undefined}
                onClick={() => move(itemIndex)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
