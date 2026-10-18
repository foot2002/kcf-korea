import { Link } from "@tanstack/react-router";

import { OrgNotice } from "@/components/privacy/survey-visuals";
import { PRIVACY_VISUALS } from "@/components/privacy/privacy-visuals";
import { usePublicContent } from "@/components/privacy/use-public-content";
import { PcSection } from "@/components/privacy/privacy-ui";
import { AUDIT_NOTE } from "@/data/privacy-program";

export function PolicyBoard() {
  const content = usePublicContent();
  return (
    <PcSection variant="white">
      <p className="max-w-3xl text-[15px] leading-relaxed text-text-secondary">
        2026년 공공기관 온라인 개인정보 수집 실태조사를 바탕으로 한 제안입니다. 공식 접수일과 회신이 기록되기 전에는 제안 또는 질의 예정으로 표시합니다.
      </p>
      <ul className="mt-8 grid gap-4">
        {content.policies.map((item) => (
          <li key={item.slug}>
            <Link to="/privacy-center/policy/$slug" params={{ slug: item.slug }} className="grid overflow-hidden rounded-[24px] border border-border bg-white hover:border-trust-blue md:grid-cols-[180px_1fr]">
              <img src={PRIVACY_VISUALS.policy.src} alt="" className="h-36 w-full bg-[var(--pc-soft-blue)] object-contain p-3 md:h-full" />
              <span className="block p-5">
              <div className="text-[12px] font-bold text-trust-blue">{item.status}</div>
              <h2 className="mt-2 text-[22px] font-bold text-navy">{item.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{item.summary}</p>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <article className="mt-8 rounded-2xl border border-border bg-[var(--pc-soft-blue)] p-5">
        <h2 className="text-[18px] font-bold text-navy">{AUDIT_NOTE.title}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{AUDIT_NOTE.body}</p>
      </article>
      <div className="mt-6"><OrgNotice /></div>
    </PcSection>
  );
}

export function PolicyDetail({ slug }: { slug: string }) {
  const content = usePublicContent();
  const item = content.policies.find((policy) => policy.slug === slug);
  if (!item) {
    return <PcSection variant="white"><p className="text-text-secondary">제안을 찾을 수 없습니다.</p></PcSection>;
  }
  const rows = [
    ["제안 대상", item.targets],
    ["제안일", item.proposedOn || "공식 제안일 미기록"],
    ["관련 법령", item.laws],
    ["진행상태", item.status],
    ["후속조치", item.followUp],
    ["최종 업데이트", item.updatedAt],
  ];
  return (
    <PcSection variant="white">
      <p className="text-[13px] font-bold text-trust-blue">{item.status}</p>
      <h2 className="mt-2 text-navy">{item.title}</h2>
      <h3 className="mt-8 text-[18px] font-bold text-navy">배경</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{item.background}</p>
      <h3 className="mt-6 text-[18px] font-bold text-navy">주요 내용</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{item.summary}</p>
      <dl className="mt-8 grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 rounded-xl border border-border px-4 py-3 sm:grid-cols-[140px_1fr]">
            <dt className="text-[13px] font-bold text-navy">{label}</dt>
            <dd className="text-[14px] leading-relaxed text-text-secondary">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-[14px]">
        관련 연구보고서: <Link to="/privacy-center/publications/$slug" params={{ slug: item.reportSlug }} className="font-semibold text-trust-blue">2026년 실태조사 요약</Link>
      </p>
      <h3 className="mt-8 text-[18px] font-bold text-navy">관련 언론·정책자료</h3>
      <ul className="mt-3 space-y-2">
        {item.press.map((press) => (
          <li key={press.url}>
            <a href={press.url} target="_blank" rel="noopener noreferrer" className="text-[14px] font-semibold text-trust-blue">
              {press.source} · {press.date} · {press.title}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[13px] text-text-muted">첨부파일은 등록된 경우에만 자료실에서 내려받을 수 있습니다.</p>
    </PcSection>
  );
}
