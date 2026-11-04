import { useMemo, useState, useEffect, type FormEvent, type ReactNode } from "react";
import { Lock } from "lucide-react";

import { ContentDashboard, DeployStatus, FileHistory } from "@/components/admin/content-widgets";
import { MarkdownText } from "@/components/site/MarkdownText";
import type { EducationItem } from "@/data/privacy-program";
import type { Institution } from "@/data/sure-mark";
import { findForbiddenCopy, findPersonalData } from "@/lib/content/guard";
import { fileToBase64, GithubConflictError, readContentAt, readContentFile, uploadRepoFile, verifyContentToken, writeContentFile } from "@/lib/content/github";
import {
  bundledBanner,
  bundledInstitutions,
  bundledMonitor,
  bundledNotices,
  bundledPledges,
  bundledPublications,
  bundledSlides,
  bundledStats,
  sourceEducation,
} from "@/lib/content/load";
import { parseBanner, parseEducation, parseInstitutions, parseMonitor, parseNotices, parsePledges, parsePublications, parseSlides, parseStats, safeParse } from "@/lib/content/parse";
import { romanizeFileName, todayStamp } from "@/lib/content/slug";
import {
  CONTENT_FILES,
  SLIDE_IMAGE_OPTIONS,
  type BannerContent,
  type BannerTone,
  type BoardType,
  type ContentName,
  type ContentSlide,
  type MonitorContent,
  type MonitorStatus,
  type NoticeItem,
  type PublicationContentItem,
  type SlideImageId,
  type StatItem,
} from "@/lib/content/types";

const TOKEN_KEY = "kcf-github-content-token";
const LOGIN_KEY = "kcf-github-content-login";

type AdminView = "dashboard" | ContentName;

const MENU: { id: AdminView; label: string }[] = [
  { id: "dashboard", label: "대시보드" },
  { id: "notices", label: "공지사항" },
  { id: "publications", label: "소식·자료" },
  { id: "education", label: "교육·웨비나" },
  { id: "institutions", label: "실천·우수기관" },
  { id: "pledges", label: "실천선언 참여 기관" },
  { id: "monitor", label: "모니터링단 안내" },
  { id: "slides", label: "메인 슬라이드" },
  { id: "banner", label: "띠 공지" },
  { id: "stats", label: "성과 수치" },
];

const MONITOR_STATUSES: MonitorStatus[] = ["모집 예정", "모집 중", "모집 마감"];
const UPLOAD_EXT = new Set(["pdf", "png", "jpg", "jpeg", "gif", "webp"]);

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

