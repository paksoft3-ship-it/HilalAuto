"use client";

import { supabase } from "@/lib/supabase";

export async function logAdminAudit(payload: {
  action: string;
  entityType: string;
  entityId?: string | null;
  dealerId?: string | null;
  listingId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return;

  await fetch("/api/admin/audit", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).catch(() => undefined);
}
