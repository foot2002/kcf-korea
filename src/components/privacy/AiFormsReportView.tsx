import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

import coverPolicy from "@/assets/reports/cover-policy-report.webp";
import coverWhitepaper from "@/assets/reports/cover-whitepaper.webp";
import previewNumbers from "@/assets/reports/preview-numbers.webp";
import previewRoutes from "@/assets/reports/preview-14-routes.webp";
import previewRules from "@/assets/reports/preview-10-rules.webp";
import previewSummary from "@/assets/reports/preview-report-summary.webp";
import illMonitor from "@/assets/illustrations/ill-monitor.svg";
import illOrg from "@/assets/illustrations/ill-org-account.svg";
import illPolicy from "@/assets/illustrations/ill-policy.svg";
import illScattered from "@/assets/illustrations/ill-scattered-data.svg";
import { CountUp } from "@/components/site/CountUp";
import { AI_FORMS_REPORT, OCCURRENCE, type OccurrenceKind, type RouteSegment } from "@/data/ai-forms-report";

const COPY = AI_FORMS_REPORT;

const COVERS = {
  whitepaper: { src: coverWhitepaper, width: 800, height: 1132 },
  policy: { src: coverPolicy, width: 800, height: 1132 },
} as const;

const PREVIEWS = {
  numbers: { src: previewNumbers, width: 1200, height: 1698, alt: "숫자로 보는 위험과 효과. 149건, 11만 2,890개, 80에서 90퍼센트, 2차 인증 피해 0명, 자동 공격 99퍼센트 차단." },
  routes: { src: previewRoutes, width: 1200, height: 1698, alt: "설문·신청·수집 단계의 14개 해킹 침투경로 한눈에 보기." },
  rules: { src: previewRules, width: 1200, height: 1698, alt: "국민 행동수칙 10가지 요약 그림." },
  summary: { src: previewSummary, width: 1200, height: 1698, alt: "보고서 요약. 발간 목적, 14개 경로, 여섯 겹의 대응." },
} as const;

const ILLUSTRATIONS = {
  monitor: { src: illMonitor, alt: "화면을 살피는 사람 일러스트" },
  org: { src: illOrg, alt: "기관 계정을 나누어 관리하는 일러스트" },
  policy: { src: illPolicy, alt: "정책 문서를 정리하는 일러스트" },
  scattered: { src: illScattered, alt: "흩어진 데이터를 모으는 일러스트" },
} as const;

type Shot = { src: string; alt: string; width: number; height: number };

function OccurrenceBadge({ kind }: { kind: OccurrenceKind }) {
  const item = OCCURRENCE[kind];
  return (
    <span className={`rpt-badge rpt-badge--${item.tone}`}>
      <OccurrenceIcon kind={kind} />
      {item.label}
    </span>
  );
}

function OccurrenceIcon({ kind }: { kind: OccurrenceKind }) {
  if (kind === "domestic") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "overseas") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 8h10M8 2.8c1.6 1.5 2.4 3.3 2.4 5.2S9.6 11.7 8 13.2C6.4 11.7 5.6 9.9 5.6 8S6.4 4.3 8 2.8z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2.2 14.2 13H1.8L8 2.2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6.2v3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.2" r="0.7" fill="currentColor" />
    </svg>
  );
}

function useLightbox() {
  const [shot, setShot] = useState<Shot | null>(null);
  const open = useCallback((next: Shot) => setShot(next), []);
  const close = useCallback(() => setShot(null), []);
  return { shot, open, close };
}

