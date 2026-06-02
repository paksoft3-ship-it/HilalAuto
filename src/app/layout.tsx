// Root layout: minimal pass-through required by Next.js.
// <html> and <body> are rendered in src/app/[locale]/layout.tsx
// so the lang attribute can be set dynamically per locale.
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
