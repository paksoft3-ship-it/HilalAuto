const GRADES = [
  {
    grade: "A",
    topBorder: "#27AE60",
    letterColor: "#27AE60",
    title: "Çok az hasar",
    desc: "Kozmetik hasar, kolayca onarılır",
  },
  {
    grade: "B",
    topBorder: "#E67E22",
    letterColor: "#E67E22",
    title: "Orta hasar",
    desc: "Tamirli veya onarılabilir hasar",
  },
  {
    grade: "C",
    topBorder: "#C0392B",
    letterColor: "#C0392B",
    title: "Ağır hasar",
    desc: "Pert belgeli veya ciddi hasar",
  },
  {
    grade: "D",
    topBorder: "#94A3B8",
    letterColor: "#94A3B8",
    title: "Çok ağır hasar",
    desc: "Büyük onarım gerektirir",
  },
  {
    grade: "E",
    topBorder: "#CBD5E1",
    letterColor: "#CBD5E1",
    title: "Hurda",
    desc: "Parça veya hurda amaçlı",
  },
] as const;

export function GradeExplainer() {
  return (
    <section aria-label="Otograde sistemi" className="bg-white py-40 md:py-48">
      <div className="mx-auto max-w-[1180px] px-16 md:px-32">
        {/* Header */}
        <div className="mb-28 max-w-[560px]">
          <h2 className="text-[20px] md:text-[24px] font-medium mb-8" style={{ color: "#0D0D0D" }}>
            Otograde Sistemi — Şeffaf Değerleme
          </h2>
          <p className="text-[14px] leading-relaxed" style={{ color: "#64748B" }}>
            Her araç bağımsız olarak değerlendirilir ve A&apos;dan E&apos;ye grade verilir
          </p>
        </div>

        {/* Grade cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          {GRADES.map(({ grade, topBorder, letterColor, title, desc }) => (
            <div
              key={grade}
              className="bg-white rounded-[12px] overflow-hidden pt-0"
              style={{ border: "1px solid #E5E5E5" }}
            >
              {/* Colored top border */}
              <div className="h-[3px] w-full" style={{ background: topBorder }} />
              <div className="p-16 flex flex-col gap-6">
                <span
                  className="text-[28px] font-bold leading-none"
                  style={{ color: letterColor }}
                  aria-hidden
                >
                  {grade}
                </span>
                <h3 className="text-[13px] font-medium" style={{ color: "#0D0D0D" }}>{title}</h3>
                <p className="text-[11px] leading-snug" style={{ color: "#64748B" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
