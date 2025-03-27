import imageCompression from "browser-image-compression"

export interface CompressionOptions {
  maxSizeMB: number
  maxWidthOrHeight: number
  useWebWorker?: boolean
  fileType?: string
}

export const defaultImageOptions: CompressionOptions = {
  maxSizeMB: 1, // maximální velikost v MB
  maxWidthOrHeight: 1920, // maximální šířka nebo výška v pixelech
  useWebWorker: true, // použití web workeru pro kompresi na pozadí
  fileType: "image/jpeg", // výstupní formát
}

/**
 * Komprimuje obrázek pomocí browser-image-compression
 */
export async function compressImage(file: File, options: Partial<CompressionOptions> = {}): Promise<File> {
  try {
    // Kontrola, zda se jedná o obrázek
    if (!file.type.startsWith("image/")) {
      console.log("Soubor není obrázek, přeskakuji kompresi")
      return file
    }

    const compressOptions = {
      ...defaultImageOptions,
      ...options,
    }

    console.log(`Komprese obrázku: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
    const compressedFile = await imageCompression(file, compressOptions)
    console.log(`Komprese dokončena: ${compressedFile.name} (${(compressedFile.size / 1024 / 1024).toFixed(2)} MB)`)

    return compressedFile
  } catch (error) {
    console.error("Chyba při kompresi obrázku:", error)
    return file // Vrátíme původní soubor v případě chyby
  }
}

