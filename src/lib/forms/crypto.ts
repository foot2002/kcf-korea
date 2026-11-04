export type InboxAttachment = {
  path: string;
  iv: string;
  size: number;
};

export type InboxRecord = {
  v: 1;
  form: string;
  id: string;
  createdAt: string;
  keyId: string;
  wrappedKey: string;
  iv: string;
  ciphertext: string;
  attachment: InboxAttachment | null;
};

export type InboxPublicKeyFile = {
  keyId: string;
  alg: "RSA-OAEP-256";
  jwk: JsonWebKey;
  createdAt: string;
};

const RSA = {
  name: "RSA-OAEP",
  modulusLength: 3072,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
} as const;

export function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }
  return btoa(binary);
}

export function base64ToBytes(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function hex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)].map((item) => item.toString(16).padStart(2, "0")).join("");
}

async function fingerprint(key: CryptoKey) {
  const spki = await crypto.subtle.exportKey("spki", key);
  return hex(await crypto.subtle.digest("SHA-256", spki));
}

export async function generateKeyPair(): Promise<{ publicFile: InboxPublicKeyFile; privateJwk: JsonWebKey }> {
  const pair = await crypto.subtle.generateKey(RSA, true, ["wrapKey", "unwrapKey"]);
  const publicJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  const privateJwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
  delete publicJwk.d;
  delete publicJwk.p;
  delete publicJwk.q;
  delete publicJwk.dp;
  delete publicJwk.dq;
  delete publicJwk.qi;
  publicJwk.key_ops = ["wrapKey"];
  publicJwk.alg = "RSA-OAEP-256";
  const publicFile: InboxPublicKeyFile = {
    keyId: await fingerprint(pair.publicKey),
    alg: "RSA-OAEP-256",
    jwk: publicJwk,
    createdAt: new Date().toISOString(),
  };
  return { publicFile, privateJwk };
}

export function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importPrivateKey(file: File) {
  const jwk = JSON.parse(await file.text()) as JsonWebKey;
  if (!jwk.d || jwk.kty !== "RSA") throw new Error("개인 키 파일이 아닙니다.");
  return crypto.subtle.importKey("jwk", jwk, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["unwrapKey"]);
}

async function importPublicKey(jwk: JsonWebKey) {
  return crypto.subtle.importKey("jwk", jwk, { name: "RSA-OAEP", hash: "SHA-256" }, true, ["wrapKey"]);
}

function copyBytes(bytes: Uint8Array) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy;
}

async function encryptBytes(key: CryptoKey, bytes: Uint8Array) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, copyBytes(bytes));
  return { iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(cipher)) };
}

export async function encryptRecord(input: {
  publicFile: InboxPublicKeyFile;
  form: string;
  plaintext: unknown;
  attachment?: { bytes: Uint8Array; size: number } | null;
}): Promise<{ record: InboxRecord; attachmentBytes: Uint8Array | null }> {
  if (input.publicFile.jwk.d) throw new Error("공개 키 파일에 개인 키가 들어 있습니다.");
  const aes = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
  const publicKey = await importPublicKey(input.publicFile.jwk);
  const wrapped = await crypto.subtle.wrapKey("raw", aes, publicKey, { name: "RSA-OAEP" });
  const body = await encryptBytes(aes, new TextEncoder().encode(JSON.stringify(input.plaintext)));
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  let attachment: InboxAttachment | null = null;
  let attachmentBytes: Uint8Array | null = null;
  if (input.attachment) {
    const file = await encryptBytes(aes, input.attachment.bytes);
    attachment = {
      path: `data/attachments/${id}.bin`,
      iv: file.iv,
      size: input.attachment.size,
    };
    attachmentBytes = base64ToBytes(file.ciphertext);
  }
  return {
    record: {
      v: 1,
      form: input.form,
      id,
      createdAt,
      keyId: input.publicFile.keyId,
      wrappedKey: bytesToBase64(new Uint8Array(wrapped)),
      iv: body.iv,
      ciphertext: body.ciphertext,
      attachment,
    },
    attachmentBytes,
  };
}

async function unwrapAes(record: Pick<InboxRecord, "wrappedKey">, privateKey: CryptoKey) {
  return crypto.subtle.unwrapKey(
    "raw",
    base64ToBytes(record.wrappedKey),
    privateKey,
    { name: "RSA-OAEP" },
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
}

export async function decryptRecord(record: InboxRecord, privateKey: CryptoKey) {
  const aes = await unwrapAes(record, privateKey);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(record.iv) }, aes, base64ToBytes(record.ciphertext));
  return JSON.parse(new TextDecoder().decode(plain)) as unknown;
}

export async function decryptAttachment(bytes: Uint8Array, record: InboxRecord, privateKey: CryptoKey) {
  if (!record.attachment) throw new Error("첨부가 없습니다.");
  const aes = await unwrapAes(record, privateKey);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(record.attachment.iv) },
    aes,
    copyBytes(bytes),
  );
  return new Uint8Array(plain);
}
