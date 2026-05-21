import AppLayout from "../components/AppLayout"

interface PublicProfileProps {
    isAuthenticated: boolean
}

export default function PublicProfile({ isAuthenticated } : PublicProfileProps){
    return (
        <AppLayout isAuthenticated={isAuthenticated}>
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
                <h1 className="text-2xl font-bold">Public Profile</h1>
            </div>
        </AppLayout>
    )
}