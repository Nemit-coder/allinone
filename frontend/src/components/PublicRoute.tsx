import { Navigate } from "react-router-dom"
import { getAccessToken } from "../lib/api"

interface PublicRouteProps {
  children: JSX.Element
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const token = getAccessToken()

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
