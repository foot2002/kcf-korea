import type { ReactNode } from "react";

type PrivacySubPageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  dark?: boolean;
};

export function PrivacySubPageHeader({
  eyebrow,
  title,
  description,
  dark = false,
}: PrivacySubPageHeaderProps) {
  return (
    <section
      className={
        dark
          ? "privacy-hero-dark bg-gradient-to-br from-[var(--pc-navy)] via-[#0b2540] to-[#1e40af] text-white border-b border-white/10"
          : "bg-[var(--pc-soft-blue)] border-b border-[var(--pc-border)]"
      }
    >
      <div className="container-page py-14 md:py-16">
        <div className="max-w-3xl">
          <div className={dark ? "pc-eyebrow !text-teal-300" : "pc-eyebrow"}>{eyebrow}</div>
          <h1 className={dark ? "mt-4 text-white" : "mt-4 text-navy"}>{title}</h1>
          {description ? (
            <p
              className={
                dark
                  ? "privacy-desc mt-5 text-white/85"
                  : "privacy-desc mt-5"
              }
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
