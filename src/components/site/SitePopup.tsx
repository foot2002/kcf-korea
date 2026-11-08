import { Link, useRouterState } from "@tanstack/react-router";
import { Building2, FileText, UserRound } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

import coverPolicy from "@/assets/reports/cover-policy-report.webp";
import coverWhitepaper from "@/assets/reports/cover-whitepaper.webp";
import { AI_FORMS_REPORT } from "@/data/ai-forms-report";
import { usePopups } from "@/lib/content/load";
import type { PopupItem, PopupSite } from "@/lib/content/types";
import { seoulToday } from "@/lib/seoul-date";

const COPY = AI_FORMS_REPORT.popup;
const AUDIENCE_ICONS = [Building2, FileText, UserRound] as const;
const COVERS = [
  { src: coverPolicy, className: "is-back", width: 800, height: 1132 },
  { src: coverWhitepaper, className: "is-front", width: 800, height: 1132 },
];

function siteOf(pathname: string): PopupSite | null {
  if (pathname === "/") return "foundation";
  if (pathname === "/privacy-center" || pathname === "/privacy-center/") return "center";
  return null;
}

function hiddenToday(id: string, today: string) {
  try {
    return window.localStorage.getItem(`kcf-popup-hide:${id}`) === today;
  } catch {
    return false;
  }
}

function rememberHide(id: string, today: string) {
  try {
    window.localStorage.setItem(`kcf-popup-hide:${id}`, today);
  } catch {
    /* 저장이 안 되면 다음에 다시 보여 준다. */
  }
}

function pickPopup(popups: PopupItem[], site: PopupSite, preview: boolean, today: string) {
  return popups.find((popup) => {
    if (!popup.enabled || !popup.sites.includes(site)) return false;
    if (!preview && (today < popup.start || today > popup.end)) return false;
    if (hiddenToday(popup.id, today)) return false;
    return true;
  });
}

export function SitePopup() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const popups = usePopups();
  const [item, setItem] = useState<PopupItem | null>(null);
  const [hideTodayChecked, setHideTodayChecked] = useState(false);
  const [reduced, setReduced] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const site = siteOf(pathname);
    setItem(null);
    setHideTodayChecked(false);
    if (!site) return;
    const today = seoulToday();
    const preview = new URLSearchParams(window.location.search).get("popup-preview") === "1";
    const match = pickPopup(popups, site, preview, today);
    if (!match) return;
    const timer = window.setTimeout(() => setItem(match), 400);
    return () => window.clearTimeout(timer);
  }, [pathname, popups]);

  useEffect(() => {
    if (!item) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(motion);
    titleRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      returnFocus.current?.focus();
    };
  }, [item]);

  function close() {
    if (item && hideTodayChecked) rememberHide(item.id, seoulToday());
    setItem(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const nodes = [...dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled])")];
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === titleRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || active === titleRef.current)) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!item || typeof document === "undefined") return null;
  const tone = siteOf(pathname) === "center" ? "center" : "foundation";

  return createPortal(
    <div className={reduced ? "site-popup is-reduced" : "site-popup"}>
      <button type="button" className="site-popup-backdrop" aria-label={COPY.closeLabel} onClick={close} />
      <div
        ref={dialogRef}
        className={`site-popup-dialog is-${tone}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={COPY.titleId}
        onKeyDown={onKeyDown}
      >
        <button type="button" className="site-popup-x" aria-label={COPY.closeLabel} onClick={close}>
          <span aria-hidden="true">×</span>
        </button>
        <p className="site-popup-label">{COPY.label}</p>
        <h2 id={COPY.titleId} ref={titleRef} tabIndex={-1}>
          {COPY.titleLead}
          <em>{COPY.titleEm}</em>
          {COPY.titleTail}
        </h2>
        <p className="site-popup-body">
          {COPY.body.map((part) =>
            "strong" in part && part.strong ? <strong key={part.text}>{part.text}</strong> : <span key={part.text}>{part.text}</span>,
          )}
        </p>
        <Link className="site-popup-panel" to={item.link} hash="download" onClick={close}>
          <span className="sr-only">{COPY.coverLabel}</span>
          <span className="site-popup-covers" aria-hidden="true">
            {COVERS.map((cover) => (
              <img key={cover.className} className={cover.className} src={cover.src} alt="" width={cover.width} height={cover.height} />
            ))}
          </span>
          <span className="site-popup-audience">
            <span className="site-popup-audience-title">{COPY.audienceTitle}</span>
            <ul>
              {COPY.audiences.map((row, index) => {
                const Icon = AUDIENCE_ICONS[index] ?? Building2;
                return (
                  <li key={row.who}>
                    <Icon aria-hidden="true" />
                    <span>
                      <strong>{row.who}</strong>
                      {row.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </span>
        </Link>
        <Link className="site-popup-more" to={item.link} onClick={close}>{COPY.more}</Link>
        <div className="site-popup-foot">
          <label>
            <input type="checkbox" checked={hideTodayChecked} onChange={(event) => setHideTodayChecked(event.target.checked)} />
            {COPY.hide}
          </label>
          <button type="button" onClick={close}>{COPY.close}</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
