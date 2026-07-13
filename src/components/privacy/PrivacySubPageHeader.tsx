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
          ? "bg-gradient-to-br from-[#04101F] via-[#071529] to-[#0B2540] text-white border-b border-white/10"
          : "bg-[#F5F8FC] border-b border-[#E5E7EB]"
      }
    >
      <div className="container-page py-14 md:py-16">
        <div className="max-w-3xl">
          <div
            className={
              dark
                ? "label-eyebrow !text-[#5EEAD4]"
                : "label-eyebrow"
            }
          >
            {eyebrow}
          </div>
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
