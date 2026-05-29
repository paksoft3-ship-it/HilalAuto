"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle, Phone, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { routes, externalRoutes } from "@/lib/routes";
import { PHONE_NUMBER, WHATSAPP_NUMBER } from "@/lib/constants";
import { trackRemarketingPageView } from "@/lib/tracking";
import { fireGoogleAdsConversion } from "@/lib/gtag";
import { FaWhatsapp } from "react-icons/fa";

export function TesekkurlerClient() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";
  const t = useTranslations("thankYou");

  useEffect(() => {
    trackRemarketingPageView("thank_you");
    fireGoogleAdsConversion();
  }, []);

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0 min-h-[70vh] flex items-center">
        <Container narrow className="py-60">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center text-center gap-24"
          >
            <div className="flex items-center justify-center w-[72px] h-[72px] bg-accent-light border border-[0.5px] border-accent-border rounded-full">
              <CheckCircle size={36} strokeWidth={1.5} className="text-accent" aria-hidden />
            </div>

            <div>
              <h1 className="text-section-title-mobile md:text-section-title font-medium tracking-heading text-text-primary">
                {t("title", { default: "Başvurunuz Alındı" })}
              </h1>
              <p className="mt-16 text-[14px] text-text-muted max-w-[480px] mx-auto leading-relaxed">
                {t("desc", { default: "Oto Grade ekibi kısa sürede size telefon veya WhatsApp üzerinden dönüş yapacaktır. Ortalama yanıt süremiz 1 saattir." })}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-12 mt-8">
              <a
                href={externalRoutes.whatsapp(
                  WHATSAPP_NUMBER,
                  "Merhaba, az önce teklif başvurusu yaptım. Bilgi alabilir miyim?"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-8 bg-whatsapp text-white px-32 py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity"
                aria-label={t("whatsappAria", { default: "WhatsApp ile hemen yazın" })}
              >
                <FaWhatsapp size={16} aria-hidden />
                {t("whatsapp", { default: "WhatsApp ile Hemen Yaz" })}
              </a>
              <a
                href={externalRoutes.phone(PHONE_NUMBER)}
                className="inline-flex items-center justify-center gap-8 bg-white border border-[0.5px] border-border-default text-text-primary px-32 py-16 rounded-btn text-[14px] hover:border-accent hover:text-accent transition-colors"
                aria-label={t("phoneAria", { default: "Telefonla arayın" })}
              >
                <Phone size={16} strokeWidth={1.5} aria-hidden />
                {t("phone", { default: "Telefonla Ara" })}
              </a>
              <Link
                href={routes.home(locale)}
                className="inline-flex items-center justify-center gap-8 bg-white border border-[0.5px] border-border-default text-text-primary px-32 py-16 rounded-btn text-[14px] hover:border-text-primary transition-colors"
              >
                <Home size={16} strokeWidth={1.5} aria-hidden />
                {t("home", { default: "Ana Sayfaya Dön" })}
              </Link>
            </div>

            <div className="mt-8 p-24 bg-bg-surface border border-[0.5px] border-border-default rounded-card w-full max-w-[480px] text-left">
              <h2 className="text-[14px] font-medium text-text-primary mb-12">
                {t("stepsTitle", { default: "Sonraki adımlar" })}
              </h2>
              <ol className="flex flex-col gap-12 text-[13px] text-text-muted list-decimal list-inside leading-relaxed">
                <li>{t("step1", { default: "Uzmanımız sizi 1 saat içinde arayacak." })}</li>
                <li>{t("step2", { default: "Araç bilgilerini ve teklifinizi değerlendireceğiz." })}</li>
                <li>{t("step3", { default: "Anlaşma sağlanırsa aracınızı yerinden teslim alacağız." })}</li>
                <li>{t("step4", { default: "Devir ve ödeme işlemi tamamlanacak." })}</li>
              </ol>
            </div>
          </motion.div>
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}
