"use client";
import { useTranslations } from "next-intl";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { routes, externalRoutes } from "@/lib/routes";
import { FaWhatsapp } from 'react-icons/fa';

export default function NotFound() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";
  const t = useTranslations("notFound");

  return (
    <>
      <Navbar />
      <main className="py-60 md:py-80 pb-[76px] md:pb-0 min-h-[60vh] flex items-center">
        <Container>
          <div className="max-w-[480px] mx-auto text-center flex flex-col items-center gap-24">
            <p className="text-[80px] font-medium text-text-primary leading-none tracking-[-4px]">404</p>
            <div className="flex flex-col gap-8">
              <h1 className="text-[22px] font-medium text-text-primary tracking-heading">
                {t("title", { default: "Sayfa Bulunamadı" })}
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed">
                {t("message", { default: "Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir." })}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-12 w-full justify-center">
              <Link
                href={routes.home(locale)}
                className="inline-flex items-center gap-8 bg-accent text-white px-24 py-14 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
              >
                <ArrowLeft size={15} strokeWidth={1.5} aria-hidden />
                {t("home", { default: "Ana Sayfaya Dön" })}
              </Link>
              <Link
                href={routes.quote(locale)}
                className="inline-flex items-center gap-8 bg-white border border-[0.5px] border-border-default text-text-primary px-24 py-14 rounded-btn font-medium text-[14px] hover:border-accent hover:text-accent transition-colors w-full sm:w-auto justify-center"
              >
                <FileText size={15} strokeWidth={1.5} aria-hidden />
                {t("quote", { default: "Teklif Al" })}
              </Link>
              <a
                href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-8 bg-white border border-[0.5px] border-border-default text-text-primary px-24 py-14 rounded-btn font-medium text-[14px] hover:border-whatsapp hover:text-whatsapp transition-colors w-full sm:w-auto justify-center"
              >
                <FaWhatsapp size={15} strokeWidth={1.5} aria-hidden />
                {t("whatsapp", { default: "WhatsApp ile Yaz" })}
              </a>
            </div>
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}
