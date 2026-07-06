import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  ExternalLink,
  Eye,
  Loader2,
  Lock,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchAssociationApplications,
  updateAssociationApplicationMemo,
  updateAssociationApplicationStatus,
} from "@/lib/association-application/api";
import {
  getAssociationAdminToken,
  isAssociationGasConfigured,
  canUseLocalAssociationStorage,
  useClientAssociationStorage,
} from "@/lib/association-application/config";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type AssociationApplication,
} from "@/lib/association-application/types";

const STORAGE_KEY = "kcf-association-admin-token";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  접수완료: "bg-blue-100 text-blue-800",
  검토중: "bg-amber-100 text-amber-800",
  연락완료: "bg-teal-100 text-teal-800",
  "협약서 발송": "bg-purple-100 text-purple-800",
  협약완료: "bg-green-100 text-green-800",
  보류: "bg-gray-100 text-gray-700",
};

export function AssociationApplicationsPanel({
  adminKey,
  parentAuthed = false,
}: {
  adminKey?: string;
  parentAuthed?: boolean;
}) {
  const gasMode = isAssociationGasConfigured();
  const clientMode = useClientAssociationStorage();
  const localMode = canUseLocalAssociationStorage();
  const directMode = clientMode || localMode;
  const buildTimeGasToken = getAssociationAdminToken();
  const autoGasAuth = gasMode && parentAuthed && Boolean(buildTimeGasToken);

  const [token, setToken] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<AssociationApplication[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [selected, setSelected] = useState<AssociationApplication | null>(null);
  const [memoDraft, setMemoDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const authToken = gasMode
    ? autoGasAuth
      ? buildTimeGasToken
      : token
    : (adminKey ?? "");

  const load = useCallback(
    async (auth: string) => {
      if (!auth) return;
      setLoading(true);
      try {
        const data = await fetchAssociationApplications(auth);
        setApplications(data);
        setAuthed(true);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "목록을 불러오지 못했습니다.");
        if (gasMode && !autoGasAuth) {
          sessionStorage.removeItem(STORAGE_KEY);
          setAuthed(false);
        }
      } finally {
        setLoading(false);
      }
    },
    [gasMode, autoGasAuth],
  );

  useEffect(() => {
    if (autoGasAuth) {
      void load(buildTimeGasToken);
      return;
    }
    if (gasMode) {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        setToken(saved);
        void load(saved);
      }
      return;
    }
    if (directMode && parentAuthed && adminKey) {
      void load(adminKey);
    }
  }, [load, gasMode, directMode, parentAuthed, adminKey, autoGasAuth, buildTimeGasToken]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!inputToken.trim()) return;
    sessionStorage.setItem(STORAGE_KEY, inputToken.trim());
    setToken(inputToken.trim());
    await load(inputToken.trim());
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setToken("");
    setApplications([]);
    setSelected(null);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (!q) return true;
      return (
        app.associationName.toLowerCase().includes(q) ||
        app.managerName.toLowerCase().includes(q) ||
        app.managerEmail.toLowerCase().includes(q) ||
        app.managerPhone.includes(q)
      );
    });
  }, [applications, search, statusFilter]);

  function openDetail(app: AssociationApplication) {
    setSelected(app);
    setMemoDraft(app.adminMemo ?? "");
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setSaving(true);
    try {
      await updateAssociationApplicationStatus(id, status, authToken);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a)),
      );
      setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
      toast.success("상태가 변경되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "상태 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleMemoSave() {
    if (!selected) return;
    setSaving(true);
    try {
      await updateAssociationApplicationMemo(selected.id, memoDraft, authToken);
      setApplications((prev) =>
        prev.map((a) =>
          a.id === selected.id
            ? { ...a, adminMemo: memoDraft, updatedAt: new Date().toISOString() }
            : a,
        ),
      );
      setSelected((prev) => (prev ? { ...prev, adminMemo: memoDraft } : prev));
      toast.success("메모가 저장되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "메모 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  function downloadCsv() {
    const headers = [
      "접수일",
      "접수번호",
      "협회·단체명",
      "웹사이트",
      "총 회원사 수",
      "담당자명",
      "전화번호",
      "이메일",
      "대표자 성명",
      "사업자등록번호",
      "설립연도",
      "주소",
      "주요 업종·분야",
      "소기업 회원사 수",
      "담당자 직함·부서",
      "선호 연락 방법",
      "문의사항",
      "개인정보 동의",
      "뉴스레터 수신 동의",
      "상태",
      "관리자 메모",
      "수정일시",
    ];
    const rows = filtered.map((a) => [
      new Date(a.createdAt).toLocaleString("ko-KR"),
      a.id,
      a.associationName,
      a.websiteUrl,
      String(a.memberCompanyCount),
      a.managerName,
      a.managerPhone,
      a.managerEmail,
      a.representativeName ?? "",
      a.businessNumber ?? "",
      a.establishedYear ?? "",
      a.address ?? "",
      a.industry ?? "",
      a.smallBusinessMemberCount ?? "",
      a.managerPosition ?? "",
      a.preferredContactMethod ?? "",
      a.message ?? "",
      a.privacyConsent ? "동의" : "미동의",
      a.newsletterConsent ? "동의" : "미동의",
      a.status,
      a.adminMemo ?? "",
      a.updatedAt ? new Date(a.updatedAt).toLocaleString("ko-KR") : "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `association-applications-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (gasMode && !authed && !autoGasAuth) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-lg"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-navy">협단체 협약 신청 관리</h2>
          <p className="mt-2 text-[14px] text-text-secondary">
            Google Apps Script에 설정한 관리자 토큰(ADMIN_TOKEN)을 입력하세요.
          </p>
          <input
            type="password"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            placeholder="관리자 토큰"
            className="mt-6 w-full rounded-xl border border-border px-4 py-3 text-[15px] focus:border-trust-blue focus:outline-none"
            required
          />
          <button type="submit" disabled={loading} className="btn-primary-kcf mt-4 w-full">
            {loading ? "확인 중…" : "접속"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mt-1 text-[14px] text-text-secondary">
            Google Sheet에 저장된 협단체 협약 신청 목록입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void load(authToken)}
            disabled={loading}
            className="btn-secondary-kcf !py-2.5 !px-4 text-[13px]"
          >
            <RefreshCw className={`mr-1.5 inline h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </button>
          <button
            type="button"
            onClick={downloadCsv}
            disabled={filtered.length === 0}
            className="btn-secondary-kcf !py-2.5 !px-4 text-[13px]"
          >
            <Download className="mr-1.5 inline h-4 w-4" />
            CSV 다운로드
          </button>
          {!autoGasAuth && (
            <button
              type="button"
              onClick={logout}
              className="btn-secondary-kcf !py-2.5 !px-4 text-[13px]"
            >
              토큰 삭제
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="협회명, 담당자, 이메일, 전화번호 검색"
            className="w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-[14px] focus:border-trust-blue focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "all")}
          className="rounded-xl border border-border px-4 py-2.5 text-[14px] focus:border-trust-blue focus:outline-none"
        >
          <option value="all">전체 상태</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
        {loading && applications.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-text-muted">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[14px] text-text-muted">
            {applications.length === 0 ? "접수된 신청이 없습니다." : "검색 결과가 없습니다."}
          </div>
        ) : (
          <table className="w-full min-w-[800px] text-left text-[13.5px]">
            <thead className="border-b border-border bg-section-bg text-[12.5px] font-semibold text-text-muted">
              <tr>
                <th className="px-4 py-3">접수일</th>
                <th className="px-4 py-3">협회·단체명</th>
                <th className="px-4 py-3">회원사 수</th>
                <th className="px-4 py-3">담당자</th>
                <th className="px-4 py-3">연락처</th>
                <th className="px-4 py-3">이메일</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-blue-gray/50">
                  <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                    {new Date(app.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy">{app.associationName}</td>
                  <td className="px-4 py-3">{app.memberCompanyCount.toLocaleString()}</td>
                  <td className="px-4 py-3">{app.managerName}</td>
                  <td className="whitespace-nowrap px-4 py-3">{app.managerPhone}</td>
                  <td className="max-w-[160px] truncate px-4 py-3">{app.managerEmail}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${STATUS_COLORS[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openDetail(app)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[12px] hover:bg-section-bg"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-3 text-[12.5px] text-text-muted">
        총 {filtered.length}건 표시 (전체 {applications.length}건)
        {clientMode && (
          <span className="ml-2">
            · 이 브라우저에 저장된 신청 목록입니다. 새로고침으로 최신 내용을 불러옵니다.
          </span>
        )}
      </p>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-navy">{selected.associationName}</DialogTitle>
              </DialogHeader>

              <DetailSection title="기본 정보">
                <DetailRow label="접수번호" value={selected.id} />
                <DetailRow
                  label="접수일시"
                  value={new Date(selected.createdAt).toLocaleString("ko-KR")}
                />
                <DetailRow label="협회·단체명" value={selected.associationName} />
                <DetailRow
                  label="웹사이트"
                  value={
                    <a
                      href={selected.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-trust-blue hover:underline"
                    >
                      {selected.websiteUrl}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  }
                />
                <DetailRow
                  label="총 회원사 수"
                  value={`${selected.memberCompanyCount.toLocaleString()}개`}
                />
                <DetailRow label="담당자명" value={selected.managerName} />
                <DetailRow label="전화번호" value={selected.managerPhone} />
                <DetailRow label="이메일" value={selected.managerEmail} />
              </DetailSection>

              <DetailSection title="추가 협약정보">
                <DetailRow label="대표자 성명" value={selected.representativeName || "(없음)"} />
                <DetailRow label="사업자등록번호" value={selected.businessNumber || "(없음)"} />
                <DetailRow label="설립연도" value={selected.establishedYear || "(없음)"} />
                <DetailRow label="주소" value={selected.address || "(없음)"} multiline />
                <DetailRow label="주요 업종·분야" value={selected.industry || "(없음)"} />
                <DetailRow
                  label="소기업 회원사 수"
                  value={selected.smallBusinessMemberCount || "(없음)"}
                />
                <DetailRow label="담당자 직함·부서" value={selected.managerPosition || "(없음)"} />
                <DetailRow
                  label="선호 연락 방법"
                  value={selected.preferredContactMethod || "(없음)"}
                />
                <DetailRow label="문의사항" value={selected.message || "(없음)"} multiline />
                <DetailRow
                  label="개인정보 동의"
                  value={selected.privacyConsent ? "동의함" : "미동의"}
                />
                <DetailRow
                  label="뉴스레터 수신"
                  value={selected.newsletterConsent ? "동의함" : "미동의"}
                />
              </DetailSection>

              <DetailSection title="처리 정보">
                {selected.updatedAt && (
                  <DetailRow
                    label="수정일시"
                    value={new Date(selected.updatedAt).toLocaleString("ko-KR")}
                  />
                )}
              </DetailSection>

              <div className="mt-5">
                <label className="text-[13px] font-semibold text-navy">처리상태</label>
                <select
                  value={selected.status}
                  onChange={(e) =>
                    void handleStatusChange(selected.id, e.target.value as ApplicationStatus)
                  }
                  disabled={saving}
                  className="mt-1.5 w-full rounded-xl border border-border px-4 py-2.5 text-[14px] focus:border-trust-blue focus:outline-none"
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="text-[13px] font-semibold text-navy">관리자 메모</label>
                <textarea
                  value={memoDraft}
                  onChange={(e) => setMemoDraft(e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-[14px] focus:border-trust-blue focus:outline-none"
                  placeholder="7/8 오전 전화 예정"
                />
                <button
                  type="button"
                  onClick={() => void handleMemoSave()}
                  disabled={saving}
                  className="btn-primary-kcf mt-2 !py-2 !px-4 text-[13px]"
                >
                  {saving ? "저장 중…" : "메모 저장"}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 first:mt-0">
      <h4 className="text-[13px] font-bold text-navy">{title}</h4>
      <dl className="mt-2 space-y-2 text-[14px]">{children}</dl>
    </div>
  );
}

function DetailRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value: React.ReactNode;
  multiline?: boolean;
}) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-2 border-b border-border/60 pb-2">
      <dt className="text-[12.5px] font-semibold text-text-muted">{label}</dt>
      <dd className={`text-text-primary ${multiline ? "whitespace-pre-wrap" : ""}`}>{value}</dd>
    </div>
  );
}
