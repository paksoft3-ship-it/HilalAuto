import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { brand, year, damage, city, phone } = data;

    if (!brand || !year || !damage || !city || !phone) {
      return NextResponse.json({ error: "Eksik bilgi girdiniz." }, { status: 400 });
    }

    const leadData = {
      brand: brand.trim(),
      model_year: year,
      damage_type: damage,
      city: city.trim(),
      phone: phone.trim(),
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
