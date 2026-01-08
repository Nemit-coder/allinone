import { Navigate } from "react-router-dom"
import { getAccessToken } from "@/src/lib/api"

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const accessToken = getAccessToken()
  const isLoggedIn = !!accessToken

  return isLoggedIn ? children : <Navigate to="/signin" />
}
