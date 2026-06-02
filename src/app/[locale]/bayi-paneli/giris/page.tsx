"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function DealerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Giriş başarısız. E-posta veya şifrenizi kontrol edin.");
      setLoading(false);
    } else {
      router.push("/bayi-paneli" as never);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-16">
      <div className="w-full max-w-[400px] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-32 shadow-sm">
        <div className="text-center mb-28">
          <h1 className="text-[22px] font-bold text-on-surface tracking-[-0.5px]">Bayi Girişi</h1>
          <p className="text-[13px] text-muted-text mt-6">Otograde Bayi Paneline Giriş</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-16">
          {error && (
            <div className="flex items-center gap-8 bg-red-50 text-red-600 p-12 rounded-lg text-[13px]">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-14 top-1/2 -translate-y-1/2 text-muted-text" size={15} />
            <input
              type="email"
              required
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-42 pr-16 py-12 bg-surface border border-[0.5px] border-border-default rounded-input text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-14 top-1/2 -translate-y-1/2 text-muted-text" size={15} />
            <input
              type="password"
              required
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-42 pr-16 py-12 bg-surface border border-[0.5px] border-border-default rounded-input text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-13 rounded-btn font-semibold text-[14px] hover:opacity-90 transition-opacity disabled:opacity-70 mt-4"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="text-center mt-20 text-[13px] text-muted-text">
          Hesabınız yok mu?{" "}
          <Link href="/bayi-ol" className="text-primary hover:underline font-medium">
            Bayi Başvurusu
          </Link>
        </div>
      </div>
    </div>
  );
}
