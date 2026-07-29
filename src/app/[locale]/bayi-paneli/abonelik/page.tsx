"use client";

import { CheckCircle } from "lucide-react";
import { Link } from "@/i18n/routing";

// Paid plans are disabled for launch — membership and listings are free.
// The old plan/payment UI lives in git history if pricing comes back.
export default function AbonelikPage() {
  return (
    <div className="max-w-[560px] mx-auto py-40 px-16 text-center">
      <div className="w-[64px] h-[64px] bg-green-100 rounded-full flex items-center justify-center mx-auto mb-20">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h1 className="text-[24px] font-bold text-on-surface mb-12">Üyelik Ücretsiz</h1>
      <p className="text-[14px] text-muted-text leading-relaxed mb-24">
        Şu anda Otograde&apos;de üyelik ve ilan yayınlama tamamen ücretsizdir.
        Dilediğiniz kadar ilan ekleyebilir, alıcılarla doğrudan iletişime geçebilirsiniz.
      </p>
      <Link
        href={"/bayi-paneli/ilan-ekle" as never}
        className="inline-flex items-center justify-center bg-primary text-white px-32 py-14 rounded-btn text-[14px] font-semibold hover:opacity-90"
      >
        Ücretsiz İlan Ekle
      </Link>
    </div>
  );
}
