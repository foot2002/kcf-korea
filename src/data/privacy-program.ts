import { SURE_CERTIFIED_PARTNERS } from "@/data/sure-certified-partners";

/** 2026년 공공기관 온라인 개인정보 수집 실태조사 — 공개 요약 수치 */
export const SURVEY = {
  title: "2026년 공공기관 온라인 개인정보 수집 실태조사",
  periodLabel: "2026.08.21 ~ 2026.10.05 (46일)",
  evaluationTargets: 1464,
  websitesSurveyed: 1347,
  externalForms: 341,
  formsWithPersonalInfo: 161,
  highRiskForms: 11,
  tools: [
    { name: "구글폼", count: 96 },
    { name: "네이버폼", count: 50 },
    { name: "모아폼", count: 14 },
    { name: "SurveyMonkey", count: 1 },
  ],
  typedForms: 125,
  typedFormsLabel: "지자체·출연·출자기관",
  typedFormsShare: 77.6,
  noticeGaps: [
    { topic: "안전조치", count: 159 },
    { topic: "위탁", count: 155 },
    { topic: "국외이전", count: 106 },
    { topic: "동의 거부권", count: 96 },
  ],
} as const;

function assertSurveySeed() {
  const toolSum = SURVEY.tools.reduce((sum, tool) => sum + tool.count, 0);
  if (toolSum !== SURVEY.formsWithPersonalInfo) {
    throw new Error("설문도구별 건수 합계가 개인정보 입력 문항 건수와 다릅니다.");
  }
  const share = Math.round((SURVEY.typedForms / SURVEY.formsWithPersonalInfo) * 1000) / 10;
  if (share !== SURVEY.typedFormsShare) {
    throw new Error("기관 유형 비율이 공개 요약과 다릅니다.");
  }
  if (SURVEY.noticeGaps.some((gap) => gap.count > SURVEY.formsWithPersonalInfo)) {
    throw new Error("안내 점검 건수가 분석 대상 설문폼 수를 초과합니다.");
  }
  if (SURVEY.highRiskForms > SURVEY.formsWithPersonalInfo) {
    throw new Error("고위험 문항 건수가 분석 대상 설문폼 수를 초과합니다.");
  }
}

assertSurveySeed();

export const SURVEY_UNTAGGED_FORMS = SURVEY.formsWithPersonalInfo - SURVEY.typedForms;

export const SURVEY_LIMITS = [
  "홈페이지에 공개된 설문·신청 링크를 확인한 조사입니다. 응답을 제출한 사람의 수는 집계하지 않았습니다.",
  "개인정보가 실제로 유출되었는지, 개별 기관이 법령을 위반했는지를 확정한 조사가 아닙니다.",
  "자동진단 결과는 전문가가 다시 확인했지만, 안내 문구가 없거나 일부만 보인다는 사실만으로 위법이라고 단정하지 않습니다.",
  "보안인증을 받지 않은 도구를 썼다는 사실만으로 곧바로 불법이라고 판단한 조사도 아닙니다.",
  "1,347은 홈페이지를 운영하는 기관 수이고, 341·161·11은 설문폼 수입니다. 두 단위를 같은 모수로 읽지 않습니다.",
] as const;

export const CORE_PROGRAMS = [
  {
    num: "01",
    title: "개인정보보호 실태 조사·연구",
    to: "/privacy-center/research",
    summary: "SURE-CHECK로 공개된 수집 화면을 진단하고, 전문가가 재확인한 뒤 조사보고서로 공개합니다.",
    points: ["SURE-CHECK 자동진단", "공개 페이지 실태 조사", "전문가 재확인", "보고서 공개"],
  },
  {
    num: "02",
    title: "국민 개인정보 권익 보호",
    to: "/privacy-center/rights",
    summary: "모니터링단, 권리행사 안내, 합법적 공동의견과 캠페인으로 정보주체의 권리를 지원합니다.",
    points: ["모니터링단 모집 예정", "권리행사 안내", "공동 의견서", "캠페인"],
  },
  {
    num: "03",
    title: "우수 보안서비스 연계·보급",
    to: "/privacy-center/security-services",
    summary: "인증 종류와 범위를 구분해 안내하고, 교육·웨비나로 안전한 수집 환경을 넓힙니다.",
    points: ["인증제도 구분", "SURE Mark", "교육·웨비나", "선정기준 공개"],
  },
  {
    num: "04",
    title: "정책 제안·제도 개선",
    to: "/privacy-center/policy",
    summary: "실태조사에 기초한 정책 제언과 관계기관 질의·회신, 후속조치를 기록합니다.",
    points: ["정책 제언", "질의·회신 구분", "언론보도 연결", "후속조치"],
  },
] as const;

