import { isStaticGitHubPages } from "@/lib/privacy-inquiry/env";

export function isAssociationGasConfigured(): boolean {
  return Boolean(import.meta.env.VITE_ASSOCIATION_APPLICATION_API_URL?.trim());
}

export function isGithubAssociationStorageConfigured(): boolean {
  return Boolean(import.meta.env.VITE_ASSOCIATION_DATA_GITHUB_TOKEN?.trim());
}

/** (선택) GAS 연동 시 관리자 API 토큰 */
export function getAssociationAdminToken(): string {
  return import.meta.env.VITE_ASSOCIATION_ADMIN_TOKEN?.trim() ?? "";
}

/** 로컬 개발 서버 JSON 저장 */
export function canUseLocalAssociationStorage(): boolean {
  return !isStaticGitHubPages && !isAssociationGasConfigured();
}

/** GitHub Pages — 브라우저 localStorage 저장 (별도 연동 불필요) */
export function useClientAssociationStorage(): boolean {
  return (
    isStaticGitHubPages &&
    !isAssociationGasConfigured() &&
    !isGithubAssociationStorageConfigured()
  );
}

export function useGithubAssociationStorage(): boolean {
  return isStaticGitHubPages && isGithubAssociationStorageConfigured();
}

export function isAssociationStorageReady(): boolean {
  return (
    isAssociationGasConfigured() ||
    useGithubAssociationStorage() ||
    useClientAssociationStorage() ||
    canUseLocalAssociationStorage()
  );
}
