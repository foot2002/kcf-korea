import fs from "node:fs";
import path from "node:path";

const root = path.resolve("dist/client");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith(".html")) acc.push(full);
  }
  return acc;
}

function exists(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const rel = clean.replace(/^\/+/, "");
  const candidates = [
    path.join(root, rel),
    path.join(root, rel, "index.html"),
    path.join(root, `${rel}.html`),
  ];
  return candidates.some((candidate) => {
    try {
      return fs.existsSync(candidate) && fs.statSync(candidate).isFile();
    } catch {
      return false;
    }
  });
}

function pageFile(htmlFile) {
  const rel = path.relative(root, htmlFile).replaceAll("\\", "/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"/index.html".length)}`;
  return `/${rel}`;
}

const broken = [];
const hrefRe = /<a\b[^>]*\bhref\s*=\s*("([^"]*)"|'([^']*)')/gi;

for (const file of walk(root)) {
  const html = fs.readFileSync(file, "utf8");
  const page = pageFile(file);
  for (const match of html.matchAll(hrefRe)) {
    const href = match[2] ?? match[3] ?? "";
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
    if (/^https?:\/\//i.test(href)) continue;
    const hashIndex = href.indexOf("#");
    const hash = hashIndex >= 0 ? href.slice(hashIndex + 1) : "";
    const pathPart = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
    let targetPage = page;
    if (pathPart && pathPart !== page) {
      const resolved = pathPart.startsWith("/")
        ? pathPart
        : path.posix.normalize(path.posix.join(page.endsWith("/") ? page : path.posix.dirname(page), pathPart));
      if (!exists(resolved || "/")) {
        broken.push({ page, href, reason: "파일 없음" });
        continue;
      }
      targetPage = resolved || "/";
    } else if (pathPart === "" && hash) {
      targetPage = page;
    } else if (pathPart && !exists(pathPart.startsWith("/") ? pathPart : path.posix.normalize(path.posix.join(path.posix.dirname(page), pathPart)))) {
      broken.push({ page, href, reason: "파일 없음" });
      continue;
    }
    if (!hash) continue;
    const targetFile = targetPage === "/" ? path.join(root, "index.html") : path.join(root, targetPage.replace(/^\//, ""), "index.html");
    const alt = path.join(root, `${targetPage.replace(/^\//, "")}.html`);
    const htmlPath = fs.existsSync(targetFile) ? targetFile : alt;
    if (!fs.existsSync(htmlPath)) {
      broken.push({ page, href, reason: "해시 대상 페이지 없음" });
      continue;
    }
    const targetHtml = fs.readFileSync(htmlPath, "utf8");
    const id = hash.split("?")[0];
    if (!id) continue;
    const hasId = targetHtml.includes(`id="${id}"`) || targetHtml.includes(`id='${id}'`) || targetHtml.includes(`name="${id}"`);
    if (!hasId) broken.push({ page, href, reason: `id 없음: ${id}` });
  }
}

if (broken.length === 0) {
  console.log("깨진 내부 링크 없음");
} else {
  console.log(`깨진 링크 ${broken.length}건`);
  for (const item of broken) console.log(`- ${item.page} -> ${item.href} (${item.reason})`);
  process.exitCode = 1;
}
