import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { setAccessToken } from "@/src/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const token = searchParams.get("token")
    
    if (token) {
      setAccessToken(token)
      toast({
        title: "Login successful",
        description: "Welcome back!",
      })
      navigate("/dashboard")
    } else {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "No token received from authentication provider.",
      })
      navigate("/signin")
    }
  }, [searchParams, navigate, toast])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Completing sign in...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}
