import { Link } from "@tanstack/react-router";
import { foundation } from "@/data/kcf";
import { KcfLogo } from "@/components/site/KcfLogo";

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
            <div className="flex items-center">
              <KcfLogo variant="footer" className="rounded-lg bg-white px-2 py-1.5" />
            </div>
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-white/75">
              컨설팅을 통해 선도적 지식산업을 창출하고, 산업계의 지식고도화와
              지식시장 창출을 촉진하는 비영리 재단입니다.
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
              <li>사업자등록번호 {foundation.bizNo}</li>
              <li>
                <a href={`tel:${foundation.tel}`} className="transition-colors hover:text-white">
                  전화 {foundation.tel}
                </a>
              </li>
              <li>팩스 {foundation.fax}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[12px] text-white/55">
          <div>© {new Date().getFullYear()} {foundation.nameKo}. All rights reserved.</div>
          <div className="text-white/45">{foundation.addressOfficial}</div>
        </div>
      </div>
    </footer>
  );
}
