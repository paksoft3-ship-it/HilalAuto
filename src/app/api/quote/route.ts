import { NextRequest, NextResponse } from "next/server";
import { quoteFullSchema } from "@/lib/validations";

// Phase 8 will add: Supabase lead save, Supabase Storage upload, Resend email, rate limiting
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawData = formData.get("data");

    if (!rawData || typeof rawData !== "string") {
      return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawData);
    } catch {
      return NextResponse.json({ error: "Geçersiz veri formatı." }, { status: 400 });
    }

    // Honeypot check
    const data = parsed as Record<string, unknown>;
    if (data.honeypot && String(data.honeypot).length > 0) {
      // Silent reject — return fake success
      return NextResponse.json({ leadId: "rejected" });
    }

    // Server-side validation
    const result = quoteFullSchema.safeParse(parsed);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Doğrulama hatası.";
      return NextResponse.json({ error: firstError }, { status: 422 });
    }

    const photos = formData.getAll("photos") as File[];

    // Validate photo files
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    for (const photo of photos) {
      if (photo.size > maxSize) {
        return NextResponse.json(
          { error: `${photo.name} dosyası 5 MB sınırını aşıyor.` },
          { status: 422 }
        );
      }
      if (!allowedTypes.includes(photo.type)) {
        return NextResponse.json(
          { error: `${photo.name} geçersiz dosya türü.` },
          { status: 422 }
        );
      }
    }

    // TODO Phase 8: upload photos to Supabase Storage
    // TODO Phase 8: save lead to Supabase database
    // TODO Phase 8: send email via Resend

    const leadId = `lead_${Date.now()}`;

    return NextResponse.json({ success: true, leadId });
  } catch (err) {
    console.error("[quote/route] Unexpected error:", err);
    return NextResponse.json(
      { error: "Sunucu hatası. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
