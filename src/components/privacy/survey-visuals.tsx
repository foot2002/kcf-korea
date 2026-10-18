export function OrgNotice({ light = false }: { light?: boolean }) {
  return (
    <p className={light ? "text-[13px] leading-relaxed text-white/75" : "text-[13px] leading-relaxed text-text-secondary"}>
      개인정보보호진흥원은 재단법인 한국컨설팅산업재단 산하의 민간 공익조직입니다. 정부
      감독기관이나 법정 인증기관이 아니며, 이 사이트의 조사·안내·표시는 개인정보 유출이나
      법령 위반을 확정하는 처분이 아닙니다.
    </p>
  );
}

export function CountBars({
  items,
  max,
  unit = "건",
}: {
  items: readonly { label: string; count: number; hint?: string }[];
  max: number;
  unit?: string;
}) {
  return (
    <div>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.label}>
            <div className="flex items-baseline justify-between gap-3 text-[14px]">
              <span className="font-semibold text-navy">{item.label}</span>
              <span className="tabular-nums text-text-secondary">
                {item.count.toLocaleString("ko-KR")}
                {unit}
              </span>
            </div>
            {item.hint ? <p className="mt-0.5 text-[12px] text-text-muted">{item.hint}</p> : null}
            <div
              className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#E6EEF8]"
              role="img"
              aria-label={`${item.label} ${item.count.toLocaleString("ko-KR")}${unit}`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0F3D6E] to-[#0F766E]"
                style={{ width: `${Math.max(6, Math.round((item.count / max) * 100))}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <table className="sr-only">
        <caption>같은 수치의 표</caption>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
