"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Car as CarIcon } from "lucide-react";

interface SingleCarGalleryProps {
  images: string[];
  alt: string;
}

export function SingleCarGallery({ images, alt }: SingleCarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/10] bg-zinc-100 rounded-lg border border-zinc-200 flex flex-col items-center justify-center text-zinc-400 gap-2">
        <CarIcon className="w-10 h-10" strokeWidth={1.5} />
        <span className="text-xs font-medium">Zdjęcia w przygotowaniu</span>
      </div>
    );
  }

  const prevImage = () => {
    setActiveIndex((idx) => (idx === 0 ? images.length - 1 : idx - 1));
  };

  const nextImage = () => {
    setActiveIndex((idx) => (idx === images.length - 1 ? 0 : idx + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Showcase Image */}
      <div className="relative aspect-[16/10] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-200 shadow-sm group">
        <Image
          src={images[activeIndex]}
          alt={`${alt} - zdjęcie ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 65vw"
          className="object-cover"
        />

        {/* Counter Badge */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-zinc-950/80 backdrop-blur-sm border border-zinc-700/80 text-white text-xs font-mono font-medium rounded-md shadow-sm">
            {activeIndex + 1} / {images.length}
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Poprzednie zdjęcie"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-zinc-950/80 hover:bg-zinc-900 text-white rounded-md backdrop-blur-sm border border-zinc-700/80 shadow-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Następne zdjęcie"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-zinc-950/80 hover:bg-zinc-900 text-white rounded-md backdrop-blur-sm border border-zinc-700/80 shadow-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Zdjęcie ${idx + 1}`}
              className={`relative flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border transition-all ${
                idx === activeIndex
                  ? "border-emerald-600 ring-1 ring-emerald-600 opacity-100"
                  : "border-zinc-200 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt={`${alt} miniatura ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
