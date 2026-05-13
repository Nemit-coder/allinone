import { Link } from 'react-router-dom'


const BASE_URL = "http://localhost:3000"  // your backend URL

interface Post {
  _id: string
  type: "image" | "video" | "blog"
  media: string[]
  title: string
  description?: string
  tags?: string[]
  createdAt: string
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/post/${post._id}`} className="group block rounded-xl border bg-card overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200">

      {/* Thumbnail area */}
      {post.type === "image" && post.media.length > 0 && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={`${BASE_URL}/${post.media[0]}`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {post.type === "video" && post.media.length > 0 && (
        <div className="aspect-video w-full overflow-hidden bg-black">
          <video
            src={`${BASE_URL}/${post.media[0]}`}
            className="w-full h-full object-cover"
            muted
            onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play()}
            onMouseOut={(e) => {
              const v = e.currentTarget as HTMLVideoElement
              v.pause()
              v.currentTime = 0
            }}
          />
        </div>
      )}

      {post.type === "blog" && (
        <div className="aspect-video w-full bg-muted flex items-center justify-center">
          <span className="text-4xl">📝</span>
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* type badge */}
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit
          ${post.type === "image" ? "bg-blue-100 text-blue-700" :
            post.type === "video" ? "bg-purple-100 text-purple-700" :
            "bg-green-100 text-green-700"}`}>
          {post.type}
        </span>

        <h3 className="font-semibold text-base leading-snug line-clamp-2">
          {post.title}
        </h3>

        {post.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.description}
          </p>
        )}

        {/* tags for blogs */}
        {post.type === "blog" && post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}