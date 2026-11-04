import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileBarChart,
  FileText,
  Globe,
  Info,
  Newspaper,
} from "lucide-react";
import { FormEvent, useEffect, useId, useRef, useState, type ReactNode } from "react";

import { PcMiniNav } from "@/components/privacy/privacy-ui";
import { FeatureSplit } from "@/components/site/FeatureSplit";
import illCertificate from "@/assets/illustrations/ill-certificate.svg";
import {
  certDownloadName,
  displayRule,
  EXCELLENCE,
  findInstitutionByCertNo,
  formatSelectedAt,
  publishedInstitutions,
  SURE_MARK,
  SURE_MARK_PAGE,
  SURE_MARK_RULES,
  SURE_MARK_SUPPORT,
  SURE_MARK_USAGE,
  type Institution,
} from "@/data/sure-mark";
import { useInstitutions } from "@/lib/content/load";

const USAGE_ICONS = [ClipboardList, Globe, Newspaper, FileBarChart] as const;

function fileHref(file: string) {
  return `${import.meta.env.BASE_URL}${file}`;
}

function Section({
  id,
  children,
  tone = "white",
}: {
  id?: string;
  children: ReactNode;
  tone?: "white" | "soft";
}) {
  const bg = tone === "soft" ? "bg-[#F3F4F6]" : "bg-white";
  return (
    <section id={id} className={`scroll-mt-40 border-t border-[#D1D5DB] ${bg}`}>
      <div className="container-page py-12 md:py-16">{children}</div>
    </section>
  );
}

function statusClass(status: Institution["status"]) {
  if (status === "유효") return "bg-[#E6F4F2] text-[#0F766E]";
  if (status === "재검토") return "bg-[#FFEDD5] text-[#9A3412]";
  return "bg-[#F3F4F6] text-[#374151]";
}

function ReasonText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || open) return;
    setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [open, text]);

  return (
    <div className="mt-3">
      <p ref={ref} className={`text-[14px] leading-relaxed text-[#374151] ${open ? "" : "line-clamp-3"}`}>
        {text}
      </p>
      {overflows && !open ? (
        <button type="button" className="mt-1 text-[14px] font-bold text-navy underline" onClick={() => setOpen(true)}>
          {SURE_MARK_PAGE.more}
        </button>
      ) : null}
    </div>
  );
}

function InstitutionCard({ item }: { item: Institution }) {
  const thumb = `downloads/certificates/thumbs/${item.certNo}.png`;
  const href = fileHref(item.certFile);
  const [src, setSrc] = useState(fileHref(thumb));

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md border border-[#D1D5DB] bg-white">
      <div className="overflow-hidden border-b border-[#D1D5DB] bg-white">
        <img
          src={src}
          alt={`${item.name} ${SURE_MARK_PAGE.certAltSuffix}`}
          loading="lazy"
          className="cert-thumb aspect-[210/297] w-full bg-white object-contain"
          onError={() => setSrc(fileHref(SURE_MARK.logo))}
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-[17px] font-bold text-navy">{item.name}</h3>
        <span className={`inline-flex rounded-md px-2 py-1 text-[12px] font-bold ${statusClass(item.status)}`}>
          {item.status}
        </span>
      </div>
      <p className="mt-2 text-[13px] text-[#374151]">
        {SURE_MARK_PAGE.certNoPrefix} {item.certNo}
        {" · "}
        {SURE_MARK_PAGE.selectedPrefix} {formatSelectedAt(item.selectedAt)}
      </p>
      <ReasonText text={item.reason} />
      <div className="mt-4 flex flex-wrap gap-2">
        <a className="btn-secondary-kcf" href={href} target="_blank" rel="noopener noreferrer">
          {SURE_MARK_PAGE.viewCert}
        </a>
        <a className="btn-primary-kcf" href={href} download={certDownloadName(item.name)}>
          {SURE_MARK_PAGE.download}
        </a>
      </div>
      </div>
    </article>
  );
}

