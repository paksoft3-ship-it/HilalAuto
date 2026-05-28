import { GADS_ID, GADS_CONVERSION_LABEL } from "./constants";

export function fireGoogleAdsConversion() {
  if (typeof window === "undefined") return;
  if (!GADS_ID || !GADS_CONVERSION_LABEL) return;
  if (!window.gtag) return;

  window.gtag("event", "conversion", {
    send_to: `${GADS_ID}/${GADS_CONVERSION_LABEL}`,
  });
}
