const BUYER_STEPS = [
  { n: 1, text: "Grade ve filtrelerle arama yap" },
  { n: 2, text: "İlan detayını incele, fotoğraflara bak" },
  { n: 3, text: "WhatsApp veya mesajla bayiyle iletişim kur" },
];

const SELLER_STEPS = [
  { n: 1, text: "Bayi hesabı oluştur, onay al" },
  { n: 2, text: "Aracı grade'le ve ilan oluştur" },
  { n: 3, text: "Alıcılardan gelen mesajları değerlendir" },
];

export function MarketplaceHowItWorks() {
  return (
    <section aria-label="Nasıl çalışır" className="py-40 md:py-48" style={{ background: "#F8F8F8" }}>
      <div className="mx-auto max-w-[1180px] px-16 md:px-32">
        <h2 className="text-[20px] md:text-[24px] font-medium mb-24" style={{ color: "#0D0D0D" }}>
          Nasıl Çalışır?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Buyers */}
          <div className="bg-white rounded-[14px] p-24" style={{ border: "1px solid #E5E5E5" }}>
            <div
              className="inline-flex items-center px-12 py-5 rounded-full text-[11px] font-medium mb-16"
              style={{ background: "#EFF6FF", color: "#3B82F6", border: "1px solid #BFDBFE" }}
            >
              Alıcılar için
            </div>
            <h3 className="text-[16px] font-medium mb-20" style={{ color: "#0D0D0D" }}>
              Hasarlı araç bulmak bu kadar kolay
            </h3>
            <div className="flex flex-col gap-14">
              {BUYER_STEPS.map(({ n, text }) => (
                <div key={n} className="flex items-start gap-12">
                  <span
                    className="flex items-center justify-center w-[26px] h-[26px] rounded-full text-white text-[12px] font-bold shrink-0 mt-[1px]"
                    style={{ background: "#C0392B" }}
                  >
                    {n}
                  </span>
                  <span className="text-[13px] leading-relaxed" style={{ color: "#0D0D0D" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dealers */}
          <div className="bg-white rounded-[14px] p-24" style={{ border: "1px solid #E5E5E5" }}>
            <div
              className="inline-flex items-center px-12 py-5 rounded-full text-[11px] font-medium mb-16"
              style={{ background: "#FFF5F5", color: "#C0392B", border: "1px solid #FECACA" }}
            >
              Bayiler için
            </div>
            <h3 className="text-[16px] font-medium mb-20" style={{ color: "#0D0D0D" }}>
              İlanlarını yayınla, müşteriye ulaş
            </h3>
            <div className="flex flex-col gap-14">
              {SELLER_STEPS.map(({ n, text }) => (
                <div key={n} className="flex items-start gap-12">
                  <span
                    className="flex items-center justify-center w-[26px] h-[26px] rounded-full text-white text-[12px] font-bold shrink-0 mt-[1px]"
                    style={{ background: "#C0392B" }}
                  >
                    {n}
                  </span>
                  <span className="text-[13px] leading-relaxed" style={{ color: "#0D0D0D" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
