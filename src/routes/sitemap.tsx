import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { FOUNDATION_NAV, PRIVACY_NAV, childHref } from "@/data/site-nav";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "사이트맵 | 한국컨설팅산업재단" },
      {
        name: "description",
        content: "한국컨설팅산업재단과 개인정보보호진흥원의 전체 메뉴입니다.",
      },
      { property: "og:title", content: "사이트맵 | 한국컨설팅산업재단" },
      { property: "og:url", content: absoluteUrl("/sitemap") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/sitemap") }],
  }),
  component: SitemapPage,
});

function SitemapPage() {
  return (
    <>
      <PageHero
        eyebrow="Sitemap"
        title="사이트맵"
        desc="재단과 개인정보보호진흥원의 전체 메뉴입니다."
        showLnb={false}
      />
      <section className="section-y">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <nav aria-label="재단 사이트맵">
            <h2 className="text-navy">재단</h2>
            <ul className="mt-4 space-y-4">
              {FOUNDATION_NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-[16px] font-bold text-navy hover:underline">
                    {item.label}
                  </Link>
                  {item.children?.length ? (
                    <ul className="mt-2 space-y-1 border-l border-[#D1D5DB] pl-3">
                      {item.children.map((child) => (
                        <li key={`${item.to}-${child.label}`}>
                          <a
                            href={childHref(item.to, child)}
                            className="text-[15px] text-[#374151] hover:text-navy hover:underline"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="개인정보보호진흥원 사이트맵">
            <h2 className="text-navy">개인정보보호진흥원</h2>
            <ul className="mt-4 space-y-4">
              {PRIVACY_NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-[16px] font-bold text-navy hover:underline">
                    {item.label}
                    {item.badge ? (
                      <span className="ml-1.5 inline-flex rounded-sm bg-[#E6F4F2] px-1.5 py-0.5 align-middle text-[11px] font-bold leading-none text-[#0F766E]">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                  {item.children?.length ? (
                    <ul className="mt-2 space-y-1 border-l border-[#D1D5DB] pl-3">
                      {item.children.map((child) => (
                        <li key={`${item.to}-${child.label}`}>
                          <Link
                            to={child.to ?? item.to}
                            hash={child.hash}
                            className="text-[15px] text-[#374151] hover:text-navy hover:underline"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
