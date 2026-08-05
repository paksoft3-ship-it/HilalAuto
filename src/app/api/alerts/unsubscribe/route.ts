import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// One-click unsubscribe from a saved-search alert email.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://otograde.com";

  if (token) {
    await supabaseAdmin
      .from("hazaral_search_alerts")
      .update({ is_active: false })
      .eq("unsubscribe_token", token);
  }

  return new NextResponse(
    `<!doctype html><meta charset="utf-8"><title>Bildirim aboneliği iptal edildi</title>
     <div style="font-family:system-ui,sans-serif;max-width:480px;margin:80px auto;text-align:center;padding:0 16px;">
       <h1 style="font-size:20px;color:#1a1c1c;">Aboneliğiniz iptal edildi</h1>
       <p style="color:#666;font-size:14px;">Bu arama için artık e-posta almayacaksınız.</p>
       <a href="${site}/ara" style="display:inline-block;margin-top:16px;background:#C0392B;color:#fff;padding:12px 24px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">İlanlara Dön</a>
     </div>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}
