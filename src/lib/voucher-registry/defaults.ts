import { memberSupportPartners } from "@/data/member-support-partners";
import type { VoucherRegistryEntry } from "./types";

const SEED_AT = "2024-01-01T00:00:00.000Z";

/** 최초 등록 시 사용하는 협약 협회 10곳 (member-support-partners와 동기화) */
export const DEFAULT_VOUCHER_REGISTRY: VoucherRegistryEntry[] = memberSupportPartners.map(
  (p) => ({
    id: p.id,
    kind: "association" as const,
    name: p.name,
    representative: "",
    keywords: p.keywords,
    createdAt: SEED_AT,
  }),
);
