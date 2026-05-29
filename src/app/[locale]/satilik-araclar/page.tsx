import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";
import { MarketplaceClient } from "./MarketplaceClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("satilikAraclarTitle");
  const description = t("satilikAraclarDescription");
  const canonical = `${SITE_URL}${getPathname({ locale, href: "/satilik-araclar" })}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        tr: `${SITE_URL}${getPathname({ locale: "tr", href: "/satilik-araclar" })}`,
        en: `${SITE_URL}${getPathname({ locale: "en", href: "/satilik-araclar" })}`,
        "x-default": `${SITE_URL}${getPathname({ locale: "tr", href: "/satilik-araclar" })}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: locale === "en" ? "en_US" : "tr_TR",
      type: "website",
    },
  };
}

export default function SatilikAraclarPage() {
  return <MarketplaceClient />;
}
