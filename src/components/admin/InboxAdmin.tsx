import { useEffect, useMemo, useState } from "react";

import { AUDIT_LABELS, DELETE_CONFIRM, INBOX_NAV, KEY_KEEP, KEY_WARNING, PURGE_NOTE, type InboxView } from "@/data/inbox-admin";
import { downloadJson, generateKeyPair, importPrivateKey, publicKeyIdFromPrivateJwk, decryptAttachment } from "@/lib/forms/crypto";
import {
  csvFor,
  defaultRetentionUntil,
  effectiveStatus,
  fieldText,
  firstStatusCounts,
  isExpired,
  isWithin7Days,
  kindLabel,
  labelFor,
  localDate,
  maskedName,
  rawName,
  retentionUntil,
  searchText,
  type InboxItem,
} from "@/lib/forms/inbox-model";
import { FORM_NAMES, STATUS_BADGE, STATUSES, type FormName } from "@/lib/forms/schema";
import {
  appendAudit,
  deleteInboxItem,
  inboxRepoName,
  listAudit,
  listRemovedFiles,
  loadInbox,
  probeRepo,
  publishOrg,
  publishPublicKey,
  purgeInboxHistory,
  readAttachment,
  readSitePublicKey,
  restoreFile,
  saveStatus,
  type AuditLine,
  type RemovedFile,
  type RepoAccess,
} from "@/lib/forms/inbox-store";
import { CONTENT_REPO } from "@/lib/content/types";
import type { InboxPublicKeyFile } from "@/lib/forms/crypto";

const IDLE_MS = 30 * 60 * 1000;
const PAGE_SIZE = 20;

const emptyAccess: RepoAccess = { ok: false, push: false, detail: "확인 전" };

