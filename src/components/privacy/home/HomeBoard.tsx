import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { useNotices, usePublications } from "@/lib/content/load";
import type { PublicationContentItem } from "@/lib/content/types";
import { HOME_UI } from "@/data/privacy-home";

type BoardTo =
  | "/privacy-center/sure-mark"
  | "/privacy-center/security-services"
  | "/privacy-center/research"
  | "/privacy-center/publications"
  | "/privacy-center/rights"
  | "/privacy-center/law"
  | "/privacy-center/education"
  | "/privacy-center/ai-forms-report";

type BoardRow = {
  key: string;
  date: string;
  title: string;
  slug?: string;
  href?: string;
  to?: BoardTo;
};

export function normalizeBoardDate(value: string) {
  const iso = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const dotted = value.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  if (dotted) return `${dotted[1]}-${dotted[2].padStart(2, "0")}-${dotted[3].padStart(2, "0")}`;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return "0000-00-00";
  const date = new Date(parsed);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function dateParts(value: string) {
  const [year, month, day] = normalizeBoardDate(value).split("-");
  return { day: String(Number(day)), ym: `${year}.${month}` };
}

function latestRows(rows: BoardRow[]) {
  const sorted = [...rows].sort((a, b) => normalizeBoardDate(b.date).localeCompare(normalizeBoardDate(a.date)));
  const seen = new Set<string>();
  const unique: BoardRow[] = [];
  for (const row of sorted) {
    if (seen.has(row.title)) continue;
    seen.add(row.title);
    unique.push(row);
  }
  return unique.slice(0, 5);
}

function internalTo(path: string): BoardTo | undefined {
  if (
    path === "/privacy-center/sure-mark" ||
    path === "/privacy-center/security-services" ||
    path === "/privacy-center/research" ||
    path === "/privacy-center/publications" ||
    path === "/privacy-center/rights" ||
    path === "/privacy-center/law" ||
    path === "/privacy-center/education" ||
    path === "/privacy-center/ai-forms-report"
  ) {
    return path;
  }
  return undefined;
}

function pressTarget(item: PublicationContentItem): Pick<BoardRow, "href" | "slug" | "to"> {
  if (item.url) return { href: item.url };
  if (item.file) return { href: `${import.meta.env.BASE_URL}${item.file}` };
  if (item.summary) return { slug: item.slug };
  const to = internalTo(item.internalPath);
  return to ? { to } : { to: "/privacy-center/publications" };
}

export function HomeBoard() {
  const noticeItems = useNotices();
  const publicationItems = usePublications();
  const [tab, setTab] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const notices = latestRows(
    noticeItems
      .filter((item) => item.published)
      .map((item) => ({
        key: item.id,
        date: item.date,
        title: item.title,
        href: item.link.startsWith("http") ? item.link : undefined,
        to: item.link.startsWith("/") ? internalTo(item.link) : undefined,
      })),
  );
  const press = latestRows(
    publicationItems
      .filter((item) => item.published && (item.boardType === "보도자료" || item.boardType === "관련 보도"))
      .map((item) => ({ key: item.slug, date: item.date, title: item.title, ...pressTarget(item) })),
  );
  const rows = tab === 0 ? notices : press;
  const labels = [HOME_UI.noticeTab, HOME_UI.pressTab];

  function selectTab(next: number) {
    const index = (next + labels.length) % labels.length;
    setTab(index);
    window.requestAnimationFrame(() => tabs.current[index]?.focus());
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-[#D1D5DB] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div role="tablist" aria-label={`${HOME_UI.noticeTab} ${HOME_UI.pressTab}`} className="flex gap-4">
          {labels.map((label, index) => (
            <button
              key={label}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`home-board-tab-${index}`}
              aria-selected={tab === index}
              aria-controls={`home-board-panel-${index}`}
              tabIndex={tab === index ? 0 : -1}
              className={`border-b-2 pb-2 text-[16px] font-bold ${
                tab === index ? "border-[#0B3A6E] text-[#0B3A6E]" : "border-transparent text-[#374151]"
              }`}
              onClick={() => setTab(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  selectTab(index + 1);
                }
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  selectTab(index - 1);
                }
                if (event.key === "Home") {
                  event.preventDefault();
                  selectTab(0);
                }
                if (event.key === "End") {
                  event.preventDefault();
                  selectTab(labels.length - 1);
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <Link
          to={HOME_UI.moreTo}
          hash={tab === 0 ? "notices" : "press"}
          className="shrink-0 text-[14px] font-bold text-[#0B3A6E] hover:underline"
        >
          {HOME_UI.more}
        </Link>
      </div>
      <div role="tabpanel" id={`home-board-panel-${tab}`} aria-labelledby={`home-board-tab-${tab}`} className="mt-4">
        <ul>
          {rows.map((row) => {
            const parts = dateParts(row.date);
            const title = <span className="block truncate text-[15px] font-semibold text-[#111827]">{row.title}</span>;
            return (
              <li key={row.key} className="flex items-center gap-4 border-b border-[#E5E7EB] py-3 last:border-b-0">
                <div className="w-14 shrink-0 text-center">
                  <p className="text-[22px] font-bold leading-none text-[#0B3A6E]">{parts.day}</p>
                  <p className="mt-1 text-[12px] text-[#374151]">{parts.ym}</p>
                </div>
                {row.slug ? (
                  <Link to="/privacy-center/publications/$slug" params={{ slug: row.slug }} className="min-w-0 flex-1 hover:underline">
                    {title}
                  </Link>
                ) : row.to ? (
                  <Link to={row.to} className="min-w-0 flex-1 hover:underline">
                    {title}
                  </Link>
                ) : row.href ? (
                  <a href={row.href} className="min-w-0 flex-1 hover:underline" target="_blank" rel="noopener noreferrer">
                    {title}
                  </a>
                ) : (
                  <div className="min-w-0 flex-1">{title}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
