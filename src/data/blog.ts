export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishDate: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "kazali-arac-nasil-satilir",
    title: "Kazalı Araç Nasıl Satılır? Adım Adım Rehber",
    excerpt:
      "Kazalı aracınızı satarken nelere dikkat etmeniz gerektiğini, hangi belgeleri hazırlamanız gerektiğini ve en iyi fiyatı nasıl alabileceğinizi anlatan kapsamlı rehber.",
    category: "Rehber",
    readTime: "5 dk",
    publishDate: "2024-01-15",
    content: `
Kazalı araç satışı, doğru bilgi ve hazırlıkla oldukça hızlı tamamlanabilen bir süreçtir.

## Gerekli Belgeler

- Araç ruhsatı (aslı)
- Nüfus cüzdanı veya pasaport
- Sigorta poliçesi (varsa)
- Hasar tespit raporu (varsa)

## Satış Süreci

Kazalı aracınızı satmak için önce değerini öğrenmeniz önemlidir. Birden fazla yerden teklif alarak karşılaştırma yapabilirsiniz.

Oto Grade üzerinden ücretsiz ve bağlayıcı olmayan teklif alabilirsiniz. Kısa formu doldurun, ekibimiz en kısa sürede size ulaşsın.

## Dikkat Edilmesi Gerekenler

- Teklif almak için belge göndermek zorunda değilsiniz
- Teklif bağlayıcı değildir
- Aracı kendiniz göndermenize gerek yok, yerinden teslim alıyoruz
    `,
  },
  {
    slug: "pert-arac-nasil-satilir",
    title: "Pert Araç Nasıl Satılır? Sigorta Süreci ve Satış",
    excerpt:
      "Sigorta şirketi tarafından pert ilan edilen aracınızı nasıl satabileceğinizi, sigorta sürecini nasıl yönetmeniz gerektiğini anlatan rehber.",
    category: "Rehber",
    readTime: "6 dk",
    publishDate: "2024-01-20",
    content: `
Pert araç, sigorta şirketi tarafından hasar bedelinin araç değerinin belirli bir oranını aşması nedeniyle pert ilan edilen araçtır.

## Pert Süreci

Sigorta şirketiniz araç değerini ve hasar bedelini hesaplar. Hasar/değer oranı belirli eşiği geçerse araç pert ilan edilir.

## Pert Araç Satışı

Pert ilanından sonra aracı sigorta şirketine devredebilir veya kendi satabilirsiniz. Her iki seçeneğin avantajlarını değerlendirmenizi öneririz.

Oto Grade ile pert aracınız için ücretsiz teklif alabilirsiniz.
    `,
  },
  {
    slug: "sel-hasarli-arac-alinir-mi",
    title: "Sel Hasarlı Araç Alınır mı? Değer Tespiti ve Satış",
    excerpt:
      "Sel veya su baskını sonrası araçların durumu, hasar tespiti ve satış sürecine dair merak edilen her şey.",
    category: "Bilgi",
    readTime: "4 dk",
    publishDate: "2024-02-01",
    content: `
Sel ve su baskını sonrası araçlar ciddi hasar görebilir. Motor, elektrik sistemi ve döşeme başta olmak üzere birçok bileşen zarar görür.

## Sel Hasarının Etkileri

- Motor hasarı
- Elektrik sistemi arızaları
- Döşeme ve iç mekan hasarı
- Pas ve nem sorunu

## Satış Seçenekleri

Sel hasarlı araçları Oto Grade gibi satın alma hizmetleri değerlendirir. Araç durumunuzu bildirin, ücretsiz teklif alın.
    `,
  },
  {
    slug: "cekme-belgeli-arac-satisi",
    title: "Çekme Belgeli Araç Satışı Nasıl Yapılır?",
    excerpt:
      "Çekme belgeli araçların satış süreci, gerekli belgeler ve dikkat edilmesi gereken yasal konular hakkında bilgi.",
    category: "Rehber",
    readTime: "5 dk",
    publishDate: "2024-02-10",
    content: `
Çekme belgesi, aracın trafikten çekildiğini ve tekrar trafiğe çıkamayacağını gösteren belgedir.

## Yasal Durum

Çekme belgeli araçların satışı belirli koşullar altında gerçekleştirilebilir. Alıcı adayına çekme kaydı açıklanmalıdır.

## Satış Süreci

Oto Grade çekme belgeli araçları da değerlendiriyor. Belge durumunuzu bildirin, size uygun teklif sunalım.
    `,
  },
  {
    slug: "hasarli-arac-deger-kaybi",
    title: "Hasarlı Araç Değer Kaybı Nedir? Nasıl Hesaplanır?",
    excerpt:
      "Hasar sonrası araçlarda değer kaybının nasıl hesaplandığını, sigortan tarafından nasıl tazmin edilebileceğini anlatan rehber.",
    category: "Bilgi",
    readTime: "5 dk",
    publishDate: "2024-02-20",
    content: `
Araç hasar gördükten sonra, onarım yapılsa bile piyasa değeri düşer. Bu farka "değer kaybı" denir.

## Değer Kaybı Hesabı

Değer kaybı; araç yaşı, marka, model, hasar şiddeti ve onarım kalitesine göre belirlenir.

## Sigorta Tazminatı

Trafik sigortası kapsamında karşı tarafın kusurlu olduğu durumlarda değer kaybı talep edilebilir.

## Hasarlı Araç Satışı

Değer kaybı yaşayan aracınızı satmak istiyorsanız, Oto Grade üzerinden ücretsiz teklif alabilirsiniz.
    `,
  },
];

export const BLOG_CATEGORIES = ["Tümü", "Rehber", "Bilgi"];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
