import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createNotification } from "@/lib/notifications";
import { getDealerPlanDays, isDealerPlanSlug, retrieveIyzicoSubscriptionCheckout } from "@/lib/payments";

async function readToken(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    return String(body.token || body.checkoutFormToken || "");
  }

  const form = await req.formData().catch(() => null);
  return String(form?.get("token") || form?.get("checkoutFormToken") || "");
}

function isSuccess(payload: Record<string, unknown>) {
  const status = String(payload.status || payload.paymentStatus || "").toLowerCase();
  return status === "success" || status === "paid";
}

export async function POST(req: Request) {
  const token = await readToken(req);
  if (!token) {
    return NextResponse.json({ error: "Ödeme token bilgisi eksik." }, { status: 400 });
  }

  const { data: payment, error: paymentError } = await supabaseAdmin
    .from("hazaral_subscription_payments")
    .select("*")
    .eq("provider", "iyzico")
    .eq("provider_reference", token)
    .single();

  if (paymentError || !payment) {
    return NextResponse.json({ error: "Ödeme kaydı bulunamadı." }, { status: 404 });
  }

  let providerPayload: Record<string, unknown>;
  try {
    providerPayload = await retrieveIyzicoSubscriptionCheckout(token);
  } catch (error) {
    console.error("[payments/iyzico/callback/retrieve]", error);
    await supabaseAdmin
      .from("hazaral_subscription_payments")
      .update({
        status: "failed",
        metadata: {
          ...(payment.metadata || {}),
          callback_error: error instanceof Error ? error.message : "iyzico doğrulaması başarısız",
        },
      })
      .eq("id", payment.id);

    return NextResponse.redirect(new URL("/bayi-paneli/abonelik?payment=failed", req.url));
  }

  if (!isSuccess(providerPayload) || !isDealerPlanSlug(payment.plan_slug)) {
    await supabaseAdmin
      .from("hazaral_subscription_payments")
      .update({
        status: "failed",
        metadata: {
          ...(payment.metadata || {}),
          callback: providerPayload,
        },
      })
      .eq("id", payment.id);

    return NextResponse.redirect(new URL("/bayi-paneli/abonelik?payment=failed", req.url));
  }

  const now = new Date();
  const end = new Date(now.getTime() + getDealerPlanDays(payment.plan_slug) * 86400000);

  await supabaseAdmin
    .from("hazaral_subscription_payments")
    .update({
      status: "paid",
      provider_payment_id: String(
        providerPayload.subscriptionReferenceCode ||
        providerPayload.paymentId ||
        providerPayload.referenceCode ||
        "",
      ) || null,
      paid_at: now.toISOString(),
      metadata: {
        ...(payment.metadata || {}),
        callback: providerPayload,
      },
    })
    .eq("id", payment.id);

  await supabaseAdmin
    .from("hazaral_dealers")
    .update({
      subscription_status: "active",
      subscription_plan: payment.plan_slug,
      subscription_start: now.toISOString(),
      subscription_end: end.toISOString(),
      is_approved: true,
    })
    .eq("id", payment.dealer_id);

  await createNotification(
    payment.dealer_id,
    "subscription_activated",
    "Aboneliğiniz Aktifleştirildi",
    `${payment.plan_slug} aboneliğiniz ${end.toLocaleDateString("tr-TR")} tarihine kadar aktifleştirildi.`,
  );

  await supabaseAdmin.from("hazaral_admin_audit_logs").insert({
    action: "payment.paid",
    entity_type: "subscription_payment",
    entity_id: payment.id,
    dealer_id: payment.dealer_id,
    metadata: {
      provider: "iyzico",
      plan: payment.plan_slug,
      amount: payment.amount,
    },
  });

  return NextResponse.redirect(new URL("/bayi-paneli/abonelik?payment=success", req.url));
}

export async function GET(req: Request) {
  return POST(req);
}
