/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, RefreshCw } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";

export default function AdminCars() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useParams()?.locale as string ?? "tr";

  async function fetchCars() {
    setLoading(true);
    const { data } = await supabase.from("hazaral_cars").select("*").order("created_at", { ascending: false });
    setCars(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchCars();
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase.from("hazaral_cars").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setCars(cars.map(car => car.id === id ? { ...car, status: newStatus } : car));
    }
  }

  async function deleteCar(id: string) {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("hazaral_cars").delete().eq("id", id);
    if (!error) {
      setCars(cars.filter(car => car.id !== id));
    }
  }

  return (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-16">
        <div>
          <h1 className="text-[24px] font-bold text-on-surface tracking-[-1px]">Satılık Araçlar</h1>
          <p className="text-[14px] text-muted-text mt-4">Pazaryerinde sergilenen hasarlı araç ilanlarınızı yönetin.</p>
        </div>
        <div className="flex gap-12">
          <button 
            onClick={fetchCars}
            className="inline-flex items-center gap-8 px-16 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-btn text-[13px] font-medium text-on-surface hover:bg-surface transition-colors"
          >
            <RefreshCw size={14} /> Yenile
          </button>
          <button className="inline-flex items-center gap-8 px-16 py-8 bg-primary text-on-primary rounded-btn text-[13px] font-medium hover:opacity-90 transition-opacity">
            <Plus size={14} /> Yeni İlan Ekle
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[0.5px] border-border-default bg-surface">
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Görsel</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Araç Bilgisi</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Fiyat</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Hasar Türü</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Durum</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-32 text-center text-[14px] text-muted-text">Yükleniyor...</td>
                </tr>
              ) : cars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-32 text-center text-[14px] text-muted-text">Henüz ilan bulunmuyor.</td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr key={car.id} className="border-b border-[0.5px] border-border-default last:border-0 hover:bg-surface transition-colors">
                    <td className="py-16 px-16">
                      <div className="w-[60px] h-[40px] bg-surface border border-[0.5px] border-border-default rounded flex items-center justify-center overflow-hidden">
                        {car.images && car.images.length > 0 ? (
                          <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={16} className="text-muted-text" />
                        )}
                      </div>
                    </td>
                    <td className="py-16 px-16 text-[13px] text-on-surface">
                      <div className="font-medium">{car.title}</div>
                      <div className="text-[11px] text-muted-text mt-4">{car.brand} • {car.model_year}</div>
                    </td>
                    <td className="py-16 px-16 text-[13px] font-medium text-on-surface">
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(car.price)}
                    </td>
                    <td className="py-16 px-16 text-[13px] text-on-surface">
                      {car.damage_type}
                    </td>
                    <td className="py-16 px-16">
                      <select
                        value={car.status}
                        onChange={(e) => updateStatus(car.id, e.target.value)}
                        className={`text-[12px] font-medium outline-none cursor-pointer py-4 px-8 rounded-full border border-[0.5px] ${
                          car.status === 'available' ? 'bg-green-50 text-green-600 border-green-200' :
                          car.status === 'sold' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                          'bg-orange-50 text-orange-600 border-orange-200'
                        }`}
                      >
                        <option value="available">Satışta</option>
                        <option value="sold">Satıldı</option>
                        <option value="hidden">Gizli</option>
                      </select>
                    </td>
                    <td className="py-16 px-16 text-right">
                      <div className="flex items-center justify-end gap-12">
                        <Link 
                          href={{ pathname: "/satilik-araclar/[id]", params: { id: car.id.toString() } }} 
                          target="_blank"
                          className="p-8 text-muted-text hover:text-primary transition-colors"
                          title="Görüntüle"
                        >
                          <Eye size={16} />
                        </Link>
                        <button className="p-8 text-muted-text hover:text-blue-500 transition-colors" title="Düzenle">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteCar(car.id)} className="p-8 text-muted-text hover:text-red-500 transition-colors" title="Sil">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
