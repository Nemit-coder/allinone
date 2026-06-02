import { useState } from "react"
import { X } from "lucide-react"
import api from "../../lib/api"
import type { Conversation } from "../../pages/Chat"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface User {
  _id: string
  userName: string
  avatar: { url: string }
}

interface Props {
  onClose: () => void
  onConversationStart: (conv: Conversation) => void
}

export default function UserSearchModal({ onClose, onConversationStart }: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (val: string) => {
    setQuery(val)
    if (!val.trim()) return setResults([])
    setLoading(true)
    try {
      // Uses your existing user search endpoint
      const res = await api.get(`/users/search?q=${val}`)
      setResults(res.data.users || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleStart = async (userId: string) => {
    try {
      const res = await api.post("/chat/conversation", { receiverId: userId })
      onConversationStart(res.data.conversation)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl w-full max-w-sm mx-4 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">New Message</h3>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="p-4">
          <input
            autoFocus
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by username..."
            className="w-full bg-muted rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="max-h-60 overflow-y-auto px-2 pb-4">
          {loading && <p className="text-center text-sm text-muted-foreground py-4">Searching...</p>}
          {!loading && results.length === 0 && query && (
            <p className="text-center text-sm text-muted-foreground py-4">No users found</p>
          )}
          {results.map((user) => (
            <button
              key={user._id}
              onClick={() => handleStart(user._id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar?.url} />
                <AvatarFallback>{user.userName[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user.userName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}