import { SITE_URL } from "./constants";

// With localePrefix: "as-needed", Turkish (default locale) has NO prefix.
// Turkish: https://otograde.com/teklif-al  (not /tr/teklif-al)
// English: https://otograde.com/en/get-a-quote

export function localeUrl(locale: string, path: string): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  if (locale === "tr") {
    return normalised === "/" ? SITE_URL : `${SITE_URL}${normalised}`;
  }
  return `${SITE_URL}/${locale}${normalised === "/" ? "" : normalised}`;
}
