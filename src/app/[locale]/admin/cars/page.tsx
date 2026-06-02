"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, RefreshCw, X } from "lucide-react";
import { Link } from "@/i18n/routing";

type CarRecord = {
  id: string;
  title: string;
  brand: string;
  model: string;
  model_year: number;
  damage_type: string;
  price: number;
  description: string | null;
  images: string[] | null;
  status: "available" | "sold" | "hidden";
  created_at: string;
};

type CarForm = {
  title: string;
  brand: string;
  model: string;
  model_year: string;
  damage_type: string;
  price: string;
  description: string;
  images: string;
  status: "available" | "sold" | "hidden";
};

const EMPTY_FORM: CarForm = {
  title: "",
  brand: "",
  model: "",
  model_year: "",
  damage_type: "",
  price: "",
  description: "",
  images: "",
  status: "available",
};

function toImageArray(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toForm(car: CarRecord): CarForm {
  return {
    title: car.title || "",
    brand: car.brand || "",
    model: car.model || "",
    model_year: car.model_year ? String(car.model_year) : "",
    damage_type: car.damage_type || "",
    price: car.price ? String(car.price) : "",
    description: car.description || "",
    images: (car.images || []).join("\n"),
    status: car.status || "available",
  };
}

export default function AdminCars() {
  const [cars, setCars] = useState<CarRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarRecord | null>(null);
  const [form, setForm] = useState<CarForm>(EMPTY_FORM);

  async function fetchCars() {
    setLoading(true);
    const { data, error } = await supabase
      .from("hazaral_cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Araç ilanları yüklenirken hata oluştu: " + error.message);
      setCars([]);
    } else {
      setCars((data as CarRecord[]) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchCars();
  }, []);

  function openCreate() {
    setEditingCar(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(car: CarRecord) {
    setEditingCar(car);
    setForm(toForm(car));
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingCar(null);
    setForm(EMPTY_FORM);
  }

  async function saveCar(e: React.FormEvent) {
    e.preventDefault();

    const modelYear = Number(form.model_year);
    const price = Number(form.price);

    if (!Number.isInteger(modelYear) || modelYear < 1900 || modelYear > new Date().getFullYear() + 1) {
      alert("Geçerli bir model yılı girin.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      alert("Geçerli bir fiyat girin.");
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      model_year: modelYear,
      damage_type: form.damage_type.trim(),
      price,
      description: form.description.trim() || null,
      images: toImageArray(form.images),
      status: form.status,
    };

    const request = editingCar
      ? supabase.from("hazaral_cars").update(payload).eq("id", editingCar.id).select().single()
      : supabase.from("hazaral_cars").insert(payload).select().single();

    const { data, error } = await request;

    if (error) {
      alert("İlan kaydedilirken hata oluştu: " + error.message);
      setSaving(false);
      return;
    }

    if (editingCar) {
      setCars((items) => items.map((item) => item.id === editingCar.id ? data as CarRecord : item));
    } else {
      setCars((items) => [data as CarRecord, ...items]);
    }

    setSaving(false);
    closeModal();
  }

  async function updateStatus(id: string, newStatus: CarRecord["status"]) {
    const { error } = await supabase.from("hazaral_cars").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setCars((items) => items.map((car) => car.id === id ? { ...car, status: newStatus } : car));
    } else {
      alert("Durum güncellenirken hata oluştu: " + error.message);
    }
  }

  async function deleteCar(id: string) {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("hazaral_cars").delete().eq("id", id);
    if (!error) {
      setCars((items) => items.filter((car) => car.id !== id));
    } else {
      alert("İlan silinirken hata oluştu: " + error.message);
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
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-8 px-16 py-8 bg-primary text-on-primary rounded-btn text-[13px] font-medium hover:opacity-90 transition-opacity"
          >
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
                      <div className="text-[11px] text-muted-text mt-4">{car.brand} {car.model} • {car.model_year}</div>
                    </td>
                    <td className="py-16 px-16 text-[13px] font-medium text-on-surface">
                      {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(car.price)}
                    </td>
                    <td className="py-16 px-16 text-[13px] text-on-surface">
                      {car.damage_type}
                    </td>
                    <td className="py-16 px-16">
                      <select
                        value={car.status}
                        onChange={(e) => updateStatus(car.id, e.target.value as CarRecord["status"])}
                        className={`text-[12px] font-medium outline-none cursor-pointer py-4 px-8 rounded-full border border-[0.5px] ${
                          car.status === "available" ? "bg-green-50 text-green-600 border-green-200" :
                          car.status === "sold" ? "bg-gray-100 text-gray-600 border-gray-200" :
                          "bg-orange-50 text-orange-600 border-orange-200"
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
                          href={{ pathname: "/satilik-araclar/[id]", params: { id: car.id } }}
                          target="_blank"
                          className="p-8 text-muted-text hover:text-primary transition-colors"
                          title="Görüntüle"
                        >
                          <Eye size={16} />
                        </Link>
                        <button onClick={() => openEdit(car)} className="p-8 text-muted-text hover:text-blue-500 transition-colors" title="Düzenle">
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

      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-16">
          <div className="flex max-h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-card border border-[0.5px] border-border-default bg-surface-container-lowest shadow-xl">
            <div className="flex items-center justify-between border-b border-[0.5px] border-border-default px-20 py-16">
              <h2 className="text-[17px] font-semibold text-on-surface">
                {editingCar ? "İlanı Düzenle" : "Yeni İlan Ekle"}
              </h2>
              <button onClick={closeModal} className="p-4 text-muted-text hover:text-on-surface">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveCar} className="flex-1 overflow-y-auto p-20">
              <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
                <Field label="İlan Başlığı *">
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Marka *">
                  <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Model *">
                  <input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Model Yılı *">
                  <input required type="number" min="1900" max={new Date().getFullYear() + 1} value={form.model_year} onChange={(e) => setForm({ ...form, model_year: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Hasar Türü *">
                  <input required value={form.damage_type} onChange={(e) => setForm({ ...form, damage_type: e.target.value })} placeholder="Kazalı, Pert, Sel Hasarlı..." className={inputCls} />
                </Field>
                <Field label="Fiyat (TL) *">
                  <input required type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Durum">
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CarForm["status"] })} className={inputCls}>
                    <option value="available">Satışta</option>
                    <option value="sold">Satıldı</option>
                    <option value="hidden">Gizli</option>
                  </select>
                </Field>
                <Field label="Görsel URL'leri">
                  <textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} rows={3} placeholder="Her satıra bir görsel URL'si" className={textareaCls} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Açıklama">
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} className={textareaCls} />
                  </Field>
                </div>
              </div>

              <div className="mt-20 flex justify-end gap-10 border-t border-[0.5px] border-border-default pt-16">
                <button type="button" onClick={closeModal} className="px-20 py-10 text-[13px] text-muted-text hover:text-on-surface">
                  İptal
                </button>
                <button type="submit" disabled={saving} className="rounded-btn bg-primary px-22 py-10 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-60">
                  {saving ? "Kaydediliyor..." : editingCar ? "Değişiklikleri Kaydet" : "İlanı Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full px-14 py-10 rounded-input border border-[0.5px] border-border-default bg-surface text-[13px] outline-none focus:border-primary";
const textareaCls = `${inputCls} resize-none`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-6">
      <span className="text-[12px] font-medium text-on-surface">{label}</span>
      {children}
    </label>
  );
}
