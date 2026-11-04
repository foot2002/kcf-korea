export const SURE_MARK = {
  name: "SURE MARK",
  fullName: "Secure User Response Environment Mark",
  promise: "고객의 개인정보를 안심하고 맡기셔도 됩니다",
  description:
    "공익법인 한국컨설팅산업재단이 「개인정보보호 실천기관」에 드리는 개인정보보호 실천기관 표시입니다. 별도 신청, 허락이나 비용 없이 선정 기관이 자유롭게 사용할 수 있습니다.",
  disclaimer: "재단 자체 기준에 따른 선정이며, 법정 인증이나 정부 인증을 대신하지 않습니다.",
  logo: "downloads/sure-mark.png",
  files: [
    { label: "SURE MARK PNG (투명 배경)", file: "downloads/sure-mark.png" },
    { label: "SURE MARK JPG", file: "downloads/sure-mark.jpg" },
  ],
};

export const SURE_MARK_USAGE = [
  { title: "온라인 설문·대외조사·이벤트 신청 화면 첫머리", body: "응답자가 안심하고 참여해 응답률과 신뢰가 높아집니다." },
  { title: "개인정보 처리방침·개인정보 보호 공지, 홈페이지 하단", body: "고객에게 개인정보 보호 약속을 상시 보여 줍니다." },
  { title: "보도자료·소식지·SNS·기관 소개 자료", body: "개인정보 보호 실천을 대외에 알리는 홍보 자료로 활용합니다." },
  {
    title: "기관 보고서·실적 자료",
    body: "지속가능경영(ESG) 보고서의 정보보호 항목, 고객 신뢰 제고 활동 실적, 대외 협력·수상 실적 등에 선정 사실과 인증서를 근거 자료로 기재할 수 있습니다.",
  },
];

export const SURE_MARK_RULES = [
  "선정 기관이 기한 없이 사용할 수 있으며, 정보유출 사고 시 회수될 수 있습니다.",
  "마크의 비율과 색상을 바꾸지 않고 원본 그대로 사용합니다.",
  "최소 표시 크기: ", // TODO(확인): 최소 크기 값
];

export const SURE_MARK_SUPPORT = [
  "재단 홈페이지 「개인정보보호 실천기관」 명단 게시",
  "실천 사례 소개",
  "실물 인증서 전달 및 수여식 (희망 시)",
];

export const EXCELLENCE = {
  title: "개인정보보호실천 우수기관",
  purpose:
    "재단의 개선 권고에 적극 참여하여 온라인 설문조사의 개인정보 처리 방식을 스스로 개선한 기관을 「개인정보보호실천 우수기관」으로 선정하고, 개인정보보호 실천기관 표시인 SURE MARK 인증서를 수여함으로써 공공부문의 자발적 개인정보 보호 실천을 확산하고 그 성과를 국민에게 널리 알립니다.",
  criteriaBase: "개선 권고를 적극 수용하고 재단에 회신서(문서)로 조치 내용을 알린 기관",
  criteriaActionsLead: "아래 실천 조치 중 하나 이상을 이행하였거나 이행 계획을 확정한 기관",
  criteriaActions: [
    "개인정보를 수집하던 해당 설문의 종료·링크 삭제 및 수집 정보의 파기",
    "보안인증(CSAP 등)을 받은 설문 플랫폼 사용 안내 또는 전환",
    "수집 목적·항목·보유기간·파기 시점·문의처 등 고지사항 보완",
    "응답 자료에 대한 접근 통제 등 내부 관리 조치 마련",
  ],
  benefits: [
    "「개인정보보호실천 우수기관」 인증서 1부 (발급 명의: 공익법인 한국컨설팅산업재단 개인정보보호진흥원)",
    "개인정보보호 실천기관 표시 SURE MARK 사용 — 기관의 개인정보 보호 공지, 대외조사, 홍보 등에 자유롭게 활용",
    "재단 홈페이지 「개인정보보호 실천(우수)기관」 현황 게시 및 실천 사례 소개",
  ],
  notices: [
    "「개인정보보호실천 우수기관」 선정과 SURE MARK는 재단이 자체 기준에 따라 실천 노력을 인정하는 것입니다.",
    "실천 사례는 대외에 소개하기 전에 기관별로 소개 범위와 표현을 확인받습니다.",
    "본 선정은 개인정보보호 실천의 성과를 고취하고자 하는 것이며, 그 자체가 개인정보보호에 관한 어떠한 법률적·제도적 보장이 아닙니다.",
    "선정 이후 해당 기관에서 개인정보 관련 위반 사실이 관계기관 처분으로 확정되는 경우 선정 유지 여부를 재검토합니다.",
  ],
  principle: "실천·우수기관은 재단 기준을 충족한 기관에 부여하며, 무상제공 플랫폼은 그 기준을 충족하는 방법 중 하나입니다.",
  flow: ["실천선언", "인증도구 도입", "실천기관 게시", "우수기관 선정", "SURE MARK 활용"],
};

