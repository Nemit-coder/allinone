import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { setAccessToken } from "@/src/lib/api"
import toast from "react-hot-toast"

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    
    if (token) {
      setAccessToken(token)
      toast.success("Login successful! Welcome back!")
      navigate("/dashboard")
    } else {
      toast.error("Authentication failed. No token received from authentication provider.")
      navigate("/signin")
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Completing sign in...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}
