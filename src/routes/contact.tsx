import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { foundation, privacyOffice } from "@/data/kcf";
import { Phone, Printer, MapPin, Train, Bus, Car, Building2, Mail } from "lucide-react";
import heroContact from "@/assets/hero-contact.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "오시는 길 | 한국컨설팅산업재단" },
      {
        name: "description",
        content:
          "한국컨설팅산업재단 및 개인정보보호진흥원의 위치, 연락처, 교통편 안내입니다.",
      },
      { property: "og:title", content: "오시는 길 | 한국컨설팅산업재단" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const addresses = [
  {
    label: "재단 공식 주소",
    address: foundation.addressOfficial,
    sub: "방이동",
  },
  {
    label: "개인정보보호진흥원 (연락)",
    address: privacyOffice.address,
    sub: `전화 ${privacyOffice.tel} · 팩스 ${privacyOffice.fax}`,
  },
  {
    label: "개인정보보호진흥원 (등록)",
    address: privacyOffice.addressRegistered,
    sub: privacyOffice.email,
  },
];

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="연락처"
        title="찾아오시는 길"
        desc="컨설팅, 교육, 개인정보보호 진흥 사업과 관련된 모든 문의를 환영합니다."
        bgImage={heroContact}
      />

      {/* 기관정보 */}
      <section id="info" className="section-y scroll-mt-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="label-eyebrow">기관정보</div>
            <h2 className="text-navy">기관정보</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { k: "기관명", v: foundation.nameKo },
              { k: "사업자등록번호", v: foundation.bizNo },
              { k: "설립일", v: foundation.founded },
              { k: "재단 전화", v: foundation.tel, icon: Phone },
              { k: "재단 팩스", v: foundation.fax, icon: Printer },
              { k: "진흥원 이메일", v: privacyOffice.email, icon: Mail },
            ].map((c) => {
              const Icon = (c as { icon?: typeof Phone }).icon;
              return (
                <div key={c.k} className="kcf-stat-card">
                  <div className="kcf-stat-label">
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {c.k}
                  </div>
                  <div className="kcf-stat-value break-all">{c.v}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 주소 */}
      <section className="section-y border-y border-border bg-blue-gray">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">주소</div>
            <h2 className="text-navy">주소</h2>
            <p className="mt-4 text-text-secondary">
              재단 공식 주소와 개인정보보호진흥원 연락·등록 주소를 안내합니다.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {addresses.map((a, i) => (
              <div key={a.label} className="kcf-icon-card">
                <div className="kcf-ic">
                  <Building2 className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <div className="mt-5 text-[11.5px] font-bold uppercase tracking-[0.12em] text-trust-blue">
                  Location · 0{i + 1}
                </div>
                <div className="mt-1.5 text-[14px] font-semibold text-navy">
                  {a.label}
                </div>
                <div className="mt-3 text-[16px] font-bold text-navy leading-snug">
                  {a.address}
                </div>
                <div className="mt-2 text-[13px] text-text-muted">{a.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 오시는 방법 + 지도 */}
      <section id="directions" className="section-y scroll-mt-24">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">오시는 방법</div>
            <h2 className="text-navy">오시는 방법</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: Train, title: "지하철", desc: "5호선·9호선 방이역 하차 후 도보 약 5분" },
              { icon: Bus, title: "버스", desc: "방이동 사거리 인근 정류장 하차" },
              { icon: Car, title: "주차", desc: "건물 내 주차 가능 · 방문 전 사전 연락 권장" },
            ].map((d) => (
              <div key={d.title} className="kcf-icon-card">
                <div className="kcf-ic">
                  <d.icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <div className="mt-5 text-[18px] font-bold text-navy">{d.title}</div>
                <p className="mt-2 text-text-secondary">{d.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-6">
            {addresses.map((a, i) => (
              <div
                key={a.label}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_4px_14px_rgba(11,31,58,0.04)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                  <div>
                    <div className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-trust-blue">
                      Map · 0{i + 1}
                    </div>
                    <div className="mt-1 text-[15px] font-bold text-navy">{a.label}</div>
                    <div className="mt-0.5 text-[13.5px] text-text-secondary">{a.address}</div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-soft-sky px-4 py-2 text-[13px] font-semibold text-navy hover:bg-blue-gray"
                  >
                    <MapPin className="h-3.5 w-3.5" /> 길찾기
                  </a>
                </div>
                <div className="relative">
                  <iframe
                    title={`${a.label} 지도`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(a.address)}&hl=ko&z=18&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="block aspect-[16/8] w-full border-0 grayscale-[15%] contrast-[1.02]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-y bg-navy text-white">
        <div className="container-page text-center max-w-3xl mx-auto">
          <h2 className="text-white">문의 및 협력 제안</h2>
          <p className="mt-4 text-white/80">
            교육, 컨설팅, 개인정보보호, NBO 사업과 관련된 모든 문의를 환영합니다.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={`tel:${foundation.tel}`} className="btn-hero-light">
              <Phone className="inline h-4 w-4 mr-2 -mt-0.5" />
              재단 {foundation.tel}
            </a>
            <a href={`tel:${privacyOffice.tel}`} className="btn-hero-outline">
              진흥원 {privacyOffice.tel}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
