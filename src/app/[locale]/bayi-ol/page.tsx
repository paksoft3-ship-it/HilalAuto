"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Container } from "@/components/ui/Container";
import { CITIES } from "@/lib/constants";
import { CheckCircle, ChevronRight, ChevronLeft, Building2, User } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const STEPS = ["Hesap", "Firma", "Plan", "Onay"];

const PLANS = [
  {
    slug: "basic", name: "Basic", price: "4.999 TL/ay",
    features: ["5 ilan", "30 gün yayın", "Standart destek"],
    badge: null,
  },
  {
    slug: "professional", name: "Professional", price: "9.999 TL/ay",
    features: ["15 ilan", "60 gün yayın", "2 öne çıkan ilan", "Analitik paneli", "Öncelikli destek"],
    badge: "Popüler",
  },
  {
    slug: "premium", name: "Premium", price: "19.999 TL/ay",
    features: ["Sınırsız ilan", "90 gün yayın", "5 öne çıkan ilan", "Analitik + ısı haritası", "Onaylı Bayi rozeti", "Öncelikli destek"],
    badge: "Tam Özellik",
  },
];

type FormData = {
  email: string; password: string; confirmPassword: string;
  company_name: string; contact_name: string; phone: string;
  whatsapp: string; city: string; district: string; description: string;
  subscription_plan: string;
};

const INIT: FormData = {
  email: "", password: "", confirmPassword: "",
  company_name: "", contact_name: "", phone: "",
  whatsapp: "", city: "", district: "", description: "",
  subscription_plan: "professional",
};

