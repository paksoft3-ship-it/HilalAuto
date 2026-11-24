import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "node",
    // next-intl imports "next/navigation" without an extension; bundle it so Vite can resolve it.
    server: { deps: { inline: ["next-intl"] } },
    include: ["src/**/*.test.ts", "tests/unit/**/*.test.ts"],
    // Unit tests never touch the network or the production database.
    env: { NEXT_PUBLIC_SITE_URL: "https://otograde.com" },
  },
});
