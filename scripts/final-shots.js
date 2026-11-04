import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { startStaticServer } from "./static-server.mjs";

const PAGES = [
  ["/", "home"],
  ["/privacy-center", "privacy-center"],
  ["/privacy-center/research", "research"],
  ["/privacy-center/education", "education"],
  ["/privacy-center/security-services", "security-services"],
  ["/privacy-center/sure-mark", "sure-mark"],
  ["/privacy-center/rights", "rights"],
  ["/privacy-center/publications", "publications"],
  ["/contact", "contact"],
  ["/privacy-policy", "privacy-policy"],
];

const root = path.resolve("dist/client");
const out = path.resolve("docs/screenshots/final");
fs.mkdirSync(out, { recursive: true });

const { server, origin } = await startStaticServer(root);
const browser = await chromium.launch();
const heights = {};

try {
  for (const [route, name] of PAGES) {
    for (const width of [375, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      if (width === 375 && (name === "security-services" || name === "research")) {
        heights[name] = height;
      }
      await page.screenshot({ path: path.join(out, `${name}-${width}.png`), fullPage: true });
      await context.close();
      console.log(`${name} ${width}px height ${height}`);
    }
  }
} finally {
  await browser.close();
  server.close();
}

fs.writeFileSync(path.join(out, "heights.json"), JSON.stringify(heights, null, 2));
