import { Link } from "@/i18n/routing";

export function FinalCTABand() {
  return (
    <section className="py-16 md:py-24 bg-white" aria-label="Son çağrı">
      <div className="max-w-[1180px] mx-auto px-16 md:px-32">
        <div className="bg-[#FFF2EF] border-[0.5px] border-[#FFCDC4] rounded-2xl p-32 md:p-60 text-center">
          <h2 className="text-[32px] font-medium text-[#111111] tracking-[-1.5px]">
            Hasarlı aracınızın değerini bugün öğrenin.
          </h2>
          <p className="text-[16px] text-[#555555] mt-16 max-w-[600px] mx-auto">
            İster pazaryerimizde ilan verin, ister kurumsal yapımızla anında nakit teklif alın.
          </p>
          <div className="mt-44 flex flex-col md:flex-row items-center justify-center gap-16">
            <Link
              href="/bayi-ol"
              className="w-full md:w-auto bg-primary text-white px-44 py-16 rounded-lg font-medium text-[14px] hover:opacity-90 transition-opacity text-center"
            >
              Hemen Araç Sat
            </Link>
            <Link
              href="/bayi-ol"
              className="w-full md:w-auto bg-white border-[0.5px] border-[#EEEEEE] text-[#111111] px-44 py-16 rounded-lg font-medium text-[14px] hover:bg-gray-50 transition-colors text-center"
            >
              Kurumsal Bayi Ol
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
