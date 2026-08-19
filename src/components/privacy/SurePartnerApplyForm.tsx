import { useState } from "react";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrivacyConsentBlock } from "@/components/privacy/PrivacyConsentBlock";
import { submitSurePartnerApplication } from "@/lib/sure-partner-apply/api";
import { validateSurePartnerApplyForm } from "@/lib/sure-partner-apply/validation";

const INPUT_CLASS =
  "mt-1.5 h-[48px] w-full rounded-[13px] border border-[var(--pc-border)] bg-white px-4 text-[14.5px] text-text-primary placeholder:text-text-muted focus:border-trust-blue focus:outline-none focus:ring-2 focus:ring-trust-blue/20";

const TEXTAREA_CLASS =
  "mt-1.5 w-full rounded-[13px] border border-[var(--pc-border)] bg-white px-4 py-3 text-[14.5px] text-text-primary placeholder:text-text-muted focus:border-trust-blue focus:outline-none focus:ring-2 focus:ring-trust-blue/20";

export function SurePartnerApplyForm() {
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [receiptId, setReceiptId] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const result = validateSurePartnerApplyForm({
      companyName: String(fd.get("companyName") ?? ""),
      managerName: String(fd.get("managerName") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      serviceName: String(fd.get("serviceName") ?? ""),
      strengths: String(fd.get("strengths") ?? ""),
      privacyConsent: consent,
      honeypot,
    });

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setSubmitting(true);
    try {
      const { id } = await submitSurePartnerApplication(result.data, honeypot);
      form.reset();
      setConsent(false);
      setHoneypot("");
      setReceiptId(id);
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
          <label htmlFor="sure-partner-hp">Leave blank</label>
          <input
            id="sure-partner-hp"
            name="hp_field"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--pc-soft-blue)] text-trust-blue ring-1 ring-[var(--pc-border)]">
            <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-navy">안심 파트너 심사 신청</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary">
              개인정보 관련 전문 서비스·솔루션을 보유한 기업이라면 안심인증 파트너 심사를
              신청해 주세요. 담당자가 검토 후 연락드립니다.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Field
            label="기업명"
            name="companyName"
            required
            placeholder="예: ○○주식회사"
            className="sm:col-span-2"
          />
          <Field label="담당자" name="managerName" required placeholder="홍길동" />
          <Field label="연락처" name="phone" required placeholder="010-0000-0000" />
          <Field
            label="이메일"
            name="email"
            type="email"
            placeholder="example@company.com"
            className="sm:col-span-2"
          />
          <Field
            label="보유 개인정보 서비스명"
            name="serviceName"
            required
            placeholder="예: 개인정보 접속기록 관리 솔루션"
            className="sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <label htmlFor="strengths" className="block text-[13px] font-semibold text-navy">
              특징 및 장점 <span className="text-trust-blue">*</span>
            </label>
            <textarea
              id="strengths"
              name="strengths"
              rows={5}
              required
              placeholder="서비스의 개인정보 관련 전문성, 차별점, 주요 고객군 등을 적어 주세요."
              className={TEXTAREA_CLASS}
            />
          </div>
        </div>

        <div className="mt-6">
          <PrivacyConsentBlock
            variant="sure-partner-apply"
            consent={consent}
            onConsentChange={setConsent}
            id="sure-partner-privacy-consent"
          />
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
              심사 신청하기
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">심사가 접수되었습니다</DialogTitle>
            <DialogDescription className="mt-2 text-[14.5px] leading-relaxed text-text-secondary">
              안심 파트너 심사 신청이 정상적으로 접수되었습니다.
              {receiptId ? (
                <>
                  {" "}
                  접수번호는 <strong className="text-navy">{receiptId}</strong> 입니다.
                </>
              ) : null}{" "}
              담당자가 내용을 검토한 뒤 연락드리겠습니다.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-[13px] font-semibold text-navy">
        {label} {required && <span className="text-trust-blue">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
    </div>
  );
}
