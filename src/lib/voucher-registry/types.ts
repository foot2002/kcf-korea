export type VoucherRegistryKind = "association" | "enterprise" | "public";

export const VOUCHER_REGISTRY_KIND_LABELS: Record<VoucherRegistryKind, string> = {
  association: "협회",
  enterprise: "기업",
  public: "공공기관",
};

export interface VoucherRegistryEntry {
  id: string;
  kind: VoucherRegistryKind;
  name: string;
  representative: string;
  keywords?: string[];
  createdAt: string;
  updatedAt?: string;
}

export type VoucherRegistryInput = {
  kind: VoucherRegistryKind;
  name: string;
  representative: string;
  keywords?: string[];
};
