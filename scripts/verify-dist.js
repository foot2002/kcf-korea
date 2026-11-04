import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const clientDir = path.join(root, "dist", "client");
const distDir = path.join(root, "dist");

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function relPosix(from, file) {
  return path.relative(from, file).replaceAll("\\", "/");
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function startsWith(buf, bytes) {
  if (buf.length < bytes.length) return false;
  return bytes.every((byte, index) => buf[index] === byte);
}

function countReplacement(buf) {
  let count = 0;
  for (let i = 0; i < buf.length - 2; i += 1) {
    if (buf[i] === 0xef && buf[i + 1] === 0xbf && buf[i + 2] === 0xbd) count += 1;
  }
  return count;
}

if (!fs.existsSync(clientDir)) {
  console.error("dist/client 가 없습니다.");
  process.exit(1);
}

const publicFiles = walk(publicDir);
const mismatches = [];
const missing = [];
for (const file of publicFiles) {
  const rel = relPosix(publicDir, file);
  const dest = path.join(clientDir, rel);
  if (!fs.existsSync(dest) || !fs.statSync(dest).isFile()) {
    missing.push(rel);
    continue;
  }
  if (sha256(file) !== sha256(dest)) mismatches.push(rel);
}

const magicErrors = [];
const replacementErrors = [];
const downloadRoot = path.join(clientDir, "downloads");
for (const file of walk(downloadRoot)) {
  const rel = relPosix(clientDir, file);
  const buf = fs.readFileSync(file);
  const ext = path.extname(file).toLowerCase();
  if (ext === ".pdf" && buf.subarray(0, 5).toString("latin1") !== "%PDF-") magicErrors.push(rel);
  else if (ext === ".png" && !startsWith(buf, [0x89, 0x50, 0x4e, 0x47])) magicErrors.push(rel);
  else if ((ext === ".jpg" || ext === ".jpeg") && !startsWith(buf, [0xff, 0xd8])) magicErrors.push(rel);
  else if (ext === ".docx" && !startsWith(buf, [0x50, 0x4b])) magicErrors.push(rel);
  const replacements = countReplacement(buf);
  if (replacements > 8) replacementErrors.push(`${rel} (${replacements})`);
}

const contentAllow = ["cs@kcf-korea.org", "02-501-2906"];
const contentEmail = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const contentMobile = /(?<!\d)01[016789]-?\d{3,4}-?\d{4}(?!\d)/g;
const contentPhone = /(?<!\d)0\d{1,2}-\d{3,4}-\d{4}(?!\d)/g;
const personalHits = [];
const contentDir = path.join(clientDir, "content");
for (const file of walk(contentDir)) {
  if (!file.endsWith(".json")) continue;
  let text = fs.readFileSync(file, "utf8");
  for (const item of contentAllow) text = text.split(item).join("");
  const hits = new Set();
  for (const pattern of [contentEmail, contentMobile, contentPhone]) {
    pattern.lastIndex = 0;
    const found = text.match(pattern);
    if (found) found.forEach((item) => hits.add(item));
  }
  for (const hit of hits) personalHits.push(`${relPosix(clientDir, file)}: ${hit}`);
}

const forbidden = ["wiseon@wiseinc.co.kr", "kcf2026", "github_pat_", "ghp_"];
const forbiddenHits = [];
for (const file of walk(distDir)) {
  const text = fs.readFileSync(file).toString("latin1");
  for (const word of forbidden) {
    if (text.includes(word)) forbiddenHits.push(`${relPosix(distDir, file)}: ${word}`);
  }
}

console.log(`public 파일 ${publicFiles.length}개, 해시 불일치 ${mismatches.length}건, 누락 ${missing.length}건`);
if (mismatches.length) {
  console.log("해시 불일치:");
  for (const item of mismatches) console.log(`- ${item}`);
}
if (missing.length) {
  console.log("dist 누락:");
  for (const item of missing) console.log(`- ${item}`);
}
if (magicErrors.length) {
  console.log("매직 바이트 오류:");
  for (const item of magicErrors) console.log(`- ${item}`);
}
if (replacementErrors.length) {
  console.log("EF BF BD 손상 흔적:");
  for (const item of replacementErrors) console.log(`- ${item}`);
}
if (forbiddenHits.length) {
  console.log("금지 문자열:");
  for (const item of forbiddenHits) console.log(`- ${item}`);
}
if (personalHits.length) {
  console.log("공개 콘텐츠 개인정보 형식:");
  for (const item of personalHits) console.log(`- ${item}`);
}

const privateKeyHits = [];
const repoWriteHits = [];
for (const file of walk(distDir)) {
  if (!/\.(js|html|css|json)$/i.test(file)) continue;
  const rel = relPosix(distDir, file);
  const text = fs.readFileSync(file, "utf8");
  if (text.includes("PRIVATE KEY") || (/"kty"\s*:\s*"RSA"/.test(text) && /"d"\s*:/.test(text))) {
    privateKeyHits.push(rel);
  }
  const adminChunk = /(^|\/)admin[-.]/i.test(rel);
  if (!adminChunk && /foot2002\/kcf-korea(?!-)/.test(text) && /"PUT"/.test(text)) {
    repoWriteHits.push(rel);
  }
}
if (privateKeyHits.length) {
  console.log("개인 키 흔적:");
  for (const item of privateKeyHits) console.log(`- ${item}`);
}
if (repoWriteHits.length) {
  console.log("공개 번들의 사이트 저장소 쓰기:");
  for (const item of repoWriteHits) console.log(`- ${item}`);
}

const links = spawnSync(process.execPath, ["scripts/check-links.js"], { cwd: root, stdio: "inherit" });
const linkFailed = links.status !== 0;

if (mismatches.length || missing.length || magicErrors.length || replacementErrors.length || forbiddenHits.length || personalHits.length || privateKeyHits.length || repoWriteHits.length || linkFailed) {
  process.exit(1);
}

console.log("verify:dist 통과");
