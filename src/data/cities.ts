export interface CityData {
  slug: string;
  name: string;
  nameGenitive: string;
  districts: string[];
  description: string;
  metaDescription: string;
  nearbyCities: string[];
}

export const CITIES_TR: Record<string, CityData> = {
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
    nearbyCities: ["gaziantep", "mersin"],
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
    nearbyCities: ["adana", "diyarbakir"],
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
  mersin: {
    slug: "mersin",
    name: "Mersin",
    nameGenitive: "Mersin'de",
    districts: [
      "Akdeniz", "Toroslar", "Mezitli", "Yenişehir", "Tarsus",
      "Erdemli", "Silifke", "Anamur",
    ],
    description:
      "Mersin'de hasarlı araç alım hizmeti. Kazalı, pert ve sel hasarlı araçlar için ücretsiz teklif.",
    metaDescription:
      "Mersin hasarlı araç alanlar. Kazalı, pert, yanmış araç için ücretsiz teklif alın. Mersin genelinde hizmet.",
    nearbyCities: ["adana", "gaziantep"],
  },
  diyarbakir: {
    slug: "diyarbakir",
    name: "Diyarbakır",
    nameGenitive: "Diyarbakır'da",
    districts: [
      "Bağlar", "Kayapınar", "Sur", "Yenişehir", "Ergani",
      "Bismil", "Çermik", "Silvan",
    ],
    description:
      "Diyarbakır'da hasarlı araç alım hizmeti. Tüm ilçelerde kazalı, pert, hurda araç için teklif.",
    metaDescription:
      "Diyarbakır hasarlı araç alanlar. Kazalı, pert araç için ücretsiz teklif alın. Diyarbakır genelinde hizmet.",
    nearbyCities: ["gaziantep", "adana"],
  },
  samsun: {
    slug: "samsun",
    name: "Samsun",
    nameGenitive: "Samsun'da",
    districts: [
      "Atakum", "Canik", "İlkadım", "Tekkeköy", "Bafra",
      "Çarşamba", "Vezirköprü", "Terme",
    ],
    description:
      "Samsun'da hasarlı araç alım hizmeti. Kazalı, pert, motor arızalı araçlar için yerinden teslim.",
    metaDescription:
      "Samsun hasarlı araç alanlar. Kazalı, pert araç için ücretsiz teklif alın. Samsun genelinde hizmet.",
    nearbyCities: ["ankara", "kayseri"],
  },
  balikesir: {
    slug: "balikesir",
    name: "Balıkesir",
    nameGenitive: "Balıkesir'de",
    districts: [
      "Altıeylül", "Karesi", "Bandırma", "Edremit", "Burhaniye",
      "Ayvalık", "Gönen", "Erdek",
    ],
    description:
      "Balıkesir'de hasarlı araç alım hizmeti. Hurda, kazalı ve pert araçlar için ücretsiz değerleme.",
    metaDescription:
      "Balıkesir hasarlı araç alanlar. Kazalı, hurda araç için ücretsiz teklif alın. Balıkesir genelinde hizmet.",
    nearbyCities: ["istanbul", "bursa"],
  },
  hatay: {
    slug: "hatay",
    name: "Hatay",
    nameGenitive: "Hatay'da",
    districts: [
      "Antakya", "İskenderun", "Defne", "Payas", "Kırıkhan",
      "Samandağ", "Reyhanlı", "Dörtyol",
    ],
    description:
      "Hatay'da hasarlı araç alım hizmeti. Deprem hasarlı, kazalı, hurda araçlar için teklif alın.",
    metaDescription:
      "Hatay hasarlı araç alanlar. Kazalı, hurda araç için ücretsiz teklif alın. Hatay genelinde hizmet.",
    nearbyCities: ["adana", "gaziantep"],
  },
};

export const ALL_CITY_SLUGS = Object.keys(CITIES_TR);
export const getCities = (locale: string) => locale === "en" ? CITIES_EN : CITIES_TR;


