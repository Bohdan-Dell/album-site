"use client"

import { useState } from "react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Download, Heart, MoreHorizontal, Pencil, Share, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export interface MediaItem {
  id: number
  src: string
  alt: string
  type: string
  date: string
}

interface MediaGridProps {
  items: MediaItem[]
}

export function MediaGrid({ items }: MediaGridProps) {
  const [mediaItems, setMediaItems] = useState(items)
  const [favorites, setFavorites] = useState<number[]>([])
  const { toast } = useToast()

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((itemId) => itemId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const handleDelete = (id: number) => {
    setMediaItems(mediaItems.filter((item) => item.id !== id))
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

  if (mediaItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Zatím nemáte žádná média.</p>
        <Button className="mt-4" asChild>
          <a href="/">Nahrát média</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mediaItems.map((item) => (
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
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Upravit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Smazat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}