export const POLICY_STATUSES = ["제안", "검토", "질의 예정", "질의 중", "회신", "반영", "종결"] as const;
export type PolicyStatus = (typeof POLICY_STATUSES)[number];

export type PolicyItem = {
  slug: string;
  title: string;
  background: string;
  summary: string;
  targets: string;
  proposedOn: string;
  laws: string;
  reportSlug: string;
  press: readonly { title: string; source: string; url: string; date: string }[];
  status: PolicyStatus;
  followUp: string;
  updatedAt: string;
};

const SHARED_PRESS = [
  {
    title: "보안인증 없는 구글폼…개보위 사업에 쓰였다",
    source: "전자신문",
    url: "https://www.etnews.com/20261015000353",
    date: "2026-10-15",
  },
  {
    title: "(보도참고)외부 설문도구 이용 시 개인정보 처리 준수 사항에 대해 보다 명확히 안내하겠습니다.",
    source: "개인정보보호위원회 · 대한민국 정책브리핑",
    url: "https://www.korea.kr/briefing/pressReleaseView.do?newsId=156785527",
    date: "2026-10-16",
  },
] as const;

export const POLICY_ITEMS: PolicyItem[] = [
  {
    slug: "secure-tool-use",
    title: "적용 보안요건을 충족한 도구 사용",
    background:
      "전수조사에서 개인정보 입력 문항이 있는 외부 설문폼 161건의 도구는 구글폼 96건, 네이버폼 50건, 모아폼 14건, SurveyMonkey 1건이었습니다.",
    summary:
      "공공 업무에 적용되는 보안요건을 충족했는지 확인할 수 있는 도구를 우선 사용하도록 제안합니다. 인증이 없는 도구를 썼다는 이유만으로 불법이라고 단정하지는 않습니다.",
    targets: "개인정보보호위원회, 행정안전부, 공공기관",
    proposedOn: "",
    laws: "개인정보 보호법상 안전조치 의무와 공공부문 보안 기준이 논의되는 영역",
    reportSlug: "2026-public-collection-survey",
    press: SHARED_PRESS,
    status: "제안",
    followUp: "관계기관에 공식 질의하기 전입니다. 질의하지 않은 사안은 질의 예정으로만 관리합니다.",
    updatedAt: "2026-10-18",
  },
  {
    slug: "joint-guideline",
    title: "관계부처 공동지침 마련",
    background:
      "외부 설문도구의 위탁·국외이전·안전조치 안내가 제각각이어서, 기관마다 판단이 달랐습니다.",
    summary:
      "공공기관과 수탁기관이 함께 쓰는 온라인 수집 공동지침을 관계부처가 마련할 것을 제안합니다.",
    targets: "개인정보보호위원회, 행정안전부, 관계부처",
    proposedOn: "",
    laws: "개인정보 처리 위탁, 국외 이전, 처리방침·안내 고지와 관련한 개인정보 보호법",
    reportSlug: "2026-public-collection-survey",
    press: SHARED_PRESS,
    status: "제안",
    followUp: "법제처를 포함한 관계기관 질의는 아직 발송하지 않았습니다. 상태는 질의 예정입니다.",
    updatedAt: "2026-10-18",
  },
  {
    slug: "high-risk-review",
    title: "고위험 개인정보 수집 우선점검",
    background: "개인정보 입력 문항이 있는 161건 가운데 민감·고위험 문항이 확인된 설문폼은 11건입니다.",
    summary:
      "민감정보나 고유식별정보에 해당하는 문항이 보이는 수집 화면부터 기관이 우선 점검하도록 제안합니다. 11건은 유출이 확인된 사건이 아닙니다.",
    targets: "공공기관, 개인정보보호위원회",
    proposedOn: "",
    laws: "민감정보·고유식별정보 처리 제한과 관련한 개인정보 보호법",
    reportSlug: "2026-public-collection-survey",
    press: SHARED_PRESS,
    status: "제안",
    followUp: "개별 기관 실명과 문항 원문은 이 제안에 붙이지 않습니다. 공식 질의 전입니다.",
    updatedAt: "2026-10-18",
  },
  {
    slug: "account-lifecycle",
    title: "기관 계정 운영 및 인계·파기 관리",
    background:
      "외부 설문도구는 담당자 개인 계정으로 개설되는 경우가 있어, 인사이동 때 접근권한과 파기 책임이 흐려질 수 있습니다.",
    summary:
      "기관 명의 계정, 권한 인계, 보관기간 이후 파기 확인을 남기는 운영을 제안합니다.",
    targets: "공공기관, 수탁기관",
    proposedOn: "",
    laws: "개인정보 보호법상 안전조치, 보유기간, 파기",
    reportSlug: "2026-public-collection-survey",
    press: SHARED_PRESS,
    status: "제안",
    followUp: "질의 예정. 회신이나 제도 반영으로 기록하지 않습니다.",
    updatedAt: "2026-10-18",
  },
  {
    slug: "consignment-standard",
    title: "위탁업무에 동일한 관리기준 적용",
    background:
      "위탁 관련 안내가 없거나 일부만 표시된 설문폼이 155건이었습니다. 안내가 없다는 사실을 곧 법 위반으로 단정하지는 않습니다.",
    summary:
      "기관이 직접 수집할 때와 같은 관리기준을 위탁·재위탁 업무의 제안요청서와 계약에 넣도록 제안합니다.",
    targets: "공공기관, 수탁기관, 개인정보보호위원회",
    proposedOn: "",
    laws: "개인정보 처리 위탁 및 수탁자 관리·감독과 관련한 개인정보 보호법",
    reportSlug: "2026-public-collection-survey",
    press: SHARED_PRESS,
    status: "제안",
    followUp:
      "2026.10.15 전자신문은 국정감사에서 수탁기관 관리 지침 마련이 언급되었다고 보도했습니다. 진흥원이 별도로 보낸 질의·회신 문서는 없습니다.",
    updatedAt: "2026-10-18",
  },
  {
    slug: "continuous-check",
    title: "상시점검·평가 및 신속한 신고 대응",
    background:
      "한 차례 전수조사만으로 수집 화면의 변경을 따라갈 수 없습니다.",
    summary:
      "개인정보 보호수준 평가와 상시점검에 온라인 수집 링크 확인을 포함하고, 침해 신고 창구와 역할을 분명히 할 것을 제안합니다.",
    targets: "개인정보보호위원회, 공공기관",
    proposedOn: "",
    laws: "개인정보 보호법상 보호수준 평가, 침해 신고 및 안전조치",
    reportSlug: "2026-public-collection-survey",
    press: SHARED_PRESS,
    status: "제안",
    followUp: "질의 예정. 진흥원 모니터링 제보는 개인정보 침해신고센터의 공식 신고를 대체하지 않습니다.",
    updatedAt: "2026-10-18",
  },
];

