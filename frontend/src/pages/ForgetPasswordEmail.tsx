"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
// import { Label } from "../components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import api from "../lib/api"
import toast from "react-hot-toast"

export default function ForgetPasswordEmail() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const finalData = {
      email: email
    }

    try {
      const res = await api.post("/auth/forgotPassword", finalData)
      if (res.data?.success === true) {
        // setAccessToken(res.data.accessToken)
        // onSignIn()
        // toast.success("Login successful! Welcome back!")

        setTimeout(() => {
          navigate("/forget-password")
        }, 500)
      } else {
        toast.error(res.data?.message ?? "Please check your details and try again.")
      }
    } catch (error: any) {
      
      let errorMessage = "Unable to sign in. Please try again."
      console.error("Login error:", errorMessage)
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage
        console.log(error.response)
      } else if (error.request) {
        errorMessage = "No response from server. Please check if the backend is running."
        console.log(error.request)
      } else {
        errorMessage = error.message || errorMessage
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Enter Your Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="code"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Code
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary">
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
