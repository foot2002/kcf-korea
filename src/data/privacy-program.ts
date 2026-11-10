import kcfMark from "@/assets/kcf-mark.png";
import fasooLogo from "@/assets/privacy/logos/fasoo.png";
import pnpLogo from "@/assets/privacy/logos/pnp.png";
import tigrisLogo from "@/assets/privacy/logos/tigris.svg";
import wiseinLogo from "@/assets/privacy/logos/wisein.png";
import yulchonLogo from "@/assets/privacy/logos/yulchon.png";
import { SURE_CERTIFIED_PARTNERS } from "@/data/sure-certified-partners";

/** 2026 공공기관 온라인 개인정보 수집 실태조사 — 최종 통계. 비율은 pct()로 계산한다. */
export const SURVEY = {
  title: "2026 공공기관 온라인 개인정보 수집 실태조사",
  partner: "국회 정무위원회 박상혁 의원실 공동 조사",
  period: "2026. 8. 21. ~ 10. 5.",
  evaluationTargets: 1464,
  websitesSurveyed: 1347,
  analyzedOrgs: 137,
  forms: 149,
  tools: [
    { name: "구글폼", count: 90 },
    { name: "네이버폼", count: 47 },
    { name: "모아폼", count: 11 },
    { name: "SurveyMonkey", count: 1 },
  ],
  orgTypes: [
    { name: "출연·출자기관", count: 58 },
    { name: "지방자치단체", count: 56 },
    { name: "그 밖의 공공기관", count: 18 },
    { name: "중앙행정기관", count: 6 },
    { name: "지방공기업", count: 6 },
    { name: "교육기관", count: 3 },
    { name: "중앙행정기관 소속기관", count: 2 },
  ],
  noticeGaps: [
    { topic: "안전조치", count: 147 },
    { topic: "위탁", count: 143 },
    { topic: "국외이전", count: 99 },
    { topic: "동의 거부권", count: 91 },
  ],
  highRisk: {
    total: 10,
    rrn: 3,
    healthDisability: 8,
    both: 1,
    byTool: [
      { name: "구글폼", count: 5 },
      { name: "네이버폼", count: 5 },
    ],
  },
  noticePeriod: "2026. 9. 9. ~ 10. 8.",
  replies: {
    total: 40,
    improved: 16,
    accepted: 19,
    objected: 5,
    methods: [
      { name: "회신서", count: 37 },
      { name: "전자우편", count: 2 },
      { name: "전화", count: 1 },
    ],
  },
};

/** 소수 첫째 자리에서 반올림한 백분율. */
export function pct(n: number, d: number) {
  return Math.round((n / d) * 1000) / 10;
}

function expectPct(actual: number, expected: number, label: string) {
  if (actual !== expected) {
    throw new Error(`${label} 비율이 ${expected}가 아닙니다. (${actual})`);
  }
}

export function assertSurveySeed() {
  const forms = SURVEY.forms;
  if (SURVEY.tools.reduce((sum, tool) => sum + tool.count, 0) !== forms) {
    throw new Error("도구 합계가 149가 아닙니다.");
  }
  if (SURVEY.orgTypes.reduce((sum, org) => sum + org.count, 0) !== forms) {
    throw new Error("기관 유형 합계가 149가 아닙니다.");
  }
  const replyMethods = SURVEY.replies.methods.reduce((sum, method) => sum + method.count, 0);
  if (replyMethods !== 40 || SURVEY.replies.total !== 40) {
    throw new Error("회신 합계가 40이 아닙니다.");
  }
  if (SURVEY.replies.improved + SURVEY.replies.accepted !== 35) {
    throw new Error("개선·수용 합계가 35가 아닙니다.");
  }
  const toolPct = [60.4, 31.5, 7.4, 0.7];
  SURVEY.tools.forEach((tool, index) => expectPct(pct(tool.count, forms), toolPct[index], tool.name));
  const orgPct = [38.9, 37.6, 12.1, 4.0, 4.0, 2.0, 1.3];
  SURVEY.orgTypes.forEach((org, index) => expectPct(pct(org.count, forms), orgPct[index], org.name));
  const gapPct = [98.7, 96.0, 66.4, 61.1];
  SURVEY.noticeGaps.forEach((gap, index) => expectPct(pct(gap.count, forms), gapPct[index], gap.topic));
  expectPct(pct(SURVEY.highRisk.total, forms), 6.7, "고위험");
  expectPct(pct(SURVEY.replies.improved + SURVEY.replies.accepted, SURVEY.replies.total), 87.5, "수용·개선");
  const affiliatedAndLocal = SURVEY.orgTypes[0].count + SURVEY.orgTypes[1].count;
  if (affiliatedAndLocal !== 114) {
    throw new Error("출연·출자기관과 지방자치단체 합계가 114가 아닙니다.");
  }
  expectPct(pct(affiliatedAndLocal, forms), 76.5, "출연·출자+지자체");
}

