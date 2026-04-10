import {useEffect, useState} from "react"
import AppLayout from "../components/AppLayout.tsx"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import api , {getAccessToken} from '../lib/api.ts'
import { Avatar, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { useNavigate} from "react-router-dom"
import toast from "react-hot-toast"
import {Loader} from "../components/ui/Loader"

interface ProfileProps {
  isAuthenticated: boolean
}


export default function Profile({isAuthenticated} : ProfileProps){
  const navigate = useNavigate()
    const [formData, setFormData] = useState({
      username: "",
      fullname: "",
      email: "",
      avatar : "",
      // password: ""
    })
    const [avatarPreview, setAvatarPreview] = useState<string>("")
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [userData, setUserData] = useState<{ userName?: string; email?: string; fullName? : string; avatar? : string;} | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
      const {name , value} = e.target
      setFormData((prev) => ({...prev, [name]: value}))
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      console.log(file)
      if(file) {
        setAvatarFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
      else{
        setAvatarFile(null)
        setAvatarPreview('')
      }
    }

    const token = getAccessToken()
    const isAuth = isAuthenticated || !!token

    const handleSubmit = async (e : React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

      const submitData = new FormData();
      submitData.append('userName', formData.username);
      submitData.append('fullName', formData.fullname);
      submitData.append('email', formData.email);
      // submitData.append('password', formData.password)

      if (avatarFile) {
        submitData.append('avatar', avatarFile)
      }

      try{
        const res = await api.post("/users/updateUserProfile", submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        })
        if(res.data?.success === true){
          toast.success("Profile updated")
          setTimeout(() => {
            navigate("/profile")
          })
        }
      }catch(error : any){
        console.log("Profile Updation error", error)

        let errorMessage = "Unable to update your profile try again"

        if(error.response) {
          errorMessage = error.response.data?.message || errorMessage
        }else if (error.request) {
          errorMessage = "No response from server"
        }else {
          errorMessage = error.message || errorMessage
        }
        toast.error(errorMessage)
      } finally{
        setIsLoading(false)
      }

    }


     useEffect(() => {
        if (isAuth && token) {
          api.get("/users/me")
            .then((res) => {
              if (res.data?.user) {
                const user = res.data.user
                setUserData(user)
                setFormData({
                  username: res.data.user.userName,
                  email: res.data.user.email,
                  fullname : res.data.user.fullName,
                  avatar: res.data.user.avatar
                  // password: ""
                })
              }
            })
            .catch(() => {
              // Silently fail - user might not be authenticated
            })
        }
      }, [isAuth, token])



    return(
        <AppLayout isAuthenticated={isAuthenticated}>
        <div className="container max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col">
                 <h1 className="font-bold text-3xl">Profile</h1>
                 <p className="text-muted-foreground">Your Profile is 35% Completed</p>
            </div>

       <form onSubmit={handleSubmit} className="space-y-4">
            <div className="container mt-4 max-w-xl">
                <div className="space-y-2 mb-3">
                  <Label htmlFor="avatar">Avatar</Label>
                  <Avatar>
                    <AvatarImage src={
                        avatarPreview
                        ? avatarPreview                      
                      : `http://localhost:3000${userData?.avatar}`
                    }
                      />
                  </Avatar>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isLoading}
                    className="flex-1"
                  />
                </div>

                <div className="space-y-2 mb-3">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                    id="username"
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData?.username}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading} 
                    />
                </div>

                <div className="space-y-2 mb-3">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                    id="email"
                    name="email"
                    type="text"
                    placeholder="johndoe@gmail.com"
                    value={formData?.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading} 
                    />
                </div>

                <div className="space-y-2 mb-3">
                    <Label htmlFor="fullname">Fullname</Label>
                    <Input 
                    id="fullname"
                    name="fullname"
                    type="text"
                    placeholder="john doe"
                    value={formData?.fullname}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading} 
                    />
                </div>

                <Button className="w-full sm:w-auto" disabled={isLoading}>
                Update Profile
                 {isLoading && <Loader/>}
              </Button>
            </div>
            </form>
        </div>
        </AppLayout>
    )
}