export const PUBLICATION_TYPES = ["보도자료", "연구보고서", "정책 제안", "법령 해설", "교육자료", "언론보도"] as const;
export type PublicationType = (typeof PUBLICATION_TYPES)[number];

export type PublicationItem = {
  slug: string;
  type: PublicationType;
  title: string;
  date: string;
  year: number;
  source: string;
  summary: string;
  keywords: string[];
  externalUrl?: string;
  internalPath?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  published: boolean;
  publishAt?: string;
};

export const PUBLICATION_SEED: PublicationItem[] = [
  {
    slug: "2026-public-collection-survey",
    type: "연구보고서",
    title: SURVEY.title,
    date: "2026-10-05",
    year: 2026,
    source: "개인정보보호진흥원",
    summary:
      "개인정보 보호수준 평가 대상 1,464개 기관 중 홈페이지를 운영하는 1,347개 기관을 전수 확인하고, 외부 설문폼 341건을 진단한 조사의 공개 요약입니다. 원문 파일은 등록 후 다운로드할 수 있습니다.",
    keywords: ["실태조사", "공공기관", "SURE-CHECK", "설문폼"],
    internalPath: "/privacy-center/research",
    published: true,
  },
  {
    slug: "etnews-20261015-survey-tools",
    type: "언론보도",
    title: "보안인증 없는 구글폼…개보위 사업에 쓰였다",
    date: "2026-10-15",
    year: 2026,
    source: "전자신문 · 박진형",
    summary:
      "개인정보보호위원회가 한국정보통신진흥협회에 위탁한 교육 신청에 구글폼이 쓰인 사례와, 2026년 10월 13일 국회 정무위원회 국정감사에서 박상혁 의원이 수탁기관 관리를 질의했다는 보도입니다. 이 기사 수치를 1,347개 기관 전수조사 결과와 합치지 않습니다.",
    keywords: ["전자신문", "국정감사", "구글폼", "위탁"],
    externalUrl: "https://www.etnews.com/20261015000353",
    published: true,
  },
  {
    slug: "pipc-20261016-survey-guidance",
    type: "정책 제안",
    title: "(보도참고)외부 설문도구 이용 시 개인정보 처리 준수 사항에 대해 보다 명확히 안내하겠습니다.",
    date: "2026-10-16",
    year: 2026,
    source: "개인정보보호위원회",
    summary:
      "개인정보보호위원회가 정책브리핑에 배포한 보도참고입니다. 진흥원의 정책 제안이 반영되었다는 뜻이 아니며, 관계기관 자료로 연결합니다.",
    keywords: ["개인정보보호위원회", "외부 설문도구", "정책브리핑"],
    externalUrl: "https://www.korea.kr/briefing/pressReleaseView.do?newsId=156785527",
    published: true,
  },
  {
    slug: "privacy-law-explainer",
    type: "법령 해설",
    title: "온라인 설문·수집에서 보는 개인정보 보호법과 제도",
    date: "2026-10-18",
    year: 2026,
    source: "개인정보보호진흥원",
    summary:
      "온라인 설문·접수에서 자주 묻는 제도와 실무 질문을 정리한 기존 안내입니다. 개별 사안의 위법 여부를 판단하는 문서는 아닙니다.",
    keywords: ["개인정보 보호법", "제도", "안내"],
    internalPath: "/privacy-center/law",
    published: true,
  },
];

