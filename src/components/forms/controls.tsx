import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { consentRetention, getPrivacyConsentNotice, PRIVACY_REFUSAL_NOTICE, type PrivacyConsentVariant } from "@/data/privacy-consent";

const inputClass = (invalid: boolean) =>
  `h-12 w-full rounded-[6px] border bg-white px-3 text-[15px] text-[#111827] outline-none focus:border-[var(--site-accent)] focus:[box-shadow:0_0_0_2px_var(--site-accent)] ${
    invalid ? "border-[#B91C1C]" : "border-[#CBD5E1]"
  }`;

export function FormField({
  id,
  label,
  required,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-bold text-[#111827]">
        {label}
        {required ? (
          <>
            <span className="text-[#B91C1C]" aria-hidden="true"> *</span>
            <span className="sr-only"> (필수)</span>
          </>
        ) : optional ? (
          <span className="ml-1 text-[13px] font-normal text-[#374151]">(선택)</span>
        ) : null}
      </label>
      {hint ? <p id={hintId} className="mt-1 text-[13px] leading-relaxed text-[#374151]">{hint}</p> : null}
      <div className="mt-1">{children({ id, describedBy, invalid: Boolean(error) })}</div>
      {error ? <p id={errorId} className="mt-1 text-[14px] text-[#B91C1C]">{error}</p> : null}
    </div>
  );
}

export function TextInput(props: {
  id: string;
  value: string;
  invalid?: boolean;
  name?: string;
  describedBy?: string;
  type?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      id={props.id}
      name={props.name ?? props.id}
      type={props.type ?? "text"}
      value={props.value}
      autoComplete={props.autoComplete}
      aria-invalid={props.invalid || undefined}
      aria-describedby={props.describedBy}
      onChange={(event) => props.onChange(event.target.value)}
      className={inputClass(Boolean(props.invalid))}
    />
  );
}

export function Textarea(props: {
  id: string;
  value: string;
  max: number;
  name?: string;
  invalid?: boolean;
  describedBy?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <textarea
        id={props.id}
        name={props.name ?? props.id}
        value={props.value}
        maxLength={props.max}
        aria-invalid={props.invalid || undefined}
        aria-describedby={props.describedBy}
        onChange={(event) => props.onChange(event.target.value)}
        className={`${inputClass(Boolean(props.invalid))} h-32 py-3`}
      />
      <p className="mt-1 text-right text-[13px] text-[#374151]">{props.value.length} / {props.max}</p>
    </div>
  );
}

export function SelectInput(props: {
  id: string;
  value: string;
  options: readonly string[];
  invalid?: boolean;
  describedBy?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      id={props.id}
      value={props.value}
      aria-invalid={props.invalid || undefined}
      aria-describedby={props.describedBy}
      onChange={(event) => props.onChange(event.target.value)}
      className={inputClass(Boolean(props.invalid))}
    >
      <option value="">{props.placeholder ?? "선택"}</option>
      {props.options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}

export function RadioGroup(props: {
  name: string;
  value: string;
  options: readonly string[];
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-labelledby={props.labelledBy} aria-describedby={props.describedBy} aria-invalid={props.invalid || undefined} className="grid gap-2">
      {props.options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-[15px] text-[#111827]">
          <input type="radio" name={props.name} value={option} checked={props.value === option} onChange={() => props.onChange(option)} className="h-4 w-4 accent-[#0B3A6E]" />
          {option}
        </label>
      ))}
    </div>
  );
}

export function CheckboxGroup(props: {
  values: string[];
  options: readonly string[];
  labelledBy: string;
  invalid?: boolean;
  onChange: (values: string[]) => void;
}) {
  return (
    <div role="group" aria-labelledby={props.labelledBy} aria-invalid={props.invalid || undefined} className="grid gap-2 sm:grid-cols-2">
      {props.options.map((option) => {
        const checked = props.values.includes(option);
        return (
          <label key={option} className="flex items-start gap-2 text-[15px] text-[#111827]">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => props.onChange(checked ? props.values.filter((item) => item !== option) : [...props.values, option])}
              className="mt-1 h-4 w-4 accent-[#0B3A6E]"
            />
            {option}
          </label>
        );
      })}
    </div>
  );
}

export function FileInput(props: {
  id: string;
  file: File | null;
  invalid?: boolean;
  describedBy?: string;
  onChange: (file: File | null) => void;
}) {
  return (
    <div>
      <label
        htmlFor={props.id}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          props.onChange(event.dataTransfer.files?.[0] ?? null);
        }}
        className={`flex min-h-24 cursor-pointer flex-col items-start justify-center rounded-[6px] border border-dashed bg-white px-4 py-3 text-[15px] ${props.invalid ? "border-[#B91C1C]" : "border-[#CBD5E1]"}`}
      >
        <span className="font-bold text-[#0B3A6E]">파일을 끌어오거나 선택</span>
        <span className="mt-1 text-[13px] text-[#374151]">PDF, JPG, PNG · 5MB 이하</span>
        <input
          id={props.id}
          name="file"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          aria-invalid={props.invalid || undefined}
          aria-describedby={props.describedBy}
          className="sr-only"
          onChange={(event) => props.onChange(event.target.files?.[0] ?? null)}
        />
      </label>
      {props.file ? (
        <p className="mt-2 flex items-center gap-3 text-[14px] text-[#111827]">
          <span>{props.file.name} · {Math.ceil(props.file.size / 1024)}KB</span>
          <button type="button" className="font-bold text-[#9A3412] underline" onClick={() => props.onChange(null)}>삭제</button>
        </p>
      ) : null}
    </div>
  );
}

