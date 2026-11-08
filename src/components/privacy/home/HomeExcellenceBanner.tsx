import { Link } from "@tanstack/react-router";

import { HOME_UI } from "@/data/privacy-home";
import { SURE_MARK } from "@/data/sure-mark";
import { useInstitutions } from "@/lib/content/load";

export function HomeExcellenceBanner() {
  const published = useInstitutions().filter((item) => item.published).slice(0, 7);
  if (published.length === 0) return null;
  return (
    <aside className="rounded-lg border border-[#D1D5DB] bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="relative h-[108px] w-[96px] shrink-0" aria-hidden="true">
          {published.slice(0, 3).map((item, index) => (
            <img
              key={item.certNo}
              src={`${import.meta.env.BASE_URL}downloads/certificates/thumbs/${item.certNo}.png`}
              alt=""
              loading="lazy"
              className="absolute top-1 h-[96px] w-[68px] rounded-[4px] border border-[#D1D5DB] bg-white object-cover"
              style={{ left: index * 14, transform: `rotate(${[-6, 0, 6][index]}deg)`, zIndex: index + 1 }}
            />
          ))}
        </div>
        <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
        <img
          src={`${import.meta.env.BASE_URL}${SURE_MARK.logo}`}
          alt={HOME_UI.markAlt}
          className="h-14 w-14 rounded-md border border-[#D1D5DB] bg-white object-contain p-1"
        />
        <div>
          <h3 className="text-navy">{HOME_UI.excellenceTitle}</h3>
          <p className="mt-1 text-[14px] font-bold text-[#0F766E]">
            {`${published.length}${HOME_UI.excellenceSelected}`}
          </p>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {published.map((item) => (
          <li key={item.certNo} className="rounded-md border border-[#D1D5DB] px-2 py-1 text-[13px] text-[#111827]">
            {item.name}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link to={HOME_UI.excellenceTo} className="btn-primary-kcf">
          {HOME_UI.viewExcellence}
        </Link>
        <Link to={HOME_UI.excellenceTo} hash="verify" className="btn-secondary-kcf">
          {HOME_UI.verifyCert}
        </Link>
      </div>
        </div>
      </div>
    </aside>
  );
}
