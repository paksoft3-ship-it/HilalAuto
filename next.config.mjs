import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// /hizmet/<tr-slug> and /en/service/<en-slug> → listing facet for that damage type.
const HIZMET = [
  ["kazali-arac-alimi", "accident-damaged-vehicles", "kazali"],
  ["pert-arac-alimi", "written-off-vehicles", "pert"],
  ["yanmis-arac-alimi", "fire-damaged-vehicles", "yanmis"],
  ["sel-hasarli-arac-alimi", "flood-damaged-vehicles", "sel"],
  ["hurda-arac-alimi", "scrap-vehicles", "hurda"],
  ["motor-arizali-arac-alimi", "engine-fault-vehicles", "motor"],
  ["cekme-belgeli-arac-alimi", "tow-certificate-vehicles", "cekme"],
  ["agir-hasarli-arac-alimi", "heavily-damaged-vehicles", "agir"],
];
const HIZMET_REDIRECTS = HIZMET.flatMap(([tr, en, damage]) => [
  { source: `/hizmet/${tr}`, destination: `/ilanlar?damage_type=${damage}`, permanent: true },
  { source: `/en/service/${en}`, destination: `/en/listings?damage_type=${damage}`, permanent: true },
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Vercel's Image Optimization quota for this account is exhausted; the
    // optimizer answers /_next/image with HTTP 402 and every image blanks out.
    // Serving files directly keeps the site intact and uses no quota.
    // Re-enable (drop `unoptimized`, restore `formats`) after a plan upgrade or
    // quota reset — and prefer webp alone, since avif+webp doubles the number
    // of billable transformations per image.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    // The marketplace lives at /ilanlar (EN: /listings). The old /ara URLs are
    // indexed by Google and sit in already-sent alert emails, so they stay as
    // permanent redirects — never remove them. Query strings are carried over
    // automatically. /tr/... is the explicit-locale spelling of the same pages.
    return [
      { source: "/ara", destination: "/ilanlar", permanent: true },
      { source: "/ara/:slug", destination: "/ilanlar/:slug", permanent: true },
      { source: "/tr/ara", destination: "/ilanlar", permanent: true },
      { source: "/tr/ara/:slug", destination: "/ilanlar/:slug", permanent: true },
      // English spellings that older pages emitted (Turkish slugs under /en). The middleware answered these
      // with temporary 307s; Google has crawled them, so make them permanent.
      { source: "/en/ara", destination: "/en/listings", permanent: true },
      { source: "/en/ara/:slug", destination: "/en/listings/:slug", permanent: true },
      { source: "/en/sehir/:slug", destination: "/en/cities/:slug", permanent: true },
      { source: "/en/teklif-al", destination: "/en/get-a-quote", permanent: true },
      // Legacy /satilik-araclar system retired in favor of the marketplace.
      { source: "/satilik-araclar", destination: "/ilanlar", permanent: true },
      { source: "/satilik-araclar/:id", destination: "/ilanlar", permanent: true },
      { source: "/en/vehicles-for-sale", destination: "/en/listings", permanent: true },
      { source: "/en/vehicles-for-sale/:id", destination: "/en/listings", permanent: true },
      // Retired seller-funnel pages → their listing category. These must be real
      // HTTP 308s: redirect() inside the streamed page returned 200 + a client-side
      // redirect, so Google kept treating them as normal pages.
      ...HIZMET_REDIRECTS,
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // SAMEORIGIN (not DENY) so GTM Preview / Tag Assistant debugging works
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
