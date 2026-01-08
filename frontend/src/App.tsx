"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import LandingPage from "./pages/LandingPage"
import SignIn from "./pages/SignIn"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Chat from "./pages/Chat"
import CreateContent from "./pages/CreateContent"
import VideoUpload from "./pages/VideoUpload"
import ImageUpload from "./pages/ImageUpload"
import BlogUpload from "./pages/BlogUpload"
import About from "./pages/About"
import AuthCallback from "./pages/AuthCallback"
import { Toaster } from "@/components/ui/toaster"
import ProtectedRoute from "./components/ProtectedRoute"
import { getAccessToken } from "./lib/api"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = getAccessToken()
    setIsAuthenticated(!!token)
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn onSignIn={() => setIsAuthenticated(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Dashboard routes - accessible for now */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard isAuthenticated={isAuthenticated} />
              </ProtectedRoute>
            }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateContent isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/video"
          element={
            <ProtectedRoute>
              <VideoUpload isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/image"
          element={
            <ProtectedRoute>
              <ImageUpload isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/blog"
          element={
            <ProtectedRoute>
              <BlogUpload isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About isAuthenticated={isAuthenticated} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
