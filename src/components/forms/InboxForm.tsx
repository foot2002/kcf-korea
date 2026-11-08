import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { ZodType } from "zod";

import { FormSuccess, MailtoFallback } from "@/components/forms/controls";
import { isFormsConfigured } from "@/lib/forms/config";
import { fieldErrors } from "@/lib/forms/schema";
import { RateLimitError, readFileGuard, SilentAccept, submitForm } from "@/lib/forms/submit";
import type { FormName } from "@/lib/forms/schema";

const FAIL = "잠시 후 다시 시도하거나 cs@kcf-korea.org 로 보내 주세요.";

export function InboxForm<T extends Record<string, unknown>>(props: {
  form: FormName;
  schema: ZodType<T>;
  initialStatus: string;
  mailto: string;
  mailtoLabel: string;
  submitLabel: string;
  successNote: string;
  steps: readonly string[];
  fileMode?: "none" | "optional" | "required";
  values: T;
  children: (api: { errors: Record<string, string>; file: File | null; setFile: (file: File | null) => void }) => ReactNode;
}) {
  const openedAt = useRef(Date.now());
  const [ready, setReady] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const focusKeyRef = useRef<string | null>(null);

  useEffect(() => {
    void isFormsConfigured().then(setReady);
  }, []);

  useEffect(() => {
    const key = focusKeyRef.current;
    if (!key) return;
    focusKeyRef.current = null;
    const form = formRef.current;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const target = form?.querySelector<HTMLElement>(`[name="${CSS.escape(key)}"]`) ?? summaryRef.current;
    target?.scrollIntoView({ behavior, block: "center" });
    target?.focus();
  }, [errors]);

  function focusField(key: string) {
    const form = formRef.current;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const target = form?.querySelector<HTMLElement>(`[name="${CSS.escape(key)}"]`);
    target?.scrollIntoView({ behavior, block: "center" });
    target?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBanner("");
    const parsed = props.schema.safeParse(props.values);
    const next = parsed.success ? {} : fieldErrors(parsed.error);
    const fileMode = props.fileMode ?? "none";
    if (fileMode === "required" && !file) next.file = "서명본을 첨부해 주세요.";
    if (file) {
      const fileError = readFileGuard(file);
      if (fileError) next.file = fileError;
    }
    const firstKey = Object.keys(next)[0];
    if (firstKey) focusKeyRef.current = firstKey;
    setErrors(next);
    if (Object.keys(next).length > 0 || !parsed.success) return;
    setPending(true);
    try {
      const id = await submitForm({
        form: props.form,
        data: parsed.data,
        file,
        honeypot,
        openedAt: openedAt.current,
        initialStatus: props.initialStatus,
        attachmentName: file?.name ?? "",
      });
      setReceipt(id);
    } catch (error) {
      if (error instanceof SilentAccept) {
        setReceipt("");
        return;
      }
      setBanner(error instanceof RateLimitError ? error.message : FAIL);
    } finally {
      setPending(false);
    }
  }

  if (ready === null) return <p className="text-[15px] text-[#374151]">신청 방법을 확인하는 중입니다.</p>;
  if (!ready) return <MailtoFallback href={props.mailto} label={props.mailtoLabel} />;
  if (receipt !== null) return <FormSuccess receipt={receipt} note={props.successNote} steps={props.steps} />;

  const errorItems = Object.entries(errors).filter((entry) => entry[1]);

  return (
    <form ref={formRef} onSubmit={(event) => void onSubmit(event)} noValidate className="grid gap-4">
      {errorItems.length > 0 ? (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-md border border-[#B91C1C] bg-white p-4 outline-none">
          <p className="text-[15px] font-bold text-[#111827]">아래 항목을 확인해 주세요.</p>
          <ul className="mt-2 grid gap-1">
            {errorItems.map(([key, message]) => (
              <li key={key}>
                <button type="button" className="text-left text-[15px] font-bold text-[#9A3412] underline" onClick={() => focusField(key)}>
                  {message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {banner ? (
        <p role="alert" className="rounded-[6px] border border-[#B91C1C] bg-white p-4 text-[15px] text-[#111827]">
          {banner}{" "}
          <a className="font-bold text-[#0B3A6E] underline" href={props.mailto}>이메일로 보내기</a>
        </p>
      ) : null}
      <div className="absolute h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          웹사이트
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
        </label>
      </div>
      {props.children({ errors, file, setFile })}
      <button type="submit" disabled={pending} className="btn-primary-kcf w-fit disabled:opacity-60">
        {pending ? "보내는 중…" : props.submitLabel}
      </button>
    </form>
  );
}
