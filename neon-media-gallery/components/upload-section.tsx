"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { compressImage } from "@/utils/image-compression"
import { compressVideo } from "@/utils/video-compression"

export function UploadSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [compressionProgress, setCompressionProgress] = useState<{ [key: string]: number }>({})
  const [originalSizes, setOriginalSizes] = useState<{ [key: string]: number }>({})
  const [compressedSizes, setCompressedSizes] = useState<{ [key: string]: number }>({})

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Kontrola přihlášení - v reálné aplikaci by to bylo napojeno na autentizační systém
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)
    }

    checkAuth()
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Uložení původních velikostí
      const newOriginalSizes = { ...originalSizes }
      newFiles.forEach((file) => {
        const fileId = `${file.name}-${Date.now()}`
        newOriginalSizes[fileId] = file.size
      })
      setOriginalSizes(newOriginalSizes)

      setIsCompressing(true)

      try {
        // Vytvoření náhledů před kompresí
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
        setPreviews((prev) => [...prev, ...newPreviews])

        // Komprese souborů
        const compressedFiles = await Promise.all(
          newFiles.map(async (file, index) => {
            // Nastavení počátečního stavu komprese
            const fileId = `${file.name}-${Date.now()}`
            setCompressionProgress((prev) => ({ ...prev, [fileId]: 0 }))

            try {
              // Komprese podle typu souboru
              if (file.type.startsWith("image/")) {
                const compressed = await compressImage(file, {
                  maxSizeMB: 1,
                  maxWidthOrHeight: 1920,
                })
                setCompressionProgress((prev) => ({ ...prev, [fileId]: 100 }))

                // Uložení komprimované velikosti
                setCompressedSizes((prev) => ({ ...prev, [fileId]: compressed.size }))

                return compressed
              } else if (file.type.startsWith("video/")) {
                const compressed = await compressVideo(file, {
                  quality: "střední",
                  maxSizeMB: 10,
                })
                setCompressionProgress((prev) => ({ ...prev, [fileId]: 100 }))

                // Uložení komprimované velikosti
                setCompressedSizes((prev) => ({ ...prev, [fileId]: compressed.size }))

                return compressed
              }
              return file
            } catch (error) {
              console.error("Chyba při kompresi:", error)
              setCompressionProgress((prev) => ({ ...prev, [fileId]: 100 }))

              // V případě chyby použijeme původní velikost
              setCompressedSizes((prev) => ({ ...prev, [fileId]: file.size }))

              return file
            }
          }),
        )

        setFiles((prev) => [...prev, ...compressedFiles])

        // Zobrazení informace o kompresi
        const totalOriginalSize = newFiles.reduce((sum, file) => sum + file.size, 0)
        const totalCompressedSize = compressedFiles.reduce((sum, file) => sum + file.size, 0)
        const savedPercentage = Math.round((1 - totalCompressedSize / totalOriginalSize) * 100)

        if (savedPercentage > 0) {
          toast({
            title: "Komprese dokončena",
            description: `Ušetřeno ${savedPercentage}% místa (${((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2)} MB)`,
          })
        }
      } catch (error) {
        console.error("Chyba při kompresi souborů:", error)
        toast({
          title: "Chyba při kompresi",
          description: "Některé soubory se nepodařilo komprimovat. Budou nahrány v původní velikosti.",
          variant: "destructive",
        })

        // V případě chyby přidáme původní soubory
        setFiles((prev) => [...prev, ...newFiles])
      } finally {
        setIsCompressing(false)
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    // Odstranění souboru a náhledu
    const newFiles = [...files]
    const newPreviews = [...previews]

    // Uvolnění URL objektu
    URL.revokeObjectURL(newPreviews[index])

    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)

    setFiles(newFiles)
    setPreviews(newPreviews)
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "Chyba",
        description: "Vyberte alespoň jeden soubor k nahrání.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Simulace nahrávání - v reálné aplikaci by zde byl API požadavek
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Úspěch",
        description: `${files.length} souborů bylo úspěšně nahráno.`,
      })

      // Vyčištění formuláře
      setFiles([])
      setPreviews([])
      setOriginalSizes({})
      setCompressedSizes({})
    } catch (error) {
      toast({
        title: "Chyba při nahrávání",
        description: "Nastala chyba při nahrávání souborů. Zkuste to prosím znovu.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Výpočet celkové úspory místa
  const calculateTotalSaving = () => {
    if (files.length === 0) return null

    const totalOriginal = Object.values(originalSizes).reduce((sum, size) => sum + size, 0)
    const totalCompressed = Object.values(compressedSizes).reduce((sum, size) => sum + size, 0)

    if (totalOriginal === 0 || totalCompressed === 0) return null

    const savedPercentage = Math.round((1 - totalCompressed / totalOriginal) * 100)
    const savedMB = ((totalOriginal - totalCompressed) / 1024 / 1024).toFixed(2)

    if (savedPercentage <= 0) return null

    return { savedPercentage, savedMB }
  }

  const savingInfo = calculateTotalSaving()

  if (!isLoggedIn) {
    return (
      <section className="py-12 bg-black/50">
        <div className="container">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-4">Nahrát média</h2>
                <p className="text-muted-foreground mb-6">
                  Pro nahrávání fotografií a videí se musíte nejprve přihlásit
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild>
                    <Link href="/login">Přihlásit se</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/register">Registrovat se</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-black/50">
      <div className="container">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Nahrát média</h2>

            <div className="space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-md p-3 mb-4">
                <p className="text-sm text-primary">
                  <strong>Automatická komprese:</strong> Všechny nahrávané soubory budou automaticky komprimovány pro
                  úsporu místa a rychlejší nahrávání.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="files">Vyberte soubory</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="files"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isCompressing ? (
                        <>
                          <Loader2 className="w-10 h-10 text-primary mb-3 animate-spin" />
                          <p className="mb-2 text-sm text-muted-foreground">Komprese souborů...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Klikněte pro výběr</span> nebo přetáhněte soubory sem
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Podporované formáty: JPEG, PNG, GIF, MP4, WebM
                          </p>
                        </>
                      )}
                    </div>
                    <Input
                      id="files"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isUploading || isCompressing}
                    />
                  </label>
                </div>
              </div>

              {previews.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Vybrané soubory ({files.length})</Label>
                    {savingInfo && (
                      <span className="text-xs text-primary">
                        Ušetřeno {savingInfo.savedPercentage}% místa ({savingInfo.savedMB} MB)
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square relative rounded-lg overflow-hidden border border-border">
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Náhled ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveFile(index)}
                          disabled={isUploading || isCompressing}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Odstranit</span>
                        </Button>
                        {files[index] && (
                          <div className="absolute bottom-1 right-1 text-xs bg-background/80 backdrop-blur-sm px-1 rounded">
                            {(files[index].size / 1024 / 1024).toFixed(1)} MB
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleUpload} disabled={isUploading || isCompressing || files.length === 0}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Nahrávání...
                    </>
                  ) : (
                    "Nahrát média"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

