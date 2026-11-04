import { isStaticGitHubPages } from "@/lib/privacy-inquiry/env";

export function isAssociationGasConfigured(): boolean {
  return false;
}

/** 로컬 개발 서버 JSON 저장 */
export function canUseLocalAssociationStorage(): boolean {
  return !isStaticGitHubPages && !isAssociationGasConfigured();
}

/** GitHub Pages — 브라우저 localStorage 저장 (별도 연동 불필요) */
export function useClientAssociationStorage(): boolean {
  return isStaticGitHubPages && !isAssociationGasConfigured();
}

export function isAssociationStorageReady(): boolean {
  return isAssociationGasConfigured() || useClientAssociationStorage() || canUseLocalAssociationStorage();
}
