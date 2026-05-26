import AppLayout from "../components/AppLayout"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { ArrowLeft } from 'lucide-react'
import api from '../lib/api'

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

export default function PublicProfile({ isAuthenticated }: PublicProfileProps) {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </button>

                {/* Profile card */}
                <div className="flex items-center justify-between gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">

                    {/* Left: Avatar + info */}
                    <div className="flex items-center gap-5">
                        <Avatar className="h-20 w-20 shrink-0" key={user?.avatar?.url || "fallback"}>
                            {user?.avatar?.url ? (
                                <AvatarImage src={user.avatar.url} alt="User avatar" />
                            ) : null}
                            <AvatarFallback className="text-3xl">
                                {user?.userName?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-semibold leading-tight">
                                {user?.fullName || (isLoading ? "Loading..." : "Unknown User")}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <span>@{user?.userName}</span>
                                <span className="mx-1">•</span>
                                <span>0 Followers</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Follow button */}
                    <button className="shrink-0 bg-black text-white text-sm font-medium px-5 h-9 rounded-lg hover:bg-neutral-800 transition-colors">
                        Follow
                    </button>

                </div>

            </div>
        </AppLayout>
    )
}