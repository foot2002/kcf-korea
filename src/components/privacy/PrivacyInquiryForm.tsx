import { useRef, useState } from "react";
import { ArrowRight, AlertTriangle, Paperclip, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  ATTACHMENT_ACCEPT,
  formatBytes,
  isAllowedAttachmentName,
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENTS_PER_INQUIRY,
  MAX_TOTAL_ATTACHMENTS_BYTES,
} from "@/lib/privacy-inquiry/config";
import type { PrivacyInquiryAttachmentInput } from "@/lib/privacy-inquiry/types";
import { submitPrivacyInquiry } from "@/lib/privacy-inquiry/actions";
import { formatUserError } from "@/lib/privacy-inquiry/errors";

const INQUIRY_TYPES = [
  "서비스 추천 기준 문의",
  "침해 의심 사례 제보",
  "정책연구 공동 제안",
  "포럼·단체 활동 참여",
  "기타",
] as const;

async function readFileAsBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

export function PrivacyInquiryForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  function validateFiles(next: File[]): string | null {
    if (next.length > MAX_ATTACHMENTS_PER_INQUIRY) {
      return `첨부파일은 최대 ${MAX_ATTACHMENTS_PER_INQUIRY}개까지 가능합니다.`;
    }
    let total = 0;
    for (const file of next) {
      if (!isAllowedAttachmentName(file.name)) {
        return `허용되지 않는 파일 형식입니다: ${file.name}`;
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        return `파일당 최대 5MB입니다: ${file.name}`;
      }
      total += file.size;
    }
    if (total > MAX_TOTAL_ATTACHMENTS_BYTES) {
      return "첨부파일 총 용량은 10MB를 초과할 수 없습니다.";
    }
    return null;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const merged = [...files, ...picked];
    const error = validateFiles(merged);
    if (error) {
      toast.error(error);
      e.target.value = "";
      return;
    }
    setFiles(merged);
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      toast.error("개인정보 수집·이용에 동의해 주세요.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);

    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const type = String(fd.get("type") ?? "").trim();
    const content = String(fd.get("content") ?? "").trim();

    if (!name) {
      toast.error("이름 또는 기관명을 입력해 주세요.");
      return;
    }
    if (!email) {
      toast.error("이메일을 입력해 주세요.");
      return;
    }
    if (!type) {
      toast.error("문의 유형을 선택해 주세요.");
      return;
    }
    if (content.length < 10) {
      toast.error("문의 내용을 10자 이상 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const attachments: PrivacyInquiryAttachmentInput[] = [];
      for (const file of files) {
        attachments.push({
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          dataBase64: await readFileAsBase64(file),
        });
      }

      await submitPrivacyInquiry({
        data: {
          name,
          email,
          phone: phone || undefined,
          type,
          content,
          consent: true,
          attachments,
        },
      });

      toast.success("문의가 접수되었습니다", {
        description: "담당자가 확인 후 연락드리겠습니다.",
      });

      form.reset();
      setConsent(false);
      setFiles([]);
    } catch (err) {
      toast.error(formatUserError(err));
    } finally {
      setSubmitting(false);
    }
  }

  const totalFileSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/15 bg-white/5 p-7 backdrop-blur"
    >
      <div className="text-[18px] font-bold text-white">문의 및 제보</div>
      <div className="mt-1 text-[13px] text-white/60">
        개인정보 최소 수집 원칙에 따라 필요한 항목만 입력해 주세요.
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="이름 또는 기관명" name="name" required />
        <Field label="연락처 (선택)" name="phone" />
        <Field label="이메일" name="email" type="email" required />
        <Field label="문의 유형" name="type" as="select" options={[...INQUIRY_TYPES]} required />
      </div>
      <div className="mt-4">
        <Field label="문의 내용" name="content" as="textarea" required minLength={10} />
        <p className="mt-1.5 text-[12px] text-white/50">10자 이상 입력해 주세요.</p>
      </div>

      <div className="mt-4 rounded-xl border border-[#FCD34D]/40 bg-[#FFFBEB]/10 p-4 text-[13px] leading-relaxed text-[#FDE68A]">
        <AlertTriangle className="mr-1 -mt-0.5 inline h-4 w-4" />
        신고·제보 내용에 주민등록번호, 계좌번호, 상세 건강정보 등 민감정보는 입력하지
        마세요.
      </div>

      <div className="mt-4 flex items-start gap-2 text-[13.5px] text-white/85">
        <input
          id="privacy-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
          required
        />
        <label htmlFor="privacy-consent">
          개인정보 수집·이용에 동의합니다. (수집 항목: 이름·연락처·이메일, 목적: 문의
          응대, 보유기간: 응대 완료 후 즉시 파기)
        </label>
      </div>

      {/* 파일 첨부 — DB 없이 서버 로컬 디스크(data/privacy-inquiries/files/)에 저장 */}
      <div className="mt-4 rounded-xl border border-dashed border-white/25 bg-white/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[13px] font-semibold text-white">파일 첨부 (선택)</div>
            <div className="mt-1 text-[12px] text-white/55">
              PDF, DOC, HWP, JPG, PNG, TXT, ZIP · 파일당 5MB · 최대 3개 · 총 10MB
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= MAX_ATTACHMENTS_PER_INQUIRY || submitting}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:bg-white/15 disabled:opacity-50"
          >
            <Paperclip className="h-3.5 w-3.5" />
            파일 선택
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ATTACHMENT_ACCEPT}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center justify-between gap-2 rounded-lg bg-white/10 px-3 py-2 text-[12.5px] text-white/90"
              >
                <span className="truncate">
                  {file.name}{" "}
                  <span className="text-white/50">({formatBytes(file.size)})</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="shrink-0 rounded p-1 hover:bg-white/10"
                  aria-label={`${file.name} 제거`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
            <li className="text-[11.5px] text-white/45">
              첨부 합계: {formatBytes(totalFileSize)} / {formatBytes(MAX_TOTAL_ATTACHMENTS_BYTES)}
            </li>
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-navy transition hover:bg-soft-sky disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            접수 중…
          </>
        ) : (
          <>
            문의 보내기 <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  as,
  options,
  required,
  minLength,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "textarea" | "select";
  options?: string[];
  required?: boolean;
  minLength?: number;
}) {
  const base =
    "mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-[14.5px] text-white placeholder:text-white/40 focus:border-[#5EEAD4] focus:outline-none";
  return (
    <label className="block text-[13px] font-semibold text-white/85">
      {label} {required && <span className="text-[#5EEAD4]">*</span>}
      {as === "textarea" ? (
        <textarea
          name={name}
          rows={5}
          required={required}
          minLength={minLength}
          className={base}
        />
      ) : as === "select" ? (
        <select name={name} required={required} defaultValue="" className={base}>
          <option value="" className="text-navy">
            선택해 주세요
          </option>
          {options?.map((o) => (
            <option key={o} value={o} className="text-navy">
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} name={name} required={required} className={base} />
      )}
    </label>
  );
}
