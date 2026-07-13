import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrivacyConsentBlock } from "@/components/privacy/PrivacyConsentBlock";
import { supportApplicationConsentVariant } from "@/data/privacy-consent";
import { submitAssociationApplication } from "@/lib/association-application/api";
import type { ApplicationKind } from "@/lib/association-application/types";
import { organizationFieldLabel } from "@/lib/association-application/types";
import { validateSupportApplicationForm } from "@/lib/association-application/validation";

const SUBMIT_LABELS: Record<ApplicationKind, string> = {
  association: "협약/바우처 신청하기",
  enterprise: "기업 신청하기",
  public: "공공기관 신청하기",
};

const INPUT_CLASS =
  "mt-1.5 h-[48px] w-full rounded-[13px] border border-[var(--pc-border)] bg-white px-4 text-[14.5px] text-text-primary placeholder:text-text-muted focus:border-trust-blue focus:outline-none focus:ring-2 focus:ring-trust-blue/20";

const TEXTAREA_CLASS =
  "mt-1.5 w-full rounded-[13px] border border-[var(--pc-border)] bg-white px-4 py-3 text-[14.5px] text-text-primary placeholder:text-text-muted focus:border-trust-blue focus:outline-none focus:ring-2 focus:ring-trust-blue/20";

export function SupportApplicationForm({
  kind,
  prefillOrgName = "",
}: {
  kind: ApplicationKind;
  prefillOrgName?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [consent, setConsent] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [orgName, setOrgName] = useState(prefillOrgName);

  useEffect(() => {
    setOrgName(prefillOrgName);
  }, [prefillOrgName, kind]);

  const orgLabel = organizationFieldLabel(kind);
  const isAssociation = kind === "association";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const result = validateSupportApplicationForm(kind, {
      associationName: String(fd.get("associationName") ?? ""),
      managerName: String(fd.get("managerName") ?? ""),
      managerPhone: String(fd.get("managerPhone") ?? ""),
      managerEmail: String(fd.get("managerEmail") ?? ""),
      message: String(fd.get("message") ?? ""),
      websiteUrl: String(fd.get("websiteUrl") ?? ""),
      memberCompanyCount: String(fd.get("memberCompanyCount") ?? ""),
      representativeName: String(fd.get("representativeName") ?? ""),
      businessNumber: String(fd.get("businessNumber") ?? ""),
      establishedYear: String(fd.get("establishedYear") ?? ""),
      address: String(fd.get("address") ?? ""),
      industry: String(fd.get("industry") ?? ""),
      smallBusinessMemberCount: String(fd.get("smallBusinessMemberCount") ?? ""),
      managerPosition: String(fd.get("managerPosition") ?? ""),
      preferredContactMethod: String(fd.get("preferredContactMethod") ?? ""),
      newsletterConsent: newsletter,
      privacyConsent: consent,
      honeypot,
    });

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setSubmitting(true);
    try {
      await submitAssociationApplication(result.data, honeypot);
      form.reset();
      setOrgName("");
      setConsent(false);
      setNewsletter(false);
      setHoneypot("");
      setSuccessOpen(true);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "신청 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="relative rounded-[1.375rem] border border-[var(--pc-border)] bg-white p-6 shadow-[0_8px_28px_rgba(7,21,41,0.06)] md:p-8"
      >
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor={`hp-field-${kind}`}>Leave blank</label>
          <input
            id={`hp-field-${kind}`}
            name="hp_field"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 text-[14px] font-semibold text-trust-blue">
          <Lock className="h-4 w-4" />
          비공개 접수 · 담당자 확인 후 연락
        </div>

        {isAssociation && (
          <>
            <h3 className="mt-6 text-[15px] font-bold text-navy">필수 기본정보</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField label={orgLabel} name="associationName" required className="sm:col-span-2" value={orgName} onChange={setOrgName} />
              <FormField label="웹사이트 주소" name="websiteUrl" required placeholder="https://example.org" className="sm:col-span-2" />
              <FormField label="총 회원사 수" name="memberCompanyCount" type="number" required placeholder="예: 120" min={1} />
              <FormField label="담당자명" name="managerName" required />
              <FormField label="전화번호" name="managerPhone" type="tel" required placeholder="02-0000-0000" />
              <FormField label="이메일" name="managerEmail" type="email" required className="sm:col-span-2" />
            </div>

            <h3 className="mt-8 text-[15px] font-bold text-navy">추가 협약정보 (선택)</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField label="대표자 성명" name="representativeName" />
              <FormField label="사업자등록번호" name="businessNumber" placeholder="000-00-00000" />
              <FormField label="설립연도" name="establishedYear" placeholder="예: 1998" />
              <FormField label="주요 업종·분야" name="industry" />
              <FormField label="주소" name="address" className="sm:col-span-2" />
              <FormField label="소기업 회원사 수" name="smallBusinessMemberCount" placeholder="예: 45" />
              <FormField label="담당자 직함·부서" name="managerPosition" />
              <FormField label="선호 연락 방법" name="preferredContactMethod" placeholder="전화 / 이메일" className="sm:col-span-2" />
              <FormField label="문의사항" name="message" as="textarea" maxLength={1000} placeholder="협약 관련 문의나 신청 배경을 남겨 주세요." className="sm:col-span-2" />
            </div>
            <label className="mt-4 flex items-start gap-2.5 text-[13.5px] text-text-secondary">
              <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-1" />
              뉴스레터 및 지원사업 안내 수신에 동의합니다. (선택)
            </label>
          </>
        )}

        {!isAssociation && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <FormField label={orgLabel} name="associationName" required className="sm:col-span-2" value={orgName} onChange={setOrgName} />
            <FormField label="담당자명" name="managerName" required />
            <FormField label="연락처" name="managerPhone" type="tel" required placeholder="010-0000-0000" />
            <FormField label="이메일" name="managerEmail" type="email" required className="sm:col-span-2" />
            <FormField label="남기는 글" name="message" as="textarea" maxLength={1000} placeholder="문의 사항이나 신청 배경을 간단히 남겨 주세요." className="sm:col-span-2" />
          </div>
        )}

        <div className="mt-6">
          <PrivacyConsentBlock
            variant={supportApplicationConsentVariant(kind)}
            consent={consent}
            onConsentChange={setConsent}
            id={`support-privacy-consent-${kind}`}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary-kcf mt-6 inline-flex w-full items-center justify-center gap-2 !py-3.5 text-[15px] sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              접수 중…
            </>
          ) : (
            <>
              {SUBMIT_LABELS[kind]}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-md text-center sm:rounded-2xl">
          <DialogHeader className="items-center">
            <ShieldCheck className="h-14 w-14 text-[var(--pc-teal)]" />
            <DialogTitle className="mt-2 text-[20px] text-navy">신청이 완료되었습니다</DialogTitle>
            <DialogDescription className="mt-3 space-y-3 text-[15px] leading-relaxed text-text-secondary">
              <span className="block">담당자가 확인 후 영업일 기준 1~2일 이내 연락드리겠습니다.</span>
              <span className="block font-medium text-navy">신청해 주셔서 진심으로 감사드립니다.</span>
            </DialogDescription>
          </DialogHeader>
          <button type="button" onClick={() => setSuccessOpen(false)} className="btn-primary-kcf mt-2 w-full">
            확인
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FormField({
  label,
  name,
  type = "text",
  as,
  required,
  placeholder,
  maxLength,
  min,
  className = "",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "textarea";
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className={`block text-[13px] font-semibold text-navy ${className}`}>
      {label}{" "}
      {required ? (
        <span className="rounded bg-soft-sky px-1.5 py-0.5 text-[10px] font-bold text-trust-blue">필수</span>
      ) : (
        <span className="text-[11px] font-medium text-text-muted">선택</span>
      )}
      {as === "textarea" ? (
        <textarea name={name} rows={4} maxLength={maxLength} placeholder={placeholder} className={TEXTAREA_CLASS} />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          className={INPUT_CLASS}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      )}
    </label>
  );
}
