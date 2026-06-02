"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dealer } from "@/types/marketplace";
import { Check, CreditCard, Clock, ExternalLink, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    slug: "basic",
    name: "Basic",
    price: 4999,
    days: 30,
    features: ["5 aktif ilan", "30 gün ilan süresi", "Temel bayi paneli"],
  },
  {
    slug: "professional",
    name: "Professional",
    price: 9999,
    days: 60,
    features: ["15 aktif ilan", "60 gün ilan süresi", "Analitik paneli", "2 öne çıkan ilan"],
  },
  {
    slug: "premium",
    name: "Premium",
    price: 19999,
    days: 90,
    features: ["Limitsiz ilan", "90 gün ilan süresi", "Onaylı bayi rozeti", "5 öne çıkan ilan"],
  },
] as const;

type PlanSlug = (typeof PLANS)[number]["slug"];

type Payment = {
  id: string;
  plan_slug: PlanSlug;
  provider: string;
  status: string;
  amount: number;
  checkout_url: string | null;
  created_at: string;
  paid_at: string | null;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusLabel(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Onay Bekliyor", cls: "bg-amber-100 text-amber-700" },
    checkout_created: { label: "Ödeme Linki Açık", cls: "bg-blue-100 text-blue-700" },
    paid: { label: "Ödendi", cls: "bg-green-100 text-green-700" },
    failed: { label: "Başarısız", cls: "bg-red-100 text-red-600" },
    cancelled: { label: "İptal", cls: "bg-gray-100 text-gray-500" },
  };
  return map[status] || { label: status, cls: "bg-gray-100 text-gray-500" };
}

export default function DealerSubscriptionPage() {
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<PlanSlug | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const [{ data: dealerData }, paymentResponse] = await Promise.all([
      supabase.from("hazaral_dealers").select("*").eq("user_id", session.user.id).single(),
      fetch("/api/dealer/subscription/payments", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).catch(() => null),
    ]);

    setDealer((dealerData as Dealer) || null);
    if (paymentResponse?.ok) {
      const data = await paymentResponse.json();
      setPayments((data.payments as Payment[]) || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function requestPayment(plan: PlanSlug) {
    setRequesting(plan);
    setMessage("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setMessage("Oturum bulunamadı.");
      setRequesting(null);
      return;
    }

    const response = await fetch("/api/dealer/subscription/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data.error || "Ödeme isteği oluşturulamadı.");
      setRequesting(null);
      return;
    }

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return;
    }

    setMessage(data.manualInstructions?.body || "Ödeme isteğiniz alındı. Admin onayı bekleniyor.");
    await load();
    setRequesting(null);
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-16">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[160px] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card animate-pulse" />
        ))}
      </div>
    );
  }

  const activePlan = dealer?.subscription_plan || "basic";
  const daysLeft = dealer?.subscription_end
    ? Math.ceil((new Date(dealer.subscription_end).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
        <div>
          <h1 className="text-[22px] font-bold text-on-surface tracking-[-0.5px]">Abonelik</h1>
          <p className="text-[13px] text-muted-text mt-4">Planınızı yenileyin veya yükseltin.</p>
        </div>
        {dealer && (
          <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card px-16 py-12 text-[12px] text-muted-text">
            Aktif plan: <strong className="text-on-surface capitalize">{activePlan}</strong>
            {daysLeft !== null && (
              <span className={cn("ml-8 font-semibold", daysLeft <= 7 ? "text-amber-600" : "text-green-600")}>
                {daysLeft > 0 ? `${daysLeft} gün kaldı` : "Süresi doldu"}
              </span>
            )}
          </div>
        )}
      </div>

      {message && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-card p-14 text-[13px]">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {PLANS.map((plan) => {
          const isCurrent = activePlan === plan.slug && dealer?.subscription_status === "active";
          return (
            <div
              key={plan.slug}
              className={cn(
                "bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-20 flex flex-col gap-16",
                isCurrent && "border-primary shadow-sm",
              )}
            >
              <div className="flex items-start justify-between gap-12">
                <div>
                  <h2 className="text-[18px] font-bold text-on-surface">{plan.name}</h2>
                  <p className="text-[12px] text-muted-text mt-3">{plan.days} gün geçerli</p>
                </div>
                {plan.slug === "premium" ? (
                  <ShieldCheck size={22} className="text-primary" />
                ) : plan.slug === "professional" ? (
                  <Zap size={22} className="text-amber-500" />
                ) : (
                  <CreditCard size={22} className="text-muted-text" />
                )}
              </div>

              <div className="text-[28px] font-bold text-primary">{formatPrice(plan.price)}</div>

              <div className="flex flex-col gap-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-8 text-[13px] text-on-surface">
                    <Check size={14} className="text-green-600 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={() => requestPayment(plan.slug)}
                disabled={requesting !== null}
                className={cn(
                  "mt-auto flex items-center justify-center gap-8 rounded-btn px-18 py-11 text-[13px] font-semibold transition-opacity disabled:opacity-60",
                  isCurrent
                    ? "border border-[0.5px] border-primary text-primary bg-primary/5"
                    : "bg-primary text-white hover:opacity-90",
                )}
              >
                <CreditCard size={15} />
                {requesting === plan.slug ? "Hazırlanıyor..." : isCurrent ? "Planı Yenile" : "Planı Seç"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card overflow-hidden">
        <div className="p-18 border-b border-[0.5px] border-border-default">
          <h2 className="text-[16px] font-semibold text-on-surface">Ödeme Geçmişi</h2>
        </div>
        {payments.length === 0 ? (
          <div className="p-24 text-[13px] text-muted-text flex items-center gap-8">
            <Clock size={15} />
            Henüz ödeme isteği bulunmuyor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-[0.5px] border-border-default">
                  {["Tarih", "Plan", "Tutar", "Sağlayıcı", "Durum", "Link"].map((h) => (
                    <th key={h} className="px-14 py-11 text-[11px] font-medium text-muted-text uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => {
                  const s = statusLabel(payment.status);
                  return (
                    <tr key={payment.id} className="border-b border-[0.5px] border-border-default last:border-0">
                      <td className="px-14 py-12 text-[12px] text-muted-text">{new Date(payment.created_at).toLocaleDateString("tr-TR")}</td>
                      <td className="px-14 py-12 text-[12px] text-on-surface capitalize">{payment.plan_slug}</td>
                      <td className="px-14 py-12 text-[12px] text-primary font-semibold">{formatPrice(payment.amount)}</td>
                      <td className="px-14 py-12 text-[12px] text-muted-text">{payment.provider}</td>
                      <td className="px-14 py-12">
                        <span className={cn("inline-flex px-8 py-4 rounded-full text-[11px] font-medium", s.cls)}>{s.label}</span>
                      </td>
                      <td className="px-14 py-12">
                        {payment.checkout_url ? (
                          <a href={payment.checkout_url} className="inline-flex items-center gap-5 text-[12px] text-primary hover:underline">
                            Aç <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-[12px] text-muted-text">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