function downloadText(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function InboxAdmin({
  token,
  login,
  view,
  onView,
  onCounts,
}: {
  token: string;
  login: string;
  view: InboxView | null;
  onView: (view: InboxView) => void;
  onCounts: (counts: Record<FormName, number>) => void;
}) {
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const [loadedKeyId, setLoadedKeyId] = useState("");
  const [publicFile, setPublicFile] = useState<InboxPublicKeyFile | null>(null);
  const [publicSha, setPublicSha] = useState<string | null>(null);
  const [siteAccess, setSiteAccess] = useState<RepoAccess>(emptyAccess);
  const [inboxAccess, setInboxAccess] = useState<RepoAccess>(emptyAccess);
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [freshKey, setFreshKey] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [memo, setMemo] = useState("");
  const [until, setUntil] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [page, setPage] = useState(0);
  const [audit, setAudit] = useState<AuditLine[]>([]);
  const [removed, setRemoved] = useState<RemovedFile[]>([]);
  const [restorePick, setRestorePick] = useState<string[]>([]);
  const [purgeName, setPurgeName] = useState("");
  const [csvReason, setCsvReason] = useState("");
  const [csvOpen, setCsvOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  const repo = inboxRepoName();
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const listForm = INBOX_NAV.find((item) => item.id === view)?.form;

  useEffect(() => {
    let cancel = false;
    void (async () => {
      const [site, inbox, key] = await Promise.all([
        probeRepo(token, CONTENT_REPO),
        probeRepo(token, repo),
        readSitePublicKey(token).catch(() => ({ sha: null, file: null })),
      ]);
      if (cancel) return;
      setSiteAccess(site);
      setInboxAccess(inbox);
      setPublicFile(key.file);
      setPublicSha(key.sha);
    })();
    return () => {
      cancel = true;
    };
  }, [token, repo]);

  useEffect(() => {
    if (!privateKey) return;
    let timer = window.setTimeout(() => lock(), IDLE_MS);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => lock(), IDLE_MS);
    };
    window.addEventListener("pointerdown", reset);
    window.addEventListener("keydown", reset);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("keydown", reset);
    };
  }, [privateKey]);

  useEffect(() => {
    onCounts(firstStatusCounts(items));
  }, [items, onCounts]);

  useEffect(() => {
    if (!view || view === "inbox-settings" || !privateKey || loaded) return;
    void refresh();
  }, [view, privateKey, loaded]);

  useEffect(() => {
    if (view !== "inbox-audit") return;
    void listAudit(token).then(setAudit).catch((error: unknown) => setMessage(error instanceof Error ? error.message : "작업 기록을 읽지 못했습니다."));
  }, [view, token]);

  useEffect(() => {
    if (view !== "inbox-dashboard" || !privateKey) return;
    void listRemovedFiles(token).then(setRemoved).catch(() => setRemoved([]));
  }, [view, privateKey, token, loaded]);

  function lock() {
    setPrivateKey(null);
    setLoadedKeyId("");
    setItems([]);
    setLoaded(false);
    setSelectedId("");
    setMessage("개인 키를 메모리에서 지웠습니다.");
  }

  async function refresh() {
    if (!privateKey) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await loadInbox(token, privateKey, (done, total) => setProgress(`${done} / ${total}건 읽는 중`));
      setItems(result.items);
      setLoaded(true);
      setProgress("");
      if (result.truncated) setMessage("파일 목록이 잘렸습니다. 일부 신청이 빠졌을 수 있습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "신청함을 읽지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function onGenerate() {
    if (publicFile && !window.confirm(KEY_WARNING)) return;
    setBusy(true);
    setMessage("");
    try {
      const pair = await generateKeyPair();
      downloadJson("kcf-inbox-private-key.json", pair.privateJwk);
      await publishPublicKey(token, pair.publicFile, publicSha);
      const next = await readSitePublicKey(token);
      setPublicFile(next.file);
      setPublicSha(next.sha);
      setFreshKey(true);
      setMessage("개인 키 파일을 내려받았습니다. 공개 키는 사이트 저장소에 저장했습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "열쇠를 만들지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function onImport(file: File) {
    setMessage("");
    try {
      const keyId = await publicKeyIdFromPrivateJwk(JSON.parse(await file.text()) as JsonWebKey);
      const key = await importPrivateKey(file);
      setPrivateKey(key);
      setLoadedKeyId(keyId);
      setLoaded(false);
      setItems([]);
      setMessage(publicFile && keyId === publicFile.keyId ? "개인 키가 공개 키와 일치합니다." : "개인 키를 불러왔습니다. 공개 키와 지문이 다릅니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "개인 키 파일이 아닙니다.");
    }
  }

  function openItem(item: InboxItem) {
    setSelectedId(item.id);
    const status = effectiveStatus(item);
    setStatusValue(status);
    setMemo(item.overlay?.adminMemo ?? "");
    setUntil(item.overlay?.retentionUntil || defaultRetentionUntil(item.form, item.createdAt, status, item.overlay?.updatedAt || item.createdAt));
    void appendAudit(token, { at: new Date().toISOString(), login, action: "view", form: item.form, id: item.id }).catch(() => undefined);
  }

  async function onSaveStatus() {
    if (!selected || !publicFile) {
      setMessage("공개 키가 없으면 상태를 저장할 수 없습니다.");
      return;
    }
    if (loadedKeyId !== publicFile.keyId) {
      setMessage("현재 공개 키와 같은 개인 키를 불러와야 상태를 저장할 수 있습니다.");
      return;
    }
    setBusy(true);
    try {
      await saveStatus(token, selected, {
        status: statusValue,
        adminMemo: memo,
        retentionUntil: until,
        updatedAt: new Date().toISOString(),
        updatedBy: login,
      }, publicFile);
      setLoaded(false);
      setMessage("상태를 저장했습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "상태를 저장하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(targets: InboxItem[]) {
    setBusy(true);
    setDeleteOpen(false);
    setBulkOpen(false);
    try {
      for (const item of targets) await deleteInboxItem(token, item, login);
      setSelectedId("");
      setLoaded(false);
      setMessage(`${targets.length}건을 삭제했습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "삭제하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function onDownload() {
    if (!selected || !privateKey) return;
    setBusy(true);
    try {
      const bytes = await readAttachment(token, selected);
      const plain = await decryptAttachment(bytes, selected.record, privateKey);
      const name = selected.plain?.attachmentName || "첨부파일";
      const blob = new Blob([plain.buffer.slice(plain.byteOffset, plain.byteOffset + plain.byteLength) as ArrayBuffer]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
      URL.revokeObjectURL(url);
      await appendAudit(token, { at: new Date().toISOString(), login, action: "download", form: selected.form, id: selected.id });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "첨부를 열지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function onPublish() {
    if (!selected) return;
    const name = rawName(selected);
    if (!name) return;
    setBusy(true);
    try {
      await publishOrg(token, name);
      if (publicFile && loadedKeyId === publicFile.keyId) {
        await saveStatus(token, selected, {
          status: "게시",
          adminMemo: memo,
          retentionUntil: until,
          updatedAt: new Date().toISOString(),
          updatedBy: login,
        }, publicFile);
        setStatusValue("게시");
        setLoaded(false);
      }
      setMessage("공개 명단에 기관명과 오늘 날짜를 올렸습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "공개 명단에 올리지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  function exportCsv() {
    if (!listForm || !csvReason.trim()) {
      setMessage("사유를 입력해 주세요.");
      return;
    }
    downloadText(`kcf-${listForm}-${localDate()}.csv`, csvFor(filtered), "text/csv;charset=utf-8");
    void appendAudit(token, { at: new Date().toISOString(), login, action: "export", form: listForm, id: "csv" }).catch(() => undefined);
    setCsvReason("");
    setCsvOpen(false);
  }

  async function onRestore() {
    const picks = removed.filter((file) => restorePick.includes(`${file.commitSha}:${file.path}`));
    if (picks.length === 0) return;
    setBusy(true);
    try {
      for (const file of picks) await restoreFile(token, file, login);
      setRestorePick([]);
      setLoaded(false);
      setRemoved(await listRemovedFiles(token));
      setMessage("고른 파일을 다시 올렸습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "되돌리지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function onPurge() {
    setBusy(true);
    try {
      await purgeInboxHistory(token, purgeName, login);
      setPurgeName("");
      setMessage("보관함 저장소의 기록을 현재 파일만 남기고 새로 만들었습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "기록을 지우지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  const filtered = useMemo(() => {
    if (!listForm) return [];
    return items.filter((item) => item.form === listForm && (statusFilter === "전체" || effectiveStatus(item) === statusFilter) && searchText(item).includes(query.trim().toLowerCase()));
  }, [items, listForm, query, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const expired = items.filter((item) => isExpired(item));
  const recent = items.filter((item) => isWithin7Days(item)).length;
  const keyMatch = Boolean(publicFile && loadedKeyId && loadedKeyId === publicFile.keyId);

  if (view === null) return null;

  return (
    <div className="space-y-4">
      <p aria-live="polite" className="text-[15px] text-[#111827]">{message}</p>
      {view === "inbox-settings" ? (
        <section className="rounded-md border border-[#D1D5DB] bg-white p-6">
          <h1 className="text-navy">신청함 설정</h1>
          <p className={`mt-4 rounded-md border p-4 text-[18px] font-bold leading-relaxed text-[#111827] ${freshKey ? "border-[#9A3412]" : "border-[#D1D5DB]"}`}>{KEY_KEEP}</p>
          <dl className="mt-6 grid gap-3 text-[15px] md:grid-cols-2">
            <div className="rounded-md border border-[#D1D5DB] p-3"><dt className="font-bold text-[#111827]">사이트 저장소</dt><dd>{siteAccess.detail}</dd></div>
            <div className="rounded-md border border-[#D1D5DB] p-3"><dt className="font-bold text-[#111827]">보관함 저장소</dt><dd>{repo || "설정 없음"} · {inboxAccess.detail}</dd></div>
            <div className="rounded-md border border-[#D1D5DB] p-3"><dt className="font-bold text-[#111827]">개인 키</dt><dd>{privateKey ? "불러옴" : "안 불러옴"}{loadedKeyId ? ` · ${keyMatch ? "공개 키와 일치" : "공개 키와 다름"}` : ""}</dd></div>
            <div className="rounded-md border border-[#D1D5DB] p-3"><dt className="font-bold text-[#111827]">공개 키</dt><dd className="break-all">{publicFile?.keyId ?? "없음"}</dd></div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" className="btn-primary-kcf" disabled={busy} onClick={() => void onGenerate()}>암호 열쇠 만들기</button>
            <label className="btn-secondary-kcf cursor-pointer">
              개인 키 불러오기
              <input type="file" accept="application/json,.json" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void onImport(file); }} />
            </label>
            <button type="button" className="btn-secondary-kcf" onClick={lock}>잠그기</button>
          </div>
          <p className="mt-4 text-[14px] text-[#374151]">30분 동안 조작이 없으면 개인 키를 메모리에서 지웁니다.</p>
        </section>
      ) : null}

      {view === "inbox-dashboard" ? (
        <section>
          <h1 className="text-navy">신청함 대시보드</h1>
          {!privateKey ? <p className="mt-4 text-[15px]">개인 키를 불러오면 신청서를 엽니다. <button type="button" className="font-bold text-[#0B3A6E] underline" onClick={() => onView("inbox-settings")}>신청함 설정</button></p> : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INBOX_NAV.filter((item) => item.form).map((item) => (
              <article key={item.id} className="rounded-md border border-[#D1D5DB] bg-white p-4">
                <h2 className="text-[15px] font-bold text-[#111827]">{item.label}</h2>
                <p className="mt-2 text-[28px] font-bold text-navy">{item.form ? firstStatusCounts(items)[item.form] : 0}</p>
                <p className="text-[13px] text-[#374151]">{item.form ? STATUSES[item.form][0] : ""}</p>
              </article>
            ))}
            <article className="rounded-md border border-[#D1D5DB] bg-white p-4">
              <h2 className="text-[15px] font-bold text-[#111827]">최근 7일 접수</h2>
              <p className="mt-2 text-[28px] font-bold text-navy">{recent}</p>
            </article>
          </div>
          <article className="mt-4 rounded-md border border-[#9A3412] bg-white p-4">
            <h2 className="text-[16px] font-bold text-[#9A3412]">보유기간이 지난 신청 {expired.length}건</h2>
            <button type="button" className="btn-secondary-kcf mt-3" disabled={!privateKey || expired.length === 0 || busy} onClick={() => setBulkOpen(true)}>보유기간 지난 건 일괄 삭제</button>
          </article>
          <article className="mt-4 rounded-md border border-[#D1D5DB] bg-white p-4">
            <h2 className="text-[16px] font-bold text-navy">기록까지 영구 파기</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#374151]">{PURGE_NOTE}</p>
            <label className="mt-3 block text-[14px] font-bold text-[#111827]">
              보관함 저장소 이름
              <input value={purgeName} onChange={(event) => setPurgeName(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-[#D1D5DB] px-3 font-normal" placeholder={repo} />
            </label>
            <button type="button" className="mt-3 rounded-md border border-[#9A3412] px-4 py-2 text-[14px] font-bold text-[#9A3412]" disabled={busy || purgeName.trim() !== repo} onClick={() => void onPurge()}>기록까지 영구 파기</button>
          </article>
          <article className="mt-4 rounded-md border border-[#D1D5DB] bg-white p-4">
            <h2 className="text-[16px] font-bold text-navy">되살리기</h2>
            <p className="mt-2 text-[15px] text-[#374151]">최근 30일 커밋에서 지워진 data/ 파일입니다.</p>
            {removed.length === 0 ? <p className="mt-3 text-[15px]">지워진 파일이 없습니다.</p> : (
              <ul className="mt-3 space-y-2">
                {removed.map((file) => {
                  const key = `${file.commitSha}:${file.path}`;
                  return (
                    <li key={key}>
                      <label className="flex items-start gap-2 text-[14px]">
                        <input type="checkbox" checked={restorePick.includes(key)} onChange={(event) => setRestorePick(event.target.checked ? [...restorePick, key] : restorePick.filter((item) => item !== key))} />
                        <span className="break-all">{file.path}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
            <button type="button" className="btn-secondary-kcf mt-3" disabled={restorePick.length === 0 || busy} onClick={() => void onRestore()}>다시 올리기</button>
          </article>
          {progress ? <p className="mt-3 text-[14px]">{progress}</p> : null}
        </section>
      ) : null}

      {listForm ? (
        <section>
          <h1 className="text-navy">{INBOX_NAV.find((item) => item.form === listForm)?.label}</h1>
          {!privateKey ? <p className="mt-4 text-[15px]">개인 키를 불러오면 목록을 엽니다. <button type="button" className="font-bold text-[#0B3A6E] underline" onClick={() => onView("inbox-settings")}>신청함 설정</button></p> : null}
          <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="상태">
            {["전체", ...STATUSES[listForm]].map((status) => (
              <button key={status} type="button" role="tab" aria-selected={statusFilter === status} className={`rounded-md border px-3 py-1.5 text-[14px] font-bold ${statusFilter === status ? "border-[#0B3A6E] bg-[#0B3A6E] text-white" : "border-[#D1D5DB] bg-white text-[#111827]"}`} onClick={() => { setStatusFilter(status); setPage(0); }}>{status}</button>
            ))}
          </div>
          <label className="mt-4 block text-[14px] font-bold text-[#111827]">
            검색
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} className="mt-1 h-10 w-full max-w-md rounded-md border border-[#D1D5DB] px-3 font-normal" />
          </label>
          <div className="mt-4 overflow-x-auto rounded-md border border-[#D1D5DB] bg-white">
            <table className="hidden w-full border-collapse text-left text-[15px] md:table">
              <caption className="sr-only">신청 목록</caption>
              <thead className="bg-[#0B3A6E] text-white">
                <tr>
                  {["접수일", "이름", "구분", "상태", "메모"].map((header) => <th key={header} scope="col" className="px-3 py-2 font-semibold">{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item) => (
                  <tr key={item.id} className="border-b border-[#D1D5DB]">
                    <td className="px-3 py-3">{item.createdAt.slice(0, 10)}</td>
                    <td className="px-3 py-3 font-semibold"><button type="button" className="font-semibold text-[#0B3A6E] underline" onClick={() => openItem(item)}>{maskedName(item)}</button></td>
                    <td className="px-3 py-3">{kindLabel(item)}</td>
                    <td className="px-3 py-3"><span className={`inline-flex rounded-md border px-2 py-0.5 text-[13px] font-bold ${STATUS_BADGE[effectiveStatus(item)] ?? ""}`}>{effectiveStatus(item)}</span></td>
                    <td className="px-3 py-3">{item.overlay?.adminMemo ? "있음" : "없음"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="space-y-3 p-3 md:hidden">
              {pageItems.map((item) => (
                <li key={item.id}>
                  <button type="button" className="w-full rounded-md border border-[#D1D5DB] p-3 text-left" onClick={() => openItem(item)}>
                    <span className="block font-bold">{maskedName(item)}</span>
                    <span className="mt-1 block text-[14px]">{item.createdAt.slice(0, 10)} · {kindLabel(item)} · {effectiveStatus(item)} · 메모 {item.overlay?.adminMemo ? "있음" : "없음"}</span>
                  </button>
                </li>
              ))}
            </ul>
            {pageItems.length === 0 ? <p className="p-4 text-[15px]">신청이 없습니다.</p> : null}
          </div>
          <div className="mt-3 flex items-center gap-3 text-[14px]">
            <button type="button" className="btn-secondary-kcf" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}>이전</button>
            <span>{page + 1} / {pageCount}</span>
            <button type="button" className="btn-secondary-kcf" disabled={page + 1 >= pageCount} onClick={() => setPage((value) => value + 1)}>다음</button>
            <button type="button" className="btn-secondary-kcf" onClick={() => setCsvOpen(true)}>CSV 내보내기</button>
          </div>
          {progress ? <p className="mt-3 text-[14px]">{progress}</p> : null}
        </section>
      ) : null}

      {view === "inbox-audit" ? (
        <section>
          <h1 className="text-navy">작업 기록</h1>
          <div className="mt-4 overflow-x-auto rounded-md border border-[#D1D5DB] bg-white">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead className="bg-[#0B3A6E] text-white">
                <tr>{["시각", "로그인", "동작", "종류", "접수번호"].map((header) => <th key={header} scope="col" className="px-3 py-2">{header}</th>)}</tr>
              </thead>
              <tbody>
                {audit.map((line, index) => (
                  <tr key={`${line.at}-${line.id}-${index}`} className="border-b border-[#D1D5DB]">
                    <td className="px-3 py-2">{line.at.replace("T", " ").slice(0, 19)}</td>
                    <td className="px-3 py-2">{line.login}</td>
                    <td className="px-3 py-2">{AUDIT_LABELS[line.action] ?? line.action}</td>
                    <td className="px-3 py-2">{line.form}</td>
                    <td className="px-3 py-2">{line.id.slice(0, 8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {audit.length === 0 ? <p className="p-4 text-[15px]">기록이 없습니다.</p> : null}
          </div>
        </section>
      ) : null}

      {selected ? (
        <aside role="dialog" aria-modal="true" aria-labelledby="inbox-detail-title" className="fixed inset-y-0 right-0 z-40 w-full max-w-md overflow-y-auto border-l border-[#D1D5DB] bg-white p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 id="inbox-detail-title" className="text-[20px] font-bold text-navy">{rawName(selected) || maskedName(selected)}</h2>
            <button type="button" className="btn-secondary-kcf" onClick={() => setSelectedId("")}>닫기</button>
          </div>
          <p className="mt-2 text-[14px] text-[#374151]">{selected.createdAt} · {selected.id.slice(0, 8)}</p>
          <dl className="mt-4 space-y-2 text-[15px]">
            {Object.entries(selected.plain?.data ?? {}).map(([key, value]) => (
              <div key={key} className="border-b border-[#D1D5DB] py-2">
                <dt className="text-[13px] font-bold text-[#374151]">{labelFor(key)}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-[#111827]">{fieldText(value)}</dd>
              </div>
            ))}
          </dl>
          {selected.record.attachment ? <button type="button" className="btn-secondary-kcf mt-4" disabled={busy} onClick={() => void onDownload()}>첨부 내려받기</button> : null}
          {(selected.form === FORM_NAMES.free || selected.form === FORM_NAMES.pledge) ? (
            <div className="mt-4">
              <button type="button" className="btn-primary-kcf" disabled={busy || selected.plain?.data.consentPublish !== true} onClick={() => void onPublish()}>공개 명단에 게시</button>
              {selected.plain?.data.consentPublish !== true ? <p className="mt-2 text-[14px] text-[#374151]">게시 동의가 있어야 공개 명단에 올릴 수 있습니다.</p> : null}
            </div>
          ) : null}
          <label className="mt-4 block text-[14px] font-bold">
            상태
            <select value={statusValue} onChange={(event) => setStatusValue(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-[#D1D5DB] px-3 font-normal">
              {STATUSES[selected.form].map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="mt-3 block text-[14px] font-bold">
            담당 메모
            <textarea value={memo} onChange={(event) => setMemo(event.target.value)} className="mt-1 min-h-24 w-full rounded-md border border-[#D1D5DB] px-3 py-2 font-normal" />
          </label>
          <label className="mt-3 block text-[14px] font-bold">
            보유기간 만료일
            <input type="date" value={until} onChange={(event) => setUntil(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-[#D1D5DB] px-3 font-normal" />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-primary-kcf" disabled={busy} onClick={() => void onSaveStatus()}>저장</button>
            <button type="button" className="rounded-md border border-[#9A3412] px-4 py-2 text-[14px] font-bold text-[#9A3412]" disabled={busy} onClick={() => setDeleteOpen(true)}>삭제</button>
          </div>
        </aside>
      ) : null}

      {deleteOpen || bulkOpen ? (
        <div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 p-4">
          <div className="w-full max-w-md rounded-md border border-[#D1D5DB] bg-white p-6">
            <h2 id="delete-title" className="text-[18px] font-bold text-[#111827]">{DELETE_CONFIRM}</h2>
            <div className="mt-4 flex gap-2">
              <button type="button" className="rounded-md border border-[#9A3412] px-4 py-2 font-bold text-[#9A3412]" onClick={() => void onDelete(bulkOpen ? expired : selected ? [selected] : [])}>삭제</button>
              <button type="button" className="btn-secondary-kcf" onClick={() => { setDeleteOpen(false); setBulkOpen(false); }}>취소</button>
            </div>
          </div>
        </div>
      ) : null}

      {csvOpen ? (
        <div role="dialog" aria-modal="true" aria-labelledby="csv-title" className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 p-4">
          <div className="w-full max-w-md rounded-md border border-[#D1D5DB] bg-white p-6">
            <h2 id="csv-title" className="text-[18px] font-bold text-navy">CSV 내보내기</h2>
            <label className="mt-3 block text-[14px] font-bold">
              사유
              <input value={csvReason} onChange={(event) => setCsvReason(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-[#D1D5DB] px-3 font-normal" />
            </label>
            <div className="mt-4 flex gap-2">
              <button type="button" className="btn-primary-kcf" onClick={exportCsv}>내보내기</button>
              <button type="button" className="btn-secondary-kcf" onClick={() => setCsvOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
