"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppNav } from "@/components/app-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, ImageIcon, FileText, Upload } from "lucide-react"

export default function CreatePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("video")
  const [isUploading, setIsUploading] = useState(false)

  // Video form state
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    file: null as File | null,
  })

  // Image form state
  const [imageData, setImageData] = useState({
    title: "",
    description: "",
    file: null as File | null,
  })

  // Blog form state
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    tags: "",
  })

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (!auth) {
      router.push("/signin")
    } else {
      setIsAuthenticated(true)
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const type = params.get("type")
      if (type === "video" || type === "image" || type === "blog") {
        setActiveTab(type)
      }
    }
  }, [router])

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsUploading(false)
    alert("Video uploaded successfully!")
    router.push("/dashboard")
  }

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsUploading(false)
    alert("Image uploaded successfully!")
    router.push("/dashboard")
  }

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsUploading(false)
    alert("Blog published successfully!")
    router.push("/dashboard")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Content</h1>
            <p className="text-muted-foreground">Share your creativity with the world</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="video" className="gap-2">
                <Play className="w-4 h-4" />
                Video
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Image
              </TabsTrigger>
              <TabsTrigger value="blog" className="gap-2">
                <FileText className="w-4 h-4" />
                Blog
              </TabsTrigger>
            </TabsList>

            {/* Video Upload */}
            <TabsContent value="video">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Video</CardTitle>
                  <CardDescription>Share your video content with your audience</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVideoSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="video-file">Video File</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <Input
                          id="video-file"
                          type="file"
                          accept="video/*"
                          onChange={(e) => setVideoData({ ...videoData, file: e.target.files?.[0] || null })}
                          className="hidden"
                          required
                        />
                        <label htmlFor="video-file" className="cursor-pointer">
                          <p className="text-sm font-medium">Click to upload video</p>
                          <p className="text-xs text-muted-foreground mt-1">MP4, MOV, AVI up to 500MB</p>
                        </label>
                      </div>
                      {videoData.file && (
                        <p className="text-sm text-muted-foreground">Selected: {videoData.file.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="video-title">Title</Label>
                      <Input
                        id="video-title"
                        placeholder="My Amazing Video"
                        value={videoData.title}
                        onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="video-description">Description</Label>
                      <Textarea
                        id="video-description"
                        placeholder="Tell viewers about your video..."
                        rows={4}
                        value={videoData.description}
                        onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Upload Video"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Image Upload */}
            <TabsContent value="image">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Image</CardTitle>
                  <CardDescription>Share your photos and artwork</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleImageSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-file">Image File</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <Input
                          id="image-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageData({ ...imageData, file: e.target.files?.[0] || null })}
                          className="hidden"
                          required
                        />
                        <label htmlFor="image-file" className="cursor-pointer">
                          <p className="text-sm font-medium">Click to upload image</p>
                          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF up to 10MB</p>
                        </label>
                      </div>
                      {imageData.file && (
                        <p className="text-sm text-muted-foreground">Selected: {imageData.file.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-title">Title</Label>
                      <Input
                        id="image-title"
                        placeholder="Beautiful Sunset"
                        value={imageData.title}
                        onChange={(e) => setImageData({ ...imageData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-description">Description</Label>
                      <Textarea
                        id="image-description"
                        placeholder="Tell viewers about your image..."
                        rows={4}
                        value={imageData.description}
                        onChange={(e) => setImageData({ ...imageData, description: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blog Post */}
            <TabsContent value="blog">
              <Card>
                <CardHeader>
                  <CardTitle>Write Blog Post</CardTitle>
                  <CardDescription>Share your thoughts and stories</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="blog-title">Title</Label>
                      <Input
                        id="blog-title"
                        placeholder="10 Tips for Better Content Creation"
                        value={blogData.title}
                        onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blog-content">Content</Label>
                      <Textarea
                        id="blog-content"
                        placeholder="Write your blog post here..."
                        rows={12}
                        value={blogData.content}
                        onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blog-tags">Tags</Label>
                      <Input
                        id="blog-tags"
                        placeholder="content, tips, tutorial"
                        value={blogData.tags}
                        onChange={(e) => setBlogData({ ...blogData, tags: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isUploading}>
                      {isUploading ? "Publishing..." : "Publish Blog Post"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
