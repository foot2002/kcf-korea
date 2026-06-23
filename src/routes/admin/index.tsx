import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Download,
  Loader2,
  Lock,
  Mail,
  Paperclip,
  Phone,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { formatBytes } from "@/lib/privacy-inquiry/config";
import { isStaticGitHubPages } from "@/lib/privacy-inquiry/env";
import { formatUserError } from "@/lib/privacy-inquiry/errors";
import type { PrivacyInquiryRecord } from "@/lib/privacy-inquiry/types";
import {
  deletePrivacyInquiry,
  downloadPrivacyAttachment,
  listPrivacyInquiries,
  markPrivacyInquiryRead,
  verifyPrivacyAdmin,
} from "@/lib/privacy-inquiry/actions";

const STORAGE_KEY = "kcf-privacy-admin-key";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "문의 관리 | 개인정보보호진흥원" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<PrivacyInquiryRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(
    async (key: string) => {
      setLoading(true);
      try {
        const data = await listPrivacyInquiries({ data: { adminKey: key } });
        setInquiries(data);
        setSelectedId((prev) => prev ?? data[0]?.id ?? null);
      } catch (err) {
        toast.error(formatUserError(err));
        sessionStorage.removeItem(STORAGE_KEY);
        setAuthed(false);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAdminKey(saved);
      setAuthed(true);
      void load(saved);
    }
  }, [load]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (isStaticGitHubPages) {
      toast.error("GitHub Pages에서는 관리자 기능을 사용할 수 없습니다.");
      return;
    }
    setLoading(true);
    try {
      const result = await verifyPrivacyAdmin({ data: { adminKey: inputKey } });
      if (!result.ok) {
        toast.error("관리자 비밀번호가 올바르지 않습니다.");
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, inputKey);
      setAdminKey(inputKey);
      setAuthed(true);
      await load(inputKey);
    } catch (err) {
      toast.error(formatUserError(err));
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setAdminKey("");
    setInquiries([]);
    setSelectedId(null);
  }

  const selected = inquiries.find((i) => i.id === selectedId) ?? null;

  async function handleMarkRead(id: string) {
    try {
      await markPrivacyInquiryRead({ data: { adminKey, inquiryId: id } });
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "read" } : item)),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "처리에 실패했습니다.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 문의와 첨부파일을 삭제할까요?")) return;
    try {
      await deletePrivacyInquiry({ data: { adminKey, inquiryId: id } });
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      setSelectedId((prev) => (prev === id ? null : prev));
      toast.success("삭제되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
  }

  async function handleDownload(inquiryId: string, attachmentId: string) {
    try {
      const file = await downloadPrivacyAttachment({
        data: { adminKey, inquiryId, attachmentId },
      });
      const bytes = Uint8Array.from(atob(file.dataBase64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: file.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "다운로드에 실패했습니다.");
    }
  }

  if (!authed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-lg"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-navy">개인정보보호 문의 관리</h1>
          <p className="mt-2 text-[14px] text-text-secondary">
            관리자 비밀번호를 입력하세요.
          </p>
          {isStaticGitHubPages && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13.5px] leading-relaxed text-amber-950">
              <p className="font-semibold">GitHub Pages에서는 관리자 페이지를 사용할 수 없습니다.</p>
              <p className="mt-1.5 text-amber-900/90">
                문의 저장·비밀번호 확인은 서버가 필요합니다. 로컬에서{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 text-[12px]">npm run dev</code>{" "}
                실행 후{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 text-[12px]">
                  http://localhost:8080/admin
                </code>
                에 접속하거나, Cloudflare·Vercel 등 서버 호스팅에 배포해 주세요.
              </p>
            </div>
          )}
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="관리자 비밀번호"
            className="mt-6 w-full rounded-xl border border-border px-4 py-3 text-[15px] focus:border-trust-blue focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading || isStaticGitHubPages}
            className="btn-primary-kcf mt-4 w-full disabled:opacity-60"
          >
            {loading ? "확인 중…" : "로그인"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label-eyebrow">Admin</div>
          <h1 className="text-navy">개인정보보호 문의함</h1>
          <p className="mt-2 text-[14px] text-text-secondary">
            DB 없이 서버 로컬 <code className="text-[12px]">data/privacy-inquiries/</code>에
            저장된 문의입니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void load(adminKey)}
            disabled={loading}
            className="btn-secondary-kcf !py-2.5 !px-4 text-[13px]"
          >
            <RefreshCw className={`mr-1.5 inline h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </button>
          <button type="button" onClick={logout} className="btn-secondary-kcf !py-2.5 !px-4 text-[13px]">
            로그아웃
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-border bg-white">
          <div className="border-b border-border px-4 py-3 text-[13px] font-semibold text-text-muted">
            총 {inquiries.length}건 · 신규 {inquiries.filter((i) => i.status === "new").length}건
          </div>
          <ul className="max-h-[70vh] overflow-y-auto divide-y divide-border">
            {inquiries.length === 0 && (
              <li className="px-4 py-8 text-center text-[14px] text-text-muted">
                접수된 문의가 없습니다.
              </li>
            )}
            {inquiries.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id);
                    if (item.status === "new") void handleMarkRead(item.id);
                  }}
                  className={`w-full px-4 py-3 text-left transition hover:bg-blue-gray ${
                    selectedId === item.id ? "bg-soft-sky" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.status === "new" && (
                      <span className="h-2 w-2 rounded-full bg-trust-blue" />
                    )}
                    <span className="truncate text-[14px] font-semibold text-navy">
                      {item.name}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-[12.5px] text-text-muted">{item.type}</div>
                  <div className="mt-1 text-[11.5px] text-text-muted">
                    {new Date(item.createdAt).toLocaleString("ko-KR")}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="rounded-2xl border border-border bg-white p-6 md:p-8 min-h-[420px]">
          {loading && inquiries.length === 0 ? (
            <div className="flex h-full items-center justify-center text-text-muted">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !selected ? (
            <div className="flex h-full items-center justify-center text-[14px] text-text-muted">
              왼쪽에서 문의를 선택하세요.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-wider text-trust-blue">
                    {selected.type}
                  </div>
                  <h2 className="mt-1 text-[22px] font-bold text-navy">{selected.name}</h2>
                  <div className="mt-2 text-[13px] text-text-muted">
                    {new Date(selected.createdAt).toLocaleString("ko-KR")}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(selected.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-[12.5px] text-destructive hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  삭제
                </button>
              </div>

              <dl className="mt-6 grid gap-3 sm:grid-cols-2 text-[14px]">
                <div className="kcf-stat-card !p-4">
                  <dt className="kcf-stat-label">
                    <Mail className="h-3.5 w-3.5" /> 이메일
                  </dt>
                  <dd className="kcf-stat-value break-all">{selected.email}</dd>
                </div>
                {selected.phone && (
                  <div className="kcf-stat-card !p-4">
                    <dt className="kcf-stat-label">
                      <Phone className="h-3.5 w-3.5" /> 연락처
                    </dt>
                    <dd className="kcf-stat-value">{selected.phone}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6">
                <div className="text-[13px] font-semibold text-navy">문의 내용</div>
                <div className="mt-2 whitespace-pre-wrap rounded-xl border border-border bg-section-bg p-4 text-[14.5px] leading-relaxed text-text-primary">
                  {selected.content}
                </div>
              </div>

              {selected.attachments.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-navy">
                    <Paperclip className="h-4 w-4" />
                    첨부파일 ({selected.attachments.length})
                  </div>
                  <ul className="mt-3 space-y-2">
                    {selected.attachments.map((file) => (
                      <li
                        key={file.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-[14px] font-medium text-navy">
                            {file.originalName}
                          </div>
                          <div className="text-[12px] text-text-muted">
                            {formatBytes(file.size)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleDownload(selected.id, file.id)}
                          className="btn-secondary-kcf shrink-0 !py-2 !px-3 text-[12px]"
                        >
                          <Download className="mr-1 inline h-3.5 w-3.5" />
                          다운로드
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
