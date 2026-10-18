import { Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";

import { SureCertifiedPartnersContent } from "@/components/privacy/SureCertifiedPartnersContent";
import { OrgNotice } from "@/components/privacy/survey-visuals";
import { PcSection, PcSectionHeader } from "@/components/privacy/privacy-ui";
import { CERT_SYSTEMS, SECURITY_SERVICES, SERVICE_SELECTION_CRITERIA, SURE_MARK_SECTIONS } from "@/data/privacy-program";
import { verifyMark } from "@/lib/center-ops/api";

export function SecurityServicesView() {
  return (
    <>
      <PcSection variant="white">
        <PcSectionHeader
          title="국가인증과 민간 우수 보안서비스를 발굴·홍보합니다"
          description="국가 인증 제도와 민간 분야의 우수 서비스를 함께 소개합니다. 이 안내는 특정 기업의 상업적 보증이 아닙니다."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {CERT_SYSTEMS.map((item) => (
            <article key={item.name} className="rounded-2xl border border-border p-5">
              <h3 className="text-[18px] font-bold text-navy">{item.name}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{item.desc}</p>
            </article>
          ))}
        </div>
        <Link to="/privacy-center/sure-mark" className="btn-secondary-kcf mt-6">SURE Mark 운영기준</Link>
      </PcSection>
      <PcSection variant="soft">
        <PcSectionHeader title="서비스 선정기준" />
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {SERVICE_SELECTION_CRITERIA.map((item) => (
            <li key={item.title} className="rounded-2xl border border-border bg-white p-5">
              <h3 className="font-bold text-navy">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{item.desc}</p>
            </li>
          ))}
        </ul>
      </PcSection>
      <PcSection variant="white">
        <PcSectionHeader
          title="연계 안내 서비스"
          description="인증번호가 확인되지 않은 항목은 번호를 적지 않습니다. 아래 우수성은 각 서비스가 개인정보 업무에서 맡는 역할입니다."
        />
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-border text-[12px] uppercase tracking-wide text-text-muted">
                <th className="py-3 pr-4">서비스</th>
                <th className="py-3 pr-4">제공업체</th>
                <th className="py-3 pr-4">주요 기능</th>
                <th className="py-3 pr-4">우수성</th>
                <th className="py-3">적용대상</th>
              </tr>
            </thead>
            <tbody>
              {SECURITY_SERVICES.map((service) => (
                <tr key={service.id} className="border-b border-border align-top">
                  <td className="py-4 pr-4 font-semibold text-navy">{service.serviceName}</td>
                  <td className="py-4 pr-4">{service.provider}</td>
                  <td className="py-4 pr-4 text-text-secondary">{service.functions}</td>
                  <td className="py-4 pr-4 text-text-secondary">{service.merit}</td>
                  <td className="py-4 text-text-secondary">{service.audience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[13px] text-text-secondary">도입요건은 수요기관의 업무와 적용 법령에 따라 달라집니다. 홈페이지 주소가 확인되지 않은 서비스는 링크하지 않습니다.</p>
      </PcSection>
      <div id="partners">
        <SureCertifiedPartnersContent />
      </div>
      <PcSection variant="soft">
        <OrgNotice />
      </PcSection>
    </>
  );
}

export function SureMarkExtra() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  async function onVerify(event: FormEvent) {
    event.preventDefault();
    const found = await verifyMark(code);
    if (!found) {
      setMessage("일치하는 부여 코드가 없습니다. 등록된 코드만 확인할 수 있습니다.");
      return;
    }
    setMessage(`${found.organization} · ${found.status} · 부여 ${found.grantedAt} · 만료 ${found.expiresAt}`);
  }

  return (
    <PcSection variant="white">
      <PcSectionHeader title="SURE Mark 운영" description="민간 자체 표시입니다. 법정 인증이나 CSAP, 국가정보원 목록을 대신하지 않습니다." />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {SURE_MARK_SECTIONS.map((section) => (
          <article key={section.title} className="rounded-2xl border border-border p-5">
            <h3 className="font-bold text-navy">{section.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{section.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-border p-5">
          <h3 className="font-bold text-navy">부여현황</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
            부여된 코드가 관리자에 등록되기 전에는 목록을 만들지 않습니다. 협력 기업 소개가 곧 마크 부여는 아닙니다.
          </p>
        </article>
        <form onSubmit={onVerify} className="rounded-2xl border border-border p-5">
          <h3 className="font-bold text-navy">진위확인</h3>
          <label className="mt-3 block text-[14px] font-semibold text-navy">부여 코드
            <input value={code} onChange={(event) => setCode(event.target.value)} className="mt-1.5 h-12 w-full rounded-xl border border-border px-4" />
          </label>
          <button type="submit" className="btn-secondary-kcf mt-4">확인</button>
          {message ? <p role="status" className="mt-3 text-[14px] text-text-secondary">{message}</p> : null}
        </form>
      </div>
    </PcSection>
  );
}
