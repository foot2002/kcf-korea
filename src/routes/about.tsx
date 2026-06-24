import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { coreValues, generalInfo, foundation } from "@/data/kcf";
import { Building2, Target, Eye } from "lucide-react";
import heroAbout from "@/assets/hero-about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "재단 소개 | 한국컨설팅산업재단" },
      {
        name: "description",
        content:
          "재단법인 한국컨설팅산업재단의 개요, 법적 설립근거, 설립목적, 비전·미션·핵심가치, 일반현황 정보입니다.",
      },
      { property: "og:title", content: "재단 소개 | 한국컨설팅산업재단" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="재단 소개"
        title="컨설팅을 통해 지식산업의 성장을 이끕니다"
        desc="2010년 설립 이후 한국컨설팅산업재단은 컨설팅 산업 육성, 기업 경쟁력 강화, 미래 인재 양성을 통해 국가 지식경제 발전에 기여하고 있습니다."
        bgImage={heroAbout}
      />

      {/* 재단 개요 */}
      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="label-eyebrow">개요</div>
            <h2 className="text-navy">재단 개요</h2>
          </div>
          <div className="space-y-6">
            <p className="text-text-secondary leading-relaxed">
              재단법인 한국컨설팅산업재단은 2010년 4월 1일 설립된
              비영리 재단입니다.
              민법 제32조 및 관련 비영리법인 설립·감독 규칙에 근거하여
              설립되었으며, 컨설팅을 통해 선도적 지식산업을 창출하고
              산업계의 지식고도화 및 지식시장 창출을 촉진하는 것을 목적으로 합니다.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <KeyFact label="법적 근거" value="민법 제32조" sub="비영리법인 설립 및 감독 규칙 제4조" />
              <KeyFact label="설립일" value={foundation.founded} />
              <KeyFact label="기관 성격" value="비영리 재단" />
              <KeyFact label="문의 전화" value={foundation.tel} />
            </div>
          </div>
        </div>
      </section>

      {/* 설립목적 */}
      <section id="purpose" className="section-y scroll-mt-24 border-y border-border bg-section-bg">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="label-eyebrow">설립목적</div>
            <h2 className="text-navy">설립목적</h2>
          </div>
          <div className="space-y-6">
            <div className="kcf-card">
              <Target className="h-7 w-7 text-trust-blue" strokeWidth={1.75} />
              <p className="mt-4 text-text-secondary leading-relaxed">
                컨설팅을 통하여 선도적 지식산업을 창출하고,
                산업계의 지식고도화 및 지식시장 창출을 촉진합니다.
                기업·공공기관·청소년을 아우르는 전방위적 교육 및 컨설팅
                서비스를 통해 대한민국 지식서비스산업의 근간을 강화합니다.
              </p>
            </div>
            <div className="kcf-card">
              <Building2 className="h-7 w-7 text-trust-blue" strokeWidth={1.75} />
              <p className="mt-4 text-text-secondary leading-relaxed">
                한국컨설팅산업재단은 한국컨설팅산업협회에서 출연하여
                청소년 창업경영교육과 기업의 재직자, 재취업자 교육 등의
                교육기부 및 사업을 위해 설립되었습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 비전·미션·핵심가치 */}
      <section id="vision" className="section-y scroll-mt-24">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">비전 · 미션</div>
            <h2 className="text-navy">비전 · 미션 · 핵심가치</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="kcf-card !bg-navy !border-navy text-white">
              <Eye className="h-7 w-7 text-accent-teal" strokeWidth={1.75} />
              <div className="mt-4 text-[13px] uppercase tracking-wider text-white/70 font-semibold">Vision</div>
              <div className="mt-2 text-[24px] font-bold leading-snug">
                대한민국 지식서비스산업을<br />선도하는 공익재단
              </div>
            </div>
            <div className="kcf-card">
              <Target className="h-7 w-7 text-trust-blue" strokeWidth={1.75} />
              <div className="mt-4 text-[13px] uppercase tracking-wider text-trust-blue font-semibold">Mission</div>
              <div className="mt-2 text-[22px] font-bold leading-snug text-navy">
                컨설팅 산업 육성, 기업 경쟁력 강화,
                미래 인재 양성을 통한 국가 지식경제 발전 기여
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((v, i) => (
              <div key={v.title} className="kcf-card kcf-card-hover">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft-sky text-trust-blue font-bold">
                  0{i + 1}
                </div>
                <div className="mt-4 text-[12px] font-semibold uppercase tracking-wider text-trust-blue">{v.en}</div>
                <div className="text-[20px] font-bold text-navy">{v.title}</div>
                <p className="mt-2 text-[14.5px] text-text-secondary leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 일반현황 */}
      <section id="status" className="section-y scroll-mt-24">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">일반현황</div>
            <h2 className="text-navy">일반현황</h2>
          </div>
          <div className="mt-10 overflow-hidden rounded-2xl border border-[#E5E7EB]">
            <table className="w-full text-left">
              <tbody>
                {generalInfo.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                    <th className="w-1/3 md:w-1/4 align-top px-5 py-4 text-[14px] font-semibold text-navy border-b border-[#E5E7EB]">
                      {row.label}
                    </th>
                    <td className="px-5 py-4 text-[15px] text-text-primary border-b border-[#E5E7EB]">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

function KeyFact({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="kcf-stat-card">
      <div className="kcf-stat-label">{label}</div>
      <div className="kcf-stat-value">{value}</div>
      {sub && <div className="mt-1 text-[13px] text-text-muted">{sub}</div>}
    </div>
  );
}
