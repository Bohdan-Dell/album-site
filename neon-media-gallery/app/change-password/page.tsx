"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from "lucide-react"

export default function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    general: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Vyčistit chybu při změně hodnoty
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Validace současného hesla
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Současné heslo je povinné"
      isValid = false
    }

    // Validace nového hesla
    if (!formData.newPassword) {
      newErrors.newPassword = "Nové heslo je povinné"
      isValid = false
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Heslo musí mít alespoň 8 znaků"
      isValid = false
    }

    // Validace potvrzení hesla
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Hesla se neshodují"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulace změny hesla - v reálné aplikaci by zde byl API požadavek
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Heslo změněno",
        description: "Vaše heslo bylo úspěšně změněno.",
      })

      // Přesměrování na hlavní stránku
      router.push("/")
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Nastala chyba při změně hesla.",
      }))

      toast({
        title: "Chyba",
        description: "Nastala chyba při změně hesla. Zkuste to prosím znovu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <Card className="border-primary/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-primary">Změna hesla</CardTitle>
              <CardDescription className="text-center">Zadejte své současné heslo a nové heslo</CardDescription>
            </CardHeader>
            <CardContent>
              {errors.general && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">{errors.general}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Současné heslo</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={errors.currentPassword ? "border-destructive pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showCurrentPassword ? "Skrýt heslo" : "Zobrazit heslo"}</span>
                    </Button>
                  </div>
                  {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nové heslo</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.newPassword}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={errors.newPassword ? "border-destructive pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showNewPassword ? "Skrýt heslo" : "Zobrazit heslo"}</span>
                    </Button>
                  </div>
                  {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Potvrdit nové heslo</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showConfirmPassword ? "Skrýt heslo" : "Zobrazit heslo"}</span>
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Ukládání..." : "Změnit heslo"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="ghost" onClick={() => router.push("/")} disabled={isSubmitting}>
                Zrušit
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

