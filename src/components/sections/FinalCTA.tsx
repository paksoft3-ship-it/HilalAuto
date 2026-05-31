/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { routes, externalRoutes } from "@/lib/routes";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { FaWhatsapp } from 'react-icons/fa';

export function FinalCTA() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";
  const t = useTranslations("cta");

  return (
    <section
      aria-label="Son çağrı"
      className="relative py-32 md:py-44 overflow-hidden"
    >
      {/* <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/sections/final_cta_bg.png')" }}
      /> */}
      <div className="absolute inset-0 z-0 bg-black/60" />
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-start text-left gap-24"
        >
          <div>
            <span className="text-[11px] font-medium text-primary uppercase tracking-wider">
              {t("badge", { default: "Hemen Başlayın" })}
            </span>
            <h2 className="mt-12 text-section-title-mobile md:text-section-title font-medium tracking-heading text-white">
              {t("title")}
            </h2>
            <p className="mt-16 text-[14px] text-white/80 max-w-[480px] mx-auto md:mx-0 leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-12">
            <Link
              href={routes.quote()}
              className="inline-flex items-center justify-center gap-8 bg-accent text-white px-32 py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity"
            >
              {t("button")}
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
            <a
              href={externalRoutes.whatsapp(
                WHATSAPP_NUMBER,
                t("whatsappMessage", { default: "Merhaba, hasarlı aracım için teklif almak istiyorum." })
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-32 py-16 rounded-btn text-[14px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
              aria-label={t("whatsapp")}
            >
              <FaWhatsapp size={16} strokeWidth={1.5} aria-hidden />
              {t("whatsapp")}
            </a>
          </div>

          <p className="text-[12px] text-text-soft">
            {t("note", { default: "Teklif almak ücretsiz ve bağlayıcı değildir." })}
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
