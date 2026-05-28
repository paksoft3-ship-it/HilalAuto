"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { routes, externalRoutes } from "@/lib/routes";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { FaWhatsapp } from 'react-icons/fa';

export function FinalCTA() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";

  return (
    <section
      aria-label="Son çağrı"
      className="bg-bg-surface py-44 md:py-60"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center gap-24"
        >
          <div>
            <span className="text-[11px] font-medium text-accent uppercase tracking-wider">
              Hemen Başlayın
            </span>
            <h2 className="mt-12 text-section-title-mobile md:text-section-title font-medium tracking-heading text-text-primary">
              Aracınız İçin Teklif Almaya Hazır mısınız?
            </h2>
            <p className="mt-16 text-[14px] text-text-muted max-w-[480px] mx-auto leading-relaxed">
              Ücretsiz teklif alın, bağlayıcı değil. Uzman ekibimiz kısa sürede size dönüş yapar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-12">
            <Link
              href={routes.quote(locale)}
              className="inline-flex items-center justify-center gap-8 bg-accent text-white px-32 py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity"
            >
              Ücretsiz Teklif Al
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
            <a
              href={externalRoutes.whatsapp(
                WHATSAPP_NUMBER,
                "Merhaba, hasarlı aracım için teklif almak istiyorum."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-32 py-16 rounded-btn text-[14px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
              aria-label="WhatsApp ile yazın"
            >
              <FaWhatsapp size={16} strokeWidth={1.5} aria-hidden />
              WhatsApp ile Yaz
            </a>
          </div>

          <p className="text-[12px] text-text-soft">
            Teklif almak ücretsiz ve bağlayıcı değildir.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
