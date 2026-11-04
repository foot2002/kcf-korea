import { HomeAchievements } from "@/components/privacy/home/HomeAchievements";
import { HomeBoard } from "@/components/privacy/home/HomeBoard";
import { HomeBusinesses } from "@/components/privacy/home/HomeBusinesses";
import { HomeContact } from "@/components/privacy/home/HomeContact";
import { HomeExcellenceBanner } from "@/components/privacy/home/HomeExcellenceBanner";
import { HomeFlow } from "@/components/privacy/home/HomeFlow";
import { HomePartners } from "@/components/privacy/home/HomePartners";
import { HomeQuickMenu } from "@/components/privacy/home/HomeQuickMenu";
import { HomeSlider } from "@/components/privacy/home/HomeSlider";

export function PrivacyCenterHome() {
  return (
    <>
      <HomeSlider />
      <HomeQuickMenu />
      <HomeBusinesses />
      <HomeFlow />
      <section className="bg-white">
        <div className="container-page grid gap-6 py-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] md:py-16">
          <HomeBoard />
          <HomeExcellenceBanner />
        </div>
      </section>
      <HomeAchievements />
      <HomePartners />
      <HomeContact />
    </>
  );
}