export type EducationStatus = "예정" | "접수중" | "종료";

export type EducationItem = {
  slug: string;
  title: string;
  date: string;
  timeLabel: string;
  year: number;
  topics: string[];
  mode: string;
  fee: string;
  host: string;
  organizers: string[];
  summary: string;
  status: EducationStatus;
  capacity: number | null;
  recordedApplicants: number | null;
  recordedParticipants: number | null;
  figuresAreApproximate: boolean;
  materialUrl: string;
  materialName: string;
  videoUrl: string;
  published: boolean;
  publishAt: string;
};

export const EDUCATION_SEED: EducationItem[] = [
  {
    slug: "2026-privacy-practice",
    title: "9월 11일 강화된 개인정보보호법과 기업·기관의 실전 대응 및 적용",
    date: "2026-09-30",
    timeLabel: "14:00~16:35",
    year: 2026,
    topics: ["개인정보 보호법", "공공·기업 실무"],
    mode: "온라인 웨비나",
    fee: "무료",
    host: "개인정보보호진흥원(한국컨설팅산업재단)",
    organizers: ["법무법인 율촌", "파수AI", "와이즈인컴퍼니", "타이거컴퍼니", "피앤피시큐어", "프리모데이터"],
    summary:
      "강화된 개인정보 보호법 시행에 맞춰 기업과 기관의 실무 대응을 다룬 온라인 웨비나입니다. 신청·참여 수치는 운영자가 검수한 약수이며, 안내문에 적힌 예상 규모는 실적으로 쓰지 않습니다.",
    status: "종료",
    capacity: null,
    recordedApplicants: 800,
    recordedParticipants: 500,
    figuresAreApproximate: true,
    materialUrl: "",
    materialName: "",
    videoUrl: "",
    published: true,
    publishAt: "",
  },
];

export const KOREA_REGIONS = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
] as const;

export const MONITOR_INTERESTS = [
  "수집 실태 모니터링",
  "권리행사 안내",
  "캠페인",
  "정책 의견",
  "교육·자료 검토",
] as const;

export const MONITOR_MODES = ["온라인 모니터링", "사례 제보", "자료 검토", "캠페인 참여", "의견 수렴"] as const;

export const MONITOR_ACTIVITIES = [
  "개인정보 침해 우려 사례 모니터링",
  "개인정보 수집·활용 실태 제보",
  "정보주체 권리행사 안내",
  "기관·기업 대상 공동질의 및 의견서",
  "개인정보보호 캠페인",
  "정책개선 의견 수렴",
] as const;

export const MONITOR_RULES = [
  "공식 침해 신고는 개인정보 침해신고센터(privacy.go.kr, 국번 없이 118)로 합니다. 진흥원 제보는 그 신고를 대신하지 않습니다.",
  "피해를 겪은 분도 참여할 수 있습니다. 신청서에 피해 경위나 민감정보를 적지 않습니다.",
  "집단활동은 합법적인 공동의견 제출과 권리행사 안내로 한정합니다.",
  "특정인의 개인정보를 동의 없이 올리거나, 특정인을 괴롭히거나, 같은 민원을 자동으로 반복 전송하는 활동은 하지 않습니다.",
  "그러한 내용이 접수되면 승인하지 않거나 활동을 중지합니다.",
] as const;

