import { PRESS } from "@/data/free-platform";
import { stats } from "@/data/kcf";
import { DEFAULT_NOTICES, PUBLICATION_EXTRAS } from "@/data/privacy-home";
import { EDUCATION_SEED, PUBLICATION_SEED, type PublicationType } from "@/data/privacy-program";
import { INSTITUTIONS } from "@/data/sure-mark";
import type { BoardType, NoticeItem, PledgeItem, PublicationContentItem, StatItem } from "@/lib/content/types";

function boardTypeOf(type: PublicationType): BoardType {
  if (type === "보도자료") return "보도자료";
  if (type === "언론보도") return "관련 보도";
  if (type === "정책 제안") return "보도참고";
  return "보고서·자료";
}

function isoDate(value: string) {
  const iso = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const dotted = value.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  if (!dotted) return value;
  return `${dotted[1]}-${dotted[2].padStart(2, "0")}-${dotted[3].padStart(2, "0")}`;
}

export function fallbackNotices(): NoticeItem[] {
  return [
    ...DEFAULT_NOTICES.map((item, index) => ({
      id: `notice-default-${index + 1}`,
      title: item.title,
      date: item.date,
      link: item.to,
      body: "",
      published: true,
    })),
    {
      id: "notice-recruit-planned",
      title: "국민 개인정보보호 모니터링단은 모집 예정입니다",
      date: "2026-10-18",
      link: "/privacy-center/rights",
      body: "선발 일정이 정해지면 이 게시판에 올립니다. 그 전에 남긴 신청은 사전 참여 의사로 접수됩니다.",
      published: true,
    },
  ];
}

export function fallbackPublications(): PublicationContentItem[] {
  const extras: PublicationContentItem[] = [
    {
      slug: "press-2026-public-survey-final",
      boardType: "보도자료",
      title: PUBLICATION_EXTRAS.press[0].title,
      date: PUBLICATION_EXTRAS.press[0].date,
      source: "개인정보보호진흥원",
      url: "",
      file: PUBLICATION_EXTRAS.press[0].file,
      summary: "",
      keywords: ["실태조사", "보도자료"],
      internalPath: "",
      published: true,
    },
    {
      slug: "report-2026-survey-result",
      boardType: "보고서·자료",
      title: PUBLICATION_EXTRAS.reports[0].title,
      date: PUBLICATION_EXTRAS.reports[0].date,
      source: "개인정보보호진흥원",
      url: "",
      file: "",
      summary: "",
      keywords: ["실태조사"],
      internalPath: PUBLICATION_EXTRAS.reports[0].link,
      published: true,
    },
    {
      slug: "report-wiseon-free-support",
      boardType: "보고서·자료",
      title: PUBLICATION_EXTRAS.reports[1].title,
      date: PUBLICATION_EXTRAS.reports[1].date,
      source: "개인정보보호진흥원",
      url: "",
      file: PUBLICATION_EXTRAS.reports[1].file,
      summary: "",
      keywords: ["무상제공"],
      internalPath: "/privacy-center/security-services",
      published: true,
    },
  ];
  const seeded: PublicationContentItem[] = PUBLICATION_SEED.map((item) => ({
    slug: item.slug,
    boardType: boardTypeOf(item.type),
    title: item.title,
    date: item.date,
    source: item.source,
    url: item.externalUrl ?? "",
    file: item.attachmentUrl ?? "",
    summary: item.summary,
    keywords: item.keywords,
    internalPath: item.internalPath ?? "",
    published: item.published,
  }));
  const seen = new Set([...extras, ...seeded].map((item) => item.title));
  const press: PublicationContentItem[] = PRESS.filter((item) => !seen.has(item.title)).map((item, index) => ({
    slug: `news-${index + 1}`,
    boardType: "관련 보도",
    title: item.title,
    date: isoDate(item.date),
    source: item.outlet,
    url: item.url,
    file: "",
    summary: "",
    keywords: [item.outlet],
    internalPath: "",
    published: true,
  }));
  return [...extras, ...seeded, ...press];
}

export function fallbackPledges(): PledgeItem[] {
  return [];
}

export function fallbackStats(): StatItem[] {
  return stats.map((item) => ({ label: item.label, value: item.value }));
}

export function fallbackEducation() {
  return EDUCATION_SEED;
}

export function fallbackInstitutions() {
  return INSTITUTIONS;
}