export default function BayiOlPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INIT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof FormData, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function validateStep(): string {
    if (step === 0) {
      if (!form.email || !form.password) return "E-posta ve şifre zorunludur.";
      if (form.password.length < 8) return "Şifre en az 8 karakter olmalıdır.";
      if (form.password !== form.confirmPassword) return "Şifreler eşleşmiyor.";
    }
    if (step === 1) {
      if (!form.company_name || !form.contact_name || !form.phone || !form.city) {
        return "Zorunlu alanları doldurun.";
      }
    }
    return "";
  }

  function next() {
    const e = validateStep();
    if (e) { setError(e); return; }
    setError("");
    setStep((s) => s + 1);
  }

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dealer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          company_name: form.company_name,
          contact_name: form.contact_name,
          phone: form.phone,
          whatsapp: form.whatsapp || null,
          city: form.city,
          district: form.district || null,
          description: form.description || null,
          subscription_plan: form.subscription_plan,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kayıt sırasında bir hata oluştu.");
        setLoading(false);
        return;
      }
      // Sign in after successful registration
      await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      setDone(true);
    } catch {
      setError("Sunucu hatası. Lütfen tekrar deneyin.");
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-16">
        <div className="max-w-[480px] w-full text-center bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-40">
          <div className="w-[64px] h-[64px] bg-green-100 rounded-full flex items-center justify-center mx-auto mb-20">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-[24px] font-bold text-on-surface mb-12">Başvurunuz Alındı</h1>
          <p className="text-[14px] text-muted-text leading-relaxed mb-24">
            Başvurunuz inceleniyor. Onaylandıktan sonra e-posta ile bilgilendirileceksiniz.
            Genellikle 24 saat içinde dönüş yapılır.
          </p>
          <Link
            href="/bayi-paneli"
            className="inline-flex items-center justify-center w-full bg-primary text-white py-14 rounded-btn text-[14px] font-semibold hover:opacity-90"
          >
            Panele Git
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-60">
      <Container>
        <div className="max-w-[600px] mx-auto">
          {/* Header */}
          <div className="text-center mb-32">
            <h1 className="text-[28px] font-bold text-on-surface tracking-[-1px]">Bayi Başvurusu</h1>
            <p className="text-[14px] text-muted-text mt-8">
              Otograde&apos;de ilan yayınlamaya başlamak için birkaç adımı tamamlayın.
            </p>
            <div className="mt-12">
              <Link href="/bayi-paneli/giris" className="text-[13px] text-primary hover:underline">
                Zaten hesabınız var mı? Giriş yapın
              </Link>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-0 mb-32">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={cn(
                  "w-[32px] h-[32px] rounded-full flex items-center justify-center text-[12px] font-bold transition-colors",
                  i < step ? "bg-green-500 text-white" :
                  i === step ? "bg-primary text-white" :
                  "bg-surface-container-low text-muted-text"
                )}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={cn("text-[11px] mx-6", i === step ? "text-primary font-medium" : "text-muted-text")}>
                  {s}
                </span>
                {i < STEPS.length - 1 && <div className="w-[24px] h-px bg-border-default mx-4" />}
              </div>
            ))}
          </div>

          <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-32">
            {error && (
              <div className="bg-red-50 text-red-600 text-[13px] p-12 rounded-lg mb-20">{error}</div>
            )}

            {/* Step 0: Account */}
            {step === 0 && (
              <div className="flex flex-col gap-16">
                <h2 className="text-[18px] font-semibold text-on-surface flex items-center gap-8">
                  <User size={18} className="text-primary" /> Hesap Bilgileri
                </h2>
                <Input label="E-posta *" type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="bayi@firma.com" />
                <Input label="Şifre *" type="password" value={form.password} onChange={(v) => set("password", v)} placeholder="En az 8 karakter" />
                <Input label="Şifre Tekrar *" type="password" value={form.confirmPassword} onChange={(v) => set("confirmPassword", v)} placeholder="Şifreyi tekrarlayın" />
              </div>
            )}

            {/* Step 1: Company */}
            {step === 1 && (
              <div className="flex flex-col gap-16">
                <h2 className="text-[18px] font-semibold text-on-surface flex items-center gap-8">
                  <Building2 size={18} className="text-primary" /> Firma Bilgileri
                </h2>
                <Input label="Firma Adı *" value={form.company_name} onChange={(v) => set("company_name", v)} placeholder="ABC Oto Galeri" />
                <Input label="Yetkili Adı *" value={form.contact_name} onChange={(v) => set("contact_name", v)} placeholder="Ad Soyad" />
                <Input label="Telefon *" type="tel" value={form.phone} onChange={(v) => set("phone", v)} placeholder="05xx xxx xx xx" />
                <Input label="WhatsApp" type="tel" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} placeholder="905xxxxxxxxx (uluslararası format)" />
                <div className="flex flex-col gap-6">
                  <label className="text-[13px] font-medium text-on-surface">Şehir *</label>
                  <select
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    className="w-full px-14 py-12 bg-surface border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary"
                  >
                    <option value="">Şehir seçin...</option>
                    {Object.entries(CITIES).map(([, label]) => (
                      <option key={label} value={label}>{label}</option>
                    ))}
                  </select>
                </div>
                <Input label="İlçe" value={form.district} onChange={(v) => set("district", v)} placeholder="İlçe (isteğe bağlı)" />
                <div className="flex flex-col gap-6">
                  <label className="text-[13px] font-medium text-on-surface">Firma Hakkında</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={3}
                    placeholder="Firmanız hakkında kısa bilgi..."
                    className="w-full px-14 py-12 bg-surface border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Plan selection */}
            {step === 2 && (
              <div className="flex flex-col gap-16">
                <h2 className="text-[18px] font-semibold text-on-surface">Plan Seçimi</h2>
                <p className="text-[13px] text-muted-text">Başvurunuz onaylandıktan sonra ödeme talimatları iletilecektir.</p>
                <div className="flex flex-col gap-12">
                  {PLANS.map((plan) => (
                    <label
                      key={plan.slug}
                      className={cn(
                        "flex items-start gap-14 p-16 rounded-card border-2 cursor-pointer transition-colors",
                        form.subscription_plan === plan.slug
                          ? "border-primary bg-primary/5"
                          : "border-border-default hover:border-primary/40"
                      )}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.slug}
                        checked={form.subscription_plan === plan.slug}
                        onChange={() => set("subscription_plan", plan.slug)}
                        className="mt-1 accent-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-8 mb-4">
                          <span className="text-[15px] font-semibold text-on-surface">{plan.name}</span>
                          {plan.badge && (
                            <span className="bg-primary text-white text-[10px] font-semibold px-8 py-2 rounded-full">
                              {plan.badge}
                            </span>
                          )}
                          <span className="ml-auto text-[14px] font-bold text-primary">{plan.price}</span>
                        </div>
                        <ul className="flex flex-col gap-3">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-center gap-6 text-[12px] text-muted-text">
                              <CheckCircle size={11} className="text-green-500 shrink-0" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="flex flex-col gap-16">
                <h2 className="text-[18px] font-semibold text-on-surface">Başvuruyu Gözden Geçirin</h2>
                <ReviewRow label="E-posta" value={form.email} />
                <ReviewRow label="Firma" value={form.company_name} />
                <ReviewRow label="Yetkili" value={form.contact_name} />
                <ReviewRow label="Telefon" value={form.phone} />
                <ReviewRow label="Şehir" value={form.city} />
                <ReviewRow label="Plan" value={PLANS.find((p) => p.slug === form.subscription_plan)?.name || ""} />
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-14 text-[12px] text-amber-700">
                  Başvurunuz incelendikten sonra e-posta ile onay gönderilecek ve ödeme bilgileri iletilecektir.
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-24 pt-20 border-t border-[0.5px] border-border-default">
              {step > 0 ? (
                <button onClick={() => { setError(""); setStep((s) => s - 1); }} className="flex items-center gap-6 text-[13px] text-muted-text hover:text-on-surface">
                  <ChevronLeft size={16} /> Geri
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button
                  onClick={next}
                  className="flex items-center gap-8 bg-primary text-white px-24 py-12 rounded-btn text-[13px] font-semibold hover:opacity-90"
                >
                  Devam Et <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={loading}
                  className="flex items-center gap-8 bg-primary text-white px-24 py-12 rounded-btn text-[13px] font-semibold hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <label className="text-[13px] font-medium text-on-surface">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-14 py-12 bg-surface border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-8 border-b border-[0.5px] border-border-default last:border-0">
      <span className="text-[12px] text-muted-text">{label}</span>
      <span className="text-[13px] font-medium text-on-surface">{value}</span>
    </div>
  );
}
