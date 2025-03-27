"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X } from "lucide-react"

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    album: "",
    privacy: "public",
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Kontrola přihlášení - v reálné aplikaci by to bylo napojeno na autentizační systém
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)
      setIsLoading(false)

      if (!loggedIn) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])

      // Vytvoření náhledů
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
      setPreviews((prev) => [...prev, ...newPreviews])
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

      // Přesměrování na dashboard
      router.push("/dashboard")
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-primary">Načítání...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Router přesměruje na přihlášení
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-8">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Nahrát média</h1>
            <p className="text-muted-foreground mt-2">Nahrajte fotografie a videa do své galerie</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="files">Vyberte soubory</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="files"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Klikněte pro výběr</span> nebo přetáhněte soubory sem
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Podporované formáty: JPEG, PNG, GIF, MP4, WebM (max. 500 MB)
                        </p>
                      </div>
                      <Input
                        id="files"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                {previews.length > 0 && (
                  <div className="space-y-2">
                    <Label>Vybrané soubory ({files.length})</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Odstranit</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Název</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Zadejte název pro vaše média"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={isUploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Popis</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Zadejte popis pro vaše média"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isUploading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="album">Album</Label>
                    <Select
                      value={formData.album}
                      onValueChange={(value) => handleSelectChange("album", value)}
                      disabled={isUploading}
                    >
                      <SelectTrigger id="album">
                        <SelectValue placeholder="Vyberte album" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Žádné album</SelectItem>
                        <SelectItem value="vacation">Dovolená</SelectItem>
                        <SelectItem value="family">Rodina</SelectItem>
                        <SelectItem value="nature">Příroda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="privacy">Soukromí</Label>
                    <Select
                      value={formData.privacy}
                      onValueChange={(value) => handleSelectChange("privacy", value)}
                      disabled={isUploading}
                    >
                      <SelectTrigger id="privacy">
                        <SelectValue placeholder="Vyberte nastavení soukromí" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Veřejné</SelectItem>
                        <SelectItem value="private">Soukromé</SelectItem>
                        <SelectItem value="shared">Sdílené s přáteli</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    disabled={isUploading}
                  >
                    Zrušit
                  </Button>
                  <Button type="submit" disabled={isUploading || files.length === 0}>
                    {isUploading ? "Nahrávání..." : "Nahrát média"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
      <Footer />
    </div>
  )
}

