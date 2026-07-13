import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrivacyConsentBlock } from "@/components/privacy/PrivacyConsentBlock";
import { submitContactInquiry } from "@/lib/contact-inquiry/api";
import {
  CONTACT_INQUIRY_CATEGORIES,
  type ContactInquiryCategory,
} from "@/lib/contact-inquiry/types";
import { validateContactInquiryForm } from "@/lib/contact-inquiry/validation";

export function ContactInquiryForm() {
  const [category, setCategory] = useState<ContactInquiryCategory>("재단문의");
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const result = validateContactInquiryForm({
      category,
      organization: String(fd.get("organization") ?? ""),
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
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
      await submitContactInquiry(result.data, honeypot);
      form.reset();
      setCategory("재단문의");
      setConsent(false);
      setHoneypot("");
      setSuccessOpen(true);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
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
        className="relative rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8"
      >
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="contact-hp">Leave blank</label>
          <input
            id="contact-hp"
            name="hp_field"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <h2 className="text-[20px] font-bold text-navy">문의하기</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
          문의 유형을 선택하고 내용을 남겨 주시면 담당자가 확인 후 연락드립니다.
        </p>

        <div className="mt-6">
          <label className="block text-[13px] font-semibold text-navy">문의 유형 *</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {CONTACT_INQUIRY_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={[
                  "rounded-full border px-4 py-2 text-[13px] font-semibold transition",
                  category === item
                    ? "border-trust-blue bg-trust-blue text-white"
                    : "border-border bg-white text-text-secondary hover:border-trust-blue/30",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="소속" name="organization" required className="sm:col-span-2" />
          <Field label="이름" name="name" required />
          <Field label="연락처" name="phone" required placeholder="010-0000-0000" />
          <Field
            label="이메일"
            name="email"
            type="email"
            placeholder="example@email.com"
            className="sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <label className="block text-[13px] font-semibold text-navy">
              문의 내용 <span className="text-trust-blue">*</span>
            </label>
            <textarea
              name="message"
              rows={6}
              required
              placeholder="문의 내용을 입력해 주세요."
              className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-[14.5px] focus:border-trust-blue focus:outline-none focus:ring-1 focus:ring-trust-blue/30"
            />
          </div>
        </div>

        <div className="mt-6">
          <PrivacyConsentBlock
            variant="contact-inquiry"
            consent={consent}
            onConsentChange={setConsent}
            id="contact-privacy-consent"
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
              문의 보내기
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">문의가 접수되었습니다</DialogTitle>
            <DialogDescription className="mt-2 text-[14.5px] leading-relaxed text-text-secondary">
              담당자가 내용을 확인한 뒤 연락드리겠습니다. 감사합니다.
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
        className="mt-2 h-12 w-full rounded-xl border border-border px-4 text-[14.5px] focus:border-trust-blue focus:outline-none focus:ring-1 focus:ring-trust-blue/30"
      />
    </div>
  );
}
