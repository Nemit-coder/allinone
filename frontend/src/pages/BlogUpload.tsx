"use client"

import type React from "react"

import { useState } from "react"
import AppLayout from "../components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Link } from "react-router-dom"
import { FileText, ArrowLeft, Eye } from "lucide-react"
import api from "../lib/api"
import toast from "react-hot-toast"

interface BlogUploadProps {
  isAuthenticated: boolean
}

export default function BlogUpload({ isAuthenticated }: BlogUploadProps) {
  const [formData, setFormData] = useState({
      title: "",
      description: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState("")
  const [preview, setPreview] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
    setIsLoading(true)

    const submitData = new FormData()
    submitData.append('title', formData.title);
    submitData.append('description', formData.description)
    submitData.append('type', "blog")
    submitData.append('tags', tags)

    try {
      const res = await api.post("/create/createPost/blog", submitData)
      if(res.data?.success === true){
        toast.success('Image uploaded successfully')
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
            <CardTitle className="text-2xl">Write Blog Post</CardTitle>
            <CardDescription>Create engaging content for your audience</CardDescription>
          </CardHeader>
          <CardContent>
            {!preview ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter your blog post title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Write your blog post content here..."
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.description.length} characters • {Math.ceil(formData.description.split(/\s+/).length / 200)} min read
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="e.g., technology, tutorial, web development"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    <FileText className="mr-2 h-4 w-4" />
                    Publish Post
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setPreview(true)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link to="/create">Cancel</Link>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <h1 className="text-3xl font-bold mb-4">{formData.title || "Untitled Post"}</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <span>{new Date().toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{Math.ceil(formData.description.split(/\s+/).length / 200)} min read</span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">{formData.description || "No content yet..."}</div>
                  {tags && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="outline" onClick={() => setPreview(false)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Editor
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
