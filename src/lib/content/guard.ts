const ALLOWED = ["cs@kcf-korea.org", "02-501-2906"];

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const MOBILE = /(?<!\d)01[016789]-?\d{3,4}-?\d{4}(?!\d)/g;
const PHONE = /(?<!\d)0\d{1,2}-\d{3,4}-\d{4}(?!\d)/g;

const EXCELLENCE_NAMES = [
  "대한무역투자진흥공사",
  "과학기술정보통신부 우정사업본부",
  "의정부시",
  "천안시",
  "아산시시설관리공단",
  "천안도시공사",
  "한국재정정보원",
];

const OLD_STAT = /(?:^|[^\d.])(?:161|341|159|155|106|96|50|14|11)(?:\s*건|\s*%)|(?:^|[^\d.])77\.6/;

export function findPersonalData(text: string): string[] {
  let rest = text;
  for (const item of ALLOWED) rest = rest.split(item).join("");
  const hits = new Set<string>();
  for (const pattern of [EMAIL, MOBILE, PHONE]) {
    pattern.lastIndex = 0;
    const found = rest.match(pattern);
    if (found) found.forEach((item) => hits.add(item));
  }
  return [...hits];
}

function hasBlockedMail(text: string) {
  let from = 0;
  while (from < text.length) {
    const at = text.indexOf("@", from);
    if (at < 0) return false;
    if (text.slice(at - 6, at) === "wiseon" && text.startsWith("wiseinc.co.kr", at + 1)) return true;
    from = at + 1;
  }
  return false;
}

export function findForbiddenCopy(text: string): string[] {
  const warnings: string[] = [];
  if (hasBlockedMail(text)) warnings.push("허용하지 않는 전자우편이 들어 있습니다.");
  if (OLD_STAT.test(text)) warnings.push("옛 통계 수치(161, 341, 77.6 등)가 들어 있습니다.");
  const survey = text.includes("실태조사") || text.includes("국정감사");
  const named = EXCELLENCE_NAMES.filter((name) => text.includes(name));
  if (survey && named.length > 0) {
    warnings.push(`실태조사·국정감사 문맥에 우수기관 이름이 함께 있습니다: ${named.join(", ")}`);
  }
  return warnings;
}
