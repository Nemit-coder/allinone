import AppLayout from "../components/AppLayout";
import { useEffect } from "react"
import api from "../lib/api"


interface HomeProps {
    isAuthenticated: boolean
}


export default function Home({isAuthenticated} : HomeProps){

     useEffect(() => {
    api.get("/create/getPostStats") 
       .then((res) => {
        
       })
       .catch((err) => {
        console.log("Image fetch error:", err)
       })
  }, [])
    return(
        <AppLayout isAuthenticated={isAuthenticated}>
            <h1>This is home </h1>

        </AppLayout>
    )
}