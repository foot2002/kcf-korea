import { useEffect, useState } from "react";

import fasooLogo from "@/assets/privacy/logos/fasoo.png";
import pnpLogo from "@/assets/privacy/logos/pnp.png";
import tigrisLogo from "@/assets/privacy/logos/tigris.svg";
import wiseinLogo from "@/assets/privacy/logos/wisein.png";
import yulchonLogo from "@/assets/privacy/logos/yulchon.png";
import type { EducationItem } from "@/data/privacy-program";
import type { Institution } from "@/data/sure-mark";
import {
  fallbackEducation,
  fallbackInstitutions,
  fallbackNotices,
  fallbackPledges,
  fallbackPublications,
  fallbackStats,
} from "@/lib/content/fallback";
import {
  parseEducation,
  parseInstitutions,
  parseNotices,
  parsePledges,
  parsePublications,
  parseStats,
  safeParse,
} from "@/lib/content/parse";
import type { NoticeItem, PledgeItem, PublicationContentItem, StatItem } from "@/lib/content/types";
import educationJson from "../../../public/content/education.json";
import institutionsJson from "../../../public/content/institutions.json";
import noticesJson from "../../../public/content/notices.json";
import pledgesJson from "../../../public/content/pledges.json";
import publicationsJson from "../../../public/content/publications.json";
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
