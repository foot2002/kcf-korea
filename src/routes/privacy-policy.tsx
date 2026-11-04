import { createFileRoute } from "@tanstack/react-router";

import {
  PRIVACY_POLICY_ARTICLES,
  PRIVACY_POLICY_CLOSING,
  PRIVACY_POLICY_INTRO,
  type PolicyBlock,
  type PolicySpan,
} from "@/data/privacy-policy";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "개인정보처리방침 | 한국컨설팅산업재단" },
      {
        name: "description",
        content:
          "재단법인 한국컨설팅산업재단과 개인정보보호진흥원의 개인정보처리방침입니다.",
      },
      { property: "og:title", content: "개인정보처리방침 | 한국컨설팅산업재단" },
      { property: "og:url", content: absoluteUrl("/privacy-policy") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/privacy-policy") }],
  }),
  component: PrivacyPolicyPage,
});

function PolicyRich({ parts }: { parts: PolicySpan[] }) {
  return (
    <>
      {parts.map((part, index) => {
        if (part === "") {
          return (
            <span
              key={index}
              className="mx-0.5 inline-block rounded bg-soft-sky px-1.5 py-0.5 text-[13px] font-semibold text-navy"
            >
              확인 중
            </span>
          );
        }
        if (typeof part === "object") {
          return <strong key={index}>{part.strong}</strong>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function PolicyTable({ headers, rows }: { headers: string[]; rows: PolicySpan[][][] }) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {rows.map((row, rowIndex) => (
          <article key={rowIndex} className="rounded-lg border border-border bg-white p-4">
            <dl className="space-y-3">
              {row.map((cell, cellIndex) => (
                <div key={headers[cellIndex]}>
                  <dt className="text-[12px] font-bold text-navy">{headers[cellIndex]}</dt>
                  <dd className="mt-0.5 text-[14px] leading-relaxed text-text-secondary">
                    <PolicyRich parts={cell} />
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block" tabIndex={0} role="region" aria-label={`${headers[0]} 표`}>
        <table className="w-full border-collapse text-left text-[14px] leading-relaxed">
          <thead>
            <tr className="bg-navy text-white">
              {headers.map((header) => (
                <th key={header} scope="col" className="border border-navy px-3 py-2 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="align-top odd:bg-white even:bg-section-bg">
                {row.map((cell, cellIndex) => (
                  <td key={headers[cellIndex]} className="border border-border px-3 py-2 text-text-secondary">
                    <PolicyRich parts={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PolicyBlocks({ blocks }: { blocks: PolicyBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.kind === "paragraph") {
          return (
            <p key={index} className="text-[16px] leading-[1.75] text-text-secondary">
              <PolicyRich parts={block.parts} />
            </p>
          );
        }
        if (block.kind === "ordered") {
          return (
            <ol
              key={index}
              start={block.start ?? 1}
              className="list-decimal space-y-2 pl-5 text-[16px] leading-[1.75] text-text-secondary"
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <PolicyRich parts={item} />
                </li>
              ))}
            </ol>
          );
        }
        if (block.kind === "unordered") {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5 text-[16px] leading-[1.75] text-text-secondary">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <PolicyRich parts={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.kind === "note") {
          return (
            <p key={index} className="text-[15px] leading-[1.75] text-text-secondary">
              ※ <PolicyRich parts={block.parts} />
            </p>
          );
        }
        return <PolicyTable key={index} headers={block.headers} rows={block.rows} />;
      })}
    </div>
  );
}

function PrivacyPolicyPage() {
  return (
    <article className="section-y">
      <div className="container-page max-w-5xl">
        <h1 className="text-navy">개인정보처리방침</h1>
        <div className="mt-6 space-y-4">
          {PRIVACY_POLICY_INTRO.map((paragraph, index) => (
            <p key={index} className="text-[16px] leading-[1.75] text-text-secondary">
              <PolicyRich parts={paragraph} />
            </p>
          ))}
        </div>

        <nav aria-label="조문 목차" className="mt-8 rounded-lg border border-border bg-section-bg p-5">
          <h2 className="text-[15px] font-bold text-navy">목차</h2>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {PRIVACY_POLICY_ARTICLES.map((article) => (
              <li key={article.id}>
                <a href={`#${article.id}`} className="text-[14px] text-trust-blue underline-offset-2 hover:underline">
                  {article.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 space-y-12">
          {PRIVACY_POLICY_ARTICLES.map((article) => (
            <section key={article.id} id={article.id} className="scroll-mt-24">
              <h2 className="mb-4 text-navy">{article.title}</h2>
              <PolicyBlocks blocks={article.blocks} />
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-[15px] leading-[1.75] text-text-secondary">
          {PRIVACY_POLICY_CLOSING.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
