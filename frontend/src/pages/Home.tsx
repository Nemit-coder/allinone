import AppLayout from "../components/AppLayout";

interface HomeProps {
    isAuthenticated: boolean
}


export default function Home({isAuthenticated} : HomeProps){
    return(
        <AppLayout isAuthenticated={isAuthenticated}>
            <h1>This is home </h1>
        </AppLayout>
    )
}