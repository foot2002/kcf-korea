import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { PUBLICATION_ART } from "@/components/privacy/privacy-visuals";
import { usePublicContent } from "@/components/privacy/use-public-content";
import { PcSection } from "@/components/privacy/privacy-ui";
import { PUBLICATION_TYPES } from "@/data/privacy-program";

export function PublicationLibrary() {
  const content = usePublicContent();
  const [view, setView] = useState<"card" | "list">("card");
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("전체");
  const [type, setType] = useState("전체");
  const years = ["전체", ...new Set(content.publications.map((item) => String(item.year)))];
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return content.publications.filter((item) => {
      if (year !== "전체" && String(item.year) !== year) return false;
      if (type !== "전체" && item.type !== type) return false;
      if (!needle) return true;
      const hay = `${item.title} ${item.summary} ${item.keywords.join(" ")} ${item.source}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [content.publications, query, type, year]);

  return (
    <PcSection variant="white">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-[13px] font-semibold text-navy">검색
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-1 block h-10 rounded-lg border border-border px-3" placeholder="제목, 키워드" />
        </label>
        <label className="text-[13px] font-semibold text-navy">연도
          <select value={year} onChange={(event) => setYear(event.target.value)} className="mt-1 block h-10 rounded-lg border border-border px-3">{years.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label className="text-[13px] font-semibold text-navy">유형
          <select value={type} onChange={(event) => setType(event.target.value)} className="mt-1 block h-10 rounded-lg border border-border px-3">
            <option>전체</option>
            {PUBLICATION_TYPES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <div className="ml-auto flex gap-2">
          <button type="button" className="btn-secondary-kcf" onClick={() => setView("list")}>목록형</button>
          <button type="button" className="btn-secondary-kcf" onClick={() => setView("card")}>카드형</button>
        </div>
      </div>
      {view === "list" ? (
        <ul className="mt-8 divide-y divide-border rounded-2xl border border-border">
          {filtered.map((item) => (
            <li key={item.slug}>
              <Link to="/privacy-center/publications/$slug" params={{ slug: item.slug }} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:justify-between">
                <span><span className="mr-2 text-[12px] font-bold text-trust-blue">{item.type}</span>{item.title}</span>
                <span className="text-[13px] text-text-muted">{item.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <li key={item.slug}>
              <Link to="/privacy-center/publications/$slug" params={{ slug: item.slug }} className="block h-full overflow-hidden rounded-[24px] border border-border bg-white">
                <img src={(PUBLICATION_ART[item.type] ?? PUBLICATION_ART["연구보고서"]).src} alt={(PUBLICATION_ART[item.type] ?? PUBLICATION_ART["연구보고서"]).alt} className="h-36 w-full object-cover" />
                <span className="block p-5">
                <div className="text-[12px] font-bold text-trust-blue">{item.type} · {item.year}</div>
                <h2 className="mt-2 text-[20px] font-bold text-navy">{item.title}</h2>
                <p className="mt-2 line-clamp-3 text-[14px] text-text-secondary">{item.summary}</p>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {filtered.length === 0 ? <p className="mt-6 text-text-secondary">검색 결과가 없습니다.</p> : null}
    </PcSection>
  );
}

export function PublicationDetail({ slug }: { slug: string }) {
  const content = usePublicContent();
  const item = content.publications.find((publication) => publication.slug === slug);
  if (!item) return <PcSection variant="white"><p>자료를 찾을 수 없습니다.</p></PcSection>;
  const related = content.publications.filter((publication) => publication.slug !== item.slug && (publication.type === item.type || publication.keywords.some((keyword) => item.keywords.includes(keyword)))).slice(0, 3);
  return (
    <PcSection variant="white">
      <p className="text-[13px] font-bold text-trust-blue">{item.type} · {item.source}</p>
      <h2 className="mt-2 text-navy">{item.title}</h2>
      <p className="mt-2 text-[13px] text-text-muted">{item.date}</p>
      <p className="mt-5 text-[15px] leading-relaxed text-text-secondary">{item.summary}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {item.externalUrl ? <a className="btn-primary-kcf" href={item.externalUrl} target="_blank" rel="noopener noreferrer">외부 자료 보기</a> : null}
        {item.internalPath === "/privacy-center/law" ? (
          <Link className="btn-secondary-kcf" to="/privacy-center/law">법령 해설 보기</Link>
        ) : item.internalPath === "/privacy-center/research" ? (
          <Link className="btn-secondary-kcf" to="/privacy-center/research">조사 페이지</Link>
        ) : null}
        {item.attachmentUrl ? <a className="btn-secondary-kcf" href={item.attachmentUrl} download={item.attachmentName || true}>첨부파일 다운로드</a> : <p className="text-[14px] text-text-muted">등록된 첨부파일이 없습니다.</p>}
      </div>
      {related.length > 0 ? (
        <div className="mt-10">
          <h3 className="text-[18px] font-bold text-navy">관련 자료</h3>
          <ul className="mt-3 space-y-2">
            {related.map((publication) => (
              <li key={publication.slug}>
                <Link to="/privacy-center/publications/$slug" params={{ slug: publication.slug }} className="text-[14px] font-semibold text-trust-blue">{publication.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </PcSection>
  );
}
