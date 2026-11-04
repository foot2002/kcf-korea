import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FormInput, Info, Layers, LockKeyhole, Radar } from "lucide-react";

/* ---------- Section 2. Why ---------- */
export function PrivacyMissionSection() {
  const items = [
    {
      icon: Layers,
      title: "개인정보 범위 확대",
      desc: "이름·연락처·이메일뿐 아니라 부서, 직급, 나이, 지역, IP, 기기정보, 주관식 응답 등도 결합 시 개인정보가 될 수 있습니다.",
      num: "01",
    },
    {
      icon: FormInput,
      title: "온라인 수집 리스크 증가",
      desc: "설문, 행사 접수, 교육 신청, 이벤트, 고객 만족도 조사 등 일상적 업무에서도 개인정보 처리가 발생할 수 있습니다.",
      num: "02",
    },
    {
      icon: Radar,
      title: "신고와 모니터링 중요성 확대",
      desc: "국민 누구나 침해 사실을 발견하고 신고할 수 있는 환경으로 전환되고 있습니다.",
      num: "03",
    },
    {
      icon: LockKeyhole,
      title: "예방 중심 체계 필요",
      desc: "사후 대응보다 수집 설계, 접근권한, 로그관리, 파기 증빙, 위탁관리 등 예방 체계가 중요해지고 있습니다.",
      num: "04",
    },
  ];

  return (
    <section className="section-y">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">Why Privacy Protection</div>
          <h2 className="text-navy">
            개인정보보호는 선택이 아니라 국민 권리 보호의 기본입니다
          </h2>
          <p className="privacy-desc mt-6">
            개인정보보호법상 개인정보의 범위는 매우 넓으며, 이름·연락처·이메일
            같은 직접 식별정보뿐 아니라 부서, 직급, 나이, 지역, IP, 기기정보,
            주관식 응답 등도 다른 정보와 결합될 경우 개인정보가 될 수 있습니다.
            온라인 설문, 행사 접수, 교육 신청, 내부 직원 조사, 외부 용역 조사
            등 일상적인 업무에서도 개인정보 처리 리스크가 발생할 수 있습니다.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div
                key={it.title}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E8EDF3] bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-trust-blue/20 hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
              >
                <div
                  className="pointer-events-none absolute -right-2 top-0 text-[3.25rem] font-black leading-none text-[#EEF2F7]"
                  aria-hidden
                >
                  {it.num}
                </div>

                <div className="relative flex items-start justify-between gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4F7FB] text-navy ring-1 ring-[#E8EDF3] transition duration-300 group-hover:bg-[#EFF6FF] group-hover:ring-trust-blue/15">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.12em] text-trust-blue/60">
                    {it.num}
                  </span>
                </div>

                <div className="relative mt-4 flex flex-1 flex-col">
                  <div className="text-[15px] font-bold leading-snug text-navy">
                    {it.title}
                  </div>
                  <p className="mt-2.5 text-[13px] leading-[1.7] text-text-secondary">
                    {it.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* ---------- Section 6. Law Change Table ---------- */
export function PrivacyLawChangeSection() {
  const rows = [
    {
      k: "과징금 상한",
      before: "관련 매출액 기준 일정 비율 적용",
      after: "전체 매출액 기준으로 상향 적용 (제도 변화 방향)",
    },
    {
      k: "대표자 책임",
      before: "주로 실무 부서 단위 책임",
      after: "대표이사 등 경영진의 관리 책임이 강조되는 방향",
    },
    {
      k: "점검 방식",
      before: "사후 사고 발생 시 조사 중심",
      after: "현장 실사·상시 모니터링 등 사전 점검 강화 방향",
    },
    {
      k: "예방투자 기업 혜택",
      before: "예방투자에 대한 별도 고려 미흡",
      after: "사전 예방체계 마련 기업에 대한 처분 감경 등 검토",
    },
    {
      k: "유출 가능성 통지",
      before: "실제 유출 확인 시 통지 중심",
      after: "유출 가능성 단계의 선제적 통지 의무 확대 방향",
    },
    {
      k: "CPO 보고 의무",
      before: "지정·운영 중심",
      after: "경영진 직보고 및 독립성 강화 방향",
    },
    {
      k: "정보보호 공시 확대",
      before: "일부 대상에 한정",
      after: "공시 대상 범위 및 항목 확대 검토 방향",
    },
  ];
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">Regulatory Trend</div>
          <h2 className="text-navy">
            개인정보보호 환경이 사후 대응에서 예방 중심으로 바뀌고 있습니다
          </h2>
          <p className="privacy-desc mt-5">
            아래 비교는 첨부자료 기준의 제도 변화 방향을 정리한 것으로,
            구체적인 적용은 사안별 법률 검토와 사전 점검이 필요합니다.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[#E5E7EB]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[14.5px]">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-5 py-4 font-semibold w-[22%]">항목</th>
                  <th className="px-5 py-4 font-semibold w-[39%]">개정 전 (기존)</th>
                  <th className="px-5 py-4 font-semibold w-[39%]">변화 방향</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.k} className={i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                    <th className="align-top px-5 py-4 font-bold text-navy border-b border-[#E5E7EB]">
                      {r.k}
                    </th>
                    <td className="align-top px-5 py-4 text-text-secondary border-b border-[#E5E7EB]">
                      {r.before}
                    </td>
                    <td className="align-top px-5 py-4 text-text-primary border-b border-[#E5E7EB]">
                      {r.after}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-[#F5F8FC] p-5 text-[13.5px] text-text-secondary leading-relaxed">
          <Info className="inline h-4 w-4 mr-1 -mt-0.5 text-trust-blue" />
          본 비교표는 첨부자료를 토대로 제도 변화 방향을 정리한 공익 안내이며,
          구체적인 적용·해석은 개인정보보호위원회 및 전문 자문을 통해 확인하시기 바랍니다.
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 8. FAQ ---------- */
export function PrivacyFAQ() {
  const faqs = [
    {
      q: "개인정보란 무엇인가요?",
      a: "살아있는 개인에 관한 정보로서 이름, 주민등록번호, 영상 등을 통해 개인을 알아볼 수 있는 정보, 또는 해당 정보만으로 특정 개인을 알아볼 수 없더라도 다른 정보와 쉽게 결합하여 알아볼 수 있는 정보를 포함합니다.",
    },
    {
      q: "이름만 있어도 개인정보인가요?",
      a: "이름은 그 자체로 식별성이 강하지만, 동명이인 가능성 때문에 단독으로는 식별이 어려운 경우도 있습니다. 다만 다른 항목(소속, 연락처, 이메일 등)과 결합되면 명확한 개인정보가 됩니다.",
    },
    {
      q: "부서명, 직급, 나이도 개인정보가 될 수 있나요?",
      a: "단독으로는 일반정보이지만, 소규모 조직에서 부서·직급·나이 조합이 특정인을 식별 가능하게 만든다면 결합 개인정보로 취급됩니다. 내부 설문 설계 시 특히 주의가 필요합니다.",
    },
    {
      q: "익명 설문은 어떻게 설계해야 하나요?",
      a: "이름·연락처·이메일 등 식별 항목을 받지 않고, 개인별 추적 링크 대신 공개 링크를 사용하며, 인구통계 항목은 범위형으로 받고, 최소 응답 수 기준 미달 시 결과를 비공개 처리하는 등 익명성 보장 설계가 필요합니다.",
    },
    {
      q: "내부 직원 대상 설문도 개인정보보호법 적용 대상인가요?",
      a: "직원도 정보주체이므로 동일하게 적용됩니다. 인사평가·만족도 조사 등은 응답자 식별이 가능한지 여부, 익명성 보장 수준, 접근 권한, 보유·파기 기준을 사전에 설계해야 합니다.",
    },
    {
      q: "외부 조사 업체에 맡기면 우리 기관 책임은 없어지나요?",
      a: "위탁자도 관리·감독 책임이 있으며, 위탁 계약서, 수탁사 점검, 위탁 사실 공개 등 수탁사 관리 의무를 부담합니다. 위탁 자체로 책임이 면제되지 않습니다.",
    },
    {
      q: "경품 이벤트와 설문을 같은 폼에서 받아도 되나요?",
      a: "권장되지 않습니다. 설문 응답과 경품 신청 정보를 분리해 수집·보관 채널을 구분하고, 경품 지급이 끝나면 신청 정보는 즉시 파기하는 것이 안전한 설계입니다.",
    },
    {
      q: "개인정보 수집 여부는 어떻게 판단하나요?",
      a: "수집 항목 자체가 식별성을 가지거나, 다른 정보와 결합해 식별 가능성이 발생하는지를 기준으로 판단합니다. 판단이 어려운 경우 설문안심 SURE 자가진단을 활용할 수 있습니다.",
    },
  ];
  return (
    <section className="section-y">
      <div className="container-page max-w-5xl">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">FAQ</div>
          <h2 className="text-navy">개인정보보호 실무 Q&amp;A</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`q-${i}`}
              className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-[16px] font-bold text-navy hover:no-underline">
                <span className="mr-3 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-soft-sky text-[12px] font-bold text-trust-blue">
                  Q
                </span>
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-[15px] leading-[1.8] text-text-secondary">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-[#F5F8FC] p-5 text-[13.5px] text-text-secondary leading-relaxed">
          <Info className="inline h-4 w-4 mr-1 -mt-0.5 text-trust-blue" />
          본 Q&amp;A는 공익 안내를 목적으로 작성되었으며, 공식 법률 해석은
          관련 기관 또는 전문가 상담이 필요합니다.
        </div>
      </div>
    </section>
  );
}