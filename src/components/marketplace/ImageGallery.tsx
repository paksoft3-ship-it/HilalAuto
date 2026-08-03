"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X, ZoomIn, Images } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
  locale?: string;
  onImageViewed?: (count: number) => void;
}

export function ImageGallery({ images, title, onImageViewed }: ImageGalleryProps) {
  const t = useTranslations("imageGallery");
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const maxViewed = useRef(1);

  const touchStartX = useRef(0);

  const total = images.length;

  // Keep every visited image plus the current one's neighbors mounted so
  // arrow/swipe navigation shows an already-loaded image instantly.
  const mountedRef = useRef<Set<number>>(new Set([0]));
  if (total > 0) {
    mountedRef.current.add(current);
    mountedRef.current.add((current + 1) % total);
    mountedRef.current.add((current - 1 + total) % total);
  }

  // The lightbox renders original URLs; warm the browser cache for neighbors.
  useEffect(() => {
    if (!lightbox || total < 2) return;
    [1, -1].forEach((d) => {
      const img = new window.Image();
      img.src = images[(current + d + total) % total];
    });
  }, [lightbox, current, images, total]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setCurrent((prev) => {
        const next = (prev + dir + total) % total;
        const viewed = next + 1;
        if (viewed > maxViewed.current) {
          maxViewed.current = viewed;
          onImageViewed?.(viewed);
        }
        return next;
      });
    },
    [total, onImageViewed]
  );

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setLightbox(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, go]);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  if (total === 0) {
    return (
      <div className="aspect-video bg-surface-container-low border border-[0.5px] border-border-default rounded-card flex items-center justify-center">
        <span className="text-[14px] text-muted-text">{t("noPhotos")}</span>
      </div>
    );
  }

  return (
    <>
      {/* Main gallery */}
      <div className="flex flex-col gap-8">
        {/* Primary image */}
        <div
          className="relative aspect-video bg-surface-container-low rounded-card overflow-hidden cursor-zoom-in group"
          onClick={() => setLightbox(true)}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
          }}
        >
          {images.map((src, i) =>
            mountedRef.current.has(i) ? (
              <Image
                key={src}
                src={src}
                alt={`${title} — ${t("photo")} ${i + 1}`}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
                sizes="(max-width: 1024px) 100vw, 66vw"
                className={cn(
                  "object-cover transition-opacity duration-150",
                  i === current ? "opacity-100" : "opacity-0"
                )}
                draggable={false}
              />
            ) : null
          )}

          {/* Nav arrows */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                className="absolute left-8 top-1/2 -translate-y-1/2 w-[36px] h-[36px] rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={t("previousPhoto")}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); go(1); }}
                className="absolute right-8 top-1/2 -translate-y-1/2 w-[36px] h-[36px] rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={t("nextPhoto")}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-12 left-12 flex items-center gap-4 bg-black/60 text-white text-[12px] px-12 py-[6px] rounded-full">
            <Images size={13} /> {current + 1} / {total}
          </div>

          <div className="absolute bottom-12 right-12 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/60 text-white text-[11px] px-12 py-[6px] rounded-full flex items-center gap-4">
              <ZoomIn size={12} /> {t("expand")}
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        {total > 1 && (
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  const viewed = i + 1;
                  if (viewed > maxViewed.current) {
                    maxViewed.current = viewed;
                    onImageViewed?.(viewed);
                  }
                }}
                className={cn(
                  "shrink-0 w-[64px] h-[48px] rounded overflow-hidden border-2 transition-colors",
                  i === current ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                )}
                aria-label={t("photoAria", { number: i + 1 })}
              >
                <Image src={src} alt={`${title} — ${i + 1}`} width={64} height={48} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
          }}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-16 right-16 w-[40px] h-[40px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
            aria-label={t("close")}
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <div className="absolute top-16 left-16 text-white/70 text-[13px]">
            {current + 1} / {total}
          </div>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[current]}
              alt={`${title} — ${t("photo")} ${current + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              draggable={false}
            />
          </div>

          {/* Lightbox nav */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                className="absolute left-16 top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label={t("previous")}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); go(1); }}
                className="absolute right-16 top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label={t("next")}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
