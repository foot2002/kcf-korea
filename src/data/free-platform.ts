export type FreePlatformCert = {
  csap: string;
  csapValidUntil: string;
  nisList: string;
  nisListAsOf: string;
  dataSovereignty: string;
};

export type FreePlatformContact = {
  manager: string;
  tel: string;
  email: string;
};

export type FreePlatform = {
  product: string;
  provider: string;
  poweredBy: string;
  cert: FreePlatformCert;
  contact: FreePlatformContact;
};

export const FREE_PLATFORM: FreePlatform = {
  product: "WiseON",
  provider: "㈜와이즈인컴퍼니",
  poweredBy: "Powered by ㈜와이즈인컴퍼니 · WiseON",
  cert: {
    csap: "CSAP-2024-051호 (SaaS 표준)",
    csapValidUntil: "2029. 9. 24.",
    nisList: "국가·공공기관 민간클라우드 도입 가능목록 등재 (연번 102)",
    nisListAsOf: "2026. 9. 30.",
    dataSovereignty: "국내 정보시스템 저장 · 국내 인력 관리",
  },
  contact: { manager: "유준희 실장", tel: "02-501-2906", email: "cs@kcf-korea.org" },
};

export type HeroStat = { value: string; label: string };

export type FreePlatformHero = {
  eyebrow: string;
  headline: string;
  sub: string;
  stats: HeroStat[];
};

export const HERO: FreePlatformHero = {
  eyebrow: "공익사업 · 상시 접수",
  headline: "개인정보 유출, 수집하는 곳에서부터 시작합니다",
  sub: "정부 클라우드 보안인증(CSAP)을 받은 온라인조사플랫폼을 공공기관·협단체·국회·언론사에 무상으로 제공합니다.",
  stats: [
    { value: "149건", label: "공공기관 개인정보 수집 설문 모두 보안인증 없는 서비스" },
    { value: "98.7%", label: "안전조치 안내 미흡 (149건 중 147건)" },
    { value: "87.5%", label: "개선 권고 수용·개선 (회신 40곳 중 35곳)" },
  ],
};

export type FreePlatformIntro = { title: string; body: string };

export const INTRO: FreePlatformIntro = {
  title: "가장 쉬운 입구가 가장 위험한 입구가 되었습니다",
  body: "행사 신청서, 만족도 조사, 교육 접수. 국민의 정보가 가장 먼저 들어오는 곳은 온라인 신청·설문입니다. 2026년, 유출은 바로 이 첫 단계에서 반복되고 있습니다.",
};

export type FreePlatformCase = {
  date: string;
  title: string;
  summary: string;
  source: string;
  sourceDate: string;
  url: string;
};

export const CASES: FreePlatformCase[] = [
  {
    date: "2026. 11.",
    title: "대통령 부부 등 168명의 여권번호까지 담긴 명단, 외부 사이트에서 5개월간 노출",
    summary:
      "해킹이 아니었습니다. 업무 파일 하나가 검증되지 않은 외부 온라인 서비스에 올라간 것이 시작이었습니다.",
    source: "동아일보",
    sourceDate: "2026. 11. 3.",
    url: "", // TODO(확인): 기사 원문 URL
  },
  {
    date: "2026. 6.",
    title: "정부 창업 오디션 합격자 5,000명 정보 유출",
    summary: "대국민 온라인 공모 플랫폼에서 합격자 개인정보와 창업 아이디어가 외부에 노출되었습니다.",
    source: "조선일보",
    sourceDate: "2026. 6. 18.",
    url: "", // TODO(확인): 기사 원문 URL
  },
  {
    date: "2026. 10.",
    title: "국민 의견 3만 8,741건, 직원 개인 구글 계정으로 접수",
    summary:
      "기관 계정도, 보안 검증된 시스템도 아니었습니다. 다운로드·공유 이력은 '파기하여 확인할 수 없다'는 서면답변이 나왔습니다.",
    source: "엔지오프레스",
    sourceDate: "2026. 10. 29.",
    url: "", // TODO(확인): 기사 원문 URL
  },
  {
    date: "2026. 10.",
    title: "개인정보 교육 신청마저 보안인증 없는 외부 설문도구로",
    summary: "공공 위탁 교육사업의 참가 신청이 보안인증을 받지 않은 외부 설문도구로 접수되었습니다.",
    source: "전자신문",
    sourceDate: "2026. 10. 15.",
    url: "", // TODO(확인): 기사 원문 URL
  },
  {
    date: "2026. 10.",
    title: "학교 교육용 구글 계정 11만여 개 탈취",
    summary: "계정 하나가 뚫리면 그 계정으로 받은 모든 신청·설문 응답이 함께 열립니다.",
    source: "뉴시스",
    sourceDate: "2026. 10. 22.",
    url: "", // TODO(확인): 기사 원문 URL
  },
];

