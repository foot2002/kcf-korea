import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Link2, Printer } from "lucide-react";

import { isNavHrefCurrent, lnbForPath } from "@/data/site-nav";

type SubpageFrameProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  badge?: string;
  crumbLabel?: string;
  middleCrumbs?: readonly { label: string; to: string }[];
  showLnb?: boolean;
  area: "foundation" | "privacy";
};

export function SubpageFrame({
  eyebrow,
  title,
  description,
  badge,
  crumbLabel,
  middleCrumbs,
  showLnb = true,
  area,
}: SubpageFrameProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  const [copied, setCopied] = useState(false);
  const items = lnbForPath(pathname, area);
  const crumbTitle = crumbLabel ?? (typeof title === "string" ? title : "현재 페이지");
  const currentHref =
    items.find((item) => isNavHrefCurrent(pathname, hash, item.href))?.href ?? items[0]?.href ?? "";

  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="contents">
      <section className="subvisual bg-navy text-white">
        <div className="container-page flex min-h-40 flex-col justify-center py-8">
          {eyebrow ? (
            <p className="text-[13px] font-semibold tracking-wide text-[#E8EEF6]">{eyebrow}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="text-white">{title}</h1>
            {badge ? (
              <p className="inline-flex items-center rounded-md bg-[#E6F4F2] px-2.5 py-1 text-[13px] font-bold leading-none text-[#0F766E]">
                {badge}
              </p>
            ) : null}
          </div>
          {description ? (
            <p className="mt-2 max-w-3xl text-[16px] leading-[1.7] text-[#E8EEF6]">{description}</p>
          ) : null}
        </div>
      </section>

      <div className="breadcrumb-bar border-b border-[#D1D5DB] bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <nav aria-label="현재 위치" className="text-[14px] text-[#374151]">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to="/" className="hover:text-navy hover:underline">
                  홈
                </Link>
              </li>
              {area === "privacy" ? (
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true">&gt;</span>
                  <Link to="/privacy-center" className="hover:text-navy hover:underline">
                    개인정보보호진흥원
                  </Link>
                </li>
              ) : null}
              {middleCrumbs?.map((crumb) => (
                <li key={crumb.to} className="flex items-center gap-1.5">
                  <span aria-hidden="true">&gt;</span>
                  <Link to={crumb.to} className="hover:text-navy hover:underline">
                    {crumb.label}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true">&gt;</span>
                <span className="font-semibold text-navy">{crumbTitle}</span>
              </li>
            </ol>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => window.print()} className="subpage-tool">
              <Printer className="h-4 w-4" aria-hidden="true" />
              인쇄
            </button>
            <button type="button" onClick={() => void copyLink()} className="subpage-tool">
              {copied ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Link2 className="h-4 w-4" aria-hidden="true" />
              )}
              {copied ? "복사됨" : "링크 복사"}
            </button>
          </div>
        </div>
        {showLnb ? (
          <div className="container-page pb-3 lg:hidden">
            <label className="block text-[13px] font-semibold text-[#374151]">
              같은 메뉴
              <select
                className="mt-1 h-10 w-full rounded-md border border-[#D1D5DB] bg-white px-3 text-[15px] text-[#111827]"
                value={currentHref}
                onChange={(event) => {
                  window.location.assign(event.target.value);
                }}
              >
                {items.map((item) => (
                  <option key={item.href} value={item.href}>
                    {item.badge ? `${item.label} (${item.badge})` : item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </div>

      {showLnb ? (
        <aside className="subpage-lnb hidden lg:block" aria-label="같은 메뉴">
          <ul className="border border-[#D1D5DB] bg-white">
            {items.map((item) => {
              const current = isNavHrefCurrent(pathname, hash, item.href);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={
                      current
                        ? "flex flex-wrap items-center border-l-[3px] border-navy bg-[#E8EEF6] px-4 py-2.5 text-[15px] font-bold text-navy"
                        : "flex flex-wrap items-center border-l-[3px] border-transparent px-4 py-2.5 text-[15px] text-[#374151] hover:bg-[#F3F4F6] hover:text-navy"
                    }
                  >
                    {item.label}
                    {item.badge ? (
                      <span className="ml-1.5 inline-flex rounded-sm bg-[#E6F4F2] px-1.5 py-0.5 text-[11px] font-bold leading-none text-[#0F766E]">
                        {item.badge}
                      </span>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
