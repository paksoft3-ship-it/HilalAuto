import "server-only";

import { supabaseAdmin } from "@/lib/supabase";

export const NOTIFICATION_TYPES = [
  "listing_approved",
  "listing_rejected",
  "subscription_expiring",
  "subscription_expired",
  "new_message",
  "listing_featured",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

type NotificationDealer = {
  id: string;
  subscription_status: string | null;
  subscription_plan: string | null;
  subscription_end: string | null;
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "paksoft3@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "Otograde <notifications@otograde.com>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://otograde.com";
const DAY_MS = 24 * 60 * 60 * 1000;

const trDate = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

export function isNotificationType(type: string): type is NotificationType {
  return (NOTIFICATION_TYPES as readonly string[]).includes(type);
}

export async function createNotification(
  dealerId: string,
  type: NotificationType,
  title: string,
  body: string,
  listingId?: string | null,
) {
  if (!dealerId || !title || !body) return null;

  const { data, error } = await supabaseAdmin
    .from("hazaral_notifications")
    .insert({
      dealer_id: dealerId,
      type,
      title,
      body,
      listing_id: listingId || null,
      is_read: false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[notifications/create]", error);
    return null;
  }

  return data;
}

export async function notifyDealer(
  dealerId: string,
  type: NotificationType,
  title: string,
  body: string,
  listingId?: string | null,
) {
  return createNotification(dealerId, type, title, body, listingId);
}

function getBearerToken(req: Request) {
  const header = req.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) return null;
  return header.slice(7).trim();
}

export async function getUserFromRequest(req: Request) {
  const token = getBearerToken(req);
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  return data.user;
}

export async function getDealerFromRequest(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return null;

  const { data: dealer, error } = await supabaseAdmin
    .from("hazaral_dealers")
    .select("id, subscription_status, subscription_plan, subscription_end")
    .eq("user_id", user.id)
    .single();

  if (error || !dealer) return null;

  return { user, dealer: dealer as NotificationDealer };
}

export async function isAdminRequest(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return false;

  const { data, error } = await supabaseAdmin
    .from("hazaral_profiles")
    .select("role")
    .eq("id", user.id)
    .eq("role", "admin")
    .single();

  return !error && data?.role === "admin";
}

async function hasNotificationSince(dealerId: string, type: NotificationType, since: string) {
  const { data } = await supabaseAdmin
    .from("hazaral_notifications")
    .select("id")
    .eq("dealer_id", dealerId)
    .eq("type", type)
    .gte("created_at", since)
    .limit(1)
    .maybeSingle();

  return Boolean(data?.id);
}

export async function ensureSubscriptionNotifications(dealer: NotificationDealer) {
  if (!dealer.subscription_end) return;

  const endsAt = new Date(dealer.subscription_end);
  if (Number.isNaN(endsAt.getTime())) return;

  const now = new Date();
  const endLabel = trDate.format(endsAt);

  if (endsAt.getTime() <= now.getTime() || dealer.subscription_status === "expired") {
    const existing = await hasNotificationSince(
      dealer.id,
      "subscription_expired",
      endsAt.toISOString(),
    );

    if (!existing) {
      await createNotification(
        dealer.id,
        "subscription_expired",
        "Aboneliğiniz Sona Erdi",
        `Aboneliğiniz ${endLabel} tarihinde sona erdi. İlanlarınızın yayında kalması için yenileme yapmanız gerekir.`,
      );
    }

    if (dealer.subscription_status !== "expired") {
      await supabaseAdmin
        .from("hazaral_dealers")
        .update({ subscription_status: "expired" })
        .eq("id", dealer.id);
    }

    return;
  }

  if (dealer.subscription_status !== "active") return;

  const daysLeft = Math.ceil((endsAt.getTime() - now.getTime()) / DAY_MS);
  if (daysLeft < 0 || daysLeft > 7) return;

  const windowStart = new Date(endsAt.getTime() - 7 * DAY_MS).toISOString();
  const existing = await hasNotificationSince(dealer.id, "subscription_expiring", windowStart);

  if (!existing) {
    await createNotification(
      dealer.id,
      "subscription_expiring",
      "Aboneliğiniz Yakında Sona Eriyor",
      `Aboneliğiniz ${endLabel} tarihinde sona erecek. Kalan süre: ${daysLeft} gün.`,
    );
  }
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[email] RESEND_API_KEY not set, skipping "${subject}" to ${to}`);
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
    if (error) console.error("[email/send]", error);
  } catch (err) {
    console.error("[email/send]", err);
  }
}

export async function emailAdmin(subject: string, html: string) {
  await sendEmail(ADMIN_EMAIL, subject, html);
}

export async function emailDealer(dealerEmail: string, subject: string, html: string) {
  await sendEmail(dealerEmail, subject, html);
}

function emailShell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #eee;">
    <div style="background:#C0392B;padding:20px 24px;">
      <span style="color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">Otograde</span>
    </div>
    <div style="padding:28px 24px;color:#1a1c1c;font-size:14px;line-height:1.6;">
      ${body}
    </div>
    <div style="background:#f5f5f5;padding:14px 24px;font-size:11px;color:#888;text-align:center;">
      Bu e-posta otomatik olarak gönderilmiştir. <a href="${SITE_URL}" style="color:#C0392B;">${SITE_URL}</a>
    </div>
  </div>
</body>
</html>`;
}

export function adminNewDealerEmail(company: string, contact: string, email: string, city: string, plan: string): string {
  return emailShell("Yeni Bayi Başvurusu", `
    <h2 style="margin:0 0 16px;font-size:18px;color:#1a1c1c;">Yeni Bayi Başvurusu</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <tr><td style="padding:6px 0;color:#888;width:120px;">Firma</td><td style="padding:6px 0;font-weight:600;">${company}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Yetkili</td><td style="padding:6px 0;">${contact}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">E-posta</td><td style="padding:6px 0;">${email}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Şehir</td><td style="padding:6px 0;">${city}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Plan Talebi</td><td style="padding:6px 0;text-transform:capitalize;">${plan || "-"}</td></tr>
    </table>
    <div style="margin-top:24px;">
      <a href="${SITE_URL}/admin/bayiler" style="display:inline-block;background:#C0392B;color:#fff;padding:12px 24px;border-radius:8px;font-weight:600;font-size:13px;text-decoration:none;">Admin Panelde İncele</a>
    </div>
  `);
}

export function adminNewListingEmail(title: string, dealer: string, city: string, price: number): string {
  return emailShell("Yeni İlan İnceleme Bekliyor", `
    <h2 style="margin:0 0 16px;font-size:18px;color:#1a1c1c;">Yeni İlan İnceleme Bekliyor</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <tr><td style="padding:6px 0;color:#888;width:120px;">İlan Başlığı</td><td style="padding:6px 0;font-weight:600;">${title}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Bayi</td><td style="padding:6px 0;">${dealer}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Şehir</td><td style="padding:6px 0;">${city}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Fiyat</td><td style="padding:6px 0;color:#C0392B;font-weight:700;">${price.toLocaleString("tr-TR")} TL</td></tr>
    </table>
    <div style="margin-top:24px;">
      <a href="${SITE_URL}/admin/ilanlar" style="display:inline-block;background:#C0392B;color:#fff;padding:12px 24px;border-radius:8px;font-weight:600;font-size:13px;text-decoration:none;">İlanları İncele</a>
    </div>
  `);
}

export function dealerExpiryEmail(company: string, daysLeft: number, plan: string): string {
  return emailShell(`Aboneliğiniz ${daysLeft} Gün İçinde Sona Eriyor`, `
    <h2 style="margin:0 0 12px;font-size:18px;color:#1a1c1c;">Abonelik Yenileme Hatırlatması</h2>
    <p>Merhaba <strong>${company}</strong>,</p>
    <p>Otograde <strong>${plan}</strong> aboneliğiniz <strong>${daysLeft} gün</strong> içinde sona eriyor.</p>
    <p>Aboneliğinizin sona ermesi durumunda ilanlarınız yayından kaldırılacaktır. Yenileme için ödeme bilgilerinizi iletiniz.</p>
    <div style="margin-top:24px;">
      <a href="${SITE_URL}/bayi-paneli" style="display:inline-block;background:#C0392B;color:#fff;padding:12px 24px;border-radius:8px;font-weight:600;font-size:13px;text-decoration:none;">Bayi Panele Git</a>
    </div>
  `);
}

export function dealerListingApprovedEmail(company: string, listingTitle: string, slug: string): string {
  return emailShell("İlanınız Onaylandı", `
    <h2 style="margin:0 0 12px;font-size:18px;color:#1a1c1c;">İlanınız Yayına Alındı</h2>
    <p>Merhaba <strong>${company}</strong>,</p>
    <p><strong>"${listingTitle}"</strong> başlıklı ilanınız incelendi ve yayına alındı.</p>
    <div style="margin-top:24px;">
      <a href="${SITE_URL}/ara/${slug}" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;font-weight:600;font-size:13px;text-decoration:none;">İlanı Görüntüle</a>
    </div>
  `);
}

export function dealerListingRejectedEmail(company: string, listingTitle: string, reason: string): string {
  return emailShell("İlanınız Reddedildi", `
    <h2 style="margin:0 0 12px;font-size:18px;color:#1a1c1c;">İlanınız Reddedildi</h2>
    <p>Merhaba <strong>${company}</strong>,</p>
    <p><strong>"${listingTitle}"</strong> başlıklı ilanınız incelendi ancak yayınlanamadı.</p>
    ${reason ? `<div style="background:#fff5f5;border:1px solid #fca5a5;border-radius:8px;padding:12px;margin:16px 0;font-size:13px;"><strong>Red sebebi:</strong> ${reason}</div>` : ""}
    <p>İlanınızı düzenleyerek tekrar gönderebilirsiniz.</p>
    <div style="margin-top:20px;">
      <a href="${SITE_URL}/bayi-paneli/ilanlarim" style="display:inline-block;background:#C0392B;color:#fff;padding:12px 24px;border-radius:8px;font-weight:600;font-size:13px;text-decoration:none;">İlanlarıma Git</a>
    </div>
  `);
}
