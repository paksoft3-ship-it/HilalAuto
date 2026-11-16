// Integration tests are read-only, but they still generate real traffic (and database
// reads). Never aim them at production unless explicitly overridden.
export function assertNotProduction(baseURL: string | undefined) {
  const url = baseURL ?? "http://127.0.0.1:3000";
  if (/(^|\.)otograde\.com/.test(new URL(url).hostname) && process.env.ALLOW_PROD_TESTS !== "1") {
    throw new Error(`Refusing to run integration tests against ${url}. Use a local build or a Vercel preview URL.`);
  }
}
