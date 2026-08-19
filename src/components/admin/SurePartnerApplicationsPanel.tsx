import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PcCard, PcMetricCard } from "@/components/privacy/privacy-ui";
import {
  fetchSurePartnerApplications,
  removeSurePartnerApplication,
  updateSurePartnerApplicationMemo,
  updateSurePartnerApplicationStatus,
} from "@/lib/sure-partner-apply/api";
import {
  SURE_PARTNER_APPLY_STATUSES,
  type SurePartnerApplication,
  type SurePartnerApplyStatus,
} from "@/lib/sure-partner-apply/types";

const STATUS_COLORS: Record<SurePartnerApplyStatus, string> = {
  접수완료: "bg-blue-100 text-blue-800",
  검토중: "bg-amber-100 text-amber-800",
  연락완료: "bg-teal-100 text-teal-800",
  승인: "bg-green-100 text-green-800",
  보류: "bg-gray-100 text-gray-700",
};

export function SurePartnerApplicationsPanel({
  adminKey,
  parentAuthed = false,
}: {
  adminKey?: string;
  parentAuthed?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<SurePartnerApplication[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SurePartnerApplyStatus | "all">("all");
  const [selected, setSelected] = useState<SurePartnerApplication | null>(null);
  const [memoDraft, setMemoDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const authToken = adminKey ?? "";

  const load = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const data = await fetchSurePartnerApplications(authToken);
      setApplications(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (parentAuthed && authToken) void load();
  }, [load, parentAuthed, authToken]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (!q) return true;
      return [
        app.companyName,
        app.managerName,
        app.phone,
        app.email,
        app.serviceName,
        app.strengths,
        app.id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [applications, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: applications.length,
      received: applications.filter((a) => a.status === "접수완료").length,
      reviewing: applications.filter((a) => a.status === "검토중").length,
      approved: applications.filter((a) => a.status === "승인").length,
    }),
    [applications],
  );

  function openDetail(app: SurePartnerApplication) {
    setSelected(app);
    setMemoDraft(app.adminMemo ?? "");
  }

  async function handleStatusChange(id: string, status: SurePartnerApplyStatus) {
    setSaving(true);
    try {
      await updateSurePartnerApplicationStatus(id, status, authToken);
      setApplications((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a,
        ),
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
      await updateSurePartnerApplicationMemo(selected.id, memoDraft, authToken);
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
      toast.error(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 신청을 삭제할까요?")) return;
    try {
      await removeSurePartnerApplication(id, authToken);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      setSelected((prev) => (prev?.id === id ? null : prev));
      toast.success("삭제되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PcMetricCard label="전체 신청" value={`${stats.total}건`} icon={FileText} />
        <PcMetricCard label="접수완료" value={`${stats.received}건`} icon={Clock} accent="blue" />
        <PcMetricCard label="검토중" value={`${stats.reviewing}건`} icon={Search} accent="gold" />
        <PcMetricCard
          label="승인"
          value={`${stats.approved}건`}
          icon={CheckCircle2}
          accent="teal"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <p className="text-[14px] text-text-secondary">
          안심인증 기업 페이지의 안심 파트너 심사 신청 내역입니다.
        </p>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="btn-secondary-kcf !py-2.5 !px-4 text-[13px]"
        >
          <RefreshCw className={`mr-1.5 inline h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          새로고침
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="기업명, 담당자, 서비스명, 접수번호 검색"
            className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-[14px] focus:border-trust-blue focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as SurePartnerApplyStatus | "all")}
          className="h-11 rounded-xl border border-border bg-white px-3 text-[14px]"
        >
          <option value="all">전체 상태</option>
          {SURE_PARTNER_APPLY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white">
        {loading && applications.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-text-muted">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-16 text-center text-[14px] text-text-muted">
            접수된 신청이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[13.5px]">
              <thead className="border-b border-border bg-section-bg text-[12px] font-semibold text-text-muted">
                <tr>
                  <th className="px-4 py-3">접수일</th>
                  <th className="px-4 py-3">접수번호</th>
                  <th className="px-4 py-3">기업명</th>
                  <th className="px-4 py-3">담당자</th>
                  <th className="px-4 py-3">서비스명</th>
                  <th className="px-4 py-3">상태</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-gray/40">
                    <td className="whitespace-nowrap px-4 py-3 text-text-secondary">
                      {new Date(app.createdAt).toLocaleString("ko-KR")}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-navy">{app.id}</td>
                    <td className="px-4 py-3 font-semibold text-navy">{app.companyName}</td>
                    <td className="px-4 py-3">{app.managerName}</td>
                    <td className="max-w-[200px] truncate px-4 py-3">{app.serviceName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${STATUS_COLORS[app.status]}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(app)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[12px] font-semibold text-navy hover:bg-section-bg"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        상세
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-navy">{selected.companyName}</DialogTitle>
              </DialogHeader>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-text-secondary">
                <span className="font-mono text-[12px] text-navy">{selected.id}</span>
                <span>·</span>
                <span>{new Date(selected.createdAt).toLocaleString("ko-KR")}</span>
              </div>

              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                <DetailItem label="담당자" value={selected.managerName} />
                <DetailItem label="연락처" value={selected.phone} />
                <DetailItem label="이메일" value={selected.email || "—"} />
                <DetailItem label="서비스명" value={selected.serviceName} />
              </dl>

              <div className="mt-4">
                <div className="text-[13px] font-semibold text-navy">특징 및 장점</div>
                <PcCard hover={false} className="mt-2 whitespace-pre-wrap p-4 text-[14px] leading-relaxed">
                  {selected.strengths}
                </PcCard>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[13px] font-semibold text-navy">상태</label>
                  <select
                    value={selected.status}
                    disabled={saving}
                    onChange={(e) =>
                      void handleStatusChange(
                        selected.id,
                        e.target.value as SurePartnerApplyStatus,
                      )
                    }
                    className="mt-1.5 h-11 w-full rounded-xl border border-border px-3 text-[14px]"
                  >
                    {SURE_PARTNER_APPLY_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => void handleDelete(selected.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-[12.5px] text-destructive hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    삭제
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-[13px] font-semibold text-navy">관리자 메모</label>
                <textarea
                  value={memoDraft}
                  onChange={(e) => setMemoDraft(e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-[14px]"
                  placeholder="내부 메모를 남겨 주세요."
                />
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleMemoSave()}
                  className="btn-primary-kcf mt-3 !py-2.5 !px-4 text-[13px]"
                >
                  메모 저장
                </button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-section-bg px-4 py-3">
      <dt className="text-[11.5px] font-semibold text-text-muted">{label}</dt>
      <dd className="mt-1 break-all text-[14px] font-medium text-navy">{value}</dd>
    </div>
  );
}
