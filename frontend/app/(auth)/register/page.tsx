"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthHeader } from "@/components/auth-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  console.log("RegisterPage component rendered")
  
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  })
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    alert("Form submitted! Check console for details.")
    console.log("=== FORM SUBMITTED ===")
    console.log("Form data state:", formData)
    setIsLoading(true)

    const finalData = {
      userName: formData.username,
      fullName: formData.fullname,
      email: formData.email,
      password: formData.password,
      avatar: avatarPreview || undefined,
    }
    
    console.log("Sending registration data:", { ...finalData, password: "***" })
    
    const api = axios.create({
      baseURL: "http://localhost:5000/api/v1",
      withCredentials: true
    })

    console.log("Full URL will be: http://localhost:5000/api/v1/users/register")
    
    const sendData = api.post("users/register", finalData)
    sendData
      .then((res) => {
        if (res.data?.success === true) {
          toast({
            title: "Account created",
            description: "Redirecting you to your dashboard...",
          })

          // Show toast briefly before navigating
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 1500)
        } else {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: res.data?.message ?? "Please check your details and try again.",
          })
        }
      })
      .catch((error) => {
        console.error("Registration error:", error)
        console.error("Error response:", error.response)
        console.error("Error message:", error.message)
        
        let errorMessage = "Unable to create your account. Please try again."
        
        if (error.response) {
          // Server responded with error status
          errorMessage = error.response.data?.message || errorMessage
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = "No response from server. Please check if the backend is running."
        } else {
          // Something else happened
          errorMessage = error.message || errorMessage
        }
        
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: errorMessage,
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", "user@gmail.com")
    localStorage.setItem("userName", "Google User")
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Enter your information to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarPreview || "/placeholder.svg"} />
                    <AvatarFallback>{formData.fullname?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isLoading}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
