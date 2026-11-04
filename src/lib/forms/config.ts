import type { InboxPublicKeyFile } from "@/lib/forms/crypto";

let cached: InboxPublicKeyFile | null | undefined;

export function inboxRepo() {
  return (import.meta.env.VITE_INBOX_REPO ?? "").trim();
}

export function inboxToken() {
  return (import.meta.env.VITE_INBOX_TOKEN ?? "").trim();
}

export async function loadInboxPublicKey(): Promise<InboxPublicKeyFile | null> {
  if (cached !== undefined) return cached;
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}content/inbox-public-key.json`, { cache: "no-store" });
    if (!response.ok) {
      cached = null;
      return null;
    }
    const data = (await response.json()) as InboxPublicKeyFile;
    if (!data?.keyId || data.alg !== "RSA-OAEP-256" || !data.jwk?.n || data.jwk.d) {
      cached = null;
      return null;
    }
    cached = data;
    return data;
  } catch {
    cached = null;
    return null;
  }
}

export async function isFormsConfigured() {
  if (!inboxRepo() || !inboxToken()) return false;
  return Boolean(await loadInboxPublicKey());
}
