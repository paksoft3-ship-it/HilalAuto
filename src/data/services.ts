export interface ServiceData {
  slug: string;
  title: string;
  shortTitle: string;
  metaDescription: string;
  hero: {
    badge: string;
    heading: string;
    description: string;
  };
  problems: Array<{ title: string; desc: string }>;
  conditions: Array<{ label: string }>;
  faqs: Array<{ id: string; question: string; answer: string }>;
}

export const SERVICES: Record<string, ServiceData> = {
  "kazali-arac-alimi": {
    slug: "kazali-arac-alimi",
    title: "Kazalı Araç Alımı",
    shortTitle: "Kazalı Araç",
    metaDescription:
      "Kazalı aracınızı yerinden teslim alıyoruz. Ücretsiz teklif alın, uzman ekibimiz hızlıca dönüş yapsın.",
    hero: {
      badge: "Kazalı Araç",
      heading: "Kazalı Aracınız İçin Hızlı Teklif Alın",
      description:
        "Trafik kazası geçirmiş aracınız için ücretsiz ve bağlayıcı olmayan teklif alın. Aracı bulunduğu yerden teslim alıyor, evrak işlemlerinde destek sağlıyoruz.",
    },
    problems: [
      { title: "Ön Hasar", desc: "Tampon, kaput veya radyatör hasarlı araçlar" },
      { title: "Yan Hasar", desc: "Kapı, çamurluk veya eşik hasarlı araçlar" },
      { title: "Arka Hasar", desc: "Bagaj kapağı veya arka tampon hasarlı araçlar" },
      { title: "Toplam Hasar", desc: "Birden fazla bölgede ciddi hasar olan araçlar" },
    ],
    conditions: [
      { label: "Ön tampon hasarı" },
      { label: "Motor bölgesi hasarı" },
      { label: "Kaporta hasarı" },
      { label: "Cam hasarı" },
      { label: "İç mekan hasarı" },
      { label: "Mekanik hasar" },
    ],
    faqs: [
      {
        id: "k1",
        question: "Ağır kazalı araçları da alıyor musunuz?",
        answer:
          "Evet. Ağır hasar derecesine bakılmaksızın kazalı araçları değerlendiriyoruz.",
      },
      {
        id: "k2",
        question: "Kazalı araç için teklif almak kaç gün sürüyor?",
        answer: "Başvurunuzdan sonra 1 saat içinde size dönüş yapıyoruz.",
      },
      {
        id: "k3",
        question: "Araç çekici gerekiyor mu?",
        answer:
          "Gerekirse çekici konusunda yönlendirme yapıyoruz. Teslim sürecini birlikte planlıyoruz.",
      },
      {
        id: "k4",
        question: "Sigorta dosyası açık araçları alıyor musunuz?",
        answer:
          "Evet. Sigorta dosyası açık araçları da değerlendiriyoruz. Süreç hakkında size bilgi veriyoruz.",
      },
    ],
  },

  "pert-arac-alimi": {
    slug: "pert-arac-alimi",
    title: "Pert Araç Alımı",
    shortTitle: "Pert Araç",
    metaDescription:
      "Sigorta tarafından pert ilan edilmiş aracınızı alıyoruz. Ücretsiz teklif alın.",
    hero: {
      badge: "Pert Araç",
      heading: "Pert İlan Edilmiş Aracınızı Satın",
      description:
        "Sigorta şirketi tarafından pert ilan edilen aracınız için adil değerleme yapıyoruz. Evrak sürecinde ekibimiz yanınızda.",
    },
    problems: [
      { title: "Sigorta Pertli", desc: "Sigorta tarafından pert ilan edilmiş araçlar" },
      { title: "Ağır Hasar", desc: "Onarım maliyeti araç değerini aşan araçlar" },
      { title: "Çekme Kaydı", desc: "Çekme belgesi eklenmiş pert araçlar" },
      { title: "Hasarlı Kayıtlı", desc: "Tescil belgelerinde hasar kaydı olan araçlar" },
    ],
    conditions: [
      { label: "Sigorta pert kaydı" },
      { label: "Ağır yapısal hasar" },
      { label: "Yüksek onarım maliyeti" },
      { label: "Çekme belgeli" },
    ],
    faqs: [
      {
        id: "p1",
        question: "Pert araç belgelerini nasıl hazırlarım?",
        answer:
          "Sigorta pert belgesini, araç ruhsatını ve kimliğinizi hazırlamanız yeterli. Geri kalan süreçte size rehberlik ediyoruz.",
      },
      {
        id: "p2",
        question: "Pert araç için gerçekçi teklif alabilir miyim?",
        answer:
          "Evet. Piyasa koşullarına göre adil teklif sunuyoruz. Teklifimiz bağlayıcı değildir.",
      },
      {
        id: "p3",
        question: "Sigorta şirketiyle süreç nasıl yürüyor?",
        answer:
          "Pert işlemleri tamamlandıktan sonra devir süreci başlar. Ekibimiz bu süreçte sizi yönlendirir.",
      },
      {
        id: "p4",
        question: "Pert araçta hasar tespiti yapıyor musunuz?",
        answer:
          "Fotoğraf üzerinden ön değerleme yapıyoruz. Teslim aşamasında fiziksel inceleme gerçekleştiriliyor.",
      },
    ],
  },

  "yanmis-arac-alimi": {
    slug: "yanmis-arac-alimi",
    title: "Yanmış Araç Alımı",
    shortTitle: "Yanmış Araç",
    metaDescription:
      "Yangın hasarı görmüş aracınızı değerinde alıyoruz. Ücretsiz teklif alın.",
    hero: {
      badge: "Yanmış Araç",
      heading: "Yanmış Aracınızı Değerinde Satın",
      description:
        "Yangın hasarı görmüş araçlar için adil teklif sunuyoruz. Araç durumu ne olursa olsun değerlendirme yapıyoruz.",
    },
    problems: [
      { title: "Kısmi Yangın", desc: "Motor veya bagaj bölgesinde yangın hasarı" },
      { title: "Tam Yangın", desc: "Aracın tamamında yangın hasarı" },
      { title: "Elektrik Yangını", desc: "Elektrik arızasından kaynaklanan yangın" },
      { title: "Dış Kaynaklı", desc: "Dış etkenden kaynaklanan yangın hasarı" },
    ],
    conditions: [
      { label: "Kısmi yanmış" },
      { label: "Tamamen yanmış" },
      { label: "Plastik ve iç mekan yanmış" },
      { label: "Motor yanmış" },
    ],
    faqs: [
      {
        id: "y1",
        question: "Tamamen yanmış araç alıyor musunuz?",
        answer: "Evet. Araç hasarının boyutundan bağımsız olarak değerlendirme yapıyoruz.",
      },
      {
        id: "y2",
        question: "Yanmış araç için sigorta tazminatı aldım. Aracı satabilir miyim?",
        answer:
          "Sigorta sürecini tamamladıktan sonra satış işlemi yapabilirsiniz. Detaylar için bizi arayın.",
      },
      {
        id: "y3",
        question: "Araç hareket edemiyorsa teslim nasıl yapılır?",
        answer:
          "Çekici organizasyonunda yardımcı oluyoruz. Teslim lojistiğini birlikte planlıyoruz.",
      },
      {
        id: "y4",
        question: "Yanmış araç kaç TL eder?",
        answer:
          "Araç modeline, yılına ve hasar durumuna göre değişir. Ücretsiz değerleme için form doldurun.",
      },
    ],
  },

  "sel-hasarli-arac-alimi": {
    slug: "sel-hasarli-arac-alimi",
    title: "Sel Hasarlı Araç Alımı",
    shortTitle: "Sel Hasarlı Araç",
    metaDescription:
      "Sel veya su baskını hasarlı aracınızı değerinde alıyoruz. Ücretsiz teklif alın.",
    hero: {
      badge: "Sel Hasarlı Araç",
      heading: "Sel Hasarlı Aracınızı Satın",
      description:
        "Su baskını veya sel nedeniyle zarar gören araçlar için adil değerleme yapıyoruz. Aracınızı yerinden teslim alıyoruz.",
    },
    problems: [
      { title: "Motor Su Basmış", desc: "Motor kompartımanına su girmiş araçlar" },
      { title: "İç Mekan Islak", desc: "Kabine su girmiş, döşeme ve elektronik zarar görmüş" },
      { title: "Elektrik Arızası", desc: "Sel suyundan kaynaklanan elektrik sistemi arızası" },
      { title: "Pas ve Koku", desc: "Su hasarı sonrası pas ve nem kokusu oluşmuş araçlar" },
    ],
    conditions: [
      { label: "Motor sel hasarı" },
      { label: "Elektronik hasar" },
      { label: "Döşeme hasarı" },
      { label: "Pas ve nem" },
    ],
    faqs: [
      {
        id: "s1",
        question: "Sel hasarlı araç için sigorta tazminatı beklemeli miyim?",
        answer:
          "Sigorta sürecini beklemeden de satış yapabilirsiniz. Tazminat durumunuzu değerlendirerek en iyi seçeneği sunuyoruz.",
      },
      {
        id: "s2",
        question: "Su baskını olan araçları gerçekten alıyor musunuz?",
        answer:
          "Evet. Sel hasarlı araçları düzenli olarak alıyoruz. Araç durumunu fotoğraf üzerinden değerlendiriyoruz.",
      },
      {
        id: "s3",
        question: "Araç çalışmıyorsa ne yapmalıyım?",
        answer: "Çalışmayan araçları da teslim alıyoruz. Teslim planını birlikte yapıyoruz.",
      },
      {
        id: "s4",
        question: "Sel hasarlı araç değeri nasıl belirlenir?",
        answer:
          "Araç yaşı, modeli, motor durumu ve hasar kapsamına göre değerleme yapıyoruz.",
      },
    ],
  },

  "hurda-arac-alimi": {
    slug: "hurda-arac-alimi",
    title: "Hurda Araç Alımı",
    shortTitle: "Hurda Araç",
    metaDescription:
      "Hurda aracınızı değerinde alıyoruz. Belge işlemlerinde destek veriyoruz. Ücretsiz teklif alın.",
    hero: {
      badge: "Hurda Araç",
      heading: "Hurda Aracınız İçin Teklif Alın",
      description:
        "Ekonomik ömrünü tamamlamış araçları satın alıyoruz. Hurda belgesi sürecinde ekibimiz size yardımcı olur.",
    },
    problems: [
      { title: "Eski Model", desc: "Ekonomik değerini yitirmiş eski model araçlar" },
      { title: "Çalışmıyor", desc: "Motor veya şanzıman arızası nedeniyle çalışmayan araçlar" },
      { title: "Ağır Hasar", desc: "Onarım değerinde olmayan ağır hasarlı araçlar" },
      { title: "Belgesiz", desc: "Belge sorunları olan hurda araçlar" },
    ],
    conditions: [
      { label: "Motor çalışmıyor" },
      { label: "Kaporta ağır hasarlı" },
      { label: "Belge sorunu" },
      { label: "Ekonomik ömrünü tamamlamış" },
    ],
    faqs: [
      {
        id: "h1",
        question: "Hurda belgesi nasıl alınır?",
        answer:
          "Hurda belgesi Trafik Tescil Müdürlükleri aracılığıyla alınır. Süreç hakkında size yol gösteriyoruz.",
      },
      {
        id: "h2",
        question: "Çalışmayan aracı nasıl teslim ederim?",
        answer:
          "Çekici desteği konusunda yardımcı oluyoruz. Araç yerinden teslim alınıyor.",
      },
      {
        id: "h3",
        question: "Hurda araçlarda fiyat nasıl belirleniyor?",
        answer:
          "Araç ağırlığı, marka, model ve parça değerine göre fiyatlandırma yapılır.",
      },
      {
        id: "h4",
        question: "Hurda araç satışında KDV ödenir mi?",
        answer:
          "Hurda araç satışına ilişkin vergi yükümlülükleri değişkenlik gösterebilir. Güncel bilgi için uzmanımıza danışın.",
      },
    ],
  },

  "motor-arizali-arac-alimi": {
    slug: "motor-arizali-arac-alimi",
    title: "Motor Arızalı Araç Alımı",
    shortTitle: "Motor Arızalı Araç",
    metaDescription:
      "Motor veya şanzıman arızası olan aracınızı alıyoruz. Ücretsiz teklif alın.",
    hero: {
      badge: "Motor Arızalı",
      heading: "Motor Arızalı Aracınızı Satın",
      description:
        "Motor veya şanzıman arızası olan araçlar için adil fiyat sunuyoruz. Onarım masrafına katlanmadan aracınızı satın.",
    },
    problems: [
      { title: "Motor Hasarı", desc: "Motor içi arıza veya hydrolik hasar" },
      { title: "Şanzıman Arızası", desc: "Manuel veya otomatik şanzıman arızası" },
      { title: "Turbo Hasarı", desc: "Turbo kompresör arızası" },
      { title: "Yakıt Sistemi", desc: "Yakıt pompası veya enjektör arızası" },
    ],
    conditions: [
      { label: "Motor çalışmıyor" },
      { label: "Şanzıman bozuk" },
      { label: "Aşırı ısınan motor" },
      { label: "Yağ kaçağı" },
    ],
    faqs: [
      {
        id: "m1",
        question: "Motor arızalı araçları ne kadar değerlendirebilirsiniz?",
        answer:
          "Araç modeli, yılı ve diğer parçaların durumuna göre fiyat belirliyoruz.",
      },
      {
        id: "m2",
        question: "Arıza tespit raporu gerekiyor mu?",
        answer:
          "Hayır, zorunlu değil. Ancak elinizde rapor varsa değerlemeye yardımcı olur.",
      },
      {
        id: "m3",
        question: "Araç hareket etmiyorsa teslim nasıl yapılır?",
        answer:
          "Çekici konusunda yönlendirme yapıyoruz. Araç yerinden alınıyor.",
      },
      {
        id: "m4",
        question: "Motor arızasını onarmak mı yoksa satmak mı mantıklı?",
        answer:
          "Onarım maliyetine göre değişir. Bize bildirin, en mantıklı seçeneği birlikte değerlendirelim.",
      },
    ],
  },

  "cekme-belgeli-arac-alimi": {
    slug: "cekme-belgeli-arac-alimi",
    title: "Çekme Belgeli Araç Alımı",
    shortTitle: "Çekme Belgeli",
    metaDescription:
      "Çekme belgeli aracınızı alıyoruz. Evrak sürecinde destek veriyoruz. Ücretsiz teklif alın.",
    hero: {
      badge: "Çekme Belgeli",
      heading: "Çekme Belgeli Aracınızı Satın",
      description:
        "Çekme kaydı bulunan araçları satın alıyoruz. Tescil ve devir sürecinde ekibimiz size destek sağlar.",
    },
    problems: [
      { title: "Tescil Sorunu", desc: "Tescil belgesi olmayan veya iptal edilmiş araçlar" },
      { title: "Sigorta Pert Kayıtlı", desc: "Sigorta kayıtlarında pert kaydı bulunan araçlar" },
      { title: "Modifiye Edilmiş", desc: "İzinsiz modifikasyon nedeniyle çekme belgeli araçlar" },
      { title: "Ağır Hasar Kayıtlı", desc: "Trafik kaydında ağır hasar notu bulunan araçlar" },
    ],
    conditions: [
      { label: "Çekme belgesi mevcut" },
      { label: "Tescil iptal" },
      { label: "Sigorta pert kaydı" },
      { label: "Ağır hasar kaydı" },
    ],
    faqs: [
      {
        id: "c1",
        question: "Çekme belgeli araç satışı yasal mı?",
        answer:
          "Evet, yasal süreçler çerçevesinde satış yapılabilir. Ekibimiz yasal süreçler hakkında sizi bilgilendirir.",
      },
      {
        id: "c2",
        question: "Çekme belgeli araç için hangi belgeler gerekli?",
        answer:
          "Araç ruhsatı, çekme belgesi ve kimlik belgesi gereklidir. Detaylar için bizi arayın.",
      },
      {
        id: "c3",
        question: "Çekme belgeli araç devri kaç günde tamamlanır?",
        answer:
          "Belgelere bağlı olarak 1-5 iş günü arasında tamamlanabilir.",
      },
      {
        id: "c4",
        question: "Çekme belgeli araçta fiyat nasıl belirlenir?",
        answer:
          "Araç modeli, yaşı ve mevcut hasarına göre piyasa değeri üzerinden teklif sunuyoruz.",
      },
    ],
  },

  "agir-hasarli-arac-alimi": {
    slug: "agir-hasarli-arac-alimi",
    title: "Ağır Hasarlı Araç Alımı",
    shortTitle: "Ağır Hasarlı",
    metaDescription:
      "Ağır hasarlı aracınızı değerinde alıyoruz. Yerinden teslim, hızlı ödeme. Ücretsiz teklif alın.",
    hero: {
      badge: "Ağır Hasarlı",
      heading: "Ağır Hasarlı Aracınızı Satın",
      description:
        "Ciddi kaza hasarı bulunan araçlar için adil teklif sunuyoruz. Hasar derecesine bakılmaksızın değerlendirme yapıyoruz.",
    },
    problems: [
      { title: "Yapısal Hasar", desc: "Şasi veya karoser yapısında ciddi hasar" },
      { title: "Çoklu Hasar", desc: "Birden fazla bölgede eş zamanlı ağır hasar" },
      { title: "Kaporta Hasarı", desc: "Büyük panel ve kaporta hasarları" },
      { title: "Mekanik Hasar", desc: "Motor, şanzıman ve süspansiyon hasarı" },
    ],
    conditions: [
      { label: "Şasi hasarı" },
      { label: "Çoklu panel hasarı" },
      { label: "Tork hasarı" },
      { label: "Araç çalışmıyor" },
    ],
    faqs: [
      {
        id: "a1",
        question: "Ağır hasarın sınırı nedir?",
        answer:
          "Onarım maliyeti araç değerinin yüzde ellisini aşıyorsa ağır hasar olarak kabul edilir. Aracınızı değerlendiriyoruz.",
      },
      {
        id: "a2",
        question: "Sigorta ağır hasar tespit ettirdi. Ne yapmalıyım?",
        answer:
          "Sigorta sürecinizi tamamladıktan sonra bize başvurabilirsiniz. Sizi yönlendiriyoruz.",
      },
      {
        id: "a3",
        question: "Araç hareket edemiyorsa teslim nasıl yapılır?",
        answer:
          "Çekici desteğinde yardımcı oluyoruz. Araç bulunduğu yerden teslim alınıyor.",
      },
      {
        id: "a4",
        question: "Ağır hasarlı araç için gerçekçi teklif alabilir miyim?",
        answer:
          "Evet. Araç modeli ve parça değerine göre adil teklif sunuyoruz.",
      },
    ],
  },
};

export const ALL_SERVICE_SLUGS = Object.keys(SERVICES);
