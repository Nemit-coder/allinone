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

const FILTERS: { label: string; value: PostType; statKey?: keyof PostStats | "total" }[] = [
    { label: "All",    value: "all",   statKey: "total"   },
    { label: "Images", value: "image", statKey: "images"  },
    { label: "Videos", value: "video", statKey: "videos"  },
    { label: "Blogs",  value: "blog",  statKey: "blogs"   },
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

    const getStatValue = (statKey?: keyof PostStats | "total") => {
        if (statKey === "total") return totalPosts
        if (statKey) return stats[statKey]
        return 0
    }

    return (
        <AppLayout isAuthenticated={isAuthenticated}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-0">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </button>

                {/* ── Profile Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-10 pb-8 border-b border-border">

                    {/* Avatar */}
                    <Avatar
                        className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 ring-2 ring-border"
                        key={user?.avatar?.url || "fallback"}
                    >
                        {user?.avatar?.url ? (
                            <AvatarImage src={user.avatar.url} alt="User avatar" />
                        ) : null}
                        <AvatarFallback className="text-3xl sm:text-4xl">
                            {user?.userName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>

                    {/* Info block — takes remaining width */}
                    <div className="flex flex-col gap-4 flex-1 min-w-0">

                        {/* FIX 1: Name + Follow — justify-between so follow is always pinned to the right */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold leading-tight truncate">
                                    {user?.fullName || (isLoading ? "Loading..." : "Unknown User")}
                                </h1>
                                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                                    @{user?.userName}
                                </p>
                            </div>
                            {/* Follow always top-right, never wraps */}
                            <button className="shrink-0 bg-primary text-primary-foreground text-sm font-semibold px-5 h-9 rounded-lg hover:opacity-90 transition-opacity">
                                Follow
                            </button>
                        </div>

                        {/* Stats row — inline like Instagram */}
                        <div className="flex items-center gap-4 sm:gap-6 text-sm flex-wrap">
                            <span>
                                <span className="font-bold text-foreground">{totalPosts}</span>
                                <span className="text-muted-foreground ml-1">Posts</span>
                            </span>
                            <span>
                                <span className="font-bold text-foreground">{user?.followersCount ?? 0}</span>
                                <span className="text-muted-foreground ml-1">Followers</span>
                            </span>
                            <span>
                                <span className="font-bold text-foreground">{user?.followingCount ?? 0}</span>
                                <span className="text-muted-foreground ml-1">Following</span>
                            </span>
                        </div>

                    </div>
                </div>

                {/* ── YouTube-style Tab Filters ── */}
                <div className="flex border-b border-border overflow-x-auto">
                    {FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`relative flex items-center gap-1.5 px-4 sm:px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors
                                ${filter === f.value
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {f.label}
                            <span className={`text-xs tabular-nums transition-colors
                                ${filter === f.value
                                    ? "text-muted-foreground"
                                    : "text-muted-foreground/50"
                                }`}>
                                {getStatValue(f.statKey)}
                            </span>
                            {filter === f.value && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* FIX 3: Posts Grid — proper responsive columns */}
                <div className="pt-6">
                    {postsLoading ? (
                        <div className="text-center text-muted-foreground py-20">Loading...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center text-muted-foreground py-20">No posts found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} showMultiIndicator={true}/>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    )
}