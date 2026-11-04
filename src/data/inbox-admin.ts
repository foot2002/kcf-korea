import { FORM_NAMES, type FormName } from "@/lib/forms/schema";

export type InboxView =
  | "inbox-settings"
  | "inbox-dashboard"
  | "inbox-free"
  | "inbox-cpo"
  | "inbox-pledge"
  | "inbox-monitor"
  | "inbox-contact"
  | "inbox-audit";

export const INBOX_NAV: { id: InboxView; label: string; form?: FormName }[] = [
  { id: "inbox-settings", label: "신청함 설정" },
  { id: "inbox-dashboard", label: "신청함 대시보드" },
  { id: "inbox-free", label: "무상제공 신청", form: FORM_NAMES.free },
  { id: "inbox-cpo", label: "CPO 특별 지원", form: FORM_NAMES.cpo },
  { id: "inbox-pledge", label: "실천선언 참여", form: FORM_NAMES.pledge },
  { id: "inbox-monitor", label: "지키미 사전 신청", form: FORM_NAMES.monitor },
  { id: "inbox-contact", label: "문의", form: FORM_NAMES.contact },
  { id: "inbox-audit", label: "작업 기록" },
];

export const FIELD_LABELS: Record<string, string> = {
  orgName: "기관·단체명",
  orgKind: "구분",
  representative: "대표자",
  dpoName: "개인정보 보호책임자",
  dpoTitle: "보호책임자 직위",
  dpoPhone: "보호책임자 연락처",
  dpoEmail: "보호책임자 이메일",
  adminName: "계정 관리자",
  adminTitle: "계정 관리자 직위",
  adminPhone: "계정 관리자 연락처",
  adminEmail: "계정 관리자 이메일",
  note: "남길 말",
  company: "기업명",
  cpoName: "CPO 성명",
  cpoTitle: "CPO 직위",
  cpoPhone: "CPO 연락처",
  cpoEmail: "CPO 이메일",
  work: "개인정보 수집 업무",
  promotion: "홍보 방식",
  contactName: "담당자 이름",
  contactEmail: "담당자 이메일",
  contactPhone: "담당자 연락처",
  name: "이름",
  email: "이메일",
  region: "거주 시·도",
  interests: "관심 분야",
  motivation: "참여 동기",
  mode: "희망 활동 방식",
  phone: "연락처",
  notify: "모집 소식 알림",
  type: "문의 유형",
  affiliation: "소속",
  title: "제목",
  body: "내용",
  consentPledge: "서약 동의",
  consentPublish: "공개 동의",
  consentExclude: "위반 시 명단 제외 동의",
  consentPrivacy: "개인정보 동의",
};

export const AUDIT_LABELS: Record<string, string> = {
  view: "열람",
  update: "수정",
  delete: "삭제",
  export: "내보내기",
  download: "내려받기",
  restore: "되살리기",
  purge: "기록 파기",
};

export const KEY_WARNING = "새 열쇠를 만들면 이전 열쇠로 암호화된 신청은 이전 개인 키로만 열 수 있습니다";
export const KEY_KEEP = "개인 키 파일은 두 곳에 보관하세요. 열쇠를 잃어버리면 이미 받은 신청서를 열 수 없습니다.";
export const PURGE_NOTE = "GitHub는 지운 파일도 커밋 기록에 남습니다. 한 달에 한 번, 보관함 저장소만 현재 남은 파일로 기록을 새로 만드세요. 사이트 저장소에는 실행하지 않습니다.";
export const DELETE_CONFIRM = "되돌릴 수 없습니다";
