"use client";

import { useEffect, useId, useState } from "react";
import { CalendarDays, Monitor, Ticket, X } from "lucide-react";

const APPLY_URL = "https://survey.wiseon.io/survey/218";
const STORAGE_KEY = "kcf-privacy-webinar-popup-hide-until";

const PROGRAMS = [
  {
    num: "01",
    org: "법무법인 율촌",
    title: "강화되는 개인정보보호법과 기업·기관의 대응",
  },
  {
    num: "02",
    org: "㈜파수",
    title: "기업과 기관의 개인정보·보안 대응 실전",
  },
  {
    num: "03",
    org: "㈜와이즈인컴퍼니",
    title: "외부 정보수집의 보안 공백과 WiseON 적용",
  },
  {
    num: "04",
    org: "㈜타이거컴퍼니",
    title: "조직 내부 협업과 문서공유의 보안 전환",
  },
  {
    num: "05",
    org: "㈜피앤피시큐어",
    title: "자체 시스템과 핵심 DB의 개인정보보호",
  },
] as const;

function endOfTodayMs() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end.getTime();
}

function isHiddenForToday() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const until = Number(raw);
      if (Number.isFinite(until) && Date.now() < until) return true;
    }
  } catch {
    /* localStorage 접근 불가 시 쿠키로 확인 */
  }
  if (typeof document !== "undefined") {
    return document.cookie.split("; ").some((part) => part.startsWith(`${STORAGE_KEY}=`));
  }
  return false;
}

function hideForToday() {
  const until = endOfTodayMs();
  try {
    localStorage.setItem(STORAGE_KEY, String(until));
  } catch {
    /* private mode 등에서 저장 실패해도 닫기는 진행 */
  }
  const maxAge = Math.max(1, Math.ceil((until - Date.now()) / 1000));
  document.cookie = `${STORAGE_KEY}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function WebinarPromoPopup() {
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isHiddenForToday()) return;
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  const hideTodayAndClose = () => {
    hideForToday();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#00102c]/55"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[81] flex w-[min(640px,92vw)] max-h-[min(90dvh,820px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,16,44,0.38)]"
      >
        <div className="relative shrink-0 bg-[#002B4E] px-5 pb-4 pt-5 text-white sm:px-6 sm:pb-5 sm:pt-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_12%,rgba(255,255,255,0.08),transparent_58%)]"
          />
          <button
            type="button"
            id="privacy-webinar-close"
            onClick={close}
            aria-label="팝업 닫기"
            className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/22 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDE68A]"
          >
            <X className="h-4 w-4" strokeWidth={2.4} />
          </button>

          <p className="relative pr-8 text-[12px] font-semibold tracking-[0.04em] text-[#FDE68A] sm:text-[13px]">
            2026 개인정보보호 실무 웨비나
          </p>
          <h2
            id={titleId}
            className="relative mt-1.5 text-[19px] font-black leading-[1.32] tracking-tight text-white sm:text-[22px] sm:leading-[1.35]"
          >
            강화되는 개인정보보호법과
            <br />
            기업·기관의 <span className="text-[#FDE68A]">실전 대응 및 적용</span>
          </h2>
          <p className="relative mt-2 max-w-[34rem] text-[12.5px] leading-relaxed text-white/80 sm:text-[13.5px]">
            공공기관과 기업이 준비해야 할 개인정보보호·보안 실무 대응 전략
          </p>

          <div className="relative mt-3.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] font-medium text-[#e5eaf7] sm:text-[12.5px]">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#FDE68A]" />
              2026년 9월 30일(수) 14:00~16:20
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] font-medium text-[#e5eaf7] sm:text-[12.5px]">
              <Monitor className="h-3.5 w-3.5 shrink-0 text-[#FDE68A]" />
              온라인 웨비나
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006fc9] px-2.5 py-1 text-[11.5px] font-bold text-white sm:text-[12.5px]">
              <Ticket className="h-3.5 w-3.5 shrink-0" />
              참가비 무료
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <section className="border-b border-[#e5e7eb] bg-[#ebf2f8] px-5 py-3 sm:px-6">
            <dl className="space-y-1.5 text-[12px] leading-snug sm:text-[12.5px]">
              <div className="grid grid-cols-[4.5rem_1fr] gap-x-2">
                <dt className="font-bold text-[#002B4E]">주최</dt>
                <dd className="text-[#1f2937]">개인정보보호진흥원 · 한국컨설팅산업재단</dd>
              </div>
              <div className="grid grid-cols-[4.5rem_1fr] gap-x-2">
                <dt className="font-bold text-[#002B4E]">주관</dt>
                <dd className="text-[#1f2937]">
                  법무법인 율촌 · ㈜파수 · ㈜와이즈인컴퍼니 · ㈜타이거컴퍼니 · ㈜피앤피시큐어 ·
                  ㈜프리모데이터
                </dd>
              </div>
              <div className="grid grid-cols-[4.5rem_1fr] gap-x-2">
                <dt className="font-bold text-[#002B4E]">공동참여</dt>
                <dd className="text-[#1f2937]">
                  한국서비스산업연합회 · 한국SW·ICT연합회 산하 30개 협회
                </dd>
              </div>
            </dl>
          </section>

          <section className="px-5 py-3.5 sm:px-6 sm:py-4">
            <h3 className="text-[13px] font-extrabold tracking-tight text-[#0b2545] sm:text-[14px]">
              주요 프로그램
            </h3>
            <ol className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PROGRAMS.map((item) => (
                <li
                  key={item.num}
                  className="flex gap-2.5 rounded-xl border border-[#d6e3ef] bg-[#f8fbfe] px-3 py-2.5"
                >
                  <span className="mt-0.5 inline-flex h-5 min-w-6 items-center justify-center rounded-md bg-[#005091] px-1 text-[10px] font-bold text-white">
                    {item.num}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold leading-tight text-[#006fc9] sm:text-[12.5px]">
                      {item.org}
                    </p>
                    <p className="mt-0.5 text-[12.5px] font-semibold leading-snug text-[#0b2545] sm:text-[13px]">
                      {item.title}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-2 rounded-xl border border-[#fbe6a6] bg-[#fff8e6] px-3 py-2 text-center text-[12.5px] font-bold text-[#0b2545] sm:text-[13px]">
              전문가 Q&A 및 도입상담 안내
            </p>
          </section>
        </div>

        <div className="shrink-0 border-t border-[#d6e3ef] bg-[#002B4E] px-5 py-3.5 sm:px-6 sm:py-4">
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-[10px] bg-[#FDE68A] px-4 py-3 text-[15px] font-extrabold text-[#002B4E] shadow-[0_8px_20px_rgba(253,230,138,0.28)] transition-colors hover:bg-[#fcd34d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#002B4E] sm:text-[16px]"
          >
            웨비나 신청하기 →
          </a>
          <button
            type="button"
            id="privacy-webinar-hide-today"
            onClick={hideTodayAndClose}
            className="mt-2.5 w-full text-center text-[12px] font-medium text-white/70 underline-offset-2 transition-colors hover:text-white hover:underline sm:text-[12.5px]"
          >
            오늘 하루 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
}
