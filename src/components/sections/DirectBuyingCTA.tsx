import { Link } from "@/i18n/routing";
import { externalRoutes } from "@/lib/routes";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { FaWhatsapp } from "react-icons/fa";

export function DirectBuyingCTA() {
  return (
    <section aria-label="Aracınızı doğrudan satın" style={{ background: "#C0392B" }}>
      <div className="mx-auto max-w-[1180px] px-16 md:px-32 py-32 md:py-36">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-24">
          {/* Text */}
          <div className="max-w-[520px]">
            <h2 className="text-[18px] md:text-[20px] font-medium text-white mb-8 leading-snug">
              Aracınızı hâlâ doğrudan bize satabilirsiniz
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
              Bayi beklemeden anında nakit teklif — kazalı, pert, hurda fark etmez
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-10 w-full md:w-auto shrink-0">
            <Link
              href="/teklif-al"
              className="inline-flex items-center justify-center px-24 py-13 rounded-[10px] text-[13px] font-medium transition-opacity hover:opacity-90"
              style={{ background: "#FFFFFF", color: "#C0392B" }}
            >
              Ücretsiz Teklif Al
            </Link>
            <a
              href={externalRoutes.whatsapp(WHATSAPP_NUMBER, "Merhaba, hasarlı aracım için teklif almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-8 px-24 py-13 rounded-[10px] text-[13px] font-medium transition-colors hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.6)", color: "#FFFFFF" }}
            >
              <FaWhatsapp size={15} aria-hidden />
              WhatsApp&apos;tan Yaz
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
