import { useEffect, useState } from "react"
import AppLayout from "../components/AppLayout"
import api from "../lib/api"
import PostCard from "../components/Postcard"

interface HomeProps {
  isAuthenticated: boolean
}

type PostType = "all" | "image" | "video" | "blog"

interface Post {
  _id: string
  type: "image" | "video" | "blog"
  media: string[]
  title: string
  description?: string
  tags?: string[]
  uploadedBy: {
    _id: string
    userName: string
    avatar: string
  }
  createdAt: string
}

const FILTERS: { label: string; value: PostType }[] = [
  { label: "All",    value: "all"   },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Blogs",  value: "blog"  },
]

export default function Home({ isAuthenticated }: HomeProps) {
  const [posts, setPosts]       = useState<Post[]>([])
  const [filter, setFilter]     = useState<PostType>("all")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const query = filter !== "all" ? `?type=${filter}` : ""

    api.get(`/create/getPosts${query}`)
      .then((res) => {
        if (res.data?.success) setPosts(res.data.posts)
      })
      .catch((err) => console.error("Feed fetch error:", err))
      .finally(() => setIsLoading(false))
  }, [filter])  // refetches whenever filter changes

  return (
    <AppLayout isAuthenticated={isAuthenticated}>
      <div className="container max-w-8xl mx-auto py-10 px-4">

        {/* Filter bar */}
        <div className="flex gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Feed */}
        {isLoading ? (
          <div className="text-center text-muted-foreground py-20">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} showMultiIndicator={true}/>
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  )
}