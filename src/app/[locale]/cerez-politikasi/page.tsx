import { getPathname } from "@/i18n/routing";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: { absolute: isEn ? `Cookie Policy — ${SITE_NAME}` : `Çerez Politikası — ${SITE_NAME}` },
    description: isEn
      ? "Information about the cookies used on Otograde and how you can manage them."
      : "Otograde üzerinde kullanılan çerezler ve bunları nasıl yönetebileceğiniz hakkında bilgi.",
    alternates: { canonical: `${SITE_URL}${getPathname({ locale, href: "/cerez-politikasi" as never })}` },
  };
}

const SECTIONS_TR = [
  {
    title: "1. Çerez Nedir?",
    body: "Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır. Çerezler; oturumunuzu hatırlamak, site deneyimini iyileştirmek ve anonim istatistikler üretmek için kullanılır.",
  },
  {
    title: "2. Kullandığımız Çerez Türleri",
    body: "Zorunlu çerezler: Sitenin çalışması için gereklidir (oturum, dil tercihi, çerez tercihi). Analitik çerezler: Google Analytics aracılığıyla anonim kullanım istatistikleri toplar. Reklam/pazarlama çerezleri: Google Ads dönüşüm ölçümü ve yeniden pazarlama için kullanılır. Analitik ve reklam çerezleri yalnızca açık rızanız (çerez bildirimini kabul etmeniz) halinde etkinleşir.",
  },
  {
    title: "3. Çerez Tercihlerinizi Yönetme",
    body: "Sitemizi ilk ziyaretinizde görünen çerez bildiriminden zorunlu olmayan çerezleri kabul edebilir veya reddedebilirsiniz. Tercihinizi tarayıcınızın site verilerini temizleyerek sıfırlayabilir, ayrıca tarayıcı ayarlarınızdan tüm çerezleri engelleyebilir veya silebilirsiniz.",
  },
  {
    title: "4. Üçüncü Taraf Çerezleri",
    body: "Google Analytics ve Google Ads gibi hizmet sağlayıcılar kendi çerezlerini yerleştirebilir. Bu sağlayıcıların veri işleme faaliyetleri kendi gizlilik politikalarına tabidir.",
  },
  {
    title: "5. İletişim",
    body: "Çerez uygulamalarımızla ilgili sorularınız için iletişim sayfamızdan bize ulaşabilirsiniz.",
  },
];

const SECTIONS_EN = [
  {
    title: "1. What Are Cookies?",
    body: "Cookies are small text files stored in your browser by the websites you visit. They are used to remember your session, improve the site experience and produce anonymous statistics.",
  },
  {
    title: "2. Types of Cookies We Use",
    body: "Essential cookies: required for the site to work (session, language preference, consent choice). Analytics cookies: collect anonymous usage statistics via Google Analytics. Advertising cookies: used for Google Ads conversion measurement and remarketing. Analytics and advertising cookies are only activated with your explicit consent via the cookie banner.",
  },
  {
    title: "3. Managing Your Preferences",
    body: "You can accept or reject non-essential cookies in the cookie banner shown on your first visit. You can reset your choice by clearing the site data in your browser, and you can also block or delete all cookies from your browser settings.",
  },
  {
    title: "4. Third-Party Cookies",
    body: "Service providers such as Google Analytics and Google Ads may set their own cookies. Their data processing is subject to their own privacy policies.",
  },
  {
    title: "5. Contact",
    body: "For questions about our cookie practices, you can reach us via the contact page.",
  },
];

export default async function CerezPolitikasiPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";
  const sections = isEn ? SECTIONS_EN : SECTIONS_TR;

  return (
    <>
      <Navbar />
      <main className="py-32 md:py-44 pb-[76px] md:pb-0">
        <Container narrow>
          <h1 className="text-section-title-mobile md:text-section-title font-medium tracking-heading text-text-primary mb-32">
            {isEn ? "Cookie Policy" : "Çerez Politikası"}
          </h1>
          <div className="flex flex-col gap-24 text-[14px] text-text-muted leading-relaxed">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-[16px] font-medium text-text-primary mb-12">{s.title}</h2>
                <p>{s.body}</p>
              </section>
            ))}
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}
