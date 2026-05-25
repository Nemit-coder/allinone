import AppLayout from "../components/AppLayout"
import { useEffect, useState } from "react"
import { useParams , useNavigate} from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { ArrowLeft } from 'lucide-react'
import api from '../lib/api'

interface PublicProfileProps {
    isAuthenticated: boolean
}

interface User {
    userName: string,
    fullName: string,
    avatar:{
        url: string,
        publicId: string
    },
}

export default function PublicProfile({ isAuthenticated } : PublicProfileProps){
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    console.log(id)
    // Fetching post uploader user
    useEffect(() => {
        if(!id) return
        setIsLoading(true)
        api.get(`/users/PublicProfileUser/${id}`)
        .then((res) => {
            if(res.data?.success){
                const u: User = res.data.PublicProfileUser
                setUser(u)
            }
            else{
                console.log("Error no user found")
            }
        })
        .catch((err) => console.log("Failed to fecth user", err))
        .finally(() => setIsLoading(false))
    }, [id])    


    return (
        <AppLayout isAuthenticated={isAuthenticated}>
          <div className="max-w-7xl mx-24 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
                {/* Back button */}
                <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                     <ArrowLeft className="h-4 w-4" /> Back
                </button>

           <div className="max-w-4xl m-32 flex gap-8">

                <Avatar className="h-28 w-28" key={user?.avatar.url || "fallback"}>
                {user?.avatar.url ? (
                    <AvatarImage src={user.avatar.url} alt="User" />
                ) : null}
                <AvatarFallback className="text-4xl">
                    {user?.userName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
                </Avatar>

            <div className="flex flex-col">
                <h3 className="text-2xl mt-6">{user?.fullName}</h3>
                <div className="flex flex-row gap-1">
                    <h4>{user?.userName}<span className="mx-2">•</span></h4>
                    <h4>Followers 0</h4>
                </div>
            </div>   

            </div>
         </div>
        </AppLayout>
    )
}