"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Container } from "@/components/ui/Container";
import { useParams, notFound } from "next/navigation";
import { Wrench, Calendar, Tag, ShieldAlert, CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { externalRoutes } from "@/lib/routes";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function CarDetailPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string ?? "tr";

  useEffect(() => {
    async function loadCar() {
      if (!id) return;
      const { data, error } = await supabase.from("hazaral_cars").select("*").eq("id", id).single();
      
      if (error || !data) {
        notFound();
      } else {
        setCar(data);
      }
      setLoading(false);
    }
    loadCar();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-surface py-60 min-h-screen">
        <Container>
          <div className="animate-pulse flex flex-col md:flex-row gap-32">
            <div className="flex-1 h-[400px] bg-surface-container-lowest border border-border-default rounded-[14px]"></div>
            <div className="w-full md:w-[400px] h-[400px] bg-surface-container-lowest border border-border-default rounded-[14px]"></div>
          </div>
        </Container>
      </div>
    );
  }

  if (!car) return null;

  return (
    <div className="bg-surface pb-60 pt-32">
      <Container>
        <Link 
          href={`/${locale}/satilik-araclar`}
          className="inline-flex items-center gap-8 text-[13px] text-muted-text hover:text-on-surface transition-colors mb-32"
        >
          <ArrowLeft size={16} /> İlanlara Dön
        </Link>

        <div className="flex flex-col lg:flex-row gap-44">
          {/* Left: Images & Description */}
          <div className="flex-1 flex flex-col gap-32">
            <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] overflow-hidden aspect-[4/3] sm:aspect-video relative">
              {car.images && car.images.length > 0 ? (
                <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-text bg-surface">Görsel Yok</div>
              )}
            </div>
            
            <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] p-32">
              <h2 className="text-[18px] font-medium text-on-surface mb-16">İlan Açıklaması</h2>
              <div className="text-[14px] text-muted-text leading-relaxed whitespace-pre-wrap">
                {car.description || "Bu ilan için henüz bir açıklama girilmemiştir."}
              </div>
            </div>
          </div>

          {/* Right: Info & CTA */}
          <div className="w-full lg:w-[400px] flex flex-col gap-24 shrink-0">
            <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] p-32">
              <h1 className="text-[24px] font-medium text-on-surface leading-tight mb-16">
                {car.title}
              </h1>
              <div className="text-[28px] font-bold text-primary mb-24">
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(car.price)}
              </div>

              <div className="flex flex-col gap-12 border-t border-[0.5px] border-border-default pt-24 mb-32">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-text flex items-center gap-8"><Wrench size={16} /> Marka</span>
                  <span className="font-medium text-on-surface">{car.brand}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-text flex items-center gap-8"><Tag size={16} /> Model</span>
                  <span className="font-medium text-on-surface">{car.model}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-text flex items-center gap-8"><Calendar size={16} /> Yıl</span>
                  <span className="font-medium text-on-surface">{car.model_year}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-text flex items-center gap-8"><ShieldAlert size={16} /> Hasar Durumu</span>
                  <span className="font-medium text-on-surface">{car.damage_type}</span>
                </div>
              </div>

              <div className="flex flex-col gap-16">
                <a
                  href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-8 bg-whatsapp-green text-white px-24 py-16 rounded-btn text-[14px] font-medium hover:opacity-90 transition-opacity"
                >
                  <MessageCircle size={20} strokeWidth={1.5} /> WhatsApp ile Bilgi Al
                </a>
                <p className="text-[11px] text-center text-muted-text">
                  İlan ID: {car.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] p-24">
              <h3 className="text-[14px] font-medium text-on-surface mb-16">HazarAl Güvencesi</h3>
              <ul className="flex flex-col gap-12">
                <li className="flex items-center gap-12 text-[13px] text-muted-text">
                  <CheckCircle size={16} className="text-primary" /> Şeffaf süreç ve adil fiyatlama
                </li>
                <li className="flex items-center gap-12 text-[13px] text-muted-text">
                  <CheckCircle size={16} className="text-primary" /> Noter ve evrak işlemleri desteği
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
