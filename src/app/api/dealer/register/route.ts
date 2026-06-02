import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateDealerSlug } from "@/lib/dealer-utils";
import { emailAdmin, adminNewDealerEmail } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email, password,
      company_name, contact_name, phone, whatsapp,
      city, district, description,
      subscription_plan,
    } = body;

    if (!email || !password || !company_name || !contact_name || !phone || !city) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    // Create auth user (email confirmed immediately for dealers)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      if (authError?.message?.includes("already")) {
        return NextResponse.json({ error: "Bu e-posta adresi zaten kayıtlı." }, { status: 409 });
      }
      return NextResponse.json({ error: authError?.message || "Kayıt hatası." }, { status: 500 });
    }

    const slug = generateDealerSlug(company_name, city);

    // Create dealer record
    const { data: dealer, error: dealerError } = await supabaseAdmin
      .from("hazaral_dealers")
      .insert({
        user_id: authData.user.id,
        company_name,
        contact_name,
        phone,
        whatsapp: whatsapp || null,
        email,
        city,
        district: district || null,
        description: description || null,
        slug,
        subscription_status: "pending",
        subscription_plan: subscription_plan || null,
        is_approved: false,
        is_verified: false,
      })
      .select("id, slug")
      .single();

    if (dealerError) {
      // Rollback: delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: "Bayi kaydı oluşturulamadı." }, { status: 500 });
    }

    // Notify admin by email (fire-and-forget — never block the response)
    emailAdmin(
      `Yeni Bayi Başvurusu: ${company_name}`,
      adminNewDealerEmail(company_name, contact_name, email, city, subscription_plan || ""),
    ).catch(() => {});

    return NextResponse.json({ success: true, dealer_id: dealer.id, slug: dealer.slug });
  } catch (err) {
    console.error("[dealer/register]", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
