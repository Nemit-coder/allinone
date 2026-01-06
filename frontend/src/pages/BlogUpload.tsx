"use client"

import type React from "react"

import { useState } from "react"
import AppLayout from "@/src/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { FileText, ArrowLeft, Eye } from "lucide-react"

interface BlogUploadProps {
  isAuthenticated: boolean
}

export default function BlogUpload({ isAuthenticated }: BlogUploadProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [preview, setPreview] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Blog post:", { title, content, tags })
    alert("Blog post published successfully!")
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
                    placeholder="Enter your blog post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <textarea
                    id="content"
                    placeholder="Write your blog post content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {content.length} characters • {Math.ceil(content.split(/\s+/).length / 200)} min read
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
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
                  <h1 className="text-3xl font-bold mb-4">{title || "Untitled Post"}</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <span>{new Date().toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{Math.ceil(content.split(/\s+/).length / 200)} min read</span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">{content || "No content yet..."}</div>
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
