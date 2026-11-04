import fs from "node:fs";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";

const outDir = path.resolve("public");

function draw(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0B3A6E";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(size * 0.62)}px sans-serif`;
  ctx.fillText("K", size / 2, size / 2 + size * 0.03);
  return canvas.toBuffer("image/png");
}

const files = [
  ["favicon-32.png", 32],
  ["favicon-192.png", 192],
  ["favicon-512.png", 512],
  ["apple-touch-icon.png", 180],
];

for (const [name, size] of files) {
  const file = path.join(outDir, name);
  fs.writeFileSync(file, draw(size));
  console.log(file);
}
