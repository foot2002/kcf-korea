import {
  getPrivacyConsentNotice,
  PRIVACY_COLLECTION_METHOD,
  PRIVACY_CONTROLLER,
  PRIVACY_DISPOSAL_METHOD,
  PRIVACY_REFUSAL_NOTICE,
  PRIVACY_RETENTION_PERIOD,
  PRIVACY_THIRD_PARTY,
  type PrivacyConsentVariant,
} from "@/data/privacy-consent";

type PrivacyConsentBlockProps = {
  variant: PrivacyConsentVariant;
  consent: boolean;
  onConsentChange: (value: boolean) => void;
  id: string;
  theme?: "light" | "dark";
};

export function PrivacyConsentBlock({
  variant,
  consent,
  onConsentChange,
  id,
  theme = "light",
}: PrivacyConsentBlockProps) {
  const notice = getPrivacyConsentNotice(variant);
  const isDark = theme === "dark";

  const boxClass = isDark
    ? "rounded-xl border border-white/20 bg-white/5 p-4 md:p-5"
    : "rounded-xl border border-border bg-section-bg p-4 md:p-5";

  const titleClass = isDark
    ? "text-[14px] font-bold text-white"
    : "text-[14px] font-bold text-navy";

  const labelClass = isDark
    ? "text-[12px] font-semibold text-white/70"
    : "text-[12px] font-semibold text-text-muted";

  const valueClass = isDark
    ? "text-[12.5px] leading-relaxed text-white/90"
    : "text-[12.5px] leading-relaxed text-text-secondary";

  const checkboxLabelClass = isDark
    ? "text-[13.5px] leading-relaxed text-white/90"
    : "text-[13.5px] leading-relaxed text-text-primary";

  const rows: { label: string; value: string }[] = [
    {
      label: "개인정보 처리자",
      value: `${PRIVACY_CONTROLLER.name} (${PRIVACY_CONTROLLER.operator} 운영)`,
    },
    { label: "수집 방법", value: PRIVACY_COLLECTION_METHOD },
    { label: "수집·이용 목적", value: notice.purpose },
    { label: "수집 항목 (필수)", value: notice.requiredItems },
    ...(notice.optionalItems
      ? [{ label: "수집 항목 (선택)", value: notice.optionalItems }]
      : []),
    { label: "보유·이용 기간", value: PRIVACY_RETENTION_PERIOD },
    { label: "파기 절차 및 방법", value: PRIVACY_DISPOSAL_METHOD },
    { label: "제3자 제공", value: PRIVACY_THIRD_PARTY },
    { label: "동의 거부 권리 및 불이익", value: PRIVACY_REFUSAL_NOTICE },
  ];

  const scrollAreaClass = isDark
    ? "max-h-[200px] overflow-y-auto rounded-lg border border-white/15 bg-black/10 p-3 pr-2 sm:max-h-[240px]"
    : "max-h-[200px] overflow-y-auto rounded-lg border border-border bg-white p-3 pr-2 sm:max-h-[240px]";

  return (
    <div className={boxClass}>
      <h3 className={titleClass}>{notice.title}</h3>

      <div className={`mt-3 ${scrollAreaClass}`}>
        <p className={valueClass}>
          재단법인 한국컨설팅산업재단(이하 &quot;재단&quot;)은 개인정보보호진흥원을 운영하며,
          「개인정보 보호법」 제15조·제22조에 따라 아래와 같이 개인정보를 수집·이용합니다.
        </p>

        <dl className="mt-4 space-y-3">
          {rows.map((row) => (
            <div key={row.label}>
              <dt className={labelClass}>{row.label}</dt>
              <dd className={`mt-0.5 ${valueClass}`}>{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className={`mt-4 ${valueClass}`}>
          문의: {PRIVACY_CONTROLLER.address} · {PRIVACY_CONTROLLER.tel}
        </p>
      </div>

      <label
        htmlFor={id}
        className={`mt-4 flex cursor-pointer items-start gap-2.5 ${checkboxLabelClass}`}
      >
        <input
          id={id}
          type="checkbox"
          checked={consent}
          onChange={(e) => onConsentChange(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-border text-trust-blue focus:ring-trust-blue"
          required
        />
        <span>
          위 개인정보 수집·이용 내용을 충분히 읽고 이해하였으며, 이에 동의합니다.
        </span>
      </label>
    </div>
  );
}
