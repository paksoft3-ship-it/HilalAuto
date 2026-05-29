"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardBody } from "@/components/ui/Card";

export function SocialProof() {
  const t = useTranslations("socialProof");

  const TESTIMONIALS = [
    {
      id: "t1",
      name: "Ahmet Y.",
      city: "İstanbul",
      vehicleType: t("vehicle1", { default: "Kazalı Araç" }),
      text: t("text1", { default: "Aracım kaza geçirmişti ve ne yapacağımı bilmiyordum. Oto Grade ekibi çok hızlı dönüş yaptı, aracımı yerinden aldılar. Süreç çok rahat geçti." }),
      rating: 5,
    },
    {
      id: "t2",
      name: "Fatma K.",
      city: "Ankara",
      vehicleType: t("vehicle2", { default: "Pert Araç" }),
      text: t("text2", { default: "Sigorta pert ilan etmişti, aracı ne yapacağımı bilemiyordum. Oto Grade ile çok basit oldu, teklif aldım ve evrak sürecinde destek sağlandı." }),
      rating: 5,
    },
    {
      id: "t3",
      name: "Murat D.",
      city: "İzmir",
      vehicleType: t("vehicle3", { default: "Sel Hasarlı Araç" }),
      text: t("text3", { default: "Sel basan aracımı satmak için birçok yeri aradım ama en hızlı ve güvenilir cevap Oto Grade'dan geldi. Tavsiye ederim." }),
      rating: 5,
    },
  ];

  return (
    <section aria-label={t("title")} className="bg-bg-primary py-24 md:py-32">
      <Container>
        <SectionHeader
          badge={t("badge", { default: "Referanslar" })}
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-24"
        />

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {TESTIMONIALS.map(({ id, name, city, vehicleType, text, rating }, i) => (
            <motion.li
              key={id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
            >
              <Card className="h-full">
                <CardBody className="flex flex-col gap-16">
                  <StarRating count={rating} />
                  <p className="text-[13px] text-text-muted leading-relaxed flex-1">
                    &ldquo;{text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-12 border-t border-[0.5px] border-border-default">
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">{name}</p>
                      <p className="text-[12px] text-text-soft">{city}</p>
                    </div>
                    <span className="px-8 py-4 bg-accent-light border border-[0.5px] border-accent-border text-accent rounded-pill text-[11px] font-medium">
                      {vehicleType}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-4" aria-label={`${count} yıldız`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={13}
          strokeWidth={0}
          fill="#E8380D"
          className="text-accent"
          aria-hidden
        />
      ))}
    </div>
  );
}
