import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) {
      parts.push(<strong key={`${match.index}-b`}>{match[1]}</strong>);
    } else {
      const href = match[3] ?? "";
      const safe = href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://");
      parts.push(
        safe ? (
          <a key={`${match.index}-a`} href={href} className="font-bold text-[#0B3A6E] underline">
            {match[2]}
          </a>
        ) : (
          match[0]
        ),
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function MarkdownText({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/).filter((block) => block.trim());
  if (blocks.length === 0) return null;
  return (
    <div className="space-y-2 text-[15px] leading-relaxed text-[#111827]">
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        const list = lines.filter((line) => line.trim()).every((line) => /^[-*]\s+/.test(line.trim()));
        if (list) {
          return (
            <ul key={index} className="list-disc pl-5">
              {lines
                .filter((line) => line.trim())
                .map((line, lineIndex) => (
                  <li key={lineIndex}>{inline(line.trim().replace(/^[-*]\s+/, ""))}</li>
                ))}
            </ul>
          );
        }
        return (
          <p key={index}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                {inline(line)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
