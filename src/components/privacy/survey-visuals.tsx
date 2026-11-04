export function OrgNotice({ light = false }: { light?: boolean }) {
  return (
    <p className={light ? "text-[13px] leading-relaxed text-white/75" : "text-[13px] leading-relaxed text-text-secondary"}>
      개인정보보호진흥원은 재단법인 한국컨설팅산업재단 산하의 민간 공익조직입니다. 정부
      감독기관이나 법정 인증기관이 아니며, 이 사이트의 조사·안내·표시는 개인정보 유출이나
      법령 위반을 확정하는 처분이 아닙니다.
    </p>
  );
}

const BAR_TONE = {
  navy: "bg-navy",
  teal: "bg-[#0F766E]",
  gray: "bg-[#4B5563]",
} as const;

export type BarTone = keyof typeof BAR_TONE;

export function CountBars({
  items,
  max,
  unit = "건",
  tone = "navy",
  caption = "같은 수치의 표",
}: {
  items: readonly { label: string; count: number; hint?: string; note?: string; share?: string }[];
  max: number;
  unit?: string;
  tone?: BarTone;
  caption?: string;
}) {
  return (
    <div>
      <ul className="space-y-4">
        {items.map((item) => {
          const valueText = `${item.count.toLocaleString("ko-KR")}${unit}${item.share ? ` (${item.share})` : ""}`;
          return (
            <li key={item.label} className="count-bar">
              <div className="flex items-baseline justify-between gap-3 text-[14px]">
                <span className="font-semibold text-navy">{item.label}</span>
                <span className="shrink-0 tabular-nums font-semibold text-[#111827]">{valueText}</span>
              </div>
              {item.hint ? <p className="mt-0.5 text-[13px] text-[#374151]">{item.hint}</p> : null}
              <div
                className="mt-2 h-2.5 overflow-hidden rounded bg-[#E8EEF6]"
                role="img"
                aria-label={`${item.label} ${valueText}${item.note ? `, ${item.note}` : ""}`}
              >
                <div
                  className={`h-full rounded ${BAR_TONE[tone]}`}
                  style={{
                    width: `${max > 0 ? ((item.count / max) * 100).toFixed(1) : "0"}%`,
                    minWidth: item.count > 0 ? "2px" : 0,
                  }}
                />
              </div>
              {item.note ? <p className="mt-1 text-[13px] text-[#374151]">{item.note}</p> : null}
            </li>
          );
        })}
      </ul>
      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th>항목</th>
            <th>건수</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.label}>
              <td>{item.label}</td>
              <td>
                {item.count}
                {unit}
                {item.share ? ` (${item.share})` : ""}
                {item.note ? ` ${item.note}` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StackedBar({
  segments,
  total,
  caption,
}: {
  segments: readonly { label: string; count: number; share: string; tone: BarTone }[];
  total: number;
  caption: string;
}) {
  const summary = segments.map((segment) => `${segment.label} ${segment.count} (${segment.share})`).join(", ");
  return (
    <div className="stacked-bar">
      <div
        className="flex h-8 overflow-hidden rounded-md border border-[#D1D5DB] bg-[#F3F4F6]"
        role="img"
        aria-label={summary}
      >
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={`h-full ${BAR_TONE[segment.tone]}`}
            style={{ width: `${total > 0 ? ((segment.count / total) * 100).toFixed(1) : "0"}%` }}
          />
        ))}
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {segments.map((segment) => (
          <li key={segment.label} className="text-[14px] leading-snug text-[#111827]">
            <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-sm align-middle ${BAR_TONE[segment.tone]}`} aria-hidden="true" />
            <span className="font-semibold">{segment.label}</span>{" "}
            <span className="tabular-nums">
              {segment.count.toLocaleString("ko-KR")} ({segment.share})
            </span>
          </li>
        ))}
      </ul>
      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th>구분</th>
            <th>곳</th>
            <th>비율</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((segment) => (
            <tr key={segment.label}>
              <td>{segment.label}</td>
              <td>{segment.count}</td>
              <td>{segment.share}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
