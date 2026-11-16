import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { quickQuoteApiSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Geçersiz veri formatı." }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Eksik bilgi girdiniz." }, { status: 400 });
    }
    const parsed = quickQuoteApiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Eksik bilgi girdiniz." }, { status: 422 });
    }
    const { brand, year, damage, city, phone } = parsed.data;

    const leadData = {
      brand,
      model_year: year,
      damage_type: damage,
      city,
      phone,
      source: "quick_quote",
      status: "new",
    };

    const { data: insertedLead, error: insertError } = await supabaseAdmin
      .from("hazaral_leads")
      .insert([leadData])
      .select()
      .single();

    if (insertError) {
      console.error("[quick-quote/route] Supabase insert error:", insertError);
      return NextResponse.json({ error: "Veritabanı hatası." }, { status: 500 });
    }

    return NextResponse.json({ success: true, leadId: insertedLead.id });
  } catch (err) {
    console.error("[quick-quote/route] Unexpected error:", err);
    return NextResponse.json(
      { error: "Sunucu hatası. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
