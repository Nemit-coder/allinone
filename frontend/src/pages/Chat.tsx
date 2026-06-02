"use client"

import { useEffect, useRef, useState } from "react"
import AppLayout from "../components/AppLayout"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { ScrollArea } from "../components/ui/scroll-area"
import { Send, Search, MoreVertical, Phone, Video, ArrowLeft, Plus } from "lucide-react"
import api from "../lib/api"
import { getSocket, connectSocket, disconnectSocket } from "../lib/socket"
import UserSearchModal from "../components/chat/UserSearchModel"

// ── Types ──────────────────────────────────────────────────────
interface Member {
  _id: string
  userName: string
  avatar: { url: string }
}

export interface Conversation {
  _id: string
  members: Member[]
  lastMessage?: {
    text: string
    sender: { userName: string }
    createdAt: string
  }
  updatedAt: string
}

interface Message {
  _id: string
  conversationId: string
  sender: { _id: string; userName: string; avatar: { url: string } }
  text: string
  createdAt: string
}

interface ChatProps {
  isAuthenticated: boolean
}

// ── Helper: decode JWT to get myId ─────────────────────────────
const getMyId = (): string => {
  try {
    const token = localStorage.getItem("accessToken") ?? ""
    return JSON.parse(atob(token.split(".")[1]))?.id ?? ""
  } catch {
    return ""
  }
}

// ── Helper: get the other person in a 1-on-1 conv ─────────────
const getOther = (conv: Conversation, myId: string): Member =>
  conv.members.find((m) => m._id !== myId) ?? conv.members[0]

