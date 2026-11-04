import { useState } from "react";

import { HOME_UI, PARTNER_ASSOCIATIONS } from "@/data/privacy-home";

export function PartnerLogoGrid({ mobileLimit }: { mobileLimit?: number }) {
  const [open, setOpen] = useState(false);
  const hidden = Boolean(mobileLimit && !open);
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {PARTNER_ASSOCIATIONS.map((partner, index) => (
          <li
            key={partner.name}
            className={`flex h-24 items-center justify-center rounded-md border px-3 ${
              partner.darkBg ? "border-[#0B3A6E] bg-[#0B3A6E]" : "border-[#D1D5DB] bg-white"
            } ${hidden && mobileLimit != null && index >= mobileLimit ? "max-md:hidden" : ""}`}
          >
            <img src={partner.logo} alt={partner.name} className="max-h-14 w-full object-contain" />
          </li>
        ))}
      </ul>
      {mobileLimit != null && PARTNER_ASSOCIATIONS.length > mobileLimit ? (
        <button
          type="button"
          className="btn-secondary-kcf mt-4 md:hidden"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "접기" : "더 보기"}
        </button>
      ) : null}
    </>
  );
}

export function HomePartners() {
  return (
    <section className="border-t border-[#D1D5DB] bg-white">
      <div className="container-page py-12 md:py-16">
        <h2 className="text-navy">{HOME_UI.partnersTitle}</h2>
        <div className="mt-8">
          <PartnerLogoGrid />
        </div>
      </div>
    </section>
  );
}
