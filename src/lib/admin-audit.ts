import "server-only";

import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/notifications";

export type AdminAuditAction =
  | "dealer.approve"
  | "dealer.suspend"
  | "dealer.verify"
  | "dealer.note"
  | "listing.approve"
  | "listing.reject"
  | "listing.feature"
  | "listing.sold"
  | "subscription.activate"
  | "subscription.extend"
  | "subscription.reminder"
  | "payment.request"
  | "payment.paid";

type AuditPayload = {
  action: AdminAuditAction | string;
  entityType: string;
  entityId?: string | null;
  dealerId?: string | null;
  listingId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function getAdminFromRequest(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return null;

  const { data, error } = await supabaseAdmin
    .from("hazaral_profiles")
    .select("role")
    .eq("id", user.id)
    .eq("role", "admin")
    .single();

  if (error || data?.role !== "admin") return null;
  return user;
}

export async function logAdminActionFromRequest(req: Request, payload: AuditPayload) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return { ok: false, status: 403, error: "Yetkisiz işlem." };

  const { error } = await supabaseAdmin.from("hazaral_admin_audit_logs").insert({
    admin_user_id: admin.id,
    admin_email: admin.email || null,
    action: payload.action,
    entity_type: payload.entityType,
    entity_id: payload.entityId || null,
    dealer_id: payload.dealerId || null,
    listing_id: payload.listingId || null,
    metadata: payload.metadata || {},
  });

  if (error) {
    console.error("[admin-audit/create]", error);
    return { ok: false, status: 500, error: "Audit kaydı oluşturulamadı." };
  }

  return { ok: true, status: 200 };
}