export const SERVICE_SELECTION_CRITERIA = [
  { title: "보안인증 및 인증범위", desc: "CSAP, 국가정보원 도입 가능 목록, 민간 자체 표시를 서로 다른 제도로 보고 인증 범위가 업무와 맞는지 확인합니다." },
  { title: "개인정보 처리체계", desc: "수집 항목, 목적, 보유기간, 파기, 처리방침 안내를 서비스 안에서 설명할 수 있는지 봅니다." },
  { title: "접근권한 통제", desc: "계정 발급, 권한 분리, 인계와 회수가 가능한지 봅니다." },
  { title: "로그관리", desc: "누가 언제 개인정보 화면에 접근했는지 남길 수 있는지 봅니다." },
  { title: "저장·파기 기능", desc: "보관 위치와 기간이 끝난 뒤의 삭제 또는 파기 확인이 가능한지 봅니다." },
  { title: "가격 및 지원범위", desc: "무상·유상 범위와 교육, 기술지원이 공개되어 있는지 봅니다." },
  { title: "협력관계", desc: "진흥원과의 협력은 소개이지, 해당 기업의 상업적 보증이 아닙니다." },
  { title: "적용 법령과 지침", desc: "개인정보 보호법과 공공부문 지침 중 어떤 업무에 해당하는지 이용 기관이 따로 확인해야 합니다." },
] as const;

export const CERT_SYSTEMS = [
  {
    name: "CSAP",
    desc: "클라우드 서비스 보안인증입니다. 국가·공공 클라우드 이용과 연결되는 인증이며, 진흥원이 발급하지 않습니다.",
  },
  {
    name: "국가정보원 도입 가능 목록",
    desc: "국가정보원 보안 기준에 따른 별도의 목록·검증입니다. CSAP나 SURE Mark와 같은 표시가 아닙니다.",
  },
  {
    name: "SURE Mark",
    desc: "개인정보보호진흥원이 운영하는 민간 자체 표시입니다. 법정 인증이나 정부 인증을 대신하지 않습니다.",
  },
] as const;

export type SecurityServiceInfo = {
  id: string;
  provider: string;
  serviceName: string;
  functions: string;
  audience: string;
  requirements: string;
  merit: string;
};

const SERVICE_MERIT: Record<string, string> = {
  yulchon: "개인정보 규제 대응, 유출·분쟁 자문, 컴플라이언스 체계 설계",
  wisein: "온라인 조사·수집에서 개인정보를 안전하게 다루는 조사 솔루션",
  tiger: "협업 과정에서 생기는 개인정보 취급을 관리하는 업무 플랫폼",
  fasoo: "비정형 데이터 속 개인정보 검출·마스킹과 문서보안",
  pnpsecure: "개인정보 접속기록 관리와 DB·시스템 접근제어",
  oreunhaneul: "개인정보 처리 실무에 맞춘 법률 자문과 제도 설계",
};

export const SECURITY_SERVICES: SecurityServiceInfo[] = SURE_CERTIFIED_PARTNERS.map((partner) => ({
  id: partner.id,
  provider: partner.name,
  serviceName: partner.serviceName,
  functions: partner.description,
  audience: partner.specialty,
  requirements: "도입 전에 인증 범위, 개인정보 처리 위치, 접근권한과 파기 방식을 수요기관이 직접 확인해야 합니다.",
  merit: SERVICE_MERIT[partner.id] ?? partner.specialty,
}));

export const SURE_MARK_SECTIONS = [
  {
    title: "소개",
    body: "SURE Mark는 온라인 조사·접수 운영이 진흥원 운영기준에 맞다고 보아 부여하는 민간 자체 표시입니다. 정부 인증마크가 아닙니다.",
  },
  {
    title: "운영기준",
    body: "최소수집, 안내 문구, 접근권한, 로그, 보관과 파기를 운영 문서와 화면에서 설명할 수 있는지를 봅니다. 기준을 충족하지 못하면 부여하지 않습니다.",
  },
  {
    title: "심사절차",
    body: "신청, 자료 확인, 보완, 심사, 부여 또는 반려 순서입니다. 직인이나 협력 관계만으로 부여하지 않습니다.",
  },
  {
    title: "평가기준",
    body: "개인정보 처리체계, 접근권한, 로그, 저장·파기, 안내 문구의 구체성입니다. 매출이나 홍보 문구는 기준이 아닙니다.",
  },
  {
    title: "유효기간",
    body: "부여일로부터 1년입니다. 기간이 끝나면 표시를 내려야 하며, 갱신 심사를 통과한 경우에만 연장합니다.",
  },
  {
    title: "갱신·취소",
    body: "갱신은 만료 전에 다시 심사합니다. 기준 미달, 허위 자료, 표시 오남용이 확인되면 취소하고 부여현황에 반영합니다.",
  },
] as const;

