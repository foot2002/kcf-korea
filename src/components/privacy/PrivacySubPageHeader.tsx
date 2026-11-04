import type { ReactNode } from "react";

import type { PrivacyVisual } from "@/components/privacy/privacy-visuals";
import { SubpageFrame } from "@/components/site/SubpageFrame";

type PrivacySubPageHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  badge?: string;
  crumbLabel?: string;
  middleCrumbs?: readonly { label: string; to: string }[];
  dark?: boolean;
  visual?: PrivacyVisual;
  showLnb?: boolean;
};

export function PrivacySubPageHeader({
  eyebrow,
  title,
  description,
  badge,
  crumbLabel,
  middleCrumbs,
  showLnb = true,
}: PrivacySubPageHeaderProps) {
  return (
    <SubpageFrame
      area="privacy"
      eyebrow={eyebrow}
      title={title}
      description={description}
      badge={badge}
      crumbLabel={crumbLabel}
      middleCrumbs={middleCrumbs}
      showLnb={showLnb}
    />
  );
}
