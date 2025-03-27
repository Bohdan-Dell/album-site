"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Download, Heart, MoreHorizontal, Share, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

// Ukázková data - v reálné aplikaci by byla načtena z API
const mediaItems = [
  {
    id: 1,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Fotografie 1",
    type: "image",
    user: "Jan Novák",
    date: "2023-10-15",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Fotografie 2",
    type: "image",
    user: "Petra Svobodová",
    date: "2023-10-14",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Fotografie 3",
    type: "image",
    user: "Martin Dvořák",
    date: "2023-10-12",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Fotografie 4",
    type: "image",
    user: "Lucie Nováková",
    date: "2023-10-10",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Fotografie 5",
    type: "image",
    user: "Tomáš Horák",
    date: "2023-10-08",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Fotografie 6",
    type: "image",
    user: "Bohdan Leuchin",
    date: "2023-10-05",
  },
  {
    id: 7,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Fotografie 7",
    type: "image",
    user: "Jan Novák",
    date: "2023-10-04",
  },
  {
    id: 8,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Fotografie 8",
    type: "image",
    user: "Petra Svobodová",
    date: "2023-10-03",
  },
]

export function MediaGallery() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [items, setItems] = useState(mediaItems)
  const [favorites, setFavorites] = useState<number[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Kontrola přihlášení - v reálné aplikaci by to bylo napojeno na autentizační systém
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)
    }

    checkAuth()
  }, [])

  const toggleFavorite = (id: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Přihlášení vyžadováno",
        description: "Pro přidání do oblíbených se musíte přihlásit.",
        variant: "destructive",
      })
      return
    }

    if (favorites.includes(id)) {
      setFavorites(favorites.filter((itemId) => itemId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const handleDelete = (id: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Přihlášení vyžadováno",
        description: "Pro smazání média se musíte přihlásit.",
        variant: "destructive",
      })
      return
    }

    setItems(items.filter((item) => item.id !== id))
    toast({
      title: "Médium smazáno",
      description: "Médium bylo úspěšně smazáno.",
    })
  }

  const handleShare = (id: number) => {
    // Simulace sdílení - v reálné aplikaci by zde byl kód pro sdílení
    toast({
      title: "Odkaz zkopírován",
      description: "Odkaz na médium byl zkopírován do schránky.",
    })
  }

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight text-primary mb-8">Galerie</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg border border-primary/20">
              <div className="aspect-square relative">
                <Image
                  src={item.src || "/placeholder.svg"}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium truncate">{item.alt}</p>
                  <p className="text-white/70 text-sm">Od: {item.user}</p>
                  <p className="text-white/70 text-sm">{item.date}</p>
                </div>
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={() => toggleFavorite(item.id)}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      favorites.includes(item.id) ? "fill-destructive text-destructive" : "text-muted-foreground",
                    )}
                  />
                  <span className="sr-only">Přidat do oblíbených</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Více akcí</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShare(item.id)}>
                      <Share className="mr-2 h-4 w-4" />
                      <span>Sdílet</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Stáhnout</span>
                    </DropdownMenuItem>
                    {isLoggedIn && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Smazat</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

