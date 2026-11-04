import { useState, type ReactNode } from "react";

import {
  CheckboxGroup,
  CheckConsent,
  ConsentBox,
  FileInput,
  FormField,
  RadioGroup,
  SelectInput,
  Textarea,
  TextInput,
} from "@/components/forms/controls";
import { InboxForm } from "@/components/forms/InboxForm";
import { FREE_PLATFORM } from "@/data/free-platform";
import { KOREA_REGIONS, MONITOR_INTERESTS, MONITOR_MODES, MONITOR_RULES } from "@/data/privacy-program";
import {
  CPO_PROMOTIONS,
  FORM_NAMES,
  FREE_ORG_KINDS,
  INQUIRY_TYPES,
  STATUSES,
  contactSchema,
  cpoSchema,
  freeSchema,
  monitorSchema,
  pledgeSchema,
  type ContactInput,
  type CpoInput,
  type FreeInput,
  type MonitorInput,
  type PledgeInput,
} from "@/lib/forms/schema";

const MAIL = "mailto:cs@kcf-korea.org";
const pledgeFile = `${import.meta.env.BASE_URL}downloads/free-platform/kcf-privacy-pledge.docx`;

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function FreeApplyForm() {
  const [values, setValues] = useState<FreeInput>({
    orgName: "",
    orgKind: "공공기관",
    representative: "",
    dpoName: "",
    dpoTitle: "",
    dpoPhone: "",
    dpoEmail: "",
    adminName: "",
    adminTitle: "",
    adminPhone: "",
    adminEmail: "",
    note: "",
    consentPledge: false,
    consentPublish: false,
    consentExclude: false,
    consentPrivacy: false,
  });
  const [same, setSame] = useState(false);
  const set = <K extends keyof FreeInput>(key: K, value: FreeInput[K]) => setValues((current) => ({ ...current, [key]: value }));
  const copySame = (checked: boolean) => {
    setSame(checked);
    if (checked) {
      setValues((current) => ({
        ...current,
        adminName: current.dpoName,
        adminTitle: current.dpoTitle,
        adminPhone: current.dpoPhone,
        adminEmail: current.dpoEmail,
      }));
    }
  };

  return (
    <InboxForm
      form={FORM_NAMES.free}
      schema={freeSchema}
      values={values}
      initialStatus={STATUSES[FORM_NAMES.free][0]}
      mailto={`${MAIL}?subject=${encodeURIComponent("[무상제공 신청] 기관명")}`}
      mailtoLabel="이메일로 신청"
      submitLabel="온라인으로 신청"
      successNote="담당자가 확인 후 연락드립니다."
      steps={STATUSES[FORM_NAMES.free]}
      fileMode="optional"
    >
      {({ errors, file, setFile }) => (
        <>
          <fieldset className="grid gap-4">
            <legend id="free-org" className="text-[18px] font-bold text-navy">기관 정보</legend>
            <Grid>
              <FormField id="orgName" label="기관·단체명" required error={errors.orgName}>
                {(field) => <TextInput {...field} value={values.orgName} onChange={(value) => set("orgName", value)} />}
              </FormField>
              <FormField id="representative" label="대표자" required error={errors.representative}>
                {(field) => <TextInput {...field} value={values.representative} onChange={(value) => set("representative", value)} />}
              </FormField>
            </Grid>
            <div>
              <p id="orgKind" className="text-[15px] font-bold text-[#111827]">구분<span className="text-[#B91C1C]" aria-hidden="true"> *</span><span className="sr-only"> (필수)</span></p>
              <div className="mt-2"><RadioGroup name="orgKind" labelledBy="orgKind" value={values.orgKind} options={FREE_ORG_KINDS} invalid={Boolean(errors.orgKind)} onChange={(value) => set("orgKind", value as FreeInput["orgKind"])} /></div>
              {errors.orgKind ? <p className="mt-1 text-[14px] text-[#B91C1C]">{errors.orgKind}</p> : null}
              <p className="mt-2 text-[14px] text-[#374151]">기업 CPO 특별 지원은 <a href="#cpo" className="font-bold text-[#0B3A6E] underline">CPO 신청</a>으로 보내 주세요.</p>
            </div>
          </fieldset>
          <fieldset className="grid gap-4">
            <legend className="text-[18px] font-bold text-navy">개인정보 보호책임자</legend>
            <Grid>
              <FormField id="dpoName" label="성명" required error={errors.dpoName}>{(field) => <TextInput {...field} value={values.dpoName} onChange={(value) => set("dpoName", value)} />}</FormField>
              <FormField id="dpoTitle" label="직위" required error={errors.dpoTitle}>{(field) => <TextInput {...field} value={values.dpoTitle} onChange={(value) => set("dpoTitle", value)} />}</FormField>
              <FormField id="dpoPhone" label="연락처" required error={errors.dpoPhone}>{(field) => <TextInput {...field} type="tel" value={values.dpoPhone} onChange={(value) => set("dpoPhone", value)} />}</FormField>
              <FormField id="dpoEmail" label="이메일" required error={errors.dpoEmail}>{(field) => <TextInput {...field} type="email" value={values.dpoEmail} onChange={(value) => set("dpoEmail", value)} />}</FormField>
            </Grid>
          </fieldset>
          <fieldset className="grid gap-4">
            <legend className="text-[18px] font-bold text-navy">플랫폼 계정 관리자</legend>
            <label className="flex items-center gap-2 text-[15px] text-[#111827]">
              <input type="checkbox" checked={same} onChange={(event) => copySame(event.target.checked)} className="h-4 w-4 accent-[#0B3A6E]" />
              보호책임자와 같음
            </label>
            <Grid>
              <FormField id="adminName" label="성명" required error={errors.adminName}>{(field) => <TextInput {...field} value={values.adminName} onChange={(value) => set("adminName", value)} />}</FormField>
              <FormField id="adminTitle" label="직위" required error={errors.adminTitle}>{(field) => <TextInput {...field} value={values.adminTitle} onChange={(value) => set("adminTitle", value)} />}</FormField>
              <FormField id="adminPhone" label="연락처" required error={errors.adminPhone}>{(field) => <TextInput {...field} type="tel" value={values.adminPhone} onChange={(value) => set("adminPhone", value)} />}</FormField>
              <FormField id="adminEmail" label="이메일" required error={errors.adminEmail}>{(field) => <TextInput {...field} type="email" value={values.adminEmail} onChange={(value) => set("adminEmail", value)} />}</FormField>
            </Grid>
          </fieldset>
          <FormField id="pledgeFile" label="실천선언서 서명본" hint="지금 없으면 접수 후 이메일로 보내셔도 됩니다." error={errors.file}>
            {(field) => <FileInput id={field.id} file={file} invalid={field.invalid} describedBy={field.describedBy} onChange={setFile} />}
          </FormField>
          <p><a className="font-bold text-[#0B3A6E] underline" href={pledgeFile} download>실천선언서 내려받기</a></p>
          <FormField id="note" label="남길 말" error={errors.note}>
            {(field) => <Textarea id={field.id} value={values.note} max={2000} invalid={field.invalid} describedBy={field.describedBy} onChange={(value) => set("note", value)} />}
          </FormField>
          <CheckConsent checked={values.consentPledge} label="실천선언서를 함께 제출합니다" error={errors.consentPledge} onChange={(checked) => set("consentPledge", checked)} />
          <CheckConsent checked={values.consentPublish} label="재단 홈페이지 '개인정보보호 실천기관' 게시에 동의합니다" error={errors.consentPublish} onChange={(checked) => set("consentPublish", checked)} />
          <CheckConsent checked={values.consentExclude} label="개인정보 유출 사고가 발생하면 실천기관 게시에서 제외되는 것에 동의합니다" error={errors.consentExclude} onChange={(checked) => set("consentExclude", checked)} />
          <ConsentBox id="free-privacy" variant="free-apply" checked={values.consentPrivacy} error={errors.consentPrivacy} onChange={(checked) => set("consentPrivacy", checked)} />
          <p className="text-[13px] text-[#374151]">{FREE_PLATFORM.contact.email}</p>
        </>
      )}
    </InboxForm>
  );
}