export function AiFormsReportView() {
  const lightbox = useLightbox();
  const [segment, setSegment] = useState<RouteSegment>("account");
  const [audience, setAudience] = useState<(typeof COPY.audiences)[number]["id"]>("people");
  const [copied, setCopied] = useState("");
  const activeAudience = COPY.audiences.find((item) => item.id === audience) ?? COPY.audiences[0];
  const visibleRoutes = COPY.routes.filter((item) => item.segment === segment);

  async function copyClause(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(id);
  }

  return (
    <article className="rpt">
      <header className="rpt-hero">
        <div className="rpt-wrap rpt-hero-grid">
          <div>
            <p className="rpt-eyebrow">{COPY.hero.eyebrow}</p>
            <h1>{COPY.hero.title}</h1>
            <p className="rpt-lead">{COPY.hero.lead}</p>
            <div className="rpt-hero-actions">
              {COPY.books.map((book) => (
                <a key={book.id} className="rpt-btn rpt-btn--primary" href="#download">
                  {book.kind} 받기
                  <span>PDF · {book.size}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="rpt-hero-covers">
            {COPY.books.map((book) => {
              const cover = COVERS[book.cover];
              return (
                <a key={book.id} href="#download" className="rpt-cover-link">
                  <img src={cover.src} width={cover.width} height={cover.height} alt={`${book.kind} 표지. ${book.title}`} />
                  <span>{book.kind}</span>
                </a>
              );
            })}
          </div>
        </div>
      </header>

      <nav className="rpt-tabs" aria-label="페이지 구역">
        <div className="rpt-wrap rpt-tablist">
          {COPY.tabs.map((tab) => (
            <a key={tab.id} href={`#${tab.id}`}>
              {tab.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="purpose" className="rpt-section">
        <div className="rpt-wrap rpt-split">
          <div>
            <h2>{COPY.purpose.title}</h2>
            <p>{COPY.purpose.body}</p>
          </div>
          <PreviewFigure shot={PREVIEWS.summary} onOpen={lightbox.open} />
        </div>
      </section>

      <section id="findings" className="rpt-section rpt-section--cream">
        <div className="rpt-wrap">
          <h2>{COPY.numbersTitle}</h2>
          <ul className="rpt-numbers">
            {COPY.numbers.map((item) => (
              <li key={item.label}>
                <span className={`rpt-kicker rpt-kicker--${item.tone}`}>{item.badge}</span>
                <CountUp value={item.value} className={item.tone === "good" ? "rpt-figure-num is-good" : "rpt-figure-num"} />
                <p>{item.label}</p>
                <small>{item.when}</small>
              </li>
            ))}
          </ul>
          <PreviewFigure shot={PREVIEWS.numbers} onOpen={lightbox.open} />
        </div>
      </section>

      <section className="rpt-section" aria-labelledby="routes-title">
        <div className="rpt-wrap">
          <h2 id="routes-title">{COPY.routesTitle}</h2>
          <p className="rpt-lead-sm">{COPY.routesLead}</p>
          <TabButtons
            label="침투경로 구분"
            tabs={COPY.segments}
            active={segment}
            onChange={(id) => setSegment(id as RouteSegment)}
          />
          <div className="rpt-route-layout" role="tabpanel" id={`panel-${segment}`} aria-labelledby={`tab-${segment}`}>
            <PreviewFigure shot={PREVIEWS.routes} onOpen={lightbox.open} />
            <div className="rpt-table-wrap">
              <table className="rpt-table">
                <caption className="sr-only">{COPY.segments.find((item) => item.id === segment)?.label} 침투경로</caption>
                <thead>
                  <tr>
                    <th scope="col">번호</th>
                    <th scope="col">경로</th>
                    <th scope="col">구분</th>
                    <th scope="col">어떻게 들어오나</th>
                    <th scope="col">실제 사례</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRoutes.map((route) => (
                    <tr key={route.no}>
                      <td data-label="번호">{route.no}</td>
                      <th scope="row" data-label="경로">{route.name}</th>
                      <td data-label="구분"><OccurrenceBadge kind={route.kind} /></td>
                      <td data-label="어떻게 들어오나">{route.how}</td>
                      <td data-label="실제 사례">{route.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="rpt-section rpt-section--cream">
        <div className="rpt-wrap">
          <h2>{COPY.reasonsTitle}</h2>
          <ol className="rpt-reasons">
            {COPY.reasons.map((item) => (
              <li key={item.no}>
                <span>{item.no}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rpt-section">
        <div className="rpt-wrap">
          <h2>{COPY.defenseTitle}</h2>
          <p className="rpt-lead-sm">{COPY.defenseLead}</p>
          <ol className="rpt-layers">
            {COPY.layers.map((item) => (
              <li key={item.no}>
                <span>{item.no}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="how" className="rpt-section rpt-section--cream">
        <div className="rpt-wrap">
          <h2>{COPY.audienceTitle}</h2>
          <TabButtons
            label="읽는 사람"
            tabs={COPY.audiences.map((item) => ({ id: item.id, label: item.label }))}
            active={audience}
            onChange={(id) => setAudience(id as (typeof COPY.audiences)[number]["id"])}
          />
          <div className="rpt-audience" role="tabpanel" id={`panel-${audience}`} aria-labelledby={`tab-${audience}`}>
            <img src={ILLUSTRATIONS[activeAudience.illustration].src} alt={ILLUSTRATIONS[activeAudience.illustration].alt} width={280} height={180} />
            <div>
              <h3>{activeAudience.label}</h3>
              <p>{activeAudience.body}</p>
            </div>
          </div>

          <div className="rpt-rules">
            <h3>{COPY.rulesTitle}</h3>
            <p>{COPY.rulesLead}</p>
            <ol>
              {COPY.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
            <PreviewFigure shot={PREVIEWS.rules} onOpen={lightbox.open} />
          </div>

          <div className="rpt-contract">
            <h3>{COPY.contractTitle}</h3>
            <p>{COPY.contractLead}</p>
            <ul>
              {COPY.clauses.map((clause) => (
                <li key={clause.id}>
                  <h4>{clause.title}</h4>
                  <p>{clause.text}</p>
                  <button type="button" className="rpt-btn rpt-btn--ghost" onClick={() => void copyClause(clause.id, clause.text)}>
                    {copied === clause.id ? "복사했습니다" : "문구 복사"}
                  </button>
                </li>
              ))}
            </ul>
            <p className="sr-only" aria-live="polite">{copied ? "문구를 복사했습니다." : ""}</p>
          </div>
        </div>
      </section>

      <section id="download" className="rpt-section">
        <div className="rpt-wrap">
          <h2>{COPY.downloadsTitle}</h2>
          <p className="rpt-lead-sm">{COPY.downloadsLead}</p>
          <div className="rpt-books">
            {COPY.books.map((book) => {
              const cover = COVERS[book.cover];
              const label = `${book.kind} 내려받기, PDF, ${book.size}`;
              return (
                <article key={book.id}>
                  <img src={cover.src} width={cover.width} height={cover.height} alt={`${book.kind} 표지. ${book.title}`} loading="lazy" />
                  <p className="rpt-kicker rpt-kicker--navy">{book.kind}</p>
                  <h3>{book.title}</h3>
                  <p>{book.pages} · {book.size} · {book.issue}</p>
                  <a
                    className="rpt-btn rpt-btn--primary"
                    href={`${import.meta.env.BASE_URL}${book.file}`}
                    download={book.downloadName}
                    aria-label={label}
                  >
                    {book.kind} 내려받기
                    <span>PDF · {book.size}</span>
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="rpt-section rpt-section--cream">
        <div className="rpt-wrap rpt-contact">
          <h2>{COPY.contact.title}</h2>
          <p>{COPY.contact.org}</p>
          <p>
            <a href={`mailto:${COPY.contact.email}`}>{COPY.contact.email}</a>
            <span aria-hidden="true"> · </span>
            <a href={`tel:${COPY.contact.phone.replace(/-/g, "")}`}>{COPY.contact.phone}</a>
          </p>
          <p>{COPY.contact.hours}</p>
        </div>
      </section>

      <section className="rpt-end">
        <div className="rpt-wrap">
          <h2>{COPY.endCta.title}</h2>
          <p>{COPY.endCta.body}</p>
          <a className="rpt-btn rpt-btn--light" href="#download">{COPY.endCta.label}</a>
        </div>
      </section>

      <Lightbox shot={lightbox.shot} onClose={lightbox.close} />
    </article>
  );
}

function PreviewFigure({ shot, onOpen }: { shot: Shot; onOpen: (shot: Shot) => void }) {
  return (
    <figure className="rpt-preview">
      <button type="button" onClick={() => onOpen(shot)} aria-label={`${shot.alt} 크게 보기`}>
        <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" />
      </button>
      <figcaption>
        <button type="button" className="rpt-btn rpt-btn--ghost" onClick={() => onOpen(shot)}>크게 보기</button>
      </figcaption>
    </figure>
  );
}

function TabButtons({
  label,
  tabs,
  active,
  onChange,
}: {
  label: string;
  tabs: readonly { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((tab) => tab.id === active);
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? (index + 1) % tabs.length
      : event.key === "ArrowLeft" ? (index - 1 + tabs.length) % tabs.length
        : event.key === "Home" ? 0
          : tabs.length - 1;
    onChange(tabs[next].id);
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("[role='tab']");
    buttons[next]?.focus();
  }
  return (
    <div className="rpt-seg" role="tablist" aria-label={label} onKeyDown={onKey}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={tab.id === active}
          aria-controls={`panel-${tab.id}`}
          tabIndex={tab.id === active ? 0 : -1}
          className={tab.id === active ? "is-active" : undefined}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function Lightbox({ shot, onClose }: { shot: Shot | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!shot) return;
    previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      previous.current?.focus();
    };
  }, [shot, onClose]);

  if (!shot || typeof document === "undefined") return null;
  return createPortal(
    <div className="rpt-lightbox">
      <button type="button" className="rpt-lightbox-backdrop" aria-label="크게 보기 닫기" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="rpt-lightbox-dialog">
        <h2 id={titleId} className="sr-only">{shot.alt}</h2>
        <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} />
        <button ref={closeRef} type="button" className="rpt-btn rpt-btn--light" onClick={onClose}>닫기</button>
      </div>
    </div>,
    document.body,
  );
}
