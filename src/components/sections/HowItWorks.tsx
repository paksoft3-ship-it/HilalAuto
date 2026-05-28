"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { routes } from "@/lib/routes";

const STEPS = [
  {
    num: "01",
    time: "~2 dakika",
    title: "Formu Doldurun",
    desc: "Araç markası, hasar türü, şehir ve telefon bilgilerinizi kısa form üzerinden gönderin.",
  },
  {
    num: "02",
    time: "1 saat içinde",
    title: "Uzmanımız Sizi Arasın",
    desc: "Ekibimiz aracınızın durumunu değerlendirir ve size hızlıca teklif sunar.",
  },
  {
    num: "03",
    time: "24 saat içinde",
    title: "Aracınızı Alalım, Ödemenizi Yapın",
    desc: "Aracı bulunduğu yerden teslim alır, evrak sürecinde destek olur ve ödemenizi tamamlarız.",
  },
];

export function HowItWorks() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";

  return (
    <section
      aria-label="Nasıl çalışır"
      className="bg-surface border-y border-[0.5px] border-border-default py-44 md:py-60"
    >
      <Container>
        <SectionHeader
          badge="Süreç"
          title="3 Adımda Aracınızı Satın"
          subtitle="Bilgilerinizi gönderin, uzman ekibimiz size hızlıca ulaşsın. Aracınızı bulunduğu yerden teslim alalım."
          align="center"
          className="mb-32 md:mb-44"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {STEPS.map(({ num, time, title, desc }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] p-24 flex flex-col gap-16 text-center relative z-10"
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
          className="mt-32 md:mt-44 p-24 border border-[0.5px] border-border-default rounded-xl flex flex-col sm:flex-row items-center justify-between gap-16 bg-surface-container-lowest"
        >
          <p className="text-[14px] text-on-surface text-center sm:text-left">
            Aracınız için ücretsiz ve bağlayıcı olmayan teklif alın.
          </p>
          <Link
            href={routes.quote(locale)}
            className="inline-flex items-center gap-8 bg-primary text-on-primary px-24 py-16 rounded-lg font-medium text-[14px] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 w-full sm:w-auto justify-center"
          >
            Hemen Teklif Al
            <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
