"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppNav } from "@/components/app-nav"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
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

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">About CreativeHub</h1>
            <p className="text-muted-foreground">Learn more about our platform and mission</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                CreativeHub is dedicated to empowering creators worldwide by providing a comprehensive platform for
                sharing videos, images, blogs, and connecting with like-minded individuals through live chat.
              </p>

              <h2 className="text-2xl font-bold mt-8">What We Offer</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Video hosting and streaming with automatic optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Image galleries with advanced organization tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Powerful blog editor with rich formatting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Real-time chat for community engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Analytics and insights to track your growth</span>
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-8">Join Our Community</h2>
              <p className="text-muted-foreground leading-relaxed">
                Whether you&apos;re a photographer, videographer, writer, or multi-talented creator, CreativeHub
                provides the tools and community you need to showcase your work and grow your audience.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
