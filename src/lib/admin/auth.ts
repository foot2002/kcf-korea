import { isStaticGitHubPages } from "@/lib/privacy-inquiry/env";
import { verifyPrivacyAdmin } from "@/lib/privacy-inquiry/actions";

/** GitHub Pages 등 정적 배포에서 클라이언트 로그인에 사용 (빌드 시 주입) */
export function getClientAdminKey(): string {
  return (import.meta.env.VITE_PRIVACY_ADMIN_KEY ?? "kcf2026").trim();
}

export async function verifyAdminPassword(adminKey: string): Promise<boolean> {
  const key = adminKey.trim();
  if (!key) return false;

  if (isStaticGitHubPages) {
    return key === getClientAdminKey();
  }

  const result = await verifyPrivacyAdmin({ data: { adminKey: key } });
  return result.ok;
}
