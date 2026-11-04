import type { EducationItem } from "@/data/privacy-program";
import type { Institution } from "@/data/sure-mark";
import type {
  BoardType,
  NoticeItem,
  PledgeItem,
  PublicationContentItem,
  StatItem,
} from "@/lib/content/types";

const BOARD_TYPES: BoardType[] = ["보도자료", "보고서·자료", "관련 보도", "보도참고"];
const TIERS = ["실천기관", "우수기관"] as const;
const STATUSES = ["유효", "재검토", "회수"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function fileItems(value: unknown): unknown[] | null {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.items)) return null;
  return value.items;
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function parseNotices(value: unknown): NoticeItem[] | null {
  const items = fileItems(value);
  if (!items) return null;
  return items.map((item, index) => {
    if (!isRecord(item) || typeof item.title !== "string" || typeof item.date !== "string") {
      throw new Error("notice");
    }
    return {
      id: text(item.id, `notice-${index + 1}`),
      title: item.title,
      date: item.date,
      link: text(item.link),
      body: text(item.body),
      published: item.published !== false,
    };
  });
}

export function parsePublications(value: unknown): PublicationContentItem[] | null {
  const items = fileItems(value);
  if (!items) return null;
  return items.map((item) => {
    if (!isRecord(item) || typeof item.title !== "string" || typeof item.date !== "string") throw new Error("publication");
    const boardType = BOARD_TYPES.includes(item.boardType as BoardType) ? (item.boardType as BoardType) : "보고서·자료";
    return {
      slug: text(item.slug, item.title),
      boardType,
      title: item.title,
      date: item.date,
      source: text(item.source),
      url: text(item.url),
      file: text(item.file),
      summary: text(item.summary),
      keywords: Array.isArray(item.keywords) ? item.keywords.filter((keyword) => typeof keyword === "string") : [],
      internalPath: text(item.internalPath),
      published: item.published !== false,
    };
  });
}

export function parseEducation(value: unknown): EducationItem[] | null {
  const items = fileItems(value);
  if (!items) return null;
  return items as EducationItem[];
}

export function parseInstitutions(value: unknown): Institution[] | null {
  const items = fileItems(value);
  if (!items) return null;
  return items.map((item) => {
    if (!isRecord(item) || typeof item.name !== "string" || typeof item.certNo !== "string") throw new Error("institution");
    const tier = TIERS.includes(item.tier as (typeof TIERS)[number]) ? (item.tier as Institution["tier"]) : "우수기관";
    const status = STATUSES.includes(item.status as (typeof STATUSES)[number])
      ? (item.status as Institution["status"])
      : "유효";
    return {
      certNo: item.certNo,
      name: item.name,
      tier,
      selectedAt: text(item.selectedAt),
      status,
      reason: text(item.reason),
      certFile: text(item.certFile),
      published: item.published !== false,
    };
  });
}

export function parsePledges(value: unknown): PledgeItem[] | null {
  const items = fileItems(value);
  if (!items) return null;
  return items.map((item, index) => {
    if (!isRecord(item) || typeof item.name !== "string") throw new Error("pledge");
    return {
      id: text(item.id, `pledge-${index + 1}`),
      name: item.name,
      date: text(item.date),
      published: item.published !== false,
    };
  });
}

export function parseStats(value: unknown): StatItem[] | null {
  const items = fileItems(value);
  if (!items) return null;
  return items.map((item) => {
    if (!isRecord(item) || typeof item.label !== "string" || typeof item.value !== "string") throw new Error("stat");
    return { label: item.label, value: item.value };
  });
}

export function safeParse<T>(parse: (value: unknown) => T | null, value: unknown): T | null {
  try {
    return parse(value);
  } catch {
    return null;
  }
}
