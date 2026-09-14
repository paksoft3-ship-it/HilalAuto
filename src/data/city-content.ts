/**
 * Hand-written unique content per city.
 *
 * Why this file exists: `cities.ts` gave every city a ~13-word description and
 * a meta description that was one template with the name swapped, so all 15
 * city pages rendered ~35 unique words against ~350 words of shared boilerplate
 * and emitted 15 byte-identical FAQPage nodes. That is the shape Google's
 * doorway-page policy describes.
 *
 * The angle here is deliberately marketplace-specific — which damage types
 * actually trade in each city, who the buyers are, how logistics work locally —
 * so it does not overlap with the group's buyer-only sites either.
 */

export interface CityContent {
  /** SEO meta description — unique per city, no shared template. */
  metaDescription: string;
  /** Hero lead paragraph, replaces the 13-word `description`. */
  intro: string;
  /** Two paragraphs on how the damaged-car market works in this city. */
  body: string[];
  /** Locally specific bullets. */
  points: string[];
  /** Per-city FAQs so no two cities emit the same FAQPage node. */
  faqs: { question: string; answer: string }[];
}

export const CITY_CONTENT: Record<string, CityContent> = {
  istanbul: {
    metaDescription:
      "İstanbul'da hasarlı, kazalı ve pert araç ilanları. İki yakada da alıcı bulun veya bayilerin güncel ilanlarını inceleyin; ücretsiz ilan, doğrudan iletişim.",
    intro:
      "Türkiye'nin en derin ikinci el pazarı İstanbul'da hasarlı araç alıcısı bulmak kolay, doğru fiyatı bulmak zordur. Otograde'de aracınızı hem bireysel alıcılara hem de kurumsal bayilere aynı anda açarsınız.",
    body: [
      "İstanbul'da hasarlı araç fiyatını belirleyen en büyük etken lojistiktir: aracınız Anadolu yakasındaysa Avrupa yakasındaki bir alıcı çekici masrafını tekliften düşer. Otograde'de ilan verirken ilçe bilgisini paylaşmanız, size yakın alıcıların önce sizi görmesini sağlar ve bu kesintiyi ortadan kaldırır.",
      "Şehirde pert ve ağır hasarlı araç talebinin merkezi, parça piyasasının yoğunlaştığı sanayi bölgeleridir. Bu alıcılar aracın onarılabilirliğinden çok kullanılabilir parça değerine bakar; bu yüzden ilanınızda motor, şanzıman ve elektronik aksamın durumunu net yazmak, gelen tekliflerin kalitesini doğrudan yükseltir.",
    ],
    points: [
      "39 ilçeden ilan ve alıcı erişimi",
      "İlçe bazlı eşleşme ile çekici masrafı düşer",
      "Parça değeri yüksek pert araçlarda güçlü talep",
      "Kurumsal bayi ve bireysel alıcı aynı ilanda",
    ],
    faqs: [
      {
        question: "İstanbul'da hasarlı aracımı hangi yakada satmam daha avantajlı?",
        answer:
          "Aracın bulunduğu yakada satmak neredeyse her zaman daha avantajlıdır, çünkü karşı yakadan gelen alıcı çekici ve köprü maliyetini teklifine yansıtır. Otograde'de ilanınız ilçe bilgisiyle listelendiği için size yakın alıcılar önce sizi görür.",
      },
      {
        question: "İstanbul'da pert kayıtlı araca alıcı bulunur mu?",
        answer:
          "Bulunur. Pert kayıtlı araçlar İstanbul'da en hızlı el değiştiren gruplardandır; parça piyasası derin olduğu için ağır hasarlı araçlar bile kullanılabilir aksamı üzerinden değer görür.",
      },
      {
        question: "İlan vermek ücretli mi?",
        answer:
          "Hayır. Bireysel satıcılar için ilan yayınlamak ücretsizdir ve alıcılarla doğrudan, aracı komisyona bağlamadan iletişime geçersiniz.",
      },
    ],
  },

  ankara: {
    metaDescription:
      "Ankara'da hasarlı, kazalı ve pert araç ilanları. Ostim ve İvedik çevresindeki alıcılara doğrudan ulaşın; ücretsiz ilan verin veya güncel ilanları inceleyin.",
    intro:
      "Ankara'nın hasarlı araç pazarı, Ostim ve İvedik'teki onarım ve parça ekosistemi etrafında döner. Bu, özellikle mekanik arızalı ve ağır hasarlı araçlarda başka şehirlerde bulunmayan bir alıcı derinliği yaratır.",
    body: [
      "Başkentte ticari araç ve filo çıkışı yoğundur; Ostim çevresindeki işletmeler onarıp yeniden satmak üzere sürekli araç arar. Bu alıcılar için belirleyici olan hasarın büyüklüğü değil, onarımın öngörülebilirliğidir — ilanında hasarın nasıl oluştuğunu ve hangi parçaların etkilendiğini yazan satıcılar belirgin şekilde daha hızlı sonuç alır.",
      "Ankara'nın sert kış koşulları, aralık–mart aralığında buzlanma kaynaklı ön ve yan darbeli araç sayısını artırır. Bu dönemde arz yükseldiği için ilanınızın öne çıkması fotoğraf kalitesine bağlıdır; gün ışığında çekilmiş, hasarı açıkça gösteren fotoğraflar aynı araç için gelen teklif sayısını katlar.",
    ],
    points: [
      "Ostim–İvedik onarım ve parça ekosistemine erişim",
      "Ticari araç ve filo çıkışlarında güçlü talep",
      "Kış aylarında yoğunlaşan darbeli araç arzı",
      "25 ilçeden ilan ve alıcı erişimi",
    ],
    faqs: [
      {
        question: "Ankara'da mekanik arızalı araca alıcı bulabilir miyim?",
        answer:
          "Evet, Ankara bu konuda Türkiye'nin en iyi pazarlarından biridir. Ostim ve İvedik'teki onarım işletmeleri motor ve şanzıman arızalı araçları düzenli olarak alır; arızayı bilmiyor olmanız ilan vermenize engel değildir.",
      },
      {
        question: "Şirket aracımızı Otograde'de satabilir miyiz?",
        answer:
          "Satabilirsiniz. Şirket üzerine kayıtlı araçlarda satış faturası ve yetkili imza gerekir; ilan verirken aracın kurumsal olduğunu belirtmeniz, bu sürece hazır alıcıların size yönelmesini sağlar.",
      },
      {
        question: "Kışın kaza yapan aracımı hemen mi satmalıyım?",
        answer:
          "Hasarlı araç bekledikçe değer kaybeder; ayrıca kış aylarında benzer araç arzı arttığı için ilkbaharı beklemek genellikle avantaj sağlamaz. Erken ilan vermek çoğu durumda daha yüksek teklif getirir.",
      },
    ],
  },

  izmir: {
    metaDescription:
      "İzmir'de hasarlı, kazalı ve sel hasarlı araç ilanları. Körfez çevresindeki alıcılara ulaşın; ücretsiz ilan verin, bayilerin güncel ilanlarını karşılaştırın.",
    intro:
      "İzmir'de hasarlı araç değerini belirleyen iki yerel etken vardır: körfez ikliminin hızlandırdığı korozyon ve liman ticaretinin beslediği canlı parça piyasası.",
    body: [
      "Denize yakın ilçelerde uzun süre açıkta kalan araçlarda taban ve alt takım korozyonu yaygındır. Bu, ilanınızda saklanacak değil belirtilecek bir bilgidir: korozyonu önceden yazan satıcılar araç görüldüğünde pazarlıkla karşılaşmaz ve satış tek görüşmede kapanır.",
      "İzmir'in ikinci özelliği alıcı çeşitliliğidir. Şehirde hem onarıp satan galeriler hem de yalnızca parça için alım yapan işletmeler faaliyet gösterir; aynı araç bu iki grup için farklı değer taşır. Otograde'de ilanınız her iki gruba birden açık olduğu için iki ayrı fiyat mantığından yüksek olanı yakalarsınız.",
    ],
    points: [
      "30 ilçeden ilan ve alıcı erişimi",
      "Korozyonlu araçlarda şeffaf ilan avantajı",
      "Onarımcı ve parçacı alıcılara aynı anda erişim",
      "Sel ve su hasarlı araçlarda deneyimli alıcı kitlesi",
    ],
    faqs: [
      {
        question: "İzmir'de sel hasarlı aracımı satabilir miyim?",
        answer:
          "Satabilirsiniz. Su hasarlı araçlar İzmir'de düzenli olarak el değiştirir; değeri belirleyen, suyun motor ve elektronik aksama ulaşıp ulaşmadığıdır. İlanınızda su seviyesini belirtmeniz doğru alıcıyı hızla getirir.",
      },
      {
        question: "Deniz kenarında duran aracımda paslanma var, ilan verebilir miyim?",
        answer:
          "Verebilirsiniz ve paslanmayı ilanda belirtmeniz lehinizedir. Yüzeysel korozyonun fiyata etkisi sınırlıdır; belirleyici olan şasi ve taşıyıcı bölümlerin durumudur.",
      },
      {
        question: "İlanıma kaç fotoğraf ekleyebilirim?",
        answer:
          "Aracın dört köşesi, hasarlı bölgelerin yakın çekimi, motor bölmesi ve kilometre göstergesi dahil olacak şekilde çok sayıda fotoğraf ekleyebilirsiniz. Fotoğraf sayısı ve netliği, ilanın aldığı teklif sayısıyla doğrudan ilişkilidir.",
      },
    ],
  },

  bursa: {
    metaDescription:
      "Bursa'da hasarlı, kazalı ve pert araç ilanları. Otomotiv sanayisinin merkezinde güçlü parça talebi; ücretsiz ilan verin veya güncel ilanları inceleyin.",
    intro:
      "Otomotiv üretiminin merkezi Bursa, hasarlı araç satıcısı için Türkiye'nin en avantajlı pazarlarından biridir: yan sanayi yoğunluğu parça değerini diğer şehirlerin üzerine çıkarır.",
    body: [
      "Bursa'da bir hasarlı aracın değeri çoğu şehirden yüksek çıkar, çünkü sökülen parçanın alıcısı aynı şehirdedir. Özellikle pert kayıtlı ve ağır hasarlı araçlarda bu fark belirgindir; aracın onarılamaz olması Bursa'da değersiz olduğu anlamına gelmez.",
      "Şehrin ikinci dinamiği İstanbul–İzmir aksındaki geçiş trafiğidir. Otoyolda kaza yapıp aracı Bursa'da kalan sürücüler, aracı memleketlerine taşımak yerine burada satmayı tercih eder; ilanınıza aracın hangi otoparkta olduğunu yazmanız bu alıcılar için işlemi kolaylaştırır.",
    ],
    points: [
      "Yan sanayi yoğunluğu parça değerini yükseltir",
      "Pert ve ağır hasarlı araçlarda güçlü talep",
      "Otoyol kazası araçları için otoparktan devir",
      "17 ilçeden ilan ve alıcı erişimi",
    ],
    faqs: [
      {
        question: "Bursa'da pert araç neden daha değerli oluyor?",
        answer:
          "Bursa otomotiv yan sanayisinin merkezi olduğu için sökülen parçanın alıcısı aynı şehirdedir. Bu, nakliye maliyetini ortadan kaldırır ve parça değerinin tekliflere daha yüksek yansımasını sağlar.",
      },
      {
        question: "Otoyolda kaza yaptım, aracım Bursa'da otoparkta; ilan verebilir miyim?",
        answer:
          "Verebilirsiniz. İlanınızda aracın otoparkta olduğunu ve konumunu belirtmeniz yeterlidir; bu duruma alışkın alıcılar teslim ve devir sürecini kendileri planlar.",
      },
      {
        question: "İnegöl veya Gemlik'ten ilan verebilir miyim?",
        answer:
          "Evet, Bursa'nın tüm ilçelerinden ilan kabul edilir. İlçe bilgisini girmeniz, size en yakın alıcıların ilanınızı önce görmesini sağlar.",
      },
    ],
  },

  konya: {
    metaDescription:
      "Konya'da hasarlı, kazalı ve hurda araç ilanları. Tarım ve ticari araçlarda geniş alıcı kitlesi; ücretsiz ilan verin, güncel ilanları karşılaştırın.",
    intro:
      "Türkiye'nin en geniş yüzölçümlü ilinde mesafe, hasarlı araç satışının en büyük engelidir. Otograde'de ilanınız il genelindeki alıcılara aynı anda ulaştığı için tek tek galeri gezme zorunluluğu ortadan kalkar.",
    body: [
      "Konya'da tarım ve nakliye araçları pazarın büyük bölümünü oluşturur; yoğun sezonda yıpranan pikap ve kamyonetler için sürekli bir alıcı kitlesi vardır. Bu araçlarda alıcılar kilometreden çok şasi ve yürüyen aksamın durumuna bakar.",
      "İl genelinde uzun ve düz karayolları yüksek seyir hızını, dolayısıyla ağır sonuçlu kazaları beraberinde getirir. Konya–Ankara ve Konya–Adana akslarında kaza yapan şehir dışı sürücüler için ilan üzerinden satış, aracı kendi şehrine taşımaktan çok daha ekonomik bir çözümdür.",
    ],
    points: [
      "31 ilçeden ilan ve alıcı erişimi",
      "Tarım ve nakliye araçlarında sürekli talep",
      "Uzun yol kazalarında yerinde satış avantajı",
      "İl geneline tek ilanla erişim",
    ],
    faqs: [
      {
        question: "Konya'nın uzak bir ilçesindeyim, alıcı bulabilir miyim?",
        answer:
          "Bulabilirsiniz. İlanınız il genelindeki tüm alıcılara açıktır ve ilçe bilgisi göründüğü için alıcı mesafeyi baştan bilerek teklif verir; bu da sonradan pazarlık yaşanmasını önler.",
      },
      {
        question: "Tarlada kullandığım arızalı pikabı satabilir miyim?",
        answer:
          "Satabilirsiniz. Yoğun kullanılmış tarım araçları Konya'da düzenli alıcı bulur; çalışmayan araçlar için de parça ve ekonomik değeri üzerinden teklif gelir.",
      },
      {
        question: "Uzun yolda kaza yaptım, Konyalı değilim; ne yapmalıyım?",
        answer:
          "Aracın bulunduğu ilçeyi ve otoparkı ilanınızda belirtin. Şehir dışı satıcılarla çalışmaya alışkın alıcılar teslim ve devir planlamasını üstlenir, aracı memleketinize taşımanız gerekmez.",
      },
    ],
  },

  antalya: {
    metaDescription:
      "Antalya'da hasarlı, kazalı ve pert araç ilanları. Kiralama filosu çıkışları ve turizm araçlarında geniş arz; ücretsiz ilan verin veya ilanları inceleyin.",
    intro:
      "Antalya'nın araç pazarı mevsimle nefes alır. Sezonda yükselen talep, sezon sonunda filo yenilemeleriyle artan arz — bu döngüyü bilmek satış zamanlamanızı doğrudan etkiler.",
    body: [
      "Kiralama sektörünün büyüklüğü Antalya'yı sezon sonunda hasarlı ve yıpranmış araç arzının en yoğunlaştığı şehir yapar. Bu dönemde ilanınızın öne çıkması için fiyatlamanın gerçekçi olması gerekir; aynı segmentte çok sayıda ilan varken abartılı fiyat, ilanın görülmesini değil görmezden gelinmesini sağlar.",
      "Şehrin ikinci özelliği, yerleşik yabancı nüfusun elindeki araç hacmidir. Ülkeden ayrılırken hızlı satış arayan bu satıcılar için ilan üzerinden doğrudan alıcıya ulaşmak, galeri pazarlığından hem daha hızlı hem daha yüksek getirili olur.",
    ],
    points: [
      "Sezon sonu filo çıkışlarında yoğun arz",
      "19 ilçeden ilan ve alıcı erişimi",
      "Hızlı satış arayan satıcılar için doğrudan alıcı erişimi",
      "D400 aksı kazalarında yerinden teslim",
    ],
    faqs: [
      {
        question: "Antalya'da hasarlı aracımı ne zaman satmalıyım?",
        answer:
          "Sezon sonunda kiralama filoları toplu çıkış yaptığı için arz yükselir ve rekabet artar. Aracınız hazırsa sezon içinde veya sezon sonu dalgası başlamadan ilan vermek genellikle daha iyi sonuç verir.",
      },
      {
        question: "Yurt dışına dönüyorum, aracımı hızlıca satabilir miyim?",
        answer:
          "İlan üzerinden doğrudan alıcıya ulaştığınız için süreç galeri pazarlığından hızlı ilerler. İlanınızda aciliyeti ve son tarihi belirtmeniz, buna uygun alıcıların önce sizinle iletişime geçmesini sağlar.",
      },
      {
        question: "Alanya veya Manavgat'tan ilan verebilir miyim?",
        answer:
          "Evet. Antalya'nın tüm ilçelerinden ilan kabul edilir ve ilçe bilgisi ilanda göründüğü için alıcı mesafeyi baştan hesaba katar.",
      },
    ],
  },

  kocaeli: {
    metaDescription:
      "Kocaeli'de hasarlı, kazalı ve ticari araç ilanları. Gebze–İzmit sanayi hattında güçlü talep; ücretsiz ilan verin veya bayilerin ilanlarını inceleyin.",
    intro:
      "Sanayinin yoğunlaştığı Kocaeli'de hasarlı ticari araç, diğer şehirlerin çoğunda olmadığı kadar hızlı alıcı bulur. Bölgedeki işletmeler onarıp filoya katmak üzere sürekli araç arar.",
    body: [
      "TEM ve D-100'ün il boyunca paralel uzandığı Kocaeli, kilometrekareye düşen ağır vasıta yoğunluğunda Türkiye'nin başındadır; bu da kaza sıklığını ve buna bağlı hasarlı araç arzını yüksek tutar. Arz yüksek olduğu için ilan kalitesi burada belirleyicidir: eksiksiz fotoğraf ve net hasar açıklaması olan ilanlar öne çıkar.",
      "Gebze'den İzmit'e uzanan sanayi kuşağı, panelvan ve kamyonet gibi hafif ticari araçlarda istikrarlı bir alıcı tabanı yaratır. Bu alıcılar için aracın kozmetik durumu ikincil, motor ve şanzıman sağlığı birincildir; ilanınızda bu bilgiyi öne çıkarmak doğru teklifleri getirir.",
    ],
    points: [
      "Gebze–İzmit sanayi hattında ticari araç talebi",
      "TEM ve D-100 kazalarında yoğun arz",
      "İstanbul alıcılarına coğrafi yakınlık",
      "12 ilçeden ilan ve alıcı erişimi",
    ],
    faqs: [
      {
        question: "Kocaeli'de hafif ticari aracıma alıcı bulabilir miyim?",
        answer:
          "Bulabilirsiniz; sanayi kuşağındaki işletmeler panelvan ve kamyonetleri düzenli olarak alır. İlanınızda motor ve şanzıman durumunu net belirtmeniz, bu alıcılardan gelen tekliflerin kalitesini yükseltir.",
      },
      {
        question: "TEM'de kaza yaptım ama İstanbul'da oturuyorum; ilan verebilir miyim?",
        answer:
          "Verebilirsiniz. Aracın Kocaeli'de bulunduğunu ve otopark bilgisini ilana yazmanız yeterlidir; bölgedeki alıcılar teslim ve devir sürecini kendileri planlar.",
      },
      {
        question: "İlanım ne kadar sürede yayına girer?",
        answer:
          "İlanlar moderasyon kontrolünden geçtikten sonra yayımlanır. Fotoğrafların net ve araç bilgilerinin eksiksiz olması bu süreci belirgin şekilde kısaltır.",
      },
    ],
  },

  adana: {
    metaDescription:
      "Adana'da hasarlı, kazalı ve sel hasarlı araç ilanları. Sıcaklık ve su hasarında deneyimli alıcı kitlesi; ücretsiz ilan verin veya ilanları inceleyin.",
    intro:
      "Adana'nın iklimi araç hasarının profilini belirler: yazın aşırı sıcak kaynaklı mekanik arızalar, kışın ani sağanaklarda su basan araçlar. Her ikisinde de şehirde deneyimli alıcı vardır.",
    body: [
      "Su hasarlı araç, doğru alıcıya ulaştığında değerini bulan ama yanlış ilanla neredeyse satılamayan bir kategoridir. Belirleyici olan suyun kabin içine ve elektronik aksama ulaşıp ulaşmadığıdır; bu bilgiyi ilanda açıkça vermek, sel hasarlı araç almaya alışkın alıcıların size yönelmesini sağlar.",
      "Şehrin ikinci dinamiği transit ticarettir. E-90 ve TAG otoyolunun kesiştiği Adana'da uzun yol kazaları sık yaşanır ve aracı burada kalan şehir dışı sürücüler için ilan üzerinden satış, taşıma masrafından kurtaran en pratik yoldur.",
    ],
    points: [
      "Sel ve su hasarlı araçta deneyimli alıcılar",
      "Sıcaklık kaynaklı motor arızalarında talep",
      "Transit koridor kazalarında yerinde satış",
      "15 ilçeden ilan ve alıcı erişimi",
    ],
    faqs: [
      {
        question: "Su basmış aracımı Adana'da satabilir miyim?",
        answer:
          "Satabilirsiniz. Önemli olan suyun hangi seviyeye ulaştığını ilanda belirtmenizdir; motor ve elektronik aksam etkilenmemişse değer kaybı beklenenden düşük olur.",
      },
      {
        question: "Sıcaktan motoru arızalanan aracın değeri kalır mı?",
        answer:
          "Kalır. Motor arızası değeri etkiler ancak gövde, şanzıman ve iç donanım kullanılabilir durumdaysa araç ciddi bir parça değeri taşır.",
      },
      {
        question: "Adana'dan geçerken kaza yaptım, buralı değilim; ne yapmalıyım?",
        answer:
          "İlanınızda aracın Adana'da ve hangi otoparkta olduğunu belirtin. Bu duruma alışkın alıcılar teslim ve devir planlamasını üstlenir; aracı kendi şehrinize taşımanız gerekmez.",
      },
    ],
  },

  gaziantep: {
    metaDescription:
      "Gaziantep'te hasarlı, kazalı ve ticari araç ilanları. Sanayi ve ihracat trafiğinde yüksek talep; ücretsiz ilan verin veya güncel ilanları karşılaştırın.",
    intro:
      "İhracatın ve üretimin merkezi Gaziantep'te ticari araç sirkülasyonu Türkiye ortalamasının çok üzerindedir; bu da yıpranmış ve hasarlı ticari araçlar için istikrarlı bir alıcı tabanı yaratır.",
    body: [
      "Organize sanayi bölgelerindeki işletmeler filolarını düzenli yeniler; ekonomik ömrünü dolduran panelvan ve kamyonetler şehirdeki ilanların önemli bölümünü oluşturur. Bu segmentte alıcı, aracın kaç kilometre yaptığından çok bakım geçmişine bakar — servis kayıtlarını ilana eklemek burada gerçek bir fark yaratır.",
      "TAG otoyolu üzerindeki konum, şehirler arası kaza kaynaklı arzı da besler. Bireysel tarafta pert ve yüksek tramer kayıtlı araçlar öne çıkar; Gaziantep alıcıları bu kayıtlara alışkın olduğu için kayıt yüksekliği ilan vermenize engel değildir.",
    ],
    points: [
      "OSB işletmelerinden düzenli filo yenileme talebi",
      "Yüksek tramer kayıtlı araçlarda alıcı deneyimi",
      "Bakım geçmişi fiyata doğrudan yansır",
      "Nizip ve İslahiye dahil ilçelerden erişim",
    ],
    faqs: [
      {
        question: "Tramer kaydı yüksek aracımı Gaziantep'te satabilir miyim?",
        answer:
          "Satabilirsiniz. Buradaki alıcılar yüksek kayıtlı araçlarla düzenli çalışır; belirleyici olan kaydın tutarı değil, aracın bugünkü fiili durumudur.",
      },
      {
        question: "Şirketimizin birden fazla aracını aynı anda ilana çıkarabilir miyiz?",
        answer:
          "Çıkarabilirsiniz. Bayi üyeliğiyle birden fazla ilanı tek panelden yönetebilir, gelen mesajları ve ilan performansını tek yerden takip edebilirsiniz.",
      },
      {
        question: "Servis kayıtlarını ilana eklemek gerekli mi?",
        answer:
          "Zorunlu değil ama güçlü şekilde tavsiye edilir. Özellikle ticari araçlarda bakım geçmişi, alıcının riski nasıl fiyatladığını doğrudan etkiler.",
      },
    ],
  },

  kayseri: {
    metaDescription:
      "Kayseri'de hasarlı, kazalı ve ticari araç ilanları. Sanayi kentinde güçlü kamyonet talebi; ücretsiz ilan verin veya bayilerin ilanlarını inceleyin.",
    intro:
      "Anadolu'nun üretim merkezlerinden Kayseri'de hafif ticari araç hareketliliği yüksektir; mobilya ve imalat sektörünün yük araçları pazarın omurgasını oluşturur.",
    body: [
      "Kayseri'de bir kamyonet veya panelvan, yük altında hızlı yıpranır ve ekonomik ömrünü tamamladığında yerini yenisine bırakır. Bu döngü, hasarlı ve yorgun ticari araçlar için sürekli bir alıcı akışı yaratır; ilanınızda taşıma kapasitesini ve kullanım geçmişini belirtmek doğru alıcıyı getirir.",
      "Şehrin sert karasal iklimi kış aylarında buzlanma kazalarını artırır; Erciyes yolu bu dönemde hasarlı araç arzının belirgin şekilde yükseldiği bir hattır. Kış hasarlı araçlarda alıcılar özellikle şasi ve alt takım durumunu sorgular, bu bilgiyi ilana eklemek pazarlığı kısaltır.",
    ],
    points: [
      "İmalat sektöründen sürekli ticari araç talebi",
      "Kış kazalarında yoğunlaşan arz",
      "Şasi ve alt takım bilgisi pazarlığı kısaltır",
      "16 ilçeden ilan ve alıcı erişimi",
    ],
    faqs: [
      {
        question: "Kayseri'de yük aracımı satmak ne kadar sürer?",
        answer:
          "Ticari araç talebi şehirde istikrarlı olduğu için doğru fiyatlanmış ve fotoğrafları eksiksiz bir ilan genellikle kısa sürede teklif alır. Süre, aracın segmentine ve fiyat beklentinize göre değişir.",
      },
      {
        question: "Buzlanmada kaza yapan aracımı hemen ilana çıkarmalı mıyım?",
        answer:
          "Evet. Hasarlı araç bekledikçe hem değer kaybeder hem de ek hasar riski taşır; onarım kararı vermeden önce ilan verip gelen teklifleri görmek genellikle daha rasyoneldir.",
      },
      {
        question: "İlanımı sonradan düzenleyebilir miyim?",
        answer:
          "Düzenleyebilirsiniz. Fiyat, açıklama ve fotoğraflar ilan yayındayken güncellenebilir; güncel tutulan ilanlar arama sonuçlarında daha iyi performans gösterir.",
      },
    ],
  },

  mersin: {
    metaDescription:
      "Mersin'de hasarlı, kazalı ve ticari araç ilanları. Liman lojistiğinde güçlü talep, Tarsus dahil tüm ilçeler; ücretsiz ilan verin veya ilanları inceleyin.",
    intro:
      "Limanın belirlediği bir ekonomide, Mersin'in hasarlı araç pazarı da lojistik ağırlıklıdır: yük taşıyan araçlar burada hem en çok yıpranan hem en çok aranan gruptur.",
    body: [
      "Liman ve depo operasyonlarında çalışan kamyonet ile panelvanlar yüksek kilometreye hızla ulaşır. Bu araçlar için Mersin'de onarıp yeniden hizmete alan bir alıcı kitlesi vardır; ilanınızda aracın hangi işte kullanıldığını belirtmek, alıcının yıpranmayı doğru değerlendirmesini sağlar.",
      "Bireysel tarafta Mersin–Adana otoyolunun yüksek hız kazaları ve sahil ikliminin korozyon etkisi öne çıkar. Tarsus'tan Anamur'a uzanan geniş coğrafyada ilçe bilgisi kritik önemdedir: alıcı mesafeyi baştan bildiğinde teklif daha gerçekçi ve kalıcı olur.",
    ],
    points: [
      "Liman lojistiği araçlarında sürekli talep",
      "Geniş coğrafyada ilçe bazlı eşleşme",
      "Otoyol kazalarında yerinden teslim",
      "13 ilçeden ilan ve alıcı erişimi",
    ],
    faqs: [
      {
        question: "Mersin'de nakliyede kullanılmış aracımı satabilir miyim?",
        answer:
          "Satabilirsiniz; liman çevresindeki işletmeler bu araçları düzenli alır. Kullanım amacını ve bakım geçmişini ilana yazmanız, yıpranmanın doğru fiyatlanmasını sağlar.",
      },
      {
        question: "Anamur gibi uzak bir ilçedeyim, sorun olur mu?",
        answer:
          "Olmaz. İlçe bilgisi ilanınızda göründüğü için alıcı mesafeyi hesaba katarak teklif verir; bu da araç görüldüğünde sürpriz pazarlık yaşanmasını önler.",
      },
      {
        question: "Aracım çalışmıyor, yine de ilan verebilir miyim?",
        answer:
          "Verebilirsiniz. Çalışmayan araçlar ilanlarda ayrı bir kategoridir ve bu araçlara özel alıcı kitlesi vardır; ilanınızda aracın çalışmadığını belirtmeniz yeterlidir.",
      },
    ],
  },

  diyarbakir: {
    metaDescription:
      "Diyarbakır'da hasarlı, kazalı ve hurda araç ilanları. Bölgenin ticaret merkezinde geniş alıcı ağı; ücretsiz ilan verin veya güncel ilanları inceleyin.",
    intro:
      "Diyarbakır, Güneydoğu'nun araç ticaretinde toplanma noktasıdır; çevre illerden gelen alıcı ve satıcılar pazarı şehirde buluşturur.",
    body: [
      "Bölgesel merkez olması, Diyarbakır'daki bir ilanın yalnızca şehirden değil çevre illerden de alıcı çekmesi anlamına gelir. Bu genişlik özellikle niş araçlarda önemlidir: tek bir şehirde alıcısı zor bulunan model ve donanımlar, bölgesel erişimle çok daha hızlı eşleşir.",
      "Şehirde ticari araç ve arazi kullanımına uygun modeller ağırlıktadır. Uzun mesafe kullanımdan kaynaklanan yüksek kilometre burada alışıldık bir durumdur; alıcılar kilometreden çok motorun ve şanzımanın bakım geçmişine bakar.",
    ],
    points: [
      "Çevre illerden gelen bölgesel alıcı erişimi",
      "Yüksek kilometreli araçlarda alıcı deneyimi",
      "Ticari ve arazi kullanımlı modellerde talep",
      "17 ilçeden ilan ve alıcı erişimi",
    ],
    faqs: [
      {
        question: "Diyarbakır'daki ilanımı çevre illerden de görebilirler mi?",
        answer:
          "Evet. İlanlar il filtresiyle listelense de alıcıların çoğu çevre illeri de tarar; Diyarbakır bölgesel bir merkez olduğu için ilanınızın erişimi şehir sınırlarını aşar.",
      },
      {
        question: "Kilometresi çok yüksek aracımı satabilir miyim?",
        answer:
          "Satabilirsiniz. Bölgede uzun mesafe kullanımı yaygın olduğu için yüksek kilometre tek başına engel değildir; bakım geçmişini ilana eklemek belirleyici olur.",
      },
      {
        question: "Hurda belgeli araç için ilan verebilir miyim?",
        answer:
          "Verebilirsiniz. Hurda ve çekme belgeli araçlar ayrı kategoride listelenir ve bu araçlara özel alıcı kitlesi vardır.",
      },
    ],
  },

  samsun: {
    metaDescription:
      "Samsun'da hasarlı, kazalı ve arızalı araç ilanları. Karadeniz'in merkezinde geniş alıcı ağı; ücretsiz ilan verin veya bayilerin ilanlarını inceleyin.",
    intro:
      "Karadeniz'in en büyük kenti Samsun, bölgenin araç ticaretinde toplayıcı rol oynar; sahil hattı boyunca uzanan geniş bir alıcı ağına açılır.",
    body: [
      "Bölgenin yağışlı iklimi araçlarda korozyonu hızlandırır ve kaygan yol koşulları kaza sıklığını artırır. Samsun alıcıları bu koşullara alışkındır; korozyon ilanınızda belirtildiğinde beklenenden daha az fiyat etkisi yaratır, çünkü bölgede standart bir durum olarak değerlendirilir.",
      "Şehir aynı zamanda Bafra ve Çarşamba ovalarının tarım araçları için pazar işlevi görür. Bu segmentte alıcılar aracın arazi koşullarında ne kadar çalıştığını sorgular; kullanım geçmişini net anlatan ilanlar daha az pazarlıkla sonuçlanır.",
    ],
    points: [
      "Karadeniz genelinden bölgesel alıcı erişimi",
      "Korozyonlu araçlarda gerçekçi değerlendirme",
      "Ova tarımı araçlarında istikrarlı talep",
      "17 ilçeden ilan ve alıcı erişimi",
    ],
    faqs: [
      {
        question: "Samsun'da paslanmış aracın değeri çok mu düşer?",
        answer:
          "Bölgede korozyon yaygın olduğu için alıcılar buna alışkındır ve etkisi beklenenden sınırlı olur. Belirleyici olan yüzeysel pas değil, şasi ve taşıyıcı bölümlerin sağlamlığıdır.",
      },
      {
        question: "Sahil yolunda kaza yaptım, aracım çalışmıyor; ilan verebilir miyim?",
        answer:
          "Verebilirsiniz. Çalışmayan araçlar ayrı kategoride listelenir; ilanınızda aracın bulunduğu konumu belirtmeniz alıcının teslim planlamasını kolaylaştırır.",
      },
      {
        question: "Tarım aracımı hangi kategoride ilan vermeliyim?",
        answer:
          "Pikap ve kamyonet gibi araçlar ticari araç kategorisinde listelenir. İlan açıklamasında tarımsal kullanımı belirtmeniz, bu deneyime sahip alıcıların ilgisini çeker.",
      },
    ],
  },

  balikesir: {
    metaDescription:
      "Balıkesir'de hasarlı, kazalı ve pert araç ilanları. Bandırma ve Edremit dahil tüm ilçeler; ücretsiz ilan verin veya güncel ilanları karşılaştırın.",
    intro:
      "İstanbul–İzmir hattının ortasındaki Balıkesir, hem geçiş trafiğinin kazalarını hem körfezin sezonluk araç hareketini aynı anda taşır.",
    body: [
      "O-5 otoyolunun açılmasıyla il üzerinden geçen trafik büyük ölçüde arttı; otoyol kazaları sonrası ilde kalan araçlar ilanların önemli bölümünü oluşturuyor. Şehir dışından geçerken kaza yapan sürücüler için ilan üzerinden satış, aracı memlekete taşımaktan çok daha ekonomik bir çözüm sunuyor.",
      "İlin kuzeyi ve güneyi arasındaki mesafe büyük olduğundan ilçe bilgisi burada özellikle önemlidir. Bandırma çevresinde liman ve sanayi kaynaklı ticari araçlar, Edremit körfezinde ise az kullanılmış yazlık araçlar öne çıkar; iki profil farklı alıcı kitlesine hitap eder.",
    ],
    points: [
      "O-5 otoyolu kazalarında yerinde satış",
      "Bandırma'da ticari, Edremit'te yazlık araç profili",
      "Kuzey ve güney ilçelerde ayrı alıcı kitlesi",
      "20 ilçeden ilan ve alıcı erişimi",
    ],
    faqs: [
      {
        question: "Otoyolda kaza yaptım, aracım Balıkesir'de; nasıl satarım?",
        answer:
          "İlanınızda aracın bulunduğu ilçeyi ve otoparkı belirtmeniz yeterli. Bölge alıcıları bu duruma alışkındır ve teslim ile devir sürecini kendileri planlar.",
      },
      {
        question: "Edremit'teki az kullanılmış yazlık aracımı satabilir miyim?",
        answer:
          "Satabilirsiniz. Uzun süre park hâlinde kalmış araçlarda akü ve fren sorunları olağandır ve alıcılar bunu bilir; kaç yıldır kullanılmadığını ilana yazmanız yeterlidir.",
      },
      {
        question: "Bandırma'dan ilan vermek avantajlı mı?",
        answer:
          "Bandırma liman ve sanayi kaynaklı ticari araç talebinin yoğunlaştığı ilçedir; ticari bir araç satıyorsanız ilçe bilgisini girmeniz doğru alıcıya erişimi hızlandırır.",
      },
    ],
  },

  hatay: {
    metaDescription:
      "Hatay'da hasarlı, kazalı ve arızalı araç ilanları. Antakya ve İskenderun dahil tüm ilçeler; ücretsiz ilan verin veya güncel ilanları inceleyin.",
    intro:
      "Hatay'da araç parkı hızla yenileniyor; uzun süre kullanılmayan veya hasarlı kalmış araçlar için pratik bir satış kanalına ihtiyaç her zamankinden yüksek.",
    body: [
      "Şehirden ayrılmış veya adresi değişmiş araç sahipleri için ilan üzerinden satış, aracı bulunduğu yerde değerlendirmenin en pratik yoludur. İlanınızda aracın konumunu ve erişim koşullarını net belirtmeniz, uzaktan yürütülecek bir süreçte alıcının planlama yapmasını sağlar.",
      "İskenderun'daki demir-çelik sanayisi ve liman trafiği ticari araç talebini, körfezin nemli havası ise korozyon değerlendirmesini bölgeye özgü kılar. Antakya, Defne ve Dörtyol dahil il genelinde ilan verebilir; ilçe bilgisi alıcı eşleşmesini doğrudan iyileştirir.",
    ],
    points: [
      "Uzun süre bekleyen araçlar için pratik satış kanalı",
      "Şehir dışındaki sahipler için uzaktan süreç",
      "İskenderun'da sanayi kaynaklı ticari araç talebi",
      "15 ilçeden ilan ve alıcı erişimi",
    ],
    faqs: [
      {
        question: "Hatay dışında yaşıyorum, oradaki aracımı ilana çıkarabilir miyim?",
        answer:
          "Çıkarabilirsiniz. İlanınızda aracın konumunu belirtmeniz yeterli; alıcılar aracı yerinde görmeyi ve teslim sürecini planlamayı üstlenir.",
      },
      {
        question: "Uzun süredir çalışmayan araç için ilan verilir mi?",
        answer:
          "Verilir. Uzun süre hareketsiz kalan araçlarda akü, lastik ve fren sorunları beklenen durumdur; ne kadar süredir kullanılmadığını yazmanız alıcı için yeterli bilgidir.",
      },
      {
        question: "İskenderun'dan ticari araç ilanı vermek mantıklı mı?",
        answer:
          "Evet. Sanayi ve liman çevresindeki işletmeler bölgede düzenli olarak ticari araç arar; ilçe bilgisini girmeniz bu alıcılarla eşleşmeyi hızlandırır.",
      },
    ],
  },
};

export function getCityContent(slug: string): CityContent | undefined {
  return CITY_CONTENT[slug];
}
