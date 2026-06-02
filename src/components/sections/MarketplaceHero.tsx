"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Search } from "lucide-react";
import { CITIES } from "@/lib/constants";

export type HeroStats = {
  listingCount: number;
  dealerCount: number;
  cityCount: number;
};

const GRADE_CONFIG = [
  { grade: "A", bg: "#F0FDF4", text: "#27AE60", border: "#BBF7D0" },
  { grade: "B", bg: "#FFF7ED", text: "#E67E22", border: "#FED7AA" },
  { grade: "C", bg: "#FFF5F5", text: "#C0392B", border: "#FECACA" },
  { grade: "D", bg: "#F8FAFC", text: "#64748B", border: "#E2E8F0" },
  { grade: "E", bg: "#F8FAFC", text: "#94A3B8", border: "#E2E8F0" },
] as const;

const PRICE_OPTIONS = [
  { label: "50.000 TL'ye kadar", value: "50000" },
  { label: "100.000 TL'ye kadar", value: "100000" },
  { label: "200.000 TL'ye kadar", value: "200000" },
  { label: "300.000 TL'ye kadar", value: "300000" },
  { label: "500.000 TL'ye kadar", value: "500000" },
];

export function MarketplaceHero({ stats }: { stats: HeroStats }) {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (brand.trim()) params.set("brand", brand.trim());
    if (city) params.set("city", city);
    if (maxPrice) params.set("price_max", maxPrice);
    const qs = params.toString();
    router.push((`/ara${qs ? `?${qs}` : ""}`) as never);
  }

  function handleGradeClick(grade: string) {
    router.push((`/ara?grade=${grade}`) as never);
  }

  return (
    <section aria-label="Pazaryeri arama" className="bg-white">
      <div className="mx-auto max-w-[860px] px-16 md:px-32 pt-40 md:pt-56 pb-32 md:pb-40 flex flex-col items-center text-center">

        {/* Badge */}
        <div
          className="inline-flex items-center px-14 py-6 rounded-full text-[12px] font-medium mb-20"
          style={{ background: "#FFF5F5", color: "#C0392B", border: "1px solid #FECACA" }}
        >
          Türkiye&apos;nin Hasarlı Araç Pazaryeri
        </div>

        {/* Headline */}
        <h1 className="text-[28px] md:text-[40px] font-medium tracking-[-1px] text-[#0D0D0D] leading-[1.15] mb-14">
          Hasarlı Araç Al veya Sat —
          <br />
          <span className="text-[#C0392B]">Güvenli, Şeffaf, Hızlı</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[14px] md:text-[15px] leading-relaxed max-w-[480px] mb-28" style={{ color: "#64748B" }}>
          Onaylı bayilerden grade sistemiyle değerlendirilmiş kazalı, pert, hurda araçlar
        </p>

        {/* Search bar */}
        <div
          className="w-full rounded-[14px] p-[6px]"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E5E5",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex flex-col md:flex-row gap-0 items-stretch">
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Marka, model veya araç türü..."
              aria-label="Araç arama"
              className="flex-[2] px-16 py-12 text-[13px] text-[#0D0D0D] placeholder-[#94A3B8] bg-transparent outline-none border-b md:border-b-0 md:border-r rounded-none"
              style={{ borderColor: "#E5E5E5" }}
            />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="Şehir seç"
              className="flex-1 px-16 py-12 text-[13px] bg-transparent outline-none border-b md:border-b-0 md:border-r border-none rounded-none appearance-none cursor-pointer"
              style={{ borderColor: "#E5E5E5", color: city ? "#0D0D0D" : "#94A3B8" }}
            >
              <option value="">Şehir seçin</option>
              {Object.entries(CITIES).map(([slug, label]) => (
                <option key={slug} value={label}>{label}</option>
              ))}
            </select>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              aria-label="Fiyat aralığı seç"
              className="flex-1 px-16 py-12 text-[13px] bg-transparent outline-none border-b md:border-b-0 md:border-r border-none rounded-none appearance-none cursor-pointer"
              style={{ borderColor: "#E5E5E5", color: maxPrice ? "#0D0D0D" : "#94A3B8" }}
            >
              <option value="">Fiyat aralığı</option>
              {PRICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-8 px-24 py-12 text-white text-[13px] font-medium rounded-[10px] hover:opacity-90 transition-opacity m-[2px] shrink-0"
              style={{ background: "#C0392B" }}
              aria-label="Araç ara"
            >
              <Search size={15} aria-hidden />
              Ara
            </button>
          </div>
        </div>

        {/* Grade pills */}
        <div className="flex items-center gap-8 flex-wrap justify-center mt-16">
          <span className="text-[12px] mr-2" style={{ color: "#64748B" }}>Grade filtrele:</span>
          {GRADE_CONFIG.map(({ grade, bg, text, border }) => (
            <button
              key={grade}
              onClick={() => handleGradeClick(grade)}
              className="px-14 py-6 rounded-full text-[12px] font-medium transition-all hover:opacity-75"
              style={{ backgroundColor: bg, color: text, border: `1px solid ${border}` }}
              aria-label={`Grade ${grade} ile filtrele`}
            >
              Grade {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-t" style={{ background: "#F8F8F8", borderColor: "#E5E5E5" }}>
        <div className="mx-auto max-w-[1180px] px-16 md:px-32 py-18">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            <StatItem value={stats.listingCount > 0 ? stats.listingCount.toLocaleString("tr-TR") : "—"} label="aktif ilan" />
            <StatItem value={stats.dealerCount > 0 ? stats.dealerCount.toLocaleString("tr-TR") : "—"} label="onaylı bayi" />
            <StatItem value={stats.cityCount > 0 ? `${stats.cityCount}+` : "—"} label="şehirde" />
            <StatItem value="24 saat" label="ortalama yanıt" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="text-[20px] md:text-[22px] font-medium text-[#0D0D0D]">{value}</span>
      <span className="text-[11px]" style={{ color: "#64748B" }}>{label}</span>
    </div>
  );
}
