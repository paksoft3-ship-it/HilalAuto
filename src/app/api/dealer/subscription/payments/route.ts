import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getDealerFromRequest } from "@/lib/notifications";

export async function GET(req: Request) {
  const auth = await getDealerFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Oturum bulunamadı." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("hazaral_subscription_payments")
    .select("*")
    .eq("dealer_id", auth.dealer.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("[subscription/payments/list]", error);
    return NextResponse.json({ error: "Ödeme geçmişi alınamadı." }, { status: 500 });
  }

  return NextResponse.json({ payments: data || [] });
}
