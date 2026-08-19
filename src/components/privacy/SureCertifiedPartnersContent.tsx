import { Award, BadgeCheck, Building2, Handshake } from "lucide-react";

import { SurePartnerApplyForm } from "@/components/privacy/SurePartnerApplyForm";
import { PcSection, PcSectionHeader } from "@/components/privacy/privacy-ui";
import {
  SURE_CERTIFIED_PARTNERS,
  type SureCertifiedPartner,
} from "@/data/sure-certified-partners";

export function SureCertifiedPartnersContent() {
  return (
    <>
      <PcSection variant="white">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <PcSectionHeader
            eyebrow="Certified Partners"
            title="개인정보 전문 기업과 함께하는 안심 파트너"
            description="안심인증 기업은 개인정보 법률·보안·조사·협업 등 각 분야에서 검증된 전문성을 갖춘 파트너입니다. SURE 생태계와 함께 국민과 기업의 개인정보 신뢰를 높입니다."
          />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { icon: BadgeCheck, label: "전문 분야 심사", desc: "개인정보 역량 검증" },
              { icon: Building2, label: "분야별 파트너", desc: "법률·보안·솔루션" },
              { icon: Handshake, label: "안심 네트워크", desc: "신뢰 기반 협력" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[var(--pc-border)] bg-[var(--pc-soft-blue)]/60 px-4 py-4"
                >
                  <Icon className="h-5 w-5 text-trust-blue" strokeWidth={1.75} />
                  <div className="mt-2 text-[14px] font-bold text-navy">{item.label}</div>
                  <div className="mt-0.5 text-[12.5px] text-text-secondary">{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </PcSection>

      <PcSection variant="soft">
        <PcSectionHeader
          eyebrow="Partner Directory"
          title="안심인증 파트너"
          description="로고·서비스명·개인정보 전문 분야를 기준으로 현재 협력 중인 안심인증 기업을 소개합니다."
          center
          className="mx-auto"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {SURE_CERTIFIED_PARTNERS.map((partner, index) => (
            <PartnerCard key={partner.id} partner={partner} index={index} />
          ))}
        </div>
      </PcSection>

      <PcSection id="apply" variant="white">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="pc-eyebrow justify-center">Apply</div>
            <h2 className="pc-section-title text-navy">안심 파트너로 함께해 주세요</h2>
            <p className="pc-body mx-auto mt-4 max-w-2xl">
              개인정보 관련 전문 서비스나 솔루션을 보유한 기업은 아래 양식으로 심사 신청을
              남겨 주세요.
            </p>
          </div>
          <SurePartnerApplyForm />
        </div>
      </PcSection>
    </>
  );
}

function PartnerCard({
  partner,
  index,
}: {
  partner: SureCertifiedPartner;
  index: number;
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[var(--pc-border)] bg-white p-5 shadow-[0_6px_22px_rgba(7,21,41,0.05)] transition duration-300 hover:-translate-y-1 hover:border-trust-blue/25 hover:shadow-[0_16px_36px_rgba(7,21,41,0.1)] md:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-90"
        style={{ background: partner.accent }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl text-[18px] font-black tracking-wide text-white shadow-inner"
          style={{ background: `linear-gradient(145deg, ${partner.accent}, #0b2540)` }}
          aria-hidden
        >
          {partner.mark}
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pc-soft-blue)] px-2.5 py-1 text-[11px] font-bold text-trust-blue ring-1 ring-[var(--pc-border)]">
            <Award className="h-3 w-3" />
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="mt-2 text-[11.5px] font-semibold tracking-wide text-text-muted">
            {partner.category}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-[17px] font-bold leading-snug text-navy">{partner.name}</h3>
        {partner.nameEn ? (
          <div className="mt-1 text-[12.5px] font-medium text-text-muted">{partner.nameEn}</div>
        ) : null}
      </div>

      <div className="mt-4 rounded-xl bg-[var(--pc-soft-blue)]/70 px-3.5 py-3 ring-1 ring-[var(--pc-border)]">
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-trust-blue/80">
          Service
        </div>
        <div className="mt-1 text-[14.5px] font-bold text-navy">{partner.serviceName}</div>
        <div className="mt-1 text-[12.5px] font-semibold text-[var(--pc-teal)]">
          {partner.specialty}
        </div>
      </div>

      <p className="mt-4 flex-1 text-[13.5px] leading-[1.75] text-text-secondary">
        {partner.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {partner.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#F4F7FB] px-2.5 py-1 text-[11px] font-semibold text-text-secondary ring-1 ring-[#E8EDF3]"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
