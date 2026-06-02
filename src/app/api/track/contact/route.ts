import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { createNotification } from "@/lib/notifications";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + (process.env.SUPABASE_JWT_SECRET ?? "")).digest("hex");
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      listing_id, dealer_id, contact_type,
      contact_name, contact_phone, contact_message,
      session_id, device_type, referrer, utm_source, utm_medium,
    } = body;

    if (!listing_id || !dealer_id || !contact_type) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await supabaseAdmin.from("hazaral_listing_contacts").insert({
      listing_id,
      dealer_id,
      contact_type,
      contact_name: contact_name || null,
      contact_phone: contact_phone || null,
      contact_message: contact_message || null,
      session_id: session_id || null,
      device_type: device_type || null,
      viewer_ip: hashIp(getIp(req)),
      referrer: referrer || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
    });

    // Update listing counters
    const { data: l } = await supabaseAdmin
      .from("hazaral_listings")
      .select("whatsapp_click_count, phone_click_count")
      .eq("id", listing_id)
      .single();

    if (l) {
      const updates: Record<string, number> = {};
      if (contact_type === "whatsapp") updates.whatsapp_click_count = (l.whatsapp_click_count ?? 0) + 1;
      if (contact_type === "phone") updates.phone_click_count = (l.phone_click_count ?? 0) + 1;
      if (Object.keys(updates).length > 0) {
        await supabaseAdmin.from("hazaral_listings").update(updates).eq("id", listing_id);
      }
    }

    // Update dealer total_contacts
    const { data: d } = await supabaseAdmin
      .from("hazaral_dealers")
      .select("total_contacts")
      .eq("id", dealer_id)
      .single();

    if (d) {
      await supabaseAdmin
        .from("hazaral_dealers")
        .update({ total_contacts: (d.total_contacts ?? 0) + 1 })
        .eq("id", dealer_id);
    }

    // If it's a message: insert dealer_message + send in-app notification
    if (contact_type === "message" && contact_name && contact_phone && contact_message) {
      const { error: messageError } = await supabaseAdmin.from("hazaral_dealer_messages").insert({
        listing_id,
        dealer_id,
        sender_name: contact_name,
        sender_phone: contact_phone,
        message: contact_message,
      });

      // In-app notification - do not duplicate raw contact data here.
      if (!messageError) createNotification(
        dealer_id,
        "new_message",
        "Yeni Mesaj Alındı",
        "İlanınız için yeni bir mesaj geldi. Mesajlar sayfasından yanıtlayabilirsiniz.",
        listing_id,
      ).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
