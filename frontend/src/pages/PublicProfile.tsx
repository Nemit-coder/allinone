import AppLayout from "../components/AppLayout"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { ArrowLeft } from 'lucide-react'
import api from '../lib/api'
import PostCard from "../components/Postcard"

interface PublicProfileProps {
    isAuthenticated: boolean
}

interface User {
    userName: string,
    fullName: string,
    avatar: {
        url: string,
        publicId: string
    },
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
    avatar: string
  }
  createdAt: string
}

type PostType = "all" | "image" | "video" | "blog"

const FILTERS: { label: string; value: PostType }[] = [
    { label: "All",    value: "all"   },
    { label: "Images", value: "image" },
    { label: "Videos", value: "video" },
    { label: "Blogs",  value: "blog"  },
]

export default function PublicProfile({ isAuthenticated }: PublicProfileProps) {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const [filter, setFilter] = useState<PostType>("all")
    const [posts, setPosts] = useState<Post[]>([])
    const [postsLoading, setPostsLoading] = useState(false)

    useEffect(() => {
        if (!id) return
        setPostsLoading(true)
        const query = filter !== "all" ? `&type=${filter}` : ""
        api.get(`/create/getPosts?userId=${id}${query}`)
            .then((res) => {
                if (res.data?.success) setPosts(res.data.posts)
                else setPosts([])
            })
            .catch((err) => console.error("User posts fetch error:", err))
            .finally(() => setPostsLoading(false))
    }, [id, filter])

    useEffect(() => {
        if (!id) return
        setIsLoading(true)
        api.get(`/users/PublicProfileUser/${id}`)
            .then((res) => {
                if (res.data?.success) {
                    const u: User = res.data.PublicProfileUser
                    setUser(u)
                } else {
                    console.log("Error no user found")
                }
            })
            .catch((err) => console.log("Failed to fetch user", err))
            .finally(() => setIsLoading(false))
    }, [id])

    return (
        <AppLayout isAuthenticated={isAuthenticated}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </button>

                {/* Profile card */}
                <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center gap-3">

                        {/* Avatar — shrinks on mobile */}
                        <Avatar className="h-10 w-10 sm:h-16 sm:w-16 shrink-0" key={user?.avatar?.url || "fallback"}>
                            {user?.avatar?.url ? (
                                <AvatarImage src={user.avatar.url} alt="User avatar" />
                            ) : null}
                            <AvatarFallback className="text-sm sm:text-2xl">
                                {user?.userName?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>

                        {/* Name + username */}
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                            <h3 className="text-sm sm:text-base font-semibold leading-tight truncate">
                                {user?.fullName || (isLoading ? "Loading..." : "Unknown User")}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
                                <span className="truncate">@{user?.userName}</span>
                                <span>•</span>
                                <span className="whitespace-nowrap">0 Followers</span>
                            </div>
                        </div>

                        {/* Follow button */}
                        <button className="shrink-0 bg-black text-white text-xs sm:text-sm font-medium px-3 sm:px-4 h-7 sm:h-8 rounded-lg hover:bg-neutral-800 transition-colors">
                            Follow
                        </button>

                    </div>
                </div>

                {/* Filter bar */}
                <div className="flex gap-2">
                    {FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                ${filter === f.value
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Posts will go here */}
                {postsLoading ? (
             <div className="text-center text-muted-foreground py-20">Loading...</div>
            ) : posts.length === 0 ? (
                <div className="text-center text-muted-foreground py-20">No posts found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            )}                                                                          

            </div>
        </AppLayout>
    )
}