function FilePick({ label, accept, onPick }: { label: string; accept: string; onPick: (file: File) => void }) {
  return (
    <label className="mt-2 inline-flex cursor-pointer rounded-md border border-[#D1D5DB] bg-white px-3 py-1.5 text-[13px] font-bold text-[#0B3A6E]">
      {label}
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) onPick(file);
        }}
      />
    </label>
  );
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
  const [tab, setTab] = useState<AdminView>("dashboard");
  const [sha, setSha] = useState<string | null>(null);
  const [notices, setNotices] = useState<NoticeItem[]>(bundledNotices);
  const [publications, setPublications] = useState<PublicationContentItem[]>(bundledPublications);
  const [education, setEducation] = useState<EducationItem[]>(sourceEducation);
  const [institutions, setInstitutions] = useState<Institution[]>(bundledInstitutions);
  const [pledges, setPledges] = useState(bundledPledges);
  const [stats, setStats] = useState<StatItem[]>(bundledStats);
  const [monitor, setMonitor] = useState<MonitorContent>(bundledMonitor);
  const [slides, setSlides] = useState<ContentSlide[]>(bundledSlides);
  const [banner, setBanner] = useState<BannerContent>(bundledBanner);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [commitUrl, setCommitUrl] = useState("");
  const [conflict, setConflict] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

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
    if (!token || tab === "dashboard") return;
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
    if (name === "monitor") setMonitor(safeParse(parseMonitor, data) ?? bundledMonitor);
    if (name === "slides") setSlides(safeParse(parseSlides, data) ?? bundledSlides);
    if (name === "banner") setBanner(safeParse(parseBanner, data) ?? bundledBanner);
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
        if (item.publishAt && !validDate(item.publishAt)) next[`${index}.publishAt`] = "공개 시작일은 YYYY-MM-DD 형식이어야 합니다.";
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
    if (tab === "monitor") {
      if (monitor.noticeLink && !monitor.noticeLink.startsWith("/") && !validUrl(monitor.noticeLink)) {
        next.noticeLink = "링크는 /로 시작하거나 http(s) 주소여야 합니다.";
      }
    }
    if (tab === "banner") {
      if (banner.published && !banner.text.trim()) next.text = "문구를 입력하세요.";
      if (banner.start && !validDate(banner.start)) next.start = "시작일은 YYYY-MM-DD 형식이어야 합니다.";
      if (banner.end && !validDate(banner.end)) next.end = "종료일은 YYYY-MM-DD 형식이어야 합니다.";
      if (banner.link && !banner.link.startsWith("/") && !validUrl(banner.link)) next.link = "링크는 /로 시작하거나 http(s) 주소여야 합니다.";
    }
    if (tab === "slides") {
      slides.forEach((item, index) => {
        if (item.published && !item.title.trim()) next[`${index}.title`] = "공개 슬라이드는 제목이 필요합니다.";
        if (item.buttonLink && !item.buttonLink.startsWith("/") && !validUrl(item.buttonLink) && !item.buttonLink.startsWith("/")) {
          next[`${index}.buttonLink`] = "링크는 /로 시작하거나 http(s) 주소여야 합니다.";
        }
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
    if (tab === "slides") return slides;
    return stats;
  }

  function draftText() {
    const updatedAt = new Date().toISOString();
    if (tab === "monitor") {
      return JSON.stringify(
        { ...monitor, version: 1, updatedAt, benefits: monitor.benefits.map((item) => item.trim()).filter(Boolean) },
        null,
        2,
      );
    }
    if (tab === "banner") return JSON.stringify({ ...banner, version: 1, updatedAt }, null, 2);
    return JSON.stringify({ version: 1, updatedAt, items: currentItems() }, null, 2);
  }

  async function save() {
    if (tab === "dashboard") return;
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const text = `${draftText()}\n`;
    const warnings = [...findPersonalData(text).map((item) => `개인정보 형식: ${item}`), ...findForbiddenCopy(text)];
    if (warnings.length > 0) {
      const proceed = window.confirm(`${warnings.join("\n")}\n\n그래도 저장할까요?`);
      if (!proceed) return;
    }
    setBusy(true);
    setMessage("");
    setCommitUrl("");
    try {
      const tabLabel = MENU.find((item) => item.id === tab)?.label ?? tab;
      const result = await writeContentFile({
        token,
        fileName: CONTENT_FILES[tab],
        text,
        message: `content: ${tabLabel} 수정 (${login})`,
        sha,
      });
      setCommitUrl(result.commitUrl);
      setMessage("저장했습니다. 1~2분 뒤 사이트에 반영됩니다.");
      const latest = await readContentFile(token, CONTENT_FILES[tab]);
      setSha(latest?.sha ?? null);
      setHistoryKey((value) => value + 1);
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

  async function revert(targetSha: string) {
    if (tab === "dashboard") return;
    const tabLabel = MENU.find((item) => item.id === tab)?.label ?? tab;
    if (!window.confirm(`${tabLabel}을 이 버전으로 되돌릴까요? 새 커밋으로 저장됩니다.`)) return;
    setBusy(true);
    setMessage("");
    try {
      const text = await readContentAt(token, CONTENT_FILES[tab], targetSha);
      if (!text) {
        setMessage("그 버전의 파일을 읽지 못했습니다.");
        return;
      }
      const result = await writeContentFile({
        token,
        fileName: CONTENT_FILES[tab],
        text,
        message: `content: ${tabLabel} 되돌리기 (${login})`,
        sha,
      });
      setCommitUrl(result.commitUrl);
      await loadFile(tab, token);
      setHistoryKey((value) => value + 1);
      setMessage("되돌렸습니다. 1~2분 뒤 사이트에 반영됩니다.");
    } catch (error) {
      if (error instanceof GithubConflictError) {
        setConflict(true);
        setMessage("다른 관리자가 먼저 수정했습니다. 최신 내용을 불러올까요?");
      } else {
        setMessage(error instanceof Error ? error.message : "되돌리기에 실패했습니다.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function uploadPublicationFile(index: number, file: File, kind: "file" | "thumbnail") {
    if (file.size > 10 * 1024 * 1024) {
      setMessage("10MB 이하 파일만 올릴 수 있습니다.");
      return;
    }
    const ext = (file.name.split(".").pop() ?? "").toLowerCase();
    if (!UPLOAD_EXT.has(ext)) {
      setMessage("PDF 또는 이미지(png, jpg, gif, webp)만 올릴 수 있습니다.");
      return;
    }
    const item = publications[index];
    const folder = item.boardType === "보고서·자료" ? "reports" : "press";
    const day = validDate(item.date) ? item.date.replaceAll("-", "") : todayStamp();
    const slug = romanizeFileName(file.name);
    const storedExt = ext === "jpeg" ? "jpg" : ext;
    const repoPath = `public/downloads/${folder}/${day}-${slug}.${storedExt}`;
    setBusy(true);
    setMessage("");
    try {
      await uploadRepoFile({
        token,
        path: repoPath,
        base64: await fileToBase64(file),
        message: `content: 자료 파일 업로드 (${login})`,
      });
      const stored = repoPath.replace(/^public\//, "");
      setPublications(publications.map((row, rowIndex) => (rowIndex === index ? { ...row, [kind]: stored } : row)));
      setMessage("파일을 올렸습니다. 경로를 채웠습니다. 글 내용은 저장을 눌러야 반영됩니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "파일 업로드에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  const dashboardRows = useMemo(
    () => [
      { label: "공지사항", count: `${notices.length}건`, path: "public/content/notices.json" },
      { label: "소식·자료", count: `${publications.length}건`, path: "public/content/publications.json" },
      { label: "교육·웨비나", count: `${education.length}건`, path: "public/content/education.json" },
      { label: "실천·우수기관", count: `${institutions.length}건`, path: "public/content/institutions.json" },
      { label: "실천선언 참여 기관", count: `${pledges.length}건`, path: "public/content/pledges.json" },
      { label: "모니터링단 안내", count: monitor.status, path: "public/content/monitor.json" },
      { label: "메인 슬라이드", count: `공개 ${slides.filter((item) => item.published).length}건`, path: "public/content/slides.json" },
      { label: "띠 공지", count: banner.published ? "공개" : "비공개", path: "public/content/banner.json" },
      { label: "성과 수치", count: `${stats.length}건`, path: "public/content/stats.json" },
    ],
    [banner.published, education.length, institutions.length, monitor.status, notices.length, pledges.length, publications.length, slides, stats.length],
  );

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

  function previewBody() {
    if (tab === "notices") {
      return (
        <ul className="space-y-3">
          {notices.filter((item) => item.published).map((item) => (
            <li key={item.id} className="border-b border-[#D1D5DB] pb-3">
              <p className="font-bold text-[#111827]">{item.pinned ? "[고정] " : ""}{item.title || "(제목 없음)"}</p>
              <p className="text-[13px] text-[#374151]">{item.date}{item.publishAt ? ` · 공개 시작 ${item.publishAt}` : ""}</p>
              {item.body ? <div className="mt-2"><MarkdownText source={item.body} /></div> : null}
            </li>
          ))}
        </ul>
      );
    }
    if (tab === "publications") {
      return (
        <ul className="space-y-3">
          {publications.filter((item) => item.published).map((item) => (
            <li key={item.slug} className="flex gap-3 border-b border-[#D1D5DB] pb-3">
              {item.thumbnail ? <img src={`${import.meta.env.BASE_URL}${item.thumbnail}`} alt="" className="h-12 w-12 rounded-md border border-[#D1D5DB] object-cover" /> : null}
              <div>
                <p className="text-[12px] font-bold text-[#0B3A6E]">{item.boardType}</p>
                <p className="font-bold text-[#111827]">{item.title || "(제목 없음)"}</p>
                <p className="text-[13px] text-[#374151]">{item.date} · {item.source}</p>
              </div>
            </li>
          ))}
        </ul>
      );
    }
    if (tab === "banner") {
      const tone = banner.tone === "중요" ? "bg-[#7F1D1D] text-white" : "bg-[#E8EEF6] text-[#0B3A6E]";
      return <p className={`rounded-md px-3 py-2 text-[14px] font-semibold ${tone}`}>{banner.text || "(문구 없음)"}</p>;
    }
    if (tab === "monitor") {
      return (
        <div className="text-[15px] text-[#111827]">
          <p className="font-bold text-[#0B3A6E]">{monitor.status}</p>
          <p className="mt-2">모집 기간 {monitor.recruitPeriod || "선발 공지 때 안내"}</p>
          <p>활동 기간 {monitor.activityPeriod || "선발 공지 때 안내"}</p>
          <p>모집 인원 {monitor.headcount || "선발 공지 때 안내"}</p>
          <p>활동 혜택 {monitor.benefits.length ? monitor.benefits.join(", ") : "선발 공지 때 안내"}</p>
        </div>
      );
    }
    if (tab === "slides") {
      const visible = slides.filter((item) => item.published);
      if (visible.length === 0) return <p className="text-[15px] text-[#374151]">공개 슬라이드가 없으면 사이트의 기본 슬라이드를 씁니다.</p>;
      return (
        <ul className="space-y-3">
          {visible.map((item) => (
            <li key={item.id} className="rounded-md border border-[#D1D5DB] p-3">
              <p className="text-[12px] font-bold text-[#0F766E]">{item.area === "foundation" ? "재단" : "진흥원"} · {item.eyebrow}</p>
              <p className="mt-1 font-bold text-navy">{item.title}</p>
              <p className="mt-1 text-[14px] text-[#374151]">{item.body}</p>
              <p className="mt-2 text-[13px] font-bold text-[#0B3A6E]">{item.buttonLabel || "자세히 보기"}</p>
            </li>
          ))}
        </ul>
      );
    }
    if (tab === "stats") {
      return (
        <ul className="grid gap-2 sm:grid-cols-2">
          {stats.map((item) => (
            <li key={item.label} className="rounded-md border border-[#D1D5DB] p-3">
              <p className="text-[13px] text-[#374151]">{item.label}</p>
              <p className="text-[20px] font-bold text-navy">{item.value}</p>
            </li>
          ))}
        </ul>
      );
    }
    const titles = tab === "education" ? education.map((item) => item.title) : tab === "institutions" ? institutions.map((item) => item.name) : pledges.map((item) => item.name);
    return (
      <ul className="space-y-2">
        {titles.map((title, index) => (
          <li key={`${title}-${index}`} className="border-b border-[#D1D5DB] py-2 text-[15px] font-semibold text-[#111827]">{title || "(이름 없음)"}</li>
        ))}
      </ul>
    );
  }

  const menu = (
    <nav aria-label="관리자 메뉴">
      <p className="px-4 pb-2 pt-4 text-[12px] font-bold text-white">메뉴</p>
      <button type="button" aria-current={tab === "dashboard" ? "page" : undefined} className={`block w-full px-4 py-2.5 text-left text-[14px] font-semibold ${tab === "dashboard" ? "bg-white text-[#0B3A6E]" : "text-white"}`} onClick={() => setTab("dashboard")}>
        대시보드
      </button>
      <p className="px-4 pb-1 pt-4 text-[12px] font-bold text-white">콘텐츠</p>
      {MENU.filter((item) => item.id !== "dashboard").map((item) => (
        <button key={item.id} type="button" aria-current={tab === item.id ? "page" : undefined} className={`block w-full px-4 py-2.5 text-left text-[14px] font-semibold ${tab === item.id ? "bg-white text-[#0B3A6E]" : "text-white"}`} onClick={() => setTab(item.id)}>
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] bg-[#F8FAFC]">
      <aside className="hidden w-60 shrink-0 bg-[#0B3A6E] lg:block">
        <div className="sticky top-[var(--header-height)] max-h-[calc(100vh-var(--header-height))] overflow-y-auto">
          {menu}
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="bg-[#0B3A6E] lg:hidden">{menu}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D1D5DB] bg-white px-6 py-4">
          <p className="text-[14px] text-[#111827]">
            <span className="mr-2 inline-flex rounded-md border border-[#0F766E] px-2 py-0.5 text-[12px] font-bold text-[#0F766E]">연결됨</span>
            {login}
          </p>
          <button type="button" onClick={logout} className="btn-secondary-kcf">
            로그아웃
          </button>
        </div>
        <div className="px-6 py-6">
      {tab === "dashboard" ? <ContentDashboard token={token} rows={dashboardRows} /> : null}
      <div className="space-y-4">
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
                  <Field label="공개 시작일" error={errors[`${index}.publishAt`]}>
                    <input value={item.publishAt ?? ""} onChange={(event) => setNotices(notices.map((row, rowIndex) => rowIndex === index ? { ...row, publishAt: event.target.value } : row))} className={inputClass(errors[`${index}.publishAt`])} placeholder="YYYY-MM-DD" />
                  </Field>
                  <label className="flex items-center gap-2 text-[14px] font-semibold text-[#111827]">
                    <input type="checkbox" checked={item.published} onChange={(event) => setNotices(notices.map((row, rowIndex) => rowIndex === index ? { ...row, published: event.target.checked } : row))} />
                    공개
                  </label>
                  <label className="flex items-center gap-2 text-[14px] font-semibold text-[#111827]">
                    <input type="checkbox" checked={item.pinned === true} onChange={(event) => setNotices(notices.map((row, rowIndex) => rowIndex === index ? { ...row, pinned: event.target.checked } : row))} />
                    상단 고정
                  </label>
                </div>
                <Field label="본문 (굵게 **글**, 목록은 - 로 시작, 링크는 [글](주소))">
                  <textarea value={item.body} onChange={(event) => setNotices(notices.map((row, rowIndex) => rowIndex === index ? { ...row, body: event.target.value } : row))} className="mt-1 min-h-28 w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-[15px] font-normal" />
                </Field>
                {item.body.trim() ? (
                  <div className="mt-3 rounded-md border border-[#D1D5DB] bg-[#F8FAFC] p-3">
                    <p className="mb-2 text-[13px] font-bold text-[#374151]">본문 미리보기</p>
                    <MarkdownText source={item.body} />
                  </div>
                ) : null}
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
                  <div>
                    <Field label="첨부 파일 경로">
                      <input value={item.file} onChange={(event) => setPublications(publications.map((row, rowIndex) => rowIndex === index ? { ...row, file: event.target.value } : row))} className={inputClass()} />
                    </Field>
                    <FilePick label="첨부 파일 선택" accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,application/pdf,image/*" onPick={(file) => void uploadPublicationFile(index, file, "file")} />
                  </div>
                  <div>
                    <Field label="대표 이미지">
                      <input value={item.thumbnail ?? ""} onChange={(event) => setPublications(publications.map((row, rowIndex) => rowIndex === index ? { ...row, thumbnail: event.target.value } : row))} className={inputClass()} />
                    </Field>
                    <FilePick label="대표 이미지 선택" accept=".png,.jpg,.jpeg,.gif,.webp,image/*" onPick={(file) => void uploadPublicationFile(index, file, "thumbnail")} />
                  </div>
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

        {tab === "monitor" ? (
          <article className="rounded-md border border-[#D1D5DB] bg-white p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="모집 상태">
                <select value={monitor.status} onChange={(event) => setMonitor({ ...monitor, status: event.target.value as MonitorStatus })} className={inputClass()}>
                  {MONITOR_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </Field>
              <Field label="모집 인원">
                <input value={monitor.headcount} onChange={(event) => setMonitor({ ...monitor, headcount: event.target.value })} className={inputClass()} />
              </Field>
              <Field label="모집 기간">
                <input value={monitor.recruitPeriod} onChange={(event) => setMonitor({ ...monitor, recruitPeriod: event.target.value })} className={inputClass()} />
              </Field>
              <Field label="활동 기간">
                <input value={monitor.activityPeriod} onChange={(event) => setMonitor({ ...monitor, activityPeriod: event.target.value })} className={inputClass()} />
              </Field>
              <Field label="선발 공지 링크" error={errors.noticeLink}>
                <input value={monitor.noticeLink} onChange={(event) => setMonitor({ ...monitor, noticeLink: event.target.value })} className={inputClass(errors.noticeLink)} />
              </Field>
            </div>
            <Field label="활동 혜택 (한 줄에 하나)">
              <textarea value={monitor.benefits.join("\n")} onChange={(event) => setMonitor({ ...monitor, benefits: event.target.value.split("\n") })} className="mt-1 min-h-28 w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-[15px] font-normal" />
            </Field>
          </article>
        ) : null}

        {tab === "slides"
          ? slides.map((item, index) => (
              <article key={item.id} className="rounded-md border border-[#D1D5DB] bg-white p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="영역">
                    <select value={item.area} onChange={(event) => setSlides(slides.map((row, rowIndex) => rowIndex === index ? { ...row, area: event.target.value as ContentSlide["area"] } : row))} className={inputClass()}>
                      <option value="privacy">진흥원</option>
                      <option value="foundation">재단</option>
                    </select>
                  </Field>
                  <Field label="순서">
                    <input value={item.order} onChange={(event) => setSlides(slides.map((row, rowIndex) => rowIndex === index ? { ...row, order: Number(event.target.value) || 0 } : row))} className={inputClass()} />
                  </Field>
                  <Field label="그림">
                    <select value={item.image} onChange={(event) => setSlides(slides.map((row, rowIndex) => rowIndex === index ? { ...row, image: event.target.value as SlideImageId } : row))} className={inputClass()}>
                      {SLIDE_IMAGE_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                    </select>
                  </Field>
                  <label className="flex items-center gap-2 text-[14px] font-semibold text-[#111827]">
                    <input type="checkbox" checked={item.published} onChange={(event) => setSlides(slides.map((row, rowIndex) => rowIndex === index ? { ...row, published: event.target.checked } : row))} />
                    공개
                  </label>
                  <Field label="eyebrow">
                    <input value={item.eyebrow} onChange={(event) => setSlides(slides.map((row, rowIndex) => rowIndex === index ? { ...row, eyebrow: event.target.value } : row))} className={inputClass()} />
                  </Field>
                  <Field label="제목" error={errors[`${index}.title`]}>
                    <input value={item.title} onChange={(event) => setSlides(slides.map((row, rowIndex) => rowIndex === index ? { ...row, title: event.target.value } : row))} className={inputClass(errors[`${index}.title`])} />
                  </Field>
                  <Field label="버튼 문구">
                    <input value={item.buttonLabel} onChange={(event) => setSlides(slides.map((row, rowIndex) => rowIndex === index ? { ...row, buttonLabel: event.target.value } : row))} className={inputClass()} />
                  </Field>
                  <Field label="버튼 링크" error={errors[`${index}.buttonLink`]}>
                    <input value={item.buttonLink} onChange={(event) => setSlides(slides.map((row, rowIndex) => rowIndex === index ? { ...row, buttonLink: event.target.value } : row))} className={inputClass(errors[`${index}.buttonLink`])} />
                  </Field>
                </div>
                <Field label="본문">
                  <textarea value={item.body} onChange={(event) => setSlides(slides.map((row, rowIndex) => rowIndex === index ? { ...row, body: event.target.value } : row))} className="mt-1 min-h-24 w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-[15px] font-normal" />
                </Field>
                <button type="button" className="mt-3 text-[14px] font-bold text-[#9A3412] underline" onClick={() => setSlides(slides.filter((_, rowIndex) => rowIndex !== index))}>이 슬라이드 빼기</button>
              </article>
            ))
          : null}

        {tab === "banner" ? (
          <article className="rounded-md border border-[#D1D5DB] bg-white p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="문구" error={errors.text}>
                <input value={banner.text} onChange={(event) => setBanner({ ...banner, text: event.target.value })} className={inputClass(errors.text)} />
              </Field>
              <Field label="링크" error={errors.link}>
                <input value={banner.link} onChange={(event) => setBanner({ ...banner, link: event.target.value })} className={inputClass(errors.link)} />
              </Field>
              <Field label="색">
                <select value={banner.tone} onChange={(event) => setBanner({ ...banner, tone: event.target.value as BannerTone })} className={inputClass()}>
                  <option>안내</option>
                  <option>중요</option>
                </select>
              </Field>
              <label className="flex items-center gap-2 text-[14px] font-semibold text-[#111827]">
                <input type="checkbox" checked={banner.published} onChange={(event) => setBanner({ ...banner, published: event.target.checked })} />
                공개
              </label>
              <Field label="노출 시작" error={errors.start}>
                <input value={banner.start} onChange={(event) => setBanner({ ...banner, start: event.target.value })} className={inputClass(errors.start)} placeholder="YYYY-MM-DD" />
              </Field>
              <Field label="노출 종료" error={errors.end}>
                <input value={banner.end} onChange={(event) => setBanner({ ...banner, end: event.target.value })} className={inputClass(errors.end)} placeholder="YYYY-MM-DD" />
              </Field>
            </div>
          </article>
        ) : null}
      </div>

      {tab !== "dashboard" ? (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {tab === "notices" ? <button type="button" className="btn-secondary-kcf" onClick={() => setNotices([...notices, { id: `notice-${Date.now()}`, title: "", date: "", link: "", body: "", published: true, pinned: false, publishAt: "" }])}>공지 추가</button> : null}
            {tab === "publications" ? <button type="button" className="btn-secondary-kcf" onClick={() => setPublications([...publications, { slug: `item-${Date.now()}`, boardType: "보도자료", title: "", date: "", source: "", url: "", file: "", thumbnail: "", summary: "", keywords: [], internalPath: "", published: true }])}>자료 추가</button> : null}
            {tab === "education" ? <button type="button" className="btn-secondary-kcf" onClick={() => setEducation([...education, blankEducation()])}>교육 추가</button> : null}
            {tab === "institutions" ? <button type="button" className="btn-secondary-kcf" onClick={() => setInstitutions([...institutions, { certNo: newCertNo(institutions.map((item) => item.certNo)), name: "", tier: "실천기관", selectedAt: "", status: "유효", reason: "", certFile: "", published: false }])}>기관 추가</button> : null}
            {tab === "pledges" ? <button type="button" className="btn-secondary-kcf" onClick={() => setPledges([...pledges, { id: `pledge-${Date.now()}`, name: "", date: "", published: true }])}>기관 추가</button> : null}
            {tab === "slides" ? <button type="button" className="btn-secondary-kcf" onClick={() => setSlides([...slides, { id: `slide-${Date.now()}`, area: "privacy", order: slides.length + 1, published: false, image: "hero-free-platform", eyebrow: "", title: "", body: "", buttonLabel: "", buttonLink: "" }])}>슬라이드 추가</button> : null}
            {tab === "stats" ? <button type="button" className="btn-secondary-kcf" onClick={() => setStats([...stats, { label: "", value: "" }])}>수치 추가</button> : null}
            <button type="button" className="btn-secondary-kcf" onClick={() => setShowPreview((value) => !value)}>{showPreview ? "미리보기 닫기" : "미리보기"}</button>
            <button type="button" className="btn-primary-kcf" disabled={busy} onClick={() => void save()}>{busy ? "저장 중…" : "저장"}</button>
          </div>
          {showPreview ? (
            <div className="mt-4 rounded-md border border-[#D1D5DB] bg-white p-4">
              <h2 className="text-[16px] font-bold text-navy">공개 화면 미리보기</h2>
              <div className="mt-3">{previewBody()}</div>
            </div>
          ) : null}
          {message ? <p className="mt-4 text-[15px] text-[#111827]">{message}</p> : null}
          {commitUrl ? <p className="mt-2"><a className="font-bold text-navy underline" href={commitUrl}>커밋 보기</a></p> : null}
          <div className="mt-4">
            <DeployStatus token={token} />
          </div>
          {conflict ? (
            <button type="button" className="btn-secondary-kcf mt-3" onClick={() => void loadFile(tab, token)}>
              최신 내용 불러오기
            </button>
          ) : null}
          <div className="mt-6">
            <FileHistory token={token} filePath={`public/content/${CONTENT_FILES[tab]}`} refreshKey={historyKey} onRevert={(target) => void revert(target)} />
          </div>
        </>
      ) : null}
        </div>
      </div>
    </div>
  );
}
