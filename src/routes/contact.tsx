import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { ContactInquiryForm } from "@/components/contact/ContactInquiryForm";
import { SubpageFrame } from "@/components/site/SubpageFrame";
import {
  CONTACT_MAIL,
  CONTACT_ROWS,
  CONTACT_TABLE_HEADERS,
  contactPage,
} from "@/data/kcf";
import { isStaticGitHubPages } from "@/lib/privacy-inquiry/env";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "문의하기 | 한국컨설팅산업재단" },
      {
        name: "description",
        content:
          "한국컨설팅산업재단 및 개인정보보호진흥원 연락처, 주소, 온라인 문의 접수입니다.",
      },
      { property: "og:title", content: "문의하기 | 한국컨설팅산업재단" },
      { property: "og:url", content: absoluteUrl("/contact") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/contact") }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const address = contactPage.addressLine;
  const mapQuery = encodeURIComponent(contactPage.address);

  return (
    <>
      <SubpageFrame
        area="foundation"
        eyebrow="Contact"
        title="문의하기"
        description="재단·개인정보보호진흥원 관련 문의를 남겨 주시면 담당자가 확인 후 연락드립니다."
      />

      <section className="section-y">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">연락처</div>
            <h2 className="text-navy">연락처 안내</h2>
          </div>

          <table className="mt-8 hidden w-full border-collapse text-left text-[15px] md:table">
            <thead className="bg-navy text-white">
              <tr>
                {CONTACT_TABLE_HEADERS.map((header) => (
                  <th key={header} scope="col" className="px-4 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTACT_ROWS.map((row) => (
                <tr key={row.name} className="border-b border-[#D1D5DB]">
                  <th scope="row" className="px-4 py-4 font-bold text-navy">{row.name}</th>
                  <td className="px-4 py-4 text-[#374151]">{row.address}</td>
                  <td className="px-4 py-4 text-[#111827]">
                    <a href={`tel:${row.tel}`} className="font-semibold text-navy underline">
                      {row.tel}
                    </a>
                    {row.fax ? <span className="mt-1 block text-[14px] text-[#374151]">팩스 {row.fax}</span> : null}
                  </td>
                  <td className="px-4 py-4">
                    {row.email ? (
                      <a href={`mailto:${row.email}`} className="font-semibold text-navy underline">
                        {row.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="mt-8 space-y-3 md:hidden">
            {CONTACT_ROWS.map((row) => (
              <li key={row.name} className="rounded-md border border-[#D1D5DB] bg-white p-4">
                <h3 className="text-[16px] font-bold text-navy">{row.name}</h3>
                <dl className="mt-3 space-y-2 text-[15px]">
                  <div>
                    <dt className="text-[13px] font-semibold text-[#4B5563]">주소</dt>
                    <dd className="text-[#111827]">{row.address}</dd>
                  </div>
                  <div>
                    <dt className="text-[13px] font-semibold text-[#4B5563]">전화</dt>
                    <dd>
                      <a href={`tel:${row.tel}`} className="font-semibold text-navy underline">{row.tel}</a>
                      {row.fax ? <span className="mt-1 block text-[#374151]">팩스 {row.fax}</span> : null}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[13px] font-semibold text-[#4B5563]">전자우편</dt>
                    <dd>
                      {row.email ? (
                        <a href={`mailto:${row.email}`} className="font-semibold text-navy underline">{row.email}</a>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y border-y border-[#D1D5DB] bg-[#F3F4F6]">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="label-eyebrow">주소</div>
            <h2 className="text-navy">찾아오시는 길</h2>
            <p className="mt-4 text-[16px] font-semibold text-navy">{address}</p>
          </div>
          <div className="mt-8 overflow-hidden rounded-md border border-[#D1D5DB] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D1D5DB] px-5 py-4">
              <p className="text-[14px] text-[#374151]">{address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-[#D1D5DB] bg-white px-4 py-2 text-[13px] font-semibold text-navy"
              >
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> 길찾기
              </a>
            </div>
            <iframe
              title="한국컨설팅산업재단 위치"
              src={`https://www.google.com/maps?q=${mapQuery}&hl=ko&z=18&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[16/8] w-full border-0"
            />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page max-w-3xl">
          {isStaticGitHubPages ? (
            <div className="rounded-md border border-[#D1D5DB] bg-white p-6">
              <a href={CONTACT_MAIL.href} className="btn-primary-kcf">
                {CONTACT_MAIL.button}
              </a>
              <p className="mt-4 text-[15px] leading-relaxed text-[#374151]">{CONTACT_MAIL.hint}</p>
            </div>
          ) : (
            <ContactInquiryForm />
          )}
          <p className="mt-8">
            <Link to="/privacy-policy" className="font-semibold text-navy underline">
              {CONTACT_MAIL.policy}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
