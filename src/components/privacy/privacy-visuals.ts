import education from "@/assets/privacy/illust-education.jpg";
import law from "@/assets/privacy/illust-law.jpg";
import news from "@/assets/privacy/illust-news.jpg";
import policy from "@/assets/privacy/illust-policy.jpg";
import research from "@/assets/privacy/illust-research.jpg";
import services from "@/assets/privacy/illust-services.jpg";
import support from "@/assets/privacy/illust-support.jpg";
import guardian from "@/assets/privacy/guardian-mascot.jpg";

export const PRIVACY_VISUALS = {
  research: {
    src: research,
    alt: "공개된 화면을 살펴보며 조사 내용을 정리하는 장면",
    fit: "cover",
  },
  rights: {
    src: guardian,
    alt: "개인정보 사수를 상징하는 국민 개인정보 지키미 캐릭터",
    fit: "contain",
  },
  services: {
    src: services,
    alt: "안전한 서비스를 상징하는 방패와 자물쇠",
    fit: "contain",
  },
  policy: {
    src: policy,
    alt: "제도와 국민을 잇는 정책 제안 장면",
    fit: "contain",
  },
  support: {
    src: support,
    alt: "주민이 모여 지원 방안을 의논하는 장면",
    fit: "cover",
  },
  education: {
    src: education,
    alt: "온라인 교육이 진행되는 책상",
    fit: "cover",
  },
  publications: {
    src: research,
    alt: "조사와 보고 자료를 정리하는 장면",
    fit: "cover",
  },
} as const;

export const PUBLICATION_ART = {
  연구보고서: { src: research, alt: "조사 자료를 정리하는 장면" },
  언론보도: { src: news, alt: "신문과 취재 마이크" },
  보도자료: { src: news, alt: "신문과 취재 마이크" },
  "정책 제안": { src: policy, alt: "제도와 국민을 잇는 장면" },
  "법령 해설": { src: law, alt: "법전과 저울" },
  교육자료: { src: education, alt: "온라인 교육이 진행되는 책상" },
} as const;

export type PrivacyVisual = keyof typeof PRIVACY_VISUALS;
