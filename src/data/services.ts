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

export const SERVICES_TR: Record<string, ServiceData> = {
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

export const ALL_SERVICE_SLUGS = Object.keys(SERVICES_TR);
export const getServices = (locale: string) => locale === "en" ? SERVICES_EN : SERVICES_TR;


export const SERVICES_EN: Record<string, ServiceData> = {
  "kazali-arac-alimi": {
    slug: "kazali-arac-alimi",
    title: "Accident Damaged Vehicle Purchasing",
    shortTitle: "Accident Damaged",
    metaDescription: "We pick up your accident-damaged vehicle from its location. Get a free quote, our expert team will get back to you quickly.",
    hero: {
      badge: "Accident Damaged",
      heading: "Get a Quick Quote for Your Accident Damaged Vehicle",
      description: "Get a free and non-binding quote for your vehicle involved in a traffic accident. We pick up the vehicle from its location and provide support with paperwork.",
    },
    problems: [
      { title: "Front Damage", desc: "Vehicles with damaged bumper, hood, or radiator" },
      { title: "Side Damage", desc: "Vehicles with damaged door, fender, or sill" },
      { title: "Rear Damage", desc: "Vehicles with damaged trunk lid or rear bumper" },
      { title: "Total Damage", desc: "Vehicles with serious damage in multiple areas" },
    ],
    conditions: [
      { label: "Front bumper damage" },
      { label: "Engine compartment damage" },
      { label: "Bodywork damage" },
      { label: "Glass damage" },
      { label: "Interior damage" },
      { label: "Mechanical damage" },
    ],
    faqs: [
      { id: "k1", question: "Do you also buy heavily damaged vehicles?", answer: "Yes. We evaluate accident-damaged vehicles regardless of the severity of the damage." },
      { id: "k2", question: "How many days does it take to get a quote for an accident-damaged vehicle?", answer: "We get back to you within 1 hour after your application." },
      { id: "k3", question: "Is a tow truck needed?", answer: "We provide guidance on tow trucks if necessary. We plan the delivery process together." },
      { id: "k4", question: "Do you buy vehicles with an open insurance file?", answer: "Yes. We also evaluate vehicles with open insurance files. We inform you about the process." },
    ],
  },
  "pert-arac-alimi": {
    slug: "pert-arac-alimi",
    title: "Written-Off Vehicle Purchasing",
    shortTitle: "Written-Off",
    metaDescription: "We buy your vehicle declared a total loss by insurance. Get a free quote.",
    hero: {
      badge: "Written-Off",
      heading: "Sell Your Written-Off Vehicle",
      description: "We provide fair valuation for your vehicle declared a total loss by the insurance company. Our team is with you during the paperwork process.",
    },
    problems: [
      { title: "Insurance Total Loss", desc: "Vehicles declared a total loss by insurance" },
      { title: "Heavy Damage", desc: "Vehicles where the repair cost exceeds the vehicle value" },
      { title: "Tow Certificate", desc: "Written-off vehicles with a tow certificate" },
      { title: "Damage Recorded", desc: "Vehicles with a damage record in registration documents" },
    ],
    conditions: [
      { label: "Insurance total loss record" },
      { label: "Heavy structural damage" },
      { label: "High repair cost" },
      { label: "With tow certificate" },
    ],
    faqs: [
      { id: "p1", question: "How do I prepare the written-off vehicle documents?", answer: "Just prepare the insurance total loss document, vehicle registration, and your ID. We guide you through the rest of the process." },
      { id: "p2", question: "Can I get a realistic quote for a written-off vehicle?", answer: "Yes. We offer a fair quote based on market conditions. Our offer is non-binding." },
      { id: "p3", question: "How does the process work with the insurance company?", answer: "The transfer process begins after the total loss procedures are completed. Our team will guide you through this process." },
      { id: "p4", question: "Do you assess the damage on the written-off vehicle?", answer: "We do a preliminary valuation based on photos. A physical inspection is carried out at the delivery stage." },
    ],
  },
  "yanmis-arac-alimi": {
    slug: "yanmis-arac-alimi",
    title: "Fire Damaged Vehicle Purchasing",
    shortTitle: "Fire Damaged",
    metaDescription: "We buy your fire-damaged vehicle at a fair price. Get a free quote.",
    hero: {
      badge: "Fire Damaged",
      heading: "Sell Your Fire Damaged Vehicle at Fair Value",
      description: "We offer a fair quote for vehicles that have suffered fire damage. We evaluate regardless of the vehicle condition.",
    },
    problems: [
      { title: "Partial Fire", desc: "Fire damage in the engine or trunk area" },
      { title: "Total Fire", desc: "Fire damage throughout the vehicle" },
      { title: "Electrical Fire", desc: "Fire caused by an electrical fault" },
      { title: "External Source", desc: "Fire damage caused by an external factor" },
    ],
    conditions: [
      { label: "Partially burnt" },
      { label: "Completely burnt" },
      { label: "Plastic and interior burnt" },
      { label: "Engine burnt" },
    ],
    faqs: [
      { id: "y1", question: "Do you buy completely burnt vehicles?", answer: "Yes. We evaluate regardless of the extent of the vehicle damage." },
      { id: "y2", question: "I received insurance compensation for the burnt vehicle. Can I sell the vehicle?", answer: "You can sell it after completing the insurance process. Call us for details." },
      { id: "y3", question: "How is delivery made if the vehicle cannot move?", answer: "We help with tow truck arrangements. We plan the delivery logistics together." },
      { id: "y4", question: "How much is a burnt vehicle worth?", answer: "It varies depending on the vehicle model, year, and damage condition. Fill out the form for a free valuation." },
    ],
  },
  "sel-hasarli-arac-alimi": {
    slug: "sel-hasarli-arac-alimi",
    title: "Flood Damaged Vehicle Purchasing",
    shortTitle: "Flood Damaged",
    metaDescription: "We buy your flood or water-damaged vehicle at a fair price. Get a free quote.",
    hero: {
      badge: "Flood Damaged",
      heading: "Sell Your Flood Damaged Vehicle",
      description: "We provide a fair valuation for vehicles damaged by flood or water. We pick up your vehicle from its location.",
    },
    problems: [
      { title: "Engine Flooded", desc: "Vehicles with water inside the engine compartment" },
      { title: "Interior Wet", desc: "Water entered the cabin, upholstery and electronics damaged" },
      { title: "Electrical Fault", desc: "Electrical system failure caused by flood water" },
      { title: "Rust and Odor", desc: "Vehicles with rust and musty odor after water damage" },
    ],
    conditions: [
      { label: "Engine flood damage" },
      { label: "Electronic damage" },
      { label: "Upholstery damage" },
      { label: "Rust and damp" },
    ],
    faqs: [
      { id: "s1", question: "Should I wait for insurance compensation for a flood-damaged vehicle?", answer: "You can sell without waiting for the insurance process. We evaluate your compensation situation and offer the best option." },
      { id: "s2", question: "Do you really buy flooded vehicles?", answer: "Yes. We regularly buy flood-damaged vehicles. We evaluate the vehicle condition based on photos." },
      { id: "s3", question: "What should I do if the vehicle is not running?", answer: "We also pick up non-running vehicles. We plan the delivery together." },
      { id: "s4", question: "How is the value of a flood-damaged vehicle determined?", answer: "We value it based on the vehicle age, model, engine condition, and extent of damage." },
    ],
  },
  "hurda-arac-alimi": {
    slug: "hurda-arac-alimi",
    title: "Scrap Vehicle Purchasing",
    shortTitle: "Scrap Vehicle",
    metaDescription: "We buy your scrap vehicle at a fair price. We support you with document processes. Get a free quote.",
    hero: {
      badge: "Scrap Vehicle",
      heading: "Get a Quote for Your Scrap Vehicle",
      description: "We buy vehicles that have completed their economic life. Our team will help you with the scrap certificate process.",
    },
    problems: [
      { title: "Old Model", desc: "Old model vehicles that have lost their economic value" },
      { title: "Not Running", desc: "Vehicles not running due to engine or transmission failure" },
      { title: "Heavy Damage", desc: "Heavily damaged vehicles that are not worth repairing" },
      { title: "Undocumented", desc: "Scrap vehicles with documentation issues" },
    ],
    conditions: [
      { label: "Engine not running" },
      { label: "Bodywork heavily damaged" },
      { label: "Document issue" },
      { label: "Completed economic life" },
    ],
    faqs: [
      { id: "h1", question: "How to get a scrap certificate?", answer: "A scrap certificate is obtained through the Traffic Registration Directorates. We guide you through the process." },
      { id: "h2", question: "How do I deliver a non-running vehicle?", answer: "We help with tow truck support. The vehicle is picked up from its location." },
      { id: "h3", question: "How is the price determined for scrap vehicles?", answer: "Pricing is based on vehicle weight, make, model, and parts value." },
      { id: "h4", question: "Is VAT paid on scrap vehicle sales?", answer: "Tax obligations regarding scrap vehicle sales may vary. Consult our expert for up-to-date information." },
    ],
  },
  "motor-arizali-arac-alimi": {
    slug: "motor-arizali-arac-alimi",
    title: "Engine Failure Vehicle Purchasing",
    shortTitle: "Engine Failure",
    metaDescription: "We buy your vehicle with an engine or transmission failure. Get a free quote.",
    hero: {
      badge: "Engine Failure",
      heading: "Sell Your Engine Failure Vehicle",
      description: "We offer a fair price for vehicles with engine or transmission failure. Sell your vehicle without bearing repair costs.",
    },
    problems: [
      { title: "Engine Damage", desc: "Internal engine fault or hydraulic damage" },
      { title: "Transmission Failure", desc: "Manual or automatic transmission failure" },
      { title: "Turbo Damage", desc: "Turbo compressor failure" },
      { title: "Fuel System", desc: "Fuel pump or injector failure" },
    ],
    conditions: [
      { label: "Engine not running" },
      { label: "Transmission broken" },
      { label: "Overheating engine" },
      { label: "Oil leak" },
    ],
    faqs: [
      { id: "m1", question: "How much can you value vehicles with engine failure?", answer: "We determine the price based on the vehicle model, year, and the condition of other parts." },
      { id: "m2", question: "Is a fault detection report required?", answer: "No, it's not mandatory. But if you have a report, it helps with the valuation." },
      { id: "m3", question: "How is delivery made if the vehicle doesn't move?", answer: "We provide guidance on tow trucks. The vehicle is picked up from its location." },
      { id: "m4", question: "Is it more logical to repair or sell the engine failure?", answer: "It depends on the repair cost. Let us know, we'll evaluate the most logical option together." },
    ],
  },
  "cekme-belgeli-arac-alimi": {
    slug: "cekme-belgeli-arac-alimi",
    title: "Tow Certificate Vehicle Purchasing",
    shortTitle: "Tow Certificate",
    metaDescription: "We buy your tow-certified vehicle. We support you during the paperwork process. Get a free quote.",
    hero: {
      badge: "Tow Certificate",
      heading: "Sell Your Tow Certificate Vehicle",
      description: "We buy vehicles with a tow record. Our team supports you during the registration and transfer process.",
    },
    problems: [
      { title: "Registration Issue", desc: "Vehicles with no or canceled registration certificate" },
      { title: "Insurance Total Loss", desc: "Vehicles with a total loss record in insurance records" },
      { title: "Modified", desc: "Vehicles with a tow certificate due to unauthorized modification" },
      { title: "Heavy Damage Record", desc: "Vehicles with a heavy damage note in the traffic record" },
    ],
    conditions: [
      { label: "Tow certificate available" },
      { label: "Registration canceled" },
      { label: "Insurance total loss record" },
      { label: "Heavy damage record" },
    ],
    faqs: [
      { id: "c1", question: "Is it legal to sell a vehicle with a tow certificate?", answer: "Yes, it can be sold within the framework of legal processes. Our team informs you about legal processes." },
      { id: "c2", question: "What documents are needed for a tow-certified vehicle?", answer: "Vehicle registration, tow certificate, and identity document are required. Call us for details." },
      { id: "c3", question: "How many days does it take to transfer a tow-certified vehicle?", answer: "It can be completed between 1-5 business days depending on the documents." },
      { id: "c4", question: "How is the price determined for a tow-certified vehicle?", answer: "We offer a quote based on the market value according to the vehicle model, age, and current damage." },
    ],
  },
  "agir-hasarli-arac-alimi": {
    slug: "agir-hasarli-arac-alimi",
    title: "Heavily Damaged Vehicle Purchasing",
    shortTitle: "Heavily Damaged",
    metaDescription: "We buy your heavily damaged vehicle at a fair price. Doorstep pickup, fast payment. Get a free quote.",
    hero: {
      badge: "Heavily Damaged",
      heading: "Sell Your Heavily Damaged Vehicle",
      description: "We offer fair quotes for vehicles with severe accident damage. We evaluate regardless of the degree of damage.",
    },
    problems: [
      { title: "Structural Damage", desc: "Serious damage to the chassis or body structure" },
      { title: "Multiple Damage", desc: "Simultaneous heavy damage in multiple areas" },
      { title: "Bodywork Damage", desc: "Major panel and bodywork damage" },
      { title: "Mechanical Damage", desc: "Engine, transmission, and suspension damage" },
    ],
    conditions: [
      { label: "Chassis damage" },
      { label: "Multi-panel damage" },
      { label: "Torque damage" },
      { label: "Vehicle not running" },
    ],
    faqs: [
      { id: "a1", question: "What is the limit for heavy damage?", answer: "If the repair cost exceeds fifty percent of the vehicle value, it is considered heavy damage. We evaluate your vehicle." },
      { id: "a2", question: "Insurance determined heavy damage. What should I do?", answer: "After completing your insurance process, you can apply to us. We will guide you." },
      { id: "a3", question: "How is delivery made if the vehicle cannot move?", answer: "We help with tow truck support. The vehicle is picked up from its location." },
      { id: "a4", question: "Can I get a realistic quote for a heavily damaged vehicle?", answer: "Yes. We offer a fair quote based on the vehicle model and parts value." },
    ],
  },
};
