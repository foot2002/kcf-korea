import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BarChart3, ChevronDown, ChevronRight, FileDown, FileText, Handshake, Info, KeyRound, PenLine, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { ApplyMethodTabs, CpoApplyForm, PledgeSubmitForm } from "@/components/forms/PublicForms";
import { PartnerLogoGrid } from "@/components/privacy/home/HomePartners";
import { FeatureSplit } from "@/components/site/FeatureSplit";
import illOrgAccount from "@/assets/illustrations/ill-org-account.svg";
import illPledge from "@/assets/illustrations/ill-pledge.svg";
import illScattered from "@/assets/illustrations/ill-scattered-data.svg";
import { usePledges } from "@/lib/content/load";
import { PcMiniNav } from "@/components/privacy/privacy-ui";
import {
  APPLY,
  ASSOCIATION_INTRO,
  AUDIT_POINTS,
  CASES,
  CASES_NOTE,
  CASE_STAT,
  CPO_SUPPORT,
  DISCLAIMER,
  DOWNLOADS,
  FEATURES,
  FREE_PLATFORM,
  FREE_PLATFORM_PAGE,
  GAP,
  HERO,
  INTRO,
  OFFER,
  REFERENCES,
  RULE,
  SURE_MARK_FOOTNOTE,
  VERIFIED,
} from "@/data/free-platform";
import { PLEDGE, PLEDGE_NUMERALS } from "@/data/privacy-pledge";
import { CERT_SYSTEMS, SERVICE_SELECTION_CRITERIA } from "@/data/privacy-program";
import { SURE_MARK } from "@/data/sure-mark";

function fileHref(file: string) {
  return `${import.meta.env.BASE_URL}${file}`;
}

function sectionLabel(id: (typeof FREE_PLATFORM_PAGE.nav)[number]["id"]) {
  return FREE_PLATFORM_PAGE.nav.find((item) => item.id === id)?.label ?? "";
}

function DisclaimerNote() {
  return (
    <p className="flex gap-2 text-[13px] leading-relaxed text-[#4B5563]">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{DISCLAIMER}</span>
    </p>
  );
}