export type Institution = {
  certNo: string;
  name: string;
  tier: "실천기관" | "우수기관";
  selectedAt: string;
  status: "유효" | "재검토" | "회수";
  reason: string;
  certFile: string;
  published: boolean;
};

const COMMON_REASON =
  "개선 권고를 적극 수용해 온라인 정보수집 과정의 개인정보 보호 조치를 개선하고, 국가가 인증한 클라우드서비스보안인증(CSAP)을 활용해 선제적인 개인정보 보호에 앞장섰습니다.";

function institution(certNo: string, name: string, reason: string): Institution {
  return {
    certNo,
    name,
    tier: "우수기관",
    selectedAt: "2026-11-06",
    status: "유효",
    reason,
    certFile: `downloads/certificates/cert-${certNo}.pdf`,
    published: true,
  };
}

export const INSTITUTIONS: Institution[] = [
  institution(
    "SURE-2026-4970",
    "대한무역투자진흥공사",
    "해당 설문을 즉시 종료하고, 전 부서에 CSAP 인증 플랫폼 사용을 안내(2026. 9. 21. 전사 공지)했으며, 파기 시점·문의처 표시와 응답 자료 접근 통제 등 개선 방안을 마련했습니다.",
  ),
  institution("SURE-2026-9326", "과학기술정보통신부 우정사업본부", COMMON_REASON), // TODO(확인): 회신서 기준 세부 내용
  institution("SURE-2026-1982", "의정부시", COMMON_REASON), // TODO(확인)
  institution("SURE-2026-6197", "천안시", COMMON_REASON), // TODO(확인)
  institution("SURE-2026-3643", "아산시시설관리공단", COMMON_REASON), // TODO(확인)
  institution("SURE-2026-4827", "천안도시공사", COMMON_REASON), // TODO(확인)
  institution("SURE-2026-9214", "한국재정정보원", COMMON_REASON), // TODO(확인)
];

function normalizeCertNo(input: string) {
  return input.replace(/\s+/g, "").toUpperCase();
}

export function findInstitutionByCertNo(input: string, list: readonly Institution[] = INSTITUTIONS): Institution | undefined {
  const key = normalizeCertNo(input);
  return list.find((item) => normalizeCertNo(item.certNo) === key);
}

export const SURE_MARK_PAGE = {
  title: "개인정보보호실천 우수기관 · SURE MARK",
  descriptionLead: "개인정보 보호를 실천하는 기관임을 국민에게 알리는 재단의 표시입니다.",
  metaTitle: "우수기관·SURE MARK | 개인정보보호진흥원",
  back: "← 인증도구 보급·확산(무상제공 안내·신청)",
  nav: [
    { id: "mark", label: "SURE MARK" },
    { id: "excellence", label: "선정 안내" },
    { id: "institutions", label: "2026 선정 기관" },
    { id: "downloads", label: "자료실" },
    { id: "verify", label: "진위확인" },
  ],
  excellenceTitle: "우수기관 선정 안내",
  criteriaTitle: "선정 기준",
  criteriaBaseLabel: "기본 조건",
  benefitsTitle: "혜택",
  noticesTitle: "유의사항",
  institutionsHeading: "2026 개인정보보호실천 우수기관",
  institutionsCountSuffix: "개 기관",
  selectedPrefix: "선정일",
  certNoPrefix: "인증번호",
  more: "더보기",
  viewCert: "인증서 보기",
  download: "내려받기",
  certAltSuffix: "개인정보보호실천 우수기관 인증서",
  logoAlt: "개인정보보호 실천기관 SURE MARK",
  verifyHint: "인증서의 진위는 아래 진위확인에서 인증번호로 확인할 수 있습니다.",
  libraryTitle: "SURE MARK 자료실",
  usageTitle: "활용처",
  rulesTitle: "표시 규칙",
  supportTitle: "재단 지원",
  pendingValue: "확인 중",
  verifyLabel: "인증번호",
  verifyPlaceholder: "예: SURE-2026-0000",
  verifySubmit: "확인",
  verified: "확인되었습니다",
  tierLabel: "구분",
  statusLabel: "상태",
  notFound: "일치하는 인증번호가 없습니다. 인증번호를 다시 확인하거나 cs@kcf-korea.org로 문의해 주세요.",
  revoked: "이 인증은 회수되었습니다.",
  footerPractice: "우리 기관도 실천기관이 되려면",
  footerApply: "무상제공 신청",
  certFilePrefix: "개인정보보호실천우수기관_인증서_",
} as const;

export function formatSelectedAt(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  return `${match[1]}. ${Number(match[2])}. ${Number(match[3])}.`;
}

export function certDownloadName(name: string) {
  return `${SURE_MARK_PAGE.certFilePrefix}${name.replace(/\s+/g, "_")}.pdf`;
}

export function displayRule(rule: string) {
  const trimmed = rule.trimEnd();
  if (trimmed.endsWith(":")) return `${trimmed} ${SURE_MARK_PAGE.pendingValue}`;
  return rule;
}

export function publishedInstitutions(list: readonly Institution[] = INSTITUTIONS) {
  return list.filter((item) => item.published);
}
