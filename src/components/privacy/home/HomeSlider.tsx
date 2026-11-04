import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { SitePathLink } from "@/components/site/SitePathLink";
import { HOME_UI, SLIDES, type HomeSlide } from "@/data/privacy-home";

const INTERVAL_MS = 6000;

export type { HomeSlide };

type SliderLabels = {
  carouselLabel: string;
  prevSlide: string;
  nextSlide: string;
  pause: string;
  play: string;
  markAlt: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function imageProps(priority: boolean) {
  return priority ? ({ fetchPriority: "high" } as const) : ({ loading: "lazy" } as const);
}

function SlideTitle({ title }: { title: string }) {
  const lines = title.split("\n");
  return (
    <h1 className="hero-slider-title">
      {lines.map((line, lineIndex) => (
        <span key={`${lineIndex}-${line}`}>
          {lineIndex > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </h1>
  );
}

function SlideCopy({ slide }: { slide: HomeSlide }) {
  return (
    <div className="hero-copy">
      <p className={`hero-eyebrow hero-eyebrow-${slide.eyebrowTone ?? "teal"}`}>{slide.eyebrow}</p>
      <SlideTitle title={slide.title} />
      <p className="hero-slider-body">{slide.body}</p>
      {slide.stats ? (
        <ul className="hero-stats">
          {slide.stats.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="hero-actions">
        <SitePathLink to={slide.primary.to} hash={slide.primary.hash} className="hero-btn hero-btn-primary">
          {slide.primary.label}
        </SitePathLink>
        {slide.secondary ? (
          <SitePathLink to={slide.secondary.to} hash={slide.secondary.hash} className="hero-btn hero-btn-secondary">
            {slide.secondary.label}
          </SitePathLink>
        ) : null}
      </div>
    </div>
  );
}

function VisualMedia({ slide, priority, markAlt }: { slide: HomeSlide; priority: boolean; markAlt: string }) {
  if (!slide.visual) return null;
  return (
    <div className="hero-visual-media">
      <div className="hero-visual-frame">
        <img src={slide.visual} alt="" className="hero-visual-img" {...imageProps(priority)} />
        {slide.chips ? (
          <ul className="hero-chips">
            {slide.chips.map((chip, chipIndex) => (
              <li key={chip} className={chipIndex === 0 ? "hero-chip hero-chip-light" : "hero-chip hero-chip-teal"}>
                {chip}
              </li>
            ))}
          </ul>
        ) : null}
        {slide.mark ? (
          <img
            src={`${import.meta.env.BASE_URL}downloads/sure-mark.png`}
            alt={markAlt}
            className="hero-mark"
            {...imageProps(priority)}
          />
        ) : null}
      </div>
    </div>
  );
}

function SplitMedia({ slide, priority }: { slide: HomeSlide; priority: boolean }) {
  const art = Boolean(slide.visual) && !slide.photo;
  return (
    <div className={art ? "hero-split-media is-art" : "hero-split-media"}>
      {slide.photo ? <img src={slide.photo} alt="" className="hero-photo" {...imageProps(priority)} /> : null}
      {art && slide.visual ? <img src={slide.visual} alt="" className="hero-art" {...imageProps(priority)} /> : null}
      {slide.figures ? (
        <ul className="hero-figures">
          {slide.figures.map((figure) => (
            <li key={figure.label} className={figure.inverse ? "hero-figure is-inverse" : "hero-figure"}>
              <strong>{figure.value}</strong>
              <span>{figure.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function HomeSlider({
  slides = SLIDES,
  labels = HOME_UI,
  variant = "privacy",
}: {
  slides?: readonly HomeSlide[];
  labels?: SliderLabels;
  variant?: "privacy" | "foundation";
} = {}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
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
      className="hero-slider privacy-hero-dark"
      data-slider-frame
      data-variant={variant}
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
      <div className="hero-slider-stage">
        {slides.map((slide, itemIndex) => {
          const active = itemIndex === index;
          const priority = itemIndex === 0;
          const panel = slide.panel === "teal" ? "#0F766E" : "#0B3A6E";
          return (
            <div
              key={slide.id}
              className={`hero-slide${active ? " is-active" : ""}${slide.layout === "split" ? " hero-split" : ""}${slide.panel === "teal" ? " is-teal" : ""}`}
              style={slide.layout === "split" ? ({ "--hero-panel": panel } as React.CSSProperties) : undefined}
              aria-hidden={active ? undefined : true}
              inert={active ? undefined : true}
              aria-roledescription={active ? "slide" : undefined}
              aria-label={active ? `${itemIndex + 1} / ${total}` : undefined}
            >
              {slide.layout === "split" ? (
                <>
                  <div className="hero-split-copy">
                    <div className="hero-split-inner">
                      <SlideCopy slide={slide} />
                    </div>
                  </div>
                  <SplitMedia slide={slide} priority={priority} />
                </>
              ) : (
                <div className="container-page hero-visual">
                  <SlideCopy slide={slide} />
                  <VisualMedia slide={slide} priority={priority} markAlt={labels.markAlt} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hero-slider-controls">
        <div className="container-page hero-slider-controls-inner">
          <p className="hero-counter" aria-hidden="true">
            {pad(index + 1)} / {pad(total)}
          </p>
          <button type="button" className="hero-ctrl" aria-label={labels.prevSlide} onClick={() => move(index - 1)}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="hero-ctrl"
            aria-label={stopped ? labels.play : labels.pause}
            aria-pressed={stopped}
            onClick={() => {
              if (!reduced) setPaused((current) => !current);
            }}
          >
            {stopped ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
          </button>
          <button type="button" className="hero-ctrl" aria-label={labels.nextSlide} onClick={() => move(index + 1)}>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="hero-progress" aria-hidden="true">
            <span style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
          <div className="hero-tabs">
            {slides.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                className={itemIndex === index ? "hero-tab is-active" : "hero-tab"}
                aria-label={`${itemIndex + 1}번 슬라이드: ${item.tab}`}
                aria-current={itemIndex === index ? "true" : undefined}
                onClick={() => move(itemIndex)}
              >
                <span className="hero-tab-bar" aria-hidden="true" />
                {item.tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
