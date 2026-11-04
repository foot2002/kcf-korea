import { ACHIEVEMENTS } from "@/data/privacy-home";

export function HomeAchievements() {
  return (
    <section id="achievements" className="bg-white">
      <ul className="container-page grid gap-0 py-10 md:grid-cols-4 md:py-12">
        {ACHIEVEMENTS.map((item, index) => (
          <li
            key={item.text}
            className={`py-4 md:px-5 md:py-0 ${index > 0 ? "border-t border-[#D1D5DB] md:border-l md:border-t-0" : ""}`}
          >
            <p className="text-[13px] font-bold text-[#0F766E]">{item.date}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-[#111827]">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
