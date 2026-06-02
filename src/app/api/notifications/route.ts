import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  createNotification,
  ensureSubscriptionNotifications,
  getDealerFromRequest,
  isAdminRequest,
  isNotificationType,
} from "@/lib/notifications";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export async function GET(req: NextRequest) {
  const auth = await getDealerFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz istek" }, { status: 401 });
  }

  await ensureSubscriptionNotifications(auth.dealer);

  const searchParams = req.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(searchParams.get("limit") || DEFAULT_LIMIT)),
  );
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const [{ data, count, error }, { count: unreadCount }] = await Promise.all([
    supabaseAdmin
      .from("hazaral_notifications")
      .select("id, type, title, body, listing_id, is_read, created_at", { count: "exact" })
      .eq("dealer_id", auth.dealer.id)
      .order("created_at", { ascending: false })
      .range(from, to),
    supabaseAdmin
      .from("hazaral_notifications")
      .select("id", { count: "exact", head: true })
      .eq("dealer_id", auth.dealer.id)
      .eq("is_read", false),
  ]);

  if (error) {
    return NextResponse.json({ error: "Bildirimler alınamadı" }, { status: 500 });
  }

  return NextResponse.json({
    notifications: data || [],
    unreadCount: unreadCount || 0,
    total: count || 0,
    page,
    limit,
  });
}

export async function POST(req: NextRequest) {
  const isAdmin = await isAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: "Yetkisiz istek" }, { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const dealerId = String(payload.dealer_id || "");
  const type = String(payload.type || "");
  const title = String(payload.title || "");
  const body = String(payload.body || "");
  const listingId = payload.listing_id ? String(payload.listing_id) : null;

  if (!dealerId || !isNotificationType(type) || !title || !body) {
    return NextResponse.json({ error: "Eksik bildirim bilgisi" }, { status: 400 });
  }

  const notification = await createNotification(dealerId, type, title, body, listingId);
  if (!notification) {
    return NextResponse.json({ error: "Bildirim oluşturulamadı" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, notification });
}