export type CaseStat = { value: string; label: string };

export const CASE_STAT: CaseStat = {
  value: "772만 건",
  label:
    "2022. 5.~2026. 5. 공공기관 개인정보 유출 처분 128건의 유출 규모. 3건 중 2건은 권한 설정 오류·오발송 같은 업무 과실이었습니다.",
};

export const CASES_NOTE =
  "사례는 공개 보도와 개인정보보호위원회 발표를 요약한 것입니다. 문제의 초점은 특정 도구가 아니라 검증되지 않은 이용 방식입니다.";

export type FreePlatformRule = { title: string; law: string; text: string };

export const RULE: FreePlatformRule = {
  title: "공공기관은 '검증된 서비스'만 써야 합니다",
  law: "「국가 사이버보안 기본지침」 제24조의4 ① (국가정보원, 2026. 5. 1.)",
  text: "각급기관의 장은 민간 클라우드컴퓨팅 서비스를 이용하고자 할 경우 클라우드컴퓨팅 도입 가능 목록에 등재된 민간 클라우드컴퓨팅 서비스를 이용하여야 한다.",
};

export type AuditPoints = { title: string; note: string; points: string[] };

export const AUDIT_POINTS: AuditPoints = {
  title: "2026 국정감사 · 정무위원회 (10. 13.)",
  note: "질의·답변은 언론에 보도된 내용을 요약한 것입니다.",
  points: [
    "보안이 확인되지 않는 수집 방식은 더 주의 깊게 살펴보겠다",
    "관련 내용을 평가에 반영하는 방안을 검토하고 관계 부처와 협의하겠다",
    "위탁한 기관에도 책임을 더 엄격하게 묻겠다",
  ],
};

export type GapItem = { title: string; body: string };

export type FreePlatformGap = { title: string; items: GapItem[]; purpose: string };

export const GAP: FreePlatformGap = {
  title: "그러나 현장은 아직 무료 폼에 머물러 있습니다",
  items: [
    {
      title: "개인 계정의 무료 폼",
      body: "신청·설문을 담당자 개인 계정으로 운영해, 계정이 탈취되면 응답 전체가 노출됩니다.",
    },
    {
      title: "낮은 보안인증 인식",
      body: "사용 중인 도구가 CSAP 인증·「도입 가능 목록」 대상인지 확인하지 않는 경우가 많습니다.",
    },
    {
      title: "안전망 구축까지의 공백",
      body: "기관 차원의 수집 체계가 갖춰지기까지 시간이 걸리고, 그 사이에도 국민의 정보는 쌓입니다.",
    },
  ],
  purpose: "안전망이 갖춰질 때까지, 국민의 정보가 들어오는 첫 단계를 보안인증 서비스로 지키겠습니다.",
};

export type VerifiedItem = { title: string; value: string; detail: string };

export const VERIFIED: VerifiedItem[] = [
  {
    title: "클라우드 보안인증",
    value: "CSAP",
    detail: "CSAP-2024-051호 (SaaS 표준) · 유효기간 ~ 2029. 9. 24.",
  },
  {
    title: "국가정보원",
    value: "도입 가능 목록",
    detail: "국가·공공기관 민간클라우드 도입 가능목록 등재 (연번 102)",
  },
  {
    title: "데이터 주권",
    value: "국내 저장·관리",
    detail: "국내 정보시스템 저장 · 국내 인력 관리 (목록 등재 기준)",
  },
];

