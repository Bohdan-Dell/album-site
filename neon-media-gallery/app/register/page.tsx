"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const router = useRouter()
  const { toast } = useToast()

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

    // Validace uživatelského jména
    if (!formData.username.trim()) {
      newErrors.username = "Uživatelské jméno je povinné"
      isValid = false
    } else if (formData.username.length < 3) {
      newErrors.username = "Uživatelské jméno musí mít alespoň 3 znaky"
      isValid = false
    }

    // Validace emailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email je povinný"
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Neplatný formát emailu"
      isValid = false
    }

    // Validace hesla
    if (!formData.password) {
      newErrors.password = "Heslo je povinné"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Heslo musí mít alespoň 8 znaků"
      isValid = false
    }

    // Validace potvrzení hesla
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Hesla se neshodují"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulace registrace - v reálné aplikaci by zde byl API požadavek
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulace úspěšné registrace
      localStorage.setItem("isLoggedIn", "true")

      toast({
        title: "Registrace úspěšná",
        description: "Váš účet byl úspěšně vytvořen.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Chyba při registraci",
        description: "Nastala chyba při vytváření účtu. Zkuste to prosím znovu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <Card className="border-primary/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-primary">Vytvořit účet</CardTitle>
              <CardDescription className="text-center">Zadejte své údaje pro vytvoření nového účtu</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Uživatelské jméno</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="uzivatel123"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={errors.username ? "border-destructive" : ""}
                  />
                  {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="vas@email.cz"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Heslo</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={errors.password ? "border-destructive pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showPassword ? "Skrýt heslo" : "Zobrazit heslo"}</span>
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Potvrdit heslo</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="********"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registrace..." : "Registrovat se"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm text-muted-foreground mt-2">
                Již máte účet?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Přihlaste se
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

