"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("vehicleTypes");

  const vehicleTypes = [
    {
      icon: Car,
      label: t("type1Label", { default: "Kazalı Araç" }),
      desc: t("type1Desc", { default: "Trafik kazası sonucu hasarlanmış araçlar" }),
      slug: "kazali-arac-alimi",
    },
    {
      icon: ShieldAlert,
      label: t("type2Label", { default: "Pert Araç" }),
      desc: t("type2Desc", { default: "Sigorta tarafından pert ilan edilmiş araçlar" }),
      slug: "pert-arac-alimi",
    },
    {
      icon: Flame,
      label: t("type3Label", { default: "Yanmış Araç" }),
      desc: t("type3Desc", { default: "Yangın hasarı görmüş araçlar" }),
      slug: "yanmis-arac-alimi",
    },
    {
      icon: Droplets,
      label: t("type4Label", { default: "Sel Hasarlı Araç" }),
      desc: t("type4Desc", { default: "Su baskını veya sel nedeniyle zarar gören araçlar" }),
      slug: "sel-hasarli-arac-alimi",
    },
    {
      icon: Trash2,
      label: t("type5Label", { default: "Hurda Araç" }),
      desc: t("type5Desc", { default: "Ekonomik değerini yitirmiş araçlar" }),
      slug: "hurda-arac-alimi",
    },
    {
      icon: Wrench,
      label: t("type6Label", { default: "Motor Arızalı Araç" }),
      desc: t("type6Desc", { default: "Motor veya şanzıman arızası olan araçlar" }),
      slug: "motor-arizali-arac-alimi",
    },
    {
      icon: FileX,
      label: t("type7Label", { default: "Çekme Belgeli Araç" }),
      desc: t("type7Desc", { default: "Çekme kaydı bulunan araçlar" }),
      slug: "cekme-belgeli-arac-alimi",
    },
    {
      icon: AlertTriangle,
      label: t("type8Label", { default: "Ağır Hasarlı Araç" }),
      desc: t("type8Desc", { default: "Ciddi kaza hasarı bulunan araçlar" }),
      slug: "agir-hasarli-arac-alimi",
    },
  ];

  return (
    <section aria-label={t("title", { default: "Aldığımız araç türleri" })} className="bg-surface-container-lowest py-44 md:py-60">
      <Container>
        <SectionHeader
          badge={t("badge", { default: "Araç Türleri" })}
          title={t("title", { default: "Hangi Araçları Alıyoruz?" })}
          subtitle={t("subtitle", { default: "Her türlü hasarlı aracı değerinde alıyoruz. Aracınızın durumu ne olursa olsun teklif veririz." })}
          className="mb-32 md:mb-44"
        />

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 md:gap-16">
          {vehicleTypes.map(({ icon: Icon, label, desc, slug }, i) => (
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
                  {t("details", { default: "Detaylı Bilgi" })} <ArrowRight size={16} />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
