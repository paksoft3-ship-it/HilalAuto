"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Search, Car, MapPin, Banknote } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const t = useTranslations("marketplaceHome");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("brand", query.trim());
    if (city.trim()) params.set("city", city.trim());
    if (maxPrice) params.set("price_max", maxPrice);
    const qs = params.toString();
    router.push((`/ara${qs ? `?${qs}` : ""}`) as never);
  }

  return (
    <div className="w-full max-w-[760px] bg-white border-[0.5px] border-[#EEEEEE] rounded-xl p-8 flex flex-col md:flex-row gap-0 items-stretch">
      {/* Brand / Model */}
      <div className="flex-1 flex items-center gap-12 px-12 py-2 border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[#EEEEEE]">
        <Car size={18} className="text-[#888888] shrink-0" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t("searchBrand")}
          aria-label={t("searchBrandAria")}
          className="w-full border-none bg-transparent text-[14px] text-[#111111] placeholder-[#AAAAAA] outline-none"
        />
      </div>

      {/* City */}
      <div className="flex-1 flex items-center gap-12 px-12 py-2 border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[#EEEEEE]">
        <MapPin size={18} className="text-[#888888] shrink-0" aria-hidden />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t("searchCity")}
          aria-label={t("searchCity")}
          className="w-full border-none bg-transparent text-[14px] text-[#111111] placeholder-[#AAAAAA] outline-none"
        />
      </div>

      {/* Max price */}
      <div className="flex-1 flex items-center gap-12 px-12 py-2 border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[#EEEEEE]">
        <Banknote size={18} className="text-[#888888] shrink-0" aria-hidden />
        <input
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t("searchPrice")}
          aria-label={t("searchPriceAria")}
          className="w-full border-none bg-transparent text-[14px] text-[#111111] placeholder-[#AAAAAA] outline-none"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSearch}
        className="flex items-center justify-center gap-8 bg-primary text-white px-32 py-12 rounded-lg font-medium text-[14px] hover:opacity-90 transition-opacity shrink-0 mt-4 md:mt-0"
        aria-label={t("searchAria")}
      >
        <Search size={16} aria-hidden />
        {t("searchButton")}
      </button>
    </div>
  );
}
