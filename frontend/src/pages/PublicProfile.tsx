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
    userName: string
    fullName: string
    avatar: {
        url: string
        publicId: string
    }
    followersCount: number
    followingCount: number
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

interface PostStats {
    images: number
    videos: number
    blogs: number
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
    const [stats, setStats] = useState<PostStats>({ images: 0, videos: 0, blogs: 0 })

    useEffect(() => {
        if (!id) return
        setIsLoading(true)
        api.get(`/users/PublicProfileUser/${id}`)
            .then((res) => {
                if (res.data?.success) setUser(res.data.PublicProfileUser)
                else console.log("Error no user found")
            })
            .catch((err) => console.log("Failed to fetch user", err))
            .finally(() => setIsLoading(false))
    }, [id])

    useEffect(() => {
        if (!id) return
        api.get(`/create/getPostStats/${id}`)
            .then((res) => {
                if (res.data?.success) setStats(res.data.stats)
            })
            .catch((err) => console.error("Stats fetch error:", err))
    }, [id])

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

    const totalPosts = stats.images + stats.videos + stats.blogs

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
                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">

                    {/* Top section — avatar, name, follow */}
                    <div className="flex items-center gap-4 p-4 sm:p-6">

                        <Avatar className="h-14 w-14 sm:h-20 sm:w-20 shrink-0 ring-2 ring-border" key={user?.avatar?.url || "fallback"}>
                            {user?.avatar?.url ? (
                                <AvatarImage src={user.avatar.url} alt="User avatar" />
                            ) : null}
                            <AvatarFallback className="text-lg sm:text-3xl">
                                {user?.userName?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <h2 className="text-base sm:text-lg font-bold leading-tight truncate">
                                {user?.fullName || (isLoading ? "Loading..." : "Unknown User")}
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                                @{user?.userName}
                            </p>
                        </div>

                        <button className="shrink-0 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold px-4 sm:px-5 h-8 sm:h-9 rounded-lg hover:opacity-90 transition-opacity">
                            Follow
                        </button>

                    </div>

                    {/* Divider */}
                    <div className="border-t border-border" />

                    {/* Stats row */}
                    <div className="grid grid-cols-6 divide-x divide-border">
                        {[
                            { label: "Posts",   value: totalPosts    },
                            { label: "Images",  value: stats.images  },
                            { label: "Videos",  value: stats.videos  },
                            { label: "Blogs",   value: stats.blogs   },
                            { label: "Followers", value: user?.followersCount ?? 0 },
                            { label: "Following", value: user?.followingCount ?? 0 },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex flex-col items-center py-3 sm:py-4 gap-0.5">
                                <span className="text-sm sm:text-base font-bold text-foreground">{value}</span>
                                <span className="text-[10px] sm:text-xs text-muted-foreground">{label}</span>
                            </div>
                        ))}
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

                {/* Posts grid */}
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