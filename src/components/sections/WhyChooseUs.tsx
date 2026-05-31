/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
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

export function WhyChooseUs() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";
  const t = useTranslations("whyChooseUs");

  const ITEMS = [
    {
      icon: Wallet,
      title: t("item1Title", { default: "Şeffaf Fiyatlandırma" }),
      desc: t("item1Desc", { default: "Piyasa koşullarına göre en adil ve şeffaf fiyat teklifini sunuyoruz." }),
    },
    {
      icon: Truck,
      title: t("item2Title", { default: "Yerinden Alım Kolaylığı" }),
      desc: t("item2Desc", { default: "Aracınızı bulunduğu yerden ücretsiz çekici ile teslim alıyoruz." }),
    },
    {
      icon: Scale,
      title: t("item3Title", { default: "Evrak Sürecinde Destek" }),
      desc: t("item3Desc", { default: "Noter ve tüm yasal süreçlerde ekibimiz yanınızda." }),
    },
    {
      icon: HeadphonesIcon,
      title: t("item4Title", { default: "Hızlı İletişim" }),
      desc: t("item4Desc", { default: "WhatsApp ve telefon üzerinden 7/24 ulaşılabiliriz." }),
    },
  ];

  return (
    <section
      aria-label={t("title", { default: "Neden Oto Grade" })}
      className="bg-surface-container-lowest border-b border-[0.5px] border-border-default py-32 md:py-44"
    >
      <Container>
        <div className="flex flex-col lg:flex-row gap-32 items-start">
          <div className="flex-1 flex flex-col gap-24">
            <div className="flex flex-col gap-24 text-left">
            <div>
              <span className="text-[11px] font-medium text-primary uppercase tracking-wider mx-auto md:mx-0">{t("badge", { default: "NEDEN OTO GRADE?" })}</span>
              <h2 className="text-[28px] md:text-[32px] font-medium text-on-surface tracking-[-1.5px] mt-8 leading-tight">{t("title", { default: "Hasarlı araç satışını hızlı, güvenli ve zahmetsiz hale getiriyoruz." })}</h2>
              <p className="text-[14px] leading-relaxed text-muted-text mt-16 mx-auto md:mx-0 max-w-[700px]">{t("subtitle", { default: "Aracınız kazalı, pert, yanmış, sel hasarlı veya motor arızalı olabilir. Oto Grade, süreci sizin için sadeleştirir: hızlı değerlendirme, yerinden alım, evrak desteği ve güvenli ödeme." })}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-12 w-full">
              <Link href={routes.quote()} className="w-full sm:w-auto text-center bg-primary text-on-primary px-24 py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity">
                {t("ctaQuote", { default: "Hemen Teklif Al" })}
              </Link>
              <a href={externalRoutes.whatsapp(WHATSAPP_NUMBER)} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-24 py-16 rounded-btn text-[14px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors">
                <FaWhatsapp size={20} aria-hidden />
                {t("ctaWhatsapp", { default: "WhatsApp ile Yaz" })}
              </a>
            </div>
            <p className="text-[12px] text-muted-text mx-auto md:mx-0">{t("note", { default: "Ücretsiz değerlendirme • Bağlayıcı değil • Türkiye geneli hizmet" })}</p>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-16">
            {ITEMS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.35, ease: "easeOut" }}
                className="bg-surface border border-[0.5px] border-border-default rounded-[14px] p-24 text-left flex flex-col items-start"
              >
                <div className="inline-flex bg-accent-light border border-[0.5px] border-accent-border p-12 rounded-full mb-16">
                  <Icon size={24} strokeWidth={1.5} className="text-primary" />
                </div>
                <h3 className="text-[16px] font-medium text-on-surface mb-8">{title}</h3>
                <p className="text-[13px] text-muted-text leading-relaxed">{desc}</p>
              </motion.div>
            ))}
            </div>
          </div>
          {/* <div className="w-full lg:w-[480px] shrink-0 h-[400px] lg:h-auto self-stretch">
            <img 
              src="/images/sections/why_choose_us_img.png" 
              alt={t("title", { default: "Neden Oto Grade" })} 
              className="w-full h-full object-cover rounded-[14px] shadow-sm"
            />
          </div> */}
        </div>

        <div className="mt-24 p-24 bg-surface border border-[0.5px] border-border-default rounded-[14px] flex flex-col md:flex-row gap-24 md:justify-around md:items-center">
            <div className="flex flex-col items-start text-left">
              <span className="text-[24px] font-bold text-on-surface">3.200+</span>
              <span className="text-[13px] text-muted-text mt-4">{t("stat1", { default: "araç değerlendirildi" })}</span>
            </div>
            <div className="flex flex-col items-start text-left border-y md:border-y-0 md:border-x border-[0.5px] border-border-default py-24 md:py-0 md:px-24">
              <span className="text-[24px] font-bold text-on-surface">{t("stat2Title", { default: "24 saat içinde" })}</span>
              <span className="text-[13px] text-muted-text mt-4">{t("stat2", { default: "tüm süreç tamamlanır" })}</span>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-[24px] font-bold text-on-surface">{t("stat3Title", { default: "Türkiye Geneli" })}</span>
              <span className="text-[13px] text-muted-text mt-4">{t("stat3", { default: "her noktadan alım" })}</span>
            </div>
          </div>
      </Container>
    </section>
  );
}
