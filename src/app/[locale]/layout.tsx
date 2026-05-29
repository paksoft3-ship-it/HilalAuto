import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { GoogleTagManager } from "@/components/tracking/GoogleTagManager";
import { GTMNoScript } from "@/components/tracking/GTMNoScript";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: {
      template: isEn
        ? "%s | Oto Grade — Damaged Vehicle Buyers"
        : "%s | Oto Grade — Hasarlı Araç Alım",
      default: isEn
        ? "Oto Grade — Damaged Vehicle Buyers Turkey"
        : "Oto Grade — Hasarlı Araç Alım",
    },
    metadataBase: new URL(SITE_URL),
    openGraph: {
      siteName: SITE_NAME,
      locale: isEn ? "en_US" : "tr_TR",
    },
    twitter: {
      card: "summary_large_image",
      site: "@otograde",
    },
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "tr")) {
    notFound();
  }

  const messages = await getMessages();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? "";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased font-body-md text-body-md bg-surface-container-lowest text-on-surface`}
      >
        {gtmId && <GTMNoScript gtmId={gtmId} />}
        <GoogleTagManager gtmId={gtmId} />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
