"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { Listing, DamageGrade } from "@/types/marketplace";
import { GradeBadge } from "@/components/marketplace/GradeBadge";
import { CITIES, CAR_BRANDS, DAMAGE_TYPES } from "@/lib/constants";
import { YEAR_OPTIONS, autoTitle } from "@/lib/dealer-utils";
import { CheckCircle, ImagePlus, Save, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

const GRADES: DamageGrade[] = ["A", "B", "C", "D", "E"];
const FUEL_TYPES = ["benzin", "dizel", "lpg", "elektrik", "hibrit"];
const TRANSMISSIONS = ["manuel", "otomatik"];

export default function IlanDuzenle() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state mirrors the listing fields
  const [form, setForm] = useState({
    brand: "", model: "", year: 2020,
    fuel_type: "", transmission: "", km: "", color: "",
    city: "", district: "",
    damage_type: [] as string[], damage_grade: "" as DamageGrade | "",
    damage_description: "", has_tramer: false, tramer_amount: "",
    asking_price: "", is_price_negotiable: false,
    title: "", description: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: d } = await supabase.from("hazaral_dealers").select("id").eq("user_id", session.user.id).single();
      if (!d) return;

      const { data: l } = await supabase
        .from("hazaral_listings")
        .select("*")
        .eq("id", id)
        .eq("dealer_id", d.id)
        .single();

      if (!l) { router.replace("/bayi-paneli/ilanlarim" as never); return; }

      setListing(l as Listing);
      setForm({
        brand: l.brand, model: l.model, year: l.year,
        fuel_type: l.fuel_type || "", transmission: l.transmission || "",
        km: l.km ? String(l.km) : "", color: l.color || "",
        city: l.city, district: l.district || "",
        damage_type: l.damage_type || [], damage_grade: (l.damage_grade as DamageGrade) || "",
        damage_description: l.damage_description || "",
        has_tramer: l.has_tramer, tramer_amount: l.tramer_amount ? String(l.tramer_amount) : "",
        asking_price: String(l.asking_price), is_price_negotiable: l.is_price_negotiable,
        title: l.title, description: l.description || "",
      });
      setImages(l.images || []);
      setPrimaryImage(l.primary_image || l.images?.[0] || null);
      setLoading(false);
    }
    load();
  }, [id, router]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  function toggleDamage(d: string) {
    set("damage_type",
      form.damage_type.includes(d)
        ? form.damage_type.filter((x) => x !== d)
        : [...form.damage_type, d]
    );
  }

  async function addPhotos(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Oturum bulunamadı.");

      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", `listing-${id}`);
        const res = await fetch("/api/dealer/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: fd,
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error || "Yükleme başarısız.");
        urls.push(d.url);
      }
      setImages((prev) => {
        const next = [...prev, ...urls].slice(0, 20);
        if (!primaryImage && next.length > 0) setPrimaryImage(next[0]);
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fotoğraf yüklenemedi.");
    }
    setUploading(false);
  }

  function removePhoto(url: string) {
    setImages((prev) => {
      const next = prev.filter((u) => u !== url);
      if (primaryImage === url) setPrimaryImage(next[0] || null);
      return next;
    });
  }

  async function save() {
    if (!listing) return;
    if (images.length === 0) { setError("En az 1 fotoğraf gereklidir."); return; }
    setSaving(true);
    setError("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setSaving(false); return; }

    const res = await fetch(`/api/dealer/listings/${listing.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        brand: form.brand, model: form.model, year: Number(form.year),
        fuel_type: form.fuel_type || null, transmission: form.transmission || null,
        km: form.km ? Number(form.km) : null, color: form.color || null,
        city: form.city, district: form.district || null,
        damage_type: form.damage_type, damage_grade: form.damage_grade || null,
        damage_description: form.damage_description || null,
        has_tramer: form.has_tramer, tramer_amount: form.tramer_amount ? Number(form.tramer_amount) : null,
        asking_price: Number(form.asking_price), is_price_negotiable: form.is_price_negotiable,
        title: form.title || autoTitle(Number(form.year), form.brand, form.model, form.damage_type),
        description: form.description || null,
        images,
        primary_image: primaryImage && images.includes(primaryImage) ? primaryImage : images[0] || null,
        status: "pending_review",
      }),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Kayıt başarısız.");
    } else {
      setSuccess(true);
      setTimeout(() => router.replace("/bayi-paneli/ilanlarim" as never), 1500);
    }
    setSaving(false);
  }

  if (loading) return <div className="animate-pulse h-[400px] bg-surface-container-lowest rounded-card" />;

  const inputCls = "w-full px-14 py-11 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary transition-colors";

  return (
    <div className="flex flex-col gap-24 max-w-[720px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-on-surface">İlan Düzenle</h1>
        <button onClick={() => router.replace("/bayi-paneli/ilanlarim" as never)} className="text-[13px] text-muted-text hover:text-on-surface">
          ← Geri
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-[13px] p-12 rounded-lg">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 text-[13px] p-12 rounded-lg flex items-center gap-8"><CheckCircle size={14} /> Kaydedildi. Yönlendiriliyor...</div>}

      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24 flex flex-col gap-20">
        <section>
          <h2 className="text-[14px] font-semibold text-on-surface mb-14 pb-10 border-b border-[0.5px] border-border-default">Araç Bilgileri</h2>
          <div className="grid grid-cols-2 gap-14">
            <Field label="Marka">
              <select value={form.brand} onChange={(e) => set("brand", e.target.value)} className={inputCls}>
                {CAR_BRANDS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Model"><input value={form.model} onChange={(e) => set("model", e.target.value)} className={inputCls} /></Field>
            <Field label="Yıl">
              <select value={form.year} onChange={(e) => set("year", Number(e.target.value))} className={inputCls}>
                {YEAR_OPTIONS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="KM"><input type="number" value={form.km} onChange={(e) => set("km", e.target.value)} className={inputCls} /></Field>
            <Field label="Yakıt">
              <select value={form.fuel_type} onChange={(e) => set("fuel_type", e.target.value)} className={inputCls}>
                <option value="">Seçin</option>
                {FUEL_TYPES.map((f) => <option key={f} value={f} className="capitalize">{f}</option>)}
              </select>
            </Field>
            <Field label="Vites">
              <select value={form.transmission} onChange={(e) => set("transmission", e.target.value)} className={inputCls}>
                <option value="">Seçin</option>
                {TRANSMISSIONS.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </Field>
            <Field label="Renk"><input value={form.color} onChange={(e) => set("color", e.target.value)} className={inputCls} /></Field>
            <Field label="Şehir">
              <select value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls}>
                {Object.entries(CITIES).map(([, label]) => <option key={label} value={label}>{label}</option>)}
              </select>
            </Field>
            <Field label="İlçe"><input value={form.district} onChange={(e) => set("district", e.target.value)} className={inputCls} /></Field>
          </div>
        </section>

        <section>
          <h2 className="text-[14px] font-semibold text-on-surface mb-14 pb-10 border-b border-[0.5px] border-border-default">Hasar Bilgileri</h2>
          <div className="flex flex-col gap-14">
            <Field label="Otograde Derecesi">
              <div className="flex gap-8">
                {GRADES.map((g) => (
                  <button key={g} type="button" onClick={() => set("damage_grade", g)}
                    className={cn("flex-1 flex flex-col items-center gap-6 p-10 rounded-card border-2 transition-all",
                      form.damage_grade === g ? "border-primary bg-primary/5" : "border-border-default hover:border-primary/40"
                    )}>
                    <GradeBadge grade={g} size="md" />
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Hasar Türleri">
              <div className="flex flex-wrap gap-6">
                {DAMAGE_TYPES.map((d) => (
                  <button key={d} type="button" onClick={() => toggleDamage(d)}
                    className={cn("px-10 py-6 rounded-full border text-[12px] transition-colors",
                      form.damage_type.includes(d) ? "border-primary bg-primary/10 text-primary" : "border-border-default text-muted-text"
                    )}>{d}</button>
                ))}
              </div>
            </Field>
            <label className="flex items-center gap-10 cursor-pointer">
              <input type="checkbox" checked={form.has_tramer} onChange={(e) => set("has_tramer", e.target.checked)} className="w-[15px] h-[15px] accent-primary" />
              <span className="text-[13px] text-on-surface">Tramer kaydı var</span>
            </label>
            {form.has_tramer && <input type="number" placeholder="Tramer tutarı (TL)" value={form.tramer_amount} onChange={(e) => set("tramer_amount", e.target.value)} className={inputCls} />}
            <Field label="Hasar Açıklaması">
              <textarea rows={4} value={form.damage_description} onChange={(e) => set("damage_description", e.target.value)} className={cn(inputCls, "resize-none")} />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-[14px] font-semibold text-on-surface mb-14 pb-10 border-b border-[0.5px] border-border-default">Fotoğraflar</h2>
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-10">
              {images.map((url) => (
                <div key={url} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-[0.5px] border-border-default">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {primaryImage === url && (
                    <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-semibold px-6 py-2 rounded-full flex items-center gap-3">
                      <Star size={9} fill="currentColor" /> Kapak
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    {primaryImage !== url ? (
                      <button type="button" onClick={() => setPrimaryImage(url)} className="text-[10px] text-white font-medium px-6 py-3 rounded bg-white/20 hover:bg-white/30">
                        Kapak yap
                      </button>
                    ) : <span />}
                    <button type="button" onClick={() => removePhoto(url)} className="text-white p-3 rounded bg-red-500/80 hover:bg-red-600" aria-label="Fotoğrafı kaldır">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {images.length < 20 && (
                <label className="aspect-[4/3] rounded-lg border-2 border-dashed border-border-default flex flex-col items-center justify-center gap-6 cursor-pointer text-muted-text hover:border-primary hover:text-primary transition-colors">
                  <ImagePlus size={20} />
                  <span className="text-[11px] font-medium">{uploading ? "Yükleniyor..." : "Ekle"}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" disabled={uploading} onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} />
                </label>
              )}
            </div>
            <p className="text-[11px] text-muted-text">En fazla 20 fotoğraf, her biri 10 MB altında (JPEG, PNG, WebP).</p>
          </div>
        </section>

        <section>
          <h2 className="text-[14px] font-semibold text-on-surface mb-14 pb-10 border-b border-[0.5px] border-border-default">Fiyat & Açıklama</h2>
          <div className="flex flex-col gap-14">
            <Field label="Fiyat (TL)"><input type="number" value={form.asking_price} onChange={(e) => set("asking_price", e.target.value)} className={inputCls} /></Field>
            <label className="flex items-center gap-10 cursor-pointer">
              <input type="checkbox" checked={form.is_price_negotiable} onChange={(e) => set("is_price_negotiable", e.target.checked)} className="w-[15px] h-[15px] accent-primary" />
              <span className="text-[13px] text-on-surface">Pazarlık payı var</span>
            </label>
            <Field label="İlan Başlığı"><input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} /></Field>
            <Field label="Ek Açıklama">
              <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className={cn(inputCls, "resize-none")} placeholder="Aracın genel durumu, ekstra bilgiler..." />
            </Field>
          </div>
        </section>

        <button
          onClick={save}
          disabled={saving || success}
          className="flex items-center justify-center gap-8 bg-primary text-white py-14 rounded-btn text-[14px] font-semibold hover:opacity-90 disabled:opacity-60 mt-4"
        >
          <Save size={16} /> {saving ? "Kaydediliyor..." : "Kaydet ve İncelemeye Gönder"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
