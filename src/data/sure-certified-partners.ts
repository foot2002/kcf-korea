export type SureCertifiedPartner = {
  id: string;
  name: string;
  nameEn?: string;
  serviceName: string;
  category: string;
  specialty: string;
  description: string;
  tags: readonly string[];
  /** Monogram shown when a logo asset is unavailable */
  mark: string;
  accent: string;
};

export const SURE_CERTIFIED_PARTNERS: readonly SureCertifiedPartner[] = [
  {
    id: "yulchon",
    name: "법무법인 율촌",
    nameEn: "Yulchon LLC",
    serviceName: "개인정보 전문 법률 자문",
    category: "법률·규제",
    specialty: "개인정보 전문 로펌",
    description:
      "개인정보 규제 대응, 유출·분쟁 자문, 컴플라이언스 체계 설계 등 개인정보 전 영역을 다루는 전문 법률 서비스를 제공합니다.",
    tags: ["규제 대응", "분쟁 자문", "컴플라이언스"],
    mark: "YC",
    accent: "#0F3D6E",
  },
  {
    id: "wisein",
    name: "와이즈인컴퍼니",
    nameEn: "WiseIn Company",
    serviceName: "WiseON",
    category: "조사·분석",
    specialty: "조사분석 솔루션",
    description:
      "온라인 조사·수집 환경에서 개인정보를 안전하게 다루는 WiseON 조사분석 솔루션으로 신뢰할 수 있는 데이터 수집을 지원합니다.",
    tags: ["조사분석", "수집 보안", "데이터 품질"],
    mark: "WO",
    accent: "#1B6B4A",
  },
  {
    id: "tiger",
    name: "타이거컴퍼니",
    nameEn: "Tiger Company",
    serviceName: "T-gris",
    category: "협업·플랫폼",
    specialty: "협업 솔루션",
    description:
      "조직 협업 과정에서 발생하는 개인정보 취급을 안전하게 관리하는 T-gris 협업 솔루션을 제공합니다.",
    tags: ["협업 보안", "접근 관리", "업무 효율"],
    mark: "TG",
    accent: "#B45309",
  },
  {
    id: "fasoo",
    name: "파수",
    nameEn: "Fasoo",
    serviceName: "Fasoo AI-R Privacy",
    category: "데이터 보안",
    specialty: "개인정보 비식별·문서보안",
    description:
      "비정형 데이터 내 개인정보 검출·마스킹과 문서·데이터 보안을 중심으로 개인정보 보호·활용을 함께 지원합니다.",
    tags: ["비식별화", "문서보안", "유출 방지"],
    mark: "FS",
    accent: "#1D4ED8",
  },
  {
    id: "pnpsecure",
    name: "피앤피시큐어",
    nameEn: "PNPSECURE",
    serviceName: "INFOSAFER · DBSAFER",
    category: "접근제어·감사",
    specialty: "접속기록·접근제어",
    description:
      "개인정보 접속기록 관리(INFOSAFER)와 DB·시스템 접근제어(DBSAFER)로 개인정보 처리 전 과정의 통제·감사를 지원합니다.",
    tags: ["접속기록", "접근제어", "감사 대응"],
    mark: "PN",
    accent: "#7C3AED",
  },
  {
    id: "oreunhaneul",
    name: "법무법인 오른하늘",
    nameEn: "Oreunhaneul Law",
    serviceName: "개인정보 자문 법률 서비스",
    category: "법률·자문",
    specialty: "개인정보 자문 로펌",
    description:
      "개인정보 처리·보호 실무에 맞춘 법률 자문과 제도 설계 지원으로 기업의 안심 운영을 돕습니다.",
    tags: ["법률 자문", "제도 설계", "실무 지원"],
    mark: "OH",
    accent: "#0E7490",
  },
] as const;
