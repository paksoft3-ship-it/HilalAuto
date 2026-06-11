import { Link } from "@/i18n/routing";
import { ArrowRight, Zap, Car, Flame, Waves, RefreshCw, Wrench, FileText, AlertTriangle } from "lucide-react";

const SERVICES = [
  { name: "Kazalı",        icon: Zap,          slug: "kazali" },
  { name: "Pert",          icon: Car,          slug: "pert" },
  { name: "Yanmış",        icon: Flame,        slug: "yanmis" },
  { name: "Sel Hasarlı",   icon: Waves,        slug: "sel" },
  { name: "Hurda",         icon: RefreshCw,    slug: "hurda" },
  { name: "Motor Arızalı", icon: Wrench,       slug: "motor" },
  { name: "Çekme Belgeli", icon: FileText,     slug: "cekme" },
  { name: "Ağır Hasarlı",  icon: AlertTriangle, slug: "agir" },
] as const;

export function ServiceCategories() {
  return (
    <section
      className="py-60 bg-[#FAFAFA] border-y-[0.5px] border-[#EEEEEE]"
      aria-label="Hizmet kapsamı"
    >
      <div className="max-w-[1240px] mx-auto px-16 md:px-24">
        <div className="flex flex-col mb-32">
          <span className="text-[11px] font-medium text-primary uppercase tracking-wider">
            HİZMET KAPSAMI
          </span>
          <h2 className="text-[32px] font-medium text-[#111111] tracking-[-1.5px] mt-8">
            Hangi Araçları Alıyoruz?
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
          {SERVICES.map(({ name, icon: Icon, slug }) => (
            <Link
              key={slug}
              href={(`/ara?damage_type=${slug}`) as never}
              className="bg-white border-[0.5px] border-[#EEEEEE] rounded-xl p-24 flex flex-col items-start gap-12 group hover:border-primary transition-colors"
            >
              <Icon size={32} className="text-primary" aria-hidden />
              <h3 className="text-[16px] font-medium text-[#111111]">{name}</h3>
              <span className="text-[12px] font-medium text-primary flex items-center gap-4">
                İlanları Gör <ArrowRight size={14} aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
