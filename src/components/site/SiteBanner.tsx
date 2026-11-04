import { useRouterState } from "@tanstack/react-router";
import { useState } from "react";

import { useBanner } from "@/lib/content/load";

const CLOSED_KEY = "kcf-site-banner-closed";

function today() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function readClosed() {
  try {
    return sessionStorage.getItem(CLOSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function SiteBanner() {
  const banner = useBanner();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [closed, setClosed] = useState(readClosed);
  const stamp = today();
  const inRange = (!banner.start || banner.start <= stamp) && (!banner.end || banner.end >= stamp);
  if (path.startsWith("/admin") || closed || !banner.published || !banner.text.trim() || !inRange) return null;

  const tone =
    banner.tone === "중요"
      ? "border-[#7F1D1D] bg-[#7F1D1D] text-white"
      : "border-[#0B3A6E] bg-[#E8EEF6] text-[#0B3A6E]";
  const body = banner.link ? (
    <a href={banner.link} className="underline">
      {banner.text}
    </a>
  ) : (
    <span>{banner.text}</span>
  );

  return (
    <div className={`border-b ${tone}`}>
      <div className="container-page flex items-center justify-between gap-4 py-2 text-[14px] font-semibold">
        <p className="min-w-0">{body}</p>
        <button
          type="button"
          className="shrink-0 rounded-md border border-current px-2 py-1 text-[13px] font-bold"
          onClick={() => {
            try {
              sessionStorage.setItem(CLOSED_KEY, "1");
            } catch {
              /* 세션을 쓸 수 없으면 이번 화면에서만 숨긴다. */
            }
            setClosed(true);
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
