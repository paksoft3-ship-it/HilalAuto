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
    template: "%s | HazarAl — Hasarlı Araç Alım",
    default: "HazarAl — Hasarlı Araç Alım Merkezi",
  },
  description:
    "HazarAl olarak Türkiye genelinde kazalı, pert, yanmış, sel hasarlı veya hurda aracınızı en iyi değerinde nakit olarak alıyoruz. Hızlı, güvenilir ve yasal süreçlerle aracınızı satın. Hemen ücretsiz teklif alın.",
  keywords: ["kazalı araç alımı", "pert araç alan yerler", "hasarlı oto alım", "hurda araç satışı", "yanmış araç alım satım", "sel hasarlı araba", "motor arızalı araç alanlar", "ağır hasarlı araç", "hazaral"],
  openGraph: {
    title: "HazarAl — Hasarlı Araç Alım Merkezi",
    description: "Kazalı, pert, yanmış, sel hasarlı veya hurda aracınızı en iyi değerinde nakit olarak alıyoruz. Ücretsiz teklif alın.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hazaral.com",
    siteName: "HazarAl",
    locale: "tr_TR",
    type: "website",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hazaral.com",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hazaral.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-body-md text-body-md bg-surface-container-lowest text-on-surface`}>{children}</body>
    </html>
  );
}