export function CpoApplyForm() {
  const [values, setValues] = useState<CpoInput>({
    company: "",
    representative: "",
    cpoName: "",
    cpoTitle: "",
    cpoPhone: "",
    cpoEmail: "",
    work: "",
    promotion: "사내 공지",
    consentPledge: false,
    consentPrivacy: false,
  });
  const set = <K extends keyof CpoInput>(key: K, value: CpoInput[K]) => setValues((current) => ({ ...current, [key]: value }));
  return (
    <InboxForm form={FORM_NAMES.cpo} schema={cpoSchema} values={values} initialStatus={STATUSES[FORM_NAMES.cpo][0]} mailto={`${MAIL}?subject=${encodeURIComponent("[CPO 특별지원 신청] 기업명")}`} mailtoLabel="이메일로 신청" submitLabel="신청하기" successNote="담당자가 확인 후 연락드립니다." steps={STATUSES[FORM_NAMES.cpo]} fileMode="optional">
      {({ errors, file, setFile }) => (
        <>
          <Grid>
            <FormField id="company" label="기업명" required error={errors.company}>{(field) => <TextInput {...field} value={values.company} onChange={(value) => set("company", value)} />}</FormField>
            <FormField id="cpo-representative" label="대표자" required error={errors.representative}>{(field) => <TextInput {...field} value={values.representative} onChange={(value) => set("representative", value)} />}</FormField>
            <FormField id="cpoName" label="CPO 성명" required error={errors.cpoName}>{(field) => <TextInput {...field} value={values.cpoName} onChange={(value) => set("cpoName", value)} />}</FormField>
            <FormField id="cpoTitle" label="직위" required error={errors.cpoTitle}>{(field) => <TextInput {...field} value={values.cpoTitle} onChange={(value) => set("cpoTitle", value)} />}</FormField>
            <FormField id="cpoPhone" label="연락처" required error={errors.cpoPhone}>{(field) => <TextInput {...field} type="tel" value={values.cpoPhone} onChange={(value) => set("cpoPhone", value)} />}</FormField>
            <FormField id="cpoEmail" label="이메일" required error={errors.cpoEmail}>{(field) => <TextInput {...field} type="email" value={values.cpoEmail} onChange={(value) => set("cpoEmail", value)} />}</FormField>
          </Grid>
          <FormField id="work" label="개인정보 수집 업무 설명" required hint="예: 고객 설문, 이벤트 신청" error={errors.work}>
            {(field) => <Textarea id={field.id} value={values.work} max={500} invalid={field.invalid} describedBy={field.describedBy} onChange={(value) => set("work", value)} />}
          </FormField>
          <div>
            <p id="promotion" className="text-[15px] font-bold text-[#111827]">실천선언 홍보 방식<span className="text-[#B91C1C]" aria-hidden="true"> *</span><span className="sr-only"> (필수)</span></p>
            <div className="mt-2"><RadioGroup name="promotion" labelledBy="promotion" value={values.promotion} options={CPO_PROMOTIONS} invalid={Boolean(errors.promotion)} onChange={(value) => set("promotion", value as CpoInput["promotion"])} /></div>
            {errors.promotion ? <p className="mt-1 text-[14px] text-[#B91C1C]">{errors.promotion}</p> : null}
          </div>
          <FormField id="cpo-file" label="실천선언서 서명본" error={errors.file}>{(field) => <FileInput id={field.id} file={file} invalid={field.invalid} describedBy={field.describedBy} onChange={setFile} />}</FormField>
          <CheckConsent checked={values.consentPledge} label="실천선언에 참여합니다" error={errors.consentPledge} onChange={(checked) => set("consentPledge", checked)} />
          <ConsentBox id="cpo-privacy" variant="cpo-apply" checked={values.consentPrivacy} error={errors.consentPrivacy} onChange={(checked) => set("consentPrivacy", checked)} />
        </>
      )}
    </InboxForm>
  );
}

