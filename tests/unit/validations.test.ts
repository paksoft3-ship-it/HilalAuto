import { describe, expect, it } from "vitest";
import { quoteApiSchema, quoteFullSchema, quoteStep1Schema, quoteStep2Schema, quoteStep3Schema } from "@/lib/validations";

const valid = {
  adSoyad: "Ayşe Yılmaz",
  telefon: "0552 567 71 64",
  il: "İstanbul",
  aracMarkasi: "Audi",
  modelYili: "2012",
  yakitTipi: "dizel",
  vitesTipi: "otomatik",
  hasarTurleri: ["kazali"],
  kvkkAccepted: true,
};

describe("quote step 1", () => {
  it("accepts a normal person", () => {
    expect(quoteStep1Schema.safeParse({ adSoyad: "Ali Veli", telefon: "05551234567", il: "Ankara" }).success).toBe(true);
  });
  it.each([
    ["short name", { adSoyad: "A", telefon: "05551234567", il: "Ankara" }],
    ["letters in phone", { adSoyad: "Ali Veli", telefon: "05551abc4567", il: "Ankara" }],
    ["phone too short", { adSoyad: "Ali Veli", telefon: "055512", il: "Ankara" }],
    ["missing city", { adSoyad: "Ali Veli", telefon: "05551234567", il: "" }],
  ])("rejects %s", (_n, input) => {
    expect(quoteStep1Schema.safeParse(input).success).toBe(false);
  });
  it("trims whitespace", () => {
    const r = quoteStep1Schema.parse({ adSoyad: "  Ali Veli  ", telefon: " 05551234567 ", il: " Ankara " });
    expect(r.adSoyad).toBe("Ali Veli");
    expect(r.il).toBe("Ankara");
  });
});

describe("quote step 2", () => {
  const base = { aracMarkasi: "Audi", modelYili: "2012", yakitTipi: "dizel", vitesTipi: "manuel", hasarTurleri: ["pert"] };
  it("accepts a valid vehicle", () => expect(quoteStep2Schema.safeParse(base).success).toBe(true));
  it("requires 4-digit numeric year", () => {
    expect(quoteStep2Schema.safeParse({ ...base, modelYili: "12" }).success).toBe(false);
    expect(quoteStep2Schema.safeParse({ ...base, modelYili: "20a2" }).success).toBe(false);
  });
  it("requires 1-8 damage types", () => {
    expect(quoteStep2Schema.safeParse({ ...base, hasarTurleri: [] }).success).toBe(false);
    expect(quoteStep2Schema.safeParse({ ...base, hasarTurleri: Array(9).fill("x") }).success).toBe(false);
  });
  it("caps the description at 1000 chars", () => {
    expect(quoteStep2Schema.safeParse({ ...base, aciklama: "x".repeat(1001) }).success).toBe(false);
    expect(quoteStep2Schema.safeParse({ ...base, aciklama: "x".repeat(1000) }).success).toBe(true);
  });
});

describe("quote step 3 / full / api", () => {
  it("KVKK must be accepted", () => {
    expect(quoteStep3Schema.safeParse({ kvkkAccepted: false }).success).toBe(false);
    expect(quoteStep3Schema.safeParse({ kvkkAccepted: true }).success).toBe(true);
  });
  it("full schema defaults preferredContact to phone", () => {
    expect(quoteFullSchema.parse(valid).preferredContact).toBe("phone");
  });
  it("honeypot must stay empty (bot trap)", () => {
    expect(quoteFullSchema.safeParse({ ...valid, honeypot: "http://spam" }).success).toBe(false);
    expect(quoteFullSchema.safeParse({ ...valid, honeypot: "" }).success).toBe(true);
  });
  it("api schema validates photo URLs", () => {
    expect(quoteApiSchema.safeParse({ ...valid, photoUrls: ["https://x.supabase.co/a.jpg"] }).success).toBe(true);
    expect(quoteApiSchema.safeParse({ ...valid, photoUrls: ["not a url"] }).success).toBe(false);
  });
});

import { contactApiSchema, quickQuoteApiSchema } from "@/lib/validations";

describe("contact API schema", () => {
  const ok = { name: "Ayşe Yılmaz", phone: "0552 567 71 64", message: "Merhaba, aracınızı görmek istiyorum." };
  it("accepts a normal message", () => expect(contactApiSchema.safeParse(ok).success).toBe(true));
  it.each([
    ["missing name", { ...ok, name: "" }],
    ["numeric name", { ...ok, name: 42 }],
    ["letters in phone", { ...ok, phone: "call me" }],
    ["too few digits", { ...ok, phone: "12-34" }],
    ["empty message", { ...ok, message: "   " }],
    ["megabyte message", { ...ok, message: "x".repeat(5000) }],
    ["object as phone", { ...ok, phone: { $ne: "" } }],
  ])("rejects %s", (_n, input) => expect(contactApiSchema.safeParse(input).success).toBe(false));
  it("trims fields", () => {
    expect(contactApiSchema.parse({ ...ok, name: "  Ali  " }).name).toBe("Ali");
  });
});

describe("quick-quote API schema", () => {
  const ok = { brand: "Audi", year: "2012", damage: "kazali", city: "İzmir", phone: "05551234567" };
  it("accepts the QuickQuoteForm payload", () => expect(quickQuoteApiSchema.safeParse(ok).success).toBe(true));
  it("accepts the DirectBuyingCTA payload that sends 'Belirtilmedi' placeholders", () => {
    expect(quickQuoteApiSchema.safeParse({ brand: "BMW 320i", year: "Belirtilmedi", damage: "Belirtilmedi", city: "Belirtilmedi", phone: "+90 555 123 45 67" }).success).toBe(true);
  });
  it("accepts a numeric year and stores it as text", () => {
    expect(quickQuoteApiSchema.parse({ ...ok, year: 2012 }).year).toBe("2012");
  });
  it.each([
    ["number as brand (used to crash .trim() -> 500)", { ...ok, brand: 123 }],
    ["array as city", { ...ok, city: ["x"] }],
    ["null damage", { ...ok, damage: null }],
    ["missing phone", { ...ok, phone: undefined }],
    ["huge brand", { ...ok, brand: "x".repeat(10_000) }],
  ])("rejects %s", (_n, input) => expect(quickQuoteApiSchema.safeParse(input).success).toBe(false));
});