assertSurveySeed();

export const SURVEY_OVERVIEW = [
  { label: "조사 목적", value: "국가·공공기관이 공개 운영하는 온라인 설문·신청서의 개인정보 수집 실태 진단과 개선과제 도출" },
  { label: "조사 주체", value: "(재)한국컨설팅산업재단 부설 개인정보보호진흥원 (박상혁 의원실 공동)" },
  { label: "조사 범위", value: "개인정보 보호수준 진단 대상 1,464개 기관 중 홈페이지가 있는 1,347개 기관의 공개 설문 링크" },
  { label: "조사 기간", value: "2026. 8. 21. ~ 10. 5." },
  { label: "조사 방법", value: "자동진단도구 SURE-CHECK로 공개 링크를 진단한 뒤 전문가가 재확인" },
  { label: "분석 대상", value: "진단한 설문 중 결과 통보 공문을 발송한 137개 기관의 개인정보 수집 설문 149건" },
  {
    label: "평가 기준",
    value:
      "① 수집 도구의 클라우드 보안인증(CSAP) 여부 ② 수집 항목(민감정보·고유식별정보 포함 여부) ③ 처리 안내 게시 여부(목적·항목·보유기간·파기·위탁·국외이전·동의 거부권 등) — 「개인정보 보호법」 제15·21·23·24조의2·26·28조의8·29조, 클라우드컴퓨팅법, 국가정보원 보안 기준",
  },
  {
    label: "조사의 한계",
    value:
      "공개 화면만 분석했으며 기관 내부·비공개·로그인 영역은 제외. 응답 자료를 열람하거나 개인정보를 수집하지 않음. 실제 응답자 수가 아닌 입력 요구 문항과 안내 내용 기준",
  },
];

export const TOOL_FRAMING =
  "서비스 운영사는 자체적으로 높은 보안 체계를 갖추고 있습니다. 문제의 초점은 서비스의 보안이 아니라 이용 방식에 있습니다. 공공기관이 기관의 관리·통제 밖에서 담당자 개인 계정과 내려받은 사본으로 국민의 개인정보를 처리하면, 계정 관리·접근 권한·보관 위치·파기를 기관이 확인할 수 없게 됩니다.";

export const TOOL_CERT_NOTE =
  "구글폼·네이버폼·모아폼 등은 한국인터넷진흥원(KISA)이 공개한 인증 현황에서 해당 서비스의 클라우드 보안인증(CSAP)이 확인되지 않았습니다. 구글 클라우드 플랫폼이나 네이버의 다른 공공용 상품이 받은 인증은 이들 설문 서비스에 적용되지 않습니다.";

export const ORG_TYPE_NOTE =
  "출연·출자기관과 지방자치단체가 전체의 76.5%(114건)를 차지했습니다. 중앙부처에 대한 조치가 소속기관·산하 법인과 지방 공공기관까지 전달되도록 주무부처·지자체별 이행체계가 필요합니다.";

export const HIGH_RISK_CASES = [
  { orgType: "재단(출연·출자)", tool: "네이버폼", survey: "어린이 체험 프로그램 참여자 모집", requested: "참여 어린이 주민등록번호" },
  { orgType: "진흥원(출연·출자)", tool: "구글폼", survey: "학생 대상 행사 참가 신청", requested: "학생의 과거·현재 질병" },
  { orgType: "지자체", tool: "네이버폼", survey: "주민 보건의료 요구도 조사", requested: "현재 앓고 있는 질병" },
  { orgType: "재단(출연·출자)", tool: "구글폼", survey: "체험교육 프로그램 신청", requested: "장애 여부" },
  { orgType: "지자체", tool: "구글폼", survey: "시민 인식조사", requested: "장애 유형 (경품용 휴대전화번호와 함께 수집)" },
  { orgType: "재단(출연·출자)", tool: "구글폼", survey: "청년 지원사업 참여 설문", requested: "주민등록번호 13자리, 구직 관련 초조·불안 경험" },
  { orgType: "지자체", tool: "구글폼", survey: "청년 일자리 프로그램 참여 신청", requested: "주민등록번호" },
  { orgType: "공공기관", tool: "네이버폼", survey: "주민 실태조사", requested: "의사가 진단한 만성질환" },
  { orgType: "지자체", tool: "네이버폼", survey: "평생교육 요구 조사", requested: "장애인 등록 여부" },
  { orgType: "중앙행정기관", tool: "네이버폼", survey: "유가족 지원 실태 조사", requested: "자녀의 치료·재활 필요 건강 상태" },
];

