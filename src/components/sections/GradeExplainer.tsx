import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { GRADE_COLORS } from "@/lib/grades";
import { GRADE_DESCRIPTIONS } from "@/types/marketplace";

// Titles matching the same A–E meaning shown on every listing page
// (types/marketplace.ts GRADE_COLORS labels / messages "grade" namespace) —
// this section used to run its own, differently-shifted definition (its
// "A" was the live site's "B", its "D" called Grade D "Pert Kayıtlı" when
// the real pert/total-loss end of the scale is E). One meaning per letter,
// documented in full at /grade-sistemi.
const GRADES = [
  { grade: "A" as const, title: "Çok Az Hasar", desc: GRADE_DESCRIPTIONS.A },
  { grade: "B" as const, title: "Az Hasar", desc: GRADE_DESCRIPTIONS.B },
  { grade: "C" as const, title: "Orta Hasar", desc: GRADE_DESCRIPTIONS.C },
  { grade: "D" as const, title: "Ağır Hasar", desc: GRADE_DESCRIPTIONS.D },
  { grade: "E" as const, title: "Çok Ağır Hasar", desc: GRADE_DESCRIPTIONS.E },
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

        <div className="flex justify-center mt-32">
          <Link
            href={"/grade-sistemi" as never}
            className="inline-flex items-center gap-6 text-primary text-[13px] font-medium hover:opacity-80"
          >
            Grade sistemi hakkında detaylı bilgi
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
