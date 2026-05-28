declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function push(event: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
}

export function trackEvent(action: string, params?: Record<string, unknown>) {
  push({ event: action, ...params });
}

export function trackCTA(label: string, location: string) {
  push({ event: "cta_click", cta_label: label, cta_location: location });
}

export function trackConversion(conversionId: string, conversionLabel: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "conversion", {
    send_to: `${conversionId}/${conversionLabel}`,
  });
}

export function trackWhatsApp(location: string) {
  push({ event: "whatsapp_click", click_location: location });
}

export function trackPhoneClick(location: string) {
  push({ event: "phone_click", click_location: location });
}

export function trackFormStart(formName: string) {
  push({ event: "quote_form_start", form_name: formName });
}

export function trackFormStep(formName: string, step: number) {
  push({ event: "quote_form_step", form_name: formName, step_number: step });
}

export function trackFormSubmit(formName: string) {
  push({ event: "quote_form_submit", form_name: formName });
}

export function trackLeadSuccess(leadId: string) {
  push({ event: "quote_lead_success", lead_id: leadId });
}

export function trackScrollDepth(percent: number) {
  push({ event: "scroll_depth", depth_percent: percent });
}

export function trackEngagedSession() {
  push({ event: "engaged_session" });
}

export function trackRemarketingPageView(pageType: string) {
  push({ event: "remarketing_page_view", page_type: pageType });
}

export function trackContactFormSubmit() {
  push({ event: "contact_form_submit" });
}
