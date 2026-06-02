"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { getBrowserFavoriteSessionId } from "@/components/marketplace/FavoriteButton";
import { Listing } from "@/types/marketplace";
import { Heart, Search } from "lucide-react";

export function FavoritesClient() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = getBrowserFavoriteSessionId();
    fetch(`/api/favorites?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.ok ? res.json() : { favorites: [] })
      .then((data) => setListings((data.favorites as Listing[]) || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-surface pb-60">
      <div className="bg-surface-container-lowest border-b border-[0.5px] border-border-default py-32">
        <Container>
          <div className="flex items-center gap-10 text-primary mb-8">
            <Heart size={18} fill="currentColor" />
            <span className="text-[12px] font-semibold uppercase tracking-wider">Favoriler</span>
          </div>
          <h1 className="text-[28px] md:text-[36px] font-bold text-on-surface tracking-[-1px]">
            Kaydedilen İlanlar
          </h1>
          <p className="text-[14px] text-muted-text mt-6">
            Beğendiğiniz hasarlı araç ilanlarını burada takip edebilirsiniz.
          </p>
        </Container>
      </div>

      <Container className="pt-24">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[330px] animate-pulse rounded-card border border-[0.5px] border-border-default bg-surface-container-lowest" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="mx-auto max-w-[520px] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-32 text-center">
            <div className="w-[56px] h-[56px] rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-16">
              <Heart size={24} />
            </div>
            <h2 className="text-[18px] font-semibold text-on-surface mb-8">Henüz favori ilanınız yok</h2>
            <p className="text-[13px] text-muted-text leading-relaxed mb-20">
              İlan kartlarındaki kalp ikonuna basarak araçları bu sayfaya ekleyebilirsiniz.
            </p>
            <Link
              href="/ara"
              className="inline-flex items-center justify-center gap-8 bg-primary text-white px-20 py-11 rounded-btn text-[13px] font-semibold hover:opacity-90"
            >
              <Search size={14} />
              İlanlara Göz At
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
