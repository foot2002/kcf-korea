import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/* ── Section ── */

export function PcSection({
  id,
  children,
  variant = "default",
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  variant?: "default" | "white" | "soft" | "mint";
  className?: string;
}) {
  const bg =
    variant === "white"
      ? "bg-white"
      : variant === "soft"
        ? "bg-[var(--pc-soft-blue)]"
        : variant === "mint"
          ? "bg-[var(--pc-mint)]"
          : "";
  return (
    <section id={id} className={`pc-section scroll-mt-28 ${bg} ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function PcSectionHeader({
  eyebrow,
  title,
  description,
  center,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`${center ? "text-center mx-auto max-w-3xl" : "max-w-3xl"} ${className}`}>
      {eyebrow && (
        <div className={`pc-eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</div>
      )}
      <h2 className="pc-section-title text-navy">{title}</h2>
      {description && <p className="pc-body mt-4">{description}</p>}
    </div>
  );
}

/* ── Badge ── */

export function PcBadge({
  children,
  icon: Icon,
  variant = "default",
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "default" | "teal" | "gold" | "dark";
}) {
  const styles = {
    default: "border-[var(--pc-border)] bg-white text-trust-blue",
    teal: "border-teal-200 bg-[var(--pc-mint)] text-[var(--pc-teal)]",
    gold: "border-amber-200 bg-amber-50 text-amber-800",
    dark: "border-white/25 bg-white/10 text-white backdrop-blur",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12.5px] font-semibold ${styles[variant]}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      {children}
    </span>
  );
}

/* ── Cards ── */

export function PcCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={`pc-card ${hover ? "pc-card-hover" : ""} ${className}`}>{children}</div>
  );
}

export function PcMetricCard({
  label,
  value,
  desc,
  icon: Icon,
  accent = "blue",
}: {
  label: string;
  value: string;
  desc?: string;
  icon?: LucideIcon;
  accent?: "blue" | "teal" | "gold";
}) {
  const accentMap = {
    blue: "from-trust-blue to-[var(--pc-navy)]",
    teal: "from-[var(--pc-teal)] to-teal-700",
    gold: "from-amber-500 to-amber-700",
  };
  return (
    <PcCard className="flex h-full flex-col p-5 md:p-6">
      {Icon && (
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accentMap[accent]} text-white`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      )}
      <div className="mt-3 text-[11.5px] font-bold uppercase tracking-wider text-trust-blue">
        {label}
      </div>
      <div className="mt-1.5 text-[22px] font-bold leading-tight text-navy md:text-[24px]">
        {value}
      </div>
      {desc && <p className="mt-2 flex-1 text-[14px] leading-relaxed text-text-secondary">{desc}</p>}
    </PcCard>
  );
}

export function PcFeatureCard({
  title,
  desc,
  icon: Icon,
  href,
  hrefLabel = "자세히 보기",
}: {
  title: string;
  desc: string;
  icon: LucideIcon;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <PcCard className="flex h-full flex-col p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--pc-soft-blue)] text-trust-blue">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h3 className="pc-card-title mt-4">{title}</h3>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-text-secondary">{desc}</p>
      {href && (
        <Link
          to={href}
          className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-trust-blue hover:underline"
        >
          {hrefLabel} →
        </Link>
      )}
    </PcCard>
  );
}

export function PcAccentCard({
  title,
  desc,
  icon: Icon,
  highlight,
}: {
  title: string;
  desc: string;
  icon?: LucideIcon;
  highlight?: string;
}) {
  return (
    <div className="pc-accent-card flex h-full flex-col p-5 md:p-6">
      {Icon && (
        <Icon className="h-6 w-6 text-trust-blue opacity-80" strokeWidth={1.75} />
      )}
      {highlight && (
        <div className="mt-3 text-[20px] font-bold leading-snug text-navy md:text-[22px]">
          {highlight}
        </div>
      )}
      <h3 className={`${highlight ? "mt-2" : "mt-3"} text-[15px] font-bold text-navy`}>{title}</h3>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-text-secondary">{desc}</p>
    </div>
  );
}

/* ── CTA Band ── */

export function PcCtaBand({
  title,
  description,
  children,
  dark = true,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={
        dark
          ? "pc-cta-band-dark rounded-[1.75rem] p-8 md:p-10"
          : "pc-cta-band rounded-[1.75rem] p-8 md:p-10"
      }
    >
      <h2 className={`text-[22px] font-bold md:text-[26px] ${dark ? "text-white" : "text-navy"}`}>
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 max-w-2xl text-[15px] leading-relaxed md:text-[16px] ${dark ? "text-white/80" : "text-text-secondary"}`}
        >
          {description}
        </p>
      )}
      {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}

/* ── Mini Nav ── */