export function PledgeSubmitForm() {
  const [values, setValues] = useState<PledgeInput>({
    orgName: "", representative: "", dpoName: "", contactName: "", contactEmail: "", contactPhone: "", consentPublish: false, consentPrivacy: false,
  });
  const set = <K extends keyof PledgeInput>(key: K, value: PledgeInput[K]) => setValues((current) => ({ ...current, [key]: value }));
  return (
    <div className="mt-8 rounded-[6px] border border-[#D1D5DB] bg-white p-5">
      <h3 className="text-[18px] font-bold text-navy">서명한 선언서 제출하기</h3>
      <div className="mt-4">
        <InboxForm form={FORM_NAMES.pledge} schema={pledgeSchema} values={values} initialStatus={STATUSES[FORM_NAMES.pledge][0]} mailto={`${MAIL}?subject=${encodeURIComponent("[실천선언 참여] 기관명")}`} mailtoLabel="이메일로 제출" submitLabel="선언서 제출" successNote="확인 후 '실천선언 참여 기관' 명단에 게시합니다." steps={STATUSES[FORM_NAMES.pledge]} fileMode="required">
          {({ errors, file, setFile }) => (
            <>
              <Grid>
                <FormField id="pledge-org" label="기관명" required error={errors.orgName}>{(field) => <TextInput {...field} value={values.orgName} onChange={(value) => set("orgName", value)} />}</FormField>
                <FormField id="pledge-rep" label="대표자" required error={errors.representative}>{(field) => <TextInput {...field} value={values.representative} onChange={(value) => set("representative", value)} />}</FormField>
                <FormField id="pledge-dpo" label="개인정보 보호책임자" required error={errors.dpoName}>{(field) => <TextInput {...field} value={values.dpoName} onChange={(value) => set("dpoName", value)} />}</FormField>
                <FormField id="pledge-contact" label="담당자 이름" required error={errors.contactName}>{(field) => <TextInput {...field} value={values.contactName} onChange={(value) => set("contactName", value)} />}</FormField>
                <FormField id="pledge-email" label="담당자 이메일" required error={errors.contactEmail}>{(field) => <TextInput {...field} type="email" value={values.contactEmail} onChange={(value) => set("contactEmail", value)} />}</FormField>
                <FormField id="pledge-phone" label="담당자 연락처" error={errors.contactPhone}>{(field) => <TextInput {...field} type="tel" value={values.contactPhone} onChange={(value) => set("contactPhone", value)} />}</FormField>
              </Grid>
              <FormField id="pledge-file" label="서명본" required error={errors.file}>{(field) => <FileInput id={field.id} file={file} invalid={field.invalid} describedBy={field.describedBy} onChange={setFile} />}</FormField>
              <CheckConsent checked={values.consentPublish} label="실천기관 게시에 동의합니다" error={errors.consentPublish} onChange={(checked) => set("consentPublish", checked)} />
              <ConsentBox id="pledge-privacy" variant="pledge-submit" checked={values.consentPrivacy} error={errors.consentPrivacy} onChange={(checked) => set("consentPrivacy", checked)} />
            </>
          )}
        </InboxForm>
      </div>
    </div>
  );
}

