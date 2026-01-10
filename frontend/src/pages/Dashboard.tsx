import AppLayout from "../components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import { Video, ImageIcon, FileText, TrendingUp, Users, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import api from "../lib/api"

interface DashboardProps {
  isAuthenticated: boolean
}




export default function Dashboard({ isAuthenticated }: DashboardProps) {
  const [username, setUsername] = useState('')
  const upper = username?.[0]?.toUpperCase() + username.slice(1)
  useEffect(() => {
    api.get("/users/me")
      .then((res) => {
        // console.log("Userfd :", res.data.user.userName)
        // console.log("User user :", res.data)
        setUsername(res.data.user.userName)
      })
      .catch(() => {
        window.location.href = "/signin"
      })
  }, [])


  return (
    <AppLayout isAuthenticated={isAuthenticated}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back {upper}! Here's your content overview.</p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/create">Create Content</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">0% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">+0 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Images</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">+0 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">+0 this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Create new content or manage existing</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <Button variant="outline" className="h-24 flex-col bg-transparent" asChild>
              <Link to="/create/video">
                <Video className="h-8 w-8 mb-2" />
                Upload Video
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-transparent" asChild>
              <Link to="/create/image">
                <ImageIcon className="h-8 w-8 mb-2" />
                Upload Images
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-transparent" asChild>
              <Link to="/create/blog">
                <FileText className="h-8 w-8 mb-2" />
                Write Blog
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>Your latest uploads and posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Video", title: "Getting Started Tutorial", views: "0K", date: "2 hours ago" },
                  { type: "Blog", title: "Building Modern Web Apps", views: "0K", date: "1 day ago" },
                  { type: "Image", title: "Product Photography", views: "0", date: "2 days ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.type} • {item.date}
                      </p>
                    </div>
                    <div className="text-sm font-medium ml-4 whitespace-nowrap">{item.views} views</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>Performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Engagement Rate</span>
                  </div>
                  <span className="text-sm font-medium">0%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">New Followers</span>
                  </div>
                  <span className="text-sm font-medium">+0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-500" />
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