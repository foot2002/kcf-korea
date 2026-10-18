import { Link } from "@tanstack/react-router";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { PrivacyConsentBlock } from "@/components/privacy/PrivacyConsentBlock";
import { ApplyFrame, Field, applyInput } from "@/components/privacy/apply-ui";
import { PRIVACY_VISUALS } from "@/components/privacy/privacy-visuals";
import { usePublicContent } from "@/components/privacy/use-public-content";
import { PcSection } from "@/components/privacy/privacy-ui";
import { submitEducationEnrollment } from "@/lib/center-ops/api";

export function EducationCatalog() {
  const content = usePublicContent();
  const [year, setYear] = useState("전체");
  const [topic, setTopic] = useState("전체");
  const [status, setStatus] = useState("전체");
  const years = ["전체", ...new Set(content.education.map((item) => String(item.year)))];
  const topics = ["전체", ...new Set(content.education.flatMap((item) => item.topics))];
  const filtered = content.education.filter((item) => {
    if (year !== "전체" && String(item.year) !== year) return false;
    if (topic !== "전체" && !item.topics.includes(topic)) return false;
    if (status !== "전체" && item.status !== status) return false;
    return true;
  });

  return (
    <PcSection variant="white">
      <div className="flex flex-wrap gap-3">
        <Filter label="연도" value={year} options={years} onChange={setYear} />
        <Filter label="주제" value={topic} options={topics} onChange={setTopic} />
        <Filter label="상태" value={status} options={["전체", "접수중", "예정", "종료"]} onChange={setStatus} />
      </div>
      <ul className="mt-8 grid gap-4">
        {filtered.length === 0 ? <li className="text-text-secondary">조건에 맞는 교육이 없습니다.</li> : null}
        {filtered.map((item) => (
          <li key={item.slug}>
            <Link to="/privacy-center/education/$slug" params={{ slug: item.slug }} className="grid overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] md:grid-cols-[220px_1fr]">
              <img src={PRIVACY_VISUALS.education.src} alt="" className="h-40 w-full object-cover md:h-full" />
              <span className="block p-5">
              <div className="text-[12px] font-bold text-trust-blue">{item.status} · {item.year}</div>
              <h2 className="mt-2 text-[22px] font-bold text-navy">{item.title}</h2>
              <p className="mt-2 text-[14px] text-text-secondary">{item.date} {item.timeLabel} · {item.mode} · {item.fee}</p>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PcSection>
  );
}

function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="text-[13px] font-semibold text-navy">{label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="ml-2 h-10 rounded-lg border border-border bg-white px-3">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

export function EducationDetail({ slug }: { slug: string }) {
  const content = usePublicContent();
  const item = content.education.find((education) => education.slug === slug);
  const [consent, setConsent] = useState(false);
  const [receipt, setReceipt] = useState("");
  const count = item ? content.enrollmentCounts[item.slug] ?? 0 : 0;
  const closed = !item || item.status !== "접수중";

  const figure = useMemo(() => {
    if (!item || item.recordedApplicants == null) return "운영 기록 수치는 검수 후 표시합니다.";
    const prefix = item.figuresAreApproximate ? "약 " : "";
    return `운영 기록 ${prefix}${item.recordedApplicants.toLocaleString("ko-KR")}개 기관·기업 신청, ${prefix}${item.recordedParticipants?.toLocaleString("ko-KR") ?? "-"}곳 참여. 이 페이지 신규 신청 ${count}건.`;
  }, [item, count]);

  if (!item) return <PcSection variant="white"><p>교육을 찾을 수 없습니다.</p></PcSection>;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const result = await submitEducationEnrollment({
        educationSlug: item!.slug,
        name: String(form.get("name") ?? ""),
        organization: String(form.get("organization") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        privacyConsent: true,
      });
      setReceipt(result.id);
      toast.success("참가 신청이 접수되었습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "신청에 실패했습니다.");
    }
  }

  return (
    <PcSection variant="white">
      <div className="grid items-start gap-8 lg:grid-cols-[280px_1fr]">
        <img src={PRIVACY_VISUALS.education.src} alt={PRIVACY_VISUALS.education.alt} className="h-56 w-full rounded-[28px] object-cover" />
        <div>
          <p className="text-[13px] font-bold text-trust-blue">{item.status}</p>
          <h2 className="mt-2 text-navy">{item.title}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">{item.summary}</p>
        </div>
      </div>
      <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["일시", `${item.date} ${item.timeLabel}`],
          ["방식", item.mode],
          ["참가비", item.fee],
          ["주최", item.host],
          ["주관", item.organizers.join(" · ")],
          ["정원", item.capacity == null ? "제한 없음 또는 종료" : `${item.capacity}명`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border px-4 py-3">
            <dt className="text-[12px] font-bold text-navy">{label}</dt>
            <dd className="mt-1 text-[14px] text-text-secondary">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[14px] text-text-secondary">{figure}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {item.materialUrl ? <a className="btn-secondary-kcf" href={item.materialUrl} download={item.materialName || true}>교육자료 다운로드</a> : <p className="text-[14px] text-text-muted">등록된 교육자료 파일이 없습니다.</p>}
        {item.videoUrl ? <a className="btn-secondary-kcf" href={item.videoUrl} target="_blank" rel="noopener noreferrer">강의영상 보기</a> : null}
      </div>
      {item.status === "종료" ? <p className="mt-6 text-[14px] text-text-secondary">종료된 교육입니다. 영상이 등록되면 다시보기로 연결합니다.</p> : null}
      {!closed ? (
        <div className="mt-8">
          <ApplyFrame
            kicker="참가 신청"
            title="교육 참가"
            lead="이름, 소속, 이메일만 받습니다. 종료된 교육에는 이 신청란이 열리지 않습니다."
            visual="education"
            steps={["참가자 정보", "개인정보 동의", "접수번호 확인"]}
          >
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="이름"><input name="name" required className={applyInput} /></Field>
                <Field label="소속"><input name="organization" required className={applyInput} /></Field>
                <Field label="이메일"><input name="email" type="email" required className={applyInput} /></Field>
                <Field label="연락처 (선택)"><input name="phone" className={applyInput} /></Field>
              </div>
              <PrivacyConsentBlock id="edu-consent" variant="education-enroll" consent={consent} onConsentChange={setConsent} />
              <button disabled={!consent} className="btn-primary-kcf disabled:opacity-50" type="submit">신청하기</button>
              {receipt ? <p role="status" className="rounded-xl bg-[var(--pc-soft-blue)] px-4 py-3">접수번호 <strong>{receipt}</strong></p> : null}
            </form>
          </ApplyFrame>
        </div>
      ) : null}
    </PcSection>
  );
}
