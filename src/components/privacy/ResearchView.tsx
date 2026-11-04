import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Building2, ChevronRight, FileDown, FileWarning, Globe } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PcMiniNav, PcSection } from "@/components/privacy/privacy-ui";
import { FeatureSplit } from "@/components/site/FeatureSplit";
import illPolicy from "@/assets/illustrations/ill-policy.svg";
import illScattered from "@/assets/illustrations/ill-scattered-data.svg";
import { CountBars, StackedBar } from "@/components/privacy/survey-visuals";
import { PRESS } from "@/data/free-platform";
import {
  AUDIT_META,
  AUDIT_QA,
  HIGH_RISK_CASES,
  HIGH_RISK_NOTE,
  HIGH_RISK_STORIES,
  LAW_ISSUES,
  LAW_NOTE,
  NOTICE_GAP_NOTE,
  ORG_TYPE_NOTE,
  POLICY_DETAILS,
  POLICY_GAP_NOTE,
  POLICY_TASKS,
  REPORT_NATURE,
  RESEARCH_DOWNLOADS,
  REPLY_CASE,
  REPLY_PRINCIPLE,
  SEPARATE_SAMPLE_NOTE,
  SURVEY,
  SURVEY_OVERVIEW,
  SURE_CHECK_CTA,
  TOOL_BAR_NOTE,
  TOOL_CERT_NOTE,
  TOOL_FRAMING,
  pct,
} from "@/data/privacy-program";

const NAV = [
  { id: "headline", label: "핵심 결과" },
  { id: "method", label: "조사 개요" },
  { id: "results", label: "주요 결과" },
  { id: "law", label: "법령·지침" },
  { id: "recommendations", label: "기관 회신" },
  { id: "audit", label: "국정감사" },
  { id: "policy", label: "개선 과제" },
  { id: "limits", label: "보고서의 성격" },
  { id: "sure-check", label: "SURE-CHECK" },
  { id: "downloads", label: "자료" },
] as const;

const RELATED_PRESS_KEYS = [
  { outlet: "전자신문", date: "2026. 10. 15." },
  { outlet: "개인정보보호위원회", date: "2026. 10. 16." },
  { outlet: "이데일리", date: "2026. 10. 12." },
] as const;

function rate(count: number, total: number) {
  return `${pct(count, total).toFixed(1)}%`;
}

function fileHref(file: string) {
  return `${import.meta.env.BASE_URL}${file}`;
}

function fileName(file: string) {
  return file.split("/").pop() ?? file;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[1.5rem] font-bold leading-snug text-navy md:text-[1.75rem]">{children}</h2>;
}

function SubTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[1.15rem] font-bold leading-snug text-navy">{children}</h3>;
}

function Note({ children }: { children: ReactNode }) {
  return <p className="text-[14px] leading-relaxed text-[#374151]">{children}</p>;
}

function Callout({ children, tone = "navy" }: { children: ReactNode; tone?: "navy" | "teal" }) {
  const edge = tone === "teal" ? "border-l-[#0F766E] bg-[#E6F4F2]" : "border-l-navy bg-[#E8EEF6]";
  return (
    <div className={`border border-[#D1D5DB] border-l-4 px-4 py-3 text-[15px] leading-relaxed text-[#111827] ${edge}`}>
      {children}
    </div>
  );
}

type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
};

