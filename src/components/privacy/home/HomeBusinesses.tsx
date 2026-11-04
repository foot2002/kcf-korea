import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { HomeIcon } from "@/components/privacy/home/icons";
import heroFreePlatform from "@/assets/illustrations/hero-free-platform.svg";
import heroResearch from "@/assets/illustrations/hero-research.svg";
import heroWebinar from "@/assets/illustrations/hero-webinar.svg";
import illMonitor from "@/assets/illustrations/ill-monitor.svg";
import { BUSINESSES, HOME_UI } from "@/data/privacy-home";

const businessVisuals = [heroResearch, heroWebinar, heroFreePlatform, illMonitor];

export function HomeBusinesses() {
  return (
    <section id="businesses" className="bg-white">
      <div className="container-page py-12 md:py-16">
        <h2 className="text-navy">{HOME_UI.businessTitle}</h2>
        <p className="mt-2 text-[16px] text-[#374151]">{HOME_UI.businessLead}</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {BUSINESSES.map((item, index) => (
            <li
              key={item.no}
              className={`relative flex flex-col overflow-hidden rounded-lg bg-white ${
                "highlight" in item && item.highlight ? "border-2 border-[#0F766E]" : "border border-[#D1D5DB]"
              }`}
            >
              <div className="relative aspect-video overflow-hidden bg-[#0B3A6E]">
                <img
                  src={businessVisuals[index]}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </div>
              <div className="relative flex flex-1 flex-col p-5">
              {"highlight" in item && item.highlight ? (
                <span className="absolute right-3 top-3 rounded-md bg-[#0F766E] px-2 py-1 text-[12px] font-bold text-white">
                  {item.status}
                </span>
              ) : null}
              <div className={`flex items-center gap-3 ${"highlight" in item && item.highlight ? "pr-16" : ""}`}>
                <span className="text-[13px] font-bold text-[#0F766E]">{item.no}</span>
                <HomeIcon name={item.icon} className="h-5 w-5 text-[#0B3A6E]" />
              </div>
              <h3 className="mt-3 pr-2 text-[18px] font-bold text-navy">{item.title}</h3>
              <p className="mt-2">
                <span className="inline-flex rounded-md border border-[#D1D5DB] px-2 py-0.5 text-[12px] font-bold text-[#0B3A6E]">
                  {item.status}
                </span>
              </p>
              <p className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-[#374151]">{item.purpose}</p>
              <p className="mt-4 border-t border-[#D1D5DB] pt-3 text-[13px] font-bold leading-snug text-[#111827]">
                {item.metric}
              </p>
              <Link to={item.to} className="mt-4 inline-flex items-center gap-1 text-[14px] font-bold text-[#0B3A6E] hover:underline">
                {HOME_UI.detail}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
