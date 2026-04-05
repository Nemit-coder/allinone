import React from "react"
import AppLayout from "../components/AppLayout.tsx"


interface ProfileProps {
  isAuthenticated: boolean
}


export default function Profile({isAuthenticated} : ProfileProps){
    return(
        <AppLayout isAuthenticated={isAuthenticated}>
        <div className="flex flex-col min-h-screen items-center">
            {/* hero-nav */}
            <div className="hero-nav max-w-9xl">
                <h1 className="text-2xl font-semibold">Profile</h1>
            </div>
        </div>
        </AppLayout>
    )
}