export function MonitorPreapplyForm() {
  const [values, setValues] = useState<MonitorInput>({
    name: "", email: "", region: "서울특별시", interests: [], motivation: "", mode: MONITOR_MODES[0], phone: "", notify: false, consentPrivacy: false,
  });
  const set = <K extends keyof MonitorInput>(key: K, value: MonitorInput[K]) => setValues((current) => ({ ...current, [key]: value }));
  return (
    <div className="mt-6">
      <div className="mb-4 rounded-[6px] border border-[#D1D5DB] bg-[#F8FAFC] p-4 text-[15px] leading-relaxed text-[#111827]">
        {MONITOR_RULES[1]}
      </div>
      <InboxForm form={FORM_NAMES.monitor} schema={monitorSchema} values={values} initialStatus={STATUSES[FORM_NAMES.monitor][0]} mailto={`${MAIL}?subject=${encodeURIComponent("[지키미 사전신청] 이름")}`} mailtoLabel="이메일로 사전 신청" submitLabel="사전 신청" successNote="담당자가 확인 후 연락드립니다." steps={STATUSES[FORM_NAMES.monitor]}>
        {({ errors }) => (
          <>
            <Grid>
              <FormField id="monitor-name" label="이름 또는 활동명" required error={errors.name}>{(field) => <TextInput {...field} value={values.name} onChange={(value) => set("name", value)} />}</FormField>
              <FormField id="monitor-email" label="이메일" required error={errors.email}>{(field) => <TextInput {...field} type="email" value={values.email} onChange={(value) => set("email", value)} />}</FormField>
              <FormField id="monitor-region" label="거주 시·도" required error={errors.region}>{(field) => <SelectInput id={field.id} value={values.region} options={KOREA_REGIONS} invalid={field.invalid} describedBy={field.describedBy} onChange={(value) => set("region", value as MonitorInput["region"])} />}</FormField>
              <FormField id="monitor-phone" label="연락처" error={errors.phone}>{(field) => <TextInput {...field} type="tel" value={values.phone} onChange={(value) => set("phone", value)} />}</FormField>
            </Grid>
            <div>
              <p id="interests" className="text-[15px] font-bold text-[#111827]">관심 분야<span className="text-[#B91C1C]" aria-hidden="true"> *</span><span className="sr-only"> (필수)</span></p>
              <div className="mt-2"><CheckboxGroup labelledBy="interests" values={values.interests} options={MONITOR_INTERESTS} invalid={Boolean(errors.interests)} onChange={(next) => set("interests", next as MonitorInput["interests"])} /></div>
              {errors.interests ? <p className="mt-1 text-[14px] text-[#B91C1C]">{errors.interests}</p> : null}
            </div>
            <FormField id="motivation" label="참여 동기" required error={errors.motivation}>{(field) => <Textarea id={field.id} value={values.motivation} max={500} invalid={field.invalid} describedBy={field.describedBy} onChange={(value) => set("motivation", value)} />}</FormField>
            <div>
              <p id="mode" className="text-[15px] font-bold text-[#111827]">희망 활동 방식<span className="text-[#B91C1C]" aria-hidden="true"> *</span><span className="sr-only"> (필수)</span></p>
              <div className="mt-2"><RadioGroup name="mode" labelledBy="mode" value={values.mode} options={MONITOR_MODES} invalid={Boolean(errors.mode)} onChange={(value) => set("mode", value as MonitorInput["mode"])} /></div>
            </div>
            <label className="flex items-start gap-2 text-[15px] text-[#111827]">
              <input type="checkbox" checked={values.notify} onChange={(event) => set("notify", event.target.checked)} className="mt-1 h-4 w-4 accent-[#0B3A6E]" />
              모집 소식 알림을 받습니다. (선택)
            </label>
            <ConsentBox id="monitor-privacy" variant="monitor-apply" checked={values.consentPrivacy} error={errors.consentPrivacy} onChange={(checked) => set("consentPrivacy", checked)} />
          </>
        )}
      </InboxForm>
    </div>
  );
}

