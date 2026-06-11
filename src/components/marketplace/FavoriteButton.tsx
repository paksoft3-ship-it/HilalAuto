"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "og_session_id";

function getFavoriteSessionId() {
  if (typeof window === "undefined") return "";

  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = window.sessionStorage.getItem(STORAGE_KEY);
  }
  if (!id) {
    id = window.crypto.randomUUID();
  }

  window.localStorage.setItem(STORAGE_KEY, id);
  window.sessionStorage.setItem(STORAGE_KEY, id);
  return id;
}

export function getBrowserFavoriteSessionId() {
  return getFavoriteSessionId();
}

export function FavoriteButton({
  listingId,
  size = "md",
  className,
  showText = false,
}: {
  listingId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  locale?: string;
}) {
  const t = useTranslations("favoriteButton");
  const [sessionId, setSessionId] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = getFavoriteSessionId();
    setSessionId(id);

    fetch(`/api/favorites?session_id=${encodeURIComponent(id)}&listing_id=${encodeURIComponent(listingId)}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setIsSaved(Boolean(data?.isSaved)))
      .catch(() => undefined);
  }, [listingId]);

  async function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!sessionId || loading) return;

    setLoading(true);
    const next = !isSaved;
    setIsSaved(next);

    const response = await fetch("/api/favorites", {
      method: next ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: listingId, session_id: sessionId }),
    }).catch(() => null);

    if (!response?.ok) setIsSaved(!next);
    setLoading(false);
  }

  const sizeCls = {
    sm: "h-[32px] px-8 text-[12px]",
    md: "h-[38px] px-12 text-[13px]",
    lg: "h-[44px] px-16 text-[14px]",
  }[size];
  const label = isSaved
    ? t("remove")
    : t("add");
  const visibleLabel = isSaved
    ? t("saved")
    : t("save");

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={isSaved}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center gap-4 rounded-full border border-[0.5px] border-border-default bg-white/95 text-on-surface shadow-sm transition-colors hover:border-primary hover:text-primary disabled:opacity-70",
        isSaved && "border-primary bg-primary text-white hover:text-white",
        sizeCls,
        className,
      )}
    >
      <Heart size={size === "lg" ? 18 : 15} fill={isSaved ? "currentColor" : "none"} />
      {showText && <span>{visibleLabel}</span>}
    </button>
  );
}
