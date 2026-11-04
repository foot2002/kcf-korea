import { HomeIcon } from "@/components/privacy/home/icons";
import { SitePathLink } from "@/components/site/SitePathLink";
import { HOME_UI, QUICK_MENU } from "@/data/privacy-home";

type QuickItem = {
  label: string;
  to: string;
  hash?: string;
  icon: string;
};

export function HomeQuickMenu({
  items = QUICK_MENU,
  label = HOME_UI.quickMenu,
}: {
  items?: readonly QuickItem[];
  label?: string;
} = {}) {
  return (
    <nav className="border-b border-[#D1D5DB] bg-white" aria-label={label}>
      <ul className="container-page grid grid-cols-3 gap-2 py-4 lg:grid-cols-6">
        {items.map((item) => (
          <li key={item.label}>
            <SitePathLink
              to={item.to}
              hash={"hash" in item ? item.hash : undefined}
              className="group flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-transparent px-2 py-3 text-center hover:border-[#0F766E]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EEF6]">
                <HomeIcon name={item.icon} className="h-5 w-5 text-[#0B3A6E] group-hover:text-[#0F766E]" />
              </span>
              <span className="text-[14px] font-semibold leading-snug text-[#111827]">{item.label}</span>
            </SitePathLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
