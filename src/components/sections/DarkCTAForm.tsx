"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { QuickQuoteForm } from "@/components/forms/QuickQuoteForm";
import { externalRoutes } from "@/lib/routes";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { FaWhatsapp } from 'react-icons/fa';

// Bullets will be handled dynamically with translation hook

export function DarkCTAForm() {
  const t = useTranslations("darkCta");

  const BULLETS = [
    t("bullet1", { default: "Ücretsiz ve bağlayıcı değil" }),
    t("bullet2", { default: "1 saat içinde geri dönüş" }),
    t("bullet3", { default: "Yerinden alım desteği" }),
    t("bullet4", { default: "Evrak işlemlerinde yardım" }),
  ];

  return (
    <section
      aria-label="Teklif al bölümü"
      className="bg-bg-dark py-24 md:py-32"
    >
      <Container>
        <div className="flex flex-col lg:flex-row gap-24 md:gap-32 items-start">
          {/* Left: copy */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-block text-[11px] font-medium text-accent uppercase tracking-wider mb-16">
                {t("badge", { default: "Ücretsiz Teklif" })}
              </span>
              <h2 className="text-section-title-mobile md:text-section-title font-medium tracking-heading text-white">
                {t("title", { default: "Aracınızı Satmaya Hazır mısınız?" })}
              </h2>
              <p className="text-[14px] text-[#AAAAAA] mt-12 mb-24 leading-relaxed max-w-[440px]">
                {t("subtitle", { default: "Kısa formu doldurun, uzman ekibimiz en kısa sürede size dönüş yapsın. Teklif almak tamamen ücretsiz ve bağlayıcı değil." })}
              </p>

              <ul className="flex flex-col gap-8 mb-24" aria-label="Avantajlar">
                {BULLETS.map((b) => (
                  <li key={b} className="flex items-center gap-8">
                    <CheckCircle
                      size={15}
                      strokeWidth={1.5}
                      className="text-accent shrink-0"
                      aria-hidden
                    />
                    <span className="text-[13px] text-[#AAAAAA]">{b}</span>
                  </li>
                ))}
              </ul>

              <a
                href={externalRoutes.whatsapp(
                  WHATSAPP_NUMBER,
                  t("whatsappMessage", { default: "Merhaba, hasarlı aracım için teklif almak istiyorum." })
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-24 py-12 rounded-btn text-[14px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
                aria-label={t("whatsapp", { default: "WhatsApp ile Yaz" })}
              >
                <FaWhatsapp size={16} strokeWidth={1.5} aria-hidden />
                {t("whatsapp", { default: "WhatsApp ile Yaz" })}
              </a>
            </motion.div>
          </div>

          {/* Right: form */}
          <motion.div
            className="w-full lg:w-[440px] shrink-0"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <div className="bg-white rounded-card-lg p-24 md:p-32">
              <div className="mb-24">
                <h3 className="text-[17px] font-medium text-text-primary tracking-[-0.5px]">
                  {t("formTitle", { default: "Hızlı Teklif Formu" })}
                </h3>
                <p className="text-[12px] text-text-soft mt-4">
                  {t("formSub", { default: "Bağlayıcı değil · Hızlı dönüş" })}
                </p>
              </div>
              <QuickQuoteForm />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
