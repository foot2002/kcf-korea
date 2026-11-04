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
  pinned?: boolean;
  publishAt?: string;
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
  thumbnail?: string;
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

export type MonitorStatus = "모집 예정" | "모집 중" | "모집 마감";

export type MonitorContent = {
  version: 1;
  updatedAt: string;
  status: MonitorStatus;
  recruitPeriod: string;
  activityPeriod: string;
  headcount: string;
  benefits: string[];
  noticeLink: string;
};

export type SlideImageId =
  | "hero-free-platform"
  | "hero-research"
  | "hero-webinar"
  | "foundation-consulting"
  | "foundation-nbo"
  | "foundation-youth";

export type ContentSlide = {
  id: string;
  area: "privacy" | "foundation";
  order: number;
  published: boolean;
  image: SlideImageId;
  eyebrow: string;
  title: string;
  body: string;
  buttonLabel: string;
  buttonLink: string;
};

export type BannerTone = "안내" | "중요";

export type BannerContent = {
  version: 1;
  updatedAt: string;
  text: string;
  link: string;
  tone: BannerTone;
  start: string;
  end: string;
  published: boolean;
};

export const CONTENT_FILES = {
  notices: "notices.json",
  publications: "publications.json",
  education: "education.json",
  institutions: "institutions.json",
  pledges: "pledges.json",
  monitor: "monitor.json",
  slides: "slides.json",
  banner: "banner.json",
  stats: "stats.json",
} as const;

export type ContentName = keyof typeof CONTENT_FILES;

export const SLIDE_IMAGE_OPTIONS: { id: SlideImageId; label: string }[] = [
  { id: "hero-free-platform", label: "무상제공 일러스트" },
  { id: "hero-research", label: "실태조사 일러스트" },
  { id: "hero-webinar", label: "웨비나 일러스트" },
  { id: "foundation-consulting", label: "재단 사진 · 컨설팅" },
  { id: "foundation-nbo", label: "재단 사진 · NBO" },
  { id: "foundation-youth", label: "재단 사진 · 청소년" },
];
