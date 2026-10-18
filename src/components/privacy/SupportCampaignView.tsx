import { Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { ApplyFrame, Field, FieldGroup, applyInput } from "@/components/privacy/apply-ui";
import { PrivacyConsentBlock } from "@/components/privacy/PrivacyConsentBlock";
import { PRIVACY_VISUALS } from "@/components/privacy/privacy-visuals";
import { SupportApplicationForm } from "@/components/privacy/SupportApplicationForm";
import { VoucherRegistrySearch } from "@/components/privacy/VoucherRegistrySearch";
import { SureStartAssociationSection } from "@/components/privacy/SureStartAssociationSection";
import { VoucherIntroSection } from "@/components/privacy/VoucherIntroSection";
import { PartnerLogosStrip, SecureCollectionToolBanner } from "@/components/privacy/privacy-sections";
import { usePublicContent } from "@/components/privacy/use-public-content";
import { PcSection, PcSectionHeader } from "@/components/privacy/privacy-ui";
import { CIVIC_REVIEW, CIVIC_STEPS, CIVIC_TARGETS, SUPPORT_AREAS } from "@/data/privacy-program";
import { lookupCampaignApplication, submitCampaignApplication, supplementCampaignApplication } from "@/lib/center-ops/api";
import type { ApplicationKind } from "@/lib/association-application/types";
import type { StoredFile } from "@/lib/center-ops/types";

const KINDS = [
  { id: "association", label: "협단체", hint: "기존 바우처 신청", visual: "support" as const },
  { id: "enterprise", label: "기업", hint: "회원사·참여기업", visual: "services" as const },
  { id: "public", label: "공공기관", hint: "산하기관 포함", visual: "policy" as const },
  { id: "civic", label: "주민자치", hint: "시범사업(안)", visual: "rights" as const },
] as const;

export function SupportCampaignView() {
  const content = usePublicContent();
  const license = content.licenseSettings;
  return (
    <>
      <PcSection variant="white">
        <div className="grid gap-4 md:grid-cols-3">
          {SUPPORT_AREAS.map((area) => {
            const art = area.id === "civic" ? PRIVACY_VISUALS.rights : area.id === "public" ? PRIVACY_VISUALS.policy : PRIVACY_VISUALS.support;
            return (
            <a key={area.id} href={`#${area.id}`} className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <img src={art.src} alt="" className={`w-full ${art.fit === "contain" ? "h-40 object-contain bg-[var(--pc-soft-blue)] p-3" : "h-36 object-cover"}`} />
              <div className="p-5">
                <div className="text-[12px] font-bold text-[#0F766E]">{area.badge}</div>
                <h2 className="mt-2 text-[20px] font-bold text-navy">{area.title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{area.summary}</p>
              </div>
            </a>
            );
          })}
        </div>
        <Link to="/privacy-center/support/apply" search={{ type: "association" }} className="btn-primary-kcf mt-8">지원 신청</Link>
      </PcSection>

      <div id="association">
        <VoucherIntroSection />
        <PartnerLogosStrip />
        <SecureCollectionToolBanner />
        <SureStartAssociationSection />
      </div>

      <PcSection id="public" variant="white">
        <PcSectionHeader eyebrow="시범사업(안)" title="공공기관·산하기관 지원" description="무상 범위와 기간이 확정되기 전에는 시범사업(안)으로 안내합니다. 기존 공공기관 신청은 그대로 접수됩니다." />
        <Link to="/privacy-center/support/apply" search={{ type: "public" }} className="btn-secondary-kcf mt-6">공공기관 신청</Link>
      </PcSection>

      <PcSection id="civic" variant="soft">
        <PcSectionHeader
          eyebrow="시범사업(안)"
          title="주민자치 무료 지원"
          description="공공기관 예산을 지원받는 비영리 주민자치 모임이 행사 참가자를 모집할 때, 심사 후 그 행사에 한정한 무료 사용권을 검토합니다. 솔루션 공급사 API는 연결되어 있지 않아 사용권은 관리자가 수동으로 발급합니다."
        />
        <ul className="mt-6 flex flex-wrap gap-2">
          {CIVIC_TARGETS.map((item) => <li key={item} className="rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-navy">{item}</li>)}
        </ul>
        <ol className="mt-8 space-y-2">
          {CIVIC_STEPS.map((step, index) => (
            <li key={step} className="rounded-xl bg-white px-4 py-3 text-[14px] text-text-secondary"><span className="mr-2 font-bold text-navy">{index + 1}.</span>{step}</li>
          ))}
        </ol>
        <h3 className="mt-8 text-[18px] font-bold text-navy">심사기준</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {CIVIC_REVIEW.map((item) => <li key={item} className="rounded-xl border border-border bg-white px-4 py-3 text-[14px]">{item}</li>)}
        </ul>
        <h3 className="mt-8 text-[18px] font-bold text-navy">무료 사용권 범위 (관리자 설정)</h3>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            ["설문 개수", `${license.surveyCount}건`],
            ["응답자 수", `${license.respondentLimit.toLocaleString("ko-KR")}명`],
            ["사용기간", `${license.periodDays}일`],
            ["제공 기능", license.features],
            ["저장용량", license.storage],
            ["결과 다운로드", license.downloadAllowed ? "가능" : "불가"],
            ["종료·파기", license.disposalRule],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-white px-4 py-3">
              <dt className="text-[12px] font-bold text-navy">{label}</dt>
              <dd className="mt-1 text-[14px] text-text-secondary">{value}</dd>
            </div>
          ))}
        </dl>
        <button type="button" onClick={downloadExample} className="btn-secondary-kcf mt-6">신청서 예시 다운로드</button>
        <Link to="/privacy-center/support/apply" search={{ type: "civic" }} className="btn-primary-kcf ml-3 mt-6">주민자치 신청</Link>
        <div className="mt-8">
          <h3 className="text-[18px] font-bold text-navy">지원실적</h3>
          {content.publishedStats.length === 0 ? (
            <p className="mt-2 text-[14px] text-text-secondary">확정된 지원실적 수치가 없습니다. 관리자가 게시한 수치만 표시합니다.</p>
          ) : (
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              {content.publishedStats.map((stat) => (
                <li key={stat.id} className="rounded-xl bg-white p-4">
                  <div className="text-[13px] text-text-secondary">{stat.label}</div>
                  <div className="mt-1 text-[20px] font-bold text-navy">{stat.value}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PcSection>
    </>
  );
}

function downloadExample() {
  const text = [
    "주민자치 무료 지원 신청서 예시",
    "이 파일은 작성 예시이며, 제출은 온라인 신청서로 합니다.",
    "",
    "모임명: ○○주민자치회",
    "담당자 / 이메일 / 연락처",
    "관할 지자체 / 지원부서",
    "행사명 / 목적 / 기간 / 예상 참여자",
    "개인정보 수집 항목: 이름, 연락처 (필요한 항목만)",
    "첨부: 담당부서 확인 공문 또는 직인",
    "",
    "직인이 있어도 자동 승인되지 않습니다.",
  ].join("\n");
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "주민자치-지원신청-예시.txt";
  anchor.click();
  URL.revokeObjectURL(url);
}

async function readFile(file: File | undefined): Promise<StoredFile | undefined> {
  if (!file || file.size === 0) return undefined;
  if (file.size > 1_000_000) throw new Error("첨부파일은 1MB 이하로 올려 주세요.");
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("파일을 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });
  return { name: file.name, mimeType: file.type || "application/octet-stream", dataUrl };
}

export function CampaignApply({ initial }: { initial: string }) {
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>(
    KINDS.some((item) => item.id === initial) ? (initial as (typeof KINDS)[number]["id"]) : "association",
  );
  const [prefill, setPrefill] = useState("");
  return (
    <PcSection variant="white">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KINDS.map((item) => {
          const art = PRIVACY_VISUALS[item.visual];
          const on = kind === item.id;
          return (
            <button key={item.id} type="button" onClick={() => setKind(item.id)} className={`overflow-hidden rounded-2xl border text-left ${on ? "border-trust-blue ring-2 ring-trust-blue/30" : "border-border"}`}>
              <img src={art.src} alt="" className={`h-24 w-full ${art.fit === "contain" ? "object-contain bg-[var(--pc-soft-blue)] p-2" : "object-cover"}`} />
              <span className="block px-4 py-3">
                <span className="block font-bold text-navy">{item.label}</span>
                <span className="mt-1 block text-[12px] text-text-secondary">{item.hint}</span>
              </span>
            </button>
          );
        })}
      </div>
      {kind === "civic" ? <div className="mt-8"><CivicForm /></div> : (
        <div className="mt-8">
          {kind === "association" ? <VoucherRegistrySearch onSelectOrganization={setPrefill} /> : null}
          <div className="mt-4">
            <SupportApplicationForm kind={kind as ApplicationKind} prefillOrgName={prefill} />
          </div>
        </div>
      )}
    </PcSection>
  );
}

function CivicForm() {
  const [consent, setConsent] = useState(false);
  const [receipt, setReceipt] = useState("");
  const [pending, setPending] = useState(false);
  const [lookupId, setLookupId] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [found, setFound] = useState("");
  const [supplement, setSupplement] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    try {
      const attachment = await readFile(form.get("attachment") instanceof File ? (form.get("attachment") as File) : undefined);
      const result = await submitCampaignApplication({
        organizationName: String(form.get("organizationName") ?? ""),
        managerName: String(form.get("managerName") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        purpose: String(form.get("purpose") ?? ""),
        municipality: String(form.get("municipality") ?? ""),
        department: String(form.get("department") ?? ""),
        eventName: String(form.get("eventName") ?? ""),
        eventPurpose: String(form.get("eventPurpose") ?? ""),
        eventPeriod: String(form.get("eventPeriod") ?? ""),
        expectedParticipants: String(form.get("expectedParticipants") ?? ""),
        collectedItems: String(form.get("collectedItems") ?? ""),
        attachment,
        privacyConsent: true,
      });
      setReceipt(result.id);
      toast.success("신청이 접수되었습니다. 관리자 화면에서 확인할 수 있습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "접수에 실패했습니다.");
    } finally {
      setPending(false);
    }
  }

  async function onLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const row = await lookupCampaignApplication(lookupId, lookupEmail);
      setFound(`${row.organizationName} · ${row.eventName} · ${row.status}${row.publicNote ? ` · ${row.publicNote}` : ""}${row.licenseCode ? ` · 사용권 ${row.licenseCode}` : ""}`);
    } catch (error) {
      setFound("");
      toast.error(error instanceof Error ? error.message : "조회에 실패했습니다.");
    }
  }

  async function onSupplement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const file = await readFile(form.get("file") instanceof File ? (form.get("file") as File) : undefined);
      await supplementCampaignApplication(lookupId, lookupEmail, supplement, file);
      toast.success("보완자료를 제출했습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "제출에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-6">
      <ApplyFrame
        kicker="시범사업(안)"
        title="주민자치 행사 지원"
        lead="직인만으로 승인되지 않습니다. 접수, 서류확인, 보완, 승인 또는 반려, 사용권 발급, 이용 종료, 파기확인 순서로 봅니다."
        visual="support"
        steps={["신청 주체", "행사 정보", "수집 항목과 확인자료", "동의 후 접수"]}
      >
        <form onSubmit={onSubmit} className="space-y-5">
          <FieldGroup title="신청 주체">
            <Field label="기관 또는 모임명"><input name="organizationName" required className={applyInput} /></Field>
            <Field label="담당자"><input name="managerName" required className={applyInput} /></Field>
            <Field label="이메일"><input name="email" type="email" required className={applyInput} /></Field>
            <Field label="연락처"><input name="phone" required className={applyInput} /></Field>
            <Field label="관할 지자체"><input name="municipality" required className={applyInput} /></Field>
            <Field label="지원부서"><input name="department" required className={applyInput} /></Field>
          </FieldGroup>
          <FieldGroup title="행사">
            <Field label="행사명"><input name="eventName" required className={applyInput} /></Field>
            <Field label="행사기간"><input name="eventPeriod" required className={applyInput} placeholder="2026.11.01 ~ 2026.11.02" /></Field>
            <Field label="예상 참여자" wide><input name="expectedParticipants" required className={applyInput} /></Field>
            <Field label="신청 목적" wide><textarea name="purpose" required rows={3} className={`${applyInput} h-auto py-3`} /></Field>
            <Field label="행사 목적" wide><textarea name="eventPurpose" required rows={3} className={`${applyInput} h-auto py-3`} /></Field>
          </FieldGroup>
          <FieldGroup title="개인정보">
            <Field label="수집 항목" wide><textarea name="collectedItems" required rows={3} className={`${applyInput} h-auto py-3`} /></Field>
            <Field label="공공지원 확인자료" wide><input name="attachment" type="file" className="mt-2 block w-full text-[14px]" /></Field>
          </FieldGroup>
          <PrivacyConsentBlock id="civic-consent" variant="civic-support" consent={consent} onConsentChange={setConsent} />
          <button disabled={!consent || pending} className="btn-primary-kcf disabled:opacity-50" type="submit">{pending ? "접수 중…" : "신청하기"}</button>
          {receipt ? <p role="status" className="rounded-xl bg-[var(--pc-soft-blue)] px-4 py-3">접수번호 <strong>{receipt}</strong></p> : null}
        </form>
      </ApplyFrame>
      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={onLookup} className="rounded-[28px] border border-border bg-slate-50 p-5">
          <h3 className="font-bold text-navy">신청 상태 조회</h3>
          <div className="mt-3 grid gap-3">
            <input aria-label="접수번호" value={lookupId} onChange={(event) => setLookupId(event.target.value)} required className={applyInput} placeholder="접수번호" />
            <input aria-label="이메일" type="email" value={lookupEmail} onChange={(event) => setLookupEmail(event.target.value)} required className={applyInput} placeholder="이메일" />
          </div>
          <button className="btn-secondary-kcf mt-4" type="submit">조회</button>
          {found ? <p role="status" className="mt-3 text-[14px]">{found}</p> : null}
        </form>
        <form onSubmit={onSupplement} className="rounded-[28px] border border-border bg-white p-5">
          <h3 className="font-bold text-navy">보완자료 제출</h3>
          <p className="mt-1 text-[13px] text-text-secondary">상태가 보완요청일 때만 제출됩니다. 왼쪽 조회에 쓴 접수번호와 이메일을 사용합니다.</p>
          <textarea value={supplement} onChange={(event) => setSupplement(event.target.value)} required rows={3} className={`${applyInput} h-auto py-3`} aria-label="보완 내용" />
          <input name="file" type="file" className="mt-3 block text-[14px]" aria-label="보완 첨부" />
          <button className="btn-secondary-kcf mt-3" type="submit">보완자료 보내기</button>
        </form>
      </div>
    </div>
  );
}
