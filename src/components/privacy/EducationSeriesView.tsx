import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download, Expand, FileText, Play, User } from "lucide-react";

import heroWebinar from "@/assets/illustrations/hero-webinar.svg";
import { PcMiniNav, PcSection } from "@/components/privacy/privacy-ui";
import { EDUCATION_PAGE, type EducationItem, type EducationSession } from "@/data/privacy-program";
import { useEducation } from "@/lib/content/load";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

type Playback = {
  youtubeId: string;
  startSec: number | null;
  title: string;
};

function formatKoreanDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${year}. ${month}. ${day}.(${weekday})`;
}

function playbackFor(item: EducationItem, session: EducationSession): Playback | null {
  if (session.youtubeId) return { youtubeId: session.youtubeId, startSec: null, title: session.title };
  if (item.youtubeId && session.startSec != null) {
    return { youtubeId: item.youtubeId, startSec: session.startSec, title: session.title };
  }
  return null;
}

function embedSrc(playback: Playback) {
  const start = playback.startSec != null ? `&start=${playback.startSec}` : "";
  return `https://www.youtube-nocookie.com/embed/${playback.youtubeId}?autoplay=1&rel=0${start}`;
}

function watchHref(playback: Playback) {
  const start = playback.startSec != null ? `&t=${playback.startSec}` : "";
  return `https://www.youtube.com/watch?v=${playback.youtubeId}${start}`;
}

function fileHref(file: string) {
  return `${import.meta.env.BASE_URL}${file}`;
}

function inquiryHref() {
  return "/contact?type=" + encodeURIComponent("교육·웨비나");
}

export function EducationSeries({ focusSlug }: { focusSlug?: string }) {
  const items = useEducation()
    .filter((item) => item.published)
    .sort((a, b) => b.date.localeCompare(a.date));
  const current = focusSlug ? items.find((item) => item.slug === focusSlug) : items[0];
  const [playback, setPlayback] = useState<Playback | null>(null);

  if (!current) {
    return (
      <PcSection variant="white">
        <p className="text-[15px] text-[#111827]">{EDUCATION_PAGE.notFound}</p>
      </PcSection>
    );
  }

  return (
    <div className="education-page min-w-0">
      {!focusSlug && items.length > 1 ? <EducationList items={items} /> : null}
      <div className="education-minnav contents">
        <PcMiniNav items={EDUCATION_PAGE.nav} />
      </div>
      <Replay item={current} onPlay={setPlayback} />
      <Sessions item={current} onPlay={setPlayback} />
      <Materials item={current} />
      <About item={current} />
      <NextEducation />
      {playback ? <LargePlayer playback={playback} onClose={() => setPlayback(null)} /> : null}
    </div>
  );
}

