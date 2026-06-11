import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { HomepageListingCard, type CardListing } from "@/components/marketplace/HomepageListingCard";
import { useTranslations } from "next-intl";

interface Props {
  listings: CardListing[];
}

function SkeletonCard() {
  return (
    <div className="bg-white border-[0.5px] border-[#EEEEEE] rounded-xl overflow-hidden animate-pulse">
      <div className="h-[200px] bg-[#F3F3F4]" />
      <div className="p-16 flex flex-col gap-10">
        <div className="h-4 bg-[#F3F3F4] rounded w-3/4" />
        <div className="h-3 bg-[#F3F3F4] rounded w-1/2" />
        <div className="h-4 bg-[#F3F3F4] rounded w-1/3" />
      </div>
    </div>
  );
}

export function FeaturedListings({ listings }: Props) {
  const t = useTranslations("marketplaceHome");

  return (
    <section className="py-60 bg-white" aria-label={t("featuredAria")}>
      <div className="max-w-[1240px] mx-auto px-16 md:px-24">
        <div className="flex justify-between items-end mb-32">
          <div>
            <span className="text-[11px] font-medium text-primary uppercase tracking-wider">
              {t("featuredEyebrow")}
            </span>
            <h2 className="text-[32px] font-medium text-[#111111] tracking-[-1.5px] mt-8">
              {t("featuredTitle")}
            </h2>
          </div>
          <Link
            href="/ara"
            className="text-primary text-[13px] font-medium flex items-center gap-4 hover:underline"
          >
            {t("viewAllListings")} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
          {listings.length > 0
            ? listings.map((l) => <HomepageListingCard key={l.id} listing={l} />)
            : Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          }
        </div>
      </div>
    </section>
  );
}
