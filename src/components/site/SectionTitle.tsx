import type { ReactNode } from "react";

export function SectionTitle({
  eyebrow,
  title,
  desc,
  align = "left",
  dark = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  desc?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <div className="label-eyebrow">{eyebrow}</div>}
      <h2 className={dark ? "text-white" : "text-navy"}>{title}</h2>
      {desc && (
        <p
          className={`mt-5 text-[17px] leading-relaxed ${
            dark ? "text-white/80" : "text-text-secondary"
          }`}
        >
          {desc}
        </p>
      )}
    </div>
  );
}
