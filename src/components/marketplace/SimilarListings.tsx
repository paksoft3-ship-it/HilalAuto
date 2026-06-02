import { Listing } from "@/types/marketplace";
import { ListingCard } from "./ListingCard";
import { supabaseAdmin } from "@/lib/supabase";

interface SimilarListingsProps {
  currentId: string;
  brand: string;
  grade: string | null;
}

export async function SimilarListings({ currentId, brand, grade }: SimilarListingsProps) {
  let listings: Listing[] = [];

  try {
    const { data } = await supabaseAdmin
      .from("hazaral_listings")
      .select("*, dealer:hazaral_dealers(company_name, city, is_verified, logo_url, slug)")
      .eq("status", "active")
      .eq("brand", brand)
      .neq("id", currentId)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(4);

    listings = (data as Listing[]) || [];

    // If less than 4 similar by brand, fill with same grade
    if (listings.length < 4 && grade) {
      const needed = 4 - listings.length;
      const existingIds = [currentId, ...listings.map((l) => l.id)];
      const { data: gradeData } = await supabaseAdmin
        .from("hazaral_listings")
        .select("*, dealer:hazaral_dealers(company_name, city, is_verified, logo_url, slug)")
        .eq("status", "active")
        .eq("damage_grade", grade)
        .not("id", "in", `(${existingIds.join(",")})`)
        .order("created_at", { ascending: false })
        .limit(needed);

      listings = [...listings, ...((gradeData as Listing[]) || [])];
    }
  } catch {
    // Fail silently
  }

  if (listings.length === 0) return null;

  return (
    <section>
      <h2 className="text-[18px] font-semibold text-on-surface mb-20">
        Benzer İlanlar
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </section>
  );
}
