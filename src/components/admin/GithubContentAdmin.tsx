import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Lock } from "lucide-react";

import type { EducationItem } from "@/data/privacy-program";
import type { Institution } from "@/data/sure-mark";
import { GithubConflictError, readContentFile, verifyContentToken, writeContentFile } from "@/lib/content/github";
import {
  sourceEducation,
  bundledInstitutions,
  bundledNotices,
  bundledPledges,
  bundledPublications,
  bundledStats,
} from "@/lib/content/load";
import { parseEducation, parseInstitutions, parseNotices, parsePledges, parsePublications, parseStats, safeParse } from "@/lib/content/parse";
import {
  CONTENT_FILES,
  type BoardType,
  type ContentName,
  type NoticeItem,
  type PublicationContentItem,
  type StatItem,
} from "@/lib/content/types";

const TOKEN_KEY = "kcf-github-content-token";
const LOGIN_KEY = "kcf-github-content-login";

const TABS: { id: ContentName; label: string }[] = [
  { id: "notices", label: "공지사항" },
  { id: "publications", label: "소식·자료" },
  { id: "education", label: "교육·웨비나" },
  { id: "institutions", label: "실천·우수기관" },
  { id: "pledges", label: "실천선언 참여 기관" },
  { id: "stats", label: "성과 수치" },
];

