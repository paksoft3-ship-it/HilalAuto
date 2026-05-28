"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Car,
  Flame,
  Droplets,
  Trash2,
  Wrench,
  FileX,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { routes } from "@/lib/routes";

const VEHICLE_TYPES = [
  {
    icon: Car,
    label: "Kazalı Araç",
    desc: "Trafik kazası sonucu hasarlanmış araçlar",
    slug: "kazali-arac-alimi",
  },
  {
    icon: ShieldAlert,
    label: "Pert Araç",
    desc: "Sigorta tarafından pert ilan edilmiş araçlar",
    slug: "pert-arac-alimi",
  },
  {
    icon: Flame,
    label: "Yanmış Araç",
    desc: "Yangın hasarı görmüş araçlar",
    slug: "yanmis-arac-alimi",
  },
  {
    icon: Droplets,
    label: "Sel Hasarlı Araç",
    desc: "Su baskını veya sel nedeniyle zarar gören araçlar",
    slug: "sel-hasarli-arac-alimi",
  },
  {
    icon: Trash2,
    label: "Hurda Araç",
    desc: "Ekonomik değerini yitirmiş araçlar",
    slug: "hurda-arac-alimi",
  },
  {
    icon: Wrench,
    label: "Motor Arızalı Araç",
    desc: "Motor veya şanzıman arızası olan araçlar",
    slug: "motor-arizali-arac-alimi",
  },
  {
    icon: FileX,
    label: "Çekme Belgeli Araç",
    desc: "Çekme kaydı bulunan araçlar",
    slug: "cekme-belgeli-arac-alimi",
  },
  {
    icon: AlertTriangle,
    label: "Ağır Hasarlı Araç",
    desc: "Ciddi kaza hasarı bulunan araçlar",
    slug: "agir-hasarli-arac-alimi",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export function VehicleTypeCards() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";

  return (
    <section aria-label="Aldığımız araç türleri" className="bg-surface-container-lowest py-44 md:py-60">
      <Container>
        <SectionHeader
          badge="Araç Türleri"
          title="Hangi Araçları Alıyoruz?"
          subtitle="Her türlü hasarlı aracı değerinde alıyoruz. Aracınızın durumu ne olursa olsun teklif veririz."
          className="mb-32 md:mb-44"
        />

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 md:gap-16">
          {VEHICLE_TYPES.map(({ icon: Icon, label, desc, slug }, i) => (
            <motion.li
              key={slug}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              <Link
                href={routes.service(locale, slug)}
                className="group flex flex-col p-24 bg-surface border border-[0.5px] border-border-default rounded-[14px] hover:border-primary transition-colors h-full"
              >
                <Icon
                  size={24}
                  strokeWidth={1.5}
                  className="text-primary mb-16 shrink-0"
                  aria-hidden
                />
                <h3 className="text-[16px] font-medium text-on-surface mb-8 leading-snug">
                  {label}
                </h3>
                <p className="text-[13px] text-muted-text mb-16 leading-relaxed">
                  {desc}
                </p>
                <span className="mt-auto text-primary text-[13px] font-medium flex items-center gap-4">
                  Detaylı Bilgi <ArrowRight size={16} />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
