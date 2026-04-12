import AppLayout from "../components/AppLayout.tsx"


interface SettingsProps {
  isAuthenticated: boolean
}


export default function Settings({isAuthenticated} : SettingsProps){

    
    return (
       <AppLayout isAuthenticated={isAuthenticated}>
               <div className="container max-w-7xl mx-auto px-4 py-8">
                   <div className="flex flex-col">
                        <h1 className="font-bold text-3xl">Settings</h1>
                   </div>
       
            
              
               </div>
               </AppLayout>
    )
}