const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
// 사용법: node build-certificates.js ./assets ./out
const D = process.argv[2], OUT = process.argv[3];
const b64 = f => 'data:image/png;base64,' + fs.readFileSync(path.join(D, f)).toString('base64');
const SURE = b64('sure_logo.png'), SEAL = b64('seal.png'), KCF = b64('kcf_logo.png');
const orgs = [
 ['SURE-2026-4970','대한무역투자진흥공사'],
 ['SURE-2026-9326','과학기술정보통신부 우정사업본부'],
 ['SURE-2026-1982','의정부시'],
 ['SURE-2026-6197','천안시'],
 ['SURE-2026-3643','아산시시설관리공단'],
 ['SURE-2026-4827','천안도시공사'],
 ['SURE-2026-9214','한국재정정보원'],
];
const html = (no, name) => `<!doctype html><html><head><meta charset="utf-8"><style>
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:210mm;height:297mm}
body{font-family:"Noto Serif CJK KR",serif;color:#1c2a4a;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:210mm;height:297mm;padding:12mm}
.outer{position:absolute;inset:12mm;border:2.2mm solid #1b2d6b}
.inner{position:absolute;inset:16.5mm;border:0.35mm solid #c9a24a;
 background:radial-gradient(ellipse at 50% 55%,#f3f6f2 0%,#ffffff 62%)}
.c{position:absolute;width:12mm;height:12mm;border-color:#c9a24a;border-style:solid}
.tl{top:19.5mm;left:19.5mm;border-width:.6mm 0 0 .6mm}.tr{top:19.5mm;right:19.5mm;border-width:.6mm .6mm 0 0}
.bl{bottom:19.5mm;left:19.5mm;border-width:0 0 .6mm .6mm}.br{bottom:19.5mm;right:19.5mm;border-width:0 .6mm .6mm 0}
.no{position:absolute;top:32mm;left:23mm;font-family:"Noto Sans CJK KR",sans-serif;font-size:9.5pt;color:#5b6478;letter-spacing:.02em}
.content{position:absolute;left:16.5mm;right:16.5mm;top:40mm;text-align:center}
.logo{width:46mm;height:46mm}
.cert{margin-top:6.5mm;font-family:"Noto Sans CJK KR",sans-serif;font-weight:700;font-size:11.5pt;letter-spacing:.55em;color:#c09a3e;padding-left:.55em}
.title{margin-top:2.5mm;font-weight:900;font-size:30pt;color:#1b2d6b;letter-spacing:.06em}
.sub{margin-top:2mm;font-family:"Noto Sans CJK KR",sans-serif;font-weight:700;font-size:12pt;letter-spacing:.4em;color:#2e7d3c;padding-left:.4em}
.rule{width:64mm;height:.35mm;background:#c9a24a;margin:8mm auto 0}
.name{margin-top:9mm;font-weight:900;font-size:${name.length>12?22:26}pt;color:#1c2a4a;letter-spacing:.08em}
.body{margin-top:11mm;font-size:12.4pt;line-height:2.15;color:#2a3550}
.date{margin-top:10mm;font-size:13.5pt;letter-spacing:.06em;color:#2a3550}
.note{margin-top:5mm;font-family:"Noto Sans CJK KR",sans-serif;font-size:8.2pt;line-height:1.7;color:#5b6478}
.foot{position:absolute;left:16.5mm;right:16.5mm;bottom:31mm;text-align:center}
.kcf{height:9.5mm}
.issuer{margin-top:2.5mm;font-weight:900;font-size:14.5pt;letter-spacing:.04em;color:#1c2a4a;position:relative;display:inline-block}
.seal{position:absolute;right:-21mm;top:-9.5mm;width:22mm;height:22mm;opacity:.95}
</style></head><body><div class="page">
<div class="outer"></div><div class="inner"></div>
<div class="c tl"></div><div class="c tr"></div><div class="c bl"></div><div class="c br"></div>
<div class="no">인증번호 ${no}</div>
<div class="content">
 <img class="logo" src="${SURE}">
 <div class="cert">CERTIFICATE</div>
 <div class="title">개인정보보호실천 우수기관</div>
 <div class="sub">SURE MARK 인증서</div>
 <div class="rule"></div>
 <div class="name">${name}</div>
 <div class="body">위 기관은 개인정보 보호를 위한 안전조치를 전사적으로 실천하고,<br>
 국가가 인증한 클라우드서비스보안인증(CSAP)을 활용하여<br>
 선제적인 개인정보 보호에 앞장서 왔기에,<br>
 그 모범적인 활동을 기려 「개인정보보호실천 우수기관」으로 선정하고<br>
 개인정보보호 실천기관 표시인 SURE MARK를 드립니다.</div>
 <div class="date">2026년 11월 6일</div>
 <div class="note">※ SURE MARK는 개인정보보호 실천기관임을 나타내는 표시로, 귀 기관의 개인정보 보호 공지·대외조사·<br>홍보 등에 자유롭게 사용하실 수 있습니다.</div>
</div>
<div class="foot"><img class="kcf" src="${KCF}"><br>
 <div class="issuer">공익법인 한국컨설팅산업재단 - 개인정보보호진흥원<img class="seal" src="${SEAL}"></div>
</div>
</div></body></html>`;
(async()=>{
 const br = await chromium.launch(); const p = await br.newPage();
 fs.mkdirSync(OUT,{recursive:true});
 for (const [no,name] of orgs){
  await p.setContent(html(no,name),{waitUntil:'load'});
  await p.pdf({path:path.join(OUT,`cert-${no}.pdf`),format:'A4',printBackground:true,preferCSSPageSize:true});
  console.log(no,name);
 }
 await br.close();
})();
