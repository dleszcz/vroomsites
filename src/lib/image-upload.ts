import { createClient } from "@/lib/supabase/client";

/**
 * Compresses an image client-side to a max dimension and quality,
 * reducing multi-megabyte camera photos down to ~150-300 KB for fast, reliable upload.
 */
export async function compressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      return reject(new Error("Wybrany plik nie jest zdjęciem"));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Nie udało się utworzyć Canvas"));
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Błąd kompresji zdjęcia"));
            }
            resolve(blob);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject(new Error("Nie udało się odczytać pliku obrazu"));
    };

    reader.onerror = () => reject(new Error("Błąd odczytu pliku"));
  });
}

/**
 * Uploads a car photo directly to Supabase Storage ('scout-photos')
 * and returns the public CDN URL.
 */
export async function uploadCarPhoto(file: File, tenantSlug: string): Promise<string> {
  const compressedBlob = await compressImage(file);
  const supabase = createClient();

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\.[^/.]+$/, "");
  const filePath = `cars/${tenantSlug}/${timestamp}-${cleanName}-${randomSuffix}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("scout-photos")
    .upload(filePath, compressedBlob, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Błąd wgrywania zdjęcia: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("scout-photos").getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error("Nie udało się uzyskać publicznego adresu zdjęcia");
  }

  return data.publicUrl;
}