export const HIGH_RISK_NOTE =
  "기관 실명과 설문명은 공개하지 않습니다. 「개인정보 보호법」 제24조의2는 주민등록번호 처리를 법령상 근거가 있는 경우 등으로 제한하고, 제23조는 민감정보 처리에 별도 동의 또는 법령상 근거를 요구합니다.";

export const HIGH_RISK_STORIES = [
  {
    title: "장애 유형과 휴대전화번호가 함께 수집되는 경우",
    body: "한 지자체의 시민 인식조사에는 장애 유형 문항과 경품용 휴대전화번호 문항이 함께 있습니다. 두 항목이 같은 응답 행에 연결되면, 연락처만으로 특정인의 장애 상태를 알 수 있는 명부가 됩니다. 이 자료가 유출되면 복지서비스 사칭, 맞춤형 사기, 사생활 공개 협박에 악용될 수 있습니다. 전화번호는 바꿀 수 있지만 알려진 장애·질환 정보는 되돌릴 수 없습니다.",
  },
  {
    title: "아동·가족의 건강정보가 수집되는 경우",
    body: "한 중앙행정기관의 유가족 지원 실태 조사는 자녀의 치료·재활 필요 여부를 물었고, 한 재단의 어린이 프로그램은 참여 어린이의 주민등록번호를 받았습니다. 지원이나 행사 운영에 필요한 범위를 넘어 건강정보와 고유식별정보가 쌓이지 않도록 항목별 필요성, 열람 대상, 보유기간과 파기 책임자를 문서로 정해야 합니다.",
  },
];

export const LAW_ISSUES = [
  {
    no: "①",
    category: "처리위탁 공개",
    law: "개인정보 보호법 제26조제2항, 제30조제1항",
    problem: "응답 저장·처리를 서비스 운영사에 맡기면서 수탁자를 공개하지 않음",
    finding: "위탁 안내 미흡 143건 (96.0%)",
  },
  {
    no: "②",
    category: "국외이전",
    law: "같은 법 제28조의8제1항",
    problem: "해외 서버에 저장될 수 있으나 이전 국가·보관 장소를 안내하지 않음",
    finding: "국외이전 안내 미흡 99건 (66.4%), 구글폼 90건",
  },
  {
    no: "③",
    category: "안전성 확보조치",
    law: "같은 법 제29조, 시행령 제30조",
    problem: "담당자 개인 계정 관리, 응답 시트 링크 공유, 내려받은 사본의 PC 보관으로 접근통제·접속기록 관리 곤란",
    finding: "안전조치 안내 미흡 147건 (98.7%)",
  },
  {
    no: "④",
    category: "최소수집·동의 거부권",
    law: "같은 법 제15조제2항제4호, 제16조제1항·제3항",
    problem: "\"필수 응답\" 설정으로 불필요한 항목까지 받거나 동의하지 않으면 제출할 수 없게 설정",
    finding: "동의 거부권 안내 미흡 91건 (61.1%)",
  },
  {
    no: "⑤",
    category: "주민등록번호",
    law: "같은 법 제24조의2제1항",
    problem: "자유 입력 칸으로 주민등록번호를 받음",
    finding: "3건",
  },
  {
    no: "⑥",
    category: "민감정보",
    law: "같은 법 제23조제1항",
    problem: "건강·장애 정보를 일반 동의만으로 이름·연락처와 함께 수집",
    finding: "8건",
  },
  {
    no: "⑦",
    category: "파기",
    law: "같은 법 제21조제1항",
    problem: "설문 종료 뒤에도 응답 원본·연동 시트·내려받은 파일이 남아 파기 여부 확인 곤란",
    finding: "공개 화면으로 확인 불가, 기관 확인 필요",
  },
  {
    no: "⑧",
    category: "클라우드 보안인증",
    law: "클라우드컴퓨팅법 제20조제2항, 국가 사이버보안 기본지침 제24조의4제1항",
    problem: "CSAP 미확인, 국정원 도입 가능 목록에도 없음",
    finding: "149건 전부",
  },
  {
    no: "⑨",
    category: "민감등급 업무정보",
    law: "국가 사이버보안 기본지침 제2조제17호, 제66조제4항",
    problem: "국민의 개인정보(민감등급)를 상용 서비스에 직접 저장",
    finding: "149건 전부",
  },
  {
    no: "⑩",
    category: "위탁사업 관리·감독",
    law: "개인정보 보호법 제26조제4항, 국가 사이버보안 기본지침 제13조",
    problem: "용역으로 운영한 설문도 발주기관의 관리 책임이 남지만 수탁자의 도구 사용을 확인하지 않음",
    finding: "예: 중앙부처 사업 수탁사가 운영한 진단 조사",
  },
];

export const LAW_NOTE =
  "공개 화면 기준 진단 결과로서 위반 여부를 판정한 것이 아니며, 최종 판단은 권한 있는 기관의 절차에 따릅니다.";

