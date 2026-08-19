import { isStaticGitHubPages } from "@/lib/privacy-inquiry/env";

/** 로컬 개발 서버 JSON 저장 */
export function canUseLocalSurePartnerStorage(): boolean {
  return !isStaticGitHubPages;
}

/** GitHub Pages — 브라우저 localStorage */
export function useClientSurePartnerStorage(): boolean {
  return isStaticGitHubPages;
}