// ── Main Component ─────────────────────────────────────────────
export default function Chat({ isAuthenticated }: ChatProps) {
  const myId = getMyId()
  const socket = getSocket()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [convLoading, setConvLoading] = useState(true)
  const [msgLoading, setMsgLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout>>()

  // ── Connect socket on mount ────────────────────────────────
  useEffect(() => {
    connectSocket()
    return () => disconnectSocket()
  }, [])

  // ── Load conversations ─────────────────────────────────────
  useEffect(() => {
    api.get("/chat/conversations")
      .then((res) => setConversations(res.data.conversations ?? []))
      .catch(console.error)
      .finally(() => setConvLoading(false))
  }, [])

  // ── Load messages when conversation changes ────────────────
  useEffect(() => {
    if (!activeConv) return
    setMsgLoading(true)
    setMessages([])

    api.get(`/chat/messages/${activeConv._id}`)
      .then((res) => setMessages(res.data.messages ?? []))
      .catch(console.error)
      .finally(() => setMsgLoading(false))

    socket.emit("conversation:join", activeConv._id)
    socket.emit("message:read", { conversationId: activeConv._id })
  }, [activeConv?._id])

  // ── Scroll to bottom on new messages ──────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ── Socket event listeners ─────────────────────────────────
  useEffect(() => {
    const handleReceive = (msg: Message) => {
      // Append if in active conv
      if (activeConv && msg.conversationId === activeConv._id) {
        setMessages((prev) => [...prev, msg])
        socket.emit("message:read", { conversationId: activeConv._id })
      }

      // Update lastMessage in conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c._id === msg.conversationId
            ? {
                ...c,
                lastMessage: {
                  text: msg.text,
                  sender: { userName: msg.sender.userName },
                  createdAt: msg.createdAt,
                },
                updatedAt: msg.createdAt,
              }
            : c
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      )
    }

    const handleTypingStart = ({ userId }: { userId: string }) => {
      if (userId !== myId) setIsTyping(true)
    }

    const handleTypingStop = ({ userId }: { userId: string }) => {
      if (userId !== myId) setIsTyping(false)
    }

    const handleUserOnline = ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId))
    }

    const handleUserOffline = ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }

    socket.on("message:receive", handleReceive)
    socket.on("typing:start", handleTypingStart)
    socket.on("typing:stop", handleTypingStop)
    socket.on("user:online", handleUserOnline)
    socket.on("user:offline", handleUserOffline)

    return () => {
      socket.off("message:receive", handleReceive)
      socket.off("typing:start", handleTypingStart)
      socket.off("typing:stop", handleTypingStop)
      socket.off("user:online", handleUserOnline)
      socket.off("user:offline", handleUserOffline)
    }
  }, [activeConv?._id])

  // ── Send message ───────────────────────────────────────────
  const handleSend = () => {
    if (!messageInput.trim() || !activeConv) return
    socket.emit("message:send", { conversationId: activeConv._id, text: messageInput.trim() })
    setMessageInput("")
    clearTimeout(typingTimer.current)
    socket.emit("typing:stop", { conversationId: activeConv._id })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Typing indicator ───────────────────────────────────────
  const handleTyping = (val: string) => {
    setMessageInput(val)
    if (!activeConv) return
    socket.emit("typing:start", { conversationId: activeConv._id })
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      socket.emit("typing:stop", { conversationId: activeConv._id })
    }, 1500)
  }

  // ── New conversation from search modal ─────────────────────
  const handleNewConversation = (conv: Conversation) => {
    setConversations((prev) => {
      const exists = prev.find((c) => c._id === conv._id)
      return exists ? prev : [conv, ...prev]
    })
    setActiveConv(conv)
    setShowSearch(false)
  }

  // ── Filtered conversations (sidebar search) ────────────────
  const filtered = conversations.filter((conv) => {
    const other = getOther(conv, myId)
    return other?.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const activeOther = activeConv ? getOther(activeConv, myId) : null
  const isActiveOnline = activeOther ? onlineUsers.has(activeOther._id) : false

  // ── Render ─────────────────────────────────────────────────
  return (
    <AppLayout isAuthenticated={isAuthenticated}>
      <div className="container max-w-8xl mx-auto py-6">
        <div className="grid lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-12rem)]">

          {/* ── Sidebar ── */}
          <div className={`flex flex-col border rounded-lg bg-card overflow-hidden
            ${activeConv ? "hidden lg:flex" : "flex"}`}>

            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg">Messages</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {convLoading && (
                  <p className="text-center text-sm text-muted-foreground py-8">Loading...</p>
                )}
                {!convLoading && filtered.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No conversations yet
                  </p>
                )}
                {filtered.map((conv) => {
                  const other = getOther(conv, myId)
                  const isOnline = onlineUsers.has(other?._id)

                  return (
                    <button
                      key={conv._id}
                      onClick={() => setActiveConv(conv)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors
                        ${activeConv?._id === conv._id ? "bg-accent" : ""}`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={other?.avatar?.url} alt={other?.userName} />
                          <AvatarFallback>{other?.userName?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <p className="font-medium truncate">{other?.userName}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage
                            ? `${conv.lastMessage.sender.userName === other?.userName ? "" : "You: "}${conv.lastMessage.text}`
                            : isOnline ? "Online" : "Offline"}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* ── Chat Window ── */}
          <div className={`flex flex-col border rounded-lg bg-card overflow-hidden
            ${activeConv ? "flex" : "hidden lg:flex"}`}>

            {activeConv && activeOther ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={() => setActiveConv(null)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activeOther.avatar?.url} alt={activeOther.userName} />
                        <AvatarFallback>{activeOther.userName?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {isActiveOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{activeOther.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {isTyping ? "typing..." : isActiveOnline ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon"><Phone className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><Video className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {msgLoading && (
                      <p className="text-center text-sm text-muted-foreground">Loading messages...</p>
                    )}
                    {!msgLoading && messages.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground">Say hello 👋</p>
                    )}
                    {messages.map((msg) => {
                      const isMine = msg.sender._id === myId
                      return (
                        <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`flex gap-2 max-w-[70%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                            {!isMine && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={activeOther.avatar?.url} />
                                <AvatarFallback>{activeOther.userName?.[0]?.toUpperCase()}</AvatarFallback>
                              </Avatar>
                            )}
                            <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                              <div className={`rounded-2xl px-4 py-2 ${isMine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                <p className="text-sm">{msg.text}</p>
                              </div>
                              <span className="text-xs text-muted-foreground mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={bottomRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => handleTyping(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1"
                    />
                    <Button size="icon" onClick={handleSend} disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation or start a new one
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Search Modal */}
      {showSearch && (
        <UserSearchModal
          onClose={() => setShowSearch(false)}
          onConversationStart={handleNewConversation}
        />
      )}
    </AppLayout>
  )
}