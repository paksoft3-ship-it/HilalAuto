import "server-only";

import crypto from "crypto";
import { SITE_URL } from "@/lib/constants";

export const DEALER_PLAN_DAYS = {
  basic: 30,
  professional: 60,
  premium: 90,
} as const;

export const DEALER_PLAN_LABELS = {
  basic: "Basic",
  professional: "Professional",
  premium: "Premium",
} as const;

export type DealerPlanSlug = keyof typeof DEALER_PLAN_DAYS;

type DealerForPayment = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  city: string;
  district: string | null;
};

type PaymentForProvider = {
  id: string;
  amount: number;
  plan_slug: DealerPlanSlug;
};

export function isDealerPlanSlug(plan: string): plan is DealerPlanSlug {
  return plan === "basic" || plan === "professional" || plan === "premium";
}

export function getDealerPlanDays(plan: DealerPlanSlug) {
  return DEALER_PLAN_DAYS[plan];
}

export function getIyzicoPlanReference(plan: DealerPlanSlug) {
  const map: Record<DealerPlanSlug, string | undefined> = {
    basic: process.env.IYZICO_SUBSCRIPTION_PLAN_BASIC,
    professional: process.env.IYZICO_SUBSCRIPTION_PLAN_PROFESSIONAL,
    premium: process.env.IYZICO_SUBSCRIPTION_PLAN_PREMIUM,
  };
  return map[plan];
}

export function canUseIyzico(plan: DealerPlanSlug) {
  return Boolean(
    process.env.IYZICO_API_KEY &&
    process.env.IYZICO_SECRET_KEY &&
    getIyzicoPlanReference(plan),
  );
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: parts[0] || "Otograde", lastName: "Bayi" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts.at(-1) || "Bayi" };
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return `+${digits}`;
  if (digits.startsWith("0")) return `+90${digits.slice(1)}`;
  return digits ? `+90${digits}` : "+905000000000";
}

function signIyzico(path: string, body: string, randomKey: string) {
  const secretKey = process.env.IYZICO_SECRET_KEY || "";
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(`${randomKey}${path}${body}`)
    .digest("hex");

  const authorization = Buffer.from(
    `apiKey:${process.env.IYZICO_API_KEY}&randomKey:${randomKey}&signature:${signature}`,
  ).toString("base64");

  return `IYZWSv2 ${authorization}`;
}

async function iyzicoRequest<T>(path: string, payload?: unknown): Promise<T> {
  const baseUrl = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";
  const body = payload ? JSON.stringify(payload) : "";
  const randomKey = `${Date.now()}${crypto.randomBytes(12).toString("hex")}`;

  const response = await fetch(`${baseUrl}${path}`, {
    method: payload ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      Locale: "tr",
      ConversationId: randomKey,
      Authorization: signIyzico(path, body, randomKey),
    },
    body: payload ? body : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.status === "failure") {
    throw new Error(data.errorMessage || "iyzico ödeme isteği başarısız oldu.");
  }

  return data as T;
}

export async function initializeIyzicoSubscriptionCheckout(
  payment: PaymentForProvider,
  dealer: DealerForPayment,
) {
  const pricingPlanReferenceCode = getIyzicoPlanReference(payment.plan_slug);
  if (!pricingPlanReferenceCode) throw new Error("iyzico plan referansı eksik.");

  const { firstName, lastName } = splitName(dealer.contact_name || dealer.company_name);
  const address = `${dealer.company_name}, ${dealer.district || dealer.city}`;

  type IyzicoCheckoutResponse = {
    status?: string;
    token?: string;
    checkoutFormToken?: string;
    checkoutFormContent?: string;
    checkoutFormUrl?: string;
    paymentPageUrl?: string;
  };

  const payload = {
    locale: "tr",
    conversationId: payment.id,
    pricingPlanReferenceCode,
    subscriptionInitialStatus: "ACTIVE",
    callbackUrl: `${SITE_URL}/api/payments/iyzico/callback`,
    customer: {
      name: firstName,
      surname: lastName,
      identityNumber: process.env.IYZICO_DEFAULT_IDENTITY_NUMBER || "11111111111",
      email: dealer.email,
      gsmNumber: normalizePhone(dealer.phone),
      billingAddress: {
        contactName: dealer.contact_name || dealer.company_name,
        city: dealer.city,
        country: "Turkey",
        address,
      },
      shippingAddress: {
        contactName: dealer.contact_name || dealer.company_name,
        city: dealer.city,
        country: "Turkey",
        address,
      },
    },
  };

  const data = await iyzicoRequest<IyzicoCheckoutResponse>(
    "/v2/subscription/checkoutform/initialize",
    payload,
  );

  return {
    token: data.checkoutFormToken || data.token || null,
    checkoutUrl: data.checkoutFormUrl || data.paymentPageUrl || null,
    checkoutFormContent: data.checkoutFormContent || null,
    raw: data,
  };
}

export async function retrieveIyzicoSubscriptionCheckout(token: string) {
  return iyzicoRequest<Record<string, unknown>>(`/v2/subscription/checkoutform/${token}`);
}
