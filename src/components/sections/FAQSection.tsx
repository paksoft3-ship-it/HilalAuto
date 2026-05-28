"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { externalRoutes } from "@/lib/routes";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { FaWhatsapp } from 'react-icons/fa';
import { SITE_FAQ_ITEMS as FAQ_ITEMS } from "@/data/faqs";

interface FAQSectionProps {
  dark?: boolean;
}

export function FAQSection({ dark = false }: FAQSectionProps) {
  return (
    <section
      aria-label="Sık sorulan sorular"
      className="bg-surface-container-lowest py-44 md:py-[100px] border-b border-[0.5px] border-border-default"
    >
      <Container>
        <div className="flex flex-col gap-44">
          <div className="flex flex-col gap-24 text-center md:text-left">
            <div className="flex flex-col gap-8">
              <span className="text-[11px] font-medium text-primary uppercase tracking-wider mx-auto md:mx-0">SIK SORULAN SORULAR</span>
              <h2 className="text-[28px] md:text-[32px] font-medium text-on-surface tracking-[-1.5px] leading-tight">Hasarlı araç satışı hakkında merak edilenler</h2>
              <p className="text-[14px] text-muted-text max-w-[560px] mt-8 mx-auto md:mx-0">Aracınızı satmadan önce süreç, ödeme ve evrak adımları hakkında en çok sorulan soruları burada bulabilirsiniz.</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-surface border border-[0.5px] border-border-default rounded-[14px] p-24 text-center md:text-left"
            >
              <h3 className="text-[16px] font-medium text-on-surface mb-8">
                Cevabınızı bulamadınız mı?
              </h3>
              <p className="text-[13px] text-muted-text mb-16">
                WhatsApp üzerinden bize yazın, aracınızın durumu hakkında hızlıca bilgi verelim.
              </p>
              <a
                href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-8 bg-whatsapp-green text-white px-20 py-16 rounded-lg text-[14px] font-medium hover:opacity-90 transition-opacity"
                aria-label="WhatsApp ile yazın"
              >
                <FaWhatsapp size={20} strokeWidth={1.5} aria-hidden />
                WhatsApp ile Yaz
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Accordion items={FAQ_ITEMS} dark={dark} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
