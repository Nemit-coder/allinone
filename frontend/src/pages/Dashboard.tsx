import AppLayout from "../components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { Video, ImageIcon, FileText, TrendingUp, Users, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import api, { setAccessToken } from "../lib/api"

interface DashboardProps {
  isAuthenticated: boolean
}

export default function Dashboard({ isAuthenticated }: DashboardProps) {
  const [username, setUsername] = useState("")
  const [imageCount, setImageCount] = useState(0)
  const [videoCount, setVideoCount] = useState(0)
  const [blogCount, setBlogCount] = useState(0)
  const upper = username ? username[0].toUpperCase() + username.slice(1) : ""
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/users/me")
      .then((res) => setUsername(res.data.user.userName))
      .catch((error: any) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          setAccessToken(null)
          navigate("/signin", { replace: true })
        }
      })

    api.get("/create/getPostStats")
      .then((res) => {
        setImageCount(res.data.stats.images)
        setVideoCount(res.data.stats.videos)
        setBlogCount(res.data.stats.blogs)
      })
      .catch((err) => console.log("Stats fetch error:", err))
  }, [navigate])

  return (
    <AppLayout isAuthenticated={isAuthenticated}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Welcome back{upper ? `, ${upper}` : ""}! Here's your content overview.
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/create">Create Content</Link>
          </Button>
        </div>

        {/* ── Stats Grid ── */}
        {/* 2 cols on mobile, 4 on lg+ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">0% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{videoCount}</div>
              <p className="text-xs text-muted-foreground mt-1">+0 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Images</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{imageCount}</div>
              <p className="text-xs text-muted-foreground mt-1">+0 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{blogCount}</div>
              <p className="text-xs text-muted-foreground mt-1">+0 this week</p>
            </CardContent>
          </Card>
        </div>

        {/* ── Quick Actions ── */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Create new content or manage existing</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Button variant="outline" className="h-20 sm:h-24 flex-col gap-1 bg-transparent" asChild>
              <Link to="/create/video">
                <Video className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-sm">Upload Video</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 sm:h-24 flex-col gap-1 bg-transparent" asChild>
              <Link to="/create/image">
                <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-sm">Upload Images</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 sm:h-24 flex-col gap-1 bg-transparent" asChild>
              <Link to="/create/blog">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-sm">Write Blog</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* ── Recent Activity + Analytics ── */}
        {/* stacked on mobile, side-by-side on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>Your latest uploads and posts</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3 sm:space-y-4">
                {[
                  { type: "Video", title: "Getting Started Tutorial", views: "0K", date: "2 hours ago" },
                  { type: "Blog",  title: "Building Modern Web Apps",  views: "0K", date: "1 day ago" },
                  { type: "Image", title: "Product Photography",       views: "0",  date: "2 days ago" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.type} · {item.date}
                      </p>
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap shrink-0">
                      {item.views} views
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>Performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="text-sm">Engagement Rate</span>
                  </div>
                  <span className="text-sm font-medium">0%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-sm">New Followers</span>
                  </div>
                  <span className="text-sm font-medium">+0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-500 shrink-0" />
                    <span className="text-sm">Avg. View Duration</span>
                  </div>
                  <span className="text-sm font-medium">0m 0s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </AppLayout>
  )
}