import { Link } from "@tanstack/react-router";

import { foundation, privacyOffice, publicInterestCorporation } from "@/data/kcf";

const RELATED_SITES = [
  { label: "개인정보보호위원회", href: "https://www.pipc.go.kr" },
  { label: "개인정보침해신고센터", href: "https://privacy.kisa.or.kr" },
  { label: "개인정보분쟁조정위원회", href: "https://www.kopico.go.kr" },
];

export function Footer() {
  return (
    <footer className="site-footer bg-[#072A52] text-[#F3F4F6]">
      <div className="container-page flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-white/15 py-4 text-[15px]">
        <Link to="/privacy-policy" className="font-bold text-[#99F6E4] hover:underline">
          개인정보처리방침
        </Link>
        <span aria-hidden="true" className="text-[#D1D5DB]">
          |
        </span>
        <span>이메일무단수집거부</span>
        <span aria-hidden="true" className="text-[#D1D5DB]">
          |
        </span>
        <Link to="/sitemap" className="hover:underline">
          사이트맵
        </Link>
      </div>

      <div className="container-page py-5 text-[15px] leading-[1.7]">
        <p>
          공익법인 (재)한국컨설팅산업재단 · 재정경제부 지정 공익법인 제
          {publicInterestCorporation.designationNo}호 · 사업자등록번호 {foundation.bizNo}
        </p>
        <p>
          재단 {foundation.addressOfficial} · 진흥원 {privacyOffice.address} ·{" "}
          <a href={`tel:${privacyOffice.tel}`} className="hover:underline">
            {privacyOffice.tel}
          </a>{" "}
          ·{" "}
          <a href={`mailto:${privacyOffice.email}`} className="hover:underline">
            {privacyOffice.email}
          </a>
        </p>
      </div>

      <div className="container-page flex flex-wrap items-center justify-between gap-3 border-t border-white/15 py-4 text-[14px]">
        <label className="flex items-center gap-2">
          <span className="sr-only">관련 사이트 바로가기</span>
          <select
            aria-label="관련 사이트 바로가기"
            defaultValue=""
            className="h-10 rounded-md border border-[#D1D5DB] bg-white px-3 text-[14px] text-[#111827]"
            onChange={(event) => {
              const url = event.target.value;
              if (!url) return;
              window.open(url, "_blank", "noopener,noreferrer");
              event.target.value = "";
            }}
          >
            <option value="">관련 사이트 바로가기</option>
            {RELATED_SITES.map((site) => (
              <option key={site.href} value={site.href}>
                {site.label}
              </option>
            ))}
          </select>
        </label>
        <p>© {new Date().getFullYear()} {foundation.nameKo}. All rights reserved.</p>
      </div>
    </footer>
  );
}
