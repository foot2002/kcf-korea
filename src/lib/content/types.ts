export const CONTENT_BRANCH = "main";
export const CONTENT_REPO = "foot2002/kcf-korea";

export type ContentFile<T> = {
  version: 1;
  updatedAt: string;
  items: T[];
};

export type NoticeItem = {
  id: string;
  title: string;
  date: string;
  link: string;
  body: string;
  published: boolean;
};

export type BoardType = "보도자료" | "보고서·자료" | "관련 보도" | "보도참고";

export type PublicationContentItem = {
  slug: string;
  boardType: BoardType;
  title: string;
  date: string;
  source: string;
  url: string;
  file: string;
  summary: string;
  keywords: string[];
  internalPath: string;
  published: boolean;
};

export type PledgeItem = {
  id: string;
  name: string;
  date: string;
  published: boolean;
};

export type StatItem = {
  label: string;
  value: string;
};

export const CONTENT_FILES = {
  notices: "notices.json",
  publications: "publications.json",
  education: "education.json",
  institutions: "institutions.json",
  pledges: "pledges.json",
  stats: "stats.json",
} as const;

export type ContentName = keyof typeof CONTENT_FILES;
