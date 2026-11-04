import { Link } from "@tanstack/react-router";

import { privacyOffice } from "@/data/kcf";
import { ABOUT_NOTE, HOME_UI } from "@/data/privacy-home";

export function HomeContact() {
  return (
    <section className="border-t border-[#D1D5DB] bg-[#F3F4F6]">
      <div className="container-page flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-[15px] leading-relaxed text-[#111827]">{ABOUT_NOTE}</p>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <p className="text-[15px] font-bold text-navy">
            <a href={`tel:${privacyOffice.tel}`} className="hover:underline">
              {privacyOffice.tel}
            </a>
            <span aria-hidden="true"> · </span>
            <a href={`mailto:${privacyOffice.email}`} className="hover:underline">
              {privacyOffice.email}
            </a>
          </p>
          <Link to={HOME_UI.inquiryTo} className="btn-primary-kcf">
            {HOME_UI.inquiry}
          </Link>
        </div>
      </div>
    </section>
  );
}