function VerifyPanel({ initialCertNo, institutions }: { initialCertNo: string; institutions: Institution[] }) {
  const inputId = useId();
  const [query, setQuery] = useState(initialCertNo);
  const [lookup, setLookup] = useState(initialCertNo);

  useEffect(() => {
    setQuery(initialCertNo);
    setLookup(initialCertNo);
  }, [initialCertNo]);

  const checked = lookup.trim().length > 0;
  const found = checked ? findInstitutionByCertNo(lookup, institutions) : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLookup(query);
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label htmlFor={inputId} className="block flex-1 text-[15px] font-semibold text-navy">
          {SURE_MARK_PAGE.verifyLabel}
          <input
            id={inputId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={SURE_MARK_PAGE.verifyPlaceholder}
            className="mt-1.5 h-12 w-full rounded-md border border-[#D1D5DB] px-3 text-[16px] font-normal text-[#111827]"
          />
        </label>
        <button type="submit" className="btn-primary-kcf h-12">
          {SURE_MARK_PAGE.verifySubmit}
        </button>
      </form>
      <div aria-live="polite" className="mt-4">
        {checked && found ? (
          <div className="rounded-md border border-[#0F766E] bg-white p-5">
            <p className="text-[16px] font-bold text-[#0F766E]">{SURE_MARK_PAGE.verified}</p>
            {found.status === "회수" ? (
              <p className="mt-2 inline-flex rounded-md bg-[#FEE2E2] px-2 py-1 text-[13px] font-bold text-[#B91C1C]">
                {SURE_MARK_PAGE.revoked}
              </p>
            ) : null}
            <dl className="mt-3 grid gap-1 text-[15px] text-[#111827]">
              <div>
                <dt className="inline font-semibold text-navy">{found.name}</dt>
              </div>
              <div>
                {SURE_MARK_PAGE.tierLabel} {found.tier}
              </div>
              <div>
                {SURE_MARK_PAGE.selectedPrefix} {formatSelectedAt(found.selectedAt)}
              </div>
              <div>
                {SURE_MARK_PAGE.statusLabel} {found.status}
              </div>
            </dl>
            <a
              className="mt-4 inline-flex font-bold text-navy underline"
              href={fileHref(found.certFile)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SURE_MARK_PAGE.viewCert}
            </a>
          </div>
        ) : null}
        {checked && !found ? (
          <p className="text-[15px] leading-relaxed text-[#111827]">
            일치하는 인증번호가 없습니다. 인증번호를 다시 확인하거나{" "}
            <Link to="/contact" search={{ type: "우수기관·SURE MARK" }} className="font-bold text-navy underline">문의해 주세요</Link>.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function SureMarkView({ initialCertNo }: { initialCertNo: string }) {
  const institutions = useInstitutions();
  const published = publishedInstitutions(institutions);
  const selectedOn = published[0] ? formatSelectedAt(published[0].selectedAt) : "";

  return (
    <div className="min-w-0">
      <div className="border-b border-[#D1D5DB] bg-white">
        <div className="container-page py-3">
          <Link to="/privacy-center/security-services" className="text-[15px] font-bold text-navy underline">
            {SURE_MARK_PAGE.back}
          </Link>
        </div>
      </div>
      <PcMiniNav items={SURE_MARK_PAGE.nav} />

      <Section id="mark">
        <div className="grid items-center gap-8 rounded-md border border-[#D1D5DB] bg-white p-5 md:grid-cols-[240px_minmax(0,1fr)] md:p-8">
          <img
            src={fileHref(SURE_MARK.logo)}
            alt={SURE_MARK_PAGE.logoAlt}
            className="mx-auto w-full max-w-[240px]"
          />
          <div>
            <h2 className="text-navy">{SURE_MARK.name}</h2>
            <p className="mt-1 text-[14px] text-[#374151]">{SURE_MARK.fullName}</p>
            <blockquote className="mt-4 text-[1.35rem] font-bold leading-snug text-navy">“{SURE_MARK.promise}”</blockquote>
            <p className="mt-4 text-[16px] leading-relaxed text-[#374151]">{SURE_MARK.description}</p>
          </div>
        </div>
        <p className="mt-4 flex gap-2 text-[13px] leading-relaxed text-[#4B5563]">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{SURE_MARK.disclaimer}</span>
        </p>
      </Section>

      <Section id="excellence" tone="soft">
        <h2 className="text-navy">{SURE_MARK_PAGE.excellenceTitle}</h2>
        <div className="mt-4">
          <FeatureSplit image={illCertificate}>
            <p className="text-[16px] leading-relaxed text-[#374151]">{EXCELLENCE.purpose}</p>
          </FeatureSplit>
        </div>
        <ol className="mt-8 flex flex-col gap-2 md:flex-row md:items-stretch">
          {EXCELLENCE.flow.map((step, index) => {
            const body = (
              <span className="flex h-full w-full items-center justify-center rounded-md border border-[#D1D5DB] bg-white px-3 py-4 text-center text-[15px] font-bold text-navy">
                {step}
              </span>
            );
            return (
              <li key={step} className="flex flex-1 flex-col items-center gap-2 md:flex-row">
                {index === 0 ? (
                  <Link to="/privacy-center/security-services" hash="pledge" className="w-full underline-offset-2 hover:underline">
                    {body}
                  </Link>
                ) : index === 1 ? (
                  <Link to="/privacy-center/security-services" className="w-full underline-offset-2 hover:underline">
                    {body}
                  </Link>
                ) : (
                  body
                )}
                {index < EXCELLENCE.flow.length - 1 ? (
                  <>
                    <ChevronDown className="h-5 w-5 shrink-0 text-navy md:hidden" aria-hidden="true" />
                    <ChevronRight className="hidden h-5 w-5 shrink-0 text-navy md:block" aria-hidden="true" />
                  </>
                ) : null}
              </li>
            );
          })}
        </ol>
        <p className="mt-8 border border-[#D1D5DB] border-l-4 border-l-[#0F766E] bg-white px-4 py-3 text-[16px] font-bold leading-relaxed text-[#0F766E]">
          {EXCELLENCE.principle}
        </p>
        <h3 className="mt-10 text-[1.2rem] font-bold text-navy">{SURE_MARK_PAGE.criteriaTitle}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[#111827]">
          <span className="font-bold text-navy">{SURE_MARK_PAGE.criteriaBaseLabel}. </span>
          {EXCELLENCE.criteriaBase}
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-[#111827]">{EXCELLENCE.criteriaActionsLead}</p>
        <ul className="mt-4 grid gap-2">
          {EXCELLENCE.criteriaActions.map((action) => (
            <li key={action} className="flex gap-2 text-[15px] leading-relaxed text-[#111827]">
              <Check className="mt-1 h-4 w-4 shrink-0 text-[#0F766E]" aria-hidden="true" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
        <h3 className="mt-10 text-[1.2rem] font-bold text-navy">{SURE_MARK_PAGE.benefitsTitle}</h3>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {EXCELLENCE.benefits.map((benefit) => (
            <li key={benefit} className="rounded-md border border-[#D1D5DB] bg-white p-4 text-[15px] leading-relaxed text-[#111827]">
              {benefit}
            </li>
          ))}
        </ul>
        <h3 className="mt-10 text-[1.2rem] font-bold text-navy">{SURE_MARK_PAGE.noticesTitle}</h3>
        <ol className="mt-4 grid gap-2 rounded-md border border-[#D1D5DB] bg-[#E5E7EB] p-4">
          {EXCELLENCE.notices.map((notice, index) => (
            <li key={notice} className="text-[14px] leading-relaxed text-[#374151]">
              {index + 1}. {notice}
            </li>
          ))}
        </ol>
      </Section>

      <Section id="institutions">
        <h2 className="text-navy">{SURE_MARK_PAGE.institutionsHeading}</h2>
        <p className="mt-2 text-[15px] font-semibold text-[#374151]">
          {`${published.length}${SURE_MARK_PAGE.institutionsCountSuffix} · ${SURE_MARK_PAGE.selectedPrefix} ${selectedOn}`}
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {published.map((item) => (
            <li key={item.certNo}>
              <InstitutionCard item={item} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[14px] text-[#374151]">
          <a href="#verify" className="font-bold text-navy underline">
            {SURE_MARK_PAGE.verifyHint}
          </a>
        </p>
      </Section>

      <Section id="downloads" tone="soft">
        <h2 className="text-navy">{SURE_MARK_PAGE.libraryTitle}</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {SURE_MARK.files.map((item) => {
            const isPng = item.file.toLowerCase().endsWith(".png");
            const kind = item.file.split(".").pop()?.toUpperCase() ?? "";
            return (
              <li key={item.file} className="rounded-md border border-[#D1D5DB] bg-white p-4">
                <div
                  className={`flex h-40 items-center justify-center rounded-md border border-[#D1D5DB] ${
                    isPng ? "sure-checker" : "bg-white"
                  }`}
                >
                  <img src={fileHref(item.file)} alt={item.label} className="max-h-32 max-w-[70%] object-contain" />
                </div>
                <p className="mt-3 text-[14px] font-semibold text-[#374151]">
                  {kind} · {item.label}
                </p>
                <a className="btn-secondary-kcf mt-3" href={fileHref(item.file)} download>
                  {SURE_MARK_PAGE.download}
                </a>
              </li>
            );
          })}
        </ul>
        <h3 className="mt-10 text-[1.2rem] font-bold text-navy">{SURE_MARK_PAGE.usageTitle}</h3>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {SURE_MARK_USAGE.map((item, index) => {
            const Icon = USAGE_ICONS[index] ?? FileText;
            return (
              <li key={item.title} className="rounded-md border border-[#D1D5DB] bg-white p-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F4F2]">
                  <Icon className="h-6 w-6 text-[#0F766E]" aria-hidden="true" />
                </span>
                <h4 className="mt-2 font-bold text-navy">{item.title}</h4>
                <p className="mt-2 text-[14px] leading-relaxed text-[#374151]">{item.body}</p>
              </li>
            );
          })}
        </ul>
        <h3 className="mt-10 text-[1.2rem] font-bold text-navy">{SURE_MARK_PAGE.rulesTitle}</h3>
        <ul className="mt-4 grid gap-2">
          {SURE_MARK_RULES.map((rule) => (
            <li key={rule} className="rounded-md border border-[#D1D5DB] bg-white px-4 py-3 text-[15px] text-[#111827]">
              {displayRule(rule)}
            </li>
          ))}
        </ul>
        <h3 className="mt-10 text-[1.2rem] font-bold text-navy">{SURE_MARK_PAGE.supportTitle}</h3>
        <ul className="mt-4 grid gap-2 md:grid-cols-3">
          {SURE_MARK_SUPPORT.map((item) => (
            <li key={item} className="rounded-md border border-[#D1D5DB] bg-white p-4 text-[15px] leading-relaxed text-[#111827]">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="verify">
        <h2 className="text-navy">{SURE_MARK_PAGE.nav.find((item) => item.id === "verify")?.label}</h2>
        <div className="mt-6 max-w-2xl">
          <VerifyPanel initialCertNo={initialCertNo} institutions={institutions} />
        </div>
      </Section>

      <section className="border-t border-[#D1D5DB] bg-white">
        <div className="container-page grid gap-3 py-12 md:grid-cols-2 md:py-16">
          <Link
            to="/privacy-center/security-services"
            hash="pledge"
            className="flex items-center justify-between gap-3 rounded-md border border-[#D1D5DB] p-5 text-[16px] font-bold text-navy"
          >
            {SURE_MARK_PAGE.footerPractice}
            <ChevronRight className="h-5 w-5 shrink-0" aria-hidden="true" />
          </Link>
          <Link
            to="/privacy-center/security-services"
            hash="apply"
            className="flex items-center justify-between gap-3 rounded-md border border-[#D1D5DB] p-5 text-[16px] font-bold text-navy"
          >
            {SURE_MARK_PAGE.footerApply}
            <ChevronRight className="h-5 w-5 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
