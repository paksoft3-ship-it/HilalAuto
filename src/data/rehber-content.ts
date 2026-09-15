// Static buyer-side guide content for /rehber. Otograde's /blog is Supabase-backed
// with no static fallback, so this route is a separate, fully static content set —
// titles match real "people also ask" queries verbatim, each answered directly in
// the opening paragraph, per the buyer-intent content brief.

export type RehberBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "link"; text: string; href: string; cta: string };

export interface RehberPost {
  slug: string;
  question: string; // matches the real search query verbatim — used as H1 and title
  metaDescription: string;
  excerpt: string;
  publishedDate: string; // ISO date
  damageSlug?: string; // related /ara?damage_type=<slug> category, if any
  body: RehberBlock[];
}

export const REHBER_POSTS: RehberPost[] = [
  {
    slug: "pert-arac-alinir-mi",
    question: "Pert Araç Alınır Mı?",
    metaDescription:
      "Pert araç almak Türkiye'de yasal mıdır? Sovtaj bedeli, tescil süreci ve satın almadan önce dikkat edilmesi gerekenler.",
    excerpt:
      "Evet, pert kayıtlı bir aracı satın almak yasaldır — ancak tescil, sigorta ve onarım maliyeti açısından bilmeniz gereken birkaç önemli fark var.",
    publishedDate: "2026-09-15",
    damageSlug: "pert",
    body: [
      {
        type: "p",
        text: "Evet, pert kayıtlı bir araç Türkiye'de yasal olarak satın alınabilir. Pert, aracın çalınmaz hale geldiği anlamına gelmez — sigorta şirketinin, onarım maliyetini aracın sigorta değerine kıyasla ekonomik bulmayıp hasar bedelini ödeyip aracı \"pert\" olarak kapatması anlamına gelir. Araç fiziksel olarak onarılabilir durumda olabilir.",
      },
      {
        type: "p",
        text: "Sigorta şirketi pert ödemesi yaptığında, genellikle aracın hurda veya parça değerini (sovtaj bedeli) düşerek net ödemeyi yapar ve araç sovtaj yoluyla satışa çıkar. Bu noktadan sonra araç bir bayi veya ikinci elden \"pert kayıtlı\" olarak satılabilir — kayıt bu durumu her zaman şeffaf şekilde göstermelidir.",
      },
      {
        type: "h2",
        text: "Pert ile Hurda Belgeli Aracı Karıştırmayın",
      },
      {
        type: "p",
        text: "Pert (resmî adıyla ağır hasarlı) kayıtlı bir araç, teknik olarak onarılıp yeniden trafiğe çıkabilir. Hurda belgeli bir araç ise onarımı teknik olarak mümkün olmayan, yalnızca parça veya hurda değeri taşıyan bir araçtır ve trafiğe çıkamaz. Bir ilanda hangi kaydın geçerli olduğunu mutlaka kontrol edin.",
      },
      {
        type: "p",
        text: "Pert araç almanın en büyük avantajı fiyat: hasarsız emsaline göre belirgin şekilde daha uygun fiyatlanır. Riski ise onarım kalitesi, gizli hasar ihtimali ve ileride satışta değer kaybıdır — bu yüzden bağımsız ekspertiz şarttır.",
      },
      {
        type: "link",
        text: "Otograde'de bayilerin kendi belirlediği A-E arası hasar derecesiyle listelenen pert araç ilanlarına göz atabilirsiniz.",
        href: "/ara?damage_type=pert",
        cta: "Pert Araç İlanlarını Gör",
      },
    ],
  },
  {
    slug: "pert-kayitli-arac-nasil-tescil-edilir",
    question: "Pert Kayıtlı Araç Nasıl Tescil Edilir?",
    metaDescription:
      "Pert kayıtlı bir aracın onarım sonrası tescili için gereken ekspertiz raporu, muayene ve trafik tescil adımları.",
    excerpt:
      "Pert kayıtlı bir aracı trafiğe çıkarmak için önce onarım, ardından yetkili kuruluştan hasar tespit/uygunluk raporu ve tescil işlemleri gerekir.",
    publishedDate: "2026-09-15",
    damageSlug: "pert",
    body: [
      {
        type: "p",
        text: "Pert kayıtlı bir araç, onarımı tamamlandıktan sonra yetkili bir ekspertiz/hasar tespit kuruluşundan aracın trafiğe çıkmaya uygun olduğunu gösteren bir rapor alınarak yeniden tescil edilebilir. Süreç, aracın hasar derecesine ve bağlı olduğu il trafik tescil biriminin uygulamasına göre küçük farklılıklar gösterebilir.",
      },
      {
        type: "h2",
        text: "Genel Adımlar",
      },
      {
        type: "list",
        items: [
          "Aracın onarımının bir usta/servis tarafından tamamlanması",
          "Şasi, güvenlik ve mekanik uygunluk açısından yetkili bir kuruluştan hasar tespit/uygunluk raporu alınması",
          "Araç muayene istasyonunda güncel teknik muayeneden geçirilmesi",
          "Trafik tescil şubesine rapor ve muayene belgeleriyle başvurulması",
          "Tescil belgesine pert/hasar kaydının işli kalması — bu kayıt silinmez, sonraki alıcılar için araçla birlikte taşınır",
        ],
      },
      {
        type: "p",
        text: "Önemli bir nokta: pert kaydı, araç onarılıp tekrar tescil edilse bile ruhsat/hasar geçmişinde kalıcı olarak görünür. Bu, aracı ileride satarken şeffaflık sağlar ama değerini de hasarsız emsaline göre bir miktar düşürür.",
      },
      {
        type: "p",
        text: "Tescil süreci başlamadan önce onarımın kalitesini ve maliyetini netleştirmek için bağımsız bir ekspertiz yaptırmanızı, mümkünse aracı satın almadan önce bu süreci kimin ve ne zaman tamamlayacağını satıcıyla yazılı şekilde netleştirmenizi öneririz.",
      },
    ],
  },
  {
    slug: "hasarli-arac-alirken-nelere-dikkat-edilmeli",
    question: "Hasarlı Araç Alırken Nelere Dikkat Edilmeli?",
    metaDescription:
      "Hasarlı veya pert araç satın almadan önce kontrol edilmesi gereken hasar kaydı, ekspertiz, şasi ve belge kontrol listesi.",
    excerpt:
      "Hasar kaydını, gerçek hasar derecesini, onarım geçmişini ve belgeleri satın almadan önce sırayla kontrol etmek, ileride sürpriz maliyetlerin önüne geçer.",
    publishedDate: "2026-09-15",
    body: [
      {
        type: "p",
        text: "Hasarlı araç alırken en önemli nokta, ilandaki hasar bilgisini kendi bağımsız kontrolünüzle doğrulamaktır: hasar kaydı, hasarın gerçek boyutu, onarım kalitesi ve tescil durumu satın alma kararını doğrudan etkiler.",
      },
      {
        type: "h2",
        text: "Kontrol Listesi",
      },
      {
        type: "list",
        items: [
          "Hasar kaydı (Tramer): Aracın resmî hasar kaydını ve tutarını sorgulayın; ilandaki bilgiyle karşılaştırın",
          "Hasar türü ve derecesi: Kazalı, sel hasarlı, yanmış, ağır hasarlı (pert) veya hurda belgeli olup olmadığını netleştirin — bunlar farklı risk seviyeleri taşır",
          "Şasi ve güvenlik ekipmanı: Şasi hasarı, hava yastığı değişimi ve elektronik güvenlik sistemlerinin çalışırlığı ayrı ayrı kontrol edilmeli",
          "Onarım geçmişi ve kalitesi: Kim, ne zaman, hangi parçalarla onarım yaptı — orijinal/OEM parça mı kullanıldı",
          "Bağımsız ekspertiz: Satıcının verdiği bilgiden bağımsız, kendi seçtiğiniz bir ekspertiz kuruluşuna aracı kontrol ettirin",
          "Belgeler: Ruhsat, hasar kaydı, varsa çekme belgesi ve onarım/uygunluk raporlarının tam olduğundan emin olun",
        ],
      },
      {
        type: "p",
        text: "Otograde'deki her ilanda bayinin kendi belirlediği A-E arası bir hasar derecesi bulunur; bu derece hızlı bir ilk fikir verir ama bağımsız ekspertizin yerini tutmaz.",
      },
      {
        type: "link",
        text: "Derecelerin ne anlama geldiğini ve nasıl belirlendiğini görmek için grade sistemi sayfasına göz atın.",
        href: "/grade-sistemi",
        cta: "Grade Sistemini İncele",
      },
    ],
  },
  {
    slug: "pert-arac-sigortalanir-mi",
    question: "Pert Araç Sigortalanır Mı?",
    metaDescription:
      "Pert kayıtlı bir araç için zorunlu trafik sigortası ve kasko yaptırmak mümkün mü? Sigorta şirketlerinin yaklaşımı.",
    excerpt:
      "Zorunlu trafik sigortası pert kayıtlı araçlar için genellikle yaptırılabilir, kasko ise sigorta şirketinin politikasına göre kısıtlı veya daha yüksek primli olabilir.",
    publishedDate: "2026-09-15",
    damageSlug: "pert",
    body: [
      {
        type: "p",
        text: "Zorunlu trafik sigortası (trafik poliçesi), tescili geçerli ve trafiğe çıkmaya uygun her araç için — pert kaydı olsa bile — genellikle yaptırılabilir; çünkü bu poliçe sizin değil, karşı tarafın zararını güvence altına alır. Kasko (gövde sigortası) tarafında ise durum sigorta şirketinden şirkete değişir.",
      },
      {
        type: "h2",
        text: "Kasko Neden Farklı Değerlendirilir?",
      },
      {
        type: "p",
        text: "Kasko, aracın kendi hasarını karşıladığı için sigorta şirketleri pert kayıtlı bir aracı daha yüksek riskli görebilir. Bu durumda üç senaryoyla karşılaşabilirsiniz: kasko hiç teklif edilmemesi, daha yüksek prim istenmesi veya poliçenin belirli hasar türlerini (örneğin önceki hasarla ilgili) kapsam dışı bırakması. Bazı sigorta şirketleri ise aracı fiziksel olarak inceledikten sonra normal şartlarda poliçe düzenleyebilir.",
      },
      {
        type: "p",
        text: "Net ve güncel bir teklif almanın tek yolu, aracın plaka/şasi bilgisiyle birden fazla sigorta şirketinden veya acenteden doğrudan teklif istemektir — pert kaydı bu süreçte sigorta şirketine mutlaka beyan edilmelidir; beyan edilmemesi ileride hasar ödemesinin reddedilmesine yol açabilir.",
      },
    ],
  },
  {
    slug: "hasarli-arac-kredisi-cekilir-mi",
    question: "Hasarlı Araç Kredisi Çekilir Mi?",
    metaDescription:
      "Hasarlı veya pert kayıtlı araç için taşıt kredisi almak mümkün mü? Bankaların hasar kaydına yaklaşımı ve alternatif seçenekler.",
    excerpt:
      "Hasar kaydı olan bir araç için taşıt kredisi almak, hasarsız bir araca göre daha zordur; bankaların çoğu ağır hasarlı/pert kayıtlı araçları teminat olarak kabul etmekte temkinlidir.",
    publishedDate: "2026-09-15",
    body: [
      {
        type: "p",
        text: "Hasarlı bir araç için taşıt kredisi çekmek mümkün olabilir, ancak bu tamamen bankanın politikasına ve aracın hasar derecesine bağlıdır. Bankalar taşıt kredisinde aracı teminat (rehin) olarak aldığından, hasar kaydı yüksek veya pert/hurda kayıtlı araçları teminat olarak kabul etmekte genellikle temkinli davranır.",
      },
      {
        type: "h2",
        text: "Bankalar Neye Bakar?",
      },
      {
        type: "list",
        items: [
          "Hasar kaydının türü ve tutarı — küçük kazalı hasarlar genelde sorun çıkarmaz, ağır hasarlı (pert) veya hurda kayıtlı araçlarda kredi bulmak zorlaşır",
          "Aracın yaşı ve güncel piyasa değeri",
          "Ekspertiz raporu — bazı bankalar kredi öncesi kendi anlaşmalı ekspertiz kuruluşlarından rapor isteyebilir",
          "Kredi türü — taşıt kredisi yerine ihtiyaç kredisiyle araç alımı, hasar kaydından bağımsız değerlendirilir ama genellikle daha yüksek faizlidir",
        ],
      },
      {
        type: "p",
        text: "Pert kayıtlı bir araç için taşıt kredisi bulamazsanız, ihtiyaç kredisi veya peşin alım gibi alternatifler değerlendirilebilir. Her bankanın politikası farklı olduğundan, araç seçiminden önce anlaşacağınız bankadan hasar kaydı olan araçlar için net kredi koşullarını öğrenmeniz en sağlıklı yoldur.",
      },
    ],
  },
];

export function getRehberPost(slug: string): RehberPost | undefined {
  return REHBER_POSTS.find((post) => post.slug === slug);
}
