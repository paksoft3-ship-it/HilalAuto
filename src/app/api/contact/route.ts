import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, message } = await req.json();

    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Eksik bilgi girdiniz." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("hazaral_leads")
      .insert([
        {
          name: String(name).trim().slice(0, 120),
          phone: String(phone).trim().slice(0, 32),
          message: String(message).trim().slice(0, 1000),
          source: "contact",
          status: "new",
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("[contact/route] Supabase insert error:", error);
      return NextResponse.json({ error: "Veritabanı hatası." }, { status: 500 });
    }

    return NextResponse.json({ success: true, leadId: data.id });
  } catch (err) {
    console.error("[contact/route] Unexpected error:", err);
    return NextResponse.json({ error: "Sunucu hatası. Lütfen tekrar deneyin." }, { status: 500 });
  }
}
