"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Validace emailu
    if (!formData.email.trim()) {
      newErrors.email = "Email je povinný"
      isValid = false
    }

    // Validace hesla
    if (!formData.password) {
      newErrors.password = "Heslo je povinné"
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
      // Simulace přihlášení - v reálné aplikaci by zde byl API požadavek
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Kontrola VIP uživatelů
      const isVipUser = formData.email === "bohdanleuchin@gmail.com"

      // Simulace úspěšného přihlášení
      localStorage.setItem("isLoggedIn", "true")
      if (isVipUser) {
        localStorage.setItem("userRole", "vip")
      }

      toast({
        title: "Přihlášení úspěšné",
        description: "Byli jste úspěšně přihlášeni.",
      })

      router.push("/dashboard")
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Nesprávný email nebo heslo.",
      }))

      toast({
        title: "Chyba při přihlášení",
        description: "Nesprávný email nebo heslo.",
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
              <CardTitle className="text-2xl font-bold text-center text-primary">Přihlášení</CardTitle>
              <CardDescription className="text-center">Zadejte své přihlašovací údaje</CardDescription>
            </CardHeader>
            <CardContent>
              {errors.general && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">{errors.general}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Heslo</Label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                      Zapomenuté heslo?
                    </Link>
                  </div>
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

                <div className="flex items-center space-x-2">
                  <Checkbox id="rememberMe" checked={formData.rememberMe} onCheckedChange={handleCheckboxChange} />
                  <Label htmlFor="rememberMe" className="text-sm">
                    Zapamatovat si mě
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Přihlašování..." : "Přihlásit se"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm text-muted-foreground mt-2">
                Nemáte účet?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Zaregistrujte se
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

