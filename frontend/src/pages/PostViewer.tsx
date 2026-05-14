import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import api from "../lib/api"
import { ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

const BASE_URL = "http://localhost:3000"

interface Post {
  _id: string
  type: "image" | "video" | "blog"
  media: string[]
  title: string
  description?: string
  tags?: string[]
  uploadedBy: {
    _id: string
    userName: string
    avatar: string
  }
  createdAt: string
}

interface PostDetailProps {
  isAuthenticated: boolean
}

export default function PostViewer({ isAuthenticated }: PostDetailProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    api.get(`/create/getPosts/${id}`)        
      .then((res) => {
        if (res.data?.success) setPost(res.data.post)
        else setError("Post not found.")
      })
      .catch(() => setError("Failed to load post."))
      .finally(() => setIsLoading(false))
  }, [id])

  return (
    <AppLayout isAuthenticated={isAuthenticated}>
      <div className="container max-w-3xl mx-auto py-10 px-4">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4"/> Back
        </button>

        {isLoading && (
          <div className="text-center text-muted-foreground py-20">Loading...</div>
        )}

        {error && (
          <div className="text-center text-red-500 py-20">{error}</div>
        )}

        {post && (
          <div className="flex flex-col gap-6">

            {/* Media */}
            {post.type === "image" && post.media.length > 0 && (
              <div className="rounded-xl overflow-hidden bg-muted">
                <img
                  src={`${BASE_URL}/${post.media[0]}`}
                  alt={post.title}
                  className="w-full object-contain max-h-[70vh]"
                />
              </div>
            )}

            {post.type === "video" && post.media.length > 0 && (
              <div className="rounded-xl overflow-hidden bg-black">
                <video
                  src={`${BASE_URL}/${post.media[0]}`}
                  className="w-full max-h-[70vh]"
                  controls
                  autoPlay
                />
              </div>
            )}

            {post.type === "blog" && (
              <div className="aspect-video w-full bg-muted rounded-xl flex items-center justify-center">
                <span className="text-6xl">📝</span>
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-col gap-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit
                ${post.type === "image" ? "bg-blue-100 text-blue-700" :
                  post.type === "video" ? "bg-purple-100 text-purple-700" :
                  "bg-green-100 text-green-700"}`}>
                {post.type}
              </span>

              <h1 className="text-2xl font-bold leading-snug">{post.title}</h1>

              {post.description && (
                <p className="text-muted-foreground leading-relaxed">{post.description}</p>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-muted px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9" key={post.uploadedBy.avatar || 'fallback'}>
                  {post.uploadedBy.avatar ? (
                    <AvatarImage src={`http://localhost:3000${post.uploadedBy.avatar}`} alt="User" />
                  ): null}
                  <AvatarFallback>
                    {post.uploadedBy.userName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-muted-foreground">
                  {post.uploadedBy.userName}
                </p>
              </div>
            </div>

            {/* Extra images for image posts */}
            {post.type === "image" && post.media.length > 1 && (
              <div className="grid grid-cols-2 gap-3">
                {post.media.slice(1).map((src, i) => (
                  <div key={i} className="rounded-lg overflow-hidden bg-muted">
                    <img
                      src={`${BASE_URL}/${src}`}
                      alt={`${post.title} ${i + 2}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </AppLayout>
  )
}