import type { ReactNode } from "react";

import { PRIVACY_VISUALS, type PrivacyVisual } from "@/components/privacy/privacy-visuals";

type PrivacySubPageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  dark?: boolean;
  visual?: PrivacyVisual;
};

export function PrivacySubPageHeader({
  eyebrow,
  title,
  description,
  dark = false,
  visual,
}: PrivacySubPageHeaderProps) {
  const art = visual ? PRIVACY_VISUALS[visual] : null;

  return (
    <section
      className={
        dark
          ? "privacy-hero-dark border-b border-white/10 bg-gradient-to-br from-[var(--pc-navy)] via-[#0b2540] to-[#115e59] text-white"
          : "border-b border-[var(--pc-border)] bg-[var(--pc-soft-blue)]"
      }
    >
      <div
        className={`container-page py-12 md:py-16 ${
          art ? "grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]" : ""
        }`}
      >
        <div className="max-w-3xl">
          <div className={dark ? "pc-eyebrow !text-teal-300" : "pc-eyebrow"}>{eyebrow}</div>
          <h1 className={dark ? "mt-4 text-white" : "mt-4 text-navy"}>{title}</h1>
          {description ? (
            <p className={dark ? "privacy-desc mt-5 text-white/85" : "privacy-desc mt-5"}>{description}</p>
          ) : null}
        </div>
        {art ? (
          <div
            className={`overflow-hidden rounded-[28px] ${
              dark ? "bg-white shadow-[0_20px_50px_rgba(0,0,0,0.18)]" : "bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
            }`}
          >
            <img
              src={art.src}
              alt={art.alt}
              className={`w-full ${art.fit === "contain" ? "h-72 object-contain p-4 md:h-80" : "h-64 object-cover md:h-72"}`}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
