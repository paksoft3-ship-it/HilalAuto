"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardBody } from "@/components/ui/Card";

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Ahmet Y.",
    city: "İstanbul",
    vehicleType: "Kazalı Araç",
    text: "Aracım kaza geçirmişti ve ne yapacağımı bilmiyordum. HazarAl ekibi çok hızlı dönüş yaptı, aracımı yerinden aldılar. Süreç çok rahat geçti.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Fatma K.",
    city: "Ankara",
    vehicleType: "Pert Araç",
    text: "Sigorta pert ilan etmişti, aracı ne yapacağımı bilemiyordum. HazarAl ile çok basit oldu, teklif aldım ve evrak sürecinde destek sağlandı.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Murat D.",
    city: "İzmir",
    vehicleType: "Sel Hasarlı Araç",
    text: "Sel basan aracımı satmak için birçok yeri aradım ama en hızlı ve güvenilir cevap HazarAl'dan geldi. Tavsiye ederim.",
    rating: 5,
  },
];

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

export function SocialProof() {
  return (
    <section aria-label="Müşteri yorumları" className="bg-bg-primary py-44 md:py-60">
      <Container>
        <SectionHeader
          badge="Referanslar"
          title="Müşterilerimiz Ne Diyor?"
          subtitle="Binlerce araç sahibi HazarAl ile güvenle satış yaptı."
          className="mb-32 md:mb-44"
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
