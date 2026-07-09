import type { VoucherRegistryEntry } from "./types";

export function searchVoucherRegistry(
  entries: VoucherRegistryEntry[],
  query: string,
): VoucherRegistryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return entries.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.representative.toLowerCase().includes(q) ||
      e.keywords?.some((k) => k.toLowerCase().includes(q)),
  );
}

export function pickBestVoucherMatch(
  matches: VoucherRegistryEntry[],
  query: string,
): VoucherRegistryEntry | null {
  if (matches.length === 0) return null;
  const q = query.trim().toLowerCase();
  const exact = matches.find((m) => m.name.toLowerCase() === q);
  if (exact) return exact;
  return matches[0] ?? null;
}
