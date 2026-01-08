"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppNav } from "@/components/app-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Play, ImageIcon, FileText, TrendingUp, Users, Eye } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (!auth) {
      router.push("/signin")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  // Sample data for demonstration
  const stats = [
    { label: "Total Views", value: "12,345", icon: Eye, change: "+12%" },
    { label: "Total Posts", value: "48", icon: FileText, change: "+8%" },
    { label: "Followers", value: "1,234", icon: Users, change: "+23%" },
    { label: "Engagement", value: "8.4%", icon: TrendingUp, change: "+5%" },
  ]

  const recentPosts = [
    {
      id: 1,
      type: "video",
      title: "My Latest Video Tutorial",
      views: "2.3K",
      date: "2 hours ago",
      icon: Play,
    },
    {
      id: 2,
      type: "image",
      title: "Photography Collection",
      views: "1.8K",
      date: "1 day ago",
      icon: ImageIcon,
    },
    {
      id: 3,
      type: "blog",
      title: "How to Create Engaging Content",
      views: "3.1K",
      date: "3 days ago",
      icon: FileText,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your content today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">{stat.change}</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Your latest published content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post) => {
                  const Icon = post.icon
                  return (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {post.views} views • {post.date}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Create new content in seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button className="h-auto py-6 flex-col gap-2" onClick={() => router.push("/create?type=video")}>
                  <Play className="w-6 h-6" />
                  <span>Upload Video</span>
                </Button>
                <Button className="h-auto py-6 flex-col gap-2" onClick={() => router.push("/create?type=image")}>
                  <ImageIcon className="w-6 h-6" />
                  <span>Upload Image</span>
                </Button>
                <Button className="h-auto py-6 flex-col gap-2" onClick={() => router.push("/create?type=blog")}>
                  <FileText className="w-6 h-6" />
                  <span>Write Blog</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
