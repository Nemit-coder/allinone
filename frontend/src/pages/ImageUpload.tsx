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

interface ImageUploadProps {
  isAuthenticated: boolean
}

export default function ImageUpload({ isAuthenticated }: ImageUploadProps) {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setImages([...images, ...newImages])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    URL.revokeObjectURL(newImages[index].preview)
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Image upload:", { title, description, images })
    alert("Images uploaded successfully!")
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
            <CardTitle className="text-2xl">Upload Images</CardTitle>
            <CardDescription>Share your photos and graphics with everyone</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Image Files</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">Select multiple images or drag and drop</p>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="max-w-xs mx-auto"
                  />
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border">
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Gallery Title</Label>
                <Input
                  id="title"
                  placeholder="Enter gallery title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  placeholder="Describe your gallery..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={images.length === 0}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Images
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
