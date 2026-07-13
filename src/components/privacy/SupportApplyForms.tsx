import { useEffect, useState } from "react";
import { Building2, Landmark, Users } from "lucide-react";

import { SupportApplicationForm } from "@/components/privacy/SupportApplicationForm";
import { VoucherRegistrySearch } from "@/components/privacy/VoucherRegistrySearch";
import type { ApplicationKind } from "@/lib/association-application/types";

const TABS: {
  kind: ApplicationKind;
  label: string;
  description: string;
  icon: typeof Users;
}[] = [
  { kind: "association", label: "협단체 신청", description: "협회·단체 협약 및 회원사 지원", icon: Users },
  { kind: "enterprise", label: "기업 신청", description: "기업 대상 SURE 지원", icon: Building2 },
  { kind: "public", label: "공공기관 신청", description: "공공기관 대상 SURE 지원", icon: Landmark },
];

export function SupportApplyForms({
  defaultKind = "association",
  landing = false,
}: {
  defaultKind?: ApplicationKind;
  landing?: boolean;
}) {
  const [activeKind, setActiveKind] = useState<ApplicationKind>(defaultKind);
  const [prefillOrgName, setPrefillOrgName] = useState("");
  const active = TABS.find((t) => t.kind === activeKind) ?? TABS[0]!;

  useEffect(() => {
    setActiveKind(defaultKind);
  }, [defaultKind]);

  useEffect(() => {
    setPrefillOrgName("");
  }, [activeKind]);

  if (landing && defaultKind === "association") {
    return (
      <div>
        <VoucherRegistrySearch onSelectOrganization={(name) => setPrefillOrgName(name)} />
        <div className="mt-4">
          <SupportApplicationForm kind="association" prefillOrgName={prefillOrgName} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const selected = activeKind === tab.kind;
          return (
            <button
              key={tab.kind}
              type="button"
              onClick={() => setActiveKind(tab.kind)}
              className={[
                "rounded-[1.25rem] border p-4 text-left transition",
                selected
                  ? "border-trust-blue bg-white shadow-[0_8px_24px_rgba(29,78,216,0.12)] ring-1 ring-trust-blue/25"
                  : "border-[var(--pc-border)] bg-white/90 hover:border-trust-blue/30",
              ].join(" ")}
            >
              <div className={["flex h-10 w-10 items-center justify-center rounded-xl", selected ? "bg-trust-blue text-white" : "bg-[var(--pc-soft-blue)] text-trust-blue"].join(" ")}>
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="mt-3 text-[15px] font-bold text-navy">{tab.label}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{tab.description}</p>
            </button>
          );
        })}
      </div>

      <p className="pc-body mt-6 text-center">
        <strong className="text-navy">{active.label}</strong> — 비공개 접수, 담당자 확인 후 안내드립니다.
      </p>

      {activeKind === "association" && (
        <div className="mt-4">
          <VoucherRegistrySearch onSelectOrganization={(name) => setPrefillOrgName(name)} />
        </div>
      )}

      <div className="mt-6">
        <SupportApplicationForm kind={activeKind} prefillOrgName={prefillOrgName} />
      </div>
    </div>
  );
}