const BOARD_TYPES: BoardType[] = ["보도자료", "보고서·자료", "관련 보도", "보도참고"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CERT_RE = /^SURE-\d{4}-\d{4}$/;

type FieldErrors = Record<string, string>;

function readSession(key: string) {
  try {
    return sessionStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function validDate(value: string) {
  if (!DATE_RE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function validUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function newCertNo(existing: string[]) {
  const year = new Date().getFullYear();
  const used = new Set(existing);
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const cert = `SURE-${year}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    if (!used.has(cert)) return cert;
  }
  return "";
}

function inputClass(error?: string) {
  return `mt-1 h-10 w-full rounded-md border px-3 text-[15px] font-normal ${error ? "border-[#B91C1C]" : "border-[#D1D5DB]"}`;
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-[14px] font-semibold text-[#111827]">
      {label}
      {children}
      {error ? <span className="mt-1 block font-normal text-[#9A3412]">{error}</span> : null}
    </label>
  );
}

function blankEducation(): EducationItem {
  return {
    slug: `education-${Date.now()}`,
    title: "",
    subtitle: "",
    lawNote: "",
    date: "",
    timeLabel: "",
    year: new Date().getFullYear(),
    topics: [],
    mode: "온라인 웨비나",
    fee: "무료",
    status: "예정",
    host: "개인정보보호진흥원",
    organizers: [],
    cohosts: [],
    applicantsLabel: "",
    participantsLabel: null,
    summary: "",
    capacity: null,
    youtubeId: "",
    sessions: [],
    materials: [],
    highlights: [],
    vendorNotice: "",
    published: false,
    publishAt: "",
  };
}

export function GithubContentAdmin() {
  const [token, setToken] = useState("");
  const [login, setLogin] = useState("");
  const [ready, setReady] = useState(true);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<ContentName>("notices");
  const [sha, setSha] = useState<string | null>(null);
  const [notices, setNotices] = useState<NoticeItem[]>(bundledNotices);
  const [publications, setPublications] = useState<PublicationContentItem[]>(bundledPublications);
  const [education, setEducation] = useState<EducationItem[]>(sourceEducation);
  const [institutions, setInstitutions] = useState<Institution[]>(bundledInstitutions);
  const [pledges, setPledges] = useState(bundledPledges);
  const [stats, setStats] = useState<StatItem[]>(bundledStats);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [commitUrl, setCommitUrl] = useState("");
  const [conflict, setConflict] = useState(false);

  useEffect(() => {
    const saved = readSession(TOKEN_KEY);
    const savedLogin = readSession(LOGIN_KEY);
    if (!saved) return;
    setReady(false);
    void verifyContentToken(saved)
      .then((user) => {
        setToken(saved);
        setLogin(user.login || savedLogin);
        sessionStorage.setItem(LOGIN_KEY, user.login);
      })
      .catch(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(LOGIN_KEY);
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!token) return;
    void loadFile(tab, token).catch((error: unknown) => {
      setMessage(error instanceof Error ? error.message : "파일을 불러오지 못했습니다.");
    });
  }, [tab, token]);

  async function loadFile(name: ContentName, currentToken: string) {
    setConflict(false);
    setMessage("");
    setCommitUrl("");
    const file = await readContentFile(currentToken, CONTENT_FILES[name]);
    setSha(file?.sha ?? null);
    if (!file) return;
    let data: unknown;
    try {
      data = JSON.parse(file.text) as unknown;
    } catch {
      setMessage("JSON 형식을 읽지 못했습니다. 화면의 기본 내용을 유지합니다.");
      return;
    }
    if (name === "notices") setNotices(safeParse(parseNotices, data) ?? bundledNotices);
    if (name === "publications") setPublications(safeParse(parsePublications, data) ?? bundledPublications);
    if (name === "education") setEducation(safeParse(parseEducation, data) ?? sourceEducation);
    if (name === "institutions") setInstitutions(safeParse(parseInstitutions, data) ?? bundledInstitutions);
    if (name === "pledges") setPledges(safeParse(parsePledges, data) ?? bundledPledges);
    if (name === "stats") setStats(safeParse(parseStats, data) ?? bundledStats);
  }

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    const next = input.trim();
    if (!next) {
      setLoginError("토큰을 입력하세요.");
      return;
    }
    setBusy(true);
    setLoginError("");
    try {
      const user = await verifyContentToken(next);
      sessionStorage.setItem(TOKEN_KEY, next);
      sessionStorage.setItem(LOGIN_KEY, user.login);
      setToken(next);
      setLogin(user.login);
      setInput("");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(LOGIN_KEY);
    setToken("");
    setLogin("");
    setSha(null);
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (tab === "notices") {
      notices.forEach((item, index) => {
        if (!item.title.trim()) next[`${index}.title`] = "제목을 입력하세요.";
        if (!validDate(item.date)) next[`${index}.date`] = "날짜는 YYYY-MM-DD 형식이어야 합니다.";
        if (item.link && !item.link.startsWith("/") && !validUrl(item.link)) next[`${index}.link`] = "링크는 /로 시작하거나 http(s) 주소여야 합니다.";
      });
    }
    if (tab === "publications") {
      publications.forEach((item, index) => {
        if (!item.title.trim()) next[`${index}.title`] = "제목을 입력하세요.";
        if (!item.source.trim()) next[`${index}.source`] = "출처를 입력하세요.";
        if (!validDate(item.date)) next[`${index}.date`] = "날짜는 YYYY-MM-DD 형식이어야 합니다.";
        if (!validUrl(item.url)) next[`${index}.url`] = "URL은 http(s) 주소이거나 비워 두세요.";
      });
    }
    if (tab === "education") {
      education.forEach((item, index) => {
        if (!item.title.trim()) next[`${index}.title`] = "교육 제목을 입력하세요.";
        if (!validDate(item.date)) next[`${index}.date`] = "날짜는 YYYY-MM-DD 형식이어야 합니다.";
        item.sessions.forEach((session, sessionIndex) => {
          if (session.startSec != null && (!Number.isInteger(session.startSec) || session.startSec < 0)) {
            next[`${index}.startSec.${sessionIndex}`] = "시작 초는 0 이상의 정수이거나 비워 두세요.";
          }
        });
      });
    }
    if (tab === "institutions") {
      institutions.forEach((item, index) => {
        if (!item.name.trim()) next[`${index}.name`] = "기관명을 입력하세요.";
        if (!CERT_RE.test(item.certNo)) next[`${index}.certNo`] = "인증번호는 SURE-YYYY-NNNN 형식이어야 합니다.";
        if (!validDate(item.selectedAt)) next[`${index}.selectedAt`] = "선정일은 YYYY-MM-DD 형식이어야 합니다.";
        if (!item.reason.trim()) next[`${index}.reason`] = "선정 이유를 입력하세요.";
      });
    }
    if (tab === "pledges") {
      pledges.forEach((item, index) => {
        if (!item.name.trim()) next[`${index}.name`] = "기관명을 입력하세요.";
        if (!validDate(item.date)) next[`${index}.date`] = "선언일은 YYYY-MM-DD 형식이어야 합니다.";
      });
    }
    if (tab === "stats") {
      stats.forEach((item, index) => {
        if (!item.label.trim()) next[`${index}.label`] = "라벨을 입력하세요.";
        if (!item.value.trim()) next[`${index}.value`] = "값을 입력하세요.";
      });
    }
    return next;
  }

  function currentItems() {
    if (tab === "notices") return notices;
    if (tab === "publications") return publications;
    if (tab === "education") return education;
    if (tab === "institutions") return institutions;
    if (tab === "pledges") return pledges;
    return stats;
  }

  async function save() {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setBusy(true);
    setMessage("");
    setCommitUrl("");
    try {
      const text = JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), items: currentItems() }, null, 2);
      const tabLabel = TABS.find((item) => item.id === tab)?.label ?? tab;
      const result = await writeContentFile({
        token,
        fileName: CONTENT_FILES[tab],
        text: `${text}\n`,
        message: `content: ${tabLabel} 수정 (${login})`,
        sha,
      });
      setCommitUrl(result.commitUrl);
      setMessage("저장했습니다. 1~2분 뒤 사이트에 반영됩니다.");
      const latest = await readContentFile(token, CONTENT_FILES[tab]);
      setSha(latest?.sha ?? null);
    } catch (error) {
      if (error instanceof GithubConflictError) {
        setConflict(true);
        setMessage("다른 관리자가 먼저 수정했습니다. 최신 내용을 불러올까요?");
      } else {
        setMessage(error instanceof Error ? error.message : "저장에 실패했습니다.");
      }
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <p className="px-4 py-16 text-center text-[15px] text-[#374151]">확인 중…</p>;

  if (!token) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <form onSubmit={(event) => void onLogin(event)} className="w-full max-w-md rounded-md border border-[#D1D5DB] bg-white p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#0B3A6E] text-white">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-navy">콘텐츠 관리</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[#374151]">
            저장소 kcf-korea 의 Contents 읽기·쓰기 권한이 있는 fine-grained 토큰을 입력하세요.
          </p>
          <Field label="GitHub 토큰" error={loginError}>
            <input
              type="password"
              value={input}
              autoComplete="off"
              onChange={(event) => setInput(event.target.value)}
              className={inputClass(loginError)}
            />
          </Field>
          <button type="submit" disabled={busy} className="btn-primary-kcf mt-4 w-full disabled:opacity-60">
            {busy ? "확인 중…" : "로그인"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-bold text-[#0F766E]">Admin</p>
          <h1 className="text-navy">콘텐츠 관리</h1>
          <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-[#374151]">
            PDF·이미지는 저장소의 public/downloads/ 폴더에 올린 뒤 경로를 입력하세요.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[14px] font-bold text-navy">{login}</p>
          <button type="button" onClick={logout} className="btn-secondary-kcf mt-2">
            로그아웃
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-[#D1D5DB]" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`border-b-2 px-3 py-3 text-[14px] font-semibold ${tab === item.id ? "border-[#0B3A6E] text-[#0B3A6E]" : "border-transparent text-[#374151]"}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {tab === "notices"
          ? notices.map((item, index) => (
              <article key={item.id} className="rounded-md border border-[#D1D5DB] bg-white p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="제목" error={errors[`${index}.title`]}>
                    <input value={item.title} onChange={(event) => setNotices(notices.map((row, rowIndex) => rowIndex === index ? { ...row, title: event.target.value } : row))} className={inputClass(errors[`${index}.title`])} />
                  </Field>
                  <Field label="날짜" error={errors[`${index}.date`]}>
                    <input value={item.date} onChange={(event) => setNotices(notices.map((row, rowIndex) => rowIndex === index ? { ...row, date: event.target.value } : row))} className={inputClass(errors[`${index}.date`])} />
                  </Field>
                  <Field label="링크(선택)" error={errors[`${index}.link`]}>
                    <input value={item.link} onChange={(event) => setNotices(notices.map((row, rowIndex) => rowIndex === index ? { ...row, link: event.target.value } : row))} className={inputClass(errors[`${index}.link`])} />
                  </Field>
                  <label className="flex items-center gap-2 text-[14px] font-semibold text-[#111827]">
                    <input type="checkbox" checked={item.published} onChange={(event) => setNotices(notices.map((row, rowIndex) => rowIndex === index ? { ...row, published: event.target.checked } : row))} />
                    공개
                  </label>
                </div>
                <Field label="본문(선택)">
                  <textarea value={item.body} onChange={(event) => setNotices(notices.map((row, rowIndex) => rowIndex === index ? { ...row, body: event.target.value } : row))} className="mt-1 min-h-24 w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-[15px] font-normal" />
                </Field>
                <button type="button" className="mt-3 text-[14px] font-bold text-[#9A3412] underline" onClick={() => setNotices(notices.filter((_, rowIndex) => rowIndex !== index))}>이 공지 빼기</button>
              </article>
            ))
          : null}

        {tab === "publications"
          ? publications.map((item, index) => (
              <article key={item.slug} className="rounded-md border border-[#D1D5DB] bg-white p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="유형">
                    <select value={item.boardType} onChange={(event) => setPublications(publications.map((row, rowIndex) => rowIndex === index ? { ...row, boardType: event.target.value as BoardType } : row))} className={inputClass()}>
                      {BOARD_TYPES.map((type) => <option key={type}>{type}</option>)}
                    </select>
                  </Field>
                  <Field label="제목" error={errors[`${index}.title`]}>
                    <input value={item.title} onChange={(event) => setPublications(publications.map((row, rowIndex) => rowIndex === index ? { ...row, title: event.target.value } : row))} className={inputClass(errors[`${index}.title`])} />
                  </Field>
                  <Field label="날짜" error={errors[`${index}.date`]}>
                    <input value={item.date} onChange={(event) => setPublications(publications.map((row, rowIndex) => rowIndex === index ? { ...row, date: event.target.value } : row))} className={inputClass(errors[`${index}.date`])} />
                  </Field>
                  <Field label="출처(언론사)" error={errors[`${index}.source`]}>
                    <input value={item.source} onChange={(event) => setPublications(publications.map((row, rowIndex) => rowIndex === index ? { ...row, source: event.target.value } : row))} className={inputClass(errors[`${index}.source`])} />
                  </Field>
                  <Field label="URL" error={errors[`${index}.url`]}>
                    <input value={item.url} onChange={(event) => setPublications(publications.map((row, rowIndex) => rowIndex === index ? { ...row, url: event.target.value } : row))} className={inputClass(errors[`${index}.url`])} />
                  </Field>
                  <Field label="첨부 파일 경로">
                    <input value={item.file} onChange={(event) => setPublications(publications.map((row, rowIndex) => rowIndex === index ? { ...row, file: event.target.value } : row))} className={inputClass()} />
                  </Field>
                  <label className="flex items-center gap-2 text-[14px] font-semibold text-[#111827]">
                    <input type="checkbox" checked={item.published} onChange={(event) => setPublications(publications.map((row, rowIndex) => rowIndex === index ? { ...row, published: event.target.checked } : row))} />
                    공개
                  </label>
                </div>
                <button type="button" className="mt-3 text-[14px] font-bold text-[#9A3412] underline" onClick={() => setPublications(publications.filter((_, rowIndex) => rowIndex !== index))}>이 자료 빼기</button>
              </article>
            ))
          : null}

        {tab === "education"
          ? education.map((item, index) => (
              <article key={item.slug} className="rounded-md border border-[#D1D5DB] bg-white p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="제목" error={errors[`${index}.title`]}>
                    <input value={item.title} onChange={(event) => setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, title: event.target.value } : row))} className={inputClass(errors[`${index}.title`])} />
                  </Field>
                  <Field label="날짜" error={errors[`${index}.date`]}>
                    <input value={item.date} onChange={(event) => setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, date: event.target.value, year: Number(event.target.value.slice(0, 4)) || row.year } : row))} className={inputClass(errors[`${index}.date`])} />
                  </Field>
                  <Field label="시간">
                    <input value={item.timeLabel} onChange={(event) => setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, timeLabel: event.target.value } : row))} className={inputClass()} />
                  </Field>
                  <Field label="전체 youtubeId">
                    <input value={item.youtubeId} onChange={(event) => setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, youtubeId: event.target.value } : row))} className={inputClass()} />
                  </Field>
                  <Field label="신청 표기">
                    <input value={item.applicantsLabel} onChange={(event) => setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, applicantsLabel: event.target.value } : row))} className={inputClass()} />
                  </Field>
                  <Field label="participantsLabel">
                    <input value={item.participantsLabel ?? ""} onChange={(event) => setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, participantsLabel: event.target.value || null } : row))} className={inputClass()} />
                  </Field>
                  <label className="flex items-center gap-2 text-[14px] font-semibold text-[#111827]">
                    <input type="checkbox" checked={item.published} onChange={(event) => setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, published: event.target.checked } : row))} />
                    공개
                  </label>
                </div>
                <Field label="소개">
                  <textarea value={item.summary} onChange={(event) => setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, summary: event.target.value } : row))} className="mt-1 min-h-24 w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-[15px] font-normal" />
                </Field>
                <div className="mt-4 space-y-3">
                  {item.sessions.map((session, sessionIndex) => (
                    <div key={`${item.slug}-${session.no}`} className="grid gap-3 rounded-md border border-[#D1D5DB] p-3 md:grid-cols-3">
                      <p className="text-[14px] font-bold text-navy md:col-span-3">{session.no} {session.title}</p>
                      <Field label="세션 youtubeId">
                        <input value={session.youtubeId} onChange={(event) => setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, sessions: row.sessions.map((current, currentIndex) => currentIndex === sessionIndex ? { ...current, youtubeId: event.target.value } : current) } : row))} className={inputClass()} />
                      </Field>
                      <Field label="startSec" error={errors[`${index}.startSec.${sessionIndex}`]}>
                        <input value={session.startSec ?? ""} onChange={(event) => {
                          const raw = event.target.value.trim();
                          const startSec = raw === "" ? null : Number(raw);
                          setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, sessions: row.sessions.map((current, currentIndex) => currentIndex === sessionIndex ? { ...current, startSec } : current) } : row));
                        }} className={inputClass(errors[`${index}.startSec.${sessionIndex}`])} />
                      </Field>
                    </div>
                  ))}
                  {item.materials.map((material, materialIndex) => (
                    <div key={`${item.slug}-file-${materialIndex}`} className="grid gap-3 rounded-md border border-[#D1D5DB] p-3 md:grid-cols-[auto_1fr_2fr]">
                      <label className="flex items-center gap-2 text-[14px] font-semibold text-[#111827]">
                        <input type="checkbox" checked={material.ready} onChange={(event) => setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, materials: row.materials.map((current, currentIndex) => currentIndex === materialIndex ? { ...current, ready: event.target.checked } : current) } : row))} />
                        ready
                      </label>
                      <Field label="자료 이름">
                        <input value={material.label} onChange={(event) => setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, materials: row.materials.map((current, currentIndex) => currentIndex === materialIndex ? { ...current, label: event.target.value } : current) } : row))} className={inputClass()} />
                      </Field>
                      <Field label="파일 경로">
                        <input value={material.file} onChange={(event) => setEducation(education.map((row, rowIndex) => rowIndex === index ? { ...row, materials: row.materials.map((current, currentIndex) => currentIndex === materialIndex ? { ...current, file: event.target.value } : current) } : row))} className={inputClass()} />
                      </Field>
                    </div>
                  ))}
                </div>
              </article>
            ))
          : null}

        {tab === "institutions"
          ? institutions.map((item, index) => (
              <article key={`${item.certNo}-${index}`} className="rounded-md border border-[#D1D5DB] bg-white p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="기관명" error={errors[`${index}.name`]}>
                    <input value={item.name} onChange={(event) => setInstitutions(institutions.map((row, rowIndex) => rowIndex === index ? { ...row, name: event.target.value } : row))} className={inputClass(errors[`${index}.name`])} />
                  </Field>
                  <Field label="구분">
                    <select value={item.tier} onChange={(event) => setInstitutions(institutions.map((row, rowIndex) => rowIndex === index ? { ...row, tier: event.target.value as Institution["tier"] } : row))} className={inputClass()}>
                      <option>실천기관</option>
                      <option>우수기관</option>
                    </select>
                  </Field>
                  <Field label="인증번호" error={errors[`${index}.certNo`]}>
                    <input value={item.certNo} onChange={(event) => setInstitutions(institutions.map((row, rowIndex) => rowIndex === index ? { ...row, certNo: event.target.value } : row))} className={inputClass(errors[`${index}.certNo`])} />
                  </Field>
                  <div className="flex items-end">
                    <button type="button" className="btn-secondary-kcf" onClick={() => {
                      const cert = newCertNo(institutions.map((row) => row.certNo));
                      if (!cert) return;
                      setInstitutions(institutions.map((row, rowIndex) => rowIndex === index ? { ...row, certNo: cert, certFile: row.certFile || `downloads/certificates/cert-${cert}.pdf` } : row));
                    }}>인증번호 새로 만들기</button>
                  </div>
                  <Field label="선정일" error={errors[`${index}.selectedAt`]}>
                    <input value={item.selectedAt} onChange={(event) => setInstitutions(institutions.map((row, rowIndex) => rowIndex === index ? { ...row, selectedAt: event.target.value } : row))} className={inputClass(errors[`${index}.selectedAt`])} />
                  </Field>
                  <Field label="상태">
                    <select value={item.status} onChange={(event) => setInstitutions(institutions.map((row, rowIndex) => rowIndex === index ? { ...row, status: event.target.value as Institution["status"] } : row))} className={inputClass()}>
                      <option>유효</option>
                      <option>재검토</option>
                      <option>회수</option>
                    </select>
                  </Field>
                  <Field label="인증서 파일 경로">
                    <input value={item.certFile} onChange={(event) => setInstitutions(institutions.map((row, rowIndex) => rowIndex === index ? { ...row, certFile: event.target.value } : row))} className={inputClass()} />
                  </Field>
                  <label className="flex items-center gap-2 text-[14px] font-semibold text-[#111827]">
                    <input type="checkbox" checked={item.published} onChange={(event) => setInstitutions(institutions.map((row, rowIndex) => rowIndex === index ? { ...row, published: event.target.checked } : row))} />
                    공개
                  </label>
                </div>
                <Field label="선정 이유" error={errors[`${index}.reason`]}>
                  <textarea value={item.reason} onChange={(event) => setInstitutions(institutions.map((row, rowIndex) => rowIndex === index ? { ...row, reason: event.target.value } : row))} className="mt-1 min-h-24 w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-[15px] font-normal" />
                </Field>
                <button type="button" className="mt-3 text-[14px] font-bold text-[#9A3412] underline" onClick={() => setInstitutions(institutions.filter((_, rowIndex) => rowIndex !== index))}>이 기관 빼기</button>
              </article>
            ))
          : null}

        {tab === "pledges"
          ? pledges.map((item, index) => (
              <article key={item.id} className="grid gap-3 rounded-md border border-[#D1D5DB] bg-white p-4 md:grid-cols-3">
                <Field label="기관명" error={errors[`${index}.name`]}>
                  <input value={item.name} onChange={(event) => setPledges(pledges.map((row, rowIndex) => rowIndex === index ? { ...row, name: event.target.value } : row))} className={inputClass(errors[`${index}.name`])} />
                </Field>
                <Field label="선언일" error={errors[`${index}.date`]}>
                  <input value={item.date} onChange={(event) => setPledges(pledges.map((row, rowIndex) => rowIndex === index ? { ...row, date: event.target.value } : row))} className={inputClass(errors[`${index}.date`])} />
                </Field>
                <label className="flex items-center gap-2 text-[14px] font-semibold text-[#111827]">
                  <input type="checkbox" checked={item.published} onChange={(event) => setPledges(pledges.map((row, rowIndex) => rowIndex === index ? { ...row, published: event.target.checked } : row))} />
                  공개
                </label>
              </article>
            ))
          : null}

        {tab === "stats"
          ? stats.map((item, index) => (
              <article key={`${item.label}-${index}`} className="grid gap-3 rounded-md border border-[#D1D5DB] bg-white p-4 md:grid-cols-2">
                <Field label="라벨" error={errors[`${index}.label`]}>
                  <input value={item.label} onChange={(event) => setStats(stats.map((row, rowIndex) => rowIndex === index ? { ...row, label: event.target.value } : row))} className={inputClass(errors[`${index}.label`])} />
                </Field>
                <Field label="값" error={errors[`${index}.value`]}>
                  <input value={item.value} onChange={(event) => setStats(stats.map((row, rowIndex) => rowIndex === index ? { ...row, value: event.target.value } : row))} className={inputClass(errors[`${index}.value`])} />
                </Field>
              </article>
            ))
          : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tab === "notices" ? <button type="button" className="btn-secondary-kcf" onClick={() => setNotices([...notices, { id: `notice-${Date.now()}`, title: "", date: "", link: "", body: "", published: true }])}>공지 추가</button> : null}
        {tab === "publications" ? <button type="button" className="btn-secondary-kcf" onClick={() => setPublications([...publications, { slug: `item-${Date.now()}`, boardType: "보도자료", title: "", date: "", source: "", url: "", file: "", summary: "", keywords: [], internalPath: "", published: true }])}>자료 추가</button> : null}
        {tab === "education" ? <button type="button" className="btn-secondary-kcf" onClick={() => setEducation([...education, blankEducation()])}>교육 추가</button> : null}
        {tab === "institutions" ? <button type="button" className="btn-secondary-kcf" onClick={() => setInstitutions([...institutions, { certNo: newCertNo(institutions.map((item) => item.certNo)), name: "", tier: "실천기관", selectedAt: "", status: "유효", reason: "", certFile: "", published: false }])}>기관 추가</button> : null}
        {tab === "pledges" ? <button type="button" className="btn-secondary-kcf" onClick={() => setPledges([...pledges, { id: `pledge-${Date.now()}`, name: "", date: "", published: true }])}>기관 추가</button> : null}
        {tab === "stats" ? <button type="button" className="btn-secondary-kcf" onClick={() => setStats([...stats, { label: "", value: "" }])}>수치 추가</button> : null}
        <button type="button" className="btn-primary-kcf" disabled={busy} onClick={() => void save()}>{busy ? "저장 중…" : "저장"}</button>
      </div>

      {message ? <p className="mt-4 text-[15px] text-[#111827]">{message}</p> : null}
      {commitUrl ? <p className="mt-2"><a className="font-bold text-navy underline" href={commitUrl}>커밋 보기</a></p> : null}
      {conflict ? (
        <button type="button" className="btn-secondary-kcf mt-3" onClick={() => void loadFile(tab, token)}>
          최신 내용 불러오기
        </button>
      ) : null}
    </div>
  );
}
