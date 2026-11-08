import { Check } from "lucide-react";

import coverPolicy from "@/assets/reports/cover-policy-report.webp";
import coverWhitepaper from "@/assets/reports/cover-whitepaper.webp";
import { AI_FORMS_REPORT } from "@/data/ai-forms-report";

const COPY = AI_FORMS_REPORT;

const COVERS = {
  whitepaper: { src: coverWhitepaper, width: 800, height: 1132 },
  policy: { src: coverPolicy, width: 800, height: 1132 },
} as const;

function RichText({ parts }: { parts: readonly { text: string; em?: boolean }[] }) {
  return parts.map((part, index) =>
    part.em ? (
      <strong key={index} className="rpt-num">{part.text}</strong>
    ) : (
      <span key={index}>{part.text}</span>
    ),
  );
}

export function AiFormsReportView() {
  return (
    <article className="rpt">
      <header className="rpt-hero">
        <div className="rpt-wrap rpt-hero-grid">
          <div>
            <p className="rpt-eyebrow">{COPY.hero.label}</p>
            <h1>
              {COPY.hero.titleLead}
              <br />
              <span className="rpt-accent">{COPY.hero.titleAccent}</span>
            </h1>
            <p className="rpt-lead">{COPY.hero.lead}</p>
            <div className="rpt-hero-actions">
              {COPY.books.map((book) => (
                <a key={book.id} className="rpt-btn rpt-btn--primary" href="#download">
                  {book.heroButton}
                  <span>{book.size}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="rpt-hero-covers">
            {COPY.books.map((book) => {
              const cover = COVERS[book.cover];
              return (
                <a key={book.id} href="#download" className="rpt-cover-link" aria-label={book.coverAlt}>
                  <img src={cover.src} width={cover.width} height={cover.height} alt="" />
                </a>
              );
            })}
          </div>
        </div>
      </header>

      <section className="rpt-section" aria-labelledby="report-overview-title">
        <div className="rpt-wrap">
          <h2 id="report-overview-title">{COPY.overviewTitle}</h2>
          <div className="rpt-overview">
            {COPY.rows.map((row) => (
              <div key={row.id} className="rpt-row">
                <div className="rpt-row-label">
                  <span>{row.en}</span>
                  {row.label}
                </div>
                <div className="rpt-row-body">
                  <h3>{row.headline}</h3>
                  {row.body.length > 0 ? <p><RichText parts={row.body} /></p> : null}
                  {row.points.length > 0 ? (
                    <ul>
                      {row.points.map((point) => (
                        <li key={point}>
                          <Check aria-hidden="true" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
            <div className="rpt-row">
              <div className="rpt-row-label">
                <span>{COPY.info.en}</span>
                {COPY.info.label}
              </div>
              <dl className="rpt-info">
                {COPY.info.fields.map((field) => (
                  <div key={field.label}>
                    <dt>{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
                <div>
                  <dt>문의</dt>
                  <dd>
                    <a href={`tel:${COPY.info.phone.replace(/-/g, "")}`}>{COPY.info.phone}</a>
                    <span aria-hidden="true"> · </span>
                    <a href={`mailto:${COPY.info.email}`}>{COPY.info.email}</a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section id="download" className="rpt-section rpt-section--line">
        <div className="rpt-wrap">
          <h2>{COPY.downloadsTitle}</h2>
          <p className="rpt-lead-sm">{COPY.downloadsLead}</p>
          <div className="rpt-books">
            {COPY.books.map((book) => {
              const cover = COVERS[book.cover];
              return (
                <article key={book.id}>
                  <img src={cover.src} width={cover.width} height={cover.height} alt={book.coverAlt} loading="lazy" />
                  <div>
                    <p className="rpt-kicker">{book.kind}</p>
                    <h3>{book.title}</h3>
                    <p className="rpt-audience">{book.audience}</p>
                    <p>{book.intro}</p>
                    <p className="rpt-meta">{book.meta}</p>
                    <a
                      className="rpt-btn rpt-btn--primary"
                      href={`${import.meta.env.BASE_URL}${book.file}`}
                      download={book.downloadName}
                      aria-label={book.ariaLabel}
                    >
                      {book.button}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </article>
  );
}