export const CITIES_EN: Record<string, CityData> = {
  istanbul: {
    slug: "istanbul",
    name: "Istanbul",
    nameGenitive: "in Istanbul",
    districts: [
      "Kadıköy", "Beşiktaş", "Şişli", "Fatih", "Beyoğlu",
      "Üsküdar", "Ataşehir", "Maltepe", "Pendik", "Kartal",
      "Bağcılar", "Bahçelievler", "Esenler", "Küçükçekmece", "Avcılar",
    ],
    description: "We buy damaged vehicles from every district of Istanbul. On-site pickup service on both the Anatolian and European sides.",
    metaDescription: "Istanbul damaged vehicle buyers. Get a free quote for accident, written-off, and burnt vehicles. Service in every district of Istanbul.",
    nearbyCities: ["kocaeli", "bursa"],
  },
  ankara: {
    slug: "ankara",
    name: "Ankara",
    nameGenitive: "in Ankara",
    districts: [
      "Çankaya", "Keçiören", "Mamak", "Etimesgut", "Sincan",
      "Yenimahalle", "Pursaklar", "Altındağ", "Gölbaşı",
    ],
    description: "We offer damaged vehicle purchasing services in all districts of Ankara. Fast valuation, on-site pickup.",
    metaDescription: "Ankara damaged vehicle buyers. Get a free quote for accident, written-off, and burnt vehicles. Service throughout Ankara.",
    nearbyCities: ["konya", "kayseri"],
  },
  izmir: {
    slug: "izmir",
    name: "Izmir",
    nameGenitive: "in Izmir",
    districts: [
      "Konak", "Bornova", "Karşıyaka", "Buca", "Çiğli",
      "Gaziemir", "Bayraklı", "Torbalı", "Menemen",
    ],
    description: "Accident, written-off, and flood-damaged vehicle purchasing services in Izmir and surrounding districts.",
    metaDescription: "Izmir damaged vehicle buyers. Free quote for accident, flood-damaged, and written-off vehicles. Service throughout Izmir.",
    nearbyCities: ["ankara", "bursa"],
  },
  bursa: {
    slug: "bursa",
    name: "Bursa",
    nameGenitive: "in Bursa",
    districts: [
      "Osmangazi", "Nilüfer", "Yıldırım", "Mudanya", "Gemlik",
      "Kestel", "İnegöl", "Mustafakemalpaşa",
    ],
    description: "Damaged vehicle purchasing service in Bursa. Get a quote for accident, written-off, and engine failure vehicles.",
    metaDescription: "Bursa damaged vehicle buyers. Free quote for accident, written-off, and scrap vehicles. Service throughout Bursa.",
    nearbyCities: ["istanbul", "kocaeli"],
  },
  konya: {
    slug: "konya",
    name: "Konya",
    nameGenitive: "in Konya",
    districts: [
      "Karatay", "Meram", "Selçuklu", "Cihanbeyli", "Ereğli",
      "Akşehir", "Beyşehir",
    ],
    description: "Damaged vehicle purchasing services in Konya and surrounding districts. Fast quote, on-site pickup.",
    metaDescription: "Konya damaged vehicle buyers. Free quote for accident and written-off vehicles. Service throughout Konya.",
    nearbyCities: ["ankara", "antalya"],
  },
  antalya: {
    slug: "antalya",
    name: "Antalya",
    nameGenitive: "in Antalya",
    districts: [
      "Muratpaşa", "Kepez", "Konyaaltı", "Alanya", "Manavgat",
      "Serik", "Döşemealtı", "Aksu",
    ],
    description: "Damaged vehicle purchasing service in Antalya. Get a quote for flood-damaged, accident, and written-off vehicles.",
    metaDescription: "Antalya damaged vehicle buyers. Free quote for accident and flood-damaged vehicles. Service throughout Antalya.",
    nearbyCities: ["konya", "izmir"],
  },
  kocaeli: {
    slug: "kocaeli",
    name: "Kocaeli",
    nameGenitive: "in Kocaeli",
    districts: [
      "İzmit", "Gebze", "Darıca", "Körfez", "Gölcük",
      "Derince", "Başiskele", "Çayırova",
    ],
    description: "Damaged vehicle purchasing service in Kocaeli. On-site pickup in all districts.",
    metaDescription: "Kocaeli damaged vehicle buyers. Free quote for accident and written-off vehicles. Service throughout Kocaeli.",
    nearbyCities: ["istanbul", "bursa"],
  },
  adana: {
    slug: "adana",
    name: "Adana",
    nameGenitive: "in Adana",
    districts: [
      "Seyhan", "Çukurova", "Yüreğir", "Sarıçam", "Ceyhan",
      "Karaisalı", "Pozantı",
    ],
    description: "Damaged vehicle purchasing service in Adana. Get a quote for accident and engine failure vehicles.",
    metaDescription: "Adana damaged vehicle buyers. Free quote for accident and written-off vehicles. Service throughout Adana.",
    nearbyCities: ["gaziantep", "mersin"],
  },
  gaziantep: {
    slug: "gaziantep",
    name: "Gaziantep",
    nameGenitive: "in Gaziantep",
    districts: [
      "Şahinbey", "Şehitkamil", "Nizip", "İslahiye", "Oğuzeli",
      "Araban", "Yavuzeli",
    ],
    description: "Damaged vehicle purchasing service in Gaziantep. Fast valuation, safe transfer.",
    metaDescription: "Gaziantep damaged vehicle buyers. Free quote for accident and written-off vehicles. Service throughout Gaziantep.",
    nearbyCities: ["adana", "diyarbakir"],
  },
  kayseri: {
    slug: "kayseri",
    name: "Kayseri",
    nameGenitive: "in Kayseri",
    districts: [
      "Kocasinan", "Melikgazi", "Talas", "İncesu", "Develi",
      "Bünyan", "Pınarbaşı",
    ],
    description: "Damaged vehicle purchasing service in Kayseri. Get a quote for accident, written-off, and scrap vehicles.",
    metaDescription: "Kayseri damaged vehicle buyers. Free quote for accident and written-off vehicles. Service throughout Kayseri.",
    nearbyCities: ["ankara", "adana"],
  },
  mersin: {
    slug: "mersin",
    name: "Mersin",
    nameGenitive: "in Mersin",
    districts: [
      "Akdeniz", "Toroslar", "Mezitli", "Yenişehir", "Tarsus",
      "Erdemli", "Silifke", "Anamur",
    ],
    description: "Damaged vehicle purchasing service in Mersin. Free quote for accident, written-off, and flood-damaged vehicles.",
    metaDescription: "Mersin damaged vehicle buyers. Free quote for accident, written-off, and burnt vehicles. Service throughout Mersin.",
    nearbyCities: ["adana", "gaziantep"],
  },
  diyarbakir: {
    slug: "diyarbakir",
    name: "Diyarbakir",
    nameGenitive: "in Diyarbakir",
    districts: [
      "Bağlar", "Kayapınar", "Sur", "Yenişehir", "Ergani",
      "Bismil", "Çermik", "Silvan",
    ],
    description: "Damaged vehicle purchasing service in Diyarbakir. Quotes for accident, written-off, and scrap vehicles in all districts.",
    metaDescription: "Diyarbakir damaged vehicle buyers. Free quote for accident and written-off vehicles. Service throughout Diyarbakir.",
    nearbyCities: ["gaziantep", "adana"],
  },
  samsun: {
    slug: "samsun",
    name: "Samsun",
    nameGenitive: "in Samsun",
    districts: [
      "Atakum", "Canik", "İlkadım", "Tekkeköy", "Bafra",
      "Çarşamba", "Vezirköprü", "Terme",
    ],
    description: "Damaged vehicle purchasing service in Samsun. On-site pickup for accident, written-off, and engine failure vehicles.",
    metaDescription: "Samsun damaged vehicle buyers. Free quote for accident and written-off vehicles. Service throughout Samsun.",
    nearbyCities: ["ankara", "kayseri"],
  },
  balikesir: {
    slug: "balikesir",
    name: "Balikesir",
    nameGenitive: "in Balikesir",
    districts: [
      "Altıeylül", "Karesi", "Bandırma", "Edremit", "Burhaniye",
      "Ayvalık", "Gönen", "Erdek",
    ],
    description: "Damaged vehicle purchasing service in Balikesir. Free valuation for scrap, accident, and written-off vehicles.",
    metaDescription: "Balikesir damaged vehicle buyers. Free quote for accident and scrap vehicles. Service throughout Balikesir.",
    nearbyCities: ["istanbul", "bursa"],
  },
  hatay: {
    slug: "hatay",
    name: "Hatay",
    nameGenitive: "in Hatay",
    districts: [
      "Antakya", "İskenderun", "Defne", "Payas", "Kırıkhan",
      "Samandağ", "Reyhanlı", "Dörtyol",
    ],
    description: "Damaged vehicle purchasing service in Hatay. Get a quote for earthquake-damaged, accident, and scrap vehicles.",
    metaDescription: "Hatay damaged vehicle buyers. Free quote for accident and scrap vehicles. Service throughout Hatay.",
    nearbyCities: ["adana", "gaziantep"],
  },
};
