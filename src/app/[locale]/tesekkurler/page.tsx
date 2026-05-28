import type { Metadata } from "next";
import { TesekkurlerClient } from "./TesekkurlerClient";

export const metadata: Metadata = {
  title: "Başvurunuz Alındı — HazarAl",
  robots: { index: false, follow: false },
};

export default function TesekkurlerPage() {
  return <TesekkurlerClient />;
}
