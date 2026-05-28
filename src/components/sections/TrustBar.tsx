import { MapPin, Zap, FileCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FaWhatsapp } from 'react-icons/fa';

const ITEMS = [
  {
    icon: MapPin,
    label: "Yerinden Alım",
    desc: "Aracınızı kapınızdan teslim alıyoruz.",
  },
  {
    icon: Zap,
    label: "Hızlı Değerleme",
    desc: "1 saat içinde teklifinizi iletiyoruz.",
  },
  {
    icon: FileCheck,
    label: "Güvenli Evrak Süreci",
    desc: "Tüm belgelerde yanınızdayız.",
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp Destek",
    desc: "7 gün boyunca ulaşabilirsiniz.",
  },
];

export function TrustBar() {
  return (
    <section
      aria-label="Güven öğeleri"
      className="bg-surface border-y border-[0.5px] border-border-default py-32"
    >
      <Container>
        <ul className="grid grid-cols-2 gap-y-32 gap-x-16 md:grid-cols-4 md:gap-32">
          {ITEMS.map(({ icon: Icon, label, desc }) => (
            <li key={label} className="flex flex-col items-center text-center gap-8">
              <Icon size={32} strokeWidth={1.5} className="text-primary" aria-hidden />
              <div>
                <h3 className="text-[13px] md:text-[14px] font-medium text-on-surface">{label}</h3>
                <p className="text-[11px] md:text-[12px] text-muted-text mt-4 leading-snug">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
