import { Link } from "@tanstack/react-router";
import { foundation } from "@/data/kcf";

const footerLinks = [
  { label: "재단 소개", to: "/about" as const },
  { label: "연혁", to: "/history" as const },
  { label: "사업", to: "/business" as const },
  { label: "개인정보보호진흥원", to: "/privacy-center" as const, accent: true },
  { label: "실적·자료", to: "/achievements" as const },
  { label: "찾아오시는 길", to: "/contact" as const },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-navy">
                KCF
              </div>
              <div className="leading-tight">
                <div className="text-[15px] font-bold tracking-tight">{foundation.nameKo}</div>
                <div className="text-[12px] text-white/65">{foundation.nameEn}</div>
              </div>
            </div>
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-white/75">
              컨설팅을 통해 선도적 지식산업을 창출하고, 산업계의 지식고도화와
              지식시장 창출을 촉진하는 비영리 법정기부금단체입니다.
            </p>
          </div>

          <div>
            <div className="mb-4 text-[13px] font-semibold tracking-wide text-white/90">
              주요 메뉴
            </div>
            <ul className="space-y-2.5 text-[14px]">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`transition-colors hover:text-white ${
                      link.accent
                        ? "text-accent-teal hover:text-accent-teal/90"
                        : "text-white/75"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 text-[13px] font-semibold tracking-wide text-white/90">
              연락처
            </div>
            <ul className="space-y-2 text-[14px] text-white/75">
              <li>대표 {foundation.chair} 이사장</li>
              <li>사업자등록번호 {foundation.bizNo}</li>
              <li>
                <a href={`tel:${foundation.tel}`} className="transition-colors hover:text-white">
                  전화 {foundation.tel}
                </a>
              </li>
              <li>팩스 {foundation.fax}</li>
              <li className="pt-2 text-white/60">
                서울특별시 송파구 양재대로 71길 20-30, 2층
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[12px] text-white/55">
          <div>© {new Date().getFullYear()} {foundation.nameKo}. All rights reserved.</div>
          <div>{foundation.status}</div>
        </div>
      </div>
    </footer>
  );
}
