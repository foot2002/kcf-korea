import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, Phone, Printer } from "lucide-react";

import { ContactInquiryForm } from "@/components/contact/ContactInquiryForm";
import { PageHero } from "@/components/site/PageHero";
import { contactPage } from "@/data/kcf";
import heroContact from "@/assets/hero-contact.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | 한국컨설팅산업재단" },
      {
        name: "description",
        content:
          "한국컨설팅산업재단 및 개인정보보호진흥원 연락처, 주소, 온라인 문의 접수입니다.",
      },
      { property: "og:title", content: "Contact Us | 한국컨설팅산업재단" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { foundation, privacyOffice, address } = contactPage;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact Us"
        desc="재단·개인정보보호진흥원 관련 문의를 남겨 주시면 담당자가 확인 후 연락드립니다."
        bgImage={heroContact}
      />

      <section className="section-y">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">연락처</div>
            <h2 className="text-navy">연락처 안내</h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="kcf-icon-card">
              <div className="kcf-ic">
                <Building2 className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-[18px] font-bold text-navy">{foundation.name}</h3>
              <dl className="mt-5 space-y-3 text-[14.5px]">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-trust-blue" />
                  <dt className="sr-only">전화</dt>
                  <dd>
                    <a href={`tel:${foundation.tel}`} className="font-semibold text-navy hover:text-trust-blue">
                      {foundation.tel}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center gap-3">
                  <Printer className="h-4 w-4 shrink-0 text-trust-blue" />
                  <dt className="sr-only">팩스</dt>
                  <dd className="text-text-secondary">팩스 {foundation.fax}</dd>
                </div>
              </dl>
            </div>

            <div className="kcf-icon-card">
              <div className="kcf-ic">
                <Building2 className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-[18px] font-bold text-navy">{privacyOffice.name}</h3>
              <dl className="mt-5 space-y-3 text-[14.5px]">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-trust-blue" />
                  <div>
                    <dt className="text-[12.5px] font-semibold text-text-muted">
                      {privacyOffice.associationLabel}
                    </dt>
                    <dd className="mt-0.5">
                      <a
                        href={`tel:${privacyOffice.associationTel}`}
                        className="font-semibold text-navy hover:text-trust-blue"
                      >
                        {privacyOffice.associationTel}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-trust-blue" />
                  <div>
                    <dt className="text-[12.5px] font-semibold text-text-muted">
                      {privacyOffice.generalLabel}
                    </dt>
                    <dd className="mt-0.5">
                      <a
                        href={`tel:${privacyOffice.generalTel}`}
                        className="font-semibold text-navy hover:text-trust-blue"
                      >
                        {privacyOffice.generalTel}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y border-y border-border bg-blue-gray">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">주소</div>
            <h2 className="text-navy">찾아오시는 길</h2>
            <p className="mt-4 text-[16px] font-semibold text-navy">{address}</p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_4px_14px_rgba(11,31,58,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="text-[14px] text-text-secondary">{address}</div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-soft-sky px-4 py-2 text-[13px] font-semibold text-navy hover:bg-blue-gray"
              >
                <MapPin className="h-3.5 w-3.5" /> 길찾기
              </a>
            </div>
            <iframe
              title="한국컨설팅산업재단 위치"
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&hl=ko&z=18&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[16/8] w-full border-0 grayscale-[15%] contrast-[1.02]"
            />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page max-w-3xl">
          <ContactInquiryForm />
        </div>
      </section>
    </>
  );
}