export const REPLY_CASE =
  "한 공기업은 해당 설문을 즉시 종료하고, 전 부서에 외부 설문 플랫폼 이용 유의사항과 CSAP 인증 플랫폼 사용을 공지했습니다. 보유기간 종료 뒤 파기 시점·방법 명시, 설문 첫 화면의 담당부서·연락처 표시, 응답 데이터 접근권한 최소화도 약속했습니다.";

export const REPLY_PRINCIPLE =
  "진흥원은 개선권고 공문만으로 주의 환기 목적을 달성했다고 보고 기관 실명은 공개하지 않기로 했습니다. 실태조사 결과는 개인정보보호위원회에 제출하고 제도 개선을 건의할 예정입니다.";

export const AUDIT_QA = [
  {
    issue: "외부 설문도구",
    question: "건강정보·주민등록번호·계좌정보 등 고위험 개인정보를 외부 설문도구로 받는 공공기관 관행 지적",
    answer: "심각한 사안은 정식 조사 전 사전 실태점검을 진행 중이라고 설명하고, 구글폼 등 수집 방식도 주의 깊게 살펴야 한다고 답변",
  },
  {
    issue: "자료 관리·위탁기관 책임",
    question: "설문 종료 뒤 사본이 남고 담당자 인사이동 뒤 관리·사고 대응에 공백 발생. 용역사에 맡긴 기관의 감독 책임 문제 제기",
    answer: "수탁업체와 함께 위탁한 기관 자체에도 엄격하게 책임을 묻겠다는 취지로 답변",
  },
  {
    issue: "권고와 평가",
    question: "가이드·권고 중심 대응만으로는 현장 관행을 바꾸기 어렵다는 문제 제기",
    answer: "평가에 반영하는 방안을 검토하고 관계부처와 협의하겠다고 답변",
  },
  {
    issue: "새로운 보안 위험",
    question: "민간 서비스의 API 인증 취약점과 AI 활용 개발 확산에 따른 공공 보안 문제 지적",
    answer: "AI로 인한 보안 취약점 가능성을 인정하고, 개발·설계 단계 가이드의 현장 활용을 독려하겠다고 답변",
  },
];

export const AUDIT_META = {
  date: "2026. 10. 13.",
  committee: "국회 정무위원회 국정감사",
  note: "답변은 언론에 보도된 발언을 요약한 것입니다. 개인정보보호위원회는 10. 16. 외부 설문도구 이용 시 안전조치 준수와 안내서 보완 계획을 발표했습니다.",
};

export const POLICY_TASKS = {
  compliance: [
    {
      action: "도구 점검·전환",
      basis: "국가 사이버보안 기본지침 제24조의3·제24조의4",
      detail: "인증·목록 등재·보안요건 증빙 확보, 미충족 도구의 신규 수집 중단, 적합 서비스로 전환",
    },
    {
      action: "수집 항목 정비",
      basis: "개인정보 보호법 제15·16·23·24조의2",
      detail: "목적별 필요성과 처리 근거 확인, 불필요 항목 삭제, 주민등록번호·민감정보 우선 시정",
    },
    {
      action: "수탁자 통제",
      basis: "같은 법 제26조, 시행령 제28조",
      detail: "수탁자 도구·재위탁 사전 승인, 처리 현황 점검, 계약 종료 때 반환·파기 검수",
    },
    {
      action: "자료·계정 관리",
      basis: "같은 법 제21·29·30조",
      detail: "기관 소유 관리 계정, 공유 권한 최소화, 접속·반출 기록 관리, 보유기간 종료 자료 파기",
    },
  ],
  joint: [
    {
      task: "현황 전수 등록",
      body: "개인정보위·행안부와 주무부처·지자체가 설문 링크, 운영 기관·수탁자, 도구, 수집 항목, 관리 계정·보관 위치를 관리대장에 등록. 소속·산하기관 누락 확인",
    },
    {
      task: "도입 기준 공동 시달",
      body: "개인정보위·국정원·행안부가 「국가 사이버보안 기본지침」 도입 가능 목록 의무와 개인정보 보호법상 수집·위탁·보관·파기 의무를 한 번에 확인하는 공동 점검기준 마련",
    },
    {
      task: "기존 자료 정리",
      body: "수집 중단일, 서비스 전환일, 기존 자료의 이관·권한 회수·사본 파기 완료일을 구분해 기관장이 책임자 지정. 내려받은 파일·공유본·수탁업체 보관본까지 처리 결과 제출",
    },
    {
      task: "평가 반영",
      body: "관리대장 등록, 도입요건 확인, 수탁업체 점검, 시정기한 준수, 파기 증빙을 개인정보 보호수준 평가와 기관장 평가에 연계. 반복 위반·불이행 감점 기준 마련",
    },
    {
      task: "국회 보고",
      body: "본부·소속·산하기관과 지방 공공기관까지 기관별 시정 완료일과 담당 조직을 확정해 국회에 보고",
    },
  ],
};

