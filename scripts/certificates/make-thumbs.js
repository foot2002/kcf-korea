import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const srcDir = path.join(root, "public/downloads/certificates");
const outDir = path.join(srcDir, "thumbs");
const width = 480;

GlobalWorkerOptions.workerSrc = pathToFileURL(
  path.join(root, "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"),
).href;

const pdfs = fs.readdirSync(srcDir).filter((name) => /^cert-.*\.pdf$/i.test(name)).sort();
fs.mkdirSync(outDir, { recursive: true });

for (const name of pdfs) {
  const data = new Uint8Array(fs.readFileSync(path.join(srcDir, name)));
  const doc = await getDocument({ data, disableWorkerRendering: true }).promise;
  const page = await doc.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: width / base.width });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext("2d");
  await page.render({ canvas: null, canvasContext: context, viewport }).promise;
  const certNo = name.replace(/^cert-/i, "").replace(/\.pdf$/i, "");
  const out = path.join(outDir, `${certNo}.png`);
  fs.writeFileSync(out, canvas.toBuffer("image/png"));
  console.log(certNo, canvas.width, canvas.height);
}
