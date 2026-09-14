import { getPathname } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { GRADE_COLORS as GRADE_TEXT, GRADE_DESCRIPTIONS } from "@/types/marketplace";
import { GRADE_COLORS } from "@/lib/grades";
import { routes } from "@/lib/routes";
import { SITE_URL } from "@/lib/constants";
import { localeUrl } from "@/lib/locale-url";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === "en"
      ? "Grade System (A–E) — Otograde"
      : "Grade Sistemi (A–E) Nedir? — Otograde";
  const description =
    locale === "en"
      ? "How Otograde grades damaged vehicles from A to E: what each grade means, what's inspected, how it relates to price, and how it maps to Turkish insurance terms."
      : "Otograde'nin A'dan E'ye hasar değerlendirme sistemi: her derecenin anlamı, neye bakıldığı, fiyatla ilişkisi ve resmi sigorta terimleriyle bağlantısı.";
  const canonical = `${SITE_URL}${getPathname({ locale, href: "/grade-sistemi" })}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        tr: `${SITE_URL}${getPathname({ locale: "tr", href: "/grade-sistemi" })}`,
        en: `${SITE_URL}${getPathname({ locale: "en", href: "/grade-sistemi" })}`,
        "x-default": `${SITE_URL}${getPathname({ locale: "tr", href: "/grade-sistemi" })}`,
      },
    },
    openGraph: { title, description, url: canonical, locale: locale === "en" ? "en_US" : "tr_TR", type: "website" },
  };
}

// Repair-risk tier already used on every listing page (ListingDetailClient's
// getRepairPotential) — reused here so the reference page and the listing
// pages it's linked from never say two different things about the same grade.
const REPAIR_TIER: Record<string, { title: string; note: string }> = {
  A: {
    title: "Onarım için uygun",
    note: "Düşük riskli hasara işaret eder. Yine de satın almadan önce bağımsız ekspertiz ve parça maliyeti kontrolü önerilir.",
  },
  B: {
    title: "Onarım için uygun",
    note: "Düşük riskli hasara işaret eder. Yine de satın almadan önce bağımsız ekspertiz ve parça maliyeti kontrolü önerilir.",
  },
  C: {
    title: "Maliyet dikkatle hesaplanmalı",
    note: "Orta seviyede hasar ihtimali var. Şasi, yürür aksam, güvenlik ekipmanları ve parça tedariki ayrıca kontrol edilmeli.",
  },
  D: {
    title: "Yüksek riskli onarım adayı",
    note: "Ağır hasar veya pert seviyesine yakın risk olabilir. Satın alma öncesi detaylı ekspertiz ve hukuki belge kontrolü gerekir.",
  },
  E: {
    title: "Genellikle parça/hurda değerinde",
    note: "Ekonomik onarım mümkün olmayabilir. Değerlendirme büyük ölçüde kullanılabilir parça ve malzeme değerine dayanır.",
  },
};

const GRADES = ["A", "B", "C", "D", "E"] as const;

export default async function GradeSystemPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gradeSystemPage" });

  const faqs = [
    {
      id: "who-assigns",
      question: t("faq1Q", { default: "Grade'i kim belirliyor, Otograde mi yoksa satıcı mı?" }),
      answer: t("faq1A", {
        default:
          "Grade, ilanı oluşturan bayi tarafından bu sayfada tanımlanan kritere göre seçilir — Otograde aracı fiziksel olarak incelemez. Bu yüzden ilandaki hasar notlarını ve fotoğrafları dikkatle incelemenizi, karar öncesi bağımsız ekspertiz yaptırmanızı öneririz.",
      }),
    },
    {
      id: "grade-vs-damage-type",
      question: t("faq2Q", { default: "Grade ile hasar türü (kazalı, pert, hurda) aynı şey mi?" }),
      answer: t("faq2A", {
        default:
          "Hayır, ikisi farklı ve birbirini tamamlayan iki bilgidir. Hasar türü hasarın nedenini anlatır (kazalı, yanmış, sel hasarlı, hurda vb.); Otograde derecesi ise hasarın ekonomik ağırlığını A'dan E'ye sınıflandırır. Aynı hasar türündeki iki araç, hasarın boyutuna göre farklı derece alabilir.",
      }),
    },
    {
      id: "official-term",
      question: t("faq3Q", { default: "A-E derecesi resmi bir sigorta veya trafik kaydı mı?" }),
      answer: t("faq3A", {
        default:
          "Hayır. A-E, Otograde'nin kendi değerlendirme ölçeğidir; resmî bir sigorta veya trafik sicil kaydı değildir. Sigorta şirketlerinin kullandığı 'ağır hasarlı', 'pert' gibi resmî kayıtlar ayrıca Tramer/hasar kaydı alanında ve ilan açıklamasında belirtilir.",
      }),
    },
    {
      id: "price",
      question: t("faq4Q", { default: "Grade fiyatı doğrudan mı belirliyor?" }),
      answer: t("faq4A", {
        default:
          "Hayır. Grade, aracın hasar ağırlığı hakkında hızlı bir fikir verir, ancak nihai fiyatı marka, model, kilometre, hasar türü ve satıcının belirlediği talep fiyatı birlikte belirler. Otograde fiyat garantisi vermez; her ilan bayisiyle doğrudan görüşerek netleştirilir.",
      }),
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-32 md:py-44">
          <Container>
            <div className="flex flex-col items-start gap-16 w-full lg:w-3/4">
              <Badge variant="accent">Grade Sistemi</Badge>
              <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary">
                Otograde Grade Sistemi: A&apos;dan E&apos;ye Hasar Değerlendirmesi
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed">
                Her ilan, hasarın ekonomik ağırlığını tek bakışta anlatan A-E arası bir
                dereceyle listelenir. Bu sayfa her derecenin ne anlama geldiğini, nasıl
                belirlendiğini ve resmî terimlerle ilişkisini açıklar.
              </p>
            </div>
          </Container>
        </section>

        {/* Grade cards */}
        <section className="py-32 md:py-44">
          <Container>
            <SectionHeader title="Dereceler Ne Anlama Gelir?" align="left" className="mb-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {GRADES.map((grade) => {
                const color = GRADE_COLORS[grade];
                const tier = REPAIR_TIER[grade];
                return (
                  <div
                    key={grade}
                    className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24"
                    style={{ borderLeft: `4px solid ${color}` }}
                  >
                    <div className="flex items-center gap-12 mb-12">
                      <span className="text-[24px] font-medium" style={{ color }}>
                        {GRADE_TEXT[grade].label}
                      </span>
                    </div>
                    <p className="text-[13px] text-on-surface leading-relaxed mb-12">
                      {GRADE_DESCRIPTIONS[grade]}
                    </p>
                    <div className="border-t border-[0.5px] border-border-default pt-12 mt-12">
                      <p className="text-[12px] font-medium text-text-primary mb-4">{tier.title}</p>
                      <p className="text-[12px] text-muted-text leading-relaxed">{tier.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Grade vs damage type */}
        <section className="py-32 md:py-44 bg-bg-surface border-y border-[0.5px] border-border-default">
          <Container narrow>
            <SectionHeader
              title="Grade, Hasar Türüyle Aynı Şey Değildir"
              align="left"
              className="mb-24"
            />
            <p className="text-[14px] text-text-muted leading-relaxed mb-16">
              Her ilanda iki ayrı ve birbirini tamamlayan bilgi bulunur:
            </p>
            <ul className="flex flex-col gap-8 mb-16">
              <li className="text-[14px] text-text-secondary">
                <strong className="text-text-primary">Hasar türü</strong> — hasarın nedenini anlatır:
                kazalı, pert, yanmış, sel hasarlı, hurda, motor arızalı, çekme belgeli, ağır hasarlı.
              </li>
              <li className="text-[14px] text-text-secondary">
                <strong className="text-text-primary">Otograde derecesi (A-E)</strong> — hasarın{" "}
                <em>ekonomik ağırlığını</em> sınıflandırır: onarımı kolay mı, pahalı mı, yoksa
                ekonomik olarak mantıklı değil mi.
              </li>
            </ul>
            <p className="text-[14px] text-text-muted leading-relaxed">
              Aynı hasar türündeki iki araç farklı derece alabilir — örneğin bir kazalı araç
              tampon hasarıyla Grade A olabilirken, şasi hasarlı başka bir kazalı araç Grade D
              olabilir.
            </p>
          </Container>
        </section>

        {/* Official terms mapping */}
        <section className="py-32 md:py-44">
          <Container narrow>
            <SectionHeader
              title="Resmî Sigorta Terimleriyle İlişkisi"
              align="left"
              className="mb-24"
            />
            <p className="text-[14px] text-text-muted leading-relaxed mb-16">
              A-E, Otograde&apos;nin kendi değerlendirme ölçeğidir — resmî bir sigorta veya
              trafik sicil kaydı değildir. Aşağıdaki resmî terimler ayrı bir alanda, ilanın
              hasar kaydı ve açıklamasında belirtilir; genel eğilim olarak ölçeğin ağır
              uçlarıyla (D-E) örtüşür, ancak birebir eşleşme garanti edilmez:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
              <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-16">
                <p className="text-[13px] font-medium text-text-primary mb-6">
                  Ağır Hasarlı (Pert)
                </p>
                <p className="text-[12px] text-muted-text leading-relaxed">
                  Onarımı teknik olarak mümkün olan, ancak maliyeti aracın değerine
                  yaklaşan veya tavan/şasi/hava yastığı gibi kritik noktalarında hasar
                  bulunan araçlar.
                </p>
              </div>
              <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-16">
                <p className="text-[13px] font-medium text-text-primary mb-6">Hurda Belgeli</p>
                <p className="text-[12px] text-muted-text leading-relaxed">
                  Onarımı teknik olarak mümkün olmayan, yalnızca parça veya hurda değeri
                  taşıyan araçlar.
                </p>
              </div>
              <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-16">
                <p className="text-[13px] font-medium text-text-primary mb-6">Çekme Belgeli</p>
                <p className="text-[12px] text-muted-text leading-relaxed">
                  Trafikten çekilmiş, normal şartlarda kendi gücüyle trafiğe çıkışı uygun
                  olmayan araçlar için düzenlenen belge — hasar derecesinden bağımsız bir
                  kayıt durumudur.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* How it's assigned */}
        <section className="py-32 md:py-44 bg-bg-surface border-y border-[0.5px] border-border-default">
          <Container narrow>
            <SectionHeader title="Derece Nasıl Belirlenir?" align="left" className="mb-24" />
            <p className="text-[14px] text-text-muted leading-relaxed mb-16">
              Grade, ilanı oluşturan bayi tarafından yukarıdaki tanımlara göre seçilir —
              Otograde aracı fiziksel olarak incelemez veya bağımsız bir ekspertiz süreci
              yürütmez. Her ilanda ayrıca şu bilgiler yer alır:
            </p>
            <ul className="flex flex-col gap-8">
              <li className="text-[14px] text-text-secondary">
                Hasar türü ve hasar notu (satıcının kendi tarif ettiği hasar açıklaması)
              </li>
              <li className="text-[14px] text-text-secondary">
                Tramer kaydı olup olmadığı ve varsa tutarı
              </li>
              <li className="text-[14px] text-text-secondary">
                Araç fotoğrafları, kilometre, model yılı ve yakıt/vites bilgisi
              </li>
            </ul>
            <p className="text-[14px] text-text-muted leading-relaxed mt-16">
              Bu bilgiler ilk fikri oluşturmanıza yardımcı olur; satın almadan önce
              bağımsız bir ekspertiz yaptırmanızı ve satıcı bayiyle doğrudan görüşmenizi
              öneririz.
            </p>
          </Container>
        </section>

        {/* Browse by grade */}
        <section className="py-32 md:py-44">
          <Container>
            <SectionHeader title="Dereceye Göre İlanlara Göz Atın" align="left" className="mb-24" />
            <div className="flex flex-wrap gap-12">
              {GRADES.map((grade) => (
                <Link
                  key={grade}
                  href={`${routes.marketplace()}?grade=${grade}` as never}
                  className="inline-flex items-center gap-8 px-20 py-12 bg-surface border border-[0.5px] border-border-default rounded-btn text-[13px] font-medium text-on-surface hover:border-primary transition-colors"
                >
                  Grade {grade}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <FAQSection items={faqs} />
        <FinalCTA />
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: localeUrl(locale, "/") },
              {
                "@type": "ListItem",
                position: 2,
                name: "Grade Sistemi",
                item: localeUrl(locale, locale === "en" ? "/grade-system" : "/grade-sistemi"),
              },
            ],
          }),
        }}
      />
    </>
  );
}
