import { useState } from "react";
import { ArrowRight, Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { submitAssociationApplication } from "@/lib/association-application/api";
import { validateAssociationApplicationForm } from "@/lib/association-application/validation";

const PREFERRED_CONTACT_OPTIONS = ["전화", "이메일", "둘 다"] as const;

export function AssociationApplicationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [consent, setConsent] = useState(false);
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const result = validateAssociationApplicationForm({
      associationName: String(fd.get("associationName") ?? ""),
      websiteUrl: String(fd.get("websiteUrl") ?? ""),
      memberCompanyCount: Number(fd.get("memberCompanyCount")),
      managerName: String(fd.get("managerName") ?? ""),
      managerPhone: String(fd.get("managerPhone") ?? ""),
      managerEmail: String(fd.get("managerEmail") ?? ""),
      representativeName: String(fd.get("representativeName") ?? ""),
      businessNumber: String(fd.get("businessNumber") ?? ""),
      establishedYear: String(fd.get("establishedYear") ?? ""),
      address: String(fd.get("address") ?? ""),
      industry: String(fd.get("industry") ?? ""),
      smallBusinessMemberCount: String(fd.get("smallBusinessMemberCount") ?? ""),
      managerPosition: String(fd.get("managerPosition") ?? ""),
      preferredContactMethod: String(fd.get("preferredContactMethod") ?? ""),
      message: String(fd.get("message") ?? ""),
      privacyConsent: consent,
      newsletterConsent,
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
      setConsent(false);
      setNewsletterConsent(false);
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

  function handleSuccessClose() {
    setSuccessOpen(false);
  }

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8"
      >
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="hp-field">Leave blank</label>
          <input
            id="hp-field"
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

        <FormSection title="필수 기본정보">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="협회·단체명" name="associationName" required />
            <FormField
              label="웹사이트 주소"
              name="websiteUrl"
              required
              placeholder="www.example.or.kr"
              hint="https:// 없이 입력해도 자동 보정됩니다."
            />
            <FormField
              label="총 회원사 수"
              name="memberCompanyCount"
              type="number"
              required
              min={1}
              placeholder="예: 350"
            />
            <FormField label="담당자명" name="managerName" required />
            <FormField label="전화번호" name="managerPhone" type="tel" required placeholder="010-0000-0000" />
            <FormField label="이메일" name="managerEmail" type="email" required />
          </div>
        </FormSection>

        <FormSection title="추가 협약정보" subtitle="선택 입력">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="대표자 성명" name="representativeName" />
            <FormField
              label="사업자등록번호"
              name="businessNumber"
              placeholder="000-00-00000"
              hint="형식: 000-00-00000"
            />
            <FormField label="설립연도" name="establishedYear" placeholder="예: 1998" />
            <FormField label="주요 업종·분야" name="industry" placeholder="예: 서비스업" />
            <FormField
              label="소기업 회원사 수"
              name="smallBusinessMemberCount"
              placeholder="숫자 또는 '모름'"
            />
            <FormField label="담당자 직함·부서" name="managerPosition" placeholder="예: 사무국장 / 총무팀" />
            <FormField label="선호 연락 방법" name="preferredContactMethod" as="select" options={[...PREFERRED_CONTACT_OPTIONS]} />
          </div>
          <div className="mt-5 sm:col-span-2">
            <FormField label="주소" name="address" placeholder="협회·단체 소재지" />
          </div>
          <div className="mt-5">
            <FormField
              label="문의사항"
              name="message"
              as="textarea"
              maxLength={1000}
              placeholder="협약 참여 희망 사유, 회원사 규모, 문의 사항 등을 입력해 주세요."
            />
            <p className="mt-1 text-[12px] text-text-muted">최대 1,000자</p>
          </div>
        </FormSection>

        <div className="mt-6 rounded-xl border border-border bg-section-bg p-4">
          <p className="text-[13px] leading-relaxed text-text-secondary">
            개인정보보호진흥원은 협단체 협약 신청 접수 및 SURE START 지원사업 안내를 위해 협회·단체명,
            웹사이트 주소, 회원사 수, 담당자명, 전화번호, 이메일, 문의사항 및 협약 진행에 필요한 추가
            정보를 수집·이용합니다. 수집된 정보는 협약 신청 확인, 담당자 연락, 협약 체결, 회원사
            지원사업 운영 목적으로만 사용되며, 목적 달성 후 지체 없이 파기합니다.
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-2 text-[13.5px] text-text-primary">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
            />
            개인정보 수집·이용에 동의합니다.
          </label>
          <label className="mt-3 flex cursor-pointer items-start gap-2 text-[13.5px] text-text-secondary">
            <input
              type="checkbox"
              checked={newsletterConsent}
              onChange={(e) => setNewsletterConsent(e.target.checked)}
              className="mt-1"
            />
            개인정보보호진흥원 공지·뉴스레터 수신에 동의합니다. (선택)
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary-kcf mt-6 inline-flex w-full items-center justify-center gap-2 sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              접수 중…
            </>
          ) : (
            <>
              협약 신청하기
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-md text-center sm:rounded-2xl">
          <DialogHeader className="items-center">
            <ShieldCheck className="h-14 w-14 text-privacy-green" />
            <DialogTitle className="mt-2 text-[20px] text-navy">신청이 완료되었습니다</DialogTitle>
            <DialogDescription className="mt-3 space-y-3 text-[15px] leading-relaxed text-text-secondary">
              <span className="block">
                담당자가 24시간 내에 연락드리겠습니다.
              </span>
              <span className="block font-medium text-navy">
                신청해 주셔서 진심으로 감사드립니다.
              </span>
            </DialogDescription>
          </DialogHeader>
          <button type="button" onClick={handleSuccessClose} className="btn-primary-kcf mt-2 w-full">
            확인
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FormSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 border-t border-border pt-8 first:mt-6 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-2">
        <h3 className="text-[16px] font-bold text-navy">{title}</h3>
        {subtitle && <span className="text-[12.5px] text-text-muted">{subtitle}</span>}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  as,
  options,
  required,
  placeholder,
  hint,
  min,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "textarea" | "select";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  hint?: string;
  min?: number;
  maxLength?: number;
}) {
  const base =
    "mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-[14.5px] text-text-primary placeholder:text-text-muted focus:border-trust-blue focus:outline-none focus:ring-1 focus:ring-trust-blue/30";

  return (
    <label className="block text-[13px] font-semibold text-navy">
      {label} {required && <span className="text-trust-blue">*</span>}
      {as === "textarea" ? (
        <textarea
          name={name}
          rows={4}
          maxLength={maxLength}
          placeholder={placeholder}
          className={base}
        />
      ) : as === "select" ? (
        <select name={name} defaultValue="" className={base}>
          <option value="">선택해 주세요</option>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          min={min}
          maxLength={maxLength}
          className={base}
        />
      )}
      {hint && <span className="mt-1 block text-[12px] font-normal text-text-muted">{hint}</span>}
    </label>
  );
}
