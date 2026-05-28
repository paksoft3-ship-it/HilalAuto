"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { QuickQuoteForm } from "@/components/forms/QuickQuoteForm";
import { routes, externalRoutes } from "@/lib/routes";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { FaWhatsapp } from 'react-icons/fa';

const TRUST_BULLETS = [
  "Türkiye geneli hizmet",
  "Yerinden alım",
  "Bağlayıcı değil, ücretsiz teklif",
];

const WORDS = ["Hasarlı", "Aracınız", "İçin", "Hızlı", "ve", "Güvenli", "Teklif", "Alın"];

function AnimatedHeading() {
  return (
    <h1 className="text-[30px] leading-[1.1] md:text-hero-lg text-on-surface mb-16 md:mb-24 font-medium tracking-[-1.5px]">
      {WORDS.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
        >
          {word === "Hızlı" ? (
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

  return (
    <section aria-label="Hero bölümü">
      <Container className="py-44 md:py-[100px]">
        <div className="flex flex-col md:flex-row gap-44 md:gap-60 items-center">
          {/* Left: content */}
          <div className="flex-1 w-full text-left">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-start mb-24"
            >
              <Badge variant="accent">Hızlı &amp; Güvenilir</Badge>
            </motion.div>

            <AnimatedHeading />

            <motion.p
              className="mt-16 md:mt-24 text-[14px] text-secondary leading-relaxed max-w-[500px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Kazalı, pert, yanmış, sel hasarlı veya hurda aracınızı değerinde
              alıyoruz. Kısa formu doldurun, uzman ekibimiz size hızlıca dönüş
              yapsın.
            </motion.p>

            {/* Bullets */}
            <motion.ul
              className="mt-24 flex flex-col gap-8 items-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.4 }}
              aria-label="Öne çıkan özellikler"
            >
              {TRUST_BULLETS.map((item) => (
                <li key={item} className="flex items-center gap-8">
                  <CheckCircle
                    size={15}
                    strokeWidth={1.5}
                    className="text-primary shrink-0"
                    aria-hidden
                  />
                  <span className="text-[13px] text-secondary">{item}</span>
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
                href={routes.quote(locale)}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-on-primary px-32 py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity"
              >
                Ücretsiz Teklif Al
              </Link>
              <a
                href={externalRoutes.whatsapp(
                  WHATSAPP_NUMBER,
                  "Merhaba, hasarlı aracım için teklif almak istiyorum."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-32 py-16 rounded-btn text-[14px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
                aria-label="WhatsApp ile yazın"
              >
                <FaWhatsapp size={16} strokeWidth={1.5} aria-hidden />
                WhatsApp ile Yaz
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
                  Hızlı Teklif Formu
                </h2>
                <p className="text-[12px] text-soft-text mt-4">
                  Bağlayıcı değil · Hızlı dönüş
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