function EducationList({ items }: { items: EducationItem[] }) {
  return (
    <PcSection variant="white">
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              to="/privacy-center/education/$slug"
              params={{ slug: item.slug }}
              className="block rounded-lg border border-[#D1D5DB] bg-white p-4 hover:border-navy"
            >
              <p className="text-[13px] font-semibold text-[#0F766E]">
                {formatKoreanDate(item.date)} · {item.mode}
              </p>
              <p className="mt-1 text-[18px] font-bold text-navy">{item.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </PcSection>
  );
}

function Replay({ item, onPlay }: { item: EducationItem; onPlay: (playback: Playback) => void }) {
  const hasFullVideo = item.youtubeId.length > 0;
  return (
    <PcSection id="replay" variant="white">
      <div className="overflow-hidden rounded-lg bg-[#072A52] text-white">
        <div className="flex aspect-video min-h-[420px] flex-col justify-center px-5 py-6 md:min-h-0 md:px-10">
          <p className="text-[12px] font-bold tracking-wide text-[#5EEAD4]">{EDUCATION_PAGE.replayKicker}</p>
          <h2 className="mt-3 max-w-3xl text-[1.35rem] font-bold leading-snug text-white md:text-[1.75rem]">{item.title}</h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-white">{item.subtitle}</p>
          <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-[#E8EEF6]">{item.lawNote}</p>
          <p className="mt-4 text-[15px] font-semibold text-white">
            {formatKoreanDate(item.date)} {item.timeLabel} · {item.mode}
          </p>
          <p className="mt-2 text-[1.15rem] font-bold text-white">
            {EDUCATION_PAGE.applicantsPrefix} {item.applicantsLabel}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!hasFullVideo}
              onClick={() => onPlay({ youtubeId: item.youtubeId, startSec: null, title: item.title })}
              className="rounded-md bg-white px-4 py-2.5 text-[15px] font-bold text-navy disabled:cursor-not-allowed disabled:opacity-60"
            >
              {EDUCATION_PAGE.watchAll}
            </button>
            <a href="#materials" className="rounded-md border border-white px-4 py-2.5 text-[15px] font-bold text-white">
              {EDUCATION_PAGE.getMaterials}
            </a>
          </div>
        </div>
      </div>
    </PcSection>
  );
}

function LargePlayer({ playback, onClose }: { playback: Playback; onClose: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function watchLarge() {
    const stage = stageRef.current;
    if (!stage) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    void stage.requestFullscreen();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#041E3D]/85 p-3 md:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${playback.title} ${EDUCATION_PAGE.videoTitleSuffix}`}
        className="w-full max-w-6xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-[15px] font-bold text-white">{playback.title}</p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button type="button" onClick={watchLarge} className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[14px] font-bold text-navy">
              <Expand className="h-4 w-4" aria-hidden="true" />
              {EDUCATION_PAGE.watchLarge}
            </button>
            <a
              href={watchHref(playback)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white px-3 py-1.5 text-[14px] font-bold text-white"
            >
              {EDUCATION_PAGE.watchOnYoutube}
              <span className="sr-only"> ({EDUCATION_PAGE.newTab})</span>
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="rounded-md border border-white px-3 py-1.5 text-[14px] font-bold text-white"
            >
              {EDUCATION_PAGE.closePlayer}
            </button>
          </div>
        </div>
        <div ref={stageRef} className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <iframe
            className="h-full w-full border-0"
            src={embedSrc(playback)}
            title={`${playback.title} ${EDUCATION_PAGE.videoTitleSuffix}`}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
}

function SessionPoster({ session, source, onPlay }: { session: EducationSession; source: Playback | null; onPlay: (playback: Playback) => void }) {
  const thumb = session.poster
    ? fileHref(session.poster)
    : session.youtubeId
      ? `https://i.ytimg.com/vi/${session.youtubeId}/hqdefault.jpg`
      : heroWebinar;
  const frame = (
    <span className="block rounded-lg border border-[#072A52] bg-[#072A52] p-1.5">
      <span className="relative block aspect-video overflow-hidden rounded-md bg-[#041E3D]">
        <img src={thumb} alt="" className={`h-full w-full ${session.youtubeId || session.poster ? "object-cover" : "object-contain"}`} />
        <span className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-white/40" />
        {session.durationLabel ? (
          <span className="absolute right-2.5 top-2.5 rounded-sm bg-[#072A52] px-2 py-1 text-[13px] font-bold text-white">
            {session.durationLabel}
          </span>
        ) : null}
        {source ? null : (
          <span className="absolute left-2.5 top-2.5 rounded-sm bg-[#072A52] px-2 py-1 text-[13px] font-bold text-white">
            {EDUCATION_PAGE.pendingVideo}
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-[#072A52] px-3 py-2.5">
          <span className="min-w-0 flex-1" aria-hidden="true">
            <span className="block text-[12px] font-bold tracking-wide text-[#5EEAD4]">{session.no}</span>
            <span className="mt-0.5 line-clamp-2 block text-[14px] font-bold leading-snug text-white">{session.title}</span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white text-white">
            <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />
          </span>
        </span>
      </span>
      <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/25" aria-hidden="true">
        <span className="block h-full w-1/4 bg-[#5EEAD4]" />
      </span>
    </span>
  );

  if (!source) return <div className="w-full shrink-0 lg:w-[46%] lg:max-w-[520px]">{frame}</div>;

  return (
    <a
      href={watchHref(source)}
      onClick={(event) => {
        event.preventDefault();
        onPlay(source);
      }}
      aria-label={`${session.title} ${EDUCATION_PAGE.playVideo}`}
      className="block w-full shrink-0 cursor-pointer text-left lg:w-[46%] lg:max-w-[520px]"
    >
      {frame}
    </a>
  );
}

function Sessions({ item, onPlay }: { item: EducationItem; onPlay: (playback: Playback) => void }) {
  return (
    <PcSection id="sessions" variant="soft">
      <h2 className="text-[1.5rem] font-bold text-navy md:text-[1.75rem]">{EDUCATION_PAGE.sessionsTitle}</h2>
      <ul className="mt-6 flex flex-col gap-6">
        {item.sessions.map((session) => {
          const source = playbackFor(item, session);
          return (
            <li key={session.no} id={`session-${session.no}`}>
              <article className="flex flex-col gap-5 rounded-lg border border-[#D1D5DB] bg-white p-4 md:p-6 lg:flex-row lg:items-stretch lg:gap-8">
                <SessionPoster session={session} source={source} onPlay={onPlay} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="inline-flex w-fit rounded-sm border border-[#0F766E] px-2 py-0.5 text-[13px] font-bold text-[#0F766E]">
                    {session.field}
                  </span>
                  <h3 className="mt-3 text-[1.35rem] font-bold leading-snug text-navy md:text-[1.6rem]">{session.title}</h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-[#111827]">{session.summary}</p>
                  <p className="mt-4 flex items-start gap-2 text-[15px] font-semibold leading-snug text-[#111827]">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" aria-hidden="true" />
                    <span>{session.speakerLabel || session.speaker}</span>
                  </p>
                  {session.materialFile ? (
                    <div className="mt-5 lg:mt-auto lg:pt-6">
                      <a className="btn-secondary-kcf" href={fileHref(session.materialFile)} download>
                        <Download className="h-4 w-4" aria-hidden="true" />
                        {EDUCATION_PAGE.downloadMaterial}
                      </a>
                    </div>
                  ) : null}
                  {source ? (
                    <a
                      href={watchHref(source)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-[14px] font-bold text-navy underline"
                    >
                      {EDUCATION_PAGE.watchOnYoutube}
                      <span className="sr-only"> ({EDUCATION_PAGE.newTab})</span>
                    </a>
                  ) : null}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[13px] leading-relaxed text-[#4B5563]">{item.vendorNotice}</p>
    </PcSection>
  );
}

function Materials({ item }: { item: EducationItem }) {
  return (
    <PcSection id="materials" variant="white">
      <h2 className="text-[1.5rem] font-bold text-navy md:text-[1.75rem]">{EDUCATION_PAGE.nav[2].label}</h2>
      <ul className="mt-6 grid gap-3">
        {item.materials.map((material) => (
          <li key={material.file} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#D1D5DB] bg-white p-4">
            <span className="flex items-center gap-2 text-[15px] font-semibold text-navy">
              <FileText className="h-5 w-5" aria-hidden="true" />
              {material.label}
            </span>
            {material.ready ? (
              <a className="btn-secondary-kcf" href={fileHref(material.file)} download>
                {EDUCATION_PAGE.download}
              </a>
            ) : (
              <button type="button" disabled className="btn-secondary-kcf cursor-not-allowed opacity-60">
                {EDUCATION_PAGE.pendingFile}
              </button>
            )}
          </li>
        ))}
      </ul>
    </PcSection>
  );
}

function About({ item }: { item: EducationItem }) {
  const sessionBySpeaker = new Map(item.sessions.map((session) => [session.speaker, session]));
  return (
    <PcSection id="about" variant="soft">
      <h2 className="text-[1.5rem] font-bold text-navy md:text-[1.75rem]">{EDUCATION_PAGE.nav[3].label}</h2>
      <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[#111827]">{item.summary}</p>
      <ol className="mt-6 grid gap-3 md:grid-cols-2">
        {item.highlights.map((highlight, index) => (
          <li key={highlight} className="rounded-lg border border-[#D1D5DB] bg-white p-4">
            <span className="text-[13px] font-bold text-[#0F766E]">{String(index + 1).padStart(2, "0")}</span>
            <p className="mt-2 text-[15px] leading-relaxed text-[#111827]">{highlight}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 space-y-4">
        <p className="text-[15px] leading-relaxed text-[#111827]">
          <span className="font-bold text-navy">{EDUCATION_PAGE.hostLabel}</span> {item.host}
        </p>
        <div>
          <p className="text-[15px] font-bold text-navy">{EDUCATION_PAGE.organizerLabel}</p>
          <ul className="mt-2 flex flex-wrap items-center gap-4">
            {item.organizers.map((name) => {
              const session = sessionBySpeaker.get(name);
              const logo = session?.logo;
              return (
                <li key={name} className="flex items-center">
                  {logo ? (
                    session.logoOnDark ? (
                      <span className="inline-flex items-center rounded-md bg-[#072A52] px-2.5 py-1.5">
                        <img src={logo} alt={name} className="h-5 w-auto max-w-[140px] object-contain" />
                      </span>
                    ) : (
                      <img src={logo} alt={name} className="h-5 w-auto max-w-[120px] object-contain" />
                    )
                  ) : (
                    <span className="text-[14px] font-semibold text-[#111827]">{name}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <p className="text-[15px] leading-relaxed text-[#111827]">
          <span className="font-bold text-navy">{EDUCATION_PAGE.cohostLabel}</span> {item.cohosts.join(" · ")}
        </p>
      </div>
      <p className="mt-6 text-[13px] leading-relaxed text-[#4B5563]">{item.vendorNotice}</p>
    </PcSection>
  );
}

function NextEducation() {
  return (
    <PcSection id="next" variant="white">
      <h2 className="text-[1.5rem] font-bold text-navy md:text-[1.75rem]">{EDUCATION_PAGE.nav[4].label}</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[#111827]">{EDUCATION_PAGE.nextNotice}</p>
      <a className="btn-primary-kcf mt-5" href={inquiryHref()}>
        {EDUCATION_PAGE.inquiry}
      </a>
    </PcSection>
  );
}
