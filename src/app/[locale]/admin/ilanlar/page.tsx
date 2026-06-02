"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Listing } from "@/types/marketplace";
import { GradeBadge } from "@/components/marketplace/GradeBadge";
import { DamageBadge } from "@/components/marketplace/DamageBadge";
import { CheckCircle, XCircle, Zap, RefreshCw, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  active:         { label: "Yayında",     cls: "bg-green-100 text-green-700" },
  pending_review: { label: "İnceleme",    cls: "bg-amber-100 text-amber-700" },
  draft:          { label: "Taslak",      cls: "bg-gray-100 text-gray-500" },
  sold:           { label: "Satıldı",     cls: "bg-blue-100 text-blue-700" },
  rejected:       { label: "Reddedildi",  cls: "bg-red-100 text-red-600" },
  expired:        { label: "Süresi Doldu", cls: "bg-gray-100 text-gray-400" },
};

interface ListingWithDealer extends Listing {
  dealer_info?: { company_name: string; city: string; is_verified: boolean } | null;
}

type DealerNotificationPayload = {
  dealer_id: string;
  type: "listing_approved" | "listing_rejected" | "listing_featured";
  title: string;
  body: string;
  listing_id?: string;
};

async function createDealerNotification(payload: DealerNotificationPayload) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return;

  await fetch("/api/notifications", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export default function AdminIlanlar() {
  const [listings, setListings] = useState<ListingWithDealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending_review");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [featuredTarget, setFeaturedTarget] = useState<string | null>(null);
  const [featuredDays, setFeaturedDays] = useState("7");
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function load(status = statusFilter) {
    setLoading(true);
    let query = supabase
      .from("hazaral_listings")
      .select("*, dealer_info:hazaral_dealers(company_name, city, is_verified)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (status !== "all") query = query.eq("status", status);

    const { data } = await query;
    setListings((data as ListingWithDealer[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [statusFilter]);

  async function approve(id: string, dealerId: string) {
    setSaving(true);
    const listing = listings.find((l) => l.id === id);
    const { error } = await supabase.from("hazaral_listings").update({ status: "active" }).eq("id", id);
    if (!error) await createDealerNotification({
      dealer_id: dealerId,
      type: "listing_approved",
      title: "İlanınız Onaylandı",
      body: listing?.title
        ? `"${listing.title}" ilanınız incelendi ve yayına alındı.`
        : "İlanınız incelendi ve yayına alındı.",
      listing_id: id,
    });
    await load();
    setSaving(false);
  }

  async function reject(id: string, dealerId: string) {
    setSaving(true);
    const listing = listings.find((l) => l.id === id);
    const reason = rejectReason.trim();
    const { error } = await supabase.from("hazaral_listings").update({
      status: "rejected",
      rejection_reason: reason || null,
    }).eq("id", id);
    if (!error) await createDealerNotification({
      dealer_id: dealerId,
      type: "listing_rejected",
      title: "İlanınız Reddedildi",
      body: reason
        ? `Red sebebi: ${reason}`
        : `${listing?.title ? `"${listing.title}" ilanınız ` : "İlanınız "}uygunluk kriterlerini karşılamadığı için reddedildi.`,
      listing_id: id,
    });
    setRejectTarget(null);
    setRejectReason("");
    await load();
    setSaving(false);
  }

  async function featureListing(id: string) {
    setSaving(true);
    const listing = listings.find((l) => l.id === id);
    const until = new Date(Date.now() + parseInt(featuredDays) * 86400000).toISOString();
    await supabase.from("hazaral_listings").update({
      is_featured: true,
      featured_until: until,
    }).eq("id", id);

    // Notify the dealer
    if (listing) {
      await createDealerNotification({
        dealer_id: listing.dealer_id,
        type: "listing_featured",
        title: "İlanınız Öne Çıkarıldı",
        body: `"${listing.title}" ilanınız ${featuredDays} gün boyunca öne çıkarıldı.`,
        listing_id: id,
      });
    }

    setFeaturedTarget(null);
    await load();
    setSaving(false);
  }

  async function markSold(id: string) {
    if (!confirm("Bu ilanı satıldı olarak işaretle?")) return;
    await supabase.from("hazaral_listings").update({
      status: "sold",
      sold_at: new Date().toISOString(),
    }).eq("id", id);
    await load();
  }

  const selected = listings.find((l) => l.id === selectedId);

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
        <div>
          <h1 className="text-[24px] font-bold text-on-surface tracking-[-1px]">İlan Moderasyonu</h1>
          <p className="text-[13px] text-muted-text mt-4">{listings.length} ilan</p>
        </div>
        <div className="flex gap-10">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-14 py-9 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-btn text-[13px] outline-none focus:border-primary"
          >
            <option value="pending_review">İnceleme Bekliyor</option>
            <option value="active">Yayında</option>
            <option value="rejected">Reddedildi</option>
            <option value="all">Tümü</option>
          </select>
          <button onClick={() => load()} className="flex items-center gap-8 px-14 py-9 border border-[0.5px] border-border-default rounded-btn text-[12px] text-muted-text bg-surface-container-lowest hover:border-primary">
            <RefreshCw size={12} /> Yenile
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* Left: listing list */}
        <div className="flex flex-col gap-0 lg:w-[380px] shrink-0 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card overflow-hidden">
          {loading ? (
            <div className="py-32 text-center text-[13px] text-muted-text">Yükleniyor...</div>
          ) : listings.length === 0 ? (
            <div className="py-32 text-center text-[13px] text-muted-text">İlan bulunamadı.</div>
          ) : listings.map((l) => {
            const s = STATUS_LABELS[l.status] || { label: l.status, cls: "bg-gray-100 text-gray-500" };
            return (
              <button
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className={cn(
                  "flex items-start gap-12 p-14 border-b border-[0.5px] border-border-default last:border-0 text-left hover:bg-surface transition-colors",
                  selectedId === l.id && "bg-primary/5"
                )}
              >
                <div className="w-[60px] h-[44px] rounded bg-surface-container-low shrink-0 overflow-hidden">
                  {l.primary_image || l.images[0] ? (
                    <img src={l.primary_image || l.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-8 mb-4">
                    <GradeBadge grade={l.damage_grade} size="sm" />
                    <span className={cn("text-[10px] px-6 py-2 rounded-full font-medium", s.cls)}>{s.label}</span>
                  </div>
                  <div className="text-[12px] font-medium text-on-surface truncate">{l.title}</div>
                  <div className="text-[10px] text-muted-text mt-2">
                    {(l as ListingWithDealer).dealer_info?.company_name || "—"} · {l.city}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: detail + actions */}
        <div className="flex-1">
          {!selected ? (
            <div className="flex items-center justify-center h-[300px] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card">
              <p className="text-[13px] text-muted-text">Bir ilan seçin</p>
            </div>
          ) : (
            <div className="flex flex-col gap-16">
              {/* Images */}
              {selected.images.length > 0 && (
                <div className="grid grid-cols-4 gap-8">
                  {selected.images.slice(0, 8).map((img, i) => (
                    <img key={i} src={img} alt="" className="aspect-square object-cover rounded-lg" />
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-20">
                <div className="flex items-start justify-between gap-12 mb-16">
                  <div>
                    <div className="flex items-center gap-10 mb-6">
                      <GradeBadge grade={selected.damage_grade} size="md" />
                      <h2 className="text-[16px] font-bold text-on-surface">{selected.title}</h2>
                    </div>
                    <div className="text-[18px] font-bold text-primary">
                      {selected.asking_price.toLocaleString("tr-TR")} TL
                      {selected.is_price_negotiable && <span className="text-[12px] text-muted-text font-normal ml-8">Pazarlık var</span>}
                    </div>
                  </div>
                  <a href={`/ara/${selected.slug}`} target="_blank" rel="noopener" className="text-muted-text hover:text-primary">
                    <ExternalLink size={16} />
                  </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-16 text-[12px] mb-16">
                  <Detail label="Marka" value={selected.brand} />
                  <Detail label="Model" value={selected.model} />
                  <Detail label="Yıl" value={String(selected.year)} />
                  <Detail label="KM" value={selected.km ? `${selected.km.toLocaleString("tr-TR")} km` : "—"} />
                  <Detail label="Yakıt" value={selected.fuel_type || "—"} />
                  <Detail label="Şehir" value={selected.city} />
                </div>

                {selected.damage_type.length > 0 && (
                  <div className="flex flex-wrap gap-6 mb-14">
                    {selected.damage_type.map((d) => <DamageBadge key={d} type={d} />)}
                  </div>
                )}

                {selected.damage_description && (
                  <p className="text-[12px] text-muted-text bg-surface rounded-lg p-12 leading-relaxed">{selected.damage_description}</p>
                )}

                <div className="mt-14 pt-14 border-t border-[0.5px] border-border-default text-[12px] text-muted-text">
                  Bayi: <strong className="text-on-surface">{(selected as ListingWithDealer).dealer_info?.company_name}</strong> · {selected.city}
                </div>
              </div>

              {/* Action buttons */}
              {selected.status === "pending_review" && (
                <div className="flex flex-wrap gap-10">
                  <button
                    onClick={() => approve(selected.id, selected.dealer_id)}
                    disabled={saving}
                    className="flex items-center gap-8 px-20 py-11 bg-green-600 text-white rounded-btn text-[13px] font-semibold hover:opacity-90 disabled:opacity-60"
                  >
                    <CheckCircle size={15} /> Onayla
                  </button>
                  <button
                    onClick={() => setRejectTarget(selected.id)}
                    className="flex items-center gap-8 px-20 py-11 bg-red-600 text-white rounded-btn text-[13px] font-semibold hover:opacity-90"
                  >
                    <XCircle size={15} /> Reddet
                  </button>
                </div>
              )}

              {selected.status === "active" && (
                <div className="flex flex-wrap gap-10">
                  <button
                    onClick={() => setFeaturedTarget(selected.id)}
                    className="flex items-center gap-8 px-20 py-11 bg-amber-500 text-white rounded-btn text-[13px] font-semibold hover:opacity-90"
                  >
                    <Zap size={15} /> Öne Çıkar
                  </button>
                  <button
                    onClick={() => markSold(selected.id)}
                    className="flex items-center gap-8 px-20 py-11 border border-[0.5px] border-border-default text-muted-text rounded-btn text-[13px] font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    Satıldı İşaretle
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reject modal */}
      {rejectTarget && (
        <Modal title="İlanı Reddet" onClose={() => { setRejectTarget(null); setRejectReason(""); }}>
          <p className="text-[13px] text-muted-text mb-14">Red sebebi (bayiye bildirim gönderilecek):</p>
          <textarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Sebep..." className="w-full px-14 py-10 border border-[0.5px] border-border-default rounded-input text-[13px] bg-surface outline-none focus:border-primary resize-none mb-16" />
          <div className="flex gap-10 justify-end">
            <button onClick={() => { setRejectTarget(null); setRejectReason(""); }} className="px-20 py-10 text-[13px] text-muted-text">İptal</button>
            <button onClick={() => reject(rejectTarget, listings.find(l => l.id === rejectTarget)?.dealer_id || "")} disabled={saving} className="px-20 py-10 bg-red-600 text-white text-[13px] font-semibold rounded-btn hover:opacity-90 disabled:opacity-60">Reddet</button>
          </div>
        </Modal>
      )}

      {/* Feature modal */}
      {featuredTarget && (
        <Modal title="İlanı Öne Çıkar" onClose={() => setFeaturedTarget(null)}>
          <p className="text-[13px] text-muted-text mb-14">Kaç gün öne çıkarılsın?</p>
          <input type="number" value={featuredDays} onChange={(e) => setFeaturedDays(e.target.value)} min="1" max="30" className="w-full px-14 py-10 border border-[0.5px] border-border-default rounded-input text-[13px] bg-surface outline-none focus:border-primary mb-16" />
          <div className="flex gap-10 justify-end">
            <button onClick={() => setFeaturedTarget(null)} className="px-20 py-10 text-[13px] text-muted-text">İptal</button>
            <button onClick={() => featureListing(featuredTarget)} disabled={saving} className="px-20 py-10 bg-amber-500 text-white text-[13px] font-semibold rounded-btn hover:opacity-90 disabled:opacity-60">Öne Çıkar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-muted-text uppercase tracking-wide">{label}</div>
      <div className="text-[12px] font-medium text-on-surface capitalize">{value}</div>
    </div>
  );
}

function Modal({ title, children }: { title: string; children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-16 bg-black/50">
      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card w-full max-w-[440px] p-24">
        <h3 className="text-[16px] font-semibold text-on-surface mb-14">{title}</h3>
        {children}
      </div>
    </div>
  );
}