export type FeatureItem = { no: string; title: string; sub: string; body: string };

export const FEATURES: FeatureItem[] = [
  {
    no: "01",
    title: "만들기",
    sub: "설문·신청서를 쉽게",
    body: "다양한 문항 유형으로 설문, 행사 신청, 교육 접수 양식을 만들고 익명·개인 링크로 배포합니다.",
  },
  {
    no: "02",
    title: "지키기",
    sub: "응답은 암호화해 보관",
    body: "수집 정보는 암호화·접근통제 하에 처리·보관하고 보유기간이 지나면 파기합니다. 설문마다 SURE MARK로 안내합니다.",
  },
  {
    no: "03",
    title: "관리하기",
    sub: "기관 계정·서브아이디",
    body: "개인 계정이 아닌 기관 계정 아래 담당자별 서브아이디로 운영해, 담당자가 바뀌어도 응답은 기관에 남습니다.",
  },
  {
    no: "04",
    title: "분석하기",
    sub: "분석·보고서까지 자동",
    body: "실시간 응답 현황, 통계 분석과 차트, HWP·PPT·Word 보고서 다운로드까지 지원합니다.",
  },
];

export type FreePlatformReferences = {
  title: string;
  source: string;
  orgs: string[];
  highlights: string[];
  published: boolean;
};

export const REFERENCES: FreePlatformReferences = {
  title: "이미 공공 현장에서 쓰이고 있습니다",
  source: "WiseON 제공 자료 기준",
  orgs: [
    "대한무역투자진흥공사(KOTRA)",
    "과학기술정보통신부 우정사업본부",
    "의정부시",
    "천안시",
    "아산시시설관리공단",
    "천안도시공사",
    "한국재정정보원",
    "서울관광재단",
    "서울시복지재단",
    "서울특별시평생교육진흥원",
    "서울투자진흥재단",
    "창원청년비전센터",
  ],
  highlights: [
    "KOTRA: 보안부서 지침으로 본사·지역본부의 외부 설문도구를 「도입 가능 목록」 서비스로 전환, 10개 이상 부서·사업과 외주 사업까지 일원화",
    "의정부시: 민원 만족도 조사 자동화로 연간 조사 비용 8천만 원 → 1천만 원",
  ],
  published: false, // TODO(확인): 기관별 게시 동의를 받은 뒤 true
};

export type OfferRow = { label: string; value: string };

export const OFFER: OfferRow[] = [
  {
    label: "제공 대상",
    value: "① 국가·공공기관 ② 국회(국회사무처 등) ③ 언론사 ④ 주요 협·단체(회원사 100개 이상)",
  },
  { label: "제공 내용", value: "1기관 1계정, 설문·신청 무제한 · 기존 신청서·설문 이전 지원" },
  { label: "비용", value: "없음" },
  {
    label: "제공 기간",
    value:
      "국회·언론사 기간 제한 없음(선언 유지 시) | 주요 협·단체 1년 후 갱신 협의 | 국가·공공기관 1년 후 갱신 협의",
  },
  {
    label: "참여 조건",
    value:
      "「개인정보보호 실천선언서」 서명 제출 → 재단 홈페이지에 실천선언 기관으로 게시 (개인정보 유출 사고 발생 시 게시 제외, 재발 방지 조치 이행 후 재게시 협의)",
  },
  { label: "표기 사항", value: `설문·신청서에 SURE MARK와 ${FREE_PLATFORM.poweredBy} 표기` },
  {
    label: "안전 조치",
    value: "이용 약정에 개인정보 처리 위탁, 보안관제·사고조사 협조, 종료 시 데이터 반환·파기 조항 포함",
  },
];

export const SURE_MARK_FOOTNOTE =
  "SURE MARK는 정부 인증 솔루션을 쓰며 개인정보 보호를 실천하는 기관임을 국민에게 알리는 표시입니다. 설문에 응답하는 국민은 이 표시를 보고 안심하고 답할 수 있습니다.";

