import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, MessageSquare, PlusCircle, Info, LogOut } from "lucide-react"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import api, { setAccessToken, getAccessToken } from "../lib/api"
import { useEffect, useState } from "react"

interface AppLayoutProps {
  children: React.ReactNode
  isAuthenticated: boolean
}

export default function AppLayout({ children, isAuthenticated }: AppLayoutProps) {
  const [userData, setUserData] = useState<{ userName?: string; email?: string; avatar?: string } | null>(null)
  
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setAccessToken(null)
      window.location.href = "/signin"
    }
  }

  const locateProfile = () => {
    window.location.href = "/profile"
  }
  
  // Check token directly to ensure accurate auth state
  const token = getAccessToken()
  const isAuth = isAuthenticated || !!token
  const location = useLocation()

  useEffect(() => {
    if (isAuth && token) {
      api.get("/users/me")
        .then((res) => {
          if (res.data?.user) {
            console.log(res.data)
            setUserData({
              userName: res.data.user.userName,
              email: res.data.user.email,
              avatar: res.data.user.avatar,
            })
          }
        })
        .catch(() => {
          // Silently fail - user might not be authenticated
        })
    }
  }, [isAuth, token])

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-8">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                C
              </div>
              <span className="hidden font-bold text-xl sm:inline-block">ContentHub</span>
            </Link>

            {isAuth && (
              <div className="hidden md:flex items-center gap-1">
                <Button variant={isActive("/dashboard") ? "secondary" : "ghost"} size="sm" asChild>
                  <Link to="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant={isActive("/create") ? "secondary" : "ghost"} size="sm" asChild>
                  <Link to="/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create
                  </Link>
                </Button>
                <Button variant={isActive("/chat") ? "secondary" : "ghost"} size="sm" asChild>
                  <Link to="/chat">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Link>
                </Button>
                <Button variant={isActive("/about") ? "secondary" : "ghost"} size="sm" asChild>
                  <Link to="/about">
                    <Info className="mr-2 h-4 w-4" />
                    About
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer" key={userData?.avatar || 'fallback'}>
                    {userData?.avatar ? (
                      <AvatarImage src={`http://localhost:3000${userData?.avatar}`} alt="User" />
                    ) : null}
                    <AvatarFallback>
                      {userData?.userName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={locateProfile}>
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="text-red-700">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}