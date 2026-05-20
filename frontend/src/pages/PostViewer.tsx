import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import api from "../lib/api"
import { ArrowLeft, Heart, MessageCircle, Send, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"


// ─── Helper: decode userId from your JWT stored in localStorage ───────────────
// Your JWT payload shape is { id, iat, exp } — set by generateAccessToken(id)
const getCurrentUserId = (): string => {
  try {
    const token = localStorage.getItem("accessToken")
    if (!token) return ""
    const payload = JSON.parse(window.atob(token.split(".")[1]))
    return payload.id ?? ""
  } catch {
    return ""
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Comment {
  _id: string
  user: {
    _id: string
    userName: string
    avatar: {
      url: string
    }
  }
  text: string
  createdAt: string
}

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
    avatar: {
      url: string
    }
  }
  createdAt: string
  likes: string[]
  comments: Comment[]
}

interface PostDetailProps {
  isAuthenticated: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PostViewer({ isAuthenticated }: PostDetailProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // decoded once — won't change during this page visit
  const currentUserId = getCurrentUserId()

  const [post, setPost]           = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState("")

  // likes
  const [liked, setLiked]         = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [liking, setLiking]       = useState(false)

  // carousel
  const [currentSlide, setCurrentSlide] = useState(0)

  // comments
  const [commentText, setCommentText] = useState("")
  const [submitting, setSubmitting]   = useState(false)
  const [deletingId, setDeletingId]   = useState<string | null>(null)
  const commentInputRef = useRef<HTMLTextAreaElement>(null)

  // ── Fetch post ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    api.get(`/create/getPosts/${id}`)
      .then((res) => {
        if (res.data?.success) {
          const p: Post = res.data.post
          setPost(p)
          setLikeCount(p.likes?.length ?? 0)
          // pre-fill heart: check if logged-in user's id is already in the likes array
          setLiked(p.likes?.some((uid) => uid === currentUserId) ?? false)
        } else {
          setError("Post not found.")
        }
      })
      .catch(() => setError("Failed to load post."))
      .finally(() => setIsLoading(false))
  }, [id])

  // ── Like toggle ─────────────────────────────────────────────────────────────
  const handleLike = async () => {
    if (!isAuthenticated || liking) return
    setLiking(true)

    // optimistic — UI updates instantly
    const wasLiked = liked
    setLiked(!wasLiked)
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1))

    try {
      const res = await api.post(`/create/posts/${id}/like`)
      if (res.data?.success) {
        setLiked(res.data.liked)
        setLikeCount(res.data.likes)
      }
    } catch {
      // roll back on error
      setLiked(wasLiked)
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1))
    } finally {
      setLiking(false)
    }
  }

  // ── Add comment ─────────────────────────────────────────────────────────────
  const handleAddComment = async () => {
    if (!commentText.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await api.post(`/create/posts/${id}/comment`, {
        text: commentText.trim(),
      })
      if (res.data?.success) {
        setPost((prev) => prev ? { ...prev, comments: res.data.comments } : prev)
        setCommentText("")
        if (commentInputRef.current) commentInputRef.current.style.height = "auto"
      }
    } catch {
      // optionally add a toast here
    } finally {
      setSubmitting(false)
    }
  }

  // ── Delete comment ───────────────────────────────────────────────────────────
  const handleDeleteComment = async (commentId: string) => {
    setDeletingId(commentId)
    try {
      const res = await api.delete(`/create/posts/${id}/comment/${commentId}`)
      if (res.data?.success) {
        setPost((prev) =>
          prev
            ? { ...prev, comments: prev.comments.filter((c) => c._id !== commentId) }
            : prev
        )
      }
    } catch {
      // optionally add a toast here
    } finally {
      setDeletingId(null)
    }
  }

  // ── Textarea auto-grow ───────────────────────────────────────────────────────
  const handleCommentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = e.target.scrollHeight + "px"
  }

  // ── Ctrl / Cmd + Enter to submit ────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleAddComment()
    }
  }

  // ── Carousel navigation ──────────────────────────────────────────────────────
  const prevSlide = () =>
    setCurrentSlide((i) => (i === 0 ? (post?.media.length ?? 1) - 1 : i - 1))
  const nextSlide = () =>
    setCurrentSlide((i) => (i === (post?.media.length ?? 1) - 1 ? 0 : i + 1))

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <AppLayout isAuthenticated={isAuthenticated}>
      <div className="container max-w-3xl mx-auto py-10 px-4">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {isLoading && (
          <div className="text-center text-muted-foreground py-20">Loading...</div>
        )}

        {error && (
          <div className="text-center text-red-500 py-20">{error}</div>
        )}

        {post && (
          <div className="flex flex-col gap-6">

            {/* ── Media ── */}
            {post.type === "image" && post.media.length > 0 && (
              <div className="relative rounded-xl overflow-hidden bg-muted group select-none">
                {/* Slides */}
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {post.media.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${post.title} ${i + 1}`}
                      className="w-full flex-shrink-0 object-contain max-h-[70vh]"
                    />
                  ))}
                </div>

                {/* Arrows — only shown when more than one image */}
                {post.media.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full
                        bg-black/50 text-white flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full
                        bg-black/50 text-white flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      aria-label="Next image"
                    >
                      ›
                    </button>

                    {/* Counter badge */}
                    <span className="absolute top-2 right-2 text-xs bg-black/50 text-white
                      px-2 py-0.5 rounded-full">
                      {currentSlide + 1} / {post.media.length}
                    </span>

                    {/* Dot indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {post.media.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          className={`h-1.5 rounded-full transition-all ${
                            i === currentSlide
                              ? "w-4 bg-white"
                              : "w-1.5 bg-white/50 hover:bg-white/80"
                          }`}
                          aria-label={`Go to image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {post.type === "video" && post.media.length > 0 && (
              <div className="rounded-xl overflow-hidden bg-black">
                <video
                  src={post.media[0]}
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

            {/* ── Meta ── */}
            <div className="flex flex-col gap-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit
                ${post.type === "image" ? "bg-blue-100 text-blue-700" :
                  post.type === "video" ? "bg-purple-100 text-purple-700" :
                  "bg-green-100 text-green-700"}`}>
                {post.type}
              </span>

              <h1 className="text-2xl font-bold leading-snug pt-2">{post.title}</h1>

              {post.description && (
                <p className="text-muted-foreground leading-relaxed pb-2">{post.description}</p>
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

              <p className="text-xs text-muted-foreground py-2">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </p>

              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9" key={post.uploadedBy.avatar.url || "fallback"}>
                  {post.uploadedBy.avatar ? (
                    <AvatarImage src={post.uploadedBy.avatar.url} alt="User" />
                  ) : null}
                  <AvatarFallback>
                    {post.uploadedBy.userName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-muted-foreground">{post.uploadedBy.userName}</p>
              </div>
            </div>

            {/* ── Like & comment count bar ──────────────────────────────────── */}
            <div className="flex items-center gap-5 pt-2 border-t border-border">

              <button
                onClick={handleLike}
                disabled={!isAuthenticated || liking}
                title={!isAuthenticated ? "Login to like" : liked ? "Unlike" : "Like"}
                className={`flex items-center gap-1.5 text-sm transition-colors
                  ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  ${liked
                    ? "text-red-500 hover:text-red-400"
                    : "text-muted-foreground hover:text-red-500"
                  }`}
              >
                <Heart className={`h-5 w-5 transition-all ${liked ? "fill-red-500 scale-110" : ""}`} />
                <span>{likeCount}</span>
              </button>

              <button
                onClick={() => commentInputRef.current?.focus()}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{post.comments?.length ?? 0}</span>
              </button>

            </div>

            {/* ── Comments section ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">

              <h2 className="text-sm font-semibold">
                Comments{post.comments?.length > 0 && ` (${post.comments.length})`}
              </h2>

              {/* Comment list */}
              {post.comments?.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="flex items-start gap-3 group">

                      <Avatar className="h-7 w-7 mt-0.5 shrink-0">
                        {comment.user.avatar ? (
                          <AvatarImage
                            src={comment.user.avatar.url}
                            alt={comment.user.userName}
                          />
                        ) : null}
                        <AvatarFallback className="text-xs">
                          {comment.user.userName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xs font-semibold">{comment.user.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mt-0.5 break-words">{comment.text}</p>
                      </div>

                      {/* Delete button — only visible on hover, only for the comment's own author */}
                      {currentUserId && currentUserId === comment.user._id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          disabled={deletingId === comment._id}
                          title="Delete comment"
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground
                            hover:text-red-500 transition-all shrink-0 mt-0.5 disabled:opacity-30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}

                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
              )}

              {/* Comment input — only shown when logged in */}
              {isAuthenticated ? (
                <div className="flex items-end gap-2 pt-2 border-t border-border">
                  <textarea
                    ref={commentInputRef}
                    value={commentText}
                    onChange={handleCommentInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a comment… (Ctrl+Enter to send)"
                    rows={1}
                    className="flex-1 resize-none bg-muted text-sm rounded-lg px-3 py-2
                      focus:outline-none focus:ring-1 focus:ring-ring
                      placeholder:text-muted-foreground overflow-hidden
                      min-h-[38px] max-h-[140px]"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || submitting}
                    title="Send comment"
                    className="flex items-center justify-center h-[38px] w-[38px] rounded-lg
                      bg-primary text-primary-foreground hover:opacity-90 transition-opacity
                      disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                  <button
                    onClick={() => navigate("/signin")}
                    className="underline hover:text-foreground"
                  >
                    Log in
                  </button>{" "}
                  to leave a comment.
                </p>
              )}

            </div>
            {/* ─────────────────────────────────────────────────────────────── */}

          </div>
        )}
      </div>
    </AppLayout>
  )
}