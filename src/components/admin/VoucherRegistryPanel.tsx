import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  createVoucherRegistryEntry,
  fetchVoucherRegistry,
  removeVoucherRegistryEntry,
} from "@/lib/voucher-registry/api";
import {
  VOUCHER_REGISTRY_KIND_LABELS,
  type VoucherRegistryEntry,
  type VoucherRegistryKind,
} from "@/lib/voucher-registry/types";

export function VoucherRegistryPanel({ parentAuthed }: { parentAuthed: boolean }) {
  const [entries, setEntries] = useState<VoucherRegistryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [kind, setKind] = useState<VoucherRegistryKind>("association");
  const [name, setName] = useState("");
  const [representative, setRepresentative] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchVoucherRegistry();
      setEntries(data);
    } catch {
      toast.error("협약 기관 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (parentAuthed) void load();
  }, [parentAuthed, load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("기관명을 입력해 주세요.");
      return;
    }
    setSaving(true);
    try {
      await createVoucherRegistryEntry({
        kind,
        name: name.trim(),
        representative: representative.trim(),
      });
      setName("");
      setRepresentative("");
      await load();
      toast.success("등록되었습니다.");
    } catch {
      toast.error("등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, entryName: string) {
    if (!confirm(`「${entryName}」을(를) 삭제할까요?`)) return;
    try {
      await removeVoucherRegistryEntry(id);
      await load();
      toast.success("삭제되었습니다.");
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  }

  if (!parentAuthed) {
    return (
      <p className="text-[14px] text-text-secondary">관리자 로그인 후 이용할 수 있습니다.</p>
    );
  }

  return (
    <div>
      <p className="text-[14px] text-text-secondary">
        바우처 검색에 사용되는 협약 협회·기업·공공기관 목록입니다. 신청 페이지 검색과
        연동됩니다.
      </p>
      <p className="mt-1 text-[12.5px] text-text-muted">
        GitHub Pages 환경에서는 이 브라우저에 저장됩니다. 다른 기기·브라우저와 공유되지
        않습니다.
      </p>

      <form
        onSubmit={handleAdd}
        className="mt-6 rounded-2xl border border-border bg-white p-5 md:p-6"
      >
        <h3 className="text-[15px] font-bold text-navy">협약 기관 등록</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-[13px] font-semibold text-navy">
            유형
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as VoucherRegistryKind)}
              className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-[14px] focus:border-trust-blue focus:outline-none"
            >
              {(Object.keys(VOUCHER_REGISTRY_KIND_LABELS) as VoucherRegistryKind[]).map((k) => (
                <option key={k} value={k}>
                  {VOUCHER_REGISTRY_KIND_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[13px] font-semibold text-navy sm:col-span-2">
            기관명 <span className="text-trust-blue">*</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 한국서비스산업총연합회"
              className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-[14px] focus:border-trust-blue focus:outline-none"
              required
            />
          </label>
          <label className="block text-[13px] font-semibold text-navy">
            대표자
            <input
              value={representative}
              onChange={(e) => setRepresentative(e.target.value)}
              placeholder="예: 홍길동"
              className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-[14px] focus:border-trust-blue focus:outline-none"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary-kcf mt-4 inline-flex items-center gap-2 !py-2.5 !px-4 text-[13px]"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          등록하기
        </button>
      </form>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
        <div className="border-b border-border px-4 py-3 text-[13px] font-semibold text-text-muted">
          등록 목록 {entries.length}건
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
          </div>
        ) : entries.length === 0 ? (
          <p className="py-12 text-center text-[14px] text-text-muted">등록된 기관이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[13.5px]">
              <thead className="border-b border-border bg-section-bg text-[12px] font-semibold text-text-muted">
                <tr>
                  <th className="px-4 py-3">유형</th>
                  <th className="px-4 py-3">기관명</th>
                  <th className="px-4 py-3">대표자</th>
                  <th className="px-4 py-3 w-20">삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-blue-gray/40">
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-soft-sky px-2.5 py-0.5 text-[11.5px] font-semibold text-trust-blue">
                        {VOUCHER_REGISTRY_KIND_LABELS[entry.kind]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">{entry.name}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {entry.representative || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void handleDelete(entry.id, entry.name)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-[12px] text-[#B91C1C] hover:bg-[#FEF2F2]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
