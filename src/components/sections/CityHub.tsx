import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";

const FALLBACK_CITIES = [
  { name: "İstanbul", slug: "istanbul" },
  { name: "Ankara",   slug: "ankara" },
  { name: "İzmir",    slug: "izmir" },
  { name: "Bursa",    slug: "bursa" },
  { name: "Konya",    slug: "konya" },
  { name: "Antalya",  slug: "antalya" },
];

async function fetchTopCities(): Promise<{ name: string; slug: string }[]> {
  try {
    const { data } = await supabaseAdmin
      .from("hazaral_listings")
      .select("city")
      .eq("status", "active")
      .limit(500);

    if (!data || data.length === 0) return FALLBACK_CITIES;

    const counts: Record<string, number> = {};
    for (const row of data) {
      const c = (row as { city: string }).city;
      if (c) counts[c] = (counts[c] || 0) + 1;
    }

    const top6 = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name]) => ({
        name,
        slug: name
          .toLowerCase()
          .replace(/ı/g, "i")
          .replace(/ğ/g, "g")
          .replace(/ü/g, "u")
          .replace(/ş/g, "s")
          .replace(/ö/g, "o")
          .replace(/ç/g, "c")
          .replace(/\s+/g, "-"),
      }));

    return top6.length >= 4 ? top6 : FALLBACK_CITIES;
  } catch {
    return FALLBACK_CITIES;
  }
}

export async function CityHub() {
  const cities = await fetchTopCities();

  return (
    <section className="py-60 bg-white" aria-label="Şehirler">
      <div className="max-w-[1180px] mx-auto px-16 md:px-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-16">
          <div className="max-w-[600px]">
            <span className="text-[11px] font-medium text-primary uppercase tracking-wider">
              LOKASYONLAR
            </span>
            <h2 className="text-[32px] font-medium text-[#111111] tracking-[-1.5px] mt-8">
              Şehirler
            </h2>
            <p className="text-[14px] text-[#888888] mt-8">
              Türkiye&apos;nin dört bir yanındaki ilanları ve hizmet bölgelerimizi keşfedin.
            </p>
          </div>
          <Link
            href="/sehir"
            className="text-primary text-[13px] font-medium flex items-center gap-4 hover:underline shrink-0"
          >
            Tüm Şehirleri Gör <ArrowRight size={14} aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-12">
          {cities.map(({ name, slug }) => (
            <Link
              key={slug}
              href={(`/sehir/${slug}`) as never}
              className="bg-white border-[0.5px] border-[#EEEEEE] rounded-xl p-16 flex items-center justify-between group hover:border-primary transition-colors"
            >
              <span className="text-[14px] font-medium text-[#111111]">{name}</span>
              <ArrowRight
                size={16}
                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