export type ApplyStep = { no: number; title: string; body: string };

export type FreePlatformApply = {
  steps: ApplyStep[];
  submit: string;
  period: string;
  note: string;
  mailto: string;
};

export const APPLY: FreePlatformApply = {
  steps: [
    { no: 1, title: "신청서 제출", body: "무상제공 신청서를 작성합니다." },
    { no: 2, title: "실천선언서 서명", body: "기관·단체장과 개인정보 보호책임자가 서명합니다." },
    {
      no: 3,
      title: "이용 약정",
      body: "처리 위탁, 보안관제·사고조사 협조, 종료 시 데이터 반환·파기 조항이 담긴 약정을 체결합니다.",
    },
    { no: 4, title: "계정 개설", body: "기관 계정을 개설하고 이용 안내를 드립니다." },
  ],
  submit: "전자우편 cs@kcf-korea.org (스캔 또는 PDF)",
  period: "상시 접수",
  note: "공공기관은 무상 사용 접수 등 내부 절차에 따릅니다.",
  mailto: "mailto:cs@kcf-korea.org?subject=" + encodeURIComponent("[무상제공 신청] 기관명"),
};

export type CpoSupportRow = { label: string; value: string };

export type CpoSupport = { title: string; intro: string; rows: CpoSupportRow[] };

export const CPO_SUPPORT: CpoSupport = {
  title: "개인정보 보호책임자(CPO) 특별 지원",
  intro:
    "개인정보 보호의 현장 책임자인 CPO가 직접 실천에 나설 수 있도록, 기업 CPO에게도 WiseON을 무상 제공합니다.",
  rows: [
    { label: "대상", value: "개인정보 수집이 수시로 발생해 관리가 필요한 기업 (선정)" },
    { label: "내용", value: "해당 기업 CPO에게 WiseON 1계정, 1년 무상 (설문·응답 수 제한 없음)" },
    {
      label: "조건",
      value: "① 개인정보보호 실천선언 참여 ② 실천선언 참여 사실을 사내 공지 또는 언론 홍보로 알림",
    },
    { label: "신청", value: "CPO 명의로 신청서와 실천선언서 제출 (세부 내용은 개별 안내)" },
  ],
};

export type DownloadItem = { label: string; file: string };

export const DOWNLOADS: DownloadItem[] = [
  { label: "무상제공 신청서 (붙임 1)", file: "downloads/free-platform/kcf-free-platform-application.docx" },
  { label: "개인정보보호 실천선언서 (붙임 2)", file: "downloads/free-platform/kcf-privacy-pledge.docx" },
  { label: "WiseON 무상지원 사업 안내 (PDF)", file: "downloads/free-platform/wiseon-free-support-guide.pdf" },
];

export type PressItem = { title: string; outlet: string; date: string; url: string };

export const PRESS: PressItem[] = [
  {
    title: "초유의 대통령 개인정보 유출…해킹 살벌한데 정부 보안엔 구멍 숭숭",
    outlet: "동아일보",
    date: "2026. 11. 3.",
    url: "", // TODO(확인): 기사 원문 URL
  },
  {
    title: "공공기관 개인정보 유출 772만건…담당자 징계 권고 단 2건",
    outlet: "이데일리",
    date: "2026. 10. 12.",
    url: "", // TODO(확인): 기사 원문 URL
  },
  {
    title: "보안인증 없는 구글폼…개보위 사업에 쓰였다",
    outlet: "전자신문",
    date: "2026. 10. 15.",
    url: "https://www.etnews.com/20261015000353",
  },
  {
    title: "6개 지역서 학교 구글 계정 11만개 해킹",
    outlet: "뉴시스",
    date: "2026. 10. 22.",
    url: "", // TODO(확인): 기사 원문 URL
  },
  {
    title: "공공부문 사이버보안 책임 강화…위중한 유출 '기관장에 책임'",
    outlet: "정책브리핑",
    date: "2026. 10. 1.",
    url: "", // TODO(확인): 기사 원문 URL
  },
  {
    title: "외부 설문도구 이용 시 개인정보 처리 준수 사항 안내",
    outlet: "개인정보보호위원회",
    date: "2026. 10. 16.",
    url: "", // TODO(확인): 기사 원문 URL
  },
  {
    title: "모두의창업 합격자 5000명 개인정보 유출",
    outlet: "조선일보",
    date: "2026. 6. 18.",
    url: "", // TODO(확인): 기사 원문 URL
  },
  {
    title: "해킹도 아닌데, 주민번호 등 개인정보 노출한 서울시설공단",
    outlet: "오마이뉴스",
    date: "2026. 1. 23.",
    url: "", // TODO(확인): 기사 원문 URL
  },
];

