import AppLayout from "../components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import { Video, ImageIcon, FileText, Upload } from "lucide-react"

interface CreateContentProps {
  isAuthenticated: boolean
}

export default function CreateContent({ isAuthenticated }: CreateContentProps) {
  return (
    <AppLayout isAuthenticated={isAuthenticated}>
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Create Content</h1>
          <p className="text-lg text-muted-foreground">Choose the type of content you want to create</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Video className="h-8 w-8" />
              </div>
              <CardTitle>Upload Video</CardTitle>
              <CardDescription>Share video content with your audience</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/create/video">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8" />
              </div>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Share photos and graphics with everyone</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/create/image">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Images
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <CardTitle>Write Blog</CardTitle>
              <CardDescription>Create engaging blog posts and articles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/create/blog">
                  <FileText className="mr-2 h-4 w-4" />
                  Write Blog
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
