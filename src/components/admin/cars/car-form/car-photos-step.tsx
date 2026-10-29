"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Star, Trash2, Loader2, Link as LinkIcon, Plus } from "lucide-react";
import { uploadCarPhoto } from "@/lib/image-upload";

interface CarPhotosStepProps {
  images: string[];
  tenantSlug: string;
  onChange: (images: string[]) => void;
  error?: string;
}

export function CarPhotosStep({ images, tenantSlug, onChange, error }: CarPhotosStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualInput, setManualInput] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);
    const fileList = Array.from(files);
    setUploadProgress({ current: 0, total: fileList.length });

    const newUrls: string[] = [];
    for (let i = 0; i < fileList.length; i++) {
      setUploadProgress({ current: i + 1, total: fileList.length });
      try {
        const url = await uploadCarPhoto(fileList[i], tenantSlug);
        newUrls.push(url);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Błąd przesyłania zdjęcia");
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
    }
    setIsUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const setAsMain = (index: number) => {
    if (index === 0) return;
    const reordered = [images[index], ...images.filter((_, i) => i !== index)];
    onChange(reordered);
  };

  const removePhoto = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const addManualUrl = () => {
    const trimmed = manualInput.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setManualInput("");
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isUploading
            ? "border-emerald-500/50 bg-emerald-950/10 cursor-not-allowed"
            : "border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" strokeWidth={1.75} />
            <p className="text-sm font-medium text-slate-200">
              Wgrywanie zdjęć ({uploadProgress?.current || 0} / {uploadProgress?.total || 0})...
            </p>
            <p className="text-xs text-slate-500">Automatyczna optymalizacja i kompresja w toku</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400">
              <Upload className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <p className="text-sm font-medium text-slate-200">
              Kliknij lub przeciągnij zdjęcia tutaj
            </p>
            <p className="text-xs text-slate-500">
              Obsługiwane formaty: JPG, PNG, WebP. Pierwsze zdjęcie będzie miniaturą główną.
            </p>
          </div>
        )}
      </div>

      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Manual URL Toggle */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>Zdjęć w galerii: {images.length}</span>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
          {showManualUrl ? "Ukryj dodawanie linku" : "Wklej bezpośredni link URL"}
        </button>
      </div>

      {showManualUrl && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={addManualUrl}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl inline-flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={1.75} />
            Dodaj
          </button>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-800"
            >
              <Image src={url} alt={`Zdjęcie ${idx + 1}`} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => setAsMain(idx)}
                    title="Ustaw jako główne"
                    className="p-1.5 bg-slate-800/90 hover:bg-emerald-600 text-slate-200 rounded-md transition-colors"
                  >
                    <Star className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  title="Usuń zdjęcie"
                  className="p-1.5 bg-slate-800/90 hover:bg-red-600 text-slate-200 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              </div>
              {idx === 0 && (
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-semibold text-emerald-400 rounded">
                  Główne
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
