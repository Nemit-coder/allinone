import AppLayout from "../components/AppLayout"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Check, X, Bell } from "lucide-react"
import api from "../lib/api"
import toast from "react-hot-toast"

interface NotificationsProps {
    isAuthenticated: boolean
}

interface FollowRequest {
    _id: string
    userName: string
    fullName: string
    avatar: { url: string; publicId: string }
}

export default function Notifications({ isAuthenticated }: NotificationsProps) {
    const [requests, setRequests] = useState<FollowRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        api.get("/users/notifications")
            .then((res) => {
                if (res.data?.success) setRequests(res.data.followRequests)
            })
            .catch((err) => console.error("Notifications fetch error:", err))
            .finally(() => setIsLoading(false))
    }, [])

    const handleAccept = async (requesterId: string) => {
        setActionLoading(requesterId)
        try {
            await api.post(`/users/follow/accept/${requesterId}`)
            setRequests((prev) => prev.filter((r) => r._id !== requesterId))
            toast.success("Follow request accepted")
        } catch {
            toast.error("Something went wrong")
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (requesterId: string) => {
        setActionLoading(requesterId)
        try {
            await api.post(`/users/follow/reject/${requesterId}`)
            setRequests((prev) => prev.filter((r) => r._id !== requesterId))
            toast.success("Follow request rejected")
        } catch {
            toast.error("Something went wrong")
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <AppLayout isAuthenticated={isAuthenticated}>
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">

                <h1 className="text-xl font-bold">Notifications</h1>

                {isLoading ? (
                    <div className="text-center text-muted-foreground py-20">Loading...</div>
                ) : requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                            <Bell className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No notifications yet.</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {requests.map((req) => (
                            <div
                                key={req._id}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                            >
                                <Avatar className="h-10 w-10 shrink-0">
                                    {req.avatar?.url ? (
                                        <AvatarImage src={req.avatar.url} alt={req.userName} />
                                    ) : null}
                                    <AvatarFallback>
                                        {req.userName?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">
                                        <span className="font-semibold">{req.fullName}</span>
                                        <span className="text-muted-foreground"> wants to follow you</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">@{req.userName}</p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleAccept(req._id)}
                                        disabled={actionLoading === req._id}
                                        className="flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-3 h-8 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        <Check className="h-3.5 w-3.5" />
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleReject(req._id)}
                                        disabled={actionLoading === req._id}
                                        className="flex items-center gap-1 bg-muted text-foreground text-xs font-semibold px-3 h-8 rounded-lg border border-border hover:bg-muted/80 transition-colors disabled:opacity-50"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}