import type React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, MessageSquare, PlusCircle, Info, LogOut, LayoutDashboard, Menu, X, Bell } from "lucide-react"
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

const NAV_LINKS = [
  { to: "/home",      label: "Home",      Icon: Home },
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/create",    label: "Create",    Icon: PlusCircle },
  { to: "/chat",      label: "Chat",      Icon: MessageSquare },
  { to: "/about",     label: "About",     Icon: Info },
]

export default function AppLayout({ children, isAuthenticated }: AppLayoutProps) {
  const [userData, setUserData] = useState<{ userName?: string; email?: string; avatar?: string } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifCount, setNotifCount] = useState(0)

  const navigate = useNavigate()

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

  const locateProfile = () => { window.location.href = "/profile" }
  const locateSettings = () => { window.location.href = "/settings" }

  const token = getAccessToken()
  const isAuth = isAuthenticated || !!token
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (isAuth && token) {
      api.get("/users/me")
        .then((res) => {
          if (res.data?.user) {
            setUserData({
              userName: res.data.user.userName,
              email: res.data.user.email,
              avatar: res.data.user.avatar.url,
            })
          }
        })
        .catch((error: any) => {
          if (error?.response?.status === 401 || error?.response?.status === 403) {
            setAccessToken(null)
            window.location.href = "/signin"
          }
        })

      // Fetch notification count
      api.get("/users/notifications")
        .then((res) => {
          if (res.data?.success) setNotifCount(res.data.count ?? 0)
        })
        .catch(() => {})
    }
  }, [isAuth, token])

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/")

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top Navigation Bar ── */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Left: Logo */}
            <Link
              to={isAuth ? "/dashboard" : "/"}
              className="flex items-center gap-2 shrink-0"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                C
              </div>
              <span className="font-bold text-xl">ContentHub</span>
            </Link>

            {/* Center: Desktop nav links */}
            {isAuth && (
              <div className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map(({ to, label, Icon }) => (
                  <Button
                    key={to}
                    variant={isActive(to) ? "secondary" : "ghost"}
                    size="sm"
                    asChild
                  >
                    <Link to={to}>
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  </Button>
                ))}
              </div>
            )}

            {/* Right: Bell + Avatar or Sign In + Hamburger */}
            <div className="flex items-center gap-2">
              {isAuth ? (
                <>
                  {/* Notification Bell */}
                  <button
                    onClick={() => navigate("/notifications")}
                    className="relative flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {notifCount > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {notifCount > 9 ? "9+" : notifCount}
                      </span>
                    )}
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-9 w-9 cursor-pointer" key={userData?.avatar || "fallback"}>
                        {userData?.avatar ? (
                          <AvatarImage src={userData.avatar} alt="User" />
                        ) : null}
                        <AvatarFallback>
                          {userData?.userName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={locateProfile}>Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={locateSettings}>Settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span className="text-red-700">Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Hamburger — mobile only */}
                  <button
                    className="md:hidden flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
                    onClick={() => setMobileMenuOpen((o) => !o)}
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </button>
                </>
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
        </div>

        {/* ── Mobile Drawer ── */}
        {isAuth && mobileMenuOpen && (
          <div className="md:hidden border-t bg-background px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                  ${isActive(to)
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
            {/* Notifications link in mobile drawer too */}
            <Link
              to="/notifications"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                ${isActive("/notifications")
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              <Bell className="h-4 w-4 shrink-0" />
              Notifications
              {notifCount > 0 && (
                <span className="ml-auto h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {notifCount > 9 ? "9+" : notifCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}