import { GADS_ID, GADS_CONVERSION_LABEL } from "./constants";

export function fireGoogleAdsConversion() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  // Push custom event — configure a Google Ads Conversion tag in GTM triggered by "conversion_lead"
  window.dataLayer.push({ event: "conversion_lead" });
  // Also fire via gtag directly when gtag.js is loaded alongside GTM
  if (typeof window.gtag === "function" && GADS_ID && GADS_CONVERSION_LABEL) {
    window.gtag("event", "conversion", {
      send_to: `${GADS_ID}/${GADS_CONVERSION_LABEL}`,
    });
  }
}
