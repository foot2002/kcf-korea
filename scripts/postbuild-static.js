import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const clientDir = path.join(root, "dist", "client");
const origin = "https://www.kcf-korea.org";

/** vite.config.ts redirectPages 와 같게 유지한다. */
const redirectPages = new Set([
  "/privacy-center/policy",
  "/privacy-center/policy/secure-tool-use",
  "/privacy-center/policy/joint-guideline",
  "/privacy-center/policy/high-risk-review",
  "/privacy-center/policy/account-lifecycle",
  "/privacy-center/policy/consignment-standard",
  "/privacy-center/policy/continuous-check",
  "/privacy-center/support",
  "/privacy-center/support/apply",
  "/privacy-center/association-apply",
  "/privacy-center/voucher",
  "/privacy-center/sure-certified",
  "/privacy-center/self-check",
]);

if (!fs.existsSync(clientDir)) {
  console.error("dist/client 가 없습니다.");
  process.exit(1);
}

for (const name of fs.readdirSync(publicDir)) {
  fs.cpSync(path.join(publicDir, name), path.join(clientDir, name), { recursive: true, force: true });
}

const notFoundCandidates = [
  path.join(clientDir, "404", "index.html"),
  path.join(clientDir, "404.html"),
];
const notFound = notFoundCandidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
if (notFound && notFound !== path.join(clientDir, "404.html")) {
  fs.copyFileSync(notFound, path.join(clientDir, "404.html"));
}

fs.writeFileSync(
  path.join(clientDir, "robots.txt"),
  ["User-agent: *", "Disallow: /admin", "Sitemap: https://www.kcf-korea.org/sitemap.xml", ""].join("\n"),
);

const pages = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === "index.html") pages.push(full);
  }
}
walk(clientDir);

function toPath(file) {
  const rel = path.relative(clientDir, file).replaceAll("\\", "/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"/index.html".length)}`;
  return null;
}

function include(pathname) {
  if (!pathname || pathname === "/404" || pathname.startsWith("/admin")) return false;
  if (redirectPages.has(pathname)) return false;
  if (pathname.startsWith("/downloads") || pathname.startsWith("/content") || pathname.startsWith("/fonts")) return false;
  return true;
}

const locs = [...new Set(pages.map(toPath).filter(include))].sort((a, b) => a.localeCompare(b));
const body = locs
  .map((pathname) => `  <url><loc>${origin}${pathname === "/" ? "/" : pathname}</loc></url>`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
fs.writeFileSync(path.join(clientDir, "sitemap.xml"), sitemap);

if (process.env.GITHUB_PAGES === "true" && !fs.existsSync(path.join(clientDir, "404.html"))) {
  console.error("404.html 이 없습니다. /404 프리렌더를 확인하세요.");
  process.exit(1);
}

console.log(`정적 파일 복사 완료, sitemap ${locs.length}개, 404.html ${fs.existsSync(path.join(clientDir, "404.html")) ? "있음" : "없음"}`);
