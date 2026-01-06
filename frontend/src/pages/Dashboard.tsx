import AppLayout from "@/src/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Video, ImageIcon, FileText, TrendingUp, Users, Eye } from "lucide-react"

interface DashboardProps {
  isAuthenticated: boolean
}

export default function Dashboard({ isAuthenticated }: DashboardProps) {
  return (
    <AppLayout isAuthenticated={isAuthenticated}>
      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back! Here's your content overview.</p>
          </div>
          <Button asChild>
            <Link to="/create">Create Content</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Images</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">+2 this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Create new content or manage existing</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
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
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>Your latest uploads and posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Video", title: "Getting Started Tutorial", views: "2.3K", date: "2 hours ago" },
                  { type: "Blog", title: "Building Modern Web Apps", views: "1.8K", date: "1 day ago" },
                  { type: "Image", title: "Product Photography", views: "890", date: "2 days ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.type} • {item.date}
                      </p>
                    </div>
                    <div className="text-sm font-medium">{item.views} views</div>
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
                  <span className="text-sm font-medium">+12.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">New Followers</span>
                  </div>
                  <span className="text-sm font-medium">+234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Avg. View Duration</span>
                  </div>
                  <span className="text-sm font-medium">3m 42s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
