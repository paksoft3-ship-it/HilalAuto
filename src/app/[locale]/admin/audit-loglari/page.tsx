"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RefreshCw, ShieldCheck } from "lucide-react";

type AuditLog = {
  id: string;
  admin_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

function formatMetadata(metadata: Record<string, unknown>) {
  const entries = Object.entries(metadata || {}).filter(([, value]) => value !== null && value !== undefined && value !== "");
  if (entries.length === 0) return "—";
  return entries.slice(0, 4).map(([key, value]) => `${key}: ${String(value)}`).join(" · ");
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    const response = await fetch("/api/admin/audit?limit=80", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    }).catch(() => null);

    if (response?.ok) {
      const data = await response.json();
      setLogs((data.logs as AuditLog[]) || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
        <div>
          <h1 className="text-[24px] font-bold text-on-surface tracking-[-1px] flex items-center gap-10">
            <ShieldCheck size={22} className="text-primary" />
            Audit Logları
          </h1>
          <p className="text-[13px] text-muted-text mt-4">Admin panelindeki kritik işlemler.</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-8 px-14 py-9 border border-[0.5px] border-border-default rounded-btn text-[12px] text-muted-text bg-surface-container-lowest hover:border-primary"
        >
          <RefreshCw size={12} />
          Yenile
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-[0.5px] border-border-default">
                {["Tarih", "Admin", "Aksiyon", "Varlık", "Detay"].map((h) => (
                  <th key={h} className="px-14 py-12 text-[11px] font-medium text-muted-text uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-36 text-center text-[13px] text-muted-text">Yükleniyor...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="py-36 text-center text-[13px] text-muted-text">Henüz audit kaydı yok.</td></tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="border-b border-[0.5px] border-border-default last:border-0 hover:bg-surface">
                  <td className="px-14 py-12 text-[12px] text-muted-text whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString("tr-TR")}
                  </td>
                  <td className="px-14 py-12 text-[12px] text-on-surface">{log.admin_email || "Sistem"}</td>
                  <td className="px-14 py-12 text-[12px] font-semibold text-primary">{log.action}</td>
                  <td className="px-14 py-12 text-[12px] text-muted-text">
                    {log.entity_type}
                    {log.entity_id && <div className="text-[10px] truncate max-w-[180px]">{log.entity_id}</div>}
                  </td>
                  <td className="px-14 py-12 text-[12px] text-muted-text max-w-[360px] truncate">
                    {formatMetadata(log.metadata)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
