import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getAdminFromRequest, logAdminActionFromRequest } from "@/lib/admin-audit";

export async function GET(req: Request) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from("hazaral_admin_audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("[admin-audit/list]", error);
    return NextResponse.json({ error: "Audit kayıtları alınamadı." }, { status: 500 });
  }

  return NextResponse.json({ logs: data || [], count: count || 0, page, limit });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await logAdminActionFromRequest(req, {
    action: String(body.action || ""),
    entityType: String(body.entityType || ""),
    entityId: body.entityId || null,
    dealerId: body.dealerId || null,
    listingId: body.listingId || null,
    metadata: body.metadata || {},
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true });
}
