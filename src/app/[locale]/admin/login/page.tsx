/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      setLoading(false);
    } else {
      router.push('/admin', { locale: locale as any });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-16">
      <div className="w-full max-w-[400px] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] p-32 shadow-sm">
        <div className="text-center mb-32">
          <Link href="/" className="inline-block text-[24px] font-bold text-on-surface tracking-[-1px] mb-8">
            Hazar<span className="text-primary">Al</span>
          </Link>
          <h1 className="text-[18px] font-medium text-on-surface">Yönetim Paneli</h1>
          <p className="text-[13px] text-muted-text mt-4">Devam etmek için giriş yapın</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-16">
          {error && (
            <div className="flex items-center gap-8 bg-red-50 text-red-600 p-12 rounded-lg text-[13px]">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="sr-only" htmlFor="email">E-posta</label>
            <div className="relative">
              <Mail className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-text" size={16} />
              <input
                id="email"
                type="email"
                required
                placeholder="E-posta adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-40 pr-16 py-12 bg-surface border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="sr-only" htmlFor="password">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-text" size={16} />
              <input
                id="password"
                type="password"
                required
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-40 pr-16 py-12 bg-surface border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-12 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity disabled:opacity-70 mt-8"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
