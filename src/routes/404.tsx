import { Link, createFileRoute } from "@tanstack/react-router";

import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "페이지를 찾을 수 없습니다 | 한국컨설팅산업재단" },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "페이지를 찾을 수 없습니다 | 한국컨설팅산업재단" },
      { property: "og:url", content: absoluteUrl("/404") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/404") }],
  }),
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <section className="section-y">
      <div className="container-page max-w-xl py-16 text-center">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-trust-blue">404</p>
        <h1 className="mt-3 text-navy">페이지를 찾을 수 없습니다</h1>
        <p className="mt-4 text-text-secondary">요청하신 주소를 찾을 수 없습니다.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary-kcf">
            홈
          </Link>
          <Link to="/privacy-center" className="btn-secondary-kcf">
            개인정보보호진흥원
          </Link>
        </div>
      </div>
    </section>
  );
}
