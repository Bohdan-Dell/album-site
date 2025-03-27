"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Camera, Menu, X, User } from "lucide-react"

export function MainNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Simulace kontroly přihlášení - v reálné aplikaci by to bylo napojeno na autentizační systém
  useEffect(() => {
    const checkAuth = async () => {
      // Zde by byla skutečná kontrola autentizace
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)
    }

    checkAuth()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-primary" />
            <span className="hidden font-bold text-xl text-primary sm:inline-block">Galeri 9A</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Domů
          </Link>
          <Link
            href="/gallery"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/gallery" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Galerie
          </Link>
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Moje média
            </Link>
          )}
        </nav>

        {/* Auth Buttons or User Nav */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                  <User className="h-4 w-4 mr-2" />
                  Moje média
                </Link>
              </Button>
              <UserNav />
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Přihlásit se</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Registrovat</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border/40 bg-background">
          <div className="container py-4 flex flex-col gap-4">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className={cn(
                  "px-2 py-1 text-sm font-medium rounded-md transition-colors hover:bg-accent",
                  pathname === "/" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Domů
              </Link>
              <Link
                href="/gallery"
                className={cn(
                  "px-2 py-1 text-sm font-medium rounded-md transition-colors hover:bg-accent",
                  pathname === "/gallery" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Galerie
              </Link>
              {isLoggedIn && (
                <Link
                  href="/dashboard"
                  className={cn(
                    "px-2 py-1 text-sm font-medium rounded-md transition-colors hover:bg-accent",
                    pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Moje média
                </Link>
              )}
            </nav>

            <div className="flex flex-col gap-2">
              {isLoggedIn ? (
                <Button variant="default" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/dashboard">Moje média</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/login">Přihlásit se</Link>
                  </Button>
                  <Button asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/register">Registrovat</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

