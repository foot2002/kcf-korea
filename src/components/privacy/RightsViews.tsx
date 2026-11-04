import { Link } from "@tanstack/react-router";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

import { MonitorPreapplyForm } from "@/components/forms/PublicForms";
import { PcMiniNav } from "@/components/privacy/privacy-ui";
import { FeatureSplit } from "@/components/site/FeatureSplit";
import illMonitor from "@/assets/illustrations/ill-monitor.svg";
import {
  DATA_SUBJECT_RIGHTS,
  MONITOR_ACTIVITIES,
  MONITOR_PAGE,
  MONITOR_RULES,
} from "@/data/privacy-program";
import { useMonitor } from "@/lib/content/load";

function Section({ id, children, tone = "white" }: { id?: string; children: ReactNode; tone?: "white" | "soft" }) {
  const bg = tone === "soft" ? "bg-[#F3F4F6]" : "bg-white";
  return (
    <section id={id} className={`scroll-mt-40 border-t border-[#D1D5DB] ${bg}`}>
      <div className="container-page py-12 md:py-16">{children}</div>
    </section>
  );
}

const EMPTY_MONITOR = "선발 공지 때 안내";

function monitorValue(value: string) {
  return value.trim() || EMPTY_MONITOR;
}

export function RightsView() {
  const monitor = useMonitor();
  const about = MONITOR_PAGE.nav[0];
  const join = MONITOR_PAGE.nav[1];
  const preApply = MONITOR_PAGE.nav[2];
  const rules = MONITOR_PAGE.nav[3];
  const hasDetail =
    Boolean(monitor.recruitPeriod.trim() || monitor.activityPeriod.trim() || monitor.headcount.trim() || monitor.noticeLink.trim()) ||
    monitor.benefits.length > 0;
  return (
    <div className="min-w-0">
      <PcMiniNav items={MONITOR_PAGE.nav} />
      <Section id={about.id}>
        <h2 className="text-navy">{about.label}</h2>
        <div className="mt-6">
          <FeatureSplit image={illMonitor}>
            <p className="text-[16px] leading-relaxed text-[#374151]">{MONITOR_PAGE.lead}</p>
          </FeatureSplit>
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {MONITOR_PAGE.about.map((item) => (
            <li key={item.title} className="rounded-md border border-[#D1D5DB] bg-white p-5">
              <h3 className="text-[18px] font-bold text-navy">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#374151]">{item.body}</p>
            </li>
          ))}
        </ul>
        <Link to="/privacy-center/sure-check" className="btn-primary-kcf mt-6">
          {MONITOR_PAGE.sureCheck}
        </Link>
      </Section>
      <Section id={join.id} tone="soft">
        <h2 className="text-navy">{join.label}</h2>
        <p className="mt-4">
          <span className="inline-flex rounded-md border border-[#D1D5DB] bg-white px-2 py-1 text-[13px] font-bold text-[#0B3A6E]">
            {monitor.status || "모집 예정"}
          </span>
        </p>
        {hasDetail ? (
          <dl className="mt-4 grid max-w-3xl gap-3 rounded-md border border-[#D1D5DB] bg-white p-4 text-[15px] text-[#111827]">
            <div>
              <dt className="font-bold text-navy">모집 기간</dt>
              <dd>{monitorValue(monitor.recruitPeriod)}</dd>
            </div>
            <div>
              <dt className="font-bold text-navy">활동 기간</dt>
              <dd>{monitorValue(monitor.activityPeriod)}</dd>
            </div>
            <div>
              <dt className="font-bold text-navy">모집 인원</dt>
              <dd>{monitorValue(monitor.headcount)}</dd>
            </div>
            <div>
              <dt className="font-bold text-navy">활동 혜택</dt>
              <dd>
                {monitor.benefits.length > 0 ? (
                  <ul className="mt-1 list-disc pl-5">
                    {monitor.benefits.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  EMPTY_MONITOR
                )}
              </dd>
            </div>
            {monitor.noticeLink.trim() ? (
              <div>
                <dt className="font-bold text-navy">선발 공지</dt>
                <dd>
                  <a href={monitor.noticeLink} className="font-bold text-[#0B3A6E] underline">
                    선발 공지 보기
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="mt-4 flex gap-2 rounded-md border border-[#D1D5DB] bg-white p-4 text-[15px] leading-relaxed text-[#111827]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0B3A6E]" aria-hidden="true" />
            <span>{MONITOR_PAGE.pendingNote}</span>
          </p>
        )}
        <ul aria-label={MONITOR_PAGE.activitiesLabel} className="mt-6 flex flex-wrap gap-2">
          {MONITOR_ACTIVITIES.map((item) => (
            <li key={item} className="rounded-md border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] font-semibold text-navy">
              {item}
            </li>
          ))}
        </ul>
      </Section>
      <Section id={preApply.id}>
        <h2 className="text-navy">{MONITOR_PAGE.preApply.title}</h2>
        <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#374151]">{MONITOR_PAGE.preApply.body}</p>
        <MonitorPreapplyForm />
        <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-[#374151]">
          {MONITOR_PAGE.preApply.privacy}{" "}
          <Link to="/privacy-policy" className="font-bold text-navy underline">
            {MONITOR_PAGE.privacyPolicy}
          </Link>
        </p>
      </Section>
      <Section id={rules.id} tone="soft">
        <h2 className="text-navy">{rules.label}</h2>
        <ol className="mt-6 grid max-w-3xl gap-2">
          {MONITOR_RULES.map((rule, index) => (
            <li key={rule} className="flex gap-3 rounded-md border border-[#D1D5DB] bg-white px-4 py-3 text-[15px] leading-relaxed text-[#111827]">
              <span className="font-bold text-[#0B3A6E]">{index + 1}.</span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex gap-2 rounded-md border border-[#0F766E] border-l-4 bg-white p-4 text-[15px] font-semibold leading-relaxed text-[#111827]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" aria-hidden="true" />
          <span>{MONITOR_PAGE.officialReport}</span>
        </p>
        <details className="mt-8 max-w-3xl rounded-md border border-[#D1D5DB] bg-white">
          <summary className="cursor-pointer px-4 py-3 text-[16px] font-bold text-navy">{DATA_SUBJECT_RIGHTS.title}</summary>
          <div className="border-t border-[#D1D5DB] px-4 py-4">
            <p className="text-[15px] leading-relaxed text-[#374151]">{DATA_SUBJECT_RIGHTS.lead}</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {DATA_SUBJECT_RIGHTS.items.map((item) => (
                <li key={item} className="rounded-md border border-[#D1D5DB] px-3 py-2 text-[15px] font-bold text-navy">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </details>
      </Section>
    </div>
  );
}
