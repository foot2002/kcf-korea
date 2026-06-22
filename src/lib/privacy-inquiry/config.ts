/**
 * 개인정보보호진흥원 문의 — 파일 기반 저장 설정
 * DB 없이 `data/privacy-inquiries/` 디렉터리에 JSON + 첨부파일로 보관합니다.
 */

/** 문의 1건당 첨부 가능한 최대 파일 개수 */
export const MAX_ATTACHMENTS_PER_INQUIRY = 3;

/** 단일 첨부 파일 최대 용량 — 5MB */
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

/** 문의 1건당 첨부파일 총합 최대 용량 — 10MB */
export const MAX_TOTAL_ATTACHMENTS_BYTES = 10 * 1024 * 1024;

/** 허용 확장자 (소문자) */
export const ALLOWED_ATTACHMENT_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".hwp",
  ".hwpx",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".txt",
  ".zip",
] as const;

/** accept 속성용 MIME / 확장자 */
export const ATTACHMENT_ACCEPT =
  ".pdf,.doc,.docx,.hwp,.hwpx,.jpg,.jpeg,.png,.webp,.txt,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp,text/plain,application/zip";

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isAllowedAttachmentName(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ALLOWED_ATTACHMENT_EXTENSIONS.some((ext) => lower.endsWith(ext));
}
