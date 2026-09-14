import { notFound, redirect } from "next/navigation";
import { getPathname } from "@/i18n/routing";
import { VEHICLE_TYPES } from "@/lib/constants";

// Handles old URLs like /arac-turleri/kazali. These are already the short
// damage_type slugs, so this redirects straight to the listing category —
// not through /hizmet/[slug], which itself now redirects there too and
// would otherwise turn this into a two-hop chain.
const VALID_SLUGS: Set<string> = new Set(VEHICLE_TYPES.map((v) => v.slug));

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return Array.from(VALID_SLUGS).flatMap((slug) => [
    { locale: "tr", slug },
    { locale: "en", slug },
  ]);
}

export default async function AracTurleriSlugRedirect({ params }: Props) {
  const { locale, slug } = await params;

  // Unknown slugs used to fall back to kazali-arac-alimi, which turned every
  // typo into a soft 404 pointing at the same page.
  if (!VALID_SLUGS.has(slug)) notFound();

  // getPathname resolves the locale-correct route: TR has no prefix under
  // localePrefix "as-needed", and EN uses the translated /en/listings path.
  redirect(
    getPathname({
      locale,
      href: { pathname: "/ara", query: { damage_type: slug } },
    } as never),
  );
}
