import { HowItWorksTabs } from "@/components/marketplace/HowItWorksTabs";

export function MarketplaceHowItWorks() {
  return (
    <section
      className="bg-[#FAFAFA] py-60 border-y-[0.5px] border-[#EEEEEE]"
      aria-label="Nasıl çalışır"
    >
      <div className="max-w-[1180px] mx-auto px-16 md:px-32">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="text-[11px] font-medium text-primary uppercase tracking-wider">
            REHBER
          </span>
          <h2 className="text-[32px] font-medium text-[#111111] tracking-[-1.5px] mt-8">
            Nasıl Çalışır?
          </h2>
        </div>

        {/* Client tab toggle + steps */}
        <HowItWorksTabs />
      </div>
    </section>
  );
}
