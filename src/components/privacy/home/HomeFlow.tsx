import { ChevronDown, ChevronRight } from "lucide-react";

import { FLOW } from "@/data/privacy-home";

export function HomeFlow() {
  return (
    <section className="bg-[#F3F4F6]" aria-label={FLOW.map((item) => item.title).join(" ")}>
      <ol className="container-page flex flex-col gap-4 py-10 md:flex-row md:items-stretch md:gap-2 md:py-12">
        {FLOW.map((item, index) => (
          <li key={item.title} className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:gap-2">
            <div className="flex flex-1 items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#0B3A6E] text-[14px] font-bold text-[#0B3A6E]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-navy">{item.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-[#374151]">{item.body}</p>
              </div>
            </div>
            {index < FLOW.length - 1 ? (
              <>
                <ChevronDown className="mx-auto h-5 w-5 text-[#0B3A6E] md:hidden" aria-hidden="true" />
                <ChevronRight className="hidden h-5 w-5 shrink-0 text-[#0B3A6E] md:block" aria-hidden="true" />
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
