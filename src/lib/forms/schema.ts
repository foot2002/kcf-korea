import { z } from "zod";

import { KOREA_REGIONS, MONITOR_INTERESTS, MONITOR_MODES } from "@/data/privacy-program";

const required = "입력해 주세요.";

function ask(label: string) {
  return `${label} 입력을 해주세요.`;
}

function formatOf(label: string) {
  return `${label} 형식을 확인해주세요.`;
}

function textField(label: string, max: number) {
  return z.string().trim().min(1, ask(label)).max(max, `${max}자까지 입력할 수 있습니다.`);
}

function mailField(label: string) {
  return z.string().trim().min(1, ask(label)).max(254, "254자까지 입력할 수 있습니다.").email(formatOf(label));
}

function telField(label: string) {
  return z
    .string()
    .trim()
    .min(1, ask(label))
    .max(30, "30자까지 입력할 수 있습니다.")
    .regex(/^[0-9+().\-\s]{8,30}$/, formatOf(label));
}

const privacyConsent = z.boolean().refine((value) => value, "개인정보 수집·이용 동의를 확인해주세요.");

export const orgName = z.string().trim().min(1, required).max(100, "100자까지 입력할 수 있습니다.");
export const personName = z.string().trim().min(1, required).max(50, "50자까지 입력할 수 있습니다.");
export const emailField = z
  .string()
  .trim()
  .min(1, "이메일을 입력해 주세요.")
  .max(254, "254자까지 입력할 수 있습니다.")
  .email("이메일 형식을 확인해 주세요.");
export const phoneField = z
  .string()
  .trim()
  .min(1, "연락처를 입력해 주세요.")
  .max(30, "30자까지 입력할 수 있습니다.")
  .regex(/^[0-9+().\-\s]{8,30}$/, "연락처 형식을 확인해 주세요.");
export const phoneOptional = z
  .string()
  .trim()
  .max(30, "30자까지 입력할 수 있습니다.")
  .refine((value) => value === "" || /^[0-9+().\-\s]{8,30}$/.test(value), "연락처 형식을 확인해 주세요.");
export const consentField = z.boolean().refine((value) => value, "동의가 필요합니다.");

export const FREE_ORG_KINDS = ["국회", "언론사", "공공기관", "협단체(회원사 100개 이상)"] as const;
export const CPO_PROMOTIONS = ["사내 공지", "언론 홍보", "둘 다"] as const;
export const INQUIRY_TYPES = ["재단", "개인정보보호진흥원", "무상제공", "교육·웨비나", "우수기관·SURE MARK", "기타"] as const;

export const FORM_NAMES = {
  free: "무상제공신청",
  cpo: "CPO지원",
  pledge: "실천선언참여",
  monitor: "지키미사전신청",
  contact: "문의",
} as const;

export type FormName = (typeof FORM_NAMES)[keyof typeof FORM_NAMES];

export const STATUSES = {
  [FORM_NAMES.free]: ["접수", "검토중", "약정 진행", "계정 개설", "이용 종료", "반려"],
  [FORM_NAMES.cpo]: ["접수", "검토중", "선정", "지원 중", "지원 종료", "반려"],
  [FORM_NAMES.pledge]: ["접수", "확인 완료", "게시", "게시 종료", "반려"],
  [FORM_NAMES.monitor]: ["사전 신청", "연락 완료", "선발", "미선발"],
  [FORM_NAMES.contact]: ["접수", "답변 중", "답변 완료", "종결"],
} as const;

export const STATUS_BADGE: Record<string, string> = {
  접수: "border-[#0B3A6E] text-[#0B3A6E]",
  "사전 신청": "border-[#0B3A6E] text-[#0B3A6E]",
  검토중: "border-[#0F766E] text-[#0F766E]",
  "답변 중": "border-[#0F766E] text-[#0F766E]",
  "연락 완료": "border-[#0F766E] text-[#0F766E]",
  "약정 진행": "border-[#0B3A6E] text-[#0B3A6E]",
  선정: "border-[#0B3A6E] text-[#0B3A6E]",
  "확인 완료": "border-[#0B3A6E] text-[#0B3A6E]",
  선발: "border-[#0B3A6E] text-[#0B3A6E]",
  "계정 개설": "border-[#0F766E] text-[#0F766E]",
  "지원 중": "border-[#0F766E] text-[#0F766E]",
  게시: "border-[#0F766E] text-[#0F766E]",
  "이용 종료": "border-[#4B5563] text-[#374151]",
  "지원 종료": "border-[#4B5563] text-[#374151]",
  "게시 종료": "border-[#4B5563] text-[#374151]",
  "답변 완료": "border-[#4B5563] text-[#374151]",
  종결: "border-[#4B5563] text-[#374151]",
  반려: "border-[#9A3412] text-[#9A3412]",
  미선발: "border-[#9A3412] text-[#9A3412]",
};

