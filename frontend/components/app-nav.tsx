"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, PlusCircle, MessageCircle, Info, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppNav() {
  const pathname = usePathname()
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [userAvatar, setUserAvatar] = useState("")

  useEffect(() => {
    // Load user data from localStorage
    const name = localStorage.getItem("userName") || "User"
    const email = localStorage.getItem("userEmail") || ""
    const avatar = localStorage.getItem("userAvatar") || ""
    setUserName(name)
    setUserEmail(email)
    setUserAvatar(avatar)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/"
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/create", label: "Create", icon: PlusCircle },
    { href: "/chat", label: "Chat", icon: MessageCircle },
    { href: "/about", label: "About", icon: Info },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-foreground">
          CreativeHub
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className={cn("gap-2", isActive && "bg-accent text-accent-foreground")}>
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                <AvatarFallback>{userName[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-t border-border">
        <div className="container mx-auto px-4 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("flex-col h-auto py-2 gap-1", isActive && "bg-accent text-accent-foreground")}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
