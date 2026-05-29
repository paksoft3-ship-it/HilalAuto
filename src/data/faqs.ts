export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const SITE_FAQ_ITEMS: FAQItem[] = [
  {
    id: "f1",
    question: "Aracımı ne kadar sürede satabilirim?",
    answer:
      "Oto Grade ile aracınızı satmak oldukça hızlıdır. Formu doldurduktan sonra 1 saat içinde teklifimizi iletiriz. Kabul etmeniz durumunda 24 saat içinde satışı tamamlarız.",
  },
  {
    id: "f2",
    question: "Ödemeyi ne zaman ve nasıl alırım?",
    answer:
      "Araç teslimi ve devir işlemleri tamamlandıktan hemen sonra ödemeniz gerçekleştirilir. Ödeme yöntemi anlaşma aşamasında netleştirilir.",
  },
  {
    id: "f3",
    question: "Aracı bulunduğum yerden alıyor musunuz?",
    answer:
      "Evet. Türkiye'nin her noktasından aracınızı kapınızdan teslim alıyoruz. Sizi zor durumda bırakmıyoruz.",
  },
  {
    id: "f4",
    question: "Hangi tür hasarlı araçları alıyorsunuz?",
    answer:
      "Kazalı, pert, yanmış, sel hasarlı, hurda, motor arızalı, çekme belgeli ve ağır hasarlı araçları alıyoruz. Aracınızın durumu ne olursa olsun teklif veririz.",
  },
  {
    id: "f5",
    question: "Noter ve evrak işlemleri nasıl yürüyor?",
    answer:
      "Evrak ve noter sürecinde ekibimiz sizi adım adım yönlendirir. Tüm işlemler şeffaf biçimde yürütülür.",
  },
  {
    id: "f6",
    question: "Teklif almak ücretli mi?",
    answer:
      "Hayır. Teklif almak tamamen ücretsizdir ve bağlayıcı değildir. İstediğiniz zaman vazgeçebilirsiniz.",
  },
  {
    id: "f7",
    question: "Vekalet ile araç satışı yapabilir miyim?",
    answer:
      "Evet. Vekaletname ile işlemler yapılabilir. Detaylı bilgi için WhatsApp veya telefon üzerinden bizimle iletişime geçebilirsiniz.",
  },
  {
    id: "f8",
    question: "Teklif bağlayıcı mı?",
    answer:
      "Hayır. Verilen teklifler bağlayıcı değildir. Araç sahibi istediği zaman vazgeçebilir.",
  },
];
