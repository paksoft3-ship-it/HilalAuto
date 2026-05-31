"use client";

import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { QuickQuoteForm } from "@/components/forms/QuickQuoteForm";
import { routes, externalRoutes } from "@/lib/routes";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { FaWhatsapp } from 'react-icons/fa';

function AnimatedHeading({ heading, highlightWord }: { heading: string, highlightWord: string }) {
  const words = heading.split(" ");
  return (
    <h1 className="text-[30px] leading-[1.1] md:text-hero-lg text-white mb-16 md:mb-24 font-medium tracking-[-1.5px]">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
        >
          {word === highlightWord || word === "Hızlı" ? (
            <span className="text-primary">{word}</span>
          ) : (
            word
          )}
        </motion.span>
      ))}
    </h1>
  );
}

export function Hero() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";
  const t = useTranslations("hero");

  const trustBullets = [
    t("bullet1", { default: "Türkiye geneli hizmet" }),
    t("bullet2", { default: "Yerinden alım" }),
    t("bullet3", { default: "Bağlayıcı değil, ücretsiz teklif" }),
  ];

  return (
    <section aria-label="Hero bölümü" className="relative bg-black overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/sections/hero_bg_image.png')" }}
      />
      <Container className="relative z-10 py-32 md:py-44">
        <div className="flex flex-col md:flex-row gap-24 md:gap-32 items-center">
          {/* Left: content */}
          <div className="flex-1 w-full text-left">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-start mb-24"
            >
              <Badge variant="accent">{t("badge", { default: "Hızlı & Güvenilir" })}</Badge>
            </motion.div>

            <AnimatedHeading heading={t("heading")} highlightWord={locale === "en" ? "Fast" : "Hızlı"} />

            <motion.p
              className="mt-16 md:mt-24 text-[14px] text-white/80 leading-relaxed max-w-[500px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              {t("description")}
            </motion.p>

            {/* Bullets */}
            <motion.ul
              className="mt-24 flex flex-col gap-8 items-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.4 }}
              aria-label={t("bulletAria", { default: "Öne çıkan özellikler" })}
            >
              {trustBullets.map((item) => (
                <li key={item} className="flex items-center gap-8">
                  <CheckCircle
                    size={15}
                    strokeWidth={1.5}
                    className="text-primary shrink-0"
                    aria-hidden
                  />
                  <span className="text-[13px] text-white/80">{item}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTA buttons */}
            <motion.div
              className="mt-32 flex flex-col sm:flex-row gap-12 justify-start w-full sm:w-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <Link
                href={routes.quote()}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-on-primary px-32 py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity"
              >
                {t("ctaQuote")}
              </Link>
              <a
                href={externalRoutes.whatsapp(
                  WHATSAPP_NUMBER,
                  t("whatsappMessage", { default: "Merhaba, hasarlı aracım için teklif almak istiyorum." })
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-32 py-16 rounded-btn text-[14px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
                aria-label={t("ctaWhatsApp")}
              >
                <FaWhatsapp size={16} strokeWidth={1.5} aria-hidden />
                {t("ctaWhatsApp")}
              </a>
            </motion.div>
          </div>

          {/* Right: quick form card */}
          <motion.div
            className="w-full md:w-[440px] shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          >
            <div className="bg-surface border border-[0.5px] border-border-default rounded-[14px] p-24 md:p-32">
              <div className="mb-24">
                <h2 className="text-[18px] font-medium text-on-surface tracking-[-0.5px]">
                  {t("formTitle")}
                </h2>
                <p className="text-[12px] text-soft-text mt-4">
                  {t("formSubtitle")}
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
