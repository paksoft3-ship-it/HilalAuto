"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

export function DirectBuyingCTA() {
  const [form, setForm] = useState({ vehicle: "", phone: "", detail: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.vehicle.trim() || !form.phone.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/quick-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: form.vehicle,
          year: "Belirtilmedi",
          damage: form.detail || "Belirtilmedi",
          city: "Belirtilmedi",
          phone: form.phone,
        }),
      });
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section className="bg-[#111111] py-60" aria-label="Hızlı teklif al">
      <div className="max-w-[1240px] mx-auto px-16 md:px-24 flex flex-col md:flex-row items-start justify-between gap-44">
        {/* Left */}
        <div className="max-w-[500px]">
          <span className="text-[11px] font-medium text-primary uppercase tracking-wider">
            HIZLI SATIŞ
          </span>
          <h2 className="text-[32px] font-medium text-white tracking-[-1.5px] mt-8">
            Aracınızı doğrudan bize de satabilirsiniz.
          </h2>
          <p className="text-[14px] text-gray-400 mt-16 leading-relaxed">
            İlanla uğraşmak istemiyor musunuz? Aracınızın bilgilerini iletin, uzman ekibimiz en geç 15 dakika içinde nakit teklifimizi sunsun.
          </p>
          <ul className="mt-32 flex flex-col gap-12">
            {["15 Dakikada Teklif", "Aynı Gün Ödeme", "Yerinden Teslim Alım"].map((item) => (
              <li key={item} className="flex items-center gap-12 text-white text-[13px]">
                <CheckCircle size={18} className="text-primary shrink-0" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <div className="w-full md:w-[460px] bg-white rounded-xl p-32 shrink-0">
          <h3 className="text-[18px] font-medium text-[#111111] mb-24">Teklif Formu</h3>

          {status === "ok" ? (
            <div className="flex flex-col items-center gap-12 py-24 text-center">
              <CheckCircle size={40} className="text-primary" />
              <p className="text-[14px] font-medium text-[#111111]">Talebiniz alındı!</p>
              <p className="text-[13px] text-[#888888]">15 dakika içinde sizi arayacağız.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-16">
              <input
                value={form.vehicle}
                onChange={set("vehicle")}
                placeholder="Plaka veya Marka Model"
                required
                className="w-full bg-[#F9F9F9] border-[0.5px] border-[#EEEEEE] rounded-lg px-16 py-12 text-[14px] focus:border-primary focus:outline-none transition-colors"
              />
              <input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="Telefon Numaranız"
                required
                className="w-full bg-[#F9F9F9] border-[0.5px] border-[#EEEEEE] rounded-lg px-16 py-12 text-[14px] focus:border-primary focus:outline-none transition-colors"
              />
              <textarea
                value={form.detail}
                onChange={set("detail")}
                placeholder="Hasar Detayı (Opsiyonel)"
                rows={4}
                className="w-full bg-[#F9F9F9] border-[0.5px] border-[#EEEEEE] rounded-lg px-16 py-12 text-[14px] focus:border-primary focus:outline-none transition-colors resize-none"
                style={{ height: "100px" }}
              />
              {status === "err" && (
                <p className="text-[12px] text-red-500">Bir hata oluştu. Tekrar deneyin.</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-primary text-white py-16 rounded-lg font-medium text-[14px] hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {status === "loading" ? "Gönderiliyor..." : "Teklif Al"}
              </button>
              <p className="text-[11px] text-[#888888] text-center">
                Verileriniz KVKK kapsamında korunmaktadır.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
