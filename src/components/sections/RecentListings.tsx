import { Link } from "@/i18n/routing";
import { HomepageListingCard, type CardListing } from "@/components/marketplace/HomepageListingCard";

interface Props {
  listings: CardListing[];
}

export function RecentListings({ listings }: Props) {
  if (listings.length === 0) return null;

  return (
    <section aria-label="Son eklenen ilanlar" className="py-40 md:py-48" style={{ background: "#F8F8F8" }}>
      <div className="mx-auto max-w-[1180px] px-16 md:px-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-24">
          <h2 className="text-[20px] md:text-[22px] font-medium" style={{ color: "#0D0D0D" }}>
            Son Eklenen İlanlar
          </h2>
          <Link
            href={("/ara?sort=newest") as never}
            className="text-[13px] font-medium hover:opacity-75 transition-opacity"
            style={{ color: "#C0392B" }}
          >
            Tümünü gör →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {listings.map((listing) => (
            <HomepageListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
