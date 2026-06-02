import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getDealerFromRequest } from "@/lib/notifications";

export async function PATCH(req: NextRequest) {
  const auth = await getDealerFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz istek" }, { status: 401 });
  }

  const payload = await req.json().catch(() => ({}));
  const ids = Array.isArray(payload.ids)
    ? payload.ids.filter((id: unknown) => typeof id === "string")
    : [];

  let query = supabaseAdmin
    .from("hazaral_notifications")
    .update({ is_read: true })
    .eq("dealer_id", auth.dealer.id)
    .eq("is_read", false);

  if (ids.length > 0) {
    query = query.in("id", ids);
  }

  const { error } = await query;
  if (error) {
    return NextResponse.json({ error: "Bildirimler güncellenemedi" }, { status: 500 });
  }

  const { count } = await supabaseAdmin
    .from("hazaral_notifications")
    .select("id", { count: "exact", head: true })
    .eq("dealer_id", auth.dealer.id)
    .eq("is_read", false);

  return NextResponse.json({ ok: true, unreadCount: count || 0 });
}
