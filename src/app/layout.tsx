// Root layout: minimal pass-through required by Next.js.
// <html> and <body> are rendered in src/app/[locale]/layout.tsx
// so the lang attribute can be set dynamically per locale.
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
