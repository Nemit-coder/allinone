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
import api from "../lib/api"
import toast from "react-hot-toast"

interface VideoUploadProps {
  isAuthenticated: boolean
}

export default function VideoUpload({ isAuthenticated }: VideoUploadProps) {
   const [formData, setFormData] = useState({
      title: "",
      description: ""
    })
  const [isLoading, setIsLoading] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  // const [title, setTitle] = useState("")
  // const [description, setDescription] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const submitData = new FormData()
    submitData.append('title', formData.title);
    submitData.append('description', formData.description)
    submitData.append('type', "video")

    if (videoFile) {
      submitData.append('media', videoFile);
    }

    try {
      const res = await api.post("/create/createPost/video", submitData)
      if(res.data?.success === true){
        toast.success('Video uploaded successfully')
       }
      else {
        toast.error(res.data?.message ?? "Please check your details and try again.")
      }
    } catch (error: any) {
       console.error("Image uploading error:", error)
      
      let errorMessage = "Unable to create your account. Please try again."
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage
      } else if (error.request) {
        errorMessage = "No response from server. Please check if the backend is running."
      } else {
        errorMessage = error.message || errorMessage
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
}

  


  return (
    <AppLayout isAuthenticated={isAuthenticated}>
      <div className="container max-w-4xl py-8 mx-auto">
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
                  name="title"
                  placeholder="Enter video title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your video..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                  disabled={isLoading}
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
