import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import heroBusiness from "@/assets/hero-business.jpg";
import cardNbo from "@/assets/card-nbo.jpg";

import consulting1 from "@/assets/card-consulting-1.jpg";
import consulting2 from "@/assets/card-consulting-2.jpg";
import consulting3 from "@/assets/card-consulting-3.jpg";
import consulting4 from "@/assets/card-consulting-4.jpg";
import consulting5 from "@/assets/card-consulting-5.jpg";
import consulting6 from "@/assets/card-consulting-6.jpg";
import youth1 from "@/assets/card-youth-1.jpg";
import youth2 from "@/assets/card-youth-2.jpg";
import youth3 from "@/assets/card-youth-3.jpg";
import youth4 from "@/assets/card-youth-4.jpg";
import youth5 from "@/assets/card-youth-5.jpg";
import youth6 from "@/assets/card-youth-6.jpg";

const consultingImages = [consulting1, consulting2, consulting3, consulting4, consulting5, consulting6];
const youthImages = [youth1, youth2, youth3, youth4, youth5, youth6];
import {
  
  nboOverview,
  nboCategories,
  nboRoles,
  nboHistory,
  consultingPrograms,
  consultingClients,
  youthPrograms,
  youthPartners,
} from "@/data/kcf";
import { Trophy, Briefcase, GraduationCap, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "주요 사업 | NBO·기업컨설팅·청소년경영교육" },
      {
        name: "description",
        content:
          "한국컨설팅산업재단의 주요 사업: 전국상업경진대회(NBO) 사무국, 기업컨설팅교육, 청소년경영교육 상세 안내.",
      },
      { property: "og:title", content: "주요 사업 | 한국컨설팅산업재단" },
      { property: "og:url", content: "/business" },
    ],
    links: [{ rel: "canonical", href: "/business" }],
  }),
  component: BusinessPage,
});

const tabs = [
  { id: "nbo", label: "NBO 사무국", icon: Trophy },
  { id: "consulting", label: "기업컨설팅교육", icon: Briefcase },
  { id: "youth", label: "청소년경영교육", icon: GraduationCap },
];

