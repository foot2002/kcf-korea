import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const outDir = path.resolve("public");
const logo = fs.readFileSync(path.resolve("image/kcf_logo.jpg")).toString("base64");
const font = fs.readFileSync(path.resolve("public/fonts/Pretendard-Bold.woff2")).toString("base64");

const cards = [
  {
    file: "og-kcf.png",
    title: "공익법인 (재)한국컨설팅산업재단",
    line: "대한민국 지식서비스산업을 선도하는 공익법인",
  },
  {
    file: "og-privacy.png",
    title: "개인정보보호진흥원 · 한국컨설팅산업재단 부설",
    line: "개인정보 유출, 수집하는 곳에서부터 시작합니다",
  },
];

function html({ title, line }) {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: "Pretendard";
    src: url("data:font/woff2;base64,${font}") format("woff2");
    font-weight: 700;
    font-display: block;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; background: #ffffff; }
  body {
    font-family: Pretendard, "Malgun Gothic", sans-serif;
    color: #0B3A6E;
    display: flex;
    flex-direction: column;
  }
  .band-navy { height: 18px; background: #0B3A6E; }
  .band-teal { height: 10px; background: #0F766E; }
  .inner { flex: 1; padding: 56px 72px 40px; display: flex; flex-direction: column; justify-content: center; }
  img { height: 72px; width: auto; max-width: 520px; object-fit: contain; object-position: left center; }
  h1 { margin-top: 40px; font-size: 46px; line-height: 1.35; font-weight: 700; letter-spacing: -0.02em; }
  p { margin-top: 22px; font-size: 30px; line-height: 1.45; font-weight: 700; color: #1F2937; }
</style>
</head>
<body>
  <div class="band-navy"></div>
  <div class="band-teal"></div>
  <div class="inner">
    <img src="data:image/jpeg;base64,${logo}" alt="" />
    <h1>${title}</h1>
    <p>${line}</p>
  </div>
  <div class="band-teal"></div>
  <div class="band-navy"></div>
</body>
</html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const card of cards) {
  await page.setContent(html(card), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(outDir, card.file);
  await page.screenshot({ path: file, type: "png" });
  console.log(file);
}
await browser.close();
