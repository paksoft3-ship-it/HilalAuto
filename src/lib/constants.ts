export const SITE_NAME = "Otograde";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://otograde.com";
export const SITE_DESCRIPTION =
  "Kazalı, pert, yanmış, sel hasarlı veya hurda aracınızı değerinde alıyoruz. Ücretsiz teklif alın.";

export const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "+90 552 567 71 64";
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "905525677164";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// ── Business identity (required for Google Ads verification & Turkish
// e-commerce disclosure). Fill these via env; empty values are hidden in UI.
export const COMPANY_LEGAL_NAME = process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME ?? "";
export const COMPANY_ADDRESS = process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "";
export const COMPANY_CITY = process.env.NEXT_PUBLIC_COMPANY_CITY ?? "İstanbul";
export const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "info@otograde.com";
export const COMPANY_MERSIS = process.env.NEXT_PUBLIC_COMPANY_MERSIS ?? "";
export const COMPANY_TAX_OFFICE = process.env.NEXT_PUBLIC_COMPANY_TAX_OFFICE ?? "";

export const LOCALES = ["tr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

export const VEHICLE_TYPES = [
  { slug: "kazali", label: "Kazalı Araç", labelEn: "Accident Damaged", serviceSlug: "kazali-arac-alimi" },
  { slug: "pert", label: "Pert Araç", labelEn: "Written Off", serviceSlug: "pert-arac-alimi" },
  { slug: "yanmis", label: "Yanmış Araç", labelEn: "Fire Damaged", serviceSlug: "yanmis-arac-alimi" },
  { slug: "sel", label: "Sel Hasarlı Araç", labelEn: "Flood Damaged", serviceSlug: "sel-hasarli-arac-alimi" },
  { slug: "hurda", label: "Hurda Araç", labelEn: "Scrap", serviceSlug: "hurda-arac-alimi" },
  { slug: "motor", label: "Motor Arızalı Araç", labelEn: "Engine Failure", serviceSlug: "motor-arizali-arac-alimi" },
  { slug: "cekme", label: "Çekme Belgeli Araç", labelEn: "Tow Certificate", serviceSlug: "cekme-belgeli-arac-alimi" },
  { slug: "agir", label: "Ağır Hasarlı Araç", labelEn: "Heavily Damaged", serviceSlug: "agir-hasarli-arac-alimi" },
] as const;

export const SERVICE_SLUGS = [
  "kazali-arac-alimi",
  "pert-arac-alimi",
  "yanmis-arac-alimi",
  "sel-hasarli-arac-alimi",
  "hurda-arac-alimi",
  "motor-arizali-arac-alimi",
  "cekme-belgeli-arac-alimi",
  "agir-hasarli-arac-alimi",
] as const;

export const CITY_SLUGS = [
  "istanbul",
  "ankara",
  "izmir",
  "bursa",
  "konya",
  "antalya",
  "kocaeli",
  "adana",
  "gaziantep",
  "kayseri",
  "mersin",
  "diyarbakir",
  "samsun",
  "balikesir",
  "hatay",
] as const;

export const CITIES: Record<string, string> = {
  istanbul: "İstanbul",
  ankara: "Ankara",
  izmir: "İzmir",
  bursa: "Bursa",
  konya: "Konya",
  antalya: "Antalya",
  kocaeli: "Kocaeli",
  adana: "Adana",
  gaziantep: "Gaziantep",
  kayseri: "Kayseri",
  mersin: "Mersin",
  diyarbakir: "Diyarbakır",
  samsun: "Samsun",
  balikesir: "Balıkesir",
  hatay: "Hatay",
};

export const CAR_BRANDS = [
  "Alfa Romeo", "Audi", "BMW", "Chevrolet", "Citroen", "Dacia",
  "Fiat", "Ford", "Honda", "Hyundai", "Jaguar", "Jeep", "Kia",
  "Land Rover", "Maserati", "Mazda", "Mercedes-Benz", "Mini", "Mitsubishi",
  "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Saab", "Seat",
  "Skoda", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo",
] as const;

export const FUEL_TYPES = ["Benzin", "Dizel", "LPG", "Hibrit", "Elektrik"] as const;
export const TRANSMISSION_TYPES = ["Manuel", "Otomatik", "Yarı Otomatik"] as const;

export const DAMAGE_TYPES = [
  "Kazalı",
  "Pert",
  "Yanmış",
  "Sel Hasarlı",
  "Hurda",
  "Motor Arızalı",
  "Çekme Belgeli",
  "Ağır Hasarlı",
] as const;

export const MAX_PHOTO_FILES = 5;
export const MAX_PHOTO_SIZE_MB = 5;
export const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;
export const GADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL;

export const OG_IMAGE_URL = `${SITE_URL}/opengraph-image`;
export const TWITTER_HANDLE = "@otograde";
