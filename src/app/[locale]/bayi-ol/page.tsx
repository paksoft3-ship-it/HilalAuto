import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import BayiOlForm from "./BayiOlForm";

interface Props {
  params: Promise<{ locale: string }>;
}

/**
 * Server wrapper around the client-side signup form. The form itself needs
 * "use client" for its multi-step state, which meant this conversion page
 * previously shipped with no title, description, canonical or hreflang at all.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  const title = t("dealerSignupTitle", {
    default: `Bayi Ol — Ücretsiz Üyelik | ${SITE_NAME}`,
  });
  const description = t("dealerSignupDesc", {
    default:
      "Hasarlı araç alım satımı yapan bayiler için ücretsiz üyelik. İlanlarınızı yayınlayın, alıcılarla doğrudan iletişime geçin.",
  });

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${SITE_URL}${getPathname({ locale, href: "/bayi-ol" })}`,
      languages: {
        tr: `${SITE_URL}${getPathname({ locale: "tr", href: "/bayi-ol" })}`,
        en: `${SITE_URL}${getPathname({ locale: "en", href: "/bayi-ol" })}`,
        "x-default": `${SITE_URL}${getPathname({ locale: "tr", href: "/bayi-ol" })}`,
      },
    },
    openGraph: {
      title,
      description,
      locale: locale === "en" ? "en_US" : "tr_TR",
      type: "website",
      url: `${SITE_URL}${getPathname({ locale, href: "/bayi-ol" })}`,
    },
  };
}

export default function BayiOlPage() {
  return <BayiOlForm />;
}
