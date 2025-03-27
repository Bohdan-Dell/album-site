import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

let ffmpeg: FFmpeg | null = null

/**
 * Inicializuje FFmpeg pro kompresi videa
 */
export async function initFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg) return ffmpeg

  ffmpeg = new FFmpeg()

  // Načtení FFmpeg z CDN
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd"
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  })

  return ffmpeg
}

/**
 * Komprimuje video pomocí FFmpeg
 */
export async function compressVideo(
  file: File,
  options: {
    quality?: string // nízká, střední, vysoká
    maxSizeMB?: number
  } = {},
): Promise<File> {
  try {
    // Kontrola, zda se jedná o video
    if (!file.type.startsWith("video/")) {
      console.log("Soubor není video, přeskakuji kompresi")
      return file
    }

    const { quality = "střední", maxSizeMB = 10 } = options

    // Pokud je video menší než maxSizeMB, nekomprimujeme
    if (file.size / 1024 / 1024 < maxSizeMB) {
      console.log(`Video je menší než ${maxSizeMB}MB, přeskakuji kompresi`)
      return file
    }

    console.log(`Komprese videa: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)

    // Inicializace FFmpeg
    const ffmpeg = await initFFmpeg()

    // Nastavení kvality komprese
    let crf = "28" // výchozí střední kvalita
    if (quality === "vysoká") crf = "23"
    if (quality === "nízká") crf = "35"

    // Vytvoření jména vstupního a výstupního souboru
    const inputName = `input-${Date.now()}.${file.name.split(".").pop()}`
    const outputName = `output-${Date.now()}.mp4`

    // Nahrání souboru do FFmpeg
    ffmpeg.writeFile(inputName, await fetchFile(file))

    // Komprese videa
    await ffmpeg.exec([
      "-i",
      inputName,
      "-c:v",
      "libx264",
      "-crf",
      crf,
      "-preset",
      "medium",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      outputName,
    ])

    // Získání komprimovaného videa
    const data = await ffmpeg.readFile(outputName)
    const compressedFile = new File([data], file.name.replace(/\.[^/.]+$/, ".mp4"), { type: "video/mp4" })

    console.log(`Komprese dokončena: ${compressedFile.name} (${(compressedFile.size / 1024 / 1024).toFixed(2)} MB)`)

    // Vyčištění souborů
    await ffmpeg.deleteFile(inputName)
    await ffmpeg.deleteFile(outputName)

    return compressedFile
  } catch (error) {
    console.error("Chyba při kompresi videa:", error)
    return file // Vrátíme původní soubor v případě chyby
  }
}

