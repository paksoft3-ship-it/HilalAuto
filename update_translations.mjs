import fs from 'fs';
import path from 'path';

const trPath = path.resolve('src/messages/tr.json');
const enPath = path.resolve('src/messages/en.json');

const tr = JSON.parse(fs.readFileSync(trPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const newTr = {
  ...tr,
  howItWorks: {
    ...tr.howItWorks,
    step1Time: "~2 dakika",
    step2Time: "1 saat içinde",
    step3Time: "24 saat içinde",
    badge: "Süreç",
    ctaText: "Aracınız için ücretsiz ve bağlayıcı olmayan teklif alın.",
    ctaButton: "Hemen Teklif Al"
  },
  faq: {
    ...tr.faq,
    badge: "SIK SORULAN SORULAR",
    subtitle: "Aracınızı satmadan önce süreç, ödeme ve evrak adımları hakkında en çok sorulan soruları burada bulabilirsiniz.",
    contactTitle: "Cevabınızı bulamadınız mı?",
    contactDesc: "WhatsApp üzerinden bize yazın, aracınızın durumu hakkında hızlıca bilgi verelim.",
    whatsapp: "WhatsApp ile Yaz"
  },
  vehicleTypes: {
    ...tr.vehicleTypes,
    type1Label: "Kazalı Araç",
    type1Desc: "Trafik kazası sonucu hasarlanmış araçlar",
    type2Label: "Pert Araç",
    type2Desc: "Sigorta tarafından pert ilan edilmiş araçlar",
    type3Label: "Yanmış Araç",
    type3Desc: "Yangın hasarı görmüş araçlar",
    type4Label: "Sel Hasarlı Araç",
    type4Desc: "Su baskını veya sel nedeniyle zarar gören araçlar",
    type5Label: "Hurda Araç",
    type5Desc: "Ekonomik değerini yitirmiş araçlar",
    type6Label: "Motor Arızalı Araç",
    type6Desc: "Motor veya şanzıman arızası olan araçlar",
    type7Label: "Çekme Belgeli Araç",
    type7Desc: "Çekme kaydı bulunan araçlar",
    type8Label: "Ağır Hasarlı Araç",
    type8Desc: "Ciddi kaza hasarı bulunan araçlar",
    details: "Detaylı Bilgi",
    title: "Aldığımız araç türleri",
    badge: "Araç Türleri",
    subtitle: "Her türlü hasarlı aracı değerinde alıyoruz. Aracınızın durumu ne olursa olsun teklif veririz."
  },
  cta: {
    ...tr.cta,
    badge: "Hemen Başlayın",
    whatsappMessage: "Merhaba, hasarlı aracım için teklif almak istiyorum.",
    note: "Teklif almak ücretsiz ve bağlayıcı değildir.",
    title: "Aracınız İçin Teklif Almaya Hazır mısınız?",
    subtitle: "Ücretsiz teklif alın, bağlayıcı değil. Uzman ekibimiz kısa sürede size dönüş yapar.",
    button: "Ücretsiz Teklif Al"
  },
  socialProof: {
    ...tr.socialProof,
    vehicle1: "Kazalı Araç",
    text1: "Aracım kaza geçirmişti ve ne yapacağımı bilmiyordum. Oto Grade ekibi çok hızlı dönüş yaptı, aracımı yerinden aldılar. Süreç çok rahat geçti.",
    vehicle2: "Pert Araç",
    text2: "Sigorta pert ilan etmişti, aracı ne yapacağımı bilemiyordum. Oto Grade ile çok basit oldu, teklif aldım ve evrak sürecinde destek sağlandı.",
    vehicle3: "Sel Hasarlı Araç",
    text3: "Sel basan aracımı satmak için birçok yeri aradım ama en hızlı ve güvenilir cevap Oto Grade'dan geldi. Tavsiye ederim.",
    badge: "Referanslar"
  },
  trustBar: {
    ...tr.trustBar,
    item1Desc: "Aracınızı kapınızdan teslim alıyoruz.",
    item2Desc: "1 saat içinde teklifinizi iletiyoruz.",
    item3Desc: "Tüm belgelerde yanınızdayız.",
    item4Desc: "WhatsApp ve telefon ile yanınızdayız."
  },
  form: {
    ...tr.form,
    errorEmpty: "Lütfen tüm alanları doldurun.",
    errorGeneric: "Bir hata oluştu.",
    whatsappMessage: "Merhaba, {brand} ({year}) aracım için teklif almak istiyorum. Hasar: {damage}, Şehir: {city}. Telefonum: {phone}",
    ariaLabel: "Hızlı teklif formu",
    loading: "İşleniyor..."
  },
  whyChooseUs: {
    ...tr.whyChooseUs,
    badge: "NEDEN OTO GRADE?",
    title: "Hasarlı araç satışını hızlı, güvenli ve zahmetsiz hale getiriyoruz.",
    subtitle: "Aracınız kazalı, pert, yanmış, sel hasarlı veya motor arızalı olabilir. Oto Grade, süreci sizin için sadeleştirir: hızlı değerlendirme, yerinden alım, evrak desteği ve güvenli ödeme.",
    ctaQuote: "Hemen Teklif Al",
    ctaWhatsapp: "WhatsApp ile Yaz",
    note: "Ücretsiz değerlendirme • Bağlayıcı değil • Türkiye geneli hizmet",
    stat1: "araç değerlendirildi",
    stat2Title: "24 saat içinde",
    stat2: "tüm süreç tamamlanır",
    stat3Title: "Türkiye Geneli",
    stat3: "her noktadan alım"
  },
  seo: {
    homeTitle: "Hasarlı Araç Alanlar | Kazalı, Pert, Hurda Araç Alımı — Oto Grade",
    homeDescription: "Türkiye genelinde kazalı, pert, yanmış, sel hasarlı ve hurda araç alım hizmeti. Ücretsiz teklif, yerinden teslim.",
    priceRange: "Ücretsiz Teklif",
    websiteDescription: "Türkiye genelinde hasarlı araç alım hizmeti"
  }
};

const newEn = {
  ...en,
  howItWorks: {
    ...en.howItWorks,
    step1Time: "~2 minutes",
    step2Time: "within 1 hour",
    step3Time: "within 24 hours",
    badge: "Process",
    ctaText: "Get a free and non-binding quote for your vehicle.",
    ctaButton: "Get a Quote Now"
  },
  faq: {
    ...en.faq,
    badge: "FREQUENTLY ASKED QUESTIONS",
    subtitle: "Find the most asked questions about the process, payment and paperwork before selling your vehicle here.",
    contactTitle: "Couldn't find your answer?",
    contactDesc: "Message us on WhatsApp, we will inform you quickly about your vehicle's condition.",
    whatsapp: "Message on WhatsApp"
  },
  vehicleTypes: {
    ...en.vehicleTypes,
    type1Label: "Accident Damaged",
    type1Desc: "Vehicles damaged as a result of a traffic accident",
    type2Label: "Written Off",
    type2Desc: "Vehicles declared a total loss by insurance",
    type3Label: "Fire Damaged",
    type3Desc: "Vehicles that have suffered fire damage",
    type4Label: "Flood Damaged",
    type4Desc: "Vehicles damaged by flooding",
    type5Label: "Scrap",
    type5Desc: "Vehicles that have lost their economic value",
    type6Label: "Engine Failure",
    type6Desc: "Vehicles with engine or transmission failure",
    type7Label: "Tow Certificate",
    type7Desc: "Vehicles with a tow certificate record",
    type8Label: "Heavily Damaged",
    type8Desc: "Vehicles with serious accident damage",
    details: "Details",
    title: "What Vehicles Do We Buy?",
    badge: "Vehicle Types",
    subtitle: "We buy all types of damaged vehicles at their fair value. Whatever the condition of your vehicle, we will make an offer."
  },
  cta: {
    ...en.cta,
    badge: "Start Now",
    whatsappMessage: "Hello, I would like to get a quote for my damaged vehicle.",
    note: "Getting a quote is free and non-binding.",
    title: "Ready to Get a Quote for Your Vehicle?",
    subtitle: "Get a free quote, non-binding. Our expert team will get back to you shortly.",
    button: "Get a Free Quote"
  },
  socialProof: {
    ...en.socialProof,
    vehicle1: "Accident Damaged",
    text1: "My car was in an accident and I didn't know what to do. The Oto Grade team responded very quickly and picked up my car from my location. The process was very smooth.",
    vehicle2: "Written Off",
    text2: "The insurance declared it a total loss, I didn't know what to do with the car. It was very simple with Oto Grade, I got an offer and they provided support with the paperwork.",
    vehicle3: "Flood Damaged",
    text3: "I called many places to sell my flooded vehicle, but the fastest and most reliable answer came from Oto Grade. I recommend them.",
    badge: "Testimonials"
  },
  trustBar: {
    ...en.trustBar,
    item1Desc: "We pick up your vehicle from your door.",
    item2Desc: "We provide your quote within 1 hour.",
    item3Desc: "We assist you with all documents.",
    item4Desc: "We support you via WhatsApp and phone."
  },
  form: {
    ...en.form,
    errorEmpty: "Please fill in all fields.",
    errorGeneric: "An error occurred.",
    whatsappMessage: "Hello, I would like to get a quote for my {brand} ({year}). Damage: {damage}, City: {city}. My phone: {phone}",
    ariaLabel: "Quick quote form",
    loading: "Processing..."
  },
  whyChooseUs: {
    ...en.whyChooseUs,
    badge: "WHY OTO GRADE?",
    title: "We make selling damaged vehicles fast, safe and effortless.",
    subtitle: "Your vehicle may be accident-damaged, written-off, burnt, flood-damaged, or have engine failure. Oto Grade simplifies the process for you: quick evaluation, doorstep pickup, paperwork support, and secure payment.",
    ctaQuote: "Get a Quote Now",
    ctaWhatsapp: "Message on WhatsApp",
    note: "Free evaluation • Non-binding • Nationwide service",
    stat1: "vehicles evaluated",
    stat2Title: "within 24 hours",
    stat2: "entire process is completed",
    stat3Title: "Nationwide",
    stat3: "pickup from any location"
  },
  seo: {
    homeTitle: "We Buy Damaged Vehicles | Accident, Written-Off, Scrap Vehicle Purchase — Oto Grade",
    homeDescription: "Nationwide service for buying accident-damaged, written-off, burnt, flood-damaged and scrap vehicles. Free quote, doorstep pickup.",
    priceRange: "Free Quote",
    websiteDescription: "Nationwide damaged vehicle purchasing service"
  }
};

fs.writeFileSync(trPath, JSON.stringify(newTr, null, 2));
fs.writeFileSync(enPath, JSON.stringify(newEn, null, 2));

console.log("Translations successfully updated.");
