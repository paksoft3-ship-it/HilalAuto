import { GRADE_COLORS } from "@/lib/grades";

const GRADES = [
  {
    grade: "A" as const,
    title: "Hafif Hasar",
    desc: "Düşük onarım maliyetli, yürür aksamı sağlam, minimal kaporta işlemli araçlar.",
  },
  {
    grade: "B" as const,
    title: "Orta Hasar",
    desc: "Kaporta ve mekanik onarım gerektiren, parça değişimi olan standart kazalılar.",
  },
  {
    grade: "C" as const,
    title: "Ağır Hasar",
    desc: "Şasi veya hava yastığı işlemi görmüş, yüksek onarım maliyetli ağır hasarlı araçlar.",
  },
  {
    grade: "D" as const,
    title: "Pert Kayıtlı",
    desc: "Sigorta şirketi tarafından pert kararı verilmiş, onarımı ekonomik olmayan araçlar.",
  },
  {
    grade: "E" as const,
    title: "Hurda / Yedek",
    desc: "Sadece yedek parça olarak değerlendirilebilir, trafiğe çıkması uygun olmayan araçlar.",
  },
] as const;

export function GradeExplainer() {
  return (
    <section className="bg-white py-60" aria-label="Grade sistemi">
      <div className="max-w-[1240px] mx-auto px-16 md:px-24">
        <div className="text-center mb-44">
          <span className="text-[11px] font-medium text-primary uppercase tracking-wider">
            ŞEFFAF DEĞERLEME
          </span>
          <h2 className="text-[32px] font-medium text-[#111111] tracking-[-1.5px] mt-8">
            Otograde Grade Sistemi Nedir?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-16">
          {GRADES.map(({ grade, title, desc }) => {
            const color = GRADE_COLORS[grade];
            return (
              <div
                key={grade}
                className="bg-white p-24 rounded-lg border-[0.5px] border-[#EEEEEE]"
                style={{ borderTop: `4px solid ${color}` }}
              >
                <div className="text-[32px] font-medium mb-8" style={{ color }}>
                  {grade}
                </div>
                <h4 className="text-[14px] font-medium text-[#111111] mb-8">{title}</h4>
                <p className="text-[11px] text-[#888888] leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
