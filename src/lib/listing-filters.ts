export type DamageFilterOption = {
  slug: string;
  label: string;
  title: string;
  description: string;
  matchValues: string[];
  aliases: string[];
};

export type ParsedDamageFilter = {
  slug: string;
  label: string;
  title: string;
  description: string;
  matchValues: string[];
};

export const DAMAGE_FILTER_OPTIONS: DamageFilterOption[] = [
  {
    slug: "kazali",
    label: "Kazalı",
    title: "Kazalı Araç İlanları",
    description: "Önden, arkadan veya yandan hasarlı satılık kazalı araç ilanlarını Otograde güvencesiyle inceleyin.",
    matchValues: ["Kazalı", "Çarpışma Hasarlı"],
    aliases: ["kazali-arac", "kaza", "carpismali", "carpisma-hasarli"],
  },
  {
    slug: "pert",
    label: "Pert",
    title: "Pert Araç İlanları",
    description: "Sigorta tarafından pert ilan edilmiş ve onarım süreci netleşmiş satılık pert araç ilanlarını keşfedin.",
    matchValues: ["Pert", "Sigorta Pertli"],
    aliases: ["pert-arac", "perte-cikmis", "total-loss", "written-off"],
  },
  {
    slug: "yanmis",
    label: "Yanmış",
    title: "Yanmış Araç İlanları",
    description: "Yangın hasarı bulunan satılık araç ilanlarını fotoğrafları, hasar notları ve Otograde derecesiyle görüntüleyin.",
    matchValues: ["Yanmış", "Yangın Hasarlı"],
    aliases: ["yanmis-arac", "yangin", "yangin-hasarli"],
  },
  {
    slug: "sel",
    label: "Sel Hasarlı",
    title: "Sel Hasarlı Araç İlanları",
    description: "Su baskını veya sel hasarı bulunan araç ilanlarını şehir, fiyat ve hasar derecesine göre filtreleyin.",
    matchValues: ["Sel Hasarlı", "Su Hasarlı"],
    aliases: ["sel-hasarli", "sel", "su-hasarli", "flood"],
  },
  {
    slug: "hurda",
    label: "Hurda",
    title: "Hurda Araç İlanları",
    description: "Parça, onarım veya proje amaçlı değerlendirilebilecek satılık hurda araç ilanlarını inceleyin.",
    matchValues: ["Hurda"],
    aliases: ["hurda-arac", "scrap"],
  },
  {
    slug: "motor",
    label: "Motor Arızalı",
    title: "Motor Arızalı Araç İlanları",
    description: "Motor veya yürür aksam arızası bulunan satılık araçları marka, şehir ve fiyat aralığına göre karşılaştırın.",
    matchValues: ["Motor Arızalı", "Motor Hasarlı"],
    aliases: ["motor-arizali", "motor-hasarli", "engine-fault"],
  },
  {
    slug: "cekme",
    label: "Çekme Belgeli",
    title: "Çekme Belgeli Araç İlanları",
    description: "Çekme belgeli satılık hasarlı araç ilanlarını bayi bilgileri ve Otograde dereceleriyle görüntüleyin.",
    matchValues: ["Çekme Belgeli", "Çekme Belgesi"],
    aliases: ["cekme-belgeli", "cekme", "tow-certificate"],
  },
  {
    slug: "agir",
    label: "Ağır Hasarlı",
    title: "Ağır Hasarlı Araç İlanları",
    description: "Ağır hasar kayıtlı veya yüksek onarım maliyetli satılık araç ilanlarını Otograde derecesiyle inceleyin.",
    matchValues: ["Ağır Hasarlı", "Ağır Hasar Kayıtlı", "Ağır Hasar", "Çok Ağır Hasar"],
    aliases: ["agir", "agir-hasarli", "agir-hasar-kayitli", "heavily-damaged"],
  },
];

function normalize(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("tr")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findDamageFilterOption(value: string): DamageFilterOption | undefined {
  const key = normalize(value);
  if (!key) return undefined;

  return DAMAGE_FILTER_OPTIONS.find((option) => {
    if (option.slug === key) return true;
    if (normalize(option.label) === key) return true;
    if (option.aliases.some((alias) => normalize(alias) === key)) return true;
    return option.matchValues.some((matchValue) => normalize(matchValue) === key);
  });
}

export function parseDamageFilters(value: string): ParsedDamageFilter[] {
  const seen = new Set<string>();
  const filters: ParsedDamageFilter[] = [];

  for (const raw of value.split(",")) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const option = findDamageFilterOption(trimmed);
    const parsed: ParsedDamageFilter = option
      ? {
          slug: option.slug,
          label: option.label,
          title: option.title,
          description: option.description,
          matchValues: option.matchValues,
        }
      : {
          slug: normalize(trimmed) || trimmed,
          label: trimmed,
          title: `${trimmed} İlanları`,
          description: `Satılık ${trimmed} araç ilanları. Otograde güvencesiyle Türkiye genelinde onaylı bayilerden hasarlı araçlar.`,
          matchValues: [trimmed],
        };

    if (!seen.has(parsed.slug)) {
      seen.add(parsed.slug);
      filters.push(parsed);
    }
  }

  return filters;
}

export function getDamageMatchValues(value: string): string[] {
  return Array.from(new Set(parseDamageFilters(value).flatMap((filter) => filter.matchValues)));
}
