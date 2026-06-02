import { NextRequest, NextResponse } from "next/server";

// Log search queries to console for now — can be stored to a table later
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filters, results_count, session_id } = body;

    // Structured log for future analysis
    console.log("[search]", JSON.stringify({ filters, results_count, session_id, ts: new Date().toISOString() }));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
