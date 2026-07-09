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
import { submitAssociationApplication } from "@/lib/association-application/api";
import type { ApplicationKind } from "@/lib/association-application/types";
import { organizationFieldLabel } from "@/lib/association-application/types";
import { validateSupportApplicationForm } from "@/lib/association-application/validation";

const SUBMIT_LABELS: Record<ApplicationKind, string> = {
  association: "협약/바우처 신청하기",
  enterprise: "기업 신청하기",
  public: "공공기관 신청하기",
};

const PRIVACY_NOTICES: Record<ApplicationKind, string> = {
  association:
    "개인정보보호진흥원은 협약/바우처 신청 접수 및 SURE 지원사업 안내를 위해 협회·단체명, 담당자명, 연락처, 이메일, 남기는 글을 수집·이용합니다. 수집된 정보는 협약 확인 및 담당자 연락 목적으로만 사용되며, 목적 달성 후 지체 없이 파기합니다.",
  enterprise:
    "개인정보보호진흥원은 기업 지원 신청 접수를 위해 기업명, 담당자명, 연락처, 이메일, 남기는 글을 수집·이용합니다. 수집된 정보는 신청 확인 및 담당자 연락 목적으로만 사용되며, 목적 달성 후 지체 없이 파기합니다.",
  public:
    "개인정보보호진흥원은 공공기관 지원 신청 접수를 위해 기관명, 담당자명, 연락처, 이메일, 남기는 글을 수집·이용합니다. 수집된 정보는 신청 확인 및 담당자 연락 목적으로만 사용되며, 목적 달성 후 지체 없이 파기합니다.",
};

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
  const [honeypot, setHoneypot] = useState("");
  const [orgName, setOrgName] = useState(prefillOrgName);

  useEffect(() => {
    setOrgName(prefillOrgName);
  }, [prefillOrgName, kind]);

  const orgLabel = organizationFieldLabel(kind);

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
        className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8"
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

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField
            label={orgLabel}
            name="associationName"
            required
            className="sm:col-span-2"
            value={orgName}
            onChange={setOrgName}
          />
          <FormField label="담당자명" name="managerName" required />
          <FormField label="연락처" name="managerPhone" type="tel" required placeholder="010-0000-0000" />
          <FormField label="이메일" name="managerEmail" type="email" required className="sm:col-span-2" />
          <FormField
            label="남기는 글"
            name="message"
            as="textarea"
            maxLength={1000}
            placeholder="문의 사항이나 신청 배경을 간단히 남겨 주세요."
            className="sm:col-span-2"
          />
        </div>
        <p className="mt-1 text-[12px] text-text-muted">남기는 글은 최대 1,000자 (선택)</p>

        <div className="mt-6 rounded-xl border border-border bg-section-bg p-4">
          <p className="text-[13px] leading-relaxed text-text-secondary">
            {PRIVACY_NOTICES[kind]}
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
              {SUBMIT_LABELS[kind]}
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
              <span className="block">담당자가 확인 후 연락드리겠습니다.</span>
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
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const base =
    "mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-[14.5px] text-text-primary placeholder:text-text-muted focus:border-trust-blue focus:outline-none focus:ring-1 focus:ring-trust-blue/30";

  return (
    <label className={`block text-[13px] font-semibold text-navy ${className}`}>
      {label} {required && <span className="text-trust-blue">*</span>}
      {as === "textarea" ? (
        <textarea
          name={name}
          rows={4}
          maxLength={maxLength}
          placeholder={placeholder}
          className={base}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          maxLength={maxLength}
          className={base}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      )}
    </label>
  );
}
