"use client"

import type React from "react"

import { useState } from "react"
import AppLayout from "../components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Link } from "react-router-dom"
import { Upload, X, ArrowLeft } from "lucide-react"

interface VideoUploadProps {
  isAuthenticated: boolean
}

export default function VideoUpload({ isAuthenticated }: VideoUploadProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
    }
  }

  const handleRemoveVideo = () => {
    setVideoFile(null)
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
      setVideoPreview(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Video upload:", { title, description, videoFile })
    // Handle video upload logic here
    alert("Video uploaded successfully!")
  }

  return (
    <AppLayout isAuthenticated={isAuthenticated}>
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/create">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Create
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Upload Video</CardTitle>
            <CardDescription>Share your video content with your audience</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Video File</Label>
                {!videoPreview ? (
                  <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your video here, or click to browse
                    </p>
                    <Input type="file" accept="video/*" onChange={handleVideoChange} className="max-w-xs mx-auto" />
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden bg-black">
                    <video src={videoPreview} controls className="w-full h-auto max-h-96" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveVideo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Video Title</Label>
                <Input
                  id="title"
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  placeholder="Describe your video..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={!videoFile}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/create">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
