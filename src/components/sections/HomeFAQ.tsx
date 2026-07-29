"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "Grade sistemi nedir?",
    a: "Otograde grade sistemi, hasarlı araçları A'dan E'ye kadar beş kategoride değerlendiren bağımsız bir hasar derecelendirme sistemidir. A en hafif hasarı, E ise hurda/yedek parça durumunu ifade eder.",
  },
  {
    q: "Nasıl araç alabilirim?",
    a: "İlanlar sayfasından grade, şehir ve fiyat filtrelerini kullanarak arama yapın. İlgilendiğiniz ilanı açın ve bayi ile WhatsApp veya mesaj yoluyla doğrudan iletişime geçin.",
  },
  {
    q: "Aracımı nasıl satabilirim?",
    a: "İki seçeneğiniz var: Ücretsiz üye olup kendi ilanınızı yayınlayabilir, ya da teklif formunu doldurarak doğrudan bize teklif isteği gönderebilirsiniz. Uzmanlarımız 15 dakika içinde dönüş yapar.",
  },
  {
    q: "İlan vermek ücretli mi?",
    a: "Hayır. Üyelik ve ilan yayınlama şu anda tamamen ücretsizdir. Üye Ol sayfasından kaydolun, 24 saat içinde onay alın ve ister galeri ister bireysel satıcı olarak hemen ilan yayınlamaya başlayın.",
  },
] as const;

export function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      className="py-60 bg-[#FAFAFA] border-t-[0.5px] border-[#EEEEEE]"
      aria-label="Sık sorulan sorular"
    >
      <div className="max-w-[1240px] mx-auto px-16 md:px-24">
        <div className="text-center mb-44">
          <span className="text-[11px] font-medium text-primary uppercase tracking-wider">
            YARDIM
          </span>
          <h2 className="text-[32px] font-medium text-[#111111] tracking-[-1.5px] mt-8">
            Sık Sorulan Sorular
          </h2>
        </div>

        <div className="max-w-[800px] mx-auto flex flex-col gap-12">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="bg-white border-[0.5px] border-[#EEEEEE] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full px-24 py-16 flex items-center justify-between text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[14px] font-medium text-[#111111]">{item.q}</span>
                  {isOpen
                    ? <X size={18} className="text-primary shrink-0" aria-hidden />
                    : <Plus size={18} className="text-primary shrink-0" aria-hidden />
                  }
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="px-24 pb-16 text-[13px] text-[#888888] leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