const DEFAULT_NAV = [
  { id: "background", label: "사업 배경" },
  { id: "summary", label: "핵심 혜택" },
  { id: "platform", label: "지원 도구" },
  { id: "support-details", label: "지원내용" },
  { id: "compare", label: "혜택 비교" },
  { id: "process", label: "신청 절차" },
  { id: "apply-form", label: "신청서" },
  { id: "faq", label: "FAQ" },
] as const;

export function PcMiniNav({ items = DEFAULT_NAV }: { items?: readonly { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActive(item.id);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  }

  return (
    <nav className="sticky-below-header z-40 border-b border-[var(--pc-border)] bg-white/95 backdrop-blur-md">
      <div className="container-page">
        <div className="flex gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className={[
                "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition",
                active === item.id
                  ? "bg-[var(--pc-navy)] text-white shadow-sm"
                  : "bg-[var(--pc-soft-blue)] text-text-secondary hover:text-navy",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ── Timeline ── */

export function PcTimeline({
  steps,
}: {
  steps: readonly { title: string; desc: string }[];
}) {
  return (
    <ol className="grid gap-0 md:grid-cols-5 md:gap-4">
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex gap-4 pb-8 md:flex-col md:pb-0 md:gap-0">
          {i < steps.length - 1 && (
            <div className="absolute left-[19px] top-10 hidden h-[calc(100%-2rem)] w-0.5 bg-trust-blue/20 md:left-1/2 md:top-5 md:block md:h-0.5 md:w-full md:-translate-x-1/2" />
          )}
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-trust-blue text-[14px] font-bold text-white md:mx-auto">
            {i + 1}
          </div>
          <div className="pt-0.5 md:mt-4 md:text-center">
            <div className="text-[15px] font-bold text-navy">{step.title}</div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-secondary">{step.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ── Comparison Table ── */

export type PcComparisonRow = {
  benefit: string;
  association: string;
  general: string;
  small: string;
};

export function PcComparisonTable({ rows }: { rows: readonly PcComparisonRow[] }) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-[1.25rem] border border-[var(--pc-border)] bg-white md:block">
        <table className="w-full min-w-[720px] text-left text-[14px]">
          <thead>
            <tr className="bg-[var(--pc-navy)] text-[12.5px] font-semibold text-white">
              <th className="px-5 py-4 rounded-tl-[1.25rem]">혜택 항목</th>
              <th className="px-5 py-4">협단체</th>
              <th className="px-5 py-4">일반 회원사</th>
              <th className="px-5 py-4 rounded-tr-[1.25rem]">소기업 회원사</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--pc-border)]">
            {rows.map((row) => (
              <tr key={row.benefit} className="hover:bg-[var(--pc-soft-blue)]/40 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-navy">{row.benefit}</td>
                <td className="px-5 py-3.5 text-text-secondary">
                  <CellValue value={row.association} />
                </td>
                <td className="px-5 py-3.5 text-text-secondary">
                  <CellValue value={row.general} />
                </td>
                <td className="px-5 py-3.5 text-text-secondary">
                  <CellValue value={row.small} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <PcCard key={row.benefit} hover={false} className="p-4">
            <div className="font-bold text-navy">{row.benefit}</div>
            <dl className="mt-3 space-y-2 text-[13px]">
              {(
                [
                  ["협단체", row.association],
                  ["일반 회원사", row.general],
                  ["소기업 회원사", row.small],
                ] as const
              ).map(([label, val]) => (
                <div key={label} className="flex justify-between gap-2">
                  <dt className="text-text-muted">{label}</dt>
                  <dd className="text-right text-text-secondary">
                    <CellValue value={val} />
                  </dd>
                </div>
              ))}
            </dl>
          </PcCard>
        ))}
      </div>
    </>
  );
}

function CellValue({ value }: { value: string }) {
  const positive = /가능|제공|무제한|적용|%/u.test(value);
  if (positive && !value.includes("별도")) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Check className="h-3.5 w-3.5 shrink-0 text-[var(--pc-teal)]" />
        <span className="font-medium text-navy">{value}</span>
      </span>
    );
  }
  return <span>{value}</span>;
}

/* ── Step badge list ── */

export function PcStepList({
  steps,
  accent = "blue",
}: {
  steps: readonly { step: number; title: string; desc: string }[];
  accent?: "blue" | "teal";
}) {
  const badge =
    accent === "teal"
      ? "bg-[var(--pc-teal)]"
      : "bg-trust-blue";
  return (
    <ol className="mt-4 space-y-3">
      {steps.map((s) => (
        <li key={s.step} className="flex gap-4 rounded-xl border border-[var(--pc-border)] bg-white p-4">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${badge} text-[12px] font-bold text-white`}
          >
            {s.step}
          </span>
          <div>
            <div className="text-[14px] font-bold text-navy">{s.title}</div>
            <p className="mt-1 text-[13.5px] leading-relaxed text-text-secondary">{s.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
