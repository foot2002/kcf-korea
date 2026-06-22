import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { historyFull } from "@/data/kcf";
import heroHistory from "@/assets/hero-history.jpg";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "재단 연혁 | 한국컨설팅산업재단" },
      {
        name: "description",
        content:
          "2010년 설립부터 현재까지 한국컨설팅산업재단(KCF)의 주요 연혁과 발자취를 확인하세요.",
      },
      { property: "og:title", content: "재단 연혁 | 한국컨설팅산업재단" },
      { property: "og:url", content: "/history" },
    ],
    links: [{ rel: "canonical", href: "/history" }],
  }),
  component: HistoryPage,
});

// Sort key — "현재" first, then year descending
function sortKey(year: string): number {
  if (year.includes("현재")) return 99999;
  const m = year.match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : 0;
}

// Group entries by year-bucket label for visual grouping
function bucketLabel(year: string): string {
  if (year.includes("현재")) return "현재";
  const m = year.match(/(\d{4})/);
  return m ? m[1] : year;
}

function HistoryPage() {
  const sorted = [...historyFull].sort(
    (a, b) => sortKey(b.year) - sortKey(a.year)
  );

  // Group by bucket label, preserving sorted order
  const groups: { label: string; items: typeof historyFull }[] = [];
  for (const item of sorted) {
    const label = bucketLabel(item.year);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push(item);
    } else {
      groups.push({ label, items: [item] });
    }
  }

  return (
    <>
      <PageHero
        eyebrow="연혁"
        title="2010년부터 이어온 KCF의 발자취"
        desc="설립 이후 컨설팅·교육·개인정보보호·NBO 사무국 운영 등 다양한 영역에서 축적해 온 재단의 주요 연혁입니다."
        bgImage={heroHistory}
      />

      {/* Year-axis navigation */}
      <section className="sticky-below-header border-b border-border bg-white/95 backdrop-blur">
        <div className="container-page max-w-6xl overflow-x-auto py-4">
          <div className="flex min-w-max items-center gap-2">
            <span className="mr-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-text-muted">
              연도별
            </span>
            {groups.map((g) => (
              <a
                key={g.label}
                href={`#year-${g.label}`}
                className="rounded-full border border-border bg-white px-3.5 py-1.5 text-[13px] font-semibold text-navy transition hover:border-trust-blue hover:text-trust-blue"
              >
                {g.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="container-page max-w-6xl">
          <div className="relative">
            {/* Central spine (desktop) / left spine (mobile) */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 bg-gradient-to-b from-trust-blue/40 via-trust-blue/20 to-transparent" />

            <div className="space-y-16 md:space-y-24">
              {groups.map((group, gi) => (
                <div key={group.label} id={`year-${group.label}`} className="relative scroll-mt-32">
                  {/* Year marker — large display */}
                  <div className="relative md:flex md:justify-center mb-8">
                    <div className="ml-10 md:ml-0 inline-flex items-center gap-3 rounded-full border border-trust-blue/20 bg-white px-5 py-2.5 shadow-[0_10px_30px_rgba(29,78,216,0.12)]">
                      {group.label === "현재" && (
                        <Sparkles className="h-4 w-4 text-trust-blue" />
                      )}
                      <span className="text-[24px] md:text-[28px] font-bold text-navy tracking-tight leading-none">
                        {group.label}
                      </span>
                      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-trust-blue">
                        {group.items.length} {group.items.length > 1 ? "Milestones" : "Milestone"}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-6 md:space-y-10">
                    {group.items.map((h, i) => {
                      const isRight = i % 2 === 1;
                      return (
                        <li
                          key={i}
                          className="relative grid grid-cols-[32px_1fr] md:grid-cols-2 md:gap-12 items-center"
                        >
                          {/* Node dot */}
                          <span className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-6 z-10 flex h-4 w-4 items-center justify-center">
                            <span className="absolute inset-0 rounded-full bg-trust-blue/30 animate-ping" />
                            <span className="relative h-3 w-3 rounded-full bg-trust-blue ring-4 ring-white" />
                          </span>

                          {/* Mobile: single column; Desktop: alternating */}
                          {isRight && <div className="hidden md:block" />}
                          <div
                            className={`col-start-2 md:col-start-auto ${
                              isRight ? "md:pl-8" : "md:pr-8 md:text-right"
                            }`}
                          >
                            <article
                              className={`relative group overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 md:p-7 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] hover:border-trust-blue/40 ${
                                isRight ? "" : "md:items-end"
                              }`}
                            >
                              {/* Accent stripe */}
                              <span
                                className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b from-trust-blue to-privacy-green ${
                                  isRight ? "left-0" : "md:right-0 left-0 md:left-auto"
                                }`}
                              />
                              {/* Decorative glow */}
                              <span
                                className={`pointer-events-none absolute h-32 w-32 rounded-full bg-trust-blue/10 blur-3xl ${
                                  isRight ? "-right-10 -top-10" : "-left-10 -top-10"
                                }`}
                              />

                              <div
                                className={`flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-trust-blue ${
                                  isRight ? "" : "md:justify-end"
                                }`}
                              >
                                <span>{h.year}</span>
                              </div>
                              <h3 className="mt-2 text-[19px] md:text-[20px] font-bold text-navy leading-snug">
                                {h.title}
                              </h3>
                              <p className="mt-3 text-[14.5px] text-text-secondary leading-relaxed">
                                {h.detail}
                              </p>
                            </article>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Spine cap */}
            <div className="relative mt-10 flex justify-start md:justify-center">
              <div className="ml-2 md:ml-0 -translate-x-1/2 md:translate-x-0 flex flex-col items-center">
                <span className="h-3 w-3 rounded-full bg-trust-blue ring-4 ring-white shadow" />
                <span className="mt-3 rounded-full bg-navy px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                  Since 2010
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
