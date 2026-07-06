import { isStaticGitHubPages } from "@/lib/privacy-inquiry/env";

export function isAssociationGasConfigured(): boolean {
  return Boolean(import.meta.env.VITE_ASSOCIATION_APPLICATION_API_URL?.trim());
}

/** GitHub Pages 관리자가 GAS API 호출 시 사용 (빌드 시 GitHub Secrets로 주입) */
export function getAssociationAdminToken(): string {
  return import.meta.env.VITE_ASSOCIATION_ADMIN_TOKEN?.trim() ?? "";
}

export function canUseAssociationAdminOnStatic(): boolean {
  return isStaticGitHubPages && isAssociationGasConfigured() && Boolean(getAssociationAdminToken());
}
