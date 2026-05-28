export interface CityData {
  slug: string;
  name: string;
  nameGenitive: string; // e.g. "İstanbul'da"
  districts: string[];
  description: string;
  metaDescription: string;
  nearbyCities: string[];
}

export const CITIES_DATA: Record<string, CityData> = {
  istanbul: {
    slug: "istanbul",
    name: "İstanbul",
    nameGenitive: "İstanbul'da",
    districts: [
      "Kadıköy", "Beşiktaş", "Şişli", "Fatih", "Beyoğlu",
      "Üsküdar", "Ataşehir", "Maltepe", "Pendik", "Kartal",
      "Bağcılar", "Bahçelievler", "Esenler", "Küçükçekmece", "Avcılar",
    ],
    description:
      "İstanbul'un her ilçesinden hasarlı araç alımı yapıyoruz. Anadolu ve Avrupa yakasında yerinden teslim hizmeti.",
    metaDescription:
      "İstanbul hasarlı araç alanlar. Kazalı, pert, yanmış araçlar için ücretsiz teklif alın. İstanbul'un her ilçesinde hizmet.",
    nearbyCities: ["kocaeli", "bursa"],
  },
  ankara: {
    slug: "ankara",
    name: "Ankara",
    nameGenitive: "Ankara'da",
    districts: [
      "Çankaya", "Keçiören", "Mamak", "Etimesgut", "Sincan",
      "Yenimahalle", "Pursaklar", "Altındağ", "Gölbaşı",
    ],
    description:
      "Ankara'nın tüm ilçelerinde hasarlı araç alım hizmeti sunuyoruz. Hızlı değerleme, yerinden teslim.",
    metaDescription:
      "Ankara hasarlı araç alanlar. Kazalı, pert, yanmış araç için ücretsiz teklif alın. Ankara genelinde hizmet.",
    nearbyCities: ["konya", "kayseri"],
  },
  izmir: {
    slug: "izmir",
    name: "İzmir",
    nameGenitive: "İzmir'de",
    districts: [
      "Konak", "Bornova", "Karşıyaka", "Buca", "Çiğli",
      "Gaziemir", "Bayraklı", "Torbalı", "Menemen",
    ],
    description:
      "İzmir ve çevre ilçelerde kazalı, pert ve sel hasarlı araç alım hizmeti.",
    metaDescription:
      "İzmir hasarlı araç alanlar. Kazalı, sel hasarlı, pert araç için ücretsiz teklif. İzmir genelinde hizmet.",
    nearbyCities: ["ankara", "bursa"],
  },
  bursa: {
    slug: "bursa",
    name: "Bursa",
    nameGenitive: "Bursa'da",
    districts: [
      "Osmangazi", "Nilüfer", "Yıldırım", "Mudanya", "Gemlik",
      "Kestel", "İnegöl", "Mustafakemalpaşa",
    ],
    description:
      "Bursa'da hasarlı araç alım hizmeti. Kazalı, pert ve motor arızalı araçlar için teklif alın.",
    metaDescription:
      "Bursa hasarlı araç alanlar. Kazalı, pert, hurda araç için ücretsiz teklif alın. Bursa genelinde hizmet.",
    nearbyCities: ["istanbul", "kocaeli"],
  },
  konya: {
    slug: "konya",
    name: "Konya",
    nameGenitive: "Konya'da",
    districts: [
      "Karatay", "Meram", "Selçuklu", "Cihanbeyli", "Ereğli",
      "Akşehir", "Beyşehir",
    ],
    description:
      "Konya ve çevre ilçelerde hasarlı araç alım hizmeti. Hızlı teklif, yerinden teslim.",
    metaDescription:
      "Konya hasarlı araç alanlar. Kazalı, pert araç için ücretsiz teklif alın. Konya genelinde hizmet.",
    nearbyCities: ["ankara", "antalya"],
  },
  antalya: {
    slug: "antalya",
    name: "Antalya",
    nameGenitive: "Antalya'da",
    districts: [
      "Muratpaşa", "Kepez", "Konyaaltı", "Alanya", "Manavgat",
      "Serik", "Döşemealtı", "Aksu",
    ],
    description:
      "Antalya'da hasarlı araç alım hizmeti. Sel hasarlı, kazalı ve pert araçlar için teklif alın.",
    metaDescription:
      "Antalya hasarlı araç alanlar. Kazalı, sel hasarlı araç için ücretsiz teklif alın. Antalya genelinde hizmet.",
    nearbyCities: ["konya", "izmir"],
  },
  kocaeli: {
    slug: "kocaeli",
    name: "Kocaeli",
    nameGenitive: "Kocaeli'nde",
    districts: [
      "İzmit", "Gebze", "Darıca", "Körfez", "Gölcük",
      "Derince", "Başiskele", "Çayırova",
    ],
    description:
      "Kocaeli'nde hasarlı araç alım hizmeti. Tüm ilçelerde yerinden teslim.",
    metaDescription:
      "Kocaeli hasarlı araç alanlar. Kazalı, pert araç için ücretsiz teklif alın. Kocaeli genelinde hizmet.",
    nearbyCities: ["istanbul", "bursa"],
  },
  adana: {
    slug: "adana",
    name: "Adana",
    nameGenitive: "Adana'da",
    districts: [
      "Seyhan", "Çukurova", "Yüreğir", "Sarıçam", "Ceyhan",
      "Karaisalı", "Pozantı",
    ],
    description:
      "Adana'da hasarlı araç alım hizmeti. Kazalı, motor arızalı araçlar için teklif alın.",
    metaDescription:
      "Adana hasarlı araç alanlar. Kazalı, pert araç için ücretsiz teklif alın. Adana genelinde hizmet.",
    nearbyCities: ["gaziantep", "ankara"],
  },
  gaziantep: {
    slug: "gaziantep",
    name: "Gaziantep",
    nameGenitive: "Gaziantep'te",
    districts: [
      "Şahinbey", "Şehitkamil", "Nizip", "İslahiye", "Oğuzeli",
      "Araban", "Yavuzeli",
    ],
    description:
      "Gaziantep'te hasarlı araç alım hizmeti. Hızlı değerleme, güvenli devir.",
    metaDescription:
      "Gaziantep hasarlı araç alanlar. Kazalı, pert araç için ücretsiz teklif alın. Gaziantep genelinde hizmet.",
    nearbyCities: ["adana", "kayseri"],
  },
  kayseri: {
    slug: "kayseri",
    name: "Kayseri",
    nameGenitive: "Kayseri'de",
    districts: [
      "Kocasinan", "Melikgazi", "Talas", "İncesu", "Develi",
      "Bünyan", "Pınarbaşı",
    ],
    description:
      "Kayseri'de hasarlı araç alım hizmeti. Kazalı, pert ve hurda araçlar için teklif alın.",
    metaDescription:
      "Kayseri hasarlı araç alanlar. Kazalı, pert araç için ücretsiz teklif alın. Kayseri genelinde hizmet.",
    nearbyCities: ["ankara", "adana"],
  },
};

export const ALL_CITY_SLUGS = Object.keys(CITIES_DATA);
