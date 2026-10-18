import { Link } from "@tanstack/react-router";

import { CountBars, OrgNotice } from "@/components/privacy/survey-visuals";
import { PcSection, PcSectionHeader } from "@/components/privacy/privacy-ui";
import {
  AUDIT_NOTE,
  POLICY_ITEMS,
  SEPARATE_SAMPLE_NOTE,
  SURVEY,
  SURVEY_LIMITS,
  SURVEY_UNTAGGED_FORMS,
} from "@/data/privacy-program";

const FLOW = [
  { label: "보호수준 평가 대상", value: SURVEY.evaluationTargets, unit: "기관" },
  { label: "홈페이지 운영 전수조사", value: SURVEY.websitesSurveyed, unit: "기관" },
  { label: "외부 설문폼 진단", value: SURVEY.externalForms, unit: "설문폼" },
  { label: "개인정보 입력 문항", value: SURVEY.formsWithPersonalInfo, unit: "설문폼" },
  { label: "민감·고위험 문항", value: SURVEY.highRiskForms, unit: "설문폼" },
] as const;

export function ResearchView() {
  return (
    <>
      <PcSection variant="white">
        <PcSectionHeader
          eyebrow="조사 개요"
          title={SURVEY.title}
          description={`조사기간 ${SURVEY.periodLabel}. 개인정보 보호수준 평가 대상 공공기관 ${SURVEY.evaluationTargets.toLocaleString("ko-KR")}개 중 홈페이지를 운영하는 ${SURVEY.websitesSurveyed.toLocaleString("ko-KR")}개 기관의 공식 홈페이지를 전수 확인했습니다.`}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-[var(--pc-soft-blue)] p-5">
            <h3 className="text-[15px] font-bold text-navy">조사 방법</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
              SURE-CHECK 자동진단도구로 공개된 설문·신청 링크를 확인하고, 자동진단 결과를 전문가가 다시 확인했습니다.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-white p-5">
            <h3 className="text-[15px] font-bold text-navy">단위</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
              앞의 두 단계는 기관 수입니다. 외부 설문폼 진단부터는 설문폼 수입니다.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-white p-5">
            <h3 className="text-[15px] font-bold text-navy">보고서 파일</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
              원문 파일이 등록되기 전에는 다운로드 버튼을 두지 않습니다. 공개 요약은 이 페이지와 자료실에서 볼 수 있습니다.
            </p>
            <Link to="/privacy-center/publications/$slug" params={{ slug: "2026-public-collection-survey" }} className="mt-3 inline-block text-[14px] font-semibold text-trust-blue">
              자료실에서 보기
            </Link>
          </article>
        </div>
      </PcSection>

      <PcSection id="results" variant="soft">
        <PcSectionHeader eyebrow="흐름" title="조사 대상에서 분석 대상까지" />
        <ol className="mt-8 grid gap-3 lg:grid-cols-5">
          {FLOW.map((step, index) => (
            <li key={step.label} className="rounded-2xl border border-border bg-white p-4">
              <div className="text-[12px] font-bold text-trust-blue">0{index + 1}</div>
              <div className="mt-2 text-[28px] font-bold tabular-nums text-navy">
                {step.value.toLocaleString("ko-KR")}
              </div>
              <div className="text-[12px] font-semibold text-[#0F766E]">{step.unit}</div>
              <div className="mt-2 text-[13.5px] font-medium leading-snug text-text-primary">{step.label}</div>
            </li>
          ))}
        </ol>
      </PcSection>

      <PcSection variant="white">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <PcSectionHeader
              eyebrow="설문도구"
              title="개인정보 입력 문항 161건의 도구"
              description="아래 막대는 외부 설문폼 전체 341건이 아니라, 개인정보 입력 문항이 있는 161건의 구성입니다."
            />
            <div className="mt-6">
              <CountBars
                max={SURVEY.formsWithPersonalInfo}
                items={SURVEY.tools.map((tool) => ({ label: tool.name, count: tool.count }))}
              />
            </div>
          </div>
          <div>
            <PcSectionHeader
              eyebrow="기관 유형"
              title="유형이 요약에 적힌 설문폼"
              description={`${SURVEY.typedFormsLabel} ${SURVEY.typedForms.toLocaleString("ko-KR")}건은 개인정보 입력 문항 161건의 ${SURVEY.typedFormsShare}%입니다.`}
            />
            <div className="mt-6">
              <CountBars
                max={SURVEY.formsWithPersonalInfo}
                items={[
                  { label: SURVEY.typedFormsLabel, count: SURVEY.typedForms, hint: `161건 중 ${SURVEY.typedFormsShare}%` },
                  { label: "요약에 유형이 따로 제시되지 않은 설문폼", count: SURVEY_UNTAGGED_FORMS, hint: "다른 기관 유형으로 이름 붙이지 않았습니다." },
                ]}
              />
            </div>
          </div>
        </div>
      </PcSection>

      <PcSection variant="soft">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <PcSectionHeader
              eyebrow="고위험 문항"
              title="민감·고위험 문항이 보인 설문폼"
              description="11건은 개인정보 입력 문항 161건 안에서 확인된 설문폼 수입니다. 유출 사고 건수가 아닙니다."
            />
            <div className="mt-6">
              <CountBars
                max={SURVEY.formsWithPersonalInfo}
                items={[{ label: "민감·고위험 문항 확인", count: SURVEY.highRiskForms }]}
              />
            </div>
          </div>
          <div>
            <PcSectionHeader
              eyebrow="안내 점검"
              title="안내가 없거나 일부만 표시된 설문폼"
              description="개인정보 입력 문항이 있는 161건을 기준으로 항목별 건수를 세었습니다. 항목마다 모수가 같아서 합이 161을 넘을 수 있습니다. 안내가 없다는 사실만으로 법령 위반은 아닙니다."
            />
            <div className="mt-6">
              <CountBars
                max={SURVEY.formsWithPersonalInfo}
                items={SURVEY.noticeGaps.map((gap) => ({ label: `${gap.topic} 안내 없거나 일부 표시`, count: gap.count }))}
              />
            </div>
          </div>
        </div>
      </PcSection>

      <PcSection variant="white">
        <PcSectionHeader eyebrow="시사점" title="주요 정책적 시사점" description="조사에서 확인된 화면을 바탕으로 한 제안입니다. 채택 여부는 각 제안의 진행상태에 따로 적습니다." />
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {POLICY_ITEMS.map((item, index) => (
            <li key={item.slug} className="rounded-2xl border border-border bg-white p-5">
              <div className="text-[12px] font-bold text-trust-blue">제안 {index + 1}</div>
              <h3 className="mt-2 text-[18px] font-bold text-navy">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{item.summary}</p>
              <Link to="/privacy-center/policy/$slug" params={{ slug: item.slug }} className="mt-3 inline-block text-[14px] font-semibold text-trust-blue">
                제안 상세
              </Link>
            </li>
          ))}
        </ul>
      </PcSection>

      <PcSection variant="soft">
        <PcSectionHeader eyebrow="한계" title="이 조사가 말하지 않는 것" />
        <ul className="mt-6 space-y-3">
          {SURVEY_LIMITS.map((item) => (
            <li key={item} className="rounded-xl border border-border bg-white px-4 py-3 text-[14px] leading-relaxed text-text-secondary">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8 rounded-2xl border border-border bg-white p-5">
          <h3 className="text-[16px] font-bold text-navy">{AUDIT_NOTE.title}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{AUDIT_NOTE.body}</p>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">{SEPARATE_SAMPLE_NOTE}</p>
          <a className="mt-3 inline-block text-[14px] font-semibold text-trust-blue" href="https://www.etnews.com/20261015000353" target="_blank" rel="noopener noreferrer">
            전자신문 기사 보기
          </a>
        </div>
        <div className="mt-6">
          <OrgNotice />
        </div>
      </PcSection>
    </>
  );
}
