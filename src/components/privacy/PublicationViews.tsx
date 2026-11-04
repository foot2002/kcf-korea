import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Paperclip } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

import { normalizeBoardDate } from "@/components/privacy/home/HomeBoard";
import { PUBLICATIONS_PAGE } from "@/data/privacy-home";
import { useNotices, usePublications } from "@/lib/content/load";
import type { PublicationContentItem } from "@/lib/content/types";

const PAGE_SIZE = 10;
type TabId = (typeof PUBLICATIONS_PAGE.tabs)[number]["id"];
type InternalTo =
  | "/privacy-center/research"
  | "/privacy-center/law"
  | "/privacy-center/sure-mark"
  | "/privacy-center/security-services"
  | "/privacy-center/education"
  | "/privacy-center/rights";

type BoardRow = {
  key: string;
  title: string;
  date: string;
  file?: string;
  href?: string;
  to?: InternalTo;
  slug?: string;
  pending?: boolean;
};

function isTab(value: string): value is TabId {
  return PUBLICATIONS_PAGE.tabs.some((tab) => tab.id === value);
}

function fileHref(file: string) {
  return `${import.meta.env.BASE_URL}${file}`;
}

function displayDate(value: string) {
  const iso = normalizeBoardDate(value);
  if (iso === "0000-00-00") return value;
  const [year, month, day] = iso.split("-");
  return `${year}. ${Number(month)}. ${Number(day)}.`;
}

function asInternal(path: string | undefined): InternalTo | undefined {
  if (
    path === "/privacy-center/research" ||
    path === "/privacy-center/law" ||
    path === "/privacy-center/sure-mark" ||
    path === "/privacy-center/security-services" ||
    path === "/privacy-center/education" ||
    path === "/privacy-center/rights"
  ) {
    return path;
  }
  return undefined;
}

function dedupe(rows: BoardRow[]) {
  const sorted = [...rows].sort((a, b) => {
    const byDate = normalizeBoardDate(b.date).localeCompare(normalizeBoardDate(a.date));
    if (byDate !== 0) return byDate;
    const rank = (row: BoardRow) => (row.file || row.href || row.to || row.slug ? 0 : 1);
    return rank(a) - rank(b);
  });
  const seen = new Set<string>();
  const unique: BoardRow[] = [];
  for (const row of sorted) {
    if (seen.has(row.title)) continue;
    seen.add(row.title);
    unique.push(row);
  }
  return unique;
}

function RowTitle({ row }: { row: BoardRow }) {
  const className = "font-semibold text-[#111827] hover:underline";
  const title = row.pending ? (
    <>
      {row.title} <span className="font-normal text-[#4B5563]">({PUBLICATIONS_PAGE.pendingLink})</span>
    </>
  ) : (
    row.title
  );
  if (row.file) {
    return (
      <a className={className} href={fileHref(row.file)} target="_blank" rel="noopener noreferrer">
        {row.title}
      </a>
    );
  }
  if (row.href) {
    return (
      <a className={className} href={row.href} target="_blank" rel="noopener noreferrer">
        {row.title}
      </a>
    );
  }
  if (row.to === "/privacy-center/research") return <Link to="/privacy-center/research" className={className}>{title}</Link>;
  if (row.to === "/privacy-center/law") return <Link to="/privacy-center/law" className={className}>{title}</Link>;
  if (row.to === "/privacy-center/sure-mark") return <Link to="/privacy-center/sure-mark" className={className}>{title}</Link>;
  if (row.to === "/privacy-center/security-services") {
    return <Link to="/privacy-center/security-services" className={className}>{title}</Link>;
  }
  if (row.to === "/privacy-center/education") return <Link to="/privacy-center/education" className={className}>{title}</Link>;
  if (row.to === "/privacy-center/rights") return <Link to="/privacy-center/rights" className={className}>{title}</Link>;
  if (row.slug) {
    return (
      <Link to="/privacy-center/publications/$slug" params={{ slug: row.slug }} className={className}>
        {title}
      </Link>
    );
  }
  return <span className="font-semibold text-[#111827]">{title}</span>;
}

