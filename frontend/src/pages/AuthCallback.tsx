import { useEffect , useRef} from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { setAccessToken } from "../lib/api"
import toast from "react-hot-toast"

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true
    const token = searchParams.get("token")
    
    if (token) {
      setAccessToken(token)
      navigate("/dashboard", {replace: true})
      toast.success("Login successful! Welcome back!")
    } else {
      toast.error("Authentication failed. No token received from authentication provider.")
      navigate("/signin", {replace: true})
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
