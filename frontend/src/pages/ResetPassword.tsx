"use client"

import type React from "react"

import { useState , useEffect} from "react"
import { Link, useNavigate , useLocation} from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import api from "../lib/api"
import toast from "react-hot-toast"
import {Loader} from "../components/ui/Loader"

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const resetToken = location.state?.resetToken;
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!resetToken) {
      navigate("/forget-password");
    }
  }, [resetToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const finalData = {
      password: password
    }

    try {
      const res = await api.post("/auth/reset-password", finalData)
      if (res.data?.success === true) {
          navigate("/signin")
      } else {
        toast.error(res.data?.message ?? "Please check your details and try again.")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      
      let errorMessage = "Unable to sign in. Please try again."
      
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
          <CardTitle className="text-3xl font-bold">Set New Password</CardTitle>
          <CardDescription>Enter new secure password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="code"
                type="text"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Submit
              {isLoading && <Loader/>}
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
