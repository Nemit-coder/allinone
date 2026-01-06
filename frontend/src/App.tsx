"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn onSignIn={() => setIsAuthenticated(true)} />} />
      <Route path="/register" element={<Register onRegister={() => setIsAuthenticated(true)} />} />

      {/* Dashboard routes - accessible for now */}
      <Route path="/dashboard" element={<Dashboard isAuthenticated={isAuthenticated} />} />
      <Route path="/chat" element={<Chat isAuthenticated={isAuthenticated} />} />
      <Route path="/create" element={<CreateContent isAuthenticated={isAuthenticated} />} />
      <Route path="/create/video" element={<VideoUpload isAuthenticated={isAuthenticated} />} />
      <Route path="/create/image" element={<ImageUpload isAuthenticated={isAuthenticated} />} />
      <Route path="/create/blog" element={<BlogUpload isAuthenticated={isAuthenticated} />} />
      <Route path="/about" element={<About isAuthenticated={isAuthenticated} />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
