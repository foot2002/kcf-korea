import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

import { startStaticServer } from "./static-server.mjs";

const PAGES = [
  "/",
  "/about",
  "/history",
  "/business",
  "/achievements",
  "/contact",
  "/privacy-policy",
  "/sitemap",
  "/privacy-center",
  "/privacy-center/research",
  "/privacy-center/education",
  "/privacy-center/security-services",
  "/privacy-center/sure-mark",
  "/privacy-center/rights",
  "/privacy-center/publications",
  "/privacy-center/sure-check",
  "/privacy-center/ai-forms-report",
  "/?popup-preview=1",
  "/privacy-center/?popup-preview=1",
  "/admin",
];

const root = path.resolve("dist/client");
if (!fs.existsSync(root)) {
  console.error("dist/client 가 없습니다. GITHUB_PAGES 빌드를 먼저 실행하세요.");
  process.exit(1);
}

const { server, origin } = await startStaticServer(root);
const browser = await chromium.launch();
const context = await browser.newContext();
const serious = [];
const moderate = [];

try {
  for (const route of PAGES) {
    const page = await context.newPage();
    const response = await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    if (!response || response.status() >= 400) {
      serious.push({ route, id: "page-load", impact: "critical", help: `페이지를 열지 못했습니다 (${response?.status() ?? "no response"})`, target: route });
      await page.close();
      continue;
    }
    if (route.includes("popup-preview")) {
      await page.waitForSelector("[role='dialog']", { timeout: 4000 });
    }
    const results = await new AxeBuilder({ page }).analyze();
    for (const violation of results.violations) {
      const item = {
        route,
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        target: violation.nodes.map((node) => node.target.join(" ")).slice(0, 3).join(" | "),
      };
      if (violation.impact === "critical" || violation.impact === "serious") serious.push(item);
      else moderate.push(item);
    }
    await page.close();
    console.log(`${route}: serious ${results.violations.filter((v) => v.impact === "serious" || v.impact === "critical").length}`);
  }
} finally {
  await context.close();
  await browser.close();
  server.close();
}

const reportDir = path.resolve("docs/screenshots");
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, "a11y-report.json"), JSON.stringify({ serious, moderate }, null, 2));

console.log(`\nserious/critical: ${serious.length}`);
for (const item of serious) console.log(`- [${item.impact}] ${item.route} ${item.id}: ${item.help} (${item.target})`);
console.log(`\nmoderate 이하: ${moderate.length}`);
for (const item of moderate) console.log(`- [${item.impact}] ${item.route} ${item.id}: ${item.help}`);

if (serious.length > 0) process.exit(1);
