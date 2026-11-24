import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { contactApiSchema } from "@/lib/validations";

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
    const parsed = contactApiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Eksik bilgi girdiniz." }, { status: 422 });
    }
    const { name, phone, message } = parsed.data;

    const { data, error } = await supabaseAdmin
      .from("hazaral_leads")
      .insert([
        {
          name,
          phone,
          message,
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
