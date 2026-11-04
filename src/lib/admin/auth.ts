import { isStaticGitHubPages } from "@/lib/privacy-inquiry/env";

/** GitHub Pages 등 정적 배포에서 클라이언트 로그인에 사용 (빌드 시 주입). 없으면 빈 문자열. */
export function getClientAdminKey(): string {
  return import.meta.env.VITE_PRIVACY_ADMIN_KEY?.trim() ?? "";
}

export async function verifyAdminPassword(adminKey: string): Promise<boolean> {
  const key = adminKey.trim();
  if (!key) return false;

  if (isStaticGitHubPages) {
    const expected = getClientAdminKey();
    if (!expected) return false;
    return key === expected;
  }

  const { verifyPrivacyAdmin } = await import("@/lib/privacy-inquiry/actions");
  const result = await verifyPrivacyAdmin({ data: { adminKey: key } });
  return result.ok;
}
