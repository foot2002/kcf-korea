import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Mail, Phone, RefreshCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  fetchContactInquiries,
  removeContactInquiry,
  updateContactInquiryMemo,
  updateContactInquiryStatus,
} from "@/lib/contact-inquiry/api";
import {
  CONTACT_INQUIRY_CATEGORIES,
  CONTACT_INQUIRY_STATUSES,
  type ContactInquiry,
  type ContactInquiryCategory,
  type ContactInquiryStatus,
} from "@/lib/contact-inquiry/types";

const STATUS_COLORS: Record<ContactInquiryStatus, string> = {
  접수완료: "bg-blue-100 text-blue-800",
  검토중: "bg-amber-100 text-amber-800",
  답변완료: "bg-green-100 text-green-800",
};

export function ContactInquiriesPanel() {
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ContactInquiryCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ContactInquiryStatus | "all">("all");
  const [selected, setSelected] = useState<ContactInquiry | null>(null);
  const [memoDraft, setMemoDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchContactInquiries();
      setInquiries(data);
      setSelected((prev) => {
        if (!prev) return data[0] ?? null;
        return data.find((item) => item.id === prev.id) ?? data[0] ?? null;
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return [item.name, item.organization, item.phone, item.email, item.message, item.id]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [inquiries, search, categoryFilter, statusFilter]);

  async function handleStatusChange(id: string, status: ContactInquiryStatus) {
    try {
      await updateContactInquiryStatus(id, status);
      await load();
      toast.success("상태가 변경되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "상태 변경에 실패했습니다.");
    }
  }

  async function handleSaveMemo() {
    if (!selected) return;
    setSaving(true);
    try {
      await updateContactInquiryMemo(selected.id, memoDraft);
      await load();
      toast.success("메모가 저장되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 문의를 삭제할까요?")) return;
    try {
      await removeContactInquiry(id);
      await load();
      toast.success("삭제되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="text-[14px] text-text-secondary">
          Contact Us 페이지에서 접수된 문의입니다. (브라우저 localStorage 저장)
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 소속, 연락처, 문의 내용 검색"
            className="h-11 w-full rounded-xl border border-border pl-10 pr-4 text-[14px]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ContactInquiryCategory | "all")}
          className="h-11 rounded-xl border border-border px-3 text-[14px]"
        >
          <option value="all">전체 유형</option>
          {CONTACT_INQUIRY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ContactInquiryStatus | "all")}
          className="h-11 rounded-xl border border-border px-3 text-[14px]"
        >
          <option value="all">전체 상태</option>
          {CONTACT_INQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-border bg-white">
          <div className="border-b border-border px-4 py-3 text-[13px] font-semibold text-text-muted">
            총 {filtered.length}건
          </div>
          <ul className="max-h-[70vh] divide-y divide-border overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-4 py-8 text-center text-[14px] text-text-muted">
                접수된 문의가 없습니다.
              </li>
            )}
            {filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item);
                    setMemoDraft(item.adminMemo ?? "");
                  }}
                  className={`w-full px-4 py-3 text-left transition hover:bg-blue-gray ${
                    selected?.id === item.id ? "bg-soft-sky" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[14px] font-semibold text-navy">{item.name}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${STATUS_COLORS[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-[12.5px] text-trust-blue">{item.category}</div>
                  <div className="mt-1 truncate text-[12px] text-text-muted">{item.organization}</div>
                  <div className="mt-1 text-[11.5px] text-text-muted">
                    {new Date(item.createdAt).toLocaleString("ko-KR")}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="min-h-[420px] rounded-2xl border border-border bg-white p-6 md:p-8">
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
                    {selected.category}
                  </div>
                  <h2 className="mt-1 text-[22px] font-bold text-navy">{selected.name}</h2>
                  <div className="mt-1 text-[13px] text-text-muted">{selected.id}</div>
                  <div className="mt-1 text-[13px] text-text-muted">
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
                <InfoCard label="소속" value={selected.organization} />
                <InfoCard label="연락처" value={selected.phone} icon={Phone} />
                {selected.email && (
                  <InfoCard label="이메일" value={selected.email} icon={Mail} className="sm:col-span-2" />
                )}
              </dl>

              <div className="mt-6">
                <div className="text-[13px] font-semibold text-navy">문의 내용</div>
                <div className="mt-2 whitespace-pre-wrap rounded-xl border border-border bg-section-bg p-4 text-[14.5px] leading-relaxed">
                  {selected.message}
                </div>
              </div>

              <div className="mt-6">
                <div className="text-[13px] font-semibold text-navy">처리 상태</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CONTACT_INQUIRY_STATUSES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => void handleStatusChange(selected.id, status)}
                      className={[
                        "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold",
                        selected.status === status
                          ? "border-trust-blue bg-trust-blue text-white"
                          : "border-border text-text-secondary hover:border-trust-blue/30",
                      ].join(" ")}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="text-[13px] font-semibold text-navy">관리자 메모</div>
                <textarea
                  value={memoDraft}
                  onChange={(e) => setMemoDraft(e.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-[14px]"
                  placeholder="내부 메모"
                />
                <button
                  type="button"
                  onClick={() => void handleSaveMemo()}
                  disabled={saving}
                  className="btn-secondary-kcf mt-2 !py-2 !px-4 text-[13px]"
                >
                  {saving ? "저장 중…" : "메모 저장"}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon: Icon,
  className = "",
}: {
  label: string;
  value: string;
  icon?: typeof Phone;
  className?: string;
}) {
  return (
    <div className={`kcf-stat-card !p-4 ${className}`}>
      <dt className="kcf-stat-label">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </dt>
      <dd className="kcf-stat-value break-all">{value}</dd>
    </div>
  );
}
