/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { routes } from "@/lib/routes";

export function HowItWorks() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";
  const t = useTranslations("howItWorks");

  const STEPS = [
    {
      num: "01",
      time: t("step1Time", { default: "~2 dakika" }),
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      num: "02",
      time: t("step2Time", { default: "1 saat içinde" }),
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      num: "03",
      time: t("step3Time", { default: "24 saat içinde" }),
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
  ];

  return (
    <section
      aria-label={t("title")}
      className="bg-surface border-y border-[0.5px] border-border-default py-32 md:py-44"
    >
      <Container>
        <SectionHeader
          badge={t("badge", { default: "Süreç" })}
          title={t("title")}
          subtitle={t("subtitle")}
          align="left"
          className="mb-32"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {STEPS.map(({ num, time, title, desc }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] p-24 flex flex-col gap-16 text-left relative z-10"
            >
              <div className="flex flex-col items-center gap-12">
                <span
                  className="flex items-center justify-center w-[44px] h-[44px] bg-accent-light border border-[0.5px] border-accent-border text-primary rounded-full text-[16px] font-bold shrink-0"
                  aria-label={`Adım ${num}`}
                >
                  {num}
                </span>
                <span className="px-12 py-4 bg-surface border border-[0.5px] border-border-default text-muted-text rounded-pill text-[11px] font-medium">
                  {time}
                </span>
              </div>
              <div>
                <h3 className="text-[16px] font-medium text-on-surface mb-8">
                  {title}
                </h3>
                <p className="text-[14px] text-muted-text leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-24 p-24 border border-[0.5px] border-border-default rounded-xl flex flex-col sm:flex-row items-center justify-between gap-16 bg-surface-container-lowest"
        >
          <p className="text-[14px] text-on-surface text-left">
            {t("ctaText", { default: "Aracınız için ücretsiz ve bağlayıcı olmayan teklif alın." })}
          </p>
          <Link
            href={routes.quote()}
            className="inline-flex items-center gap-8 bg-primary text-on-primary px-24 py-16 rounded-lg font-medium text-[14px] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 w-full sm:w-auto justify-center"
          >
            {t("ctaButton", { default: "Hemen Teklif Al" })}
            <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
