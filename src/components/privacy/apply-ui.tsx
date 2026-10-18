import type { ReactNode } from "react";

import { PRIVACY_VISUALS, type PrivacyVisual } from "@/components/privacy/privacy-visuals";

export const applyInput =
  "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-navy transition placeholder:text-slate-400 focus:border-trust-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-trust-blue/15";

export function ApplyFrame({
  kicker,
  title,
  lead,
  steps,
  visual = "rights",
  children,
}: {
  kicker: string;
  title: string;
  lead: string;
  steps: string[];
  visual?: PrivacyVisual;
  children: ReactNode;
}) {
  const art = PRIVACY_VISUALS[visual];
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="overflow-hidden rounded-[28px] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] ring-1 ring-border lg:sticky lg:top-24">
        <div className="bg-[var(--pc-soft-blue)] px-4 pt-4">
          <img src={art.src} alt={art.alt} className={`w-full rounded-2xl bg-white ${art.fit === "contain" ? "h-52 object-contain p-2" : "h-44 object-cover"}`} />
        </div>
        <div className="p-6">
          <p className="text-[12px] font-bold tracking-wide text-[#0F766E]">{kicker}</p>
          <h2 className="mt-2 text-[22px] font-bold leading-snug text-navy">{title}</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">{lead}</p>
          <ol className="mt-5 space-y-3">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-[13px] leading-relaxed text-navy">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </aside>
      <div className="rounded-[28px] border border-border bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] md:p-8">
        {children}
      </div>
    </div>
  );
}

export function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
      <legend className="px-2 text-[13px] font-bold text-navy">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`block text-[13px] font-semibold text-navy ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
    </label>
  );
}
