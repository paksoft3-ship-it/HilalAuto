"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackContactFormSubmit } from "@/lib/tracking";

const schema = z.object({
  adSoyad: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır.").trim(),
  telefon: z.string().min(10, "Geçerli bir telefon giriniz.").trim(),
  mesaj: z.string().min(10, "Mesaj en az 10 karakter olmalıdır.").max(500).trim(),
});

type FormData = z.infer<typeof schema>;

function baseInputClass(hasError?: boolean) {
  return cn(
    "w-full bg-white border border-[0.5px] border-border-default rounded-input px-16 py-12",
    "text-[14px] text-text-primary placeholder:text-text-soft outline-none transition-colors",
    "focus:border-accent",
    hasError && "border-red-400"
  );
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormData) {
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.adSoyad,
          phone: values.telefon,
          message: values.mesaj,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Mesaj gönderilemedi. Lütfen tekrar deneyin.");
      }
      trackContactFormSubmit();
      setSent(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center gap-12 py-24">
        <div className="flex items-center justify-center w-[48px] h-[48px] bg-accent-light border border-[0.5px] border-accent-border rounded-full">
          <CheckCircle size={24} strokeWidth={1.5} className="text-accent" aria-hidden />
        </div>
        <p className="text-[14px] font-medium text-text-primary">Mesajınız alındı!</p>
        <p className="text-[13px] text-text-muted">En kısa sürede size dönüş yapacağız.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-16">
      <div>
        <label htmlFor="cf-name" className="text-[13px] font-medium text-text-primary">Ad Soyad *</label>
        <input id="cf-name" type="text" placeholder="Adınız Soyadınız" className={cn(baseInputClass(!!errors.adSoyad), "mt-4")} {...register("adSoyad")} />
        {errors.adSoyad && <p className="text-[12px] text-red-500 mt-4" role="alert">{errors.adSoyad.message}</p>}
      </div>
      <div>
        <label htmlFor="cf-phone" className="text-[13px] font-medium text-text-primary">Telefon *</label>
        <input id="cf-phone" type="tel" placeholder="05xx xxx xx xx" className={cn(baseInputClass(!!errors.telefon), "mt-4")} {...register("telefon")} />
        {errors.telefon && <p className="text-[12px] text-red-500 mt-4" role="alert">{errors.telefon.message}</p>}
      </div>
      <div>
        <label htmlFor="cf-msg" className="text-[13px] font-medium text-text-primary">Mesaj *</label>
        <textarea id="cf-msg" rows={4} placeholder="Mesajınızı yazın..." className={cn(baseInputClass(!!errors.mesaj), "mt-4 resize-none")} {...register("mesaj")} />
        {errors.mesaj && <p className="text-[12px] text-red-500 mt-4" role="alert">{errors.mesaj.message}</p>}
      </div>
      {serverError && <p className="text-[12px] text-red-500" role="alert">{serverError}</p>}
      <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center bg-accent text-white py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity disabled:opacity-60">
        {isSubmitting ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
