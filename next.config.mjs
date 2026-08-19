import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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
    // Legacy /satilik-araclar system retired in favor of the /ara marketplace.
    return [
      { source: "/satilik-araclar", destination: "/ara", permanent: true },
      { source: "/satilik-araclar/:id", destination: "/ara", permanent: true },
      { source: "/en/vehicles-for-sale", destination: "/en/listings", permanent: true },
      { source: "/en/vehicles-for-sale/:id", destination: "/en/listings", permanent: true },
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
