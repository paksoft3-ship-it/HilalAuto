import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listing_id, session_id, time_on_page, scrolled_percent, viewed_images_count } = body;

    if (!listing_id || !session_id) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Find the most recent view row for this session + listing
    const { data: view } = await supabaseAdmin
      .from("hazaral_listing_views")
      .select("id, time_on_page, scrolled_percent, viewed_images_count")
      .eq("listing_id", listing_id)
      .eq("session_id", session_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!view) return NextResponse.json({ ok: true }); // No view row yet, skip

    const updates: Record<string, number> = {};

    if (typeof time_on_page === "number") {
      updates.time_on_page = Math.max(view.time_on_page ?? 0, time_on_page);
    }
    if (typeof scrolled_percent === "number") {
      updates.scrolled_percent = Math.max(view.scrolled_percent ?? 0, scrolled_percent);
    }
    if (typeof viewed_images_count === "number") {
      updates.viewed_images_count = Math.max(view.viewed_images_count ?? 0, viewed_images_count);
    }

    if (Object.keys(updates).length > 0) {
      await supabaseAdmin
        .from("hazaral_listing_views")
        .update(updates)
        .eq("id", view.id);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
