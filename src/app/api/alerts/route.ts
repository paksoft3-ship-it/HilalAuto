import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Only these filters are honoured when matching new listings to an alert.
const ALLOWED_FILTERS = ["brand", "city", "grade", "damage", "maxPrice", "minPrice", "q"] as const;

function sanitizeFilters(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, string> = {};
  for (const key of ALLOWED_FILTERS) {
    const v = (raw as Record<string, unknown>)[key];
    if (typeof v === "string" && v.trim()) out[key] = v.trim().slice(0, 80);
  }
  return out;
}

function describe(filters: Record<string, string>): string {
  const parts: string[] = [];
  if (filters.brand) parts.push(filters.brand);
  if (filters.damage) parts.push(filters.damage);
  if (filters.grade) parts.push(`Grade ${filters.grade}`);
  if (filters.city) parts.push(filters.city);
  if (filters.maxPrice) parts.push(`max ${Number(filters.maxPrice).toLocaleString("tr-TR")} TL`);
  if (filters.q) parts.push(`"${filters.q}"`);
  return parts.length ? parts.join(" · ") : "Tüm ilanlar";
}

export async function POST(req: NextRequest) {
  try {
    const { email, phone, filters, locale } = await req.json();

    if (typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
    }

    const clean = sanitizeFilters(filters);

    // One alert per email+filter combination. Compared in JS because an
    // `.eq()` on a jsonb column does not perform jsonb equality.
    const fingerprint = JSON.stringify(
      Object.keys(clean).sort().map((k) => [k, clean[k]])
    );
    const { data: forEmail } = await supabaseAdmin
      .from("hazaral_search_alerts")
      .select("id, filters")
      .eq("email", email.toLowerCase());

    const existing = (forEmail ?? []).find((row) => {
      const f = (row.filters ?? {}) as Record<string, string>;
      return JSON.stringify(Object.keys(f).sort().map((k) => [k, f[k]])) === fingerprint;
    });

    if (existing) {
      await supabaseAdmin
        .from("hazaral_search_alerts")
        .update({ is_active: true })
        .eq("id", existing.id);
      return NextResponse.json({ ok: true, alreadyExists: true });
    }

    const { error } = await supabaseAdmin.from("hazaral_search_alerts").insert({
      email: email.toLowerCase(),
      phone: typeof phone === "string" && phone.trim() ? phone.trim().slice(0, 32) : null,
      filters: clean,
      label: describe(clean),
      locale: locale === "en" ? "en" : "tr",
    });

    if (error) return NextResponse.json({ error: "Kayıt oluşturulamadı." }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
