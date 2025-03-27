"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Camera, Grid, Home, Image, Settings, Upload, Users } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  admin?: boolean
}

export function DashboardNav() {
  const pathname = usePathname()
  const isAdmin = localStorage.getItem("userRole") === "admin"

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      title: "Moje média",
      href: "/dashboard/media",
      icon: <Image className="mr-2 h-4 w-4" />,
    },
    {
      title: "Alba",
      href: "/dashboard/albums",
      icon: <Grid className="mr-2 h-4 w-4" />,
    },
    {
      title: "Nahrát média",
      href: "/upload",
      icon: <Upload className="mr-2 h-4 w-4" />,
    },
    {
      title: "Nastavení",
      href: "/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
    {
      title: "Správa uživatelů",
      href: "/admin/users",
      icon: <Users className="mr-2 h-4 w-4" />,
      admin: true,
    },
    {
      title: "Správa obsahu",
      href: "/admin/content",
      icon: <Camera className="mr-2 h-4 w-4" />,
      admin: true,
    },
  ]

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => {
        // Skrýt admin položky pro běžné uživatele
        if (item.admin && !isAdmin) return null

        return (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn(
              "justify-start",
              pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
            asChild
          >
            <Link href={item.href}>
              {item.icon}
              {item.title}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}

