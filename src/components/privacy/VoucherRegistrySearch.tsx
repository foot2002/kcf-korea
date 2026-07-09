import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Search, XCircle } from "lucide-react";

import { fetchVoucherRegistry } from "@/lib/voucher-registry/api";
import { pickBestVoucherMatch, searchVoucherRegistry } from "@/lib/voucher-registry/search";
import {
  VOUCHER_REGISTRY_KIND_LABELS,
  type VoucherRegistryEntry,
} from "@/lib/voucher-registry/types";

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; match: VoucherRegistryEntry; all: VoucherRegistryEntry[] }
  | { status: "not_found" }
  | { status: "error"; message: string };

export function VoucherRegistrySearch({
  onSelectOrganization,
}: {
  onSelectOrganization: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<VoucherRegistryEntry[]>([]);
  const [state, setState] = useState<SearchState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    void fetchVoucherRegistry()
      .then((data) => {
        if (!cancelled) setEntries(data);
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", message: "협약 목록을 불러오지 못했습니다." });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setState({ status: "loading" });
    const matches = searchVoucherRegistry(entries, q);
    const best = pickBestVoucherMatch(matches, q);

    if (best) {
      setState({ status: "found", match: best, all: matches });
      onSelectOrganization(best.name);
    } else {
      setState({ status: "not_found" });
      onSelectOrganization(q);
    }
  }

  return (
    <div className="rounded-2xl border border-trust-blue/20 bg-white p-5 shadow-sm md:p-6">
      <div className="text-[15px] font-bold text-navy">협약 단체, 기업/기관여부 검색</div>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-secondary">
        협약 등록된 협회·기업·공공기관인지 확인합니다. 검색한 기관명이 아래 신청서에
        자동 입력되며, 협약 등록 기관이면 공식 명칭으로 반영됩니다.
      </p>

      <form onSubmit={handleSearch} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (state.status !== "idle") {
                setState({ status: "idle" });
                onSelectOrganization("");
              }
            }}
            placeholder="협회·기업·기관명을 입력하세요"
            className="h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4 text-[14.5px] focus:border-trust-blue focus:outline-none focus:ring-1 focus:ring-trust-blue/30"
          />
        </div>
        <button
          type="submit"
          disabled={!query.trim() || state.status === "loading"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-navy px-5 text-[14px] font-semibold text-white hover:bg-[#071529] disabled:opacity-50"
        >
          {state.status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              검색
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {state.status === "found" && (
        <div className="mt-4 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-privacy-green" />
            <div>
              <div className="text-[15px] font-bold text-[#065F46]">바우처 지원 대상입니다</div>
              <p className="mt-1 text-[14px] text-[#047857]">
                <strong>{state.match.name}</strong>
                <span className="ml-2 rounded-full bg-white/80 px-2 py-0.5 text-[12px] font-semibold text-trust-blue">
                  {VOUCHER_REGISTRY_KIND_LABELS[state.match.kind]}
                </span>
                {state.match.representative ? (
                  <span className="mt-1 block text-[13px] text-[#065F46]/80">
                    대표자: {state.match.representative}
                  </span>
                ) : null}
              </p>
              {state.all.length > 1 && (
                <p className="mt-2 text-[12.5px] text-[#047857]/80">
                  유사 검색 {state.all.length}건 — 첫 번째 결과를 신청서에 반영했습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {state.status === "not_found" && (
        <div className="mt-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#B91C1C]" />
            <div>
              <div className="text-[15px] font-bold text-[#991B1B]">
                협약되지 않은 기관/기업입니다
              </div>
              <p className="mt-1 text-[13.5px] leading-relaxed text-[#B91C1C]/90">
                등록된 협약 기관이 아닙니다. 신청서를 작성하시면 담당자가 협약 가능 여부를
                안내드립니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <p className="mt-3 text-[13px] text-[#B91C1C]">{state.message}</p>
      )}
    </div>
  );
}
