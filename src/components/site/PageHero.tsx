import type { ReactNode } from "react";

import { SubpageFrame } from "@/components/site/SubpageFrame";

export function PageHero({
  eyebrow,
  title,
  desc,
  showLnb = true,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  bgImage?: string;
  showLnb?: boolean;
  children?: ReactNode;
}) {
  return (
    <SubpageFrame
      area="foundation"
      eyebrow={eyebrow}
      title={title}
      description={desc}
      showLnb={showLnb}
    />
  );
}