export const SUPPORT_AREAS = [
  {
    id: "association",
    title: "기업·협단체 지원",
    summary: "기존 협단체 지원 바우처와 회원사 혜택을 이 영역으로 옮겼습니다. 신청 내역과 혜택은 그대로입니다.",
    badge: "운영 중",
  },
  {
    id: "public",
    title: "공공기관·산하기관 지원",
    summary: "공공기관이 안전한 수집 도구와 교육을 고를 수 있도록 안내합니다. 무상 범위가 확정되지 않은 항목은 시범사업(안)입니다.",
    badge: "시범사업(안)",
  },
  {
    id: "civic",
    title: "국민참여·주민자치 지원",
    summary: "공공 예산을 지원받는 비영리 주민자치 모임이 행사 참가자를 모집할 때, 심사 후 해당 행사에 한정한 무료 사용권을 검토합니다.",
    badge: "시범사업(안)",
  },
] as const;

export const CIVIC_TARGETS = [
  "주민자치회",
  "마을공동체",
  "마을협치 사업",
  "주민참여 협치사업",
  "자치행정과 지원 모임",
  "공공기관 예산 지원 비영리 단체",
] as const;

export const CIVIC_STEPS = [
  "주민자치 모임이 신청서를 작성합니다.",
  "행사명, 기간, 목적, 예상 참여자, 수집 항목을 적습니다.",
  "관할 지자체 담당부서의 확인 공문 또는 직인을 첨부합니다.",
  "진흥원이 신청 내용을 검토합니다. 직인만으로 승인하지 않습니다.",
  "승인되면 그 행사에 한정해 무료 사용권을 수동으로 발급합니다.",
  "행사가 끝나면 자료 정리와 파기 확인을 요청합니다.",
] as const;

export const CIVIC_REVIEW = [
  "실제 공공지원 사업인지",
  "비영리성",
  "신청 모임과 담당부서 확인",
  "행사 목적",
  "개인정보 수집 항목",
  "중복지원 여부",
  "지원기간",
] as const;

export const CAMPAIGN_STATUSES = [
  "접수",
  "서류확인",
  "보완요청",
  "승인",
  "반려",
  "사용권발급",
  "이용종료",
  "파기확인",
] as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const MONITOR_STATUSES = ["접수", "승인", "반려", "활동중", "활동종료"] as const;
export type MonitorStatus = (typeof MONITOR_STATUSES)[number];

export const DEFAULT_LICENSE_SETTINGS = {
  surveyCount: 1,
  respondentLimit: 300,
  periodDays: 30,
  features: "해당 행사 신청·설문 1건, 결과 다운로드",
  storage: "행사 기간 동안의 응답 저장",
  downloadAllowed: true,
  disposalRule: "행사 종료 후 30일 이내 응답 파일 파기 확인",
} as const;

export type LicenseSettings = {
  surveyCount: number;
  respondentLimit: number;
  periodDays: number;
  features: string;
  storage: string;
  downloadAllowed: boolean;
  disposalRule: string;
};

export const AUDIT_NOTE = {
  title: "공개 보도로 확인되는 국정감사 언급",
  body: "전자신문 2026년 10월 15일 자 보도는, 2026년 10월 13일 국회 정무위원회 국정감사에서 박상혁 의원이 공공부문 수탁기관 관리를 질의했고 송경희 개인정보보호위원장이 수탁기관 관리 지침을 마련하겠다고 밝혔다고 전합니다. 배포 전인 의원실 보도자료는 올리지 않습니다.",
} as const;

export const SEPARATE_SAMPLE_NOTE =
  "2026년 4월 전자신문은 박상혁 의원실이 와이즈인컴퍼니에 의뢰한 표본조사(117개 기관)를 보도했습니다. 그 표본 수치와 이 페이지의 1,347개 기관 전수조사는 다른 조사입니다.";
