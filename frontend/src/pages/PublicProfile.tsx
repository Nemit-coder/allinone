import AppLayout from "../components/AppLayout"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { ArrowLeft, Loader2 } from 'lucide-react'
import api from '../lib/api'
import PostCard from "../components/Postcard"

interface PublicProfileProps {
    isAuthenticated: boolean
}

interface User {
    _id: string
    userName: string
    fullName: string
    avatar: { url: string; publicId: string }
    followersCount: number
    followingCount: number
    accountType: "public" | "private"
    isFollowing: boolean
    isRequested: boolean
    isOwnProfile: boolean
}

interface Post {
    _id: string
    type: "image" | "video" | "blog"
    media: string[]
    title: string
    description?: string
    tags?: string[]
    uploadedBy: { _id: string; userName: string; avatar: string }
    createdAt: string
}

interface PostStats {
    images: number
    videos: number
    blogs: number
}

type PostType = "all" | "image" | "video" | "blog"
type FollowStatus = "none" | "requested" | "following"

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
    const [followStatus, setFollowStatus] = useState<FollowStatus>("none")
    const [followLoading, setFollowLoading] = useState(false)
    const [followerCount, setFollowerCount] = useState(0)

    // Fetch user profile
    useEffect(() => {
        if (!id) return
        setIsLoading(true)
        api.get(`/users/PublicProfileUser/${id}`)
            .then((res) => {
                if (res.data?.success) {
                    const u: User = res.data.PublicProfileUser
                    setUser(u)
                    setFollowerCount(u.followersCount ?? 0)
                    if (u.isFollowing) setFollowStatus("following")
                    else if (u.isRequested) setFollowStatus("requested")
                    else setFollowStatus("none")
                }
            })
            .catch((err) => console.log("Failed to fetch user", err))
            .finally(() => setIsLoading(false))
    }, [id])

    // Fetch post stats
    useEffect(() => {
        if (!id) return
        api.get(`/create/getPostStats/${id}`)
            .then((res) => {
                if (res.data?.success) setStats(res.data.stats)
            })
            .catch((err) => console.error("Stats fetch error:", err))
    }, [id])

    // Fetch posts — only if allowed to see them
    useEffect(() => {
        if (!id) return
        const canSeePosts = user?.accountType === "public" || followStatus === "following"
        if (!canSeePosts) { setPosts([]); return }

        setPostsLoading(true)
        const query = filter !== "all" ? `&type=${filter}` : ""
        api.get(`/create/getPosts?userId=${id}${query}`)
            .then((res) => {
                if (res.data?.success) setPosts(res.data.posts)
                else setPosts([])
            })
            .catch((err) => console.error("User posts fetch error:", err))
            .finally(() => setPostsLoading(false))
    }, [id, filter, user?.accountType, followStatus])

    const handleFollow = async () => {
        if (!id || followLoading) return
        setFollowLoading(true)
        try {
            if (followStatus === "none") {
                const res = await api.post(`/users/follow/${id}`)
                if (res.data?.success) {
                    const newStatus = res.data.status as FollowStatus
                    setFollowStatus(newStatus)
                    if (newStatus === "following") setFollowerCount(c => c + 1)
                }
            } else {
                // Unfollow or cancel request
                await api.post(`/users/unfollow/${id}`)
                if (followStatus === "following") setFollowerCount(c => c - 1)
                setFollowStatus("none")
            }
        } catch (err) {
            console.error("Follow action failed:", err)
        } finally {
            setFollowLoading(false)
        }
    }

    const totalPosts = stats.images + stats.videos + stats.blogs

    const getStatValue = (statKey?: keyof PostStats | "total") => {
        if (statKey === "total") return totalPosts
        if (statKey) return stats[statKey]
        return 0
    }

    const canSeePosts = user?.accountType === "public" || followStatus === "following"

    const followButtonLabel = () => {
        if (followLoading) return <Loader2 className="h-4 w-4 animate-spin" />
        if (followStatus === "following") return "Following"
        if (followStatus === "requested") return "Requested"
        return "Follow"
    }

    const followButtonStyle = () => {
        if (followStatus === "following") return "bg-muted text-foreground border border-border hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        if (followStatus === "requested") return "bg-muted text-muted-foreground border border-border cursor-default"
        return "bg-primary text-primary-foreground hover:opacity-90"
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

                    <div className="flex flex-col gap-4 flex-1 min-w-0">

                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold leading-tight truncate">
                                    {user?.fullName || (isLoading ? "Loading..." : "Unknown User")}
                                </h1>
                                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                                    @{user?.userName}
                                </p>
                            </div>

                            {/* Hide follow button on own profile */}
                            {!user?.isOwnProfile && (
                                <button
                                    onClick={handleFollow}
                                    disabled={followLoading || followStatus === "requested"}
                                    className={`shrink-0 text-sm font-semibold px-5 h-9 rounded-lg transition-all flex items-center gap-1.5 ${followButtonStyle()}`}
                                >
                                    {followButtonLabel()}
                                </button>
                            )}
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-4 sm:gap-6 text-sm flex-wrap">
                            <span>
                                <span className="font-bold text-foreground">{totalPosts}</span>
                                <span className="text-muted-foreground ml-1">Posts</span>
                            </span>
                            <span>
                                <span className="font-bold text-foreground">{followerCount}</span>
                                <span className="text-muted-foreground ml-1">Followers</span>
                            </span>
                            <span>
                                <span className="font-bold text-foreground">{user?.followingCount ?? 0}</span>
                                <span className="text-muted-foreground ml-1">Following</span>
                            </span>
                        </div>

                    </div>
                </div>

                {/* ── Tab Filters — only if can see posts ── */}
                {canSeePosts && (
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
                                    ${filter === f.value ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                                    {getStatValue(f.statKey)}
                                </span>
                                {filter === f.value && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Posts / Private screen ── */}
                <div className="pt-6">
                    {!canSeePosts ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-base">This account is private</h3>
                            <p className="text-sm text-muted-foreground">
                                {followStatus === "requested"
                                    ? "Your follow request is pending approval."
                                    : "Follow this account to see their posts."}
                            </p>
                        </div>
                    ) : postsLoading ? (
                        <div className="text-center text-muted-foreground py-20">Loading...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center text-muted-foreground py-20">No posts found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} showMultiIndicator={true} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    )
}