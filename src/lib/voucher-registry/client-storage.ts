import { DEFAULT_VOUCHER_REGISTRY } from "./defaults";
import type { VoucherRegistryEntry, VoucherRegistryInput } from "./types";

const STORAGE_KEY = "kcf-voucher-registry-v1";

function readAll(): VoucherRegistryEntry[] {
  if (typeof window === "undefined") return [...DEFAULT_VOUCHER_REGISTRY];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      writeAll(DEFAULT_VOUCHER_REGISTRY);
      return [...DEFAULT_VOUCHER_REGISTRY];
    }
    const parsed = JSON.parse(raw) as VoucherRegistryEntry[];
    return Array.isArray(parsed) ? parsed : [...DEFAULT_VOUCHER_REGISTRY];
  } catch {
    return [...DEFAULT_VOUCHER_REGISTRY];
  }
}

function writeAll(records: VoucherRegistryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function generateId(): string {
  return `vr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function listVoucherRegistryClient(): VoucherRegistryEntry[] {
  return [...readAll()].sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

export function addVoucherRegistryEntryClient(input: VoucherRegistryInput): VoucherRegistryEntry {
  const records = readAll();
  const now = new Date().toISOString();
  const entry: VoucherRegistryEntry = {
    id: generateId(),
    kind: input.kind,
    name: input.name.trim(),
    representative: input.representative.trim(),
    keywords: input.keywords?.map((k) => k.trim()).filter(Boolean),
    createdAt: now,
    updatedAt: now,
  };
  records.push(entry);
  writeAll(records);
  return entry;
}

export function deleteVoucherRegistryEntryClient(id: string): void {
  const records = readAll().filter((r) => r.id !== id);
  writeAll(records);
}

export function resetVoucherRegistryToDefaultsClient(): void {
  writeAll(DEFAULT_VOUCHER_REGISTRY);
}
