"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Upload, X, AlertCircle } from "lucide-react";
import { routes } from "@/lib/routes";
import { trackFormStep, trackFormSubmit, trackLeadSuccess } from "@/lib/tracking";
import { fireGoogleAdsConversion } from "@/lib/gtag";
import {
  quoteStep1Schema,
  quoteStep2Schema,
  quoteStep3Schema,
  type QuoteStep1,
  type QuoteStep2,
  type QuoteStep3,
} from "@/lib/validations";
import {
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  DAMAGE_TYPES,
  MAX_PHOTO_FILES,
  MAX_PHOTO_SIZE_MB,
  MAX_PHOTO_SIZE_BYTES,
  ALLOWED_PHOTO_TYPES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => String(CURRENT_YEAR - i));

const STEPS = [
  { num: 1, label: "İletişim" },
  { num: 2, label: "Araç Bilgileri" },
  { num: 3, label: "Onay" },
];

// ── Step progress indicator ───────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between relative mb-32 md:mb-44">
      <div
        className="absolute top-[16px] left-0 w-full h-[1px] bg-border-default -z-0"
        aria-hidden
      />
      {STEPS.map((step) => {
        const done = step.num < current;
        const active = step.num === current;
        return (
          <div key={step.num} className="flex flex-col items-center gap-8 bg-white px-4 relative z-10">
            <div
              className={cn(
                "w-[32px] h-[32px] rounded-full flex items-center justify-center text-[13px] font-medium border border-[0.5px] transition-colors",
                done && "bg-accent border-accent text-white",
                active && "bg-accent border-accent text-white",
                !done && !active && "bg-white border-border-default text-text-soft"
              )}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check size={15} strokeWidth={2} aria-hidden /> : step.num}
            </div>
            <span
              className={cn(
                "text-[11px] font-medium uppercase tracking-wider",
                active ? "text-accent" : "text-text-soft"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Field components ───────────────────────────────────────────────────────────
function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[13px] font-medium text-text-primary">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[12px] text-red-500 flex items-center gap-4 mt-4" role="alert">
      <AlertCircle size={12} aria-hidden />
      {message}
    </p>
  );
}

function baseInputClass(hasError?: boolean) {
  return cn(
    "w-full bg-white border border-[0.5px] border-border-default rounded-input px-16 py-12",
    "text-[14px] text-text-primary placeholder:text-text-soft outline-none transition-colors",
    "focus:border-accent",
    hasError && "border-red-400 focus:border-red-500"
  );
}

// ── Step 1 ────────────────────────────────────────────────────────────────────
function Step1({ onNext }: { onNext: (data: QuoteStep1) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteStep1>({ resolver: zodResolver(quoteStep1Schema) });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="flex flex-col gap-16">
      <div>
        <FieldLabel htmlFor="adSoyad">Ad Soyad *</FieldLabel>
        <input
          id="adSoyad"
          type="text"
          placeholder="Adınız Soyadınız"
          autoComplete="name"
          className={cn(baseInputClass(!!errors.adSoyad), "mt-4")}
          aria-invalid={!!errors.adSoyad}
          aria-describedby={errors.adSoyad ? "adSoyad-err" : undefined}
          {...register("adSoyad")}
        />
        <FieldError message={errors.adSoyad?.message} />
      </div>

      <div>
        <FieldLabel htmlFor="telefon">Telefon Numarası *</FieldLabel>
        <input
          id="telefon"
          type="tel"
          placeholder="05xx xxx xx xx"
          autoComplete="tel"
          className={cn(baseInputClass(!!errors.telefon), "mt-4")}
          aria-invalid={!!errors.telefon}
          {...register("telefon")}
        />
        <FieldError message={errors.telefon?.message} />
      </div>

      <div className="grid grid-cols-2 gap-12">
        <div>
          <FieldLabel htmlFor="il">İl *</FieldLabel>
          <input
            id="il"
            type="text"
            placeholder="İstanbul"
            className={cn(baseInputClass(!!errors.il), "mt-4")}
            aria-invalid={!!errors.il}
            {...register("il")}
          />
          <FieldError message={errors.il?.message} />
        </div>
        <div>
          <FieldLabel htmlFor="ilce">İlçe</FieldLabel>
          <input
            id="ilce"
            type="text"
            placeholder="Kadıköy"
            className={cn(baseInputClass(!!errors.ilce), "mt-4")}
            {...register("ilce")}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-8 bg-accent text-white py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity mt-8"
      >
        Devam Et
        <ChevronRight size={16} strokeWidth={1.5} aria-hidden />
      </button>
    </form>
  );
}

// ── Step 2 ────────────────────────────────────────────────────────────────────
interface Step2Props {
  onNext: (data: QuoteStep2) => void;
  onBack: () => void;
  photos: File[];
  setPhotos: (files: File[]) => void;
}

function Step2({ onNext, onBack, photos, setPhotos }: Step2Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<QuoteStep2>({ resolver: zodResolver(quoteStep2Schema) });

  const [photoError, setPhotoError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const combined = [...photos, ...files].slice(0, MAX_PHOTO_FILES);
    const invalid = combined.find(
      (f) => !ALLOWED_PHOTO_TYPES.includes(f.type as (typeof ALLOWED_PHOTO_TYPES)[number])
    );
    const oversize = combined.find((f) => f.size > MAX_PHOTO_SIZE_BYTES);

    if (invalid) {
      setPhotoError("Sadece JPG, PNG, WebP veya PDF dosyaları yükleyebilirsiniz.");
      return;
    }
    if (oversize) {
      setPhotoError(`Her dosya en fazla ${MAX_PHOTO_SIZE_MB} MB olabilir.`);
      return;
    }
    setPhotoError("");
    setPhotos(combined);
    e.target.value = "";
  }

  function removePhoto(idx: number) {
    setPhotos(photos.filter((_, i) => i !== idx));
  }

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="flex flex-col gap-16">
      <div className="grid grid-cols-2 gap-12">
        <div>
          <FieldLabel htmlFor="aracMarkasi">Araç Markası *</FieldLabel>
          <input
            id="aracMarkasi"
            type="text"
            placeholder="Toyota"
            className={cn(baseInputClass(!!errors.aracMarkasi), "mt-4")}
            aria-invalid={!!errors.aracMarkasi}
            {...register("aracMarkasi")}
          />
          <FieldError message={errors.aracMarkasi?.message} />
        </div>
        <div>
          <FieldLabel htmlFor="aracModeli">Araç Modeli</FieldLabel>
          <input
            id="aracModeli"
            type="text"
            placeholder="Corolla"
            className={cn(baseInputClass(!!errors.aracModeli), "mt-4")}
            {...register("aracModeli")}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-12">
        <div>
          <FieldLabel htmlFor="modelYili">Model Yılı *</FieldLabel>
          <div className="relative mt-4">
            <select
              id="modelYili"
              defaultValue=""
              className={cn(
                "w-full appearance-none bg-white border border-[0.5px] border-border-default rounded-input px-16 py-12 pr-32 text-[14px] text-text-primary outline-none focus:border-accent transition-colors cursor-pointer",
                errors.modelYili && "border-red-400"
              )}
              aria-invalid={!!errors.modelYili}
              {...register("modelYili")}
            >
              <option value="" disabled>Yıl</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <FieldError message={errors.modelYili?.message} />
        </div>
        <div>
          <FieldLabel htmlFor="yakitTipi">Yakıt *</FieldLabel>
          <div className="relative mt-4">
            <select
              id="yakitTipi"
              defaultValue=""
              className={cn(
                "w-full appearance-none bg-white border border-[0.5px] border-border-default rounded-input px-16 py-12 pr-32 text-[14px] text-text-primary outline-none focus:border-accent transition-colors cursor-pointer",
                errors.yakitTipi && "border-red-400"
              )}
              aria-invalid={!!errors.yakitTipi}
              {...register("yakitTipi")}
            >
              <option value="" disabled>Seçin</option>
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <FieldError message={errors.yakitTipi?.message} />
        </div>
        <div>
          <FieldLabel htmlFor="vitesTipi">Vites *</FieldLabel>
          <div className="relative mt-4">
            <select
              id="vitesTipi"
              defaultValue=""
              className={cn(
                "w-full appearance-none bg-white border border-[0.5px] border-border-default rounded-input px-16 py-12 pr-32 text-[14px] text-text-primary outline-none focus:border-accent transition-colors cursor-pointer",
                errors.vitesTipi && "border-red-400"
              )}
              aria-invalid={!!errors.vitesTipi}
              {...register("vitesTipi")}
            >
              <option value="" disabled>Seçin</option>
              {TRANSMISSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <FieldError message={errors.vitesTipi?.message} />
        </div>
      </div>

      {/* Damage types multi-select */}
      <div>
        <FieldLabel htmlFor="hasarTurleri">Hasar Türü * (birden fazla seçebilirsiniz)</FieldLabel>
        <Controller
          name="hasarTurleri"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="mt-8 flex flex-wrap gap-8" role="group" aria-label="Hasar türleri">
              {DAMAGE_TYPES.map((d) => {
                const selected = field.value.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? field.value.filter((v) => v !== d)
                        : [...field.value, d];
                      field.onChange(next);
                    }}
                    aria-pressed={selected}
                    className={cn(
                      "px-12 py-8 rounded-pill text-[12px] font-medium border border-[0.5px] transition-colors",
                      selected
                        ? "bg-accent-light border-accent-border text-accent"
                        : "bg-white border-border-default text-text-muted hover:border-accent-border hover:text-accent"
                    )}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          )}
        />
        <FieldError message={errors.hasarTurleri?.message} />
      </div>

      {/* Description */}
      <div>
        <FieldLabel htmlFor="aciklama">Açıklama</FieldLabel>
        <textarea
          id="aciklama"
          rows={3}
          placeholder="Aracınız hakkında ek bilgi verebilirsiniz..."
          className={cn(baseInputClass(), "mt-4 resize-none")}
          {...register("aciklama")}
        />
      </div>

      {/* Photo upload */}
      <div>
        <FieldLabel htmlFor="photos">
          Fotoğraf Ekle (isteğe bağlı, en fazla {MAX_PHOTO_FILES} adet, {MAX_PHOTO_SIZE_MB} MB)
        </FieldLabel>
        <label
          htmlFor="photos"
          className={cn(
            "mt-4 flex flex-col items-center justify-center gap-8 border border-[0.5px] border-dashed border-border-default rounded-card p-24 cursor-pointer",
            "hover:border-accent hover:bg-accent-light transition-colors text-center",
            photos.length >= MAX_PHOTO_FILES && "opacity-50 pointer-events-none"
          )}
        >
          <Upload size={20} strokeWidth={1.5} className="text-text-muted" aria-hidden />
          <span className="text-[13px] text-text-muted">
            {photos.length >= MAX_PHOTO_FILES
              ? "Maksimum dosya sayısına ulaşıldı"
              : "Fotoğraf seçmek için tıklayın"}
          </span>
          <span className="text-[11px] text-text-soft">JPG, PNG, WebP, PDF</span>
        </label>
        <input
          id="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          multiple
          className="sr-only"
          onChange={handleFileChange}
          disabled={photos.length >= MAX_PHOTO_FILES}
          aria-describedby={photoError ? "photo-err" : undefined}
        />
        {photoError && (
          <p id="photo-err" className="text-[12px] text-red-500 mt-4 flex items-center gap-4" role="alert">
            <AlertCircle size={12} aria-hidden />
            {photoError}
          </p>
        )}
        {photos.length > 0 && (
          <ul className="mt-8 flex flex-col gap-8" aria-label="Yüklenen fotoğraflar">
            {photos.map((file, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-8 px-12 py-8 bg-bg-surface border border-[0.5px] border-border-default rounded-card text-[12px] text-text-primary"
              >
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-text-soft shrink-0">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="text-text-soft hover:text-red-500 transition-colors shrink-0"
                  aria-label={`${file.name} kaldır`}
                >
                  <X size={14} strokeWidth={1.5} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-12 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-8 bg-white border border-[0.5px] border-border-default text-text-primary px-24 py-16 rounded-btn text-[14px] hover:border-accent hover:text-accent transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={1.5} aria-hidden />
          Geri
        </button>
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-8 bg-accent text-white py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity"
        >
          Devam Et
          <ChevronRight size={16} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </form>
  );
}

// ── Step 3 — confirmation ─────────────────────────────────────────────────────
interface Step3Props {
  step1: QuoteStep1;
  step2: QuoteStep2;
  photos: File[];
  onBack: () => void;
  onSubmit: (kvkkAccepted: boolean) => void;
  submitting: boolean;
  submitError: string;
}

function Step3({ step1, step2, photos, onBack, onSubmit, submitting, submitError }: Step3Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteStep3>({ resolver: zodResolver(quoteStep3Schema) });

  return (
    <form
      onSubmit={handleSubmit((d) => onSubmit(d.kvkkAccepted))}
      noValidate
      className="flex flex-col gap-16"
    >
      {/* Summary */}
      <div className="bg-bg-surface border border-[0.5px] border-border-default rounded-card p-24 flex flex-col gap-16">
        <h3 className="text-[14px] font-medium text-text-primary">Başvuru Özeti</h3>

        <div className="grid grid-cols-2 gap-12 text-[13px]">
          <div>
            <p className="text-text-soft mb-4">Ad Soyad</p>
            <p className="text-text-primary font-medium">{step1.adSoyad}</p>
          </div>
          <div>
            <p className="text-text-soft mb-4">Telefon</p>
            <p className="text-text-primary font-medium">{step1.telefon}</p>
          </div>
          <div>
            <p className="text-text-soft mb-4">İl / İlçe</p>
            <p className="text-text-primary font-medium">
              {step1.il}{step1.ilce ? ` / ${step1.ilce}` : ""}
            </p>
          </div>
          <div>
            <p className="text-text-soft mb-4">Araç</p>
            <p className="text-text-primary font-medium">
              {step2.aracMarkasi} {step2.aracModeli} {step2.modelYili}
            </p>
          </div>
          <div>
            <p className="text-text-soft mb-4">Yakıt / Vites</p>
            <p className="text-text-primary font-medium">
              {step2.yakitTipi} / {step2.vitesTipi}
            </p>
          </div>
          <div>
            <p className="text-text-soft mb-4">Hasar Türleri</p>
            <p className="text-text-primary font-medium">{step2.hasarTurleri.join(", ")}</p>
          </div>
        </div>

        {step2.aciklama && (
          <div>
            <p className="text-text-soft text-[13px] mb-4">Açıklama</p>
            <p className="text-[13px] text-text-primary leading-relaxed">{step2.aciklama}</p>
          </div>
        )}

        {photos.length > 0 && (
          <div>
            <p className="text-text-soft text-[13px] mb-4">{photos.length} fotoğraf eklenmiş</p>
          </div>
        )}
      </div>

      {/* KVKK */}
      <div className="flex items-start gap-12">
        <input
          id="kvkk"
          type="checkbox"
          className="mt-1 w-[16px] h-[16px] accent-accent shrink-0"
          aria-describedby={errors.kvkkAccepted ? "kvkk-err" : undefined}
          aria-invalid={!!errors.kvkkAccepted}
          {...register("kvkkAccepted")}
        />
        <label htmlFor="kvkk" className="text-[13px] text-text-muted leading-relaxed cursor-pointer">
          <a href="/tr/kvkk" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
            KVKK metnini
          </a>{" "}
          okudum ve kişisel verilerimin işlenmesini kabul ediyorum.
        </label>
      </div>
      {errors.kvkkAccepted && (
        <p id="kvkk-err" className="text-[12px] text-red-500 flex items-center gap-4 -mt-8" role="alert">
          <AlertCircle size={12} aria-hidden />
          {errors.kvkkAccepted.message}
        </p>
      )}

      {/* honeypot */}
      <input type="text" name="website" className="sr-only" tabIndex={-1} aria-hidden />

      {submitError && (
        <div className="p-16 bg-red-50 border border-[0.5px] border-red-200 rounded-card text-[13px] text-red-600" role="alert">
          {submitError}
        </div>
      )}

      <div className="flex gap-12 mt-8">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex items-center gap-8 bg-white border border-[0.5px] border-border-default text-text-primary px-24 py-16 rounded-btn text-[14px] hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
        >
          <ChevronLeft size={16} strokeWidth={1.5} aria-hidden />
          Geri
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-8 bg-accent text-white py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity disabled:opacity-60"
          aria-busy={submitting}
        >
          {submitting ? "Gönderiliyor..." : "Ücretsiz Teklif Al"}
          {!submitting && <ChevronRight size={16} strokeWidth={1.5} aria-hidden />}
        </button>
      </div>
    </form>
  );
}

// ── Main multi-step component ─────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
};

export function MultiStepQuoteForm() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [step1Data, setStep1Data] = useState<QuoteStep1 | null>(null);
  const [step2Data, setStep2Data] = useState<QuoteStep2 | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [started, setStarted] = useState(false);

  function goTo(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  useEffect(() => {
    if (!started) {
      trackFormStep("quote_form", 1);
      setStarted(true);
    }
  }, [started]);

  function handleStep1(data: QuoteStep1) {
    setStep1Data(data);
    trackFormStep("quote_form", 2);
    goTo(2);
  }

  function handleStep2(data: QuoteStep2) {
    setStep2Data(data);
    trackFormStep("quote_form", 3);
    goTo(3);
  }

  async function handleFinalSubmit(kvkkAccepted: boolean) {
    if (!step1Data || !step2Data) return;
    setSubmitting(true);
    setSubmitError("");
    trackFormSubmit("quote_form");

    try {
      const formData = new FormData();
      const payload = {
        ...step1Data,
        ...step2Data,
        kvkkAccepted,
        preferredContact: "phone",
        honeypot: "",
      };

      formData.append("data", JSON.stringify(payload));
      photos.forEach((photo) => formData.append("photos", photo));

      const res = await fetch("/api/quote", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setSubmitError(json.error ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
        setSubmitting(false);
        return;
      }

      const leadId = json.leadId ?? "unknown";
      trackLeadSuccess(leadId);
      fireGoogleAdsConversion();
      router.push(routes.thankYou(locale));
    } catch {
      setSubmitError("Bağlantı hatası. Lütfen tekrar deneyin.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <StepIndicator current={step} />

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {step === 1 && <Step1 onNext={handleStep1} />}
            {step === 2 && step1Data && (
              <Step2
                onNext={handleStep2}
                onBack={() => goTo(1)}
                photos={photos}
                setPhotos={setPhotos}
              />
            )}
            {step === 3 && step1Data && step2Data && (
              <Step3
                step1={step1Data}
                step2={step2Data}
                photos={photos}
                onBack={() => goTo(2)}
                onSubmit={handleFinalSubmit}
                submitting={submitting}
                submitError={submitError}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