export const POLICY_GAP_NOTE =
  "같은 문제가 기관 유형과 관계없이 반복되는 것은 공공기관의 온라인 개인정보 수집 도구에 관한 기준이 여러 법령·지침에 흩어져 있고, 일부는 권고 수준에 그쳐 현장에서 구체적인 기준으로 작동하지 않기 때문입니다. 공공기관이 국민의 개인정보를 수집할 때 쓸 수 있는 도구와 절차에 대한 명확한 기준이 필요합니다.";

export const REPORT_NATURE = [
  "이 보고서와 기관별 분석보고서는 법적 판단이 아닌 자율진단 결과이며, 위반 여부의 최종 확정은 개인정보보호위원회 등 권한 있는 기관의 절차로만 이루어집니다.",
  "진단 시점에 공개된 화면만 기준으로 하였고, 화면에서 확인되지 않은 사항은 \"확인되지 않음\"으로 표시했을 뿐 위반으로 단정하지 않습니다.",
  "개인정보보호진흥원은 (재)한국컨설팅산업재단 부설 민간 공익기구로 정부기관이 아니며, 개선 권고는 법적 강제력이 없습니다. 기관의 이의·소명은 사실관계를 확인해 처리하고 있습니다.",
];

export const RESEARCH_DOWNLOADS = [
  { label: "국정감사 공동 보도자료 (최종 통계)", file: "downloads/research/press-2026-public-survey-final.pdf" },
];

export const RESEARCH_PAGE = {
  title: "실태조사·분석",
  description:
    "국민이 실제로 마주하는 온라인 신청·설문 화면을 SURE-CHECK로 같은 기준에서 진단하고, 결과를 기관에 알려 개선으로 이어 갑니다.",
} as const;

export const SURE_CHECK_CTA = {
  title: "국민 누구나 SURE-CHECK",
  body: "설문 링크만 넣으면 개인정보법 준수 여부를 자동으로 진단한 보고서를 받을 수 있습니다. 잘못된 개인정보를 요구하는 설문은 바로 알릴 수 있습니다.",
} as const;

export const NOTICE_GAP_NOTE =
  "미흡: 안내가 없거나 일부만 게시된 경우. 한 설문이 여러 항목에 중복 집계될 수 있음";

export const TOOL_BAR_NOTE = "해당 서비스 CSAP 인증 없음";

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
    to: "/privacy-center/research",
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