export function ConsentBox(props: {
  id: string;
  variant: PrivacyConsentVariant;
  name?: string;
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
}) {
  const notice = getPrivacyConsentNotice(props.variant);
  const errorId = props.error ? `${props.id}-error` : undefined;
  return (
    <div className="rounded-[6px] border border-[#CBD5E1] bg-white p-4">
      <table className="w-full text-left text-[14px]">
        <caption className="mb-2 text-left text-[15px] font-bold text-[#111827]">{notice.title}</caption>
        <tbody>
          {[
            ["목적", notice.purpose],
            ["항목", `${notice.requiredItems}${notice.optionalItems ? ` (선택: ${notice.optionalItems})` : ""}`],
            ["보유기간", consentRetention(props.variant)],
            ["거부권", PRIVACY_REFUSAL_NOTICE],
          ].map(([label, value]) => (
            <tr key={label} className="border-t border-[#D1D5DB]">
              <th scope="row" className="w-24 py-2 pr-3 align-top font-bold text-[#111827]">{label}</th>
              <td className="py-2 text-[#374151]">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3">
        <Link to="/privacy-policy" className="font-bold text-[#0B3A6E] underline">자세히 보기</Link>
      </p>
      <label className="mt-3 flex items-start gap-2 text-[15px] font-bold text-[#111827]">
        <input
          id={props.id}
          name={props.name}
          type="checkbox"
          checked={props.checked}
          aria-invalid={Boolean(props.error) || undefined}
          aria-describedby={errorId}
          onChange={(event) => props.onChange(event.target.checked)}
          className="mt-1 h-4 w-4 accent-[#0B3A6E]"
        />
        <span>개인정보 수집·이용에 동의합니다.<span className="text-[#B91C1C]" aria-hidden="true"> *</span><span className="sr-only"> (필수)</span></span>
      </label>
      {props.error ? <p id={errorId} className="mt-1 text-[14px] text-[#B91C1C]">{props.error}</p> : null}
    </div>
  );
}

export function CheckConsent(props: { checked: boolean; label: string; error?: string; onChange: (checked: boolean) => void }) {
  return (
    <div>
      <label className="flex items-start gap-2 text-[15px] text-[#111827]">
        <input type="checkbox" checked={props.checked} onChange={(event) => props.onChange(event.target.checked)} className="mt-1 h-4 w-4 accent-[#0B3A6E]" />
        <span>{props.label}<span className="text-[#B91C1C]" aria-hidden="true"> *</span><span className="sr-only"> (필수)</span></span>
      </label>
      {props.error ? <p className="mt-1 text-[14px] text-[#B91C1C]">{props.error}</p> : null}
    </div>
  );
}

export function SubmitBar(props: { pending: boolean; label: string }) {
  return (
    <button type="submit" disabled={props.pending} className="btn-primary-kcf disabled:opacity-60">
      {props.pending ? "보내는 중…" : props.label}
    </button>
  );
}

export function FormSuccess(props: { receipt: string; note: string; steps: readonly string[] }) {
  return (
    <div role="status" className="rounded-[6px] border border-[#0F766E] bg-white p-5">
      <h3 className="text-[20px] font-bold text-navy">접수되었습니다</h3>
      {props.receipt ? <p className="mt-3 text-[16px] text-[#111827]">접수 번호 <strong>{props.receipt}</strong></p> : null}
      <p className="mt-2 text-[15px] leading-relaxed text-[#374151]">{props.note}</p>
      <ol className="mt-4 grid gap-2">
        {props.steps.map((step, index) => (
          <li key={step} className="text-[14px] text-[#111827]">{index + 1}. {step}</li>
        ))}
      </ol>
    </div>
  );
}

export function MailtoFallback(props: { href: string; label: string }) {
  return (
    <div className="rounded-[6px] border border-[#D1D5DB] bg-white p-5">
      <p className="text-[15px] leading-relaxed text-[#374151]">온라인 접수를 준비하는 동안 이메일로 보내 주세요.</p>
      <a href={props.href} className="btn-primary-kcf mt-4">{props.label}</a>
    </div>
  );
}
