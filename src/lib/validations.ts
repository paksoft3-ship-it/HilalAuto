import { z } from "zod";
import { MAX_PHOTO_FILES } from "./constants";

export const quoteStep1Schema = z.object({
  adSoyad: z
    .string()
    .min(2, "Ad Soyad en az 2 karakter olmalıdır.")
    .max(100, "Ad Soyad en fazla 100 karakter olabilir.")
    .trim(),
  telefon: z
    .string()
    .min(10, "Geçerli bir telefon numarası giriniz.")
    .max(15, "Geçerli bir telefon numarası giriniz.")
    .regex(/^[0-9+\s\-()]+$/, "Geçerli bir telefon numarası giriniz.")
    .trim(),
  il: z
    .string()
    .min(2, "İl bilgisi zorunludur.")
    .max(50, "Geçerli bir il giriniz.")
    .trim(),
  ilce: z
    .string()
    .max(50, "Geçerli bir ilçe giriniz.")
    .trim()
    .optional(),
});

export const quoteStep2Schema = z.object({
  aracMarkasi: z
    .string()
    .min(2, "Araç markası zorunludur.")
    .max(50, "Geçerli bir marka giriniz.")
    .trim(),
  aracModeli: z
    .string()
    .max(50, "Geçerli bir model giriniz.")
    .trim()
    .optional(),
  modelYili: z
    .string()
    .min(4, "Model yılı zorunludur.")
    .max(4, "Geçerli bir yıl giriniz.")
    .regex(/^[0-9]{4}$/, "Geçerli bir yıl giriniz."),
  yakitTipi: z
    .string()
    .min(1, "Yakıt tipi zorunludur.")
    .max(30),
  vitesTipi: z
    .string()
    .min(1, "Vites tipi zorunludur.")
    .max(30),
  hasarTurleri: z
    .array(z.string().max(50))
    .min(1, "En az bir hasar türü seçiniz.")
    .max(8, "En fazla 8 hasar türü seçilebilir."),
  aciklama: z
    .string()
    .max(1000, "Açıklama en fazla 1000 karakter olabilir.")
    .trim()
    .optional(),
});

export const quoteStep3Schema = z.object({
  kvkkAccepted: z
    .boolean()
    .refine((v) => v === true, {
      message: "KVKK metnini kabul etmeniz zorunludur.",
    }),
});

export const quoteFullSchema = quoteStep1Schema
  .merge(quoteStep2Schema)
  .merge(quoteStep3Schema)
  .extend({
    preferredContact: z.enum(["phone", "whatsapp"]).default("phone"),
    honeypot: z.string().max(0, "").optional(),
  });

export type QuoteStep1 = z.infer<typeof quoteStep1Schema>;
export type QuoteStep2 = z.infer<typeof quoteStep2Schema>;
export type QuoteStep3 = z.infer<typeof quoteStep3Schema>;
export type QuoteFormData = z.infer<typeof quoteFullSchema>;

// Server-side API schema (includes file metadata validation)
export const quoteApiSchema = quoteFullSchema.extend({
  photoUrls: z.array(z.string().url()).max(MAX_PHOTO_FILES).optional(),
});

export type QuoteApiData = z.infer<typeof quoteApiSchema>;
