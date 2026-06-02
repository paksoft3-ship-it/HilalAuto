import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getDealerFromRequest } from "@/lib/notifications";
import {
  canUseIyzico,
  getDealerPlanDays,
  initializeIyzicoSubscriptionCheckout,
  isDealerPlanSlug,
} from "@/lib/payments";

type DealerForCheckout = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  city: string;
  district: string | null;
};

export async function POST(req: Request) {
  const auth = await getDealerFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Oturum bulunamadı." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const plan = String(body.plan || "");
  if (!isDealerPlanSlug(plan)) {
    return NextResponse.json({ error: "Geçersiz plan." }, { status: 400 });
  }

  const { data: dealer, error: dealerError } = await supabaseAdmin
    .from("hazaral_dealers")
    .select("id, company_name, contact_name, email, phone, city, district")
    .eq("id", auth.dealer.id)
    .single();

  if (dealerError || !dealer) {
    return NextResponse.json({ error: "Bayi bulunamadı." }, { status: 404 });
  }

  const { data: planRow, error: planError } = await supabaseAdmin
    .from("hazaral_subscription_plans")
    .select("slug, price_monthly")
    .eq("slug", plan)
    .eq("is_active", true)
    .single();

  if (planError || !planRow) {
    return NextResponse.json({ error: "Plan bulunamadı." }, { status: 404 });
  }

  const periodDays = getDealerPlanDays(plan);
  const { data: payment, error: paymentError } = await supabaseAdmin
    .from("hazaral_subscription_payments")
    .insert({
      dealer_id: auth.dealer.id,
      plan_slug: plan,
      provider: canUseIyzico(plan) ? "iyzico" : "manual",
      status: "pending",
      amount: planRow.price_monthly,
      currency: "TRY",
      period_days: periodDays,
      billing_name: dealer.company_name,
      billing_email: dealer.email,
      billing_phone: dealer.phone,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        requested_by: auth.user.id,
        source: "dealer_panel",
      },
    })
    .select("*")
    .single();

  if (paymentError || !payment) {
    console.error("[subscription/checkout/create]", paymentError);
    return NextResponse.json({ error: "Ödeme isteği oluşturulamadı." }, { status: 500 });
  }

  if (!canUseIyzico(plan)) {
    return NextResponse.json({
      provider: "manual",
      payment,
      manualInstructions: {
        title: "Ödeme isteğiniz alındı",
        body: "iyzico ayarları yapılana kadar ödemeniz admin tarafından manuel onaylanacaktır.",
      },
    });
  }

  try {
    const checkout = await initializeIyzicoSubscriptionCheckout(
      { id: payment.id, amount: payment.amount, plan_slug: plan },
      dealer as DealerForCheckout,
    );

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("hazaral_subscription_payments")
      .update({
        status: "checkout_created",
        checkout_url: checkout.checkoutUrl,
        provider_reference: checkout.token,
        metadata: {
          ...(payment.metadata || {}),
          iyzico: checkout.raw,
          checkout_form_content: checkout.checkoutFormContent,
        },
      })
      .eq("id", payment.id)
      .select("*")
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      provider: "iyzico",
      payment: updated,
      checkoutUrl: checkout.checkoutUrl,
      checkoutFormContent: checkout.checkoutFormContent,
    });
  } catch (error) {
    console.error("[subscription/checkout/iyzico]", error);
    await supabaseAdmin
      .from("hazaral_subscription_payments")
      .update({
        status: "failed",
        metadata: {
          ...(payment.metadata || {}),
          error: error instanceof Error ? error.message : "iyzico checkout oluşturulamadı",
        },
      })
      .eq("id", payment.id);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ödeme sayfası oluşturulamadı." },
      { status: 502 },
    );
  }
}
