"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaGrid } from "@/components/media-grid"
import { Upload } from "lucide-react"
import Link from "next/link"

// Ukázková data - v reálné aplikaci by byla načtena z API pro konkrétního uživatele
const userMediaItems = [
  {
    id: 1,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Moje fotografie 1",
    type: "image",
    date: "2023-10-15",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Moje fotografie 2",
    type: "image",
    date: "2023-10-14",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Moje fotografie 3",
    type: "image",
    date: "2023-10-12",
  },
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

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
      <main className="container py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Moje média</h1>
          <Button asChild>
            <Link href="/">
              <Upload className="mr-2 h-4 w-4" />
              Nahrát média
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Celkem mých médií</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{userMediaItems.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Všechna moje média</TabsTrigger>
            <TabsTrigger value="recent">Nedávno přidané</TabsTrigger>
            <TabsTrigger value="favorites">Oblíbené</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <MediaGrid items={userMediaItems} />
          </TabsContent>
          <TabsContent value="recent" className="space-y-4">
            <MediaGrid items={userMediaItems.slice(0, 2)} />
          </TabsContent>
          <TabsContent value="favorites" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Zatím nemáte žádná oblíbená média.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/">Procházet galerii</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

