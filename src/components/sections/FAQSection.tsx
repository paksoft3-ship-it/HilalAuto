"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { externalRoutes } from "@/lib/routes";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { FaWhatsapp } from 'react-icons/fa';

interface FAQSectionProps {
  dark?: boolean;
}

export function FAQSection({ dark = false }: FAQSectionProps) {
  const t = useTranslations("faq");
  const items = Array.from({ length: 8 }).map((_, i) => ({
    id: `q${i + 1}`,
    question: t(`q${i + 1}` as never),
    answer: t(`a${i + 1}` as never),
  }));

  return (
    <section
      aria-label="Sık sorulan sorular"
      className="bg-surface-container-lowest py-24 md:py-32 border-b border-[0.5px] border-border-default"
    >
      <Container>
        <div className="flex flex-col gap-24">
          <div className="flex flex-col gap-24 text-left">
            <div className="flex flex-col gap-8">
              <span className="text-[11px] font-medium text-primary uppercase tracking-wider mx-auto md:mx-0">{t("badge", { default: "SIK SORULAN SORULAR" })}</span>
              <h2 className="text-[28px] md:text-[32px] font-medium text-on-surface tracking-[-1.5px] leading-tight">{t("title")}</h2>
              <p className="text-[14px] text-muted-text max-w-[560px] mt-8 mx-auto md:mx-0">{t("subtitle", { default: "Aracınızı satmadan önce süreç, ödeme ve evrak adımları hakkında en çok sorulan soruları burada bulabilirsiniz." })}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-surface border border-[0.5px] border-border-default rounded-[14px] p-24 text-left"
            >
              <h3 className="text-[16px] font-medium text-on-surface mb-8">
                {t("contactTitle", { default: "Cevabınızı bulamadınız mı?" })}
              </h3>
              <p className="text-[13px] text-muted-text mb-16">
                {t("contactDesc", { default: "WhatsApp üzerinden bize yazın, aracınızın durumu hakkında hızlıca bilgi verelim." })}
              </p>
              <a
                href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-20 py-16 rounded-btn text-[14px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
                aria-label={t("whatsapp", { default: "WhatsApp ile Yaz" })}
              >
                <FaWhatsapp size={20} strokeWidth={1.5} aria-hidden />
                {t("whatsapp", { default: "WhatsApp ile Yaz" })}
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Accordion items={items} dark={dark} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