export function ContactInquiryOnlineForm({ initialType }: { initialType?: string }) {
  const allowed = INQUIRY_TYPES.includes(initialType as (typeof INQUIRY_TYPES)[number]) ? (initialType as ContactInput["type"]) : "재단";
  const [values, setValues] = useState<ContactInput>({
    type: allowed, affiliation: "", name: "", email: "", phone: "", title: "", body: "", consentPrivacy: false,
  });
  const set = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) => setValues((current) => ({ ...current, [key]: value }));
  return (
    <InboxForm form={FORM_NAMES.contact} schema={contactSchema} values={values} initialStatus={STATUSES[FORM_NAMES.contact][0]} mailto={`${MAIL}?subject=${encodeURIComponent("[문의] 소속·이름")}`} mailtoLabel="이메일로 문의" submitLabel="문의 보내기" successNote="담당자가 확인 후 연락드립니다." steps={STATUSES[FORM_NAMES.contact]} fileMode="optional">
      {({ errors, file, setFile }) => (
        <>
          <Grid>
            <FormField id="inquiry-type" label="문의 유형" required error={errors.type}>{(field) => <SelectInput id={field.id} value={values.type} options={INQUIRY_TYPES} invalid={field.invalid} describedBy={field.describedBy} onChange={(value) => set("type", value as ContactInput["type"])} />}</FormField>
            <FormField id="affiliation" label="소속" error={errors.affiliation}>{(field) => <TextInput {...field} value={values.affiliation} onChange={(value) => set("affiliation", value)} />}</FormField>
            <FormField id="contact-name" label="이름" required error={errors.name}>{(field) => <TextInput {...field} value={values.name} onChange={(value) => set("name", value)} />}</FormField>
            <FormField id="contact-email" label="이메일" required error={errors.email}>{(field) => <TextInput {...field} type="email" value={values.email} onChange={(value) => set("email", value)} />}</FormField>
            <FormField id="contact-phone" label="연락처" error={errors.phone}>{(field) => <TextInput {...field} type="tel" value={values.phone} onChange={(value) => set("phone", value)} />}</FormField>
            <FormField id="contact-title" label="제목" required error={errors.title}>{(field) => <TextInput {...field} value={values.title} onChange={(value) => set("title", value)} />}</FormField>
          </Grid>
          <FormField id="contact-body" label="내용" required error={errors.body}>{(field) => <Textarea id={field.id} value={values.body} max={2000} invalid={field.invalid} describedBy={field.describedBy} onChange={(value) => set("body", value)} />}</FormField>
          <FormField id="contact-file" label="첨부" error={errors.file}>{(field) => <FileInput id={field.id} file={file} invalid={field.invalid} describedBy={field.describedBy} onChange={setFile} />}</FormField>
          <ConsentBox id="contact-privacy" variant="contact-inquiry" checked={values.consentPrivacy} error={errors.consentPrivacy} onChange={(checked) => set("consentPrivacy", checked)} />
        </>
      )}
    </InboxForm>
  );
}

export function ApplyMethodTabs() {
  const [tab, setTab] = useState<"online" | "mail">("online");
  return (
    <div id="apply-form" className="mt-8 scroll-mt-40">
      <div role="tablist" aria-label="신청 방법" className="flex gap-2 border-b border-[#D1D5DB]">
        {(["online", "mail"] as const).map((item) => (
          <button key={item} type="button" role="tab" aria-selected={tab === item} className={`border-b-2 px-4 py-3 text-[15px] font-bold ${tab === item ? "border-[#0B3A6E] text-[#0B3A6E]" : "border-transparent text-[#374151]"}`} onClick={() => setTab(item)}>
            {item === "online" ? "온라인으로 신청" : "서류로 제출(이메일)"}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "online" ? <FreeApplyForm /> : (
          <a href={`${MAIL}?subject=${encodeURIComponent("[무상제공 신청] 기관명")}`} className="btn-primary-kcf">이메일로 서류 제출</a>
        )}
      </div>
      <p className="sr-only">{FREE_PLATFORM.poweredBy}</p>
    </div>
  );
}
