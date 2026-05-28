import { redirect } from "next/navigation";

// Maps short vehicle-type slugs to the full service page slugs.
// Handles old URLs like /arac-turleri/kazali → /hizmet/kazali-arac-alimi
const SLUG_MAP: Record<string, string> = {
  kazali: "kazali-arac-alimi",
  pert: "pert-arac-alimi",
  yanmis: "yanmis-arac-alimi",
  sel: "sel-hasarli-arac-alimi",
  hurda: "hurda-arac-alimi",
  motor: "motor-arizali-arac-alimi",
  cekme: "cekme-belgeli-arac-alimi",
  agir: "agir-hasarli-arac-alimi",
};

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(SLUG_MAP).flatMap((slug) => [
    { locale: "tr", slug },
    { locale: "en", slug },
  ]);
}

export default async function AracTurleriSlugRedirect({ params }: Props) {
  const { locale, slug } = await params;
  const serviceSlug = SLUG_MAP[slug];
  redirect(`/${locale}/hizmet/${serviceSlug ?? "kazali-arac-alimi"}`);
}
