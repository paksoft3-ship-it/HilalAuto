import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Oto Grade — Hasarlı Araç Alım",
    default: "Oto Grade — Hasarlı Araç Alım Merkezi",
  },
  description:
    "Oto Grade olarak Türkiye genelinde kazalı, pert, yanmış, sel hasarlı veya hurda aracınızı en iyi değerinde nakit olarak alıyoruz. Hızlı, güvenilir ve yasal süreçlerle aracınızı satın. Hemen ücretsiz teklif alın.",
  keywords: ["kazalı araç alımı", "pert araç alan yerler", "hasarlı oto alım", "hurda araç satışı", "yanmış araç alım satım", "sel hasarlı araba", "motor arızalı araç alanlar", "ağır hasarlı araç", "otograde"],
  openGraph: {
    title: "Oto Grade — Hasarlı Araç Alım Merkezi",
    description: "Oto Grade olarak Türkiye genelinde kazalı, pert, yanmış, sel hasarlı veya hurda aracınızı en iyi değerinde nakit olarak alıyoruz.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://otograde.com",
    siteName: "Oto Grade",
    locale: "tr_TR",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/images/logo/otograde-favicon.svg", type: "image/svg+xml" }
    ],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ?? "https://otograde.com",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://otograde.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-body-md text-body-md bg-surface-container-lowest text-on-surface`}>{children}</body>
    </html>
  );
}
