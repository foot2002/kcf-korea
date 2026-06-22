import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  achievementsYouth,
  achievementsGroup,
  achievementsCorporate,
  achievementsUniversity,
  achievementsTeacher,
  partnerLogos,
  certifications,
} from "@/data/kcf";
import { Award, BookOpen } from "lucide-react";
import heroAchievements from "@/assets/hero-achievements.jpg";
import cardTeacher from "@/assets/card-teacher.jpg";
import cardCorporate from "@/assets/card-corporate.jpg";
import cardYouth from "@/assets/card-youth.jpg";
import cardConsulting from "@/assets/card-consulting.jpg";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "실적·자료 | 한국컨설팅산업재단" },
      {
        name: "description",
        content:
          "청소년교육, 단체교육, 기업교육, 지자체·대학교 연계교육, 교사·교장·교육청 공무원 연수사업 등 한국컨설팅산업재단의 주요 실적.",
      },
      { property: "og:title", content: "실적·자료 | 한국컨설팅산업재단" },
      { property: "og:url", content: "/achievements" },
    ],
    links: [{ rel: "canonical", href: "/achievements" }],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  return (
    <>
      <PageHero
        eyebrow="실적·자료"
        title="26만명 이상이 경험한 KCF의 교육·컨설팅 실적"
        desc="2006년부터 현재까지 청소년, 단체, 기업, 지자체, 대학교, 교사·교육공무원을 대상으로 축적해 온 실적입니다."
        bgImage={heroAchievements}
      />

      {/* Top stats */}
      <section className="border-b border-border bg-blue-gray">
        <div className="container-page py-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: "260,000+", l: "누적 교육수료" },
            { v: "20,000+", l: "연간 진로·취업·창업 연수" },
            { v: "17", l: "협력 시·도 교육청" },
            { v: "200+", l: "교보재 보유" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
              <div className="text-[30px] font-bold text-navy leading-none">{s.v}</div>
              <div className="mt-2 text-[14px] text-text-secondary">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion 실적 */}
      <section className="section-y">
        <div className="container-page max-w-5xl">
          <Accordion type="multiple" defaultValue={["youth"]} className="space-y-3">
            <AccordionCardItem id="youth" title="청소년교육, 정부정책사업" items={achievementsYouth} />
            <AccordionCardItem id="group" title="단체교육, 정부정책사업" items={achievementsGroup} />
            <AccordionCardItem id="corporate" title="기업교육" items={achievementsCorporate} />
            <AccordionCardItem id="university" title="지자체 및 대학교 연계 교육" items={achievementsUniversity} />
            <AccordionItem
              id="career"
              value="career"
              className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-[18px] font-bold text-navy hover:no-underline">
                청소년 진로·취업·창업 교육사업
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-text-secondary leading-relaxed">
                <p>
                  한국컨설팅산업재단과 한국경영컨설팅협회는 중소기업부 청소년
                  비즈쿨 예산과 교과부 취업기능/특성화 학교 전문화 교육 노하우를
                  바탕으로 청소년 진로·취업기능 강화 체험학습 프로그램을 운영해
                  왔습니다.
                </p>
                <ul className="mt-4 space-y-2">
                  <li>• 서울특별시교육청, 충남교육청과 청소년 진로·취업 교육프로그램 상호협약 체결</li>
                  <li>• 교육기부 사업 추진</li>
                  <li>• 전국정보실무능력 경진대회 사무국 운영</li>
                  <li>• 17개 시·도교육청 참여</li>
                  <li>• 서울 및 경기도교육청 청소년 진로·직업체험 지원 사업</li>
                  <li>• 체험학습 전담기관 지정을 통한 위탁형 교육사업 운영</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* 인증·지정 자료 */}
      <section className="section-y bg-[#F8FAFC] border-y border-[#E5E7EB]">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">인증·자격</div>
            <h2 className="text-navy">인증·지정 자료</h2>
            <p className="mt-4 text-text-secondary">
              교육청 및 정부 부처로부터 받은 지정·인증 내역입니다.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {certifications.map((c) => (
              <div key={c} className="kcf-media-card">
                <div className="kcf-media" style={{ aspectRatio: "16 / 9" }}>
                  <img src={cardTeacher} alt="" loading="lazy" width={1280} height={896} />
                  <div className="kcf-media-badge" style={{ background: "rgba(182,138,53,0.96)", color: "#fff" }}>
                    <Award className="h-3.5 w-3.5" strokeWidth={2} /> 인증
                  </div>
                </div>
                <div className="kcf-body">
                  <div className="text-[16px] font-bold text-navy leading-snug">{c}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 교육 성과 */}
      <section id="results" className="section-y scroll-mt-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="label-eyebrow">교육 성과</div>
            <h2 className="text-navy">교육 성과</h2>
          </div>
          <div className="space-y-4">
            <div className="kcf-card">
              <BookOpen className="h-7 w-7 text-trust-blue" strokeWidth={1.75} />
              <p className="mt-4 text-text-secondary leading-relaxed">
                2006년부터 현재까지 26만명 이상의 초·중·고등학생, 교사,
                교장, 교육공무원 교육을 수행하였으며, 국내 최대 수준의 전국단위
                진로·취업교육 관련 교원연수 및 학생 참여 실적을 보유하고 있습니다.
              </p>
            </div>
            <div className="kcf-card">
              <div className="text-[16px] font-bold text-navy">Action-Learning 진로비전·취업학습 교육과정</div>
              <ul className="mt-3 space-y-1.5 text-text-secondary">
                <li>• 교육감 인정도서 3종</li>
                <li>• 청소년 진로·취업 및 경영실무능력 배양 교보재 200여편 개발 보유</li>
                <li>• 학생용 비즈쿨 일반 25편</li>
                <li>• 학생용 비즈쿨 경영 25편</li>
                <li>• 기업가정신·비즈니스 교육 영상물, 비즈쿨 활동 동영상 등 총 200여편</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 교사 연수사업 */}
      <section id="teacher" className="section-y bg-[#F5F8FC] border-y border-[#E5E7EB] scroll-mt-24">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">교사·공무원 연수</div>
            <h2 className="text-navy">교사 · 교장 · 교육청 공무원 연수사업</h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {achievementsTeacher.map((t, i) => (
              <div
                key={t}
                className="kcf-card kcf-card-hover !p-6 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, #ffffff 0%, #ffffff 65%, #EAF3FF 100%)",
                }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-white text-[13px] font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-4 text-[15px] font-semibold text-navy leading-snug">{t}</div>
                <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-trust-blue/5" />
              </div>
            ))}
          </div>


          {/* 이미지 갤러리 */}
          <div className="mt-14">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-trust-blue">
              연수 · 교육 현장 갤러리
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[cardTeacher, cardCorporate, cardYouth, cardConsulting, cardCorporate, cardTeacher, cardConsulting, cardYouth].map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-navy group"
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-navy/0 to-navy/0" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 협력·수행 실적 로고 */}
      <section className="section-y">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">협력 기관</div>
            <h2 className="text-navy">협력·수행 실적</h2>
            <p className="mt-4 text-text-secondary">
              KT&G Business Master Course, 삼성전자 임직원 경영교육,
              소상공인진흥원·SBA 등 공공기관 교육, 연세대·서강대·한양대·부경대
              컨설턴트 양성과정 등을 수행하였습니다.
            </p>
          </div>
          <div className="mt-10 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            {partnerLogos.map((p) => (
              <div
                key={p}
                className="flex h-20 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-[15px] font-semibold text-navy"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function AccordionCardItem({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: string[];
}) {
  return (
    <AccordionItem
      id={id}
      value={id}
      className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden scroll-mt-32"
    >
      <AccordionTrigger className="px-6 py-5 text-left text-[18px] font-bold text-navy hover:no-underline">
        {title}
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <ul className="space-y-2 text-text-secondary">
          {items.map((it) => (
            <li key={it} className="flex gap-2.5">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-trust-blue" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
