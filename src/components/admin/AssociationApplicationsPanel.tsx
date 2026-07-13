import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Loader2,
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
import { PcCard, PcMetricCard } from "@/components/privacy/privacy-ui";
import {
  fetchAssociationApplications,
  updateAssociationApplicationMemo,
  updateAssociationApplicationStatus,
} from "@/lib/association-application/api";
import { useClientAssociationStorage } from "@/lib/association-application/config";
import {
  APPLICATION_KIND_LABELS,
  APPLICATION_STATUSES,
  type ApplicationKind,
  type ApplicationStatus,
  type AssociationApplication,
  organizationFieldLabel,
  resolveApplicationKind,
} from "@/lib/association-application/types";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  접수완료: "bg-blue-100 text-blue-800",
  검토중: "bg-amber-100 text-amber-800",
  연락완료: "bg-teal-100 text-teal-800",
  "협약서 발송": "bg-indigo-100 text-indigo-800",
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
  const clientMode = useClientAssociationStorage();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<AssociationApplication[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [kindFilter, setKindFilter] = useState<ApplicationKind | "all">("all");
  const [selected, setSelected] = useState<AssociationApplication | null>(null);
  const [memoDraft, setMemoDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const authToken = adminKey ?? "";

  const load = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const data = await fetchAssociationApplications(authToken);
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
      const kind = resolveApplicationKind(app);
      if (kindFilter !== "all" && kind !== kindFilter) return false;
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (!q) return true;
      return [app.associationName, app.managerName, app.managerEmail, app.managerPhone, app.id]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [applications, search, statusFilter, kindFilter]);

  const stats = useMemo(
    () => ({
      total: applications.length,
      received: applications.filter((a) => a.status === "접수완료").length,
      reviewing: applications.filter((a) => a.status === "검토중").length,
      completed: applications.filter((a) => a.status === "협약완료").length,
    }),
    [applications],
  );

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
      toast.error(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  function downloadCsv() {
    const headers = [
      "접수일", "접수번호", "신청 유형", "기관·기업명", "웹사이트", "회원사 수",
      "담당자명", "연락처", "이메일", "대표자", "사업자번호", "설립연도", "주소", "업종",
      "소기업 회원사 수", "직함·부서", "선호 연락", "문의사항", "뉴스레터", "상태", "관리자 메모",
    ];
    const rows = filtered.map((a) => {
      const kind = resolveApplicationKind(a);
      return [
        new Date(a.createdAt).toLocaleString("ko-KR"), a.id, APPLICATION_KIND_LABELS[kind],
        a.associationName, a.websiteUrl ?? "", a.memberCompanyCount?.toString() ?? "",
        a.managerName, a.managerPhone, a.managerEmail, a.representativeName ?? "",
        a.businessNumber ?? "", a.establishedYear ?? "", a.address ?? "", a.industry ?? "",
        a.smallBusinessMemberCount ?? "", a.managerPosition ?? "", a.preferredContactMethod ?? "",
        a.message ?? "", a.newsletterConsent ? "Y" : "N", a.status, a.adminMemo ?? "",
      ];
    });
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `support-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PcMetricCard label="전체 신청" value={`${stats.total}건`} icon={FileText} />
        <PcMetricCard label="접수완료" value={`${stats.received}건`} icon={Clock} accent="blue" />
        <PcMetricCard label="검토중" value={`${stats.reviewing}건`} icon={Search} accent="gold" />
        <PcMetricCard label="협약완료" value={`${stats.completed}건`} icon={CheckCircle2} accent="teal" />
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <p className="text-[14px] text-text-secondary">협단체·기업·공공기관 지원 신청 목록</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void load()} disabled={loading} className="btn-secondary-kcf !py-2.5 !px-4 text-[13px]">
            <RefreshCw className={`mr-1.5 inline h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </button>
          <button type="button" onClick={downloadCsv} disabled={filtered.length === 0} className="btn-secondary-kcf !py-2.5 !px-4 text-[13px]">
            <Download className="mr-1.5 inline h-4 w-4" />
            CSV 다운로드
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {(["all", "association", "enterprise", "public"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKindFilter(k)}
              className={[
                "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition",
                kindFilter === k ? "bg-[var(--pc-navy)] text-white" : "border border-[var(--pc-border)] bg-white text-text-secondary",
              ].join(" ")}
            >
              {k === "all" ? "전체" : APPLICATION_KIND_LABELS[k]}
            </button>
          ))}
        </div>
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="기관명, 담당자, 이메일, 연락처 검색"
            className="h-11 w-full rounded-xl border border-[var(--pc-border)] py-2.5 pl-10 pr-4 text-[14px] focus:border-trust-blue focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "all")}
          className="h-11 rounded-xl border border-[var(--pc-border)] px-4 text-[14px]"
        >
          <option value="all">전체 상태</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[1.25rem] border border-[var(--pc-border)] bg-white">
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
            <thead className="border-b border-[var(--pc-border)] bg-[var(--pc-soft-blue)]/60 text-[12.5px] font-semibold text-text-muted">
              <tr>
                <th className="px-4 py-3">접수일</th>
                <th className="px-4 py-3">유형</th>
                <th className="px-4 py-3">기관·기업명</th>
                <th className="px-4 py-3">담당자</th>
                <th className="px-4 py-3">연락처</th>
                <th className="px-4 py-3">이메일</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--pc-border)]">
              {filtered.map((app) => {
                const kind = resolveApplicationKind(app);
                return (
                  <tr key={app.id} className="transition hover:bg-[var(--pc-soft-blue)]/30">
                    <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                      {new Date(app.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-soft-sky px-2.5 py-0.5 text-[11.5px] font-semibold text-trust-blue">
                        {APPLICATION_KIND_LABELS[kind]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">{app.associationName}</td>
                    <td className="px-4 py-3">{app.managerName}</td>
                    <td className="whitespace-nowrap px-4 py-3">{app.managerPhone}</td>
                    <td className="max-w-[160px] truncate px-4 py-3">{app.managerEmail}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openDetail(app)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--pc-border)] bg-white px-3 py-1.5 text-[12px] font-semibold hover:bg-[var(--pc-soft-blue)]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        상세보기
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {clientMode && (
        <p className="mt-3 text-[12.5px] text-text-muted">
          브라우저에 저장된 신청 목록입니다. (DB 없이 localStorage 저장)
        </p>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {selected && (() => {
            const kind = resolveApplicationKind(selected);
            const orgLabel = organizationFieldLabel(kind);
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-navy">{selected.associationName}</DialogTitle>
                  <p className="text-[13px] text-text-muted">{selected.id}</p>
                </DialogHeader>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <DetailGroup title="기본 정보">
                    <DetailRow label="신청 유형" value={APPLICATION_KIND_LABELS[kind]} />
                    <DetailRow label="접수일시" value={new Date(selected.createdAt).toLocaleString("ko-KR")} />
                    <DetailRow label={orgLabel} value={selected.associationName} />
                    {selected.websiteUrl && <DetailRow label="웹사이트" value={selected.websiteUrl} />}
                    {selected.memberCompanyCount != null && (
                      <DetailRow label="총 회원사 수" value={`${selected.memberCompanyCount.toLocaleString()}개`} />
                    )}
                  </DetailGroup>

                  <DetailGroup title="담당자 정보">
                    <DetailRow label="담당자명" value={selected.managerName} />
                    <DetailRow label="연락처" value={selected.managerPhone} />
                    <DetailRow label="이메일" value={selected.managerEmail} />
                    {selected.managerPosition && <DetailRow label="직함·부서" value={selected.managerPosition} />}
                    {selected.preferredContactMethod && (
                      <DetailRow label="선호 연락" value={selected.preferredContactMethod} />
                    )}
                  </DetailGroup>

                  <DetailGroup title="추가 협약정보" className="md:col-span-2">
                    {selected.representativeName && <DetailRow label="대표자" value={selected.representativeName} />}
                    {selected.businessNumber && <DetailRow label="사업자번호" value={selected.businessNumber} />}
                    {selected.establishedYear && <DetailRow label="설립연도" value={selected.establishedYear} />}
                    {selected.address && <DetailRow label="주소" value={selected.address} />}
                    {selected.industry && <DetailRow label="업종" value={selected.industry} />}
                    {selected.smallBusinessMemberCount && (
                      <DetailRow label="소기업 회원사 수" value={selected.smallBusinessMemberCount} />
                    )}
                    {selected.newsletterConsent != null && (
                      <DetailRow label="뉴스레터" value={selected.newsletterConsent ? "동의" : "미동의"} />
                    )}
                    {!selected.representativeName && !selected.businessNumber && !selected.address && (
                      <p className="text-[13px] text-text-muted">추가 협약정보 없음</p>
                    )}
                  </DetailGroup>

                  {selected.message && (
                    <PcCard hover={false} className="p-4 md:col-span-2">
                      <div className="text-[13px] font-bold text-navy">문의사항</div>
                      <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-text-secondary">
                        {selected.message}
                      </p>
                    </PcCard>
                  )}

                  <DetailGroup title="처리 정보" className="md:col-span-2">
                    <label className="text-[13px] font-semibold text-navy">처리상태</label>
                    <select
                      value={selected.status}
                      onChange={(e) => void handleStatusChange(selected.id, e.target.value as ApplicationStatus)}
                      disabled={saving}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[var(--pc-border)] px-4 text-[14px]"
                    >
                      {APPLICATION_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <label className="mt-4 block text-[13px] font-semibold text-navy">관리자 메모</label>
                    <textarea
                      value={memoDraft}
                      onChange={(e) => setMemoDraft(e.target.value)}
                      rows={3}
                      className="mt-1.5 w-full rounded-xl border border-[var(--pc-border)] px-4 py-3 text-[14px]"
                    />
                    <button
                      type="button"
                      onClick={() => void handleMemoSave()}
                      disabled={saving}
                      className="btn-primary-kcf mt-3 !py-2 !px-4 text-[13px]"
                    >
                      {saving ? "저장 중…" : "메모 저장"}
                    </button>
                  </DetailGroup>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailGroup({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PcCard hover={false} className={`p-4 ${className}`}>
      <h4 className="text-[13px] font-bold text-navy">{title}</h4>
      <dl className="mt-3 space-y-2">{children}</dl>
    </PcCard>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-2 border-b border-[var(--pc-border)]/60 pb-2 text-[13.5px] last:border-0">
      <dt className="font-semibold text-text-muted">{label}</dt>
      <dd className="break-all text-text-primary">{value}</dd>
    </div>
  );
}
