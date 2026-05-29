/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Search, Filter, Calendar, Wrench } from "lucide-react";

export function MarketplaceClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useParams()?.locale as string ?? "tr";
  const t = useTranslations("marketplace");

  // Basic filters
  const [searchTerm, setSearchTerm] = useState("");
  const [damageFilter, setDamageFilter] = useState("all");

  useEffect(() => {
    async function loadCars() {
      setLoading(true);
      const { data } = await supabase
        .from("hazaral_cars")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      setCars(data || []);
      setLoading(false);
    }
    loadCars();
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          car.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDamage = damageFilter === "all" || car.damage_type === damageFilter;
    return matchesSearch && matchesDamage;
  });

  const damageTypes = Array.from(new Set(cars.map(c => c.damage_type)));

  return (
    <div className="bg-surface pb-60 pt-32">
      <Container>
        <SectionHeader
          badge={t("badge", { default: "İlanlar" })}
          title={t("title", { default: "Satılık Hasarlı Araçlar" })}
          subtitle={t("subtitle", { default: "Geniş hasarlı araç envanterimizden size uygun olanı seçin ve hemen teklif verin." })}
          align="left"
          className="mb-32"
        />

        <div className="flex flex-col md:flex-row gap-16 mb-32 p-16 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px]">
          <div className="flex-1 relative">
            <Search className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-text" size={16} />
            <input 
              type="text" 
              placeholder={t("searchPlaceholder", { default: "Marka, model veya başlık ara..." })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-40 pr-16 py-12 bg-surface border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="md:w-[240px] relative">
            <Filter className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-text" size={16} />
            <select
              value={damageFilter}
              onChange={(e) => setDamageFilter(e.target.value)}
              className="w-full appearance-none pl-40 pr-16 py-12 bg-surface border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="all">{t("allDamageTypes", { default: "Tüm Hasar Türleri" })}</option>
              {damageTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-24">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] h-[320px]"></div>
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-60 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px]">
            <p className="text-[14px] text-muted-text">{t("empty", { default: "Aradığınız kriterlere uygun araç bulunamadı." })}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-24">
            {filteredCars.map((car) => (
              <Link 
                href={{ pathname: "/satilik-araclar/[id]", params: { id: car.id.toString() } }}
                key={car.id}
                className="group bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] overflow-hidden hover:border-primary transition-colors flex flex-col"
              >
                <div className="aspect-[4/3] bg-surface relative overflow-hidden">
                  {car.images && car.images.length > 0 ? (
                    <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-text text-[12px]">{t("noImage", { default: "Görsel Yok" })}</div>
                  )}
                  <div className="absolute top-12 right-12 bg-surface-container-lowest/90 backdrop-blur-sm px-8 py-4 rounded text-[11px] font-medium text-on-surface">
                    {car.damage_type}
                  </div>
                </div>
                <div className="p-16 flex flex-col flex-1">
                  <h3 className="text-[15px] font-medium text-on-surface mb-8 line-clamp-2 leading-tight">
                    {car.title}
                  </h3>
                  <div className="flex flex-col gap-4 mt-auto">
                    <div className="flex items-center gap-6 text-[12px] text-muted-text">
                      <Wrench size={12} /> {car.brand}
                    </div>
                    <div className="flex items-center gap-6 text-[12px] text-muted-text">
                      <Calendar size={12} /> {car.model_year} {t("model", { default: "Model" })}
                    </div>
                  </div>
                  <div className="mt-16 pt-16 border-t border-[0.5px] border-border-default flex items-center justify-between">
                    <span className="text-[16px] font-bold text-primary">
                      {new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(car.price)}
                    </span>
                    <span className="text-[12px] font-medium text-on-surface">{t("view", { default: "İncele" })} &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
