import { useEffect, useState } from "react";

import { latestDeploy, listCommits, type DeployLabel, type RepoCommit } from "@/lib/content/github";
import { CONTENT_REPO } from "@/lib/content/types";

function formatWhen(value: string) {
  if (!value) return "기록 없음";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function tone(label: DeployLabel) {
  if (label === "완료") return "border-[#0F766E] text-[#0F766E]";
  if (label === "실패") return "border-[#9A3412] text-[#9A3412]";
  if (label === "진행 중") return "border-[#0B3A6E] text-[#0B3A6E]";
  return "border-[#D1D5DB] text-[#374151]";
}

export function DeployStatus({ token }: { token: string }) {
  const [label, setLabel] = useState<DeployLabel>("확인 불가");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const run = await latestDeploy(token);
        if (stop) return;
        setLabel(run.label);
        setUrl(run.url);
        setNote(run.name);
      } catch (error) {
        if (stop) return;
        setLabel("확인 불가");
        setNote(error instanceof Error ? error.message : "");
      }
    }
    void load();
    const timer = window.setInterval(() => void load(), 30000);
    return () => {
      stop = true;
      window.clearInterval(timer);
    };
  }, [token]);

  return (
    <p className="flex flex-wrap items-center gap-2 text-[14px] text-[#111827]">
      <span>최근 배포</span>
      <span className={`rounded-md border px-2 py-0.5 text-[13px] font-bold ${tone(label)}`}>{label}</span>
      {note ? <span className="text-[#374151]">{note}</span> : null}
      {url ? (
        <a className="font-bold text-[#0B3A6E] underline" href={url}>
          실행 보기
        </a>
      ) : null}
    </p>
  );
}

export function FileHistory({
  token,
  filePath,
  refreshKey,
  onRevert,
}: {
  token: string;
  filePath: string;
  refreshKey: number;
  onRevert: (sha: string) => void;
}) {
  const [commits, setCommits] = useState<RepoCommit[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let stop = false;
    void listCommits(token, filePath, 10)
      .then((items) => {
        if (!stop) setCommits(items);
      })
      .catch((reason: unknown) => {
        if (!stop) setError(reason instanceof Error ? reason.message : "커밋을 불러오지 못했습니다.");
      });
    return () => {
      stop = true;
    };
  }, [filePath, refreshKey, token]);

  return (
    <section className="rounded-md border border-[#D1D5DB] bg-white p-4">
      <h2 className="text-[16px] font-bold text-navy">최근 수정 10건</h2>
      {error ? <p className="mt-2 text-[14px] text-[#9A3412]">{error}</p> : null}
      {commits.length === 0 && !error ? <p className="mt-2 text-[14px] text-[#374151]">이 파일의 커밋이 없습니다.</p> : null}
      <ul className="mt-3 space-y-2">
        {commits.map((item) => (
          <li key={item.sha} className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D1D5DB] py-2 text-[14px]">
            <span>
              <span className="font-bold text-[#111827]">{item.author || "작성자 없음"}</span>
              <span className="mx-2 text-[#374151]">{formatWhen(item.date)}</span>
              <span className="text-[#111827]">{item.message}</span>
            </span>
            <button type="button" className="btn-secondary-kcf !px-3 !py-1.5 text-[13px]" onClick={() => onRevert(item.sha)}>
              이 버전으로 되돌리기
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ContentDashboard({
  token,
  rows,
}: {
  token: string;
  rows: { label: string; count: string; path: string }[];
}) {
  const [dates, setDates] = useState<Record<string, string>>({});
  const [recent, setRecent] = useState<RepoCommit[]>([]);
  const [error, setError] = useState("");
  const pathKey = rows.map((row) => row.path).join("|");

  useEffect(() => {
    let stop = false;
    const current = rows;
    void (async () => {
      try {
        const [latest, ...perFile] = await Promise.all([
          listCommits(token, null, 5),
          ...current.map((row) => listCommits(token, row.path, 1)),
        ]);
        if (stop) return;
        const next: Record<string, string> = {};
        current.forEach((row, index) => {
          next[row.path] = perFile[index]?.[0]?.date ?? "";
        });
        setDates(next);
        setRecent(latest);
      } catch (reason: unknown) {
        if (!stop) setError(reason instanceof Error ? reason.message : "저장소 기록을 불러오지 못했습니다.");
      }
    })();
    return () => {
      stop = true;
    };
  }, [pathKey, token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-navy">대시보드</h1>
        <p className="mt-2 text-[14px] text-[#374151]">저장소 {CONTENT_REPO} 의 공개 콘텐츠입니다.</p>
      </div>
      <DeployStatus token={token} />
      {error ? <p className="text-[14px] text-[#9A3412]">{error}</p> : null}
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((row) => (
          <li key={row.path} className="rounded-md border border-[#D1D5DB] bg-white p-4">
            <p className="text-[14px] font-bold text-navy">{row.label}</p>
            <p className="mt-2 text-[20px] font-bold text-[#111827]">{row.count}</p>
            <p className="mt-1 text-[13px] text-[#374151]">마지막 수정 {formatWhen(dates[row.path] ?? "")}</p>
          </li>
        ))}
      </ul>
      <section className="rounded-md border border-[#D1D5DB] bg-white p-4">
        <h2 className="text-[16px] font-bold text-navy">최근 커밋 5건</h2>
        <ul className="mt-3 space-y-2">
          {recent.map((item) => (
            <li key={item.sha} className="border-b border-[#D1D5DB] py-2 text-[14px] text-[#111827]">
              <span className="font-bold">{item.author || "작성자 없음"}</span>
              <span className="mx-2 text-[#374151]">{formatWhen(item.date)}</span>
              <a className="underline" href={item.url}>
                {item.message}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
