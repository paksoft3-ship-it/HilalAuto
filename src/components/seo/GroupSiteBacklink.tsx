const GROUP_SITE_URL = "https://hasarliaracalan.com/";

export type GroupSiteBacklinkVariant =
  | "home"
  | "howItWorks"
  | "quote"
  | "vehicleTypes"
  | "contact"
  | "blog"
  | "service"
  | "city"
  | "cityIndex";

/**
 * Anchor text is intentionally different on every page: exact-match anchors
 * repeated sitewide get discounted, a varied natural profile does not.
 */
const COPY: Record<GroupSiteBacklinkVariant, { before: string; anchor: string; after: string }> = {
  home: {
    before: "Aracınızı ilan vermeden hemen nakde çevirmek isterseniz grup şirketimiz",
    anchor: "hasarlı araç alan",
    after: "ekibi Türkiye genelinde aynı gün ödeme ile alım yapar.",
  },
  howItWorks: {
    before: "Süreçle uğraşmadan doğrudan satış için grup şirketimiz",
    anchor: "hasarlı araç alan firmalar",
    after: "arasında lider olan HasarliAracAlan.com'a başvurabilirsiniz.",
  },
  quote: {
    before: "Teklif beklemeden bugün satmak isterseniz grup şirketimiz",
    anchor: "kazalı araç alan",
    after: "ekibiyle aynı gün ödeme alarak aracınızı devredebilirsiniz.",
  },
  vehicleTypes: {
    before: "Perte ayrılmış aracınız için grup şirketimiz",
    anchor: "pert araç alan",
    after: "HasarliAracAlan.com üzerinden anında nakit teklif sunar.",
  },
  contact: {
    before: "Ekonomik ömrünü tamamlamış araçlar için grup şirketimiz",
    anchor: "hurda araç alan",
    after: "ekibimizle de iletişime geçebilirsiniz.",
  },
  blog: {
    before: "Aracınızı doğrudan satmak için güvenilir",
    anchor: "hasarlı araç alan yerler",
    after: "arayanlara grup şirketimiz HasarliAracAlan.com hizmet vermektedir.",
  },
  service: {
    before: "İlanla uğraşmak istemeyenler için grup şirketimiz,",
    anchor: "kazalı araç alan firmalar",
    after: "içinde aynı gün ödeme yapan adresiniz: HasarliAracAlan.com.",
  },
  city: {
    before: "Bulunduğunuz şehirde yerinde alım için grup şirketimiz",
    anchor: "hasarlı araç alan firma",
    after: "olarak HasarliAracAlan.com tüm illere hizmet verir.",
  },
  cityIndex: {
    before: "81 ilde kapınızdan alım yapan grup şirketimiz",
    anchor: "hasarlı araç alımı",
    after: "konusunda uzman ekibiyle aynı gün ödeme sağlar.",
  },
};

const EN_BEFORE = "Prefer to sell your vehicle directly for same-day cash? Our group company";
const EN_AFTER = "team at HasarliAracAlan.com buys damaged, written-off and scrap vehicles across Turkey.";

type Props = {
  variant?: GroupSiteBacklinkVariant;
  locale?: string;
};

/**
 * Slim sitewide strip rendered directly under page hero sections,
 * linking to the group site hasarliaracalan.com (dofollow).
 */
export function GroupSiteBacklink({ variant = "home", locale = "tr" }: Props) {
  const { before, anchor, after } = COPY[variant];
  const isEn = locale === "en";

  return (
    <aside
      aria-label="Grup şirketi"
      className="w-full bg-accent-light/40 border-b border-[0.5px] border-border-default"
    >
      <div className="max-w-[1240px] mx-auto px-16 md:px-24 py-10 text-center">
        <p className="text-[13px] text-text-muted leading-relaxed">
          {isEn ? EN_BEFORE : before}{" "}
          <a
            href={GROUP_SITE_URL}
            target="_blank"
            rel="noopener"
            className="text-primary font-medium hover:underline"
          >
            {anchor}
          </a>{" "}
          {isEn ? EN_AFTER : after}
        </p>
      </div>
    </aside>
  );
}
