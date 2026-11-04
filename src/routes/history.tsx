import { createFileRoute } from "@tanstack/react-router";
import { SubpageFrame } from "@/components/site/SubpageFrame";
import { absoluteUrl } from "@/lib/site-url";
import { historyFull } from "@/data/kcf";

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
      { property: "og:url", content: absoluteUrl("/history") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/history") }],
  }),
  component: HistoryPage,
});

function sortKey(year: string): number {
  if (year.includes("현재")) return 99999;
  const match = year.match(/(\d{4})/);
  return match ? parseInt(match[1], 10) : 0;
}

function bucketLabel(year: string): string {
  if (year.includes("현재")) return "현재";
  const match = year.match(/(\d{4})/);
  return match ? match[1] : year;
}

function HistoryPage() {
  const sorted = [...historyFull].sort((a, b) => sortKey(b.year) - sortKey(a.year));
  const groups: { label: string; items: typeof historyFull }[] = [];
  for (const item of sorted) {
    const label = bucketLabel(item.year);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }

  return (
    <>
      <SubpageFrame
        area="foundation"
        eyebrow="연혁"
        title="2010년부터 이어온 KCF의 발자취"
        description="설립 이후 컨설팅·교육·개인정보보호·NBO 사무국 운영 등 다양한 영역에서 축적해 온 재단의 주요 연혁입니다."
      />

      <section className="border-b border-[#D1D5DB] bg-white">
        <div className="container-page flex flex-wrap gap-2 py-4">
          <span className="self-center text-[13px] font-semibold text-[#4B5563]">연도별</span>
          {groups.map((group) => (
            <a
              key={group.label}
              href={`#year-${group.label}`}
              className="rounded-md border border-[#D1D5DB] px-3 py-1.5 text-[13px] font-semibold text-navy"
            >
              {group.label}
            </a>
          ))}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <ol className="border-l border-[#D1D5DB]">
            {groups.map((group) =>
              group.items.map((item, index) => (
                <li
                  key={`${item.year}-${item.title}`}
                  id={index === 0 ? `year-${group.label}` : undefined}
                  className="grid scroll-mt-40 gap-2 py-4 pl-5 md:grid-cols-[8.5rem_minmax(0,1fr)] md:pl-6"
                >
                  <p className="text-[16px] font-bold text-navy">{item.year}</p>
                  <div className="rounded-md border border-[#D1D5DB] bg-white p-4">
                    <h2 className="text-[18px] font-bold text-navy">{item.title}</h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#374151]">{item.detail}</p>
                  </div>
                </li>
              )),
            )}
          </ol>
        </div>
      </section>
    </>
  );
}
