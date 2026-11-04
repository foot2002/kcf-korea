import cardConsulting from "@/assets/card-consulting.jpg";
import cardConsulting2 from "@/assets/card-consulting-2.jpg";
import cardNbo from "@/assets/card-nbo.jpg";
import cardValue1 from "@/assets/card-value-1.jpg";
import cardYouth from "@/assets/card-youth.jpg";
import heroFreePlatform from "@/assets/illustrations/hero-free-platform.svg";
import heroResearch from "@/assets/illustrations/hero-research.svg";
import heroWebinar from "@/assets/illustrations/hero-webinar.svg";
import illMonitor from "@/assets/illustrations/ill-monitor.svg";
import illPolicy from "@/assets/illustrations/ill-policy.svg";
import { HOME_UI } from "@/data/privacy-home";

export type SubpageVisual =
  | { kind: "hero" | "icon"; src: string }
  | { kind: "mark"; src: string; alt: string }
  | { kind: "photo"; src: string };

export const SUBPAGE_VISUALS = {
  research: { kind: "hero", src: heroResearch },
  education: { kind: "hero", src: heroWebinar },
  security: { kind: "hero", src: heroFreePlatform },
  sureMark: {
    kind: "mark",
    src: `${import.meta.env.BASE_URL}downloads/sure-mark.png`,
    alt: HOME_UI.markAlt,
  },
  rights: { kind: "icon", src: illMonitor },
  publications: { kind: "icon", src: illPolicy },
  sureCheck: { kind: "hero", src: heroResearch },
  about: { kind: "photo", src: cardConsulting },
  history: { kind: "photo", src: cardValue1 },
  business: { kind: "photo", src: cardNbo },
  achievements: { kind: "photo", src: cardYouth },
  contact: { kind: "photo", src: cardConsulting2 },
} as const satisfies Record<string, SubpageVisual>;
