"use client";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("og_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("og_session_id", id);
  }
  return id;
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent;
  if (/tablet|iPad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iPhone|Android|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return "mobile";
  return "desktop";
}

function getUTMParam(name: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search).get(name) ?? undefined;
}

async function post(url: string, body: Record<string, unknown>, useBeacon = false) {
  if (typeof window === "undefined") return;
  const json = JSON.stringify(body);
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([json], { type: "application/json" }));
  } else {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json,
        keepalive: true,
      });
    } catch {
      // Fail silently — tracking should never break the UX
    }
  }
}

export async function trackListingView(listingId: string, dealerId: string) {
  await post("/api/track/view", {
    listing_id: listingId,
    dealer_id: dealerId,
    session_id: getSessionId(),
    device_type: getDeviceType(),
    referrer: document.referrer || undefined,
    utm_source: getUTMParam("utm_source"),
    utm_medium: getUTMParam("utm_medium"),
    utm_campaign: getUTMParam("utm_campaign"),
  });
}

export function trackScrollDepth(listingId: string, percent: number) {
  post(
    "/api/track/engagement",
    { listing_id: listingId, session_id: getSessionId(), scrolled_percent: percent },
    true // beacon — non-blocking
  );
}

export function trackTimeOnPage(listingId: string, seconds: number) {
  post(
    "/api/track/engagement",
    { listing_id: listingId, session_id: getSessionId(), time_on_page: seconds },
    true
  );
}

export function trackImageViewed(listingId: string, count: number) {
  post(
    "/api/track/engagement",
    { listing_id: listingId, session_id: getSessionId(), viewed_images_count: count },
    true
  );
}

export async function trackWhatsAppClick(listingId: string, dealerId: string) {
  await post("/api/track/contact", {
    listing_id: listingId,
    dealer_id: dealerId,
    contact_type: "whatsapp",
    session_id: getSessionId(),
    device_type: getDeviceType(),
    referrer: document.referrer || undefined,
    utm_source: getUTMParam("utm_source"),
    utm_medium: getUTMParam("utm_medium"),
  });
}

export async function trackPhoneReveal(listingId: string, dealerId: string) {
  await post("/api/track/contact", {
    listing_id: listingId,
    dealer_id: dealerId,
    contact_type: "phone",
    session_id: getSessionId(),
    device_type: getDeviceType(),
    referrer: document.referrer || undefined,
  });
}

export async function trackMessageSent(
  listingId: string,
  dealerId: string,
  contactName: string,
  contactPhone: string,
  message: string
) {
  await post("/api/track/contact", {
    listing_id: listingId,
    dealer_id: dealerId,
    contact_type: "message",
    contact_name: contactName,
    contact_phone: contactPhone,
    contact_message: message,
    session_id: getSessionId(),
    device_type: getDeviceType(),
    referrer: document.referrer || undefined,
  });
}

export async function trackSearchQuery(
  filters: Record<string, string>,
  resultsCount: number
) {
  await post("/api/track/search", {
    filters,
    results_count: resultsCount,
    session_id: getSessionId(),
  });
}

// Set up scroll depth tracking — call once in a useEffect
export function setupScrollTracking(
  listingId: string,
  onDepth: (pct: number) => void
): () => void {
  const fired = new Set<number>();
  const thresholds = [25, 50, 75, 100];

  function handleScroll() {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    const pct = Math.round((scrolled / total) * 100);
    for (const t of thresholds) {
      if (pct >= t && !fired.has(t)) {
        fired.add(t);
        onDepth(t);
      }
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}
