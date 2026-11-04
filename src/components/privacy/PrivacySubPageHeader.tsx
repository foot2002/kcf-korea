import type { ReactNode } from "react";

import { SubpageFrame } from "@/components/site/SubpageFrame";
import type { SubpageVisual } from "@/components/site/subpage-visuals";

type PrivacySubPageHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  badge?: string;
  crumbLabel?: string;
  middleCrumbs?: readonly { label: string; to: string }[];
  dark?: boolean;
  visual?: SubpageVisual;
  showLnb?: boolean;
};

export function PrivacySubPageHeader({
  eyebrow,
  title,
  description,
  badge,
  crumbLabel,
  middleCrumbs,
  visual,
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
      visual={visual}
      showLnb={showLnb}
    />
  );
}
