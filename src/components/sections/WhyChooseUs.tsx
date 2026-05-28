"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Wallet,
  Truck,
  Scale,
  HeadphonesIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { routes, externalRoutes } from "@/lib/routes";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { FaWhatsapp } from 'react-icons/fa';

const ITEMS = [
  {
    icon: Wallet,
    title: "Şeffaf Fiyatlandırma",
    desc: "Piyasa koşullarına göre en adil ve şeffaf fiyat teklifini sunuyoruz.",
  },
  {
    icon: Truck,
    title: "Yerinden Alım Kolaylığı",
    desc: "Aracınızı bulunduğu yerden ücretsiz çekici ile teslim alıyoruz.",
  },
  {
    icon: Scale,
    title: "Evrak Sürecinde Destek",
    desc: "Noter ve tüm yasal süreçlerde ekibimiz yanınızda.",
  },
  {
    icon: HeadphonesIcon,
    title: "Hızlı İletişim",
    desc: "WhatsApp ve telefon üzerinden 7/24 ulaşılabiliriz.",
  },
];

export function WhyChooseUs() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";

  return (
    <section
      aria-label="Neden HazarAl"
      className="bg-surface-container-lowest border-b border-[0.5px] border-border-default py-44 md:py-60"
    >
      <Container>
        <div className="flex flex-col gap-44">
          <div className="flex flex-col gap-24 text-center md:text-left">
            <div>
              <span className="text-[11px] font-medium text-primary uppercase tracking-wider mx-auto md:mx-0">NEDEN HAZARAL?</span>
              <h2 className="text-[28px] md:text-[32px] font-medium text-on-surface tracking-[-1.5px] mt-8 leading-tight">Hasarlı araç satışını hızlı, güvenli ve zahmetsiz hale getiriyoruz.</h2>
              <p className="text-[14px] leading-relaxed text-muted-text mt-16 mx-auto md:mx-0 max-w-[700px]">Aracınız kazalı, pert, yanmış, sel hasarlı veya motor arızalı olabilir. HazarAl, süreci sizin için sadeleştirir: hızlı değerlendirme, yerinden alım, evrak desteği ve güvenli ödeme.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-12 w-full">
              <Link href={routes.quote(locale)} className="w-full sm:w-auto text-center bg-primary text-on-primary px-24 py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity">
                Hemen Teklif Al
              </Link>
              <a href={externalRoutes.whatsapp(WHATSAPP_NUMBER)} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default px-24 py-16 rounded-btn text-[14px] font-medium text-on-surface hover:bg-surface transition-colors">
                <FaWhatsapp size={20} strokeWidth={1.5} className="text-whatsapp-green" aria-hidden />
                WhatsApp ile Yaz
              </a>
            </div>
            <p className="text-[12px] text-muted-text mx-auto md:mx-0">Ücretsiz değerlendirme • Bağlayıcı değil • Türkiye geneli hizmet</p>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-16">
            {ITEMS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.35, ease: "easeOut" }}
                className="bg-surface border border-[0.5px] border-border-default rounded-[14px] p-24 text-center md:text-left flex flex-col items-center md:items-start"
              >
                <div className="inline-flex bg-accent-light border border-[0.5px] border-accent-border p-12 rounded-full mb-16">
                  <Icon size={24} strokeWidth={1.5} className="text-primary" />
                </div>
                <h3 className="text-[16px] font-medium text-on-surface mb-8">{title}</h3>
                <p className="text-[13px] text-muted-text leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-24 bg-surface border border-[0.5px] border-border-default rounded-[14px] flex flex-col md:flex-row gap-24 md:justify-around md:items-center">
            <div className="flex flex-col items-center text-center">
              <span className="text-[24px] font-bold text-on-surface">3.200+</span>
              <span className="text-[13px] text-muted-text mt-4">araç değerlendirildi</span>
            </div>
            <div className="flex flex-col items-center text-center border-y md:border-y-0 md:border-x border-[0.5px] border-border-default py-24 md:py-0 md:px-24">
              <span className="text-[24px] font-bold text-on-surface">24 saat içinde</span>
              <span className="text-[13px] text-muted-text mt-4">tüm süreç tamamlanır</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[24px] font-bold text-on-surface">Türkiye Geneli</span>
              <span className="text-[13px] text-muted-text mt-4">her noktadan alım</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
