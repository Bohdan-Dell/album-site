import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Neon glow effects */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="animate-pulse text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
            Neon Gallery
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground sm:text-xl">
            Sdílejte své nejlepší fotografie a videa v moderním neonovém prostředí. Vytvářejte alba, organizujte obsah a
            sdílejte své vzpomínky s přáteli.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">Začít zdarma</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/gallery">Prohlédnout galerii</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

