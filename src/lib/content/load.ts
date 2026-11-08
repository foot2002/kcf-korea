import { useEffect, useState } from "react";

import fasooLogo from "@/assets/privacy/logos/fasoo.png";
import pnpLogo from "@/assets/privacy/logos/pnp.png";
import tigrisLogo from "@/assets/privacy/logos/tigris.svg";
import wiseinLogo from "@/assets/privacy/logos/wisein.png";
import yulchonLogo from "@/assets/privacy/logos/yulchon.png";
import type { EducationItem } from "@/data/privacy-program";
import type { Institution } from "@/data/sure-mark";
import {
  fallbackBanner,
  fallbackEducation,
  fallbackInstitutions,
  fallbackMonitor,
  fallbackNotices,
  fallbackPledges,
  fallbackPublications,
  fallbackSlides,
  fallbackStats,
} from "@/lib/content/fallback";
import {
  parseBanner,
  parseEducation,
  parseInstitutions,
  parseMonitor,
  parseNotices,
  parsePledges,
  parsePopups,
  parsePublications,
  parseSlides,
  parseStats,
  safeParse,
} from "@/lib/content/parse";
import type { BannerContent, ContentSlide, MonitorContent, NoticeItem, PledgeItem, PopupItem, PublicationContentItem, StatItem } from "@/lib/content/types";
import bannerJson from "../../../public/content/banner.json";
import educationJson from "../../../public/content/education.json";
import institutionsJson from "../../../public/content/institutions.json";
import monitorJson from "../../../public/content/monitor.json";
import noticesJson from "../../../public/content/notices.json";
import pledgesJson from "../../../public/content/pledges.json";
import popupsJson from "../../../public/content/popups.json";
import publicationsJson from "../../../public/content/publications.json";
import slidesJson from "../../../public/content/slides.json";
import statsJson from "../../../public/content/stats.json";

const LOGOS: Record<string, string> = {
  yulchon: yulchonLogo,
  fasoo: fasooLogo,
  wisein: wiseinLogo,
  tigris: tigrisLogo,
  pnp: pnpLogo,
};

export function hydrateEducation(items: EducationItem[]): EducationItem[] {
  return items.map((item) => ({
    ...item,
    sessions: item.sessions.map((session) => ({
      ...session,
      logo: LOGOS[session.logo] ?? session.logo,
    })),
  }));
}

function bundled<T>(parse: (value: unknown) => T | null, value: unknown, fallback: T): T {
  return safeParse(parse, value) ?? fallback;
}

export const bundledNotices = bundled(parseNotices, noticesJson, fallbackNotices());
export const bundledPublications = bundled(parsePublications, publicationsJson, fallbackPublications());
export const sourceEducation = safeParse(parseEducation, educationJson) ?? fallbackEducation();
export const bundledEducation = hydrateEducation(sourceEducation);
export const bundledInstitutions = bundled(parseInstitutions, institutionsJson, fallbackInstitutions());
export const bundledPledges = bundled(parsePledges, pledgesJson, fallbackPledges());
export const bundledStats = bundled(parseStats, statsJson, fallbackStats());
export const bundledMonitor = bundled(parseMonitor, monitorJson, fallbackMonitor());
export const bundledSlides = bundled(parseSlides, slidesJson, fallbackSlides());
export const bundledBanner = bundled(parseBanner, bannerJson, fallbackBanner());
export const bundledPopups = bundled(parsePopups, popupsJson, [] as PopupItem[]);

function useRemote<T>(
  fileName: string,
  initial: T,
  parse: (value: unknown) => T | null,
  fallback: () => T,
  hydrate?: (value: T) => T,
): T {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}content/${fileName}?ts=${Date.now()}`;
    void fetch(url)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("fail"))))
      .then((data) => {
        const parsed = safeParse(parse, data);
        const next = parsed ? (hydrate ? hydrate(parsed) : parsed) : fallback();
        if (JSON.stringify(next) !== JSON.stringify(initial)) setValue(next);
      })
      .catch(() => {
        /* 최신본을 받지 못하면 빌드에 포함된 JSON을 유지한다. */
      });
  }, [fallback, fileName, hydrate, initial, parse]);
  return value;
}

export function useNotices(): NoticeItem[] {
  return useRemote("notices.json", bundledNotices, parseNotices, fallbackNotices);
}

export function usePublications(): PublicationContentItem[] {
  return useRemote("publications.json", bundledPublications, parsePublications, fallbackPublications);
}

export function useEducation(): EducationItem[] {
  return useRemote("education.json", bundledEducation, parseEducation, fallbackEducation, hydrateEducation);
}

export function useInstitutions(): Institution[] {
  return useRemote("institutions.json", bundledInstitutions, parseInstitutions, fallbackInstitutions);
}

export function usePledges(): PledgeItem[] {
  return useRemote("pledges.json", bundledPledges, parsePledges, fallbackPledges);
}

export function useStats(): StatItem[] {
  return useRemote("stats.json", bundledStats, parseStats, fallbackStats);
}

export function useMonitor(): MonitorContent {
  return useRemote("monitor.json", bundledMonitor, parseMonitor, fallbackMonitor);
}

export function useSlides(): ContentSlide[] {
  return useRemote("slides.json", bundledSlides, parseSlides, fallbackSlides);
}

export function useBanner(): BannerContent {
  return useRemote("banner.json", bundledBanner, parseBanner, fallbackBanner);
}

function fallbackPopups(): PopupItem[] {
  return [];
}

export function usePopups(): PopupItem[] {
  return useRemote("popups.json", bundledPopups, parsePopups, fallbackPopups);
}
