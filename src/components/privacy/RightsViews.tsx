import { Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { ApplyFrame, Field, applyInput } from "@/components/privacy/apply-ui";
import { PrivacyConsentBlock } from "@/components/privacy/PrivacyConsentBlock";
import { PRIVACY_VISUALS } from "@/components/privacy/privacy-visuals";
import { OrgNotice } from "@/components/privacy/survey-visuals";
import { usePublicContent } from "@/components/privacy/use-public-content";
import { PcSection, PcSectionHeader } from "@/components/privacy/privacy-ui";
import { KOREA_REGIONS, MONITOR_ACTIVITIES, MONITOR_INTERESTS, MONITOR_MODES } from "@/data/privacy-program";
import { lookupMonitorApplication, submitMonitorApplication } from "@/lib/center-ops/api";

export function RightsView() {
  const content = usePublicContent();
  return (
    <>
      <PcSection variant="white">
        <div className="grid items-center gap-6 rounded-[28px] bg-[var(--pc-soft-blue)] p-4 md:grid-cols-[240px_1fr] md:p-6">
          <img src={PRIVACY_VISUALS.rights.src} alt={PRIVACY_VISUALS.rights.alt} className="mx-auto h-56 w-auto object-contain" />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[12px] font-bold text-amber-900">모집 예정</span>
              <span className="text-[13px] text-text-secondary">선발 공지 전입니다. 신청은 사전 접수입니다.</span>
            </div>
            <h2 className="mt-4 text-[28px] font-bold text-navy">국민 개인정보 지키미</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
              공개된 수집 화면을 살피고, 정보주체가 권리를 행사하는 방법을 안내하는 국민 참여입니다.
            </p>
          </div>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {MONITOR_ACTIVITIES.map((item) => (
            <li key={item} className="rounded-2xl border border-border px-4 py-3 text-[15px] font-medium text-navy">{item}</li>
          ))}
        </ul>
        <Link to="/privacy-center/rights/monitor/apply" className="btn-primary-kcf mt-8">사전 참여 신청</Link>
      </PcSection>
      <PcSection variant="white">
        <PcSectionHeader title="모니터링단 공지" />
        <ul className="mt-6 space-y-3">
          {content.notices.length === 0 ? <li className="text-text-secondary">등록된 공지가 없습니다.</li> : null}
          {content.notices.map((notice) => (
            <li key={notice.id} className="rounded-2xl border border-border p-5">
              <h3 className="font-bold text-navy">{notice.title}</h3>
              <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-text-secondary">{notice.body}</p>
            </li>
          ))}
        </ul>
        <h3 className="mt-10 text-[22px] font-bold text-navy">활동자료</h3>
        <ul className="mt-4 space-y-3">
          {content.activities.length === 0 ? <li className="text-[14px] text-text-secondary">등록된 활동자료가 없습니다.</li> : null}
          {content.activities.map((post) => (
            <li key={post.id} className="rounded-2xl border border-border p-5">
              <h3 className="font-bold text-navy">{post.title}</h3>
              <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-text-secondary">{post.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 border-t border-border pt-6 text-[14px] leading-relaxed text-text-secondary">
          공식 침해 신고는{" "}
          <a className="font-semibold text-trust-blue" href="https://privacy.go.kr" target="_blank" rel="noopener noreferrer">privacy.go.kr</a>
          {" "}또는 국번 없이 118입니다. 진흥원 활동은 그 신고를 대신하지 않으며, 신청서에 피해 경위나 민감정보는 받지 않습니다. 활동은 합법적인 공동의견과 권리행사 안내로 한정하고, 동의 없는 개인정보 게시나 반복 민원은 받지 않습니다.
        </p>
        <div className="mt-8"><OrgNotice /></div>
      </PcSection>
    </>
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
