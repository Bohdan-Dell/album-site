"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Eye, Image, MoreHorizontal, Search, Trash, Video } from "lucide-react"

// Ukázková data - v reálné aplikaci by byla načtena z API
const contentData = [
  {
    id: 1,
    title: "Západ slunce",
    type: "image",
    user: "Jan Novák",
    userId: 1,
    uploadedAt: "2023-10-15",
    size: "2.4 MB",
    status: "active",
  },
  {
    id: 2,
    title: "Dovolená v Itálii",
    type: "video",
    user: "Petra Svobodová",
    userId: 2,
    uploadedAt: "2023-10-14",
    size: "45.7 MB",
    status: "active",
  },
  {
    id: 3,
    title: "Rodinná oslava",
    type: "image",
    user: "Martin Dvořák",
    userId: 3,
    uploadedAt: "2023-10-12",
    size: "3.1 MB",
    status: "active",
  },
  {
    id: 4,
    title: "Koncert",
    type: "video",
    user: "Lucie Nováková",
    userId: 4,
    uploadedAt: "2023-10-10",
    size: "78.2 MB",
    status: "active",
  },
  {
    id: 5,
    title: "Výlet do hor",
    type: "image",
    user: "Tomáš Horák",
    userId: 5,
    uploadedAt: "2023-10-08",
    size: "4.5 MB",
    status: "active",
  },
  {
    id: 6,
    title: "Městská architektura",
    type: "image",
    user: "Bohdan Leuchin",
    userId: 6,
    uploadedAt: "2023-10-05",
    size: "5.2 MB",
    status: "active",
  },
]

export default function AdminContentPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [content, setContent] = useState(contentData)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Kontrola přihlášení a role - v reálné aplikaci by to bylo napojeno na autentizační systém
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      const userRole = localStorage.getItem("userRole")

      if (!loggedIn) {
        router.push("/login")
        return
      }

      // Simulace kontroly role - v reálné aplikaci by to bylo řešeno jinak
      // Pro účely ukázky nastavíme všechny přihlášené uživatele jako adminy
      setIsAdmin(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value)
  }

  const filteredContent = content.filter((item) => {
    // Filtrování podle vyhledávání
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtrování podle typu
    const matchesType = typeFilter === "all" || item.type === typeFilter

    return matchesSearch && matchesType
  })

  const handleDeleteContent = (contentId: number) => {
    setContent(content.filter((item) => item.id !== contentId))

    toast({
      title: "Obsah smazán",
      description: "Vybraný obsah byl úspěšně smazán.",
    })
  }

  const handleViewContent = (contentId: number) => {
    // V reálné aplikaci by zde byl kód pro zobrazení detailu obsahu
    toast({
      title: "Zobrazení obsahu",
      description: "Zobrazení detailu obsahu.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-primary">Načítání...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Přístup odepřen</h1>
          <p className="text-muted-foreground mb-6">Nemáte oprávnění pro přístup k této stránce.</p>
          <Button onClick={() => router.push("/dashboard")}>Zpět na dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-8">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Správa obsahu</h1>
              <p className="text-muted-foreground mt-1">Spravujte fotografie a videa nahraná uživateli</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Hledat obsah..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Typ obsahu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Vše</SelectItem>
                  <SelectItem value="image">Fotografie</SelectItem>
                  <SelectItem value="video">Videa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Název</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Uživatel</TableHead>
                  <TableHead>Nahráno</TableHead>
                  <TableHead>Velikost</TableHead>
                  <TableHead className="text-right">Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Žádný obsah nebyl nalezen.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={item.type === "image" ? "outline" : "secondary"}
                          className="flex items-center gap-1 w-fit"
                        >
                          {item.type === "image" ? <Image className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                          <span>{item.type === "image" ? "Fotografie" : "Video"}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{item.user}</TableCell>
                      <TableCell>{item.uploadedAt}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Akce</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewContent(item.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Zobrazit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteContent(item.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Smazat</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