function LabelValueTable({
  caption,
  rows,
  renderValue,
}: {
  caption: string;
  rows: readonly { label: string; value: string }[];
  renderValue?: (row: { label: string; value: string }) => ReactNode;
}) {
  const valueOf = (row: { label: string; value: string }) => (renderValue ? renderValue(row) : row.value);
  return (
    <div className="mt-6">
      <div className="hidden md:block">
        <table className="w-full border-collapse text-left text-[15px]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-navy text-white">
              <th scope="col" className="w-[28%] px-4 py-3 font-semibold">
                {FREE_PLATFORM_PAGE.tableLabel}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                {FREE_PLATFORM_PAGE.tableValue}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-[#D1D5DB] bg-white align-top">
                <th scope="row" className="px-4 py-3 font-semibold text-navy">
                  {row.label}
                </th>
                <td className="px-4 py-3 leading-relaxed text-[#111827]">{valueOf(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 md:hidden" aria-label={caption}>
        {rows.map((row) => (
          <li key={row.label} className="rounded-md border border-[#D1D5DB] bg-white p-4">
            <div className="text-[12px] font-bold text-[#0F766E]">{row.label}</div>
            <div className="mt-1 text-[15px] leading-relaxed text-[#111827]">{valueOf(row)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OfferMarkCell({ value }: { value: string }) {
  return (
    <div>
      <p>{value}</p>
      <p className="mt-3 flex flex-wrap items-center gap-3">
        <img src={fileHref(SURE_MARK.logo)} alt={FREE_PLATFORM_PAGE.markExampleAlt} className="h-8 w-auto" />
        <span className="text-[14px] font-semibold text-navy">{FREE_PLATFORM.poweredBy}</span>
      </p>
    </div>
  );
}

function PledgeBlock() {
  const pledges = usePledges().filter((item) => item.published && item.name.trim());
  const total = PLEDGE.items.length;
  const [checked, setChecked] = useState<boolean[]>(() => PLEDGE.items.map(() => false));
  const count = checked.filter(Boolean).length;
  const ready = count === total && total > 0;

  function toggle(index: number) {
    setChecked((current) => current.map((value, itemIndex) => (itemIndex === index ? !value : value)));
  }

  return (
    <div>
      <div className="rounded-md border border-[#D1D5DB] bg-[#F3F4F6] p-5">
        {PLEDGE.preamble.map((paragraph) => (
          <p key={paragraph} className="mt-3 text-[15px] leading-relaxed text-[#374151] first:mt-0">
            {paragraph}
          </p>
        ))}
      </div>

      <ol className="mt-6 grid gap-3">
        {PLEDGE.items.map((item, index) => {
          const inputId = `pledge-item-${index}`;
          const numeral = PLEDGE_NUMERALS[index] ?? String(index + 1);
          return (
            <li key={item.title} className="rounded-md border border-[#D1D5DB] bg-white p-5">
              <p className="text-[13px] font-bold text-[#0F766E]">{numeral}</p>
              <h3 className="mt-1 text-[17px] font-bold text-navy">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#374151]">{item.body}</p>
              <label htmlFor={inputId} className="mt-4 flex cursor-pointer items-start gap-3 text-[15px] text-[#111827]">
                <input
                  id={inputId}
                  type="checkbox"
                  checked={checked[index] ?? false}
                  onChange={() => toggle(index)}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#0B3A6E]"
                />
                <span>
                  {PLEDGE.checkLabel}
                  <span className="sr-only"> — {item.title}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ol>

      <div className="mt-6">
        <p id="pledge-progress" aria-live="polite" className="text-[15px] font-bold text-navy">
          {count} / {total} {FREE_PLATFORM_PAGE.pledgeProgressSuffix}
        </p>
        <div
          className="mt-2 h-2 overflow-hidden rounded-md bg-[#E5E7EB]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={count}
          aria-labelledby="pledge-progress"
        >
          <div className="h-full bg-[#0F766E]" style={{ width: `${total === 0 ? 0 : (count / total) * 100}%` }} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {ready ? (
          <a className="btn-primary-kcf" href={fileHref(PLEDGE.file)} download>
            <FileDown className="h-4 w-4" aria-hidden="true" />
            {FREE_PLATFORM_PAGE.pledgeDownload}
          </a>
        ) : (
          <button type="button" className="btn-primary-kcf opacity-50" disabled aria-describedby="pledge-lock-note">
            <FileDown className="h-4 w-4" aria-hidden="true" />
            {FREE_PLATFORM_PAGE.pledgeDownload}
          </button>
        )}
        <button type="button" className="btn-secondary-kcf" onClick={() => setChecked(PLEDGE.items.map(() => true))}>
          {FREE_PLATFORM_PAGE.pledgeCheckAll}
        </button>
        <p className="text-[14px] leading-relaxed text-[#374151]">{PLEDGE.signNote}</p>
      </div>
      {ready ? <PledgeSubmitForm /> : (
        <p id="pledge-lock-note" className="mt-3 text-[14px] leading-relaxed text-[#374151]">
          {FREE_PLATFORM_PAGE.pledgeLocked}
        </p>
      )}

      <div className="mt-10">
        <h3 className="text-[17px] font-bold text-navy">{FREE_PLATFORM_PAGE.pledgeOrgsTitle}</h3>
        {pledges.length > 0 ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {pledges.map((item) => (
              <li key={item.id} className="rounded-md border border-[#D1D5DB] bg-white px-4 py-3 text-[15px] text-[#111827]">
                <span className="font-semibold text-navy">{item.name}</span>
                {item.date ? <span className="mt-1 block text-[13px] text-[#374151]">{item.date}</span> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[15px] text-[#374151]">{FREE_PLATFORM_PAGE.pledgeOrgsEmpty}</p>
        )}
      </div>
    </div>
  );
}

export function SecurityServicesView() {
  const [moreCases, setMoreCases] = useState(false);
  const [criteriaOpen, setCriteriaOpen] = useState(false);
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#criteria" || hash === "#partners") setCriteriaOpen(true);
  }, []);
  return (
    <div className="min-w-0">
      <PcMiniNav items={FREE_PLATFORM_PAGE.nav} />

      <section id="about" className="scroll-mt-40 bg-white">
        <div className="container-page py-12 md:py-16">
          <p className="text-[13px] font-bold text-[#0F766E]">{sectionLabel("about")}</p>
          <div className="mt-4 rounded-md border border-[#D1D5DB] bg-[#E8EEF6] p-5 md:p-8">
            <h2 className="max-w-4xl text-[1.6rem] font-bold leading-snug text-navy md:text-[2rem]">{HERO.headline}</h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-3">
              {HERO.stats.map((stat) => (
                <li key={stat.value} className="rounded-md border border-[#D1D5DB] bg-white p-4">
                  <p className="text-[1.75rem] font-bold leading-none text-navy">{stat.value}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#111827]">{stat.label}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#apply-form" className="btn-primary-kcf">
                {FREE_PLATFORM_PAGE.aboutApply}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#pledge" className="btn-secondary-kcf">
                {FREE_PLATFORM_PAGE.aboutPledge}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <h3 className="mt-10 text-[1.35rem] font-bold text-navy">{INTRO.title}</h3>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[#374151]">{INTRO.body}</p>

          <ul className="mt-8 grid gap-3 lg:grid-cols-2">
            {CASES.map((item, index) => (
              <li
                key={item.title}
                className={`rounded-md border border-[#D1D5DB] bg-white p-5 ${
                  index >= 2 && !moreCases ? "max-md:hidden" : ""
                }`}
              >
                <p className="inline-flex rounded-md bg-[#E6F4F2] px-2 py-1 text-[12px] font-bold text-[#0F766E]">
                  {item.date}
                </p>
                <h3 className="mt-3 text-[17px] font-bold leading-snug text-navy">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#374151]">{item.summary}</p>
                <p className="mt-3 text-[13px] text-[#374151]">
                  {FREE_PLATFORM_PAGE.sourcePrefix}
                  {" · "}
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy underline">
                      {item.source}
                    </a>
                  ) : (
                    item.source
                  )}
                  {" · "}
                  {item.sourceDate}
                </p>
              </li>
            ))}
          </ul>
          {CASES.length > 2 ? (
            <button
              type="button"
              className="btn-secondary-kcf mt-4 md:hidden"
              aria-expanded={moreCases}
              onClick={() => setMoreCases((value) => !value)}
            >
              {moreCases ? "사례 접기" : "사례 더 보기"}
            </button>
          ) : null}

          <p className="mt-3 text-[13px] leading-relaxed text-[#4B5563]">{CASES_NOTE}</p>
          <div className="mt-4 rounded-md border border-[#D1D5DB] border-l-4 border-l-navy bg-white px-5 py-4">
            <p className="text-[1.75rem] font-bold text-navy">{CASE_STAT.value}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-[#111827]">{CASE_STAT.label}</p>
          </div>

          <div className="mt-10 rounded-md border border-[#D1D5DB] border-l-4 border-l-navy bg-white px-5 py-4">
            <h3 className="text-[1.2rem] font-bold text-navy">{RULE.title}</h3>
            <p className="mt-3 text-[13px] font-semibold text-[#374151]">{RULE.law}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-[#111827]">{RULE.text}</p>
          </div>

          <div className="mt-10">
            <h3 className="text-[1.2rem] font-bold text-navy">{AUDIT_POINTS.title}</h3>
            <ul className="mt-4 grid gap-3">
              {AUDIT_POINTS.points.map((point) => (
                <li key={point} className="rounded-md border border-[#D1D5DB] bg-white px-4 py-3 text-[15px] leading-relaxed text-[#111827]">
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13px] leading-relaxed text-[#4B5563]">{AUDIT_POINTS.note}</p>
          </div>

          <div className="mt-10">
            <h3 className="text-[1.2rem] font-bold text-navy">{GAP.title}</h3>
            <div className="mt-4">
              <FeatureSplit image={illScattered}>
                <ul className="grid gap-3">
                  {GAP.items.map((item) => (
                    <li key={item.title} className="rounded-md border border-[#D1D5DB] bg-white p-4">
                      <h4 className="font-bold text-navy">{item.title}</h4>
                      <p className="mt-2 text-[14px] leading-relaxed text-[#374151]">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </FeatureSplit>
            </div>
            <p className="mt-4 text-[16px] font-bold leading-relaxed text-[#0F766E]">{GAP.purpose}</p>
          </div>
        </div>
      </section>

      <section id="verified" className="scroll-mt-40 border-t border-[#D1D5DB] bg-[#F3F4F6]">
        <div className="container-page py-12 md:py-16">
          <h2 className="text-navy">{FREE_PLATFORM_PAGE.verifiedTitle}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {VERIFIED.map((item) => (
              <li key={item.title} className="rounded-md border border-[#D1D5DB] bg-white p-5">
                <p className="text-[13px] font-semibold text-[#374151]">{item.title}</p>
                <p className="mt-2 text-[1.5rem] font-bold leading-snug text-navy">{item.value}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-[#374151]">{item.detail}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <DisclaimerNote />
          </div>

          <div className="mt-10">
            <FeatureSplit image={illOrgAccount} reverse>
              <p className="text-[18px] font-bold leading-relaxed text-navy">{FEATURES[2].body}</p>
            </FeatureSplit>
          </div>

          <ol className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {FEATURES.map((feature, index) => {
              const Icon = [PenLine, ShieldCheck, Users, BarChart3][index] ?? PenLine;
              return (
              <li key={feature.no} className="rounded-md border border-[#D1D5DB] bg-white p-5">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4F2]">
                  <Icon className="h-7 w-7 text-[#0F766E]" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[13px] font-bold text-[#0F766E]">{feature.no}</p>
                <h3 className="mt-2 text-[18px] font-bold text-navy">{feature.title}</h3>
                <p className="mt-1 text-[14px] font-semibold text-[#111827]">{feature.sub}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-[#374151]">{feature.body}</p>
              </li>
              );
            })}
          </ol>

          {REFERENCES.published ? (
            <div className="mt-10">
              <h3 className="text-[1.2rem] font-bold text-navy">{REFERENCES.title}</h3>
              <p className="mt-2 text-[13px] text-[#4B5563]">{REFERENCES.source}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {REFERENCES.orgs.map((org) => (
                  <li key={org} className="rounded-md border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] text-[#111827]">
                    {org}
                  </li>
                ))}
              </ul>
              <ul className="mt-4 grid gap-2">
                {REFERENCES.highlights.map((line) => (
                  <li key={line} className="text-[15px] leading-relaxed text-[#374151]">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <section id="offer" className="scroll-mt-40 border-t border-[#D1D5DB] bg-white">
        <div className="container-page py-12 md:py-16">
          <h2 className="text-navy">{FREE_PLATFORM_PAGE.offerTitle}</h2>
          <LabelValueTable
            caption={FREE_PLATFORM_PAGE.offerCaption}
            rows={OFFER}
            renderValue={(row) => (row.label === "표기 사항" ? <OfferMarkCell value={row.value} /> : row.value)}
          />
          <p className="mt-4 text-[13px] leading-relaxed text-[#4B5563]">{SURE_MARK_FOOTNOTE}</p>
          <Link to="/privacy-center/sure-mark" className="mt-3 inline-flex items-center gap-1 text-[15px] font-bold text-navy underline">
            {FREE_PLATFORM_PAGE.sureMarkMore}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section id="pledge" className="scroll-mt-40 border-t border-[#D1D5DB] bg-[#F3F4F6]">
        <div className="container-page py-12 md:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-navy">{PLEDGE.title}</h2>
            <img src={illPledge} alt="" aria-hidden="true" loading="lazy" className="mx-auto hidden max-h-[320px] w-auto lg:block" />
          </div>
          <div className="mt-6">
            <PledgeBlock />
          </div>
        </div>
      </section>

      <section id="apply" className="scroll-mt-40 border-t border-[#D1D5DB] bg-white">
        <div className="container-page py-12 md:py-16">
          <h2 className="text-navy">{FREE_PLATFORM_PAGE.applyTitle}</h2>
          <ol className="mt-6 grid gap-3 md:grid-cols-4">
            {APPLY.steps.map((step, index) => {
              const Icon = [FileText, PenLine, Handshake, KeyRound][index] ?? FileText;
              return (
              <li key={step.no} className="relative flex flex-col">
                <article className="h-full rounded-md border border-[#D1D5DB] bg-white p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B3A6E] text-[13px] font-bold text-white">
                      {step.no}
                    </span>
                    <Icon className="h-5 w-5 text-[#0B3A6E]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-2 text-[16px] font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#374151]">{step.body}</p>
                </article>
                {index < APPLY.steps.length - 1 ? (
                  <>
                    <ChevronDown className="mx-auto mt-3 h-5 w-5 text-navy md:hidden" aria-hidden="true" />
                    <ChevronRight
                      className="absolute -right-3 top-8 hidden h-5 w-5 text-navy md:block"
                      aria-hidden="true" />
                  </>
                ) : null}
              </li>
              );
            })}
          </ol>

          <p className="mt-6 text-[15px] font-semibold text-[#111827]">
            {FREE_PLATFORM_PAGE.receptionPrefix} {APPLY.period}
            {" · "}
            {FREE_PLATFORM_PAGE.submitPrefix} {APPLY.submit}
          </p>

          <ul className="mt-6 grid gap-3 lg:grid-cols-3">
            {DOWNLOADS.map((item) => {
              const badge = item.file.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX";
              return (
                <li key={item.file} className="flex items-center gap-3 rounded-md border border-[#D1D5DB] bg-white p-3">
                  <span className="flex h-20 w-16 shrink-0 flex-col items-center justify-center rounded-md border border-[#D1D5DB] bg-white">
                    <FileText className="h-8 w-8 text-[#0B3A6E]" aria-hidden="true" />
                    <span className="mt-1 rounded-sm bg-[#E8EEF6] px-1.5 py-0.5 text-[11px] font-bold text-[#0B3A6E]">{badge}</span>
                  </span>
                  <a className="btn-secondary-kcf" href={fileHref(item.file)} download>
                    <FileDown className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <ApplyMethodTabs />
          <p className="mt-4 text-[14px] leading-relaxed text-[#374151]">{APPLY.note}</p>
          <p className="mt-3 text-[15px] text-[#111827]">
            {FREE_PLATFORM_PAGE.contactOrg} {FREE_PLATFORM.contact.manager}
            {" · "}
            <a className="font-semibold text-navy underline" href={`tel:${FREE_PLATFORM.contact.tel.replaceAll("-", "")}`}>
              {FREE_PLATFORM.contact.tel}
            </a>
            {" · "}
            <a className="font-semibold text-navy underline" href={`mailto:${FREE_PLATFORM.contact.email}`}>
              {FREE_PLATFORM.contact.email}
            </a>
          </p>
        </div>
      </section>

      <section id="cpo" className="scroll-mt-40 border-t border-[#D1D5DB] bg-[#F3F4F6]">
        <div className="container-page py-12 md:py-16">
          <h2 className="text-navy">{CPO_SUPPORT.title}</h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[#374151]">{CPO_SUPPORT.intro}</p>
          <LabelValueTable caption={FREE_PLATFORM_PAGE.cpoCaption} rows={CPO_SUPPORT.rows} />
          <div className="mt-8">
            <h3 className="text-[18px] font-bold text-navy">{FREE_PLATFORM_PAGE.cpoApply}</h3>
            <div className="mt-4"><CpoApplyForm /></div>
          </div>
        </div>
      </section>

      <div id="criteria" className="scroll-mt-40">
        <div id="partners" className="scroll-mt-40">
          <section className="border-t border-[#D1D5DB] bg-white">
            <div className="container-page py-12 md:py-16">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-navy">{FREE_PLATFORM_PAGE.criteriaTitle}</h2>
                <button
                  type="button"
                  className="btn-secondary-kcf md:hidden"
                  aria-expanded={criteriaOpen}
                  aria-controls="criteria-panel"
                  onClick={() => setCriteriaOpen((value) => !value)}
                >
                  {criteriaOpen ? "접기" : "펼치기"}
                </button>
              </div>
              <div id="criteria-panel" className={criteriaOpen ? "" : "max-md:hidden"}>
              <ul className="mt-6 grid gap-3 md:grid-cols-3">
                {CERT_SYSTEMS.map((item) => (
                  <li key={item.name} className="rounded-md border border-[#D1D5DB] bg-white p-5">
                    <h3 className="text-[18px] font-bold text-navy">{item.name}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#374151]">{item.desc}</p>
                  </li>
                ))}
              </ul>
              <h3 className="mt-10 text-[1.2rem] font-bold text-navy">{FREE_PLATFORM_PAGE.criteriaHeading}</h3>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {SERVICE_SELECTION_CRITERIA.map((item) => (
                  <li key={item.title} className="rounded-md border border-[#D1D5DB] bg-white p-5">
                    <h4 className="font-bold text-navy">{item.title}</h4>
                    <p className="mt-2 text-[14px] leading-relaxed text-[#374151]">{item.desc}</p>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section id="association" className="scroll-mt-40 border-t border-[#D1D5DB] bg-[#F3F4F6]">
        <div className="container-page py-12 md:py-16">
          <h2 className="text-navy">{FREE_PLATFORM_PAGE.associationTitle}</h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[#374151]">{ASSOCIATION_INTRO}</p>
          <div className="mt-8">
            <PartnerLogoGrid mobileLimit={8} />
          </div>
          <a href="#apply-form" className="btn-primary-kcf mt-8">
            {FREE_PLATFORM_PAGE.aboutApply}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="border-t border-[#D1D5DB] bg-white">
        <div className="container-page py-12 md:py-16">
          <div className="grid gap-3 md:grid-cols-2">
            <Link
              to={FREE_PLATFORM_PAGE.webinarTo}
              hash={FREE_PLATFORM_PAGE.webinarHash}
              className="flex items-center justify-between gap-3 rounded-md border border-[#D1D5DB] bg-white p-5 text-[16px] font-bold leading-snug text-navy"
            >
              {FREE_PLATFORM_PAGE.webinarTitle}
              <ChevronRight className="h-5 w-5 shrink-0" aria-hidden="true" />
            </Link>
            <Link
              to={FREE_PLATFORM_PAGE.excellenceTo}
              className="flex items-center justify-between gap-3 rounded-md border border-[#D1D5DB] bg-white p-5 text-[16px] font-bold leading-snug text-navy"
            >
              {FREE_PLATFORM_PAGE.excellenceLabel}
              <ChevronRight className="h-5 w-5 shrink-0" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8">
            <DisclaimerNote />
          </div>
        </div>
      </section>
    </div>
  );
}
