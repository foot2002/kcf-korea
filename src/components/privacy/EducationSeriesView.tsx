import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ClipboardList,
  Database,
  FileText,
  Play,
  Scale,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { PcMiniNav, PcSection } from "@/components/privacy/privacy-ui";
import { EDUCATION_PAGE, type EducationItem, type EducationSession } from "@/data/privacy-program";
import { useEducation } from "@/lib/content/load";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const FIELD_ICONS: Record<string, LucideIcon> = {
  법률: Scale,
  업무흐름: Workflow,
  정보수집: ClipboardList,
  내부협업: Users,
  시스템DB: Database,
};

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

  function play(next: Playback) {
    setPlayback(next);
    document.getElementById("replay")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="education-page min-w-0">
      {!focusSlug && items.length > 1 ? <EducationList items={items} /> : null}
      <div className="education-minnav contents">
        <PcMiniNav items={EDUCATION_PAGE.nav} />
      </div>
      <Replay item={current} playback={playback} onPlay={play} onClose={() => setPlayback(null)} />
      <Sessions item={current} onPlay={play} />
      <Materials item={current} />
      <About item={current} />
      <NextEducation />
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

function Replay({
  item,
  playback,
  onPlay,
  onClose,
}: {
  item: EducationItem;
  playback: Playback | null;
  onPlay: (playback: Playback) => void;
  onClose: () => void;
}) {
  const hasFullVideo = item.youtubeId.length > 0;
  return (
    <PcSection id="replay" variant="white">
      <div className="overflow-hidden rounded-lg bg-[#072A52] text-white">
        {playback ? (
          <div className="flex aspect-video min-h-[280px] flex-col md:min-h-0">
            <div className="flex items-center justify-between gap-3 px-4 py-2">
              <p className="truncate text-[14px] font-bold">{playback.title}</p>
              <button type="button" onClick={onClose} className="shrink-0 rounded-md border border-white px-3 py-1 text-[14px] font-bold">
                {EDUCATION_PAGE.closePlayer}
              </button>
            </div>
            <iframe
              className="min-h-0 w-full flex-1 border-0"
              src={embedSrc(playback)}
              title={`${playback.title} ${EDUCATION_PAGE.videoTitleSuffix}`}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
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
              {hasFullVideo ? null : <p className="text-[14px] font-semibold text-white">{EDUCATION_PAGE.pendingVideo}</p>}
            </div>
          </div>
        )}
      </div>
    </PcSection>
  );
}

function Sessions({ item, onPlay }: { item: EducationItem; onPlay: (playback: Playback) => void }) {
  return (
    <PcSection id="sessions" variant="soft">
      <h2 className="text-[1.5rem] font-bold text-navy md:text-[1.75rem]">{EDUCATION_PAGE.sessionsTitle}</h2>
      <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-3 md:overflow-visible xl:grid-cols-5">
        {item.sessions.map((session) => {
          const source = playbackFor(item, session);
          const FieldIcon = FIELD_ICONS[session.field];
          return (
            <article key={session.no} id={`session-${session.no}`} className="w-[80%] shrink-0 snap-start md:w-auto">
              <button
                type="button"
                onClick={() => {
                  if (source) onPlay(source);
                }}
                className="flex h-full w-full flex-col rounded-lg border border-[#D1D5DB] bg-white p-3 text-left"
              >
                <span className="relative block aspect-video overflow-hidden rounded-md bg-[#072A52]">
                  {session.youtubeId ? (
                    <img
                      src={`https://i.ytimg.com/vi/${session.youtubeId}/hqdefault.jpg`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="absolute inset-x-2 top-2 flex items-start justify-between text-white">
                      <span className="text-[1.75rem] font-bold leading-none">{session.no}</span>
                      {FieldIcon ? <FieldIcon className="h-5 w-5 shrink-0" aria-hidden="true" /> : null}
                    </span>
                  )}
                  <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy">
                    <Play className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span
                    className={`absolute right-2 rounded-sm bg-[#072A52] px-1.5 py-0.5 text-[12px] font-bold text-white ${source ? "bottom-2" : "bottom-8"}`}
                  >
                    {session.durationLabel}
                  </span>
                  {source ? null : (
                    <span className="absolute inset-x-0 bottom-0 bg-[#072A52] px-2 py-1 text-center text-[12px] font-bold text-white">
                      {EDUCATION_PAGE.pendingVideo}
                    </span>
                  )}
                </span>
                <span className="mt-3 inline-flex w-fit rounded-sm border border-[#0F766E] px-2 py-0.5 text-[12px] font-bold text-[#0F766E]">
                  {session.field}
                </span>
                <span className="mt-2 line-clamp-2 text-[15px] font-bold leading-snug text-navy">{session.title}</span>
                <span className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#374151]">{session.summary}</span>
                <span className="mt-auto block pt-3">
                  {session.logo ? (
                    <img src={session.logo} alt="" className="h-5 w-auto max-w-full object-contain object-left" />
                  ) : null}
                  <span className="mt-1 block text-[13px] font-semibold leading-snug text-[#111827]">{session.speaker}</span>
                </span>
                <span className="mt-1 text-[13px] tabular-nums text-[#374151]">
                  {session.start}~{session.end}
                </span>
              </button>
              {source ? (
                <a
                  href={watchHref(source)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-[13px] font-bold text-navy underline"
                >
                  {EDUCATION_PAGE.watchOnYoutube}
                  <span className="sr-only"> ({EDUCATION_PAGE.newTab})</span>
                </a>
              ) : null}
            </article>
          );
        })}
      </div>
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
  const logoBySpeaker = new Map(item.sessions.map((session) => [session.speaker, session.logo]));
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
              const logo = logoBySpeaker.get(name);
              return (
                <li key={name} className="flex items-center">
                  {logo ? (
                    <img src={logo} alt={name} className="h-5 w-auto max-w-[120px] object-contain" />
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
