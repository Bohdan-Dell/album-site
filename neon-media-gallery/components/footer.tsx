import Link from "next/link"
import { Camera } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl text-primary">NeonGallery</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Moderní webová aplikace pro sdílení fotografií a videí v neonovém stylu.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Odkazy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Domů
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  O nás
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Právní informace</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Podmínky použití
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Ochrana soukromí
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Kontakt</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Email: info@neongallery.com</li>
              <li className="text-sm text-muted-foreground">Telefon: +420 123 456 789</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NeonGallery. Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  )
}

