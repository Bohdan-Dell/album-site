"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Ban, Lock, MoreHorizontal, Search, Shield, Unlock, User } from "lucide-react"

// Ukázková data - v reálné aplikaci by byla načtena z API
const usersData = [
  {
    id: 1,
    name: "Jan Novák",
    email: "jan.novak@example.com",
    role: "user",
    status: "active",
    registeredAt: "2023-09-15",
    lastLogin: "2023-10-20",
  },
  {
    id: 2,
    name: "Petra Svobodová",
    email: "petra.svobodova@example.com",
    role: "user",
    status: "active",
    registeredAt: "2023-09-18",
    lastLogin: "2023-10-19",
  },
  {
    id: 3,
    name: "Martin Dvořák",
    email: "martin.dvorak@example.com",
    role: "user",
    status: "blocked",
    registeredAt: "2023-09-20",
    lastLogin: "2023-10-10",
  },
  {
    id: 4,
    name: "Lucie Nováková",
    email: "lucie.novakova@example.com",
    role: "user",
    status: "active",
    registeredAt: "2023-09-25",
    lastLogin: "2023-10-18",
  },
  {
    id: 5,
    name: "Tomáš Horák",
    email: "tomas.horak@example.com",
    role: "vip",
    status: "active",
    registeredAt: "2023-09-30",
    lastLogin: "2023-10-20",
  },
  {
    id: 6,
    name: "Bohdan Leuchin",
    email: "bohdanleuchin@gmail.com",
    role: "vip",
    status: "active",
    registeredAt: "2023-10-01",
    lastLogin: "2023-10-21",
  },
  {
    id: 7,
    name: "Admin",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    registeredAt: "2023-08-01",
    lastLogin: "2023-10-21",
  },
]

export default function AdminUsersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [users, setUsers] = useState(usersData)
  const [searchQuery, setSearchQuery] = useState("")

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Kontrola přihlášení a role - v reálné aplikaci by to bylo napojeno na autentizační systém
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      const userRole = localStorage.getItem("userRole")

      if (!loggedIn) {
        router.push("/login")
        return
      }

      // Simulace kontroly role - v reálné aplikaci by to bylo řešeno jinak
      // Pro účely ukázky nastavíme všechny přihlášené uživatele jako adminy
      setIsAdmin(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleBlockUser = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "blocked" ? "active" : "blocked" } : user,
      ),
    )

    const user = users.find((u) => u.id === userId)
    const newStatus = user?.status === "blocked" ? "active" : "blocked"

    toast({
      title: `Uživatel ${newStatus === "blocked" ? "zablokován" : "odblokován"}`,
      description: `Uživatel ${user?.name} byl úspěšně ${newStatus === "blocked" ? "zablokován" : "odblokován"}.`,
    })
  }

  const handleChangeRole = (userId: number, newRole: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

    const user = users.find((u) => u.id === userId)

    toast({
      title: "Role změněna",
      description: `Uživatel ${user?.name} má nyní roli ${newRole}.`,
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-primary">Načítání...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Přístup odepřen</h1>
          <p className="text-muted-foreground mb-6">Nemáte oprávnění pro přístup k této stránce.</p>
          <Button onClick={() => router.push("/dashboard")}>Zpět na dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-8">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Správa uživatelů</h1>
              <p className="text-muted-foreground mt-1">Spravujte uživatelské účty, role a oprávnění</p>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Hledat uživatele..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Uživatel</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Stav</TableHead>
                  <TableHead>Registrace</TableHead>
                  <TableHead>Poslední přihlášení</TableHead>
                  <TableHead className="text-right">Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Žádní uživatelé nebyli nalezeni.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "admin" ? "destructive" : user.role === "vip" ? "default" : "outline"}
                        >
                          {user.role === "admin" ? "Administrátor" : user.role === "vip" ? "VIP" : "Uživatel"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "outline" : "destructive"}>
                          {user.status === "active" ? "Aktivní" : "Blokován"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.registeredAt}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Akce</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleBlockUser(user.id)}>
                              {user.status === "blocked" ? (
                                <>
                                  <Unlock className="mr-2 h-4 w-4" />
                                  <span>Odblokovat</span>
                                </>
                              ) : (
                                <>
                                  <Ban className="mr-2 h-4 w-4" />
                                  <span>Blokovat</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(user.id, user.role === "user" ? "vip" : "user")}
                              disabled={user.role === "admin"}
                            >
                              {user.role === "user" ? (
                                <>
                                  <Shield className="mr-2 h-4 w-4" />
                                  <span>Povýšit na VIP</span>
                                </>
                              ) : (
                                <>
                                  <User className="mr-2 h-4 w-4" />
                                  <span>Nastavit jako běžného uživatele</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(user.id, "admin")}
                              disabled={user.role === "admin"}
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              <span>Nastavit jako administrátora</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

