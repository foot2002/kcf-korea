import {
  addVoucherRegistryEntryClient,
  deleteVoucherRegistryEntryClient,
  listVoucherRegistryClient,
} from "./client-storage";
import type { VoucherRegistryEntry, VoucherRegistryInput } from "./types";

export async function fetchVoucherRegistry(): Promise<VoucherRegistryEntry[]> {
  return listVoucherRegistryClient();
}

export async function createVoucherRegistryEntry(
  input: VoucherRegistryInput,
): Promise<VoucherRegistryEntry> {
  return addVoucherRegistryEntryClient(input);
}

export async function removeVoucherRegistryEntry(id: string): Promise<void> {
  deleteVoucherRegistryEntryClient(id);
}
