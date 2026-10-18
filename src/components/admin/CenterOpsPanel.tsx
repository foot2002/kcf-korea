import { useEffect, useState } from "react";
import { toast } from "sonner";

import { privacyOffice } from "@/data/kcf";
import {
  CAMPAIGN_STATUSES,
  DEFAULT_LICENSE_SETTINGS,
  MONITOR_STATUSES,
  POLICY_STATUSES,
} from "@/data/privacy-program";
import {
  listCampaignApplications,
  listEducationEnrollments,
  listMonitorApplications,
  loadOps,
  saveOps,
  updateCampaignApplication,
  updateMonitorApplication,
} from "@/lib/center-ops/api";
import { buildPublicContent } from "@/lib/center-ops/logic";
import type { BoardPost, CampaignApplication, EducationEnrollment, MonitorApplication, OpsDb, PublishedStat, SureMarkGrant } from "@/lib/center-ops/types";

type OpsSection = "monitor" | "civic" | "education" | "ops";

export function CenterOpsPanel({ adminKey, section }: { adminKey: string; section: OpsSection }) {
  const [opsTab, setOpsTab] = useState<"content" | "mark">("content");
  const [monitors, setMonitors] = useState<MonitorApplication[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignApplication[]>([]);
  const [enrollments, setEnrollments] = useState<EducationEnrollment[]>([]);
  const [db, setDb] = useState<OpsDb | null>(null);

  async function refresh() {
    const [monitorRows, campaignRows, enrollmentRows, ops] = await Promise.all([
      listMonitorApplications(adminKey),
      listCampaignApplications(adminKey),
      listEducationEnrollments(adminKey),
      loadOps(adminKey),
    ]);
    setMonitors(monitorRows);
    setCampaigns(campaignRows);
    setEnrollments(enrollmentRows);
    setDb(ops);
  }

  useEffect(() => {
    void refresh().catch((error) => toast.error(error instanceof Error ? error.message : "불러오지 못했습니다."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  const unread = monitors.filter((item) => item.alertUnread).length + campaigns.filter((item) => item.alertUnread).length;
  const mailHref = `mailto:${privacyOffice.email}?subject=${encodeURIComponent("[개인정보보호진흥원] 새 신청")}`;

  return (
    <div>
      {section !== "ops" ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] text-text-secondary">
            {section === "monitor" ? `모니터링단 사전 신청 ${monitors.length}건` : section === "civic" ? `주민자치 지원 신청 ${campaigns.length}건` : `교육 참가 신청 ${enrollments.length}건`}
            {section !== "education" ? ` · 신규 ${section === "monitor" ? monitors.filter((item) => item.alertUnread).length : campaigns.filter((item) => item.alertUnread).length}건` : ""}
            . 메일 서버는 연결되어 있지 않습니다.
          </p>
          <a className="rounded-full bg-amber-100 px-4 py-2 text-[13px] font-bold text-amber-900" href={mailHref}>담당자 메일 작성</a>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] text-text-secondary">교육·정책·자료·사용권·마크와 모니터링 공지를 수정합니다. 신청 접수는 위 탭에서 처리합니다. 신규 신청 {unread}건.</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setOpsTab("content")} className={`rounded-full px-4 py-2 text-[13px] font-bold ${opsTab === "content" ? "bg-navy text-white" : "bg-blue-gray text-navy"}`}>콘텐츠·사용권</button>
            <button type="button" onClick={() => setOpsTab("mark")} className={`rounded-full px-4 py-2 text-[13px] font-bold ${opsTab === "mark" ? "bg-navy text-white" : "bg-blue-gray text-navy"}`}>SURE Mark</button>
          </div>
        </div>
      )}

      {section === "monitor" ? (
        <ul className="mt-6 space-y-4">
          {monitors.length === 0 ? <li className="text-text-secondary">신청이 없습니다.</li> : null}
          {monitors.map((item) => (
            <li key={item.id} className="rounded-2xl border border-border p-4">
              <div className="font-bold text-navy">{item.name} · {item.id} {item.alertUnread ? "· 신규" : ""}</div>
              <dl className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
                <Field label="이메일" value={item.email} />
                <Field label="연락처" value={item.phone || "없음"} />
                <Field label="거주 시도" value={item.region} />
                <Field label="활동방식" value={item.participationMode} />
                <Field label="관심 분야" value={item.interests.join(", ") || "없음"} />
                <Field label="알림 동의" value={item.notifyConsent ? "동의" : "미동의"} />
                <Field label="접수일" value={item.createdAt.slice(0, 16).replace("T", " ")} />
              </dl>
              <p className="mt-3 text-[14px] leading-relaxed text-navy">참여 동기: {item.motivation}</p>
              <AdminStatus
                value={item.status}
                options={MONITOR_STATUSES}
                note={item.publicNote}
                memo={item.adminMemo}
                onSave={async (patch) => {
                  await updateMonitorApplication(adminKey, item.id, { ...patch, alertUnread: false });
                  await refresh();
                }}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {section === "civic" ? (
        <ul className="mt-6 space-y-4">
          {campaigns.length === 0 ? <li className="text-text-secondary">주민자치 신청이 없습니다. 협단체·기업·공공기관 신청은 지원 신청 관리 탭에 있습니다.</li> : null}
          {campaigns.map((item) => (
            <li key={item.id} className="rounded-2xl border border-border p-4">
              <div className="font-bold text-navy">{item.organizationName} · {item.eventName} · {item.id} {item.alertUnread ? "· 신규" : ""}</div>
              <dl className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
                <Field label="담당자" value={item.managerName} />
                <Field label="이메일" value={item.email} />
                <Field label="연락처" value={item.phone} />
                <Field label="관할·부서" value={`${item.municipality} ${item.department}`} />
                <Field label="행사기간" value={item.eventPeriod} />
                <Field label="예상 참여자" value={item.expectedParticipants} />
                <Field label="접수일" value={item.createdAt.slice(0, 16).replace("T", " ")} />
              </dl>
              <p className="mt-3 text-[14px] leading-relaxed">신청 목적: {item.purpose}</p>
              <p className="mt-2 text-[14px] leading-relaxed">행사 목적: {item.eventPurpose}</p>
              <p className="mt-2 text-[14px] leading-relaxed">수집 항목: {item.collectedItems}</p>
              {item.attachment ? <a className="mt-2 inline-block text-[13px] font-bold text-trust-blue" href={item.attachment.dataUrl} download={item.attachment.name}>첨부 다운로드 · {item.attachment.name}</a> : null}
              {item.supplements.length > 0 ? (
                <ul className="mt-3 space-y-1 text-[13px] text-text-secondary">
                  {item.supplements.map((extra) => <li key={extra.at}>보완 {extra.at.slice(0, 16).replace("T", " ")} · {extra.note}{extra.fileName ? ` · ${extra.fileName}` : ""}</li>)}
                </ul>
              ) : null}
              <AdminStatus
                value={item.status}
                options={CAMPAIGN_STATUSES}
                note={item.publicNote}
                memo={item.adminMemo}
                license={item.licenseCode}
                onSave={async (patch) => {
                  await updateCampaignApplication(adminKey, item.id, { ...patch, alertUnread: false });
                  await refresh();
                }}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {section === "education" ? (
        <ul className="mt-6 space-y-3">
          {enrollments.length === 0 ? <li className="text-text-secondary">교육 참가 신청이 없습니다. 종료된 교육은 공개 페이지에서 신청을 받지 않습니다.</li> : null}
          {enrollments.map((item) => (
            <li key={item.id} className="rounded-2xl border border-border p-4">
              <div className="font-bold text-navy">{item.name} · {item.id}</div>
              <dl className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
                <Field label="교육" value={item.educationSlug} />
                <Field label="소속" value={item.organization} />
                <Field label="이메일" value={item.email} />
                <Field label="연락처" value={item.phone || "없음"} />
                <Field label="접수일" value={item.createdAt.slice(0, 16).replace("T", " ")} />
              </dl>
            </li>
          ))}
        </ul>
      ) : null}

      {section === "ops" && opsTab === "content" && db ? <ContentEditor adminKey={adminKey} db={db} onSaved={refresh} /> : null}
      {section === "ops" && opsTab === "mark" && db ? <MarkEditor adminKey={adminKey} db={db} onSaved={refresh} /> : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] font-bold text-text-muted">{label}</dt>
      <dd className="text-navy">{value}</dd>
    </div>
  );
}

function AdminStatus({
  value,
  options,
  note,
  memo,
  license,
  onSave,
}: {
  value: string;
  options: readonly string[];
  note: string;
  memo: string;
  license?: string;
  onSave: (patch: { status: never; publicNote: string; adminMemo: string; licenseCode?: string }) => Promise<void>;
}) {
  const [status, setStatus] = useState(value);
  const [publicNote, setPublicNote] = useState(note);
  const [adminMemo, setAdminMemo] = useState(memo);
  const [licenseCode, setLicenseCode] = useState(license ?? "");
  return (
    <div className="mt-3 grid gap-2">
      <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border border-border px-3" aria-label="상태">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <input value={publicNote} onChange={(event) => setPublicNote(event.target.value)} className="h-10 rounded-lg border border-border px-3" placeholder="신청자에게 보이는 안내" aria-label="공개 안내" />
      <input value={adminMemo} onChange={(event) => setAdminMemo(event.target.value)} className="h-10 rounded-lg border border-border px-3" placeholder="관리자 메모" aria-label="관리자 메모" />
      {license !== undefined ? <input value={licenseCode} onChange={(event) => setLicenseCode(event.target.value)} className="h-10 rounded-lg border border-border px-3" placeholder="수동 발급 사용권 코드" aria-label="사용권 코드" /> : null}
      <button type="button" className="btn-secondary-kcf w-fit" onClick={() => void onSave({ status: status as never, publicNote, adminMemo, licenseCode: license !== undefined ? licenseCode : undefined }).then(() => toast.success("저장했습니다.")).catch((error) => toast.error(error instanceof Error ? error.message : "저장 실패"))}>저장</button>
    </div>
  );
}

function ContentEditor({ adminKey, db, onSaved }: { adminKey: string; db: OpsDb; onSaved: () => Promise<void> }) {
  const view = buildPublicContent(db, Date.now());
  const [statsText, setStatsText] = useState(view.publishedStats.map((item) => `${item.label}|${item.value}`).join("\n"));
  const [license, setLicense] = useState(view.licenseSettings);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeBody, setNoticeBody] = useState("");

  async function persist(next: OpsDb) {
    await saveOps(adminKey, next);
    await onSaved();
    toast.success("저장했습니다.");
  }

  return (
    <div className="mt-6 space-y-8">
      <section>
        <h3 className="font-bold text-navy">교육 운영 수치·자료</h3>
        {view.education.map((item) => (
          <EducationRow key={item.slug} itemSlug={item.slug} db={db} onSave={persist} applicants={item.recordedApplicants} participants={item.recordedParticipants} status={item.status} materialUrl={item.materialUrl} videoUrl={item.videoUrl} published={item.published} publishAt={item.publishAt} />
        ))}
      </section>
      <section>
        <h3 className="font-bold text-navy">정책 상태</h3>
        {view.policies.map((item) => (
          <PolicyRow key={item.slug} slug={item.slug} status={item.status} followUp={item.followUp} db={db} onSave={persist} />
        ))}
      </section>
      <section>
        <h3 className="font-bold text-navy">자료 첨부·공개</h3>
        {view.publications.map((item) => (
          <PublicationRow key={item.slug} slug={item.slug} attachmentUrl={item.attachmentUrl ?? ""} attachmentName={item.attachmentName ?? ""} published={item.published} db={db} onSave={persist} />
        ))}
      </section>
      <section>
        <h3 className="font-bold text-navy">사용권 범위</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label>설문 개수<input type="number" value={license.surveyCount} onChange={(event) => setLicense({ ...license, surveyCount: Number(event.target.value) })} className="mt-1 block h-10 w-full rounded-lg border px-3" /></label>
          <label>응답자 수<input type="number" value={license.respondentLimit} onChange={(event) => setLicense({ ...license, respondentLimit: Number(event.target.value) })} className="mt-1 block h-10 w-full rounded-lg border px-3" /></label>
          <label>사용기간(일)<input type="number" value={license.periodDays} onChange={(event) => setLicense({ ...license, periodDays: Number(event.target.value) })} className="mt-1 block h-10 w-full rounded-lg border px-3" /></label>
          <label>제공 기능<input value={license.features} onChange={(event) => setLicense({ ...license, features: event.target.value })} className="mt-1 block h-10 w-full rounded-lg border px-3" /></label>
          <label>저장<input value={license.storage} onChange={(event) => setLicense({ ...license, storage: event.target.value })} className="mt-1 block h-10 w-full rounded-lg border px-3" /></label>
          <label>파기 기준<input value={license.disposalRule} onChange={(event) => setLicense({ ...license, disposalRule: event.target.value })} className="mt-1 block h-10 w-full rounded-lg border px-3" /></label>
        </div>
        <label className="mt-2 flex items-center gap-2 text-[14px]"><input type="checkbox" checked={license.downloadAllowed} onChange={(event) => setLicense({ ...license, downloadAllowed: event.target.checked })} />결과 다운로드 허용</label>
        <button type="button" className="btn-secondary-kcf mt-3" onClick={() => void persist({ ...db, licenseSettings: license })}>사용권 설정 저장</button>
        <button type="button" className="ml-2 text-[13px] text-text-muted" onClick={() => setLicense({ ...DEFAULT_LICENSE_SETTINGS })}>기본값</button>
      </section>
      <section>
        <h3 className="font-bold text-navy">게시 실적</h3>
        <p className="text-[13px] text-text-secondary">한 줄에 항목|수치. 비우면 공개 숫자를 표시하지 않습니다.</p>
        <textarea value={statsText} onChange={(event) => setStatsText(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border px-3 py-2" />
        <button type="button" className="btn-secondary-kcf mt-2" onClick={() => {
          const publishedStats: PublishedStat[] = statsText.split("\n").map((line) => line.trim()).filter(Boolean).map((line, index) => {
            const [label, value] = line.split("|");
            return { id: `stat-${index}`, label: (label ?? "").trim(), value: (value ?? "").trim() };
          }).filter((item) => item.label && item.value);
          void persist({ ...db, publishedStats });
        }}>실적 게시</button>
      </section>
      <section>
        <h3 className="font-bold text-navy">모니터링 공지·활동자료</h3>
        <input value={noticeTitle} onChange={(event) => setNoticeTitle(event.target.value)} placeholder="제목" className="mt-2 h-10 w-full rounded-lg border px-3" />
        <textarea value={noticeBody} onChange={(event) => setNoticeBody(event.target.value)} placeholder="내용" rows={3} className="mt-2 w-full rounded-xl border px-3 py-2" />
        <div className="mt-2 flex gap-2">
          <button type="button" className="btn-secondary-kcf" onClick={() => addPost("notices")}>공지 추가</button>
          <button type="button" className="btn-secondary-kcf" onClick={() => addPost("activities")}>활동자료 추가</button>
        </div>
      </section>
    </div>
  );

  function addPost(key: "notices" | "activities") {
    if (!noticeTitle.trim() || !noticeBody.trim()) return;
    const post: BoardPost = { id: `${key}-${Date.now()}`, title: noticeTitle.trim(), body: noticeBody.trim(), createdAt: new Date().toISOString(), published: true };
    const current = db[key] ?? (key === "notices" ? view.notices : view.activities);
    void persist({ ...db, [key]: [...current, post] });
    setNoticeTitle("");
    setNoticeBody("");
  }
}

function EducationRow({
  itemSlug, db, onSave, applicants, participants, status, materialUrl, videoUrl, published, publishAt,
}: {
  itemSlug: string;
  db: OpsDb;
  onSave: (db: OpsDb) => Promise<void>;
  applicants: number | null;
  participants: number | null;
  status: string;
  materialUrl: string;
  videoUrl: string;
  published: boolean;
  publishAt: string;
}) {
  const [row, setRow] = useState({ applicants: applicants ?? "", participants: participants ?? "", status, materialUrl, videoUrl, published, publishAt });
  return (
    <div className="mt-3 grid gap-2 rounded-xl border border-border p-3 md:grid-cols-3">
      <div className="md:col-span-3 text-[13px] font-bold text-navy">{itemSlug}</div>
      <label>신청 기관 수<input value={row.applicants} onChange={(event) => setRow({ ...row, applicants: event.target.value })} className="mt-1 h-10 w-full rounded-lg border px-3" /></label>
      <label>참여 기관 수<input value={row.participants} onChange={(event) => setRow({ ...row, participants: event.target.value })} className="mt-1 h-10 w-full rounded-lg border px-3" /></label>
      <label>상태<select value={row.status} onChange={(event) => setRow({ ...row, status: event.target.value })} className="mt-1 h-10 w-full rounded-lg border px-3"><option>예정</option><option>접수중</option><option>종료</option></select></label>
      <label>자료 URL<input value={row.materialUrl} onChange={(event) => setRow({ ...row, materialUrl: event.target.value })} className="mt-1 h-10 w-full rounded-lg border px-3" /></label>
      <label>영상 URL<input value={row.videoUrl} onChange={(event) => setRow({ ...row, videoUrl: event.target.value })} className="mt-1 h-10 w-full rounded-lg border px-3" /></label>
      <label>공개 예약<input type="datetime-local" value={row.publishAt} onChange={(event) => setRow({ ...row, publishAt: event.target.value })} className="mt-1 h-10 w-full rounded-lg border px-3" /></label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={row.published} onChange={(event) => setRow({ ...row, published: event.target.checked })} />공개</label>
      <button type="button" className="btn-secondary-kcf" onClick={() => void onSave({
        ...db,
        educationOverrides: {
          ...db.educationOverrides,
          [itemSlug]: {
            ...db.educationOverrides[itemSlug],
            recordedApplicants: row.applicants === "" ? null : Number(row.applicants),
            recordedParticipants: row.participants === "" ? null : Number(row.participants),
            status: row.status as "예정" | "접수중" | "종료",
            materialUrl: row.materialUrl,
            videoUrl: row.videoUrl,
            published: row.published,
            publishAt: row.publishAt,
            figuresAreApproximate: true,
          },
        },
      })}>교육 저장</button>
    </div>
  );
}

function PolicyRow({ slug, status, followUp, db, onSave }: { slug: string; status: string; followUp: string; db: OpsDb; onSave: (db: OpsDb) => Promise<void> }) {
  const [row, setRow] = useState({ status, followUp });
  return (
    <div className="mt-3 grid gap-2 rounded-xl border border-border p-3">
      <div className="text-[13px] font-bold">{slug}</div>
      <select value={row.status} onChange={(event) => setRow({ ...row, status: event.target.value })} className="h-10 rounded-lg border px-3" aria-label={`${slug} 상태`}>
        {POLICY_STATUSES.map((item) => <option key={item}>{item}</option>)}
      </select>
      <textarea value={row.followUp} onChange={(event) => setRow({ ...row, followUp: event.target.value })} rows={2} className="rounded-xl border px-3 py-2" aria-label={`${slug} 후속조치`} />
      <button type="button" className="btn-secondary-kcf w-fit" onClick={() => void onSave({
        ...db,
        policyOverrides: { ...db.policyOverrides, [slug]: { ...db.policyOverrides[slug], status: row.status as (typeof POLICY_STATUSES)[number], followUp: row.followUp, updatedAt: new Date().toISOString().slice(0, 10) } },
      })}>정책 저장</button>
    </div>
  );
}

function PublicationRow({ slug, attachmentUrl, attachmentName, published, db, onSave }: { slug: string; attachmentUrl: string; attachmentName: string; published: boolean; db: OpsDb; onSave: (db: OpsDb) => Promise<void> }) {
  const [row, setRow] = useState({ attachmentUrl, attachmentName, published });
  return (
    <div className="mt-3 grid gap-2 rounded-xl border border-border p-3 md:grid-cols-2">
      <div className="md:col-span-2 text-[13px] font-bold">{slug}</div>
      <input value={row.attachmentUrl} onChange={(event) => setRow({ ...row, attachmentUrl: event.target.value })} placeholder="첨부 URL" className="h-10 rounded-lg border px-3" aria-label={`${slug} 첨부 주소`} />
      <input value={row.attachmentName} onChange={(event) => setRow({ ...row, attachmentName: event.target.value })} placeholder="파일 이름" className="h-10 rounded-lg border px-3" aria-label={`${slug} 파일 이름`} />
      <label className="flex items-center gap-2"><input type="checkbox" checked={row.published} onChange={(event) => setRow({ ...row, published: event.target.checked })} />공개</label>
      <button type="button" className="btn-secondary-kcf" onClick={() => void onSave({
        ...db,
        publicationOverrides: { ...db.publicationOverrides, [slug]: { ...db.publicationOverrides[slug], attachmentUrl: row.attachmentUrl, attachmentName: row.attachmentName, published: row.published } },
      })}>자료 저장</button>
    </div>
  );
}

function MarkEditor({ adminKey, db, onSaved }: { adminKey: string; db: OpsDb; onSaved: () => Promise<void> }) {
  const [row, setRow] = useState<SureMarkGrant>({ id: "", code: "", organization: "", grantedAt: "", expiresAt: "", status: "유효" });
  return (
    <div className="mt-6">
      <p className="text-[14px] text-text-secondary">부여 코드를 등록하면 공개 페이지에서 진위를 확인할 수 있습니다. 확인되지 않은 기업은 넣지 않습니다.</p>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <input placeholder="코드" value={row.code} onChange={(event) => setRow({ ...row, code: event.target.value })} className="h-10 rounded-lg border px-3" aria-label="마크 코드" />
        <input placeholder="기관명" value={row.organization} onChange={(event) => setRow({ ...row, organization: event.target.value })} className="h-10 rounded-lg border px-3" aria-label="기관명" />
        <input type="date" value={row.grantedAt} onChange={(event) => setRow({ ...row, grantedAt: event.target.value })} className="h-10 rounded-lg border px-3" aria-label="부여일" />
        <input type="date" value={row.expiresAt} onChange={(event) => setRow({ ...row, expiresAt: event.target.value })} className="h-10 rounded-lg border px-3" aria-label="만료일" />
        <select value={row.status} onChange={(event) => setRow({ ...row, status: event.target.value as SureMarkGrant["status"] })} className="h-10 rounded-lg border px-3" aria-label="마크 상태">
          <option>유효</option><option>갱신필요</option><option>취소</option>
        </select>
      </div>
      <button type="button" className="btn-secondary-kcf mt-3" onClick={() => {
        if (!row.code.trim() || !row.organization.trim()) return;
        const grant = { ...row, id: `mark-${Date.now()}` };
        void saveOps(adminKey, { ...db, sureMarks: [...db.sureMarks, grant] }).then(onSaved).then(() => toast.success("등록했습니다."));
      }}>부여현황 추가</button>
      <ul className="mt-4 space-y-2">
        {db.sureMarks.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 text-[14px]">
            <span>{item.code} · {item.organization} · {item.status}</span>
            <button type="button" className="text-destructive" onClick={() => void saveOps(adminKey, { ...db, sureMarks: db.sureMarks.filter((mark) => mark.id !== item.id) }).then(onSaved)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