function ResponsiveTable<T extends { key: string }>({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: readonly Column<T>[];
  rows: readonly T[];
}) {
  return (
    <div>
      <div className="hidden md:block">
        <table className="w-full border-collapse text-left text-[14px]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-navy text-white">
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-3 py-3 font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-[#D1D5DB] bg-white align-top">
                {columns.map((column, index) =>
                  index === 0 ? (
                    <th key={column.key} scope="row" className="px-3 py-3 font-semibold text-navy">
                      {column.render(row)}
                    </th>
                  ) : (
                    <td key={column.key} className="px-3 py-3 text-[#111827]">
                      {column.render(row)}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 md:hidden" aria-label={caption}>
        {rows.map((row) => (
          <li key={row.key} className="rounded-lg border border-[#D1D5DB] bg-white p-4">
            {columns.map((column) => (
              <div key={column.key} className="mt-2 first:mt-0">
                <div className="text-[12px] font-bold text-[#0F766E]">{column.label}</div>
                <div className="text-[14px] leading-relaxed text-[#111827]">{column.render(row)}</div>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResearchView() {
  const forms = SURVEY.forms;
  const safetyGap = SURVEY.noticeGaps[0];
  const acceptedImproved = SURVEY.replies.improved + SURVEY.replies.accepted;
  const headline = `공공기관 홈페이지 ${SURVEY.websitesSurveyed.toLocaleString("ko-KR")}곳 전수조사 — 개인정보 수집 설문 ${forms}건, 모두 보안인증 없는 서비스 사용`;
  const highRiskLine = `주민등록번호 ${SURVEY.highRisk.rrn}건, 건강·장애 정보 ${SURVEY.highRisk.healthDisability}건(${SURVEY.highRisk.both}건은 둘 다 해당) · ${SURVEY.highRisk.byTool.map((tool) => `${tool.name} ${tool.count}건`).join(", ")}`;
  const [lawOpen, setLawOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#law") setLawOpen(true);
    if (hash === "#policy") setDetailsOpen(true);
  }, []);
  const relatedPress = RELATED_PRESS_KEYS.map((key) => {
    const item = PRESS.find((press) => press.outlet === key.outlet && press.date === key.date);
    if (!item) {
      throw new Error(`관련 보도를 찾지 못했습니다: ${key.outlet} ${key.date}`);
    }
    return item;
  });

  return (
    <div className="research-page min-w-0">
      <div className="research-minnav contents">
        <PcMiniNav items={NAV} />
      </div>

      <PcSection id="headline" variant="white">
        <p className="pc-eyebrow">핵심 결과</p>
        <div className="pc-meta-chips">
          <span className="pc-meta-chip">{SURVEY.title}</span>
          <span className="pc-meta-chip">
            {SURVEY.partner} · {SURVEY.period}
          </span>
        </div>
        <h2 className="pc-lead-title">{headline}</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <article className="rounded-lg border border-[#D1D5DB] bg-white p-5">
            <p className="text-[2rem] font-bold tabular-nums leading-none text-navy">{forms.toLocaleString("ko-KR")}건</p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#111827]">개인정보 수집 설문 모두 보안인증 없는 서비스</p>
          </article>
          <article className="rounded-lg border border-[#D1D5DB] bg-white p-5">
            <p className="text-[2rem] font-bold tabular-nums leading-none text-navy">
              {safetyGap ? rate(safetyGap.count, forms) : ""}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#111827]">
              안전조치 안내 미흡, {safetyGap?.count.toLocaleString("ko-KR")}건
            </p>
          </article>
          <article className="rounded-lg border border-[#D1D5DB] bg-white p-5">
            <p className="text-[2rem] font-bold tabular-nums leading-none text-navy">
              {rate(acceptedImproved, SURVEY.replies.total)}
            </p>
            <p className="mt-3 text-[15px] font-semibold leading-relaxed text-[#111827]">
              {`회신 ${SURVEY.replies.total}곳 중 ${acceptedImproved}곳`}
            </p>
            <p className="mt-1 text-[14px] text-[#374151]">수용·개선</p>
          </article>
        </div>
        <article className="mt-3 rounded-lg border border-[#D1D5DB] border-l-4 border-l-[#0F766E] bg-white p-5">
          <p className="text-[1.35rem] font-bold tabular-nums text-navy">
            {SURVEY.highRisk.total.toLocaleString("ko-KR")}건 ({rate(SURVEY.highRisk.total, forms)})
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-[#111827]">주민등록번호·건강·장애 정보 입력 요구</p>
        </article>
      </PcSection>

      <PcSection id="method" variant="soft">
        <SectionTitle>조사 개요</SectionTitle>
        <div className="mt-6">
          <ResponsiveTable
            caption="조사 개요"
            columns={[
              { key: "label", label: "항목", render: (row) => row.label },
              { key: "value", label: "내용", render: (row) => row.value },
            ]}
            rows={SURVEY_OVERVIEW.map((row) => ({ ...row, key: row.label }))}
          />
        </div>
        <div className="mt-8 grid grid-cols-1 items-center gap-2 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
          {[
            {
              value: SURVEY.evaluationTargets.toLocaleString("ko-KR"),
              label: "진단 대상 기관",
            },
            {
              value: SURVEY.websitesSurveyed.toLocaleString("ko-KR"),
              label: "홈페이지 운영 기관(전수)",
            },
            {
              value: `${SURVEY.analyzedOrgs}개 기관 · ${forms}건`,
              label: "결과 통보·분석 대상",
            },
          ].map((step, index) => {
            const Icon = [Building2, Globe, FileWarning][index] ?? Building2;
            return (
            <div key={step.label} className="contents">
              {index > 0 ? (
                <ChevronRight className="mx-auto h-5 w-5 rotate-90 text-navy md:rotate-0" aria-hidden="true" />
              ) : null}
              <article className="flex h-full flex-col justify-center rounded-lg border border-[#D1D5DB] bg-white p-4">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F4F2]">
                  <Icon className="h-6 w-6 text-[#0F766E]" aria-hidden="true" />
                </span>
                <p className="text-[1.5rem] font-bold tabular-nums leading-tight text-navy">{step.value}</p>
                <p className="mt-2 text-[14px] font-semibold leading-snug text-[#111827]">{step.label}</p>
              </article>
            </div>
            );
          })}
        </div>
      </PcSection>

      <PcSection id="results" variant="white">
        <SectionTitle>주요 결과</SectionTitle>

        <div className="mt-8">
          <SubTitle>① 기관 유형별 현황</SubTitle>
          <div className="mt-4">
            <CountBars
              caption="기관 유형별 현황"
              max={forms}
              tone="navy"
              items={SURVEY.orgTypes.map((org) => ({
                label: org.name,
                count: org.count,
                share: rate(org.count, forms),
              }))}
            />
          </div>
          <div className="mt-4">
            <Note>{ORG_TYPE_NOTE}</Note>
          </div>
        </div>

        <div className="mt-10">
          <SubTitle>② 수집 도구와 보안인증</SubTitle>
          <div className="mt-4">
            <CountBars
              caption="수집 도구와 보안인증"
              max={forms}
              tone="teal"
              items={SURVEY.tools.map((tool) => ({
                label: tool.name,
                count: tool.count,
                share: rate(tool.count, forms),
                note: TOOL_BAR_NOTE,
              }))}
            />
          </div>
          <div className="mt-4">
            <Note>{TOOL_CERT_NOTE}</Note>
          </div>
          <div className="mt-4">
            <FeatureSplit image={illScattered}>
              <Callout tone="teal">{TOOL_FRAMING}</Callout>
            </FeatureSplit>
          </div>
        </div>

        <div className="mt-10">
          <SubTitle>③ 개인정보 처리 안내 미흡률</SubTitle>
          <div className="mt-4">
            <CountBars
              caption="개인정보 처리 안내 미흡률"
              max={forms}
              tone="gray"
              items={SURVEY.noticeGaps.map((gap) => ({
                label: gap.topic,
                count: gap.count,
                share: rate(gap.count, forms),
              }))}
            />
          </div>
          <div className="mt-4">
            <Note>{NOTICE_GAP_NOTE}</Note>
          </div>
        </div>

        <div className="mt-10">
          <SubTitle>④ 민감·고위험 정보 입력 문항({SURVEY.highRisk.total}건)</SubTitle>
          <p className="mt-3 text-[15px] font-semibold leading-relaxed text-[#111827]">{highRiskLine}</p>
          <div className="mt-4">
            <ResponsiveTable
              caption="민감·고위험 정보 입력 문항"
              columns={[
                { key: "no", label: "번호", render: (row) => row.no },
                { key: "orgType", label: "기관 유형", render: (row) => row.orgType },
                { key: "tool", label: "도구", render: (row) => row.tool },
                { key: "survey", label: "설문 성격", render: (row) => row.survey },
                { key: "requested", label: "입력 요구 정보", render: (row) => row.requested },
              ]}
              rows={HIGH_RISK_CASES.map((item, index) => ({
                ...item,
                key: `${index + 1}-${item.survey}`,
                no: String(index + 1),
              }))}
            />
          </div>
          <div className="mt-4">
            <Note>{HIGH_RISK_NOTE}</Note>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {HIGH_RISK_STORIES.map((story) => (
              <article key={story.title} className="rounded-lg border border-[#D1D5DB] bg-white p-4">
                <h4 className="text-[16px] font-bold leading-snug text-navy">{story.title}</h4>
                <p className="mt-2 text-[14px] leading-relaxed text-[#111827]">{story.body}</p>
              </article>
            ))}
          </div>
        </div>
      </PcSection>

      <PcSection id="law" variant="soft">
        <SectionTitle>구글폼·네이버폼 사용 시 관련 법령·지침</SectionTitle>
        <div className="mt-4">
          <Callout>{LAW_NOTE}</Callout>
        </div>
        <button
          type="button"
          className="btn-secondary-kcf mt-4 md:hidden"
          aria-expanded={lawOpen}
          aria-controls="law-table"
          onClick={() => setLawOpen((value) => !value)}
        >
          {lawOpen ? "법령·지침 표 접기" : "법령·지침 표 보기"}
        </button>
        <div id="law-table" className={lawOpen ? "mt-4" : "mt-4 max-md:hidden"}>
          <ResponsiveTable
            caption="구글폼·네이버폼 사용 시 관련 법령·지침"
            columns={[
              { key: "category", label: "구분", render: (row) => `${row.no} ${row.category}` },
              { key: "law", label: "관련 조항", render: (row) => row.law },
              { key: "problem", label: "이용 방식의 문제점", render: (row) => row.problem },
              { key: "finding", label: `${forms}건 중 확인 결과`, render: (row) => row.finding },
            ]}
            rows={LAW_ISSUES.map((row) => ({ ...row, key: row.no }))}
          />
        </div>
      </PcSection>

      <PcSection id="recommendations" variant="white">
        <SectionTitle>결과 통보와 기관 회신</SectionTitle>
        <p className="mt-4 text-[15px] leading-relaxed text-[#111827]">
          공문 발송 {SURVEY.noticePeriod} · 설문 1건당 1건씩 분석보고서와 회신서 서식 첨부
        </p>
        <div className="mt-6">
          <StackedBar
            caption="기관 회신 결과"
            total={SURVEY.replies.total}
            segments={[
              { label: "개선 완료", count: SURVEY.replies.improved, share: rate(SURVEY.replies.improved, SURVEY.replies.total), tone: "navy" },
              {
                label: "수용(즉시·향후 반영)",
                count: SURVEY.replies.accepted,
                share: rate(SURVEY.replies.accepted, SURVEY.replies.total),
                tone: "teal",
              },
              { label: "이의·소명", count: SURVEY.replies.objected, share: rate(SURVEY.replies.objected, SURVEY.replies.total), tone: "gray" },
            ]}
          />
        </div>
        <p className="mt-4 text-[15px] font-semibold leading-relaxed text-[#111827]">
          {`수용·개선 ${acceptedImproved}곳(${rate(acceptedImproved, SURVEY.replies.total)}) / 회신 ${SURVEY.replies.total}곳 / 통보 ${forms}건(${SURVEY.analyzedOrgs}개 기관)`}
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-[#111827]">
          회신 방법: {SURVEY.replies.methods.map((method) => `${method.name} ${method.count}`).join(" · ")}
        </p>
        <blockquote className="mt-6 border border-[#D1D5DB] border-l-4 border-l-navy bg-[#E8EEF6] px-4 py-3 text-[15px] leading-relaxed text-[#111827]">
          {REPLY_CASE}
        </blockquote>
        <p className="mt-4 text-[15px] leading-relaxed text-[#111827]">{REPLY_PRINCIPLE}</p>
      </PcSection>

      <PcSection id="audit" variant="soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
        <SectionTitle>국정감사 질의·답변</SectionTitle>
        <p className="mt-3 text-[15px] font-semibold text-[#111827]">
          {AUDIT_META.committee} ({AUDIT_META.date})
        </p>
        <div className="mt-4">
          <ResponsiveTable
            caption="국정감사 질의·답변"
            columns={[
              { key: "issue", label: "쟁점", render: (row) => row.issue },
              { key: "question", label: "질의·지적", render: (row) => row.question },
              { key: "answer", label: "답변", render: (row) => row.answer },
            ]}
            rows={AUDIT_QA.map((row) => ({ ...row, key: row.issue }))}
          />
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-[#374151]">{AUDIT_META.note}</p>
          </div>
          <img src={illPolicy} alt="" aria-hidden="true" loading="lazy" className="mx-auto hidden max-h-[280px] w-auto shrink-0 lg:block" />
        </div>
      </PcSection>

      <PcSection id="policy" variant="white">
        <SectionTitle>개선 과제</SectionTitle>
        <p className="mt-4 max-w-4xl text-[15px] leading-relaxed text-[#111827]">{POLICY_GAP_NOTE}</p>
        <div className="mt-8">
          <SubTitle>관련법과 지침의 준수</SubTitle>
          <div className="mt-4">
            <ResponsiveTable
              caption="관련법과 지침의 준수"
              columns={[
                { key: "action", label: "조치", render: (row) => row.action },
                { key: "basis", label: "적용 근거", render: (row) => row.basis },
                { key: "detail", label: "실행 내용", render: (row) => row.detail },
              ]}
              rows={POLICY_TASKS.compliance.map((row) => ({ ...row, key: row.action }))}
            />
          </div>
        </div>
        <div className="mt-8">
          <SubTitle>관계부처 공동 조치</SubTitle>
          <div className="mt-4">
            <ResponsiveTable
              caption="관계부처 공동 조치"
              columns={[
                { key: "task", label: "과제", render: (row) => row.task },
                { key: "body", label: "내용", render: (row) => row.body },
              ]}
              rows={POLICY_TASKS.joint.map((row) => ({ ...row, key: row.task }))}
            />
          </div>
        </div>
        <div className="mt-8">
          <SubTitle>세부 제언</SubTitle>
          <button
            type="button"
            className="btn-secondary-kcf mt-4 md:hidden"
            aria-expanded={detailsOpen}
            aria-controls="policy-details"
            onClick={() => setDetailsOpen((value) => !value)}
          >
            {detailsOpen ? "세부 제언 접기" : "세부 제언 보기"}
          </button>
          <div id="policy-details" className={detailsOpen ? "" : "max-md:hidden"}>
          <Accordion type="single" collapsible className="mt-4 rounded-lg border border-[#D1D5DB] bg-white">
            {POLICY_DETAILS.map((item) => (
              <AccordionItem key={item.slug} value={item.slug} className="border-[#D1D5DB] px-4">
                <AccordionTrigger className="text-left text-[15px] font-bold text-navy hover:no-underline">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-[15px] leading-relaxed text-[#111827]">
                  <p>{item.summary}</p>
                  <p>{item.background}</p>
                  <p>{item.laws}</p>
                  <p>{item.followUp}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          </div>
        </div>
      </PcSection>

      <PcSection id="limits" variant="soft">
        <SectionTitle>보고서의 성격</SectionTitle>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-[#111827]">
          {REPORT_NATURE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <p className="mt-6 text-[13px] leading-relaxed text-[#374151]">{SEPARATE_SAMPLE_NOTE}</p>
      </PcSection>

      <PcSection id="sure-check" variant="white">
        <SectionTitle>{SURE_CHECK_CTA.title}</SectionTitle>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[#111827]">{SURE_CHECK_CTA.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/privacy-center/sure-check" className="btn-primary-kcf">
            SURE-CHECK 자가진단
          </Link>
          <Link to="/privacy-center/rights" className="btn-secondary-kcf">
            지키미 모니터링단 알아보기
          </Link>
        </div>
      </PcSection>

      <PcSection id="downloads" variant="soft">
        <SectionTitle>자료</SectionTitle>
        <ul className="mt-6 grid gap-3">
          {RESEARCH_DOWNLOADS.map((item) => (
            <li key={item.file}>
              <p className="text-[15px] font-semibold text-navy">{item.label}</p>
              <a className="btn-secondary-kcf mt-2" href={fileHref(item.file)} download>
                <FileDown className="h-4 w-4" aria-hidden="true" />
                <span>{fileName(item.file)}</span>
                <span>내려받기</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <SubTitle>관련 보도</SubTitle>
          <ul className="mt-4 grid gap-3">
            {relatedPress.map((item) => (
              <li key={`${item.outlet}-${item.date}`} className="rounded-lg border border-[#D1D5DB] bg-white p-4">
                <p className="text-[13px] font-semibold text-[#374151]">
                  {item.outlet} · {item.date}
                </p>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-[15px] font-bold text-navy underline"
                  >
                    {item.title}
                    <span className="sr-only"> (새 탭)</span>
                  </a>
                ) : (
                  <p className="mt-1 text-[15px] font-bold text-navy">{item.title}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </PcSection>
    </div>
  );
}