function BusinessPage() {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const [active, setActive] = useState("nbo");

  useEffect(() => {
    if (hash && tabs.some((t) => t.id === hash)) setActive(hash);
  }, [hash]);

  return (
    <>
      <PageHero
        eyebrow="주요 사업"
        title="기업·공공기관·청소년을 잇는 지식서비스 사업"
        desc="전국상업경진대회(NBO) 사무국 운영, 기업 컨설팅 교육, 청소년 경영교육의 3대 핵심 사업을 운영합니다."
        bgImage={heroBusiness}
      />

      {/* Tabs */}
      <div className="sticky-below-header border-b border-border bg-white/95 backdrop-blur">
        <div className="container-page flex gap-1 overflow-x-auto py-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActive(t.id);
                  document.getElementById(t.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium transition ${
                  isActive
                    ? "bg-navy text-white"
                    : "text-text-secondary hover:bg-blue-gray hover:text-navy"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>



      {/* NBO */}
      <section id="nbo" className="section-y scroll-mt-40">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <div className="relative mb-6 overflow-hidden rounded-3xl">
                <img
                  src={cardNbo}
                  alt="NBO 대회"
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
                <div className="absolute left-5 bottom-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider text-navy">
                  <Trophy className="h-3.5 w-3.5" /> National Business Olympiad
                </div>
              </div>
              <div className="label-eyebrow">NBO 사무국</div>
              <h2 className="text-navy">전국상업경진대회 (NBO) 사무국</h2>
              <p className="mt-5 text-text-secondary leading-relaxed">
                재단은 교육부가 주최하는 전국상업경진대회(NBO: National Business
                Olympiad)의 공식 재정 사무국을 담당합니다. NBO 대회정관 제11조에
                따라, 재단 소속 재정분과 사무부국장이 대회 예산 운영 전반에
                관한 대행 업무를 수행합니다.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries({
                "주최": nboOverview.host,
                "주관": nboOverview.organizer,
                "공동주관": nboOverview.coOrganizer,
                "운영지원": nboOverview.support,
                "대상": nboOverview.target,
                "규모": nboOverview.scale,
              }).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <div className="text-[12.5px] font-semibold text-trust-blue uppercase tracking-wider">{k}</div>
                  <div className="mt-1.5 text-[14.5px] text-text-primary">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 종목 */}
          <div className="mt-14">
            <h3 className="text-navy">대회 종목</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {nboCategories.map((g) => (
                <div key={g.group} className="kcf-card !p-6">
                  <div className="text-[13px] font-semibold uppercase tracking-wider text-trust-blue">
                    {g.group}
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {g.items.map((it) => (
                      <li key={it} className="text-[14.5px] text-text-primary">• {it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 재단의 역할 */}
          <div className="mt-14 kcf-card">
            <h3 className="text-navy">재단의 역할</h3>
            <ul className="mt-5 grid gap-2 md:grid-cols-2">
              {nboRoles.map((r) => (
                <li key={r} className="flex gap-2.5 text-text-secondary">
                  <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-trust-blue" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 연혁 표 */}
          <div className="mt-14">
            <h3 className="text-navy">NBO 대회 연혁</h3>
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#E5E7EB]">
              <table className="w-full text-left text-[14.5px]">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="px-5 py-3 font-semibold">회차</th>
                    <th className="px-5 py-3 font-semibold">연도</th>
                    <th className="px-5 py-3 font-semibold">주관/장소</th>
                    <th className="px-5 py-3 font-semibold">규모</th>
                  </tr>
                </thead>
                <tbody>
                  {nboHistory.map((r, i) => (
                    <tr key={r.round} className={i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                      <td className="px-5 py-3 font-semibold text-navy border-b border-[#E5E7EB]">{r.round}</td>
                      <td className="px-5 py-3 border-b border-[#E5E7EB]">{r.year}</td>
                      <td className="px-5 py-3 border-b border-[#E5E7EB]">{r.region}</td>
                      <td className="px-5 py-3 border-b border-[#E5E7EB]">{r.scale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 기업컨설팅교육 */}
      <section id="consulting" className="section-y bg-[#F5F8FC] border-y border-[#E5E7EB] scroll-mt-40">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">기업 컨설팅 교육</div>
            <h2 className="text-navy">기업컨설팅교육</h2>
            <p className="mt-5 text-text-secondary leading-relaxed">
              컨설팅 아카데미 운영을 통해 기업·공공기관·정부 대상 전문 교육
              프로그램을 제공합니다. 현장 실무 중심의 커리큘럼으로 조직의
              경쟁력 강화와 전문 인재 양성을 동시에 지원합니다.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {consultingPrograms.map((p, i) => (
              <div key={p.title} className="kcf-media-card">
                <div className="kcf-media">
                  <img
                    src={consultingImages[i % consultingImages.length]}
                    alt={p.title}
                    loading="lazy"
                    width={1280}
                    height={896}
                  />
                  <div className="kcf-media-badge">Program 0{i + 1}</div>
                  <div className="kcf-media-icon">
                    <Briefcase className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="kcf-body">
                  <div className="text-[18px] font-bold text-navy">{p.title}</div>
                  <p className="text-[14.5px] text-text-secondary leading-relaxed">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>


          <div className="mt-12 kcf-card">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-trust-blue">
              주요 수행 실적
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {consultingClients.map((c) => (
                <span key={c} className="rounded-full bg-soft-sky px-4 py-2 text-[14px] font-semibold text-navy">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 청소년경영교육 */}
      <section id="youth" className="section-y scroll-mt-40">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">청소년 경영 교육</div>
            <h2 className="text-navy">청소년경영교육</h2>
            <p className="mt-5 text-text-secondary leading-relaxed">
              청소년 경영·경제교육 전문기관으로서 전국 시·도 교육청과의 협력
              체계를 기반으로, 미래 경영 인재의 조기 발굴과 실무 역량 강화를
              지원합니다. 특성화고 및 일반고 학생 대상의 진로·취업·창업 연계
              교육을 통해 학교 현장과 산업 현장을 잇는 교육 생태계를 구축합니다.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {youthPrograms.map((p, i) => (
              <div key={p.title} className="kcf-media-card">
                <div className="kcf-media">
                  <img src={youthImages[i % youthImages.length]} alt={p.title} loading="lazy" width={1280} height={896} />
                  <div className="kcf-media-badge">Youth 0{i + 1}</div>
                  <div className="kcf-media-icon">
                    <GraduationCap className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="kcf-body">
                  <div className="text-[18px] font-bold text-navy">{p.title}</div>
                  <p className="text-[14.5px] text-text-secondary leading-relaxed">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>


          <div className="mt-12 kcf-card">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-trust-blue">
              협력 기관
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {youthPartners.map((p) => (
                <span key={p} className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-[14px] font-semibold text-navy">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
