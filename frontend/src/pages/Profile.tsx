import React from "react"
import AppLayout from "../components/AppLayout.tsx"


interface ProfileProps {
  isAuthenticated: boolean
}


export default function Profile({isAuthenticated} : ProfileProps){
    return(
        <AppLayout isAuthenticated={isAuthenticated}>
        <h1 className="m-6">This is Profile</h1>
        </AppLayout>
    )
}