export const DISCLAIMER =
  "본 사업은 ㈜와이즈인컴퍼니가 무상 제공하는 서비스를 개인정보보호진흥원이 안내·운영하는 공익 지원사업입니다. CSAP 인증과 「도입 가능 목록」 등재는 정부의 특정 제품 권장을 뜻하지 않으며, 목록에는 다른 서비스도 등재되어 있습니다. 출처: 국가정보원 「민간클라우드 컴퓨팅서비스 도입 가능목록」(2026. 9. 30. 기준), 「국가 사이버보안 기본지침」, 각 기사.";

export const ASSOCIATION_INTRO =
  "15개 협단체와 공동지원 협약을 맺고 회원사의 안전한 정보수집을 지원합니다.";

export const CPO_MAILTO = `mailto:${FREE_PLATFORM.contact.email}?subject=${encodeURIComponent("[CPO 특별지원 신청] 기업명")}`;

export const FREE_PLATFORM_PAGE = {
  title: "정부인증 온라인조사플랫폼 무상제공",
  description:
    "개인정보 보호의 첫 단계는 '수집'입니다. 기업의 공익 기부로, 개인정보 보호 실천에 동참하는 기관·단체에 인증받은 설문 도구를 무상으로 제공합니다.",
  badge: "상시 접수",
  nav: [
    { id: "about", label: "사업 안내" },
    { id: "verified", label: "인증·기능" },
    { id: "offer", label: "제공 내용" },
    { id: "pledge", label: "실천선언" },
    { id: "apply", label: "신청 방법" },
    { id: "cpo", label: "CPO 지원" },
    { id: "criteria", label: "인증 구분" },
    { id: "association", label: "협단체" },
  ],
  aboutApply: "신청 방법 보기",
  aboutPledge: "실천선언",
  verifiedTitle: "인증·기능",
  offerTitle: "제공 내용",
  offerCaption: "무상제공 내용",
  tableLabel: "항목",
  tableValue: "내용",
  markExampleAlt: "SURE MARK",
  applyTitle: "신청 방법",
  receptionPrefix: "접수",
  submitPrefix: "제출",
  emailSubmit: "이메일로 제출하기",
  contactOrg: "개인정보보호진흥원",
  cpoApply: "CPO 명의로 신청하기",
  cpoCaption: "CPO 특별 지원",
  criteriaTitle: "인증 구분 안내",
  criteriaHeading: "서비스 선정기준",
  sureMarkMore: "SURE MARK 알아보기",
  associationTitle: "협단체와 함께합니다",
  pledgeDownload: "실천선언서 내려받기 (.docx)",
  pledgeLocked: "6개 항목을 모두 확인하면 내려받을 수 있습니다.",
  pledgeCheckAll: "모두 확인",
  pledgeProgressSuffix: "확인",
  pledgeOrgsTitle: "실천선언 참여 기관",
  pledgeOrgsEmpty: "게시 준비 중입니다.",
  sourcePrefix: "출처",
  webinarTitle: "외부 정보수집의 보안 공백과 WiseON 적용 (03 세션)",
  webinarTo: "/privacy-center/education",
  webinarHash: "session-03",
  excellenceLabel: "우수기관·SURE MARK 보기",
  excellenceTo: "/privacy-center/sure-mark",
} as const;
