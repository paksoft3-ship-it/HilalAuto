import { SearchBar } from "@/components/marketplace/SearchBar";
import { GradeFilterPills } from "@/components/marketplace/GradeFilterPills";
import { useTranslations } from "next-intl";

export type HeroStats = {
  listingCount: number;
  dealerCount: number;
  cityCount: number;
};

export function MarketplaceHero({ stats }: { stats: HeroStats }) {
  const t = useTranslations("marketplaceHome");

  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-60 pb-32" aria-label={t("heroAria")}>
        <div className="max-w-[1180px] mx-auto px-16 md:px-32 flex flex-col items-center text-center">
          {/* Pill badge */}
          <div className="inline-flex px-12 py-4 bg-[#FFF2EF] border-[0.5px] border-[#FFCDC4] rounded-full mb-24">
            <span className="text-primary text-[11px] font-medium uppercase tracking-wider">
              {t("badge")}
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-[32px] md:text-[48px] font-medium text-[#111111] leading-[1.1] tracking-[-1.5px] mb-16">
            {t("titleLine")}<br />
            <span className="text-primary">{t("titleHighlight")}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] text-[#888888] leading-relaxed max-w-[640px] mb-44">
            {t("subtitle")}
          </p>

          {/* Search bar (client) */}
          <SearchBar />

          {/* Grade pills (client) */}
          <GradeFilterPills />
        </div>
      </section>

      {/* Stats bar */}
      <div className="w-full bg-[#FAFAFA] border-y-[0.5px] border-[#EEEEEE] py-24">
        <div className="max-w-[1180px] mx-auto px-16 md:px-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-24">
            <StatItem value={stats.listingCount > 0 ? `${stats.listingCount}+` : "—"} label={t("activeListings")} />
            <StatItem value={stats.dealerCount > 0 ? `${stats.dealerCount}+` : "—"} label={t("verifiedDealers")} />
            <StatItem value={stats.cityCount > 0 ? String(stats.cityCount) : "—"} label={t("citiesServed")} />
            <StatItem value={t("responseValue")} label={t("responseTime")} />
          </div>
        </div>
      </div>
    </>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center border-r-[0.5px] border-[#EEEEEE] last:border-r-0 md:last:border-r-0">
      <span className="text-[20px] font-medium text-[#111111]">{value}</span>
      <span className="text-[12px] text-[#888888]">{label}</span>
    </div>
  );
}
