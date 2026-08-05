import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { createNotification, emailAdmin, adminNewOfferEmail } from "@/lib/notifications";

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
      contact_name, contact_phone, contact_message, offer_amount,
      session_id, device_type, referrer, utm_source, utm_medium,
    } = body;

    if (!listing_id || !dealer_id || !contact_type) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const offerAmount =
      contact_type === "offer" && Number.isFinite(Number(offer_amount))
        ? Math.max(0, Math.round(Number(offer_amount)))
        : null;

    await supabaseAdmin.from("hazaral_listing_contacts").insert({
      listing_id,
      dealer_id,
      contact_type,
      contact_name: contact_name || null,
      contact_phone: contact_phone || null,
      contact_message: contact_message || null,
      offer_amount: offerAmount,
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

    // Messages and offers both land in the dealer inbox; an offer carries the
    // bid amount so the dealer can act on it without opening the listing.
    if ((contact_type === "message" || contact_type === "offer") && contact_name && contact_phone) {
      const isOffer = contact_type === "offer";
      const body =
        isOffer && offerAmount !== null
          ? `TEKLİF: ${offerAmount.toLocaleString("tr-TR")} TL` +
            (contact_message ? `\n\n${contact_message}` : "")
          : contact_message;

      if (body) {
        const { error: messageError } = await supabaseAdmin.from("hazaral_dealer_messages").insert({
          listing_id,
          dealer_id,
          sender_name: contact_name,
          sender_phone: contact_phone,
          message: body,
        });

        // In-app notification - do not duplicate raw contact data here.
        if (!messageError) {
          createNotification(
            dealer_id,
            "new_message",
            isOffer ? "Yeni Teklif Aldınız" : "Yeni Mesaj Alındı",
            isOffer
              ? "İlanınız için fiyat teklifi geldi. Mesajlar sayfasından görüntüleyebilirsiniz."
              : "İlanınız için yeni bir mesaj geldi. Mesajlar sayfasından yanıtlayabilirsiniz.",
            listing_id,
          ).catch(() => {});

          // Offers are time-sensitive — push an email as well as the in-app badge.
          if (isOffer) {
            const { data: listing } = await supabaseAdmin
              .from("hazaral_listings")
              .select("title, slug, asking_price")
              .eq("id", listing_id)
              .single();
            emailAdmin(
              `Yeni teklif: ${listing?.title ?? "ilan"}`,
              adminNewOfferEmail(
                listing?.title ?? "-",
                listing?.slug ?? "",
                listing?.asking_price ?? null,
                offerAmount,
                contact_name,
                contact_phone,
                contact_message || null,
              ),
            ).catch(() => {});
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
