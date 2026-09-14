import type { Metadata } from "next";
import AdminShell from "./AdminShell";

/**
 * Server layout wrapping the client-side admin shell. Its only job is to emit
 * `noindex`: robots.txt can stop a crawl but not URL-only indexing, and the
 * shell itself is a client component, which cannot export metadata.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
