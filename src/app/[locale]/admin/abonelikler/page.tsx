"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dealer } from "@/types/marketplace";
import { CheckCircle, Clock, AlertTriangle, RefreshCw, Download, Bell, X } from "lucide-react";
import { externalRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { logAdminAudit } from "@/lib/admin-audit-client";

const PLANS = ["basic", "professional", "premium"] as const;
const PLAN_PRICES = { basic: 4999, professional: 9999, premium: 19999 };
const PLAN_DAYS = { basic: 30, professional: 60, premium: 90 };

interface DealerWithPayment extends Dealer {
  _payment_note?: string;
}

type SubscriptionPayment = {
  id: string;
  dealer_id: string;
  plan_slug: "basic" | "professional" | "premium";
  provider: string;
  status: string;
  amount: number;
  created_at: string;
  checkout_url: string | null;
  dealer?: { company_name: string; city: string } | null;
};

export default function AdminAbonelikler() {
  const [dealers, setDealers] = useState<DealerWithPayment[]>([]);
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activateTarget, setActivateTarget] = useState<DealerWithPayment | null>(null);
  const [activatePlan, setActivatePlan] = useState<"basic" | "professional" | "premium">("basic");
  const [paymentNote, setPaymentNote] = useState("");
  const [extendTarget, setExtendTarget] = useState<string | null>(null);
  const [extendDays, setExtendDays] = useState("30");
  const [saving, setSaving] = useState(false);
  const [remindersSent, setRemindersSent] = useState(0);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [runningExpiry, setRunningExpiry] = useState(false);
  const [expiryResult, setExpiryResult] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("hazaral_dealers")
      .select("*")
      .order("subscription_status")
      .order("subscription_end");
    setDealers((data as DealerWithPayment[]) || []);

    const { data: paymentData } = await supabase
      .from("hazaral_subscription_payments")
      .select("*, dealer:hazaral_dealers(company_name, city)")
      .in("status", ["pending", "checkout_created"])
      .order("created_at", { ascending: false })
      .limit(20);
    setPayments((paymentData as SubscriptionPayment[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 86400000).toISOString();

  const expiringSoon = dealers.filter(
    (d) => d.subscription_status === "active" && d.subscription_end && d.subscription_end < in7Days && d.subscription_end > now.toISOString()
  );
  const expired = dealers.filter(
    (d) => d.subscription_status === "expired" || (d.subscription_status === "active" && d.subscription_end && d.subscription_end < now.toISOString())
  );
  const pending = dealers.filter((d) => d.subscription_status === "pending");

  async function activate() {
    if (!activateTarget) return;
    setSaving(true);
    const start = new Date();
    const end = new Date(start.getTime() + PLAN_DAYS[activatePlan] * 86400000);
    await supabase.from("hazaral_dealers").update({
      subscription_status: "active",
      subscription_plan: activatePlan,
      subscription_start: start.toISOString(),
      subscription_end: end.toISOString(),
      is_approved: true,
      notes: paymentNote || null,
    }).eq("id", activateTarget.id);

    await supabase.from("hazaral_notifications").insert({
      dealer_id: activateTarget.id,
      type: "subscription_activated",
      title: "Aboneliğiniz Aktifleştirildi",
      body: `${PLANS.find(p => p === activatePlan)} planı aktifleştirildi. ${PLAN_DAYS[activatePlan]} gün geçerlidir.`,
    });

    await logAdminAudit({
      action: "subscription.activate",
      entityType: "dealer",
      entityId: activateTarget.id,
      dealerId: activateTarget.id,
      metadata: { company_name: activateTarget.company_name, plan: activatePlan, end: end.toISOString(), note: paymentNote || null },
    });

    setActivateTarget(null);
    setPaymentNote("");
    await load();
    setSaving(false);
  }

  async function extend() {
    if (!extendTarget) return;
    setSaving(true);
    const dealer = dealers.find((d) => d.id === extendTarget);
    const currentEnd = dealer?.subscription_end ? new Date(dealer.subscription_end) : new Date();
    const newEnd = new Date(Math.max(currentEnd.getTime(), Date.now()) + parseInt(extendDays) * 86400000);
    await supabase.from("hazaral_dealers").update({
      subscription_end: newEnd.toISOString(),
      subscription_status: "active",
    }).eq("id", extendTarget);

    await logAdminAudit({
      action: "subscription.extend",
      entityType: "dealer",
      entityId: extendTarget,
      dealerId: extendTarget,
      metadata: { days: parseInt(extendDays), new_end: newEnd.toISOString() },
    });
    setExtendTarget(null);
    await load();
    setSaving(false);
  }

  async function sendExpiryReminders() {
    setSendingReminders(true);
    const targets = expiringSoon.filter((d) => d.subscription_status === "active");
    let count = 0;
    for (const d of targets) {
      const daysLeft = d.subscription_end
        ? Math.ceil((new Date(d.subscription_end).getTime() - Date.now()) / 86400000)
        : 0;
      await supabase.from("hazaral_notifications").insert({
        dealer_id: d.id,
        type: "subscription_expiring",
        title: "Abonelik Sona Eriyor",
        body: `${d.subscription_plan} planınız ${daysLeft} gün içinde sona eriyor. Yenileme için bizimle iletişime geçin.`,
      });
      count++;
    }
    await logAdminAudit({
      action: "subscription.reminder",
      entityType: "dealer",
      metadata: { count, dealer_ids: targets.map((d) => d.id) },
    });
    setRemindersSent(count);
    setSendingReminders(false);
  }

  async function markPaymentPaid(payment: SubscriptionPayment) {
    setSaving(true);
    const now = new Date();
    const end = new Date(now.getTime() + PLAN_DAYS[payment.plan_slug] * 86400000);

    await supabase.from("hazaral_subscription_payments").update({
      status: "paid",
      paid_at: now.toISOString(),
    }).eq("id", payment.id);

    await supabase.from("hazaral_dealers").update({
      subscription_status: "active",
      subscription_plan: payment.plan_slug,
      subscription_start: now.toISOString(),
      subscription_end: end.toISOString(),
      is_approved: true,
    }).eq("id", payment.dealer_id);

    await supabase.from("hazaral_notifications").insert({
      dealer_id: payment.dealer_id,
      type: "subscription_activated",
      title: "Aboneliğiniz Aktifleştirildi",
      body: `${payment.plan_slug} planınız ${end.toLocaleDateString("tr-TR")} tarihine kadar aktifleştirildi.`,
    });

    await logAdminAudit({
      action: "payment.paid",
      entityType: "subscription_payment",
      entityId: payment.id,
      dealerId: payment.dealer_id,
      metadata: { plan: payment.plan_slug, amount: payment.amount, provider: payment.provider },
    });

    await load();
    setSaving(false);
  }

  async function runExpiryCheck() {
    setRunningExpiry(true);
    setExpiryResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/cron/expire-listings", {
        method: "POST",
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
      });
      const data = await res.json();
      if (data.summary) {
        const { listingsExpired = 0, dealersExpired = 0, listingsExpiredByDealerExpiry = 0, listingsUnfeatured = 0 } = data.summary;
        setExpiryResult(
          `Tamamlandı: ${listingsExpired} ilan süresi doldu, ${dealersExpired} bayi aboneliği bitti (${listingsExpiredByDealerExpiry} ek ilan kaldırıldı), ${listingsUnfeatured} öne çıkarma sona erdi.`
        );
      } else {
        setExpiryResult("Tamamlandı.");
      }
      await load();
    } catch {
      setExpiryResult("Hata oluştu.");
    }
    setRunningExpiry(false);
  }

  function exportCSV() {
    const header = "Firma,Plan,Başlangıç,Bitiş,Durum,Tutar";
    const rows = dealers.map((d) =>
      [d.company_name, d.subscription_plan || "", d.subscription_start?.slice(0, 10) || "", d.subscription_end?.slice(0, 10) || "", d.subscription_status, (d.subscription_plan ? PLAN_PRICES[d.subscription_plan] : 0) || 0].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `abonelikler-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const mrr = dealers
    .filter((d) => d.subscription_status === "active")
    .reduce((s, d) => s + (d.subscription_plan ? (PLAN_PRICES[d.subscription_plan] || 0) : 0), 0);

  return (
    <div className="flex flex-col gap-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-on-surface tracking-[-1px]">Abonelik Yönetimi</h1>
          <p className="text-[13px] text-muted-text mt-4">MRR: {mrr.toLocaleString("tr-TR")} TL</p>
        </div>
        <div className="flex gap-10">
          <button onClick={load} className="flex items-center gap-8 px-14 py-8 border border-[0.5px] border-border-default rounded-btn text-[12px] text-muted-text bg-surface-container-lowest hover:border-primary">
            <RefreshCw size={12} /> Yenile
          </button>
          <button onClick={exportCSV} className="flex items-center gap-8 px-14 py-8 border border-[0.5px] border-border-default rounded-btn text-[12px] text-muted-text bg-surface-container-lowest hover:border-primary">
            <Download size={12} /> CSV
          </button>
          <button
            onClick={runExpiryCheck}
            disabled={runningExpiry}
            className="flex items-center gap-8 px-14 py-8 border border-[0.5px] border-border-default rounded-btn text-[12px] text-muted-text bg-surface-container-lowest hover:border-primary disabled:opacity-60"
            title="Süresi dolan ilanları ve abonelikleri kapat"
          >
            <RefreshCw size={12} className={runningExpiry ? "animate-spin" : ""} /> Süreleri Kontrol Et
          </button>
          {expiringSoon.length > 0 && (
            <button
              onClick={sendExpiryReminders}
              disabled={sendingReminders || remindersSent > 0}
              className="flex items-center gap-8 px-14 py-8 bg-amber-500 text-white rounded-btn text-[12px] font-medium hover:opacity-90 disabled:opacity-60"
              title="Süresi dolmak üzere olan bayilere bildirim gönder"
            >
              <Bell size={12} />
              {remindersSent > 0 ? `${remindersSent} hatırlatıcı gönderildi` : sendingReminders ? "Gönderiliyor..." : `${expiringSoon.length} Hatırlatıcı Gönder`}
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      <div className="flex flex-col gap-10">
        {expiryResult && (
          <AlertBox type="info" icon={<CheckCircle size={14} />} message={expiryResult} />
        )}
        {pending.length > 0 && (
          <AlertBox type="info" icon={<Clock size={14} />} message={`${pending.length} bayi ödeme onayı bekliyor`} />
        )}
        {expiringSoon.length > 0 && (
          <AlertBox type="warning" icon={<AlertTriangle size={14} />} message={`${expiringSoon.length} abonelik 7 gün içinde sona eriyor`} />
        )}
        {expired.length > 0 && (
          <AlertBox type="error" icon={<AlertTriangle size={14} />} message={`${expired.length} abonelik sona erdi`} />
        )}
      </div>

      {payments.length > 0 && (
        <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card overflow-hidden">
          <div className="p-16 border-b border-[0.5px] border-border-default">
            <h2 className="text-[16px] font-semibold text-on-surface">Ödeme İstekleri</h2>
            <p className="text-[12px] text-muted-text mt-3">Bayi panelinden başlatılan açık ödeme talepleri.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead>
                <tr className="border-b border-[0.5px] border-border-default bg-surface">
                  {["Bayi", "Plan", "Tutar", "Sağlayıcı", "Durum", "Tarih", "İşlem"].map((h) => (
                    <th key={h} className="py-11 px-12 text-[10px] font-medium text-muted-text uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-[0.5px] border-border-default last:border-0">
                    <td className="py-12 px-12 text-[12px] font-medium text-on-surface">
                      <div>{p.dealer?.company_name || "—"}</div>
                      <div className="text-[10px] text-muted-text">{p.dealer?.city || ""}</div>
                    </td>
                    <td className="py-12 px-12 text-[12px] capitalize text-on-surface">{p.plan_slug}</td>
                    <td className="py-12 px-12 text-[12px] text-primary font-semibold">{p.amount.toLocaleString("tr-TR")} TL</td>
                    <td className="py-12 px-12 text-[12px] text-muted-text">{p.provider}</td>
                    <td className="py-12 px-12 text-[12px] text-muted-text">{p.status}</td>
                    <td className="py-12 px-12 text-[11px] text-muted-text">{new Date(p.created_at).toLocaleDateString("tr-TR")}</td>
                    <td className="py-12 px-12">
                      <button
                        onClick={() => markPaymentPaid(p)}
                        disabled={saving}
                        className="inline-flex items-center gap-6 px-10 py-7 bg-green-600 text-white rounded-btn text-[11px] font-semibold hover:opacity-90 disabled:opacity-60"
                      >
                        <CheckCircle size={12} />
                        Ödendi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[0.5px] border-border-default bg-surface">
                {["Bayi", "Plan", "Tutar/Ay", "Başlangıç", "Bitiş", "Kalan", "Durum", "Not", "WA", "İşlemler"].map((h) => (
                  <th key={h} className="py-12 px-12 text-[10px] font-medium text-muted-text uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="py-32 text-center text-muted-text text-[13px]">Yükleniyor...</td></tr>
              ) : dealers.map((d) => {
                const endDate = d.subscription_end ? new Date(d.subscription_end) : null;
                const daysLeft = endDate ? Math.ceil((endDate.getTime() - Date.now()) / 86400000) : null;
                const isExpiring = daysLeft !== null && daysLeft <= 7 && daysLeft > 0;
                const isExpired = daysLeft !== null && daysLeft <= 0;

                return (
                  <tr key={d.id} className={cn(
                    "border-b border-[0.5px] border-border-default last:border-0 hover:bg-surface transition-colors",
                    isExpiring && "bg-amber-50/30",
                    isExpired && "bg-red-50/20"
                  )}>
                    <td className="py-12 px-12 text-[12px] font-medium text-on-surface">
                      <div>{d.company_name}</div>
                      <div className="text-[10px] text-muted-text">{d.city}</div>
                    </td>
                    <td className="py-12 px-12 text-[12px] text-on-surface capitalize">{d.subscription_plan || "—"}</td>
                    <td className="py-12 px-12 text-[12px] text-primary font-semibold">
                      {d.subscription_plan ? `${PLAN_PRICES[d.subscription_plan].toLocaleString("tr-TR")} TL` : "—"}
                    </td>
                    <td className="py-12 px-12 text-[11px] text-muted-text">{d.subscription_start?.slice(0, 10) || "—"}</td>
                    <td className="py-12 px-12 text-[11px] text-muted-text">{d.subscription_end?.slice(0, 10) || "—"}</td>
                    <td className="py-12 px-12">
                      {daysLeft !== null ? (
                        <span className={cn("text-[11px] font-medium",
                          isExpired ? "text-red-600" : isExpiring ? "text-amber-600" : "text-green-600"
                        )}>
                          {isExpired ? "Süresi doldu" : `${daysLeft}g`}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="py-12 px-12">
                      <StatusBadge status={d.subscription_status} />
                    </td>
                    <td className="py-12 px-12 text-[10px] text-muted-text max-w-[120px] truncate">{d.notes || "—"}</td>
                    <td className="py-12 px-12">
                      {(d.whatsapp || d.phone) && (
                        <a
                          href={externalRoutes.whatsapp(
                            (d.whatsapp || d.phone).replace(/\D/g, ""),
                            `Merhaba ${d.contact_name}, ${d.subscription_plan} aboneliğiniz${isExpired ? " sona erdi" : ` ${daysLeft} gün içinde sona eriyor`}. Yenileme için bilgi almak ister misiniz?`
                          )}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center justify-center w-[26px] h-[26px] bg-[#25D366] text-white rounded-full text-[10px] hover:opacity-80"
                          title="WhatsApp ile yaz"
                        >
                          WA
                        </a>
                      )}
                    </td>
                    <td className="py-12 px-12">
                      <div className="flex items-center gap-6">
                        {(d.subscription_status === "pending" || d.subscription_status === "expired") && (
                          <button
                            onClick={() => { setActivateTarget(d); setActivatePlan((d.subscription_plan as typeof activatePlan) || "basic"); }}
                            className="p-6 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Ödeme Alındı"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {d.subscription_status === "active" && (
                          <button
                            onClick={() => setExtendTarget(d.id)}
                            className="p-6 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Uzat"
                          >
                            <Clock size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activate modal */}
      {activateTarget && (
        <Modal title={`Ödeme Alındı — ${activateTarget.company_name}`} onClose={() => setActivateTarget(null)}>
          <div className="flex flex-col gap-14 mb-16">
            <div>
              <label className="text-[12px] font-medium text-on-surface block mb-6">Plan</label>
              <select value={activatePlan} onChange={(e) => setActivatePlan(e.target.value as typeof activatePlan)} className="w-full px-14 py-10 border border-[0.5px] border-border-default rounded-input text-[13px] bg-surface outline-none focus:border-primary">
                {PLANS.map((p) => <option key={p} value={p}>{p} — {PLAN_PRICES[p].toLocaleString("tr-TR")} TL/ay</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-on-surface block mb-6">Ödeme Notu (iç kullanım)</label>
              <input value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} placeholder="Ziraat'tan 9.999 TL alındı..." className="w-full px-14 py-10 border border-[0.5px] border-border-default rounded-input text-[13px] bg-surface outline-none focus:border-primary" />
            </div>
          </div>
          <div className="flex gap-10 justify-end">
            <button onClick={() => setActivateTarget(null)} className="px-20 py-10 text-[13px] text-muted-text">İptal</button>
            <button onClick={activate} disabled={saving} className="px-20 py-10 bg-green-600 text-white text-[13px] font-semibold rounded-btn hover:opacity-90 disabled:opacity-60">Aktifleştir</button>
          </div>
        </Modal>
      )}

      {/* Extend modal */}
      {extendTarget && (
        <Modal title="Abonelik Uzat" onClose={() => setExtendTarget(null)}>
          <p className="text-[13px] text-muted-text mb-14">Kaç gün uzatılsın?</p>
          <input type="number" value={extendDays} onChange={(e) => setExtendDays(e.target.value)} min="1" className="w-full px-14 py-10 border border-[0.5px] border-border-default rounded-input text-[13px] bg-surface outline-none focus:border-primary mb-16" />
          <div className="flex gap-10 justify-end">
            <button onClick={() => setExtendTarget(null)} className="px-20 py-10 text-[13px] text-muted-text">İptal</button>
            <button onClick={extend} disabled={saving} className="px-20 py-10 bg-primary text-white text-[13px] font-semibold rounded-btn hover:opacity-90 disabled:opacity-60">Uzat</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    active: "bg-green-100 text-green-700",
    suspended: "bg-red-100 text-red-600",
    expired: "bg-gray-100 text-gray-500",
  };
  const labels: Record<string, string> = {
    pending: "Bekliyor", active: "Aktif", suspended: "Askıda", expired: "Doldu",
  };
  return <span className={cn("inline-block px-8 py-4 rounded-full text-[11px] font-medium", map[status] || "bg-gray-100 text-gray-500")}>{labels[status] || status}</span>;
}

function AlertBox({ type, icon, message }: { type: string; icon: React.ReactNode; message: string }) {
  const cls = type === "info" ? "bg-blue-50 border-blue-200 text-blue-700" : type === "warning" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-red-50 border-red-200 text-red-700";
  return (
    <div className={cn("flex items-center gap-10 px-16 py-12 rounded-card border text-[13px] font-medium", cls)}>
      {icon} {message}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-16 bg-black/50">
      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card w-full max-w-[480px] p-24">
        <div className="flex items-center justify-between gap-12 mb-14">
          <h3 className="text-[16px] font-semibold text-on-surface">{title}</h3>
          {onClose && (
            <button onClick={onClose} className="p-4 text-muted-text hover:text-on-surface" aria-label="Kapat">
              <X size={18} />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
