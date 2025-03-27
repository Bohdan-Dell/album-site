"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Ukázkové obrázky - v reálné aplikaci by byly načteny z databáze
const galleryItems = [
  {
    id: 1,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Galerie 1",
    type: "image",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Galerie 2",
    type: "image",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Galerie 3",
    type: "image",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Galerie 4",
    type: "image",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Galerie 5",
    type: "image",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Galerie 6",
    type: "image",
  },
]

export function PopularGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === galleryItems.length - 3 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? galleryItems.length - 3 : prevIndex - 1))
  }

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight text-primary mb-8">Populární galerie</h2>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {galleryItems.map((item) => (
                <div key={item.id} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 p-2">
                  <div className="relative aspect-video overflow-hidden rounded-lg border border-primary/20 group">
                    <Image
                      src={item.src || "/placeholder.svg"}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white font-medium">{item.alt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Předchozí</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Další</span>
          </Button>
        </div>
      </div>
    </section>
  )
}

