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
    default: "HazarAl — Hasarlı Araç Alım",
  },
  description:
    "Kazalı, pert, yanmış, sel hasarlı veya hurda aracınızı değerinde alıyoruz. Ücretsiz teklif alın.",
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
