import { Link } from "@tanstack/react-router";
import { ChevronRight, Info } from "lucide-react";
import { FormEvent, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { ApplyFrame, Field, applyInput } from "@/components/privacy/apply-ui";
import { PrivacyConsentBlock } from "@/components/privacy/PrivacyConsentBlock";
import { PcMiniNav, PcSection } from "@/components/privacy/privacy-ui";
import { FeatureSplit } from "@/components/site/FeatureSplit";
import illMonitor from "@/assets/illustrations/ill-monitor.svg";
import {
  DATA_SUBJECT_RIGHTS,
  KOREA_REGIONS,
  MONITOR_ACTIVITIES,
  MONITOR_INTERESTS,
  MONITOR_MODES,
  MONITOR_PAGE,
  MONITOR_RULES,
} from "@/data/privacy-program";
import { lookupMonitorApplication, submitMonitorApplication } from "@/lib/center-ops/api";

function Section({ id, children, tone = "white" }: { id?: string; children: ReactNode; tone?: "white" | "soft" }) {
  const bg = tone === "soft" ? "bg-[#F3F4F6]" : "bg-white";
  return (
    <section id={id} className={`scroll-mt-40 border-t border-[#D1D5DB] ${bg}`}>
      <div className="container-page py-12 md:py-16">{children}</div>
    </section>
  );
}

export function RightsView() {
  const about = MONITOR_PAGE.nav[0];
  const join = MONITOR_PAGE.nav[1];
  const preApply = MONITOR_PAGE.nav[2];
  const rules = MONITOR_PAGE.nav[3];
  return (
    <div className="min-w-0">
      <PcMiniNav items={MONITOR_PAGE.nav} />
      <Section id={about.id}>
        <h2 className="text-navy">{about.label}</h2>
        <div className="mt-6">
          <FeatureSplit image={illMonitor}>
            <p className="text-[16px] leading-relaxed text-[#374151]">{MONITOR_PAGE.lead}</p>
          </FeatureSplit>
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {MONITOR_PAGE.about.map((item) => (
            <li key={item.title} className="rounded-md border border-[#D1D5DB] bg-white p-5">
              <h3 className="text-[18px] font-bold text-navy">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#374151]">{item.body}</p>
            </li>
          ))}
        </ul>
        <Link to="/privacy-center/sure-check" className="btn-primary-kcf mt-6">
          {MONITOR_PAGE.sureCheck}
        </Link>
      </Section>
      <Section id={join.id} tone="soft">
        <h2 className="text-navy">{join.label}</h2>
        <p className="mt-4 flex gap-2 rounded-md border border-[#D1D5DB] bg-white p-4 text-[15px] leading-relaxed text-[#111827]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0B3A6E]" aria-hidden="true" />
          <span>{MONITOR_PAGE.pendingNote}</span>
        </p>
        <ul aria-label={MONITOR_PAGE.activitiesLabel} className="mt-6 flex flex-wrap gap-2">
          {MONITOR_ACTIVITIES.map((item) => (
            <li key={item} className="rounded-md border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] font-semibold text-navy">
              {item}
            </li>
          ))}
        </ul>
      </Section>
      <Section id={preApply.id}>
        <h2 className="text-navy">{MONITOR_PAGE.preApply.title}</h2>
        <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#374151]">{MONITOR_PAGE.preApply.body}</p>
        <ol className="mt-6 grid max-w-3xl gap-2">
          {MONITOR_PAGE.preApply.items.map((item, index) => (
            <li key={item} className="flex gap-3 rounded-md border border-[#D1D5DB] px-4 py-3 text-[15px] text-[#111827]">
              <span className="font-bold text-[#0B3A6E]">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <a href={MONITOR_PAGE.preApply.mailto} className="btn-primary-kcf mt-6 px-8 py-4 text-[16px]">
          {MONITOR_PAGE.mailtoLabel}
        </a>
        <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-[#374151]">
          {MONITOR_PAGE.preApply.privacy}{" "}
          <Link to="/privacy-policy" className="font-bold text-navy underline">
            {MONITOR_PAGE.privacyPolicy}
          </Link>
        </p>
      </Section>
      <Section id={rules.id} tone="soft">
        <h2 className="text-navy">{rules.label}</h2>
        <ol className="mt-6 grid max-w-3xl gap-2">
          {MONITOR_RULES.map((rule, index) => (
            <li key={rule} className="flex gap-3 rounded-md border border-[#D1D5DB] bg-white px-4 py-3 text-[15px] leading-relaxed text-[#111827]">
              <span className="font-bold text-[#0B3A6E]">{index + 1}.</span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex gap-2 rounded-md border border-[#0F766E] border-l-4 bg-white p-4 text-[15px] font-semibold leading-relaxed text-[#111827]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" aria-hidden="true" />
          <span>{MONITOR_PAGE.officialReport}</span>
        </p>
        <details className="mt-8 max-w-3xl rounded-md border border-[#D1D5DB] bg-white">
          <summary className="cursor-pointer px-4 py-3 text-[16px] font-bold text-navy">{DATA_SUBJECT_RIGHTS.title}</summary>
          <div className="border-t border-[#D1D5DB] px-4 py-4">
            <p className="text-[15px] leading-relaxed text-[#374151]">{DATA_SUBJECT_RIGHTS.lead}</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {DATA_SUBJECT_RIGHTS.items.map((item) => (
                <li key={item} className="rounded-md border border-[#D1D5DB] px-3 py-2 text-[15px] font-bold text-navy">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </details>
      </Section>
    </div>
  );
}

export function MonitorApplyStatic() {
  return (
    <section className="border-t border-[#D1D5DB] bg-white">
      <div className="container-page max-w-3xl py-12 md:py-16">
        <p className="text-[18px] font-bold text-navy">{MONITOR_PAGE.staticApplyNote}</p>
        <a href={MONITOR_PAGE.preApply.mailto} className="btn-primary-kcf mt-6">
          {MONITOR_PAGE.mailtoLabel}
        </a>
        <Link to="/privacy-center/rights" hash="pre-apply" className="mt-4 inline-flex items-center gap-1 font-bold text-navy underline">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          {MONITOR_PAGE.staticApplyLink}
        </Link>
      </div>
    </section>
  );
}

export function MonitorApplyForm() {
  const [consent, setConsent] = useState(false);
  const [notify, setNotify] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [receipt, setReceipt] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [found, setFound] = useState<string>("");
  const [pending, setPending] = useState(false);

  function toggleInterest(value: string) {
    setInterests((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (String(form.get("company") ?? "")) return;
    setPending(true);
    try {
      const result = await submitMonitorApplication({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        region: String(form.get("region") ?? ""),
        interests,
        motivation: String(form.get("motivation") ?? ""),
        participationMode: String(form.get("mode") ?? ""),
        privacyConsent: true,
        notifyConsent: notify,
      });
      setReceipt(result.id);
      toast.success("사전 신청이 접수되었습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "접수에 실패했습니다.");
    } finally {
      setPending(false);
    }
  }

  async function onLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const row = await lookupMonitorApplication(lookupId, lookupEmail);
      setFound(`${row.id} · ${row.status}${row.publicNote ? ` · ${row.publicNote}` : ""}`);
    } catch (error) {
      setFound("");
      toast.error(error instanceof Error ? error.message : "조회에 실패했습니다.");
    }
  }

  return (
    <PcSection variant="soft">
      <ApplyFrame
        kicker="모집 예정 · 사전 접수"
        title="모니터링단 신청"
        lead="피해 사실이나 민감정보는 적지 않습니다. 선발 공지 전의 사전 접수입니다."
        visual="rights"
        steps={["기본 정보", "관심 분야와 활동방식", "참여 동기", "개인정보 동의 후 접수"]}
      >
        <form onSubmit={onSubmit} className="space-y-5">
          <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="이름 또는 활동명"><input name="name" required className={applyInput} autoComplete="name" /></Field>
            <Field label="이메일"><input name="email" type="email" required className={applyInput} autoComplete="email" /></Field>
            <Field label="연락처 (선택)"><input name="phone" className={applyInput} autoComplete="tel" /></Field>
            <Field label="거주 시도">
              <select name="region" required className={applyInput} defaultValue="">
                <option value="" disabled>선택</option>
                {KOREA_REGIONS.map((region) => <option key={region}>{region}</option>)}
              </select>
            </Field>
          </div>
          <fieldset>
            <legend className="text-[13px] font-bold text-navy">관심 분야</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {MONITOR_INTERESTS.map((item) => {
                const on = interests.includes(item);
                return (
                  <label key={item} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-[13px] ${on ? "border-trust-blue bg-[var(--pc-soft-blue)] font-bold text-navy" : "border-border text-text-secondary"}`}>
                    <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleInterest(item)} />
                    {item}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <Field label="희망 활동방식" wide>
            <select name="mode" required className={applyInput} defaultValue={MONITOR_MODES[0]}>{MONITOR_MODES.map((mode) => <option key={mode}>{mode}</option>)}</select>
          </Field>
          <Field label="참여 동기" wide>
            <textarea name="motivation" required rows={4} className={`${applyInput} h-auto py-3`} placeholder="공개된 화면을 어떻게 살피고 싶은지 적어 주세요. 피해 경위는 적지 않습니다." />
          </Field>
          <PrivacyConsentBlock id="monitor-consent" variant="monitor-apply" consent={consent} onConsentChange={setConsent} />
          <label className="flex items-start gap-2 text-[14px] text-text-secondary">
            <input type="checkbox" className="mt-1" checked={notify} onChange={(event) => setNotify(event.target.checked)} />
            모집·활동 알림 수신에 동의합니다. (선택)
          </label>
          <button type="submit" disabled={!consent || pending} className="btn-primary-kcf disabled:opacity-50">
            {pending ? "접수 중…" : "사전 신청하기"}
          </button>
          {receipt ? <p role="status" className="rounded-xl bg-[var(--pc-soft-blue)] px-4 py-3 text-[15px]">접수번호 <strong>{receipt}</strong></p> : null}
        </form>
      </ApplyFrame>
      <form onSubmit={onLookup} className="mt-6 rounded-[28px] border border-border bg-white p-6">
        <h3 className="text-[18px] font-bold text-navy">신청 상태 조회</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="text-[13px] font-semibold text-navy">접수번호<input value={lookupId} onChange={(event) => setLookupId(event.target.value)} required className={applyInput} /></label>
          <label className="text-[13px] font-semibold text-navy">이메일<input type="email" value={lookupEmail} onChange={(event) => setLookupEmail(event.target.value)} required className={applyInput} /></label>
          <button type="submit" className="btn-secondary-kcf h-12">조회</button>
        </div>
        {found ? <p role="status" className="mt-3 text-[14px] text-navy">{found}</p> : null}
      </form>
    </PcSection>
  );
}