export const POLICY_DETAILS: PolicyItem[] = [
  {
    slug: "secure-tool-use",
    title: "적용 보안요건을 충족한 도구 사용",
    background:
      "결과 통보 공문을 발송한 137개 기관의 개인정보 수집 설문 149건의 도구는 구글폼 90건, 네이버폼 47건, 모아폼 11건, SurveyMonkey 1건이었습니다.",
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
    background: "개인정보 수집 설문 149건 가운데 민감·고위험 정보가 확인된 설문은 10건입니다.",
    summary:
      "민감정보나 고유식별정보에 해당하는 문항이 보이는 수집 화면부터 기관이 우선 점검하도록 제안합니다. 10건은 유출이 확인된 사건이 아닙니다.",
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
      "위탁 안내가 미흡한 설문이 143건이었습니다. 안내가 없다는 사실을 곧 법 위반으로 단정하지는 않습니다.",
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

export function publicationTypeLabel(type: string) {
  return type === "정책 제안" ? "보도참고" : type;
}

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
      "개인정보 보호수준 진단 대상 1,464개 기관 중 홈페이지를 운영하는 1,347개 기관을 확인하고, 결과 통보 공문을 발송한 137개 기관의 개인정보 수집 설문 149건을 분석한 조사의 공개 요약입니다. 원문 파일은 등록 후 다운로드할 수 있습니다.",
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

export type EducationSession = {
  no: string;
  start: string;
  end: string;
  field: string;
  title: string;
  summary: string;
  speaker: string;
  speakerLabel: string;
  logo: string;
  /** 흰 로고라 남색 바탕 위에 보여 준다. */
  logoOnDark?: boolean;
  /** 자료가 없으면 빈 문자열. 화면에서 다운로드 버튼을 숨긴다. */
  materialFile: string;
  /** YouTube 연결 전 왼쪽에 보여줄 영상 장면. */
  poster: string;
  youtubeId: string;
  startSec: number | null;
  durationLabel: string;
};

export type EducationMaterial = {
  label: string;
  file: string;
  ready: boolean;
};

export type EducationItem = {
  slug: string;
  title: string;
  subtitle: string;
  lawNote: string;
  date: string;
  timeLabel: string;
  year: number;
  topics: string[];
  mode: string;
  fee: string;
  host: string;
  organizers: string[];
  cohosts: string[];
  applicantsLabel: string;
  participantsLabel: string | null;
  summary: string;
  status: EducationStatus;
  capacity: number | null;
  sessions: EducationSession[];
  materials: EducationMaterial[];
  youtubeId: string;
  highlights: string[];
  vendorNotice: string;
  published: boolean;
  publishAt: string;
};

export const EDUCATION_PAGE = {
  title: "교육·웨비나",
  description:
    "강화된 개인정보 보호법에 맞춰, 공공기관과 기업이 실제 업무에 적용할 수 있는 대응 방법을 전문가와 함께 나눕니다.",
  replayKicker: "WEBINAR REPLAY",
  watchAll: "전체 보기",
  getMaterials: "자료 받기",
  pendingVideo: "영상 공개 준비 중",
  closePlayer: "닫기",
  playVideo: "재생",
  watchLarge: "크게 보기",
  sessionsTitle: "세션별로 바로 보기",
  watchOnYoutube: "YouTube에서 보기",
  newTab: "새 탭",
  pendingFile: "공개 준비 중",
  download: "내려받기",
  downloadMaterial: "자료 내려받기",
  applicantsPrefix: "신청",
  hostLabel: "주최",
  organizerLabel: "주관",
  cohostLabel: "공동참여",
  videoTitleSuffix: "영상",
  nextNotice: "다음 교육은 일정이 정해지면 공지사항으로 안내합니다.",
  inquiry: "기관 맞춤 교육 문의",
  inquiryEmail: "cs@kcf-korea.org",
  inquirySubject: "[교육 문의] 기관명",
  notFound: "교육을 찾을 수 없습니다.",
  nav: [
    { id: "replay", label: "다시보기" },
    { id: "sessions", label: "세션" },
    { id: "materials", label: "자료" },
    { id: "about", label: "웨비나 소개" },
    { id: "next", label: "다음 교육" },
  ],
} as const;

export const EDUCATION_SEED: EducationItem[] = [
  {
    slug: "2026-privacy-practice",
    title: "강화되는 개인정보보호법과 기업·기관의 실전 대응 및 적용",
    subtitle: "공공기관과 기업이 모두 준비해야 하는 핵심 대응 전략",
    lawNote: "2026년 9월 11일 시행 개정 개인정보 보호법 대응",
    date: "2026-09-30",
    timeLabel: "14:00~16:20",
    year: 2026,
    topics: ["개인정보 보호법", "공공·기업 실무"],
    mode: "온라인 웨비나",
    fee: "무료",
    status: "종료",
    host: "개인정보보호진흥원(한국컨설팅산업재단)",
    organizers: ["법무법인 율촌", "㈜파수AI", "㈜와이즈인컴퍼니", "㈜타이거컴퍼니", "㈜피앤피시큐어", "㈜프리모데이터"],
    cohosts: ["한국서비스산업연합회", "한국SW·ICT연합회 산하 30개 협회"],
    applicantsLabel: "860개 이상 기관·기업",
    participantsLabel: null, // TODO(확인): 실제 접속자 수
    summary:
      "법률의 주요 변화와 함께, 기업과 기관이 실제 업무에서 적용할 수 있는 개인정보보호 대응체계와 보안인증 SaaS 활용방안을 법률·보안·정보수집·협업·시스템 DB 분야 전문가가 안내한 온라인 웨비나입니다.",
    capacity: null,
    youtubeId: "", // TODO(확인): YouTube 업로드 후 입력
    // TODO(확인): 세션이 6개로 늘면서 시작·종료 시각은 재확인이 필요합니다. 화면에는 시각을 표시하지 않습니다.
    sessions: [
      {
        no: "01",
        start: "",
        end: "",
        field: "법률",
        title: "강화되는 개인정보보호법과 기업·기관의 대응",
        summary: "개인정보보호 법적 책임, 위탁·재위탁, 외부 SaaS 활용, 개인정보 유출 및 기관·기업의 준비사항",
        speaker: "법무법인 율촌",
        speakerLabel: "법무법인 율촌 (발표: 김선희 파트너 변호사)",
        logo: yulchonLogo,
        materialFile: "downloads/education/2026-09/01-yulchon-privacy-law.pdf",
        poster: "images/education/webinar/01.jpg",
        youtubeId: "GU7m5wv-ztw",
        startSec: null,
        durationLabel: "30분",
      },
      {
        no: "02",
        start: "",
        end: "",
        field: "실무",
        title: "온라인 개인정보 수집 실무 리스크와 대응 사례",
        summary: "온라인 설문·이벤트 등 실무 현장의 개인정보 수집 리스크 사례·위반 의심 사례 대응 및 실무 체크포인트",
        speaker: "개인정보보호진흥원",
        speakerLabel: "개인정보보호진흥원 (발표: 장보윤 고문변호사)",
        logo: kcfMark,
        materialFile: "downloads/education/2026-09/02-online-collection-risk.pdf",
        poster: "images/education/webinar/02.jpg",
        youtubeId: "uqzMJ6ypnXo",
        startSec: null,
        durationLabel: "",
      },
      {
        no: "03",
        start: "",
        end: "",
        field: "업무흐름",
        title: "기업과 기관의 개인정보·보안 대응 실전",
        summary: "개인정보 수집·협업·DB·외주·백업 등 업무 흐름별 위험과 대응방안",
        speaker: "㈜파수AI",
        speakerLabel: "㈜파수AI (발표: 김규봉 본부장)",
        logo: fasooLogo,
        logoOnDark: true,
        materialFile: "downloads/education/2026-09/03-fasoo-security-practice.pdf",
        poster: "images/education/webinar/03.jpg",
        youtubeId: "NyUB5nnRNhA",
        startSec: null,
        durationLabel: "30분",
      },
      {
        no: "04",
        start: "",
        end: "",
        field: "정보수집",
        title: "외부 정보수집의 보안 공백과 WiseON 적용",
        summary: "설문·신청·접수·조사의 개인정보보호 이슈와 보안인증 정보수집 SaaS 활용",
        speaker: "㈜와이즈인컴퍼니",
        speakerLabel: "㈜와이즈인컴퍼니 (발표: 김원표 대표이사)",
        logo: wiseinLogo,
        materialFile: "downloads/education/2026-09/04-wiseon-collection.pdf",
        poster: "images/education/webinar/04.jpg",
        youtubeId: "Cs864UWmKGQ",
        startSec: null,
        durationLabel: "20분",
      },
      {
        no: "05",
        start: "",
        end: "",
        field: "거버넌스",
        title: "전사 개인정보 거버넌스(개인정보 라이프 사이클 관리) 기반의 사전예방 체계 시급",
        summary: "보유 현황, 동의 이력, 파기 대상, 정보주체 권리요구 처리 현황 등 전 주기를 통합 관리",
        speaker: "㈜타이거컴퍼니",
        speakerLabel: "㈜타이거컴퍼니 (발표: 한형덕 상무)",
        logo: tigrisLogo,
        materialFile: "downloads/education/2026-09/05-tiger-governance.pdf",
        poster: "images/education/webinar/05.jpg",
        youtubeId: "TjEAetT6BEo",
        startSec: null,
        durationLabel: "",
      },
      {
        no: "06",
        start: "",
        end: "",
        field: "시스템DB",
        title: "자체 시스템과 핵심 DB의 개인정보보호",
        summary: "DB 접근통제·암호화·마스킹·접속기록·외부접속·백업 등 시스템 DB 보호방안",
        speaker: "㈜피앤피시큐어",
        speakerLabel: "㈜피앤피시큐어 (발표: 홍충호 대리, 공공채널사업부)",
        logo: pnpLogo,
        materialFile: "",
        poster: "images/education/webinar/06.jpg",
        youtubeId: "C_ajD9Tmu1M",
        startSec: null,
        durationLabel: "15분",
      },
    ],
    materials: [
      {
        label: "강화되는 개인정보보호법과 기업·기관의 대응",
        file: "downloads/education/2026-09/01-yulchon-privacy-law.pdf",
        ready: true,
      },
      {
        label: "온라인 개인정보 수집 실무 리스크와 대응 사례",
        file: "downloads/education/2026-09/02-online-collection-risk.pdf",
        ready: true,
      },
      {
        label: "기업과 기관의 개인정보·보안 대응 실전",
        file: "downloads/education/2026-09/03-fasoo-security-practice.pdf",
        ready: true,
      },
      {
        label: "외부 정보수집의 보안 공백과 WiseON 적용",
        file: "downloads/education/2026-09/04-wiseon-collection.pdf",
        ready: true,
      },
      {
        label: "전사 개인정보 거버넌스(개인정보 라이프 사이클 관리) 기반의 사전예방 체계 시급",
        file: "downloads/education/2026-09/05-tiger-governance.pdf",
        ready: true,
      },
    ],
    highlights: [
      "법률과 실무를 연계한 통합 프로그램 — 개인정보보호법의 주요 변화와 실제 조직의 대응방안을 함께 제시",
      "업무 흐름에 따른 구체적인 실행방안 — 외부 정보수집, 내부 협업, 시스템 DB, 외부 위탁, 백업·복구 등 단계별 위험과 대응방법",
      "보안인증 SaaS 및 전문 솔루션 적용사례 — 실제 업무에 적용할 수 있는 보안인증 서비스 소개",
      "조직별 맞춤형 대응체계 — 모든 솔루션을 일괄 도입하는 방식이 아니라 조직의 업무와 위험에 맞는 우선순위와 적용방법",
      "전문가 질의응답 및 도입상담 연계 — 법률·보안·SaaS·DB·컨설팅 전문가가 실무질문에 공동으로 답변",
    ],
    vendorNotice: "주관사 발표에는 각 사 서비스 소개가 포함되어 있으며, 개인정보보호진흥원의 제품 보증이 아닙니다.",
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
  "공식 침해 신고는 개인정보 침해신고센터(privacy.kisa.or.kr, 국번 없이 118)로 합니다. 진흥원 제보는 그 신고를 대신하지 않습니다.",
  "피해를 겪은 분도 참여할 수 있습니다. 신청서에 피해 경위나 민감정보를 적지 않습니다.",
  "집단활동은 합법적인 공동의견 제출과 권리행사 안내로 한정합니다.",
  "특정인의 개인정보를 동의 없이 올리거나, 특정인을 괴롭히거나, 같은 민원을 자동으로 반복 전송하는 활동은 하지 않습니다.",
  "그러한 내용이 접수되면 승인하지 않거나 활동을 중지합니다.",
] as const;

export const MONITOR_PAGE = {
  title: "개인정보 지키미 모니터링단",
  metaTitle: "개인정보 지키미 모니터링단 | 개인정보보호진흥원",
  status: "모집 예정",
  lead: "국민이 공개된 신청·설문 화면을 함께 살피고, 우려가 있으면 알립니다.",
  about: [
    { title: "공개 화면 점검", body: "기관·기업이 공개한 온라인 신청·설문 화면에서 개인정보를 필요 이상으로 요구하거나 안내가 빠진 곳을 살핍니다." },
    { title: "SURE-CHECK 활용", body: "설문 링크만 넣으면 개인정보법 준수 여부를 자동으로 진단하는 SURE-CHECK로 점검합니다." },
    { title: "진흥원 검토·안내", body: "모니터링단이 알린 사례는 진흥원이 사실을 확인한 뒤 해당 기관에 개선을 안내합니다." },
  ],
  pendingNote: "모집 일정, 활동 기간, 활동 혜택은 선발 공지 때 안내합니다.",
  preApply: {
    title: "사전 신청",
    body: "모집이 시작되면 가장 먼저 알려 드립니다. 아래 양식으로 사전 신청해 주세요.",
    items: ["이름 또는 활동명", "이메일", "거주 시·도", "관심 분야", "참여 동기"],
    mailto: `mailto:cs@kcf-korea.org?subject=${encodeURIComponent("[지키미 사전신청] 이름")}`,
    privacy: "신청 내용은 모집·선발 안내에만 씁니다. 보관 기간은 동의 항목에 적힌 대로입니다. 자세한 내용은 개인정보처리방침을 확인해 주세요.",
  },
  officialReport: "공식 침해 신고는 개인정보 침해신고센터(privacy.kisa.or.kr, 국번 없이 118)로 합니다. 진흥원 제보는 그 신고를 대신하지 않습니다.",
  nav: [
    { id: "about", label: "활동 안내" },
    { id: "join", label: "참여" },
    { id: "pre-apply", label: "사전 신청" },
    { id: "rules", label: "활동 원칙" },
  ],
  activitiesLabel: "활동 분야",
  sureCheck: "SURE-CHECK 해 보기",
  mailtoLabel: "이메일로 사전 신청",
  privacyPolicy: "개인정보처리방침",
  staticApplyNote: "현재 이메일로 사전 신청을 받습니다",
  staticApplyLink: "사전 신청 안내",
} as const;

export const DATA_SUBJECT_RIGHTS = {
  title: "정보주체의 권리",
  lead: "정보주체는 재단에 대해 언제든지 개인정보 열람, 정정, 삭제, 처리정지 요구와 동의 철회를 할 수 있습니다.",
  items: ["열람", "정정", "삭제", "처리정지", "동의 철회"],
} as const;

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
  body: "전자신문 2026년 10월 15일 자 보도는, 2026년 10월 13일 국회 정무위원회 국정감사에서 박상혁 의원이 공공부문 수탁기관 관리를 질의했고 송경희 개인정보보호위원장이 수탁기관 관리 지침을 마련하겠다고 밝혔다고 전합니다.",
} as const;

export const SEPARATE_SAMPLE_NOTE =
  "2026년 4월 전자신문은 박상혁 의원실이 와이즈인컴퍼니에 의뢰한 표본조사(117개 기관)를 보도했습니다. 그 표본 수치와 이 페이지의 1,347개 기관 전수조사는 다른 조사입니다.";