export const RETENTION = {
  [FORM_NAMES.free]: "상태가 '이용 종료' 또는 '반려'가 된 날 즉시 파기합니다. 그 전에는 만료일이 없습니다.",
  [FORM_NAMES.cpo]: "상태가 '지원 종료' 또는 '반려'가 된 날 즉시 파기합니다.",
  [FORM_NAMES.pledge]: "상태가 '게시 종료' 또는 '반려'가 된 날부터 1년 뒤 파기합니다.",
  [FORM_NAMES.monitor]: "접수일부터 18개월 뒤 파기합니다. 관리자가 보유기간을 바꿀 수 있습니다. '미선발'이 되면 그날부터 6개월 뒤 파기합니다.",
  [FORM_NAMES.contact]: "상태가 '답변 완료'가 된 날부터 3년 뒤 파기합니다.",
} as const;

export const freeSchema = z.object({
  orgName: textField("기관·단체명", 100),
  orgKind: z.enum(FREE_ORG_KINDS, { errorMap: () => ({ message: "구분 선택을 해주세요." }) }),
  representative: textField("대표자", 50),
  dpoName: textField("개인정보 보호책임자 성명", 50),
  dpoTitle: textField("개인정보 보호책임자 직위", 50),
  dpoPhone: telField("개인정보 보호책임자 연락처"),
  dpoEmail: mailField("개인정보 보호책임자 이메일"),
  adminName: textField("계정 관리자 성명", 50),
  adminTitle: textField("계정 관리자 직위", 50),
  adminPhone: telField("계정 관리자 연락처"),
  adminEmail: mailField("계정 관리자 이메일"),
  note: z.string().trim().max(2000, "2000자까지 입력할 수 있습니다."),
  consentPrivacy: privacyConsent,
});

/** 계정 관리자를 보호책임자와 같게 둔 경우, 계정 관리자 칸은 다시 검사하지 않습니다. */
export const freeSchemaSame = freeSchema
  .extend({
    adminName: z.string(),
    adminTitle: z.string(),
    adminPhone: z.string(),
    adminEmail: z.string(),
  })
  .transform((data) => ({
    ...data,
    adminName: data.dpoName,
    adminTitle: data.dpoTitle,
    adminPhone: data.dpoPhone,
    adminEmail: data.dpoEmail,
  }));

export const cpoSchema = z.object({
  company: textField("기업명", 100),
  representative: textField("대표자", 50),
  cpoName: textField("CPO 성명", 50),
  cpoTitle: textField("CPO 직위", 50),
  cpoPhone: telField("CPO 연락처"),
  cpoEmail: mailField("CPO 이메일"),
  work: z.string().trim().min(1, ask("개인정보 수집 업무 설명")).max(500, "500자까지 입력할 수 있습니다."),
  consentPrivacy: privacyConsent,
});

export const pledgeSchema = z.object({
  orgName: orgName,
  representative: personName,
  dpoName: personName,
  contactName: personName,
  contactEmail: emailField,
  contactPhone: phoneOptional,
  consentPublish: consentField,
  consentPrivacy: consentField,
});

export const monitorSchema = z.object({
  name: personName,
  email: emailField,
  region: z.enum(KOREA_REGIONS, { errorMap: () => ({ message: "거주 시·도를 선택해 주세요." }) }),
  interests: z.array(z.enum(MONITOR_INTERESTS)).min(1, "관심 분야를 하나 이상 선택해 주세요."),
  motivation: z.string().trim().min(1, required).max(500, "500자까지 입력할 수 있습니다."),
  mode: z.enum(MONITOR_MODES, { errorMap: () => ({ message: "활동 방식을 선택해 주세요." }) }),
  phone: phoneOptional,
  notify: z.boolean(),
  consentPrivacy: consentField,
});

export const contactSchema = z.object({
  type: z.enum(INQUIRY_TYPES, { errorMap: () => ({ message: "문의 유형을 선택해 주세요." }) }),
  affiliation: z.string().trim().max(100, "100자까지 입력할 수 있습니다."),
  name: personName,
  email: emailField,
  phone: phoneOptional,
  title: z.string().trim().min(1, required).max(200, "200자까지 입력할 수 있습니다."),
  body: z.string().trim().min(1, required).max(2000, "2000자까지 입력할 수 있습니다."),
  consentPrivacy: consentField,
});

export type FreeInput = z.infer<typeof freeSchema>;
export type CpoInput = z.infer<typeof cpoSchema>;
export type PledgeInput = z.infer<typeof pledgeSchema>;
export type MonitorInput = z.infer<typeof monitorSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export function fieldErrors(error: z.ZodError) {
  const next: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !next[key]) next[key] = issue.message;
  }
  return next;
}