function Attachment({ file }: { file?: string }) {
  if (!file) return <span className="text-[13px] text-[#4B5563]">{PUBLICATIONS_PAGE.noFile}</span>;
  return (
    <a href={fileHref(file)} target="_blank" rel="noopener noreferrer" aria-label={PUBLICATIONS_PAGE.columns.file} className="inline-flex text-[#0B3A6E]">
      <Paperclip className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function publicationRow(item: PublicationContentItem): BoardRow {
  return {
    key: item.slug,
    title: item.title,
    date: item.date,
    file: item.file || undefined,
    href: item.url || undefined,
    to: asInternal(item.internalPath),
    slug: item.summary ? item.slug : undefined,
    pending: item.boardType === "관련 보도" && !item.url && !item.file,
  };
}

export function PublicationsBoard() {
  const noticeItems = useNotices();
  const publicationItems = usePublications();
  const navigate = useNavigate();
  const routerHash = useRouterState({ select: (state) => state.location.hash });
  const [tab, setTab] = useState<TabId>("notices");
  const [page, setPage] = useState(1);
  const baseId = useId();

  useEffect(() => {
    const id = routerHash.replace(/^#/, "");
    if (!isTab(id)) return;
    setTab(id);
    setPage(1);
  }, [routerHash]);

  const rows = useMemo(() => {
    const published = publicationItems.filter((item) => item.published);
    const notices = dedupe(
      noticeItems
        .filter((item) => item.published)
        .map((item) => ({
          key: item.id,
          title: item.title,
          date: item.date,
          href: item.link.startsWith("http") ? item.link : undefined,
          to: asInternal(item.link),
        })),
    );
    const press = dedupe(published.filter((item) => item.boardType === "보도자료").map(publicationRow));
    const reports = dedupe(
      published.filter((item) => item.boardType === "보고서·자료" || item.boardType === "보도참고").map(publicationRow),
    );
    const news = dedupe(published.filter((item) => item.boardType === "관련 보도").map(publicationRow));
    return { notices, press, reports, news };
  }, [noticeItems, publicationItems]);

  const activeRows = tab === "law" ? [] : rows[tab];
  const pageCount = Math.max(1, Math.ceil(activeRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = activeRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const startNo = activeRows.length - (currentPage - 1) * PAGE_SIZE;

  function selectTab(id: TabId) {
    setTab(id);
    setPage(1);
    void navigate({ to: "/privacy-center/publications", hash: id, replace: true });
  }

  return (
    <section className="border-t border-[#D1D5DB] bg-white">
      <div className="sticky-below-header z-30 border-b border-[#D1D5DB] bg-white">
        <div className="container-page overflow-x-auto">
          <div role="tablist" aria-label={PUBLICATIONS_PAGE.title} className="flex gap-1">
            {PUBLICATIONS_PAGE.tabs.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={item.id}
                aria-selected={tab === item.id}
                aria-controls={`${baseId}-panel`}
                tabIndex={tab === item.id ? 0 : -1}
                className={`shrink-0 border-b-2 px-3 py-3 text-[14px] font-semibold ${
                  tab === item.id ? "border-navy text-navy" : "border-transparent text-[#374151]"
                }`}
                onClick={() => selectTab(item.id)}
                onKeyDown={(event) => {
                  const last = PUBLICATIONS_PAGE.tabs.length - 1;
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    selectTab(PUBLICATIONS_PAGE.tabs[Math.min(last, index + 1)].id);
                  }
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    selectTab(PUBLICATIONS_PAGE.tabs[Math.max(0, index - 1)].id);
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    selectTab(PUBLICATIONS_PAGE.tabs[0].id);
                  }
                  if (event.key === "End") {
                    event.preventDefault();
                    selectTab(PUBLICATIONS_PAGE.tabs[last].id);
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={tab}
        className="container-page py-8 md:py-12"
      >
        {tab === "law" ? (
          <article className="max-w-3xl rounded-md border border-[#D1D5DB] p-5">
            <h2 className="text-[20px] font-bold text-navy">{PUBLICATIONS_PAGE.lawTitle}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#374151]">{PUBLICATIONS_PAGE.lawBody}</p>
            <Link to="/privacy-center/law" className="btn-primary-kcf mt-6">
              {PUBLICATIONS_PAGE.lawLink}
            </Link>
          </article>
        ) : activeRows.length === 0 ? (
          <p className="text-[15px] text-[#374151]">{PUBLICATIONS_PAGE.empty}</p>
        ) : (
          <>
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">{PUBLICATIONS_PAGE.tabs.find((item) => item.id === tab)?.label}</caption>
              <thead className="hidden md:table-header-group">
                <tr className="border-y border-[#D1D5DB] bg-[#F3F4F6] text-[14px] text-[#111827]">
                  <th scope="col" className="w-16 px-3 py-3 font-bold">{PUBLICATIONS_PAGE.columns.no}</th>
                  <th scope="col" className="px-3 py-3 font-bold">{PUBLICATIONS_PAGE.columns.title}</th>
                  <th scope="col" className="w-20 px-3 py-3 text-center font-bold">{PUBLICATIONS_PAGE.columns.file}</th>
                  <th scope="col" className="w-36 px-3 py-3 font-bold">{PUBLICATIONS_PAGE.columns.date}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row, index) => (
                  <tr key={row.key} className="block border-b border-[#D1D5DB] py-3 md:table-row md:py-0">
                    <td className="hidden px-3 py-3 text-[14px] text-[#374151] md:table-cell">{startNo - index}</td>
                    <td className="block px-1 text-[15px] md:px-3 md:py-3">
                      <span className="inline md:hidden">
                        {row.file ? <Paperclip className="mr-1 inline h-4 w-4 text-[#0B3A6E]" aria-hidden="true" /> : null}
                      </span>
                      <RowTitle row={row} />
                    </td>
                    <td className="hidden px-3 py-3 text-center md:table-cell">
                      <Attachment file={row.file} />
                    </td>
                    <td className="mt-1 block px-1 text-[13px] text-[#374151] md:mt-0 md:table-cell md:px-3 md:py-3 md:text-[14px]">
                      <time dateTime={normalizeBoardDate(row.date)}>{displayDate(row.date)}</time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav aria-label={PUBLICATIONS_PAGE.pageLabel} className="mt-6 flex flex-wrap gap-2">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                <button
                  key={number}
                  type="button"
                  aria-current={number === currentPage ? "page" : undefined}
                  className={`h-9 min-w-9 rounded-md border px-2 text-[14px] font-bold ${
                    number === currentPage ? "border-navy bg-navy text-white" : "border-[#D1D5DB] bg-white text-navy"
                  }`}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              ))}
            </nav>
          </>
        )}
      </div>
    </section>
  );
}

export function PublicationDetail({ slug }: { slug: string }) {
  const publications = usePublications();
  const item = publications.find((publication) => publication.slug === slug);
  if (!item) {
    return (
      <section className="border-t border-[#D1D5DB] bg-white">
        <div className="container-page py-12">
          <p className="text-[15px] text-[#374151]">{PUBLICATIONS_PAGE.notFound}</p>
        </div>
      </section>
    );
  }
  const related = publications
    .filter(
      (publication) =>
        publication.published &&
        publication.slug !== item.slug &&
        (publication.boardType === item.boardType || publication.keywords.some((keyword) => item.keywords.includes(keyword))),
    )
    .slice(0, 3);
  const internal = asInternal(item.internalPath);
  return (
    <section className="border-t border-[#D1D5DB] bg-white">
      <div className="container-page max-w-3xl py-12 md:py-16">
        <p className="text-[14px] font-bold text-[#0F766E]">{item.boardType} · {item.source}</p>
        <p className="mt-2 text-[14px] text-[#374151]">
          <time dateTime={normalizeBoardDate(item.date)}>{displayDate(item.date)}</time>
        </p>
        <p className="mt-5 text-[16px] leading-relaxed text-[#374151]">{item.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {item.url ? (
            <a className="btn-primary-kcf" href={item.url} target="_blank" rel="noopener noreferrer">
              {PUBLICATIONS_PAGE.external}
            </a>
          ) : null}
          {internal === "/privacy-center/law" ? (
            <Link className="btn-secondary-kcf" to="/privacy-center/law">{PUBLICATIONS_PAGE.lawLink}</Link>
          ) : null}
          {internal === "/privacy-center/research" ? (
            <Link className="btn-secondary-kcf" to="/privacy-center/research">{PUBLICATIONS_PAGE.researchLink}</Link>
          ) : null}
          {item.file ? (
            <a className="btn-secondary-kcf" href={fileHref(item.file)}>
              {PUBLICATIONS_PAGE.attachment}
            </a>
          ) : (
            <p className="text-[14px] text-[#4B5563]">{PUBLICATIONS_PAGE.noAttachment}</p>
          )}
        </div>
        {related.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-[18px] font-bold text-navy">{PUBLICATIONS_PAGE.related}</h2>
            <ul className="mt-3 divide-y divide-[#D1D5DB] rounded-md border border-[#D1D5DB]">
              {related.map((publication) => (
                <li key={publication.slug}>
                  <Link
                    to="/privacy-center/publications/$slug"
                    params={{ slug: publication.slug }}
                    className="block px-4 py-3 text-[15px] font-semibold text-navy hover:underline"
                  >
                    {publication.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
