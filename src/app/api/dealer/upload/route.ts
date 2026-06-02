import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

async function getDealerId(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const client = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;

  const { data } = await supabaseAdmin
    .from("hazaral_dealers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  return data?.id || null;
}

export async function POST(req: NextRequest) {
  const dealerId = await getDealerId(req);
  if (!dealerId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "misc";

  if (!file) return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });

  // Validate
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Dosya 10 MB sınırını aşıyor." }, { status: 422 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Sadece JPEG, PNG veya WebP yükleyebilirsiniz." }, { status: 422 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${dealerId}/${folder}/${filename}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("listings")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[upload]", uploadError);
    return NextResponse.json({ error: "Yükleme başarısız oldu." }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin.storage.from("listings").getPublicUrl(path);

  return NextResponse.json({ url: urlData.publicUrl, path });
}
