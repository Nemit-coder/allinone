"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppNav } from "@/components/app-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: Date
}

interface User {
  id: string
  name: string
  avatar: string
  online: boolean
  lastMessage?: string
}

export default function ChatPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState({ name: "", email: "", avatar: "" })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])

  // Demo users
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/diverse-woman-portrait.png",
      online: true,
      lastMessage: "Hey! How are you?",
    },
    {
      id: "2",
      name: "Mike Chen",
      avatar: "/man.jpg",
      online: true,
      lastMessage: "Check out my new video!",
    },
    {
      id: "3",
      name: "Emma Davis",
      avatar: "/diverse-woman-portrait.png",
      online: false,
      lastMessage: "Thanks for the feedback",
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      avatar: "/diverse-group-friends.png",
      online: true,
      lastMessage: "Let's collaborate on this",
    },
    {
      id: "5",
      name: "Lisa Park",
      avatar: "/diverse-group-women.png",
      online: false,
      lastMessage: "Great work on your blog!",
    },
  ])

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (!auth) {
      router.push("/signin")
    } else {
      setIsAuthenticated(true)
      const name = localStorage.getItem("userName") || "User"
      const email = localStorage.getItem("userEmail") || ""
      const avatar = localStorage.getItem("userAvatar") || ""
      setCurrentUser({ name, email, avatar })
    }
  }, [router])

  useEffect(() => {
    // Load demo messages when a user is selected
    if (selectedUser) {
      const demoMessages: Message[] = [
        {
          id: 1,
          userId: selectedUser.id,
          userName: selectedUser.name,
          userAvatar: selectedUser.avatar,
          content: "Hey! How are you doing?",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: 2,
          userId: "current",
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          content: "I'm doing great! Just finished my latest project.",
          timestamp: new Date(Date.now() - 3000000),
        },
        {
          id: 3,
          userId: selectedUser.id,
          userName: selectedUser.name,
          userAvatar: selectedUser.avatar,
          content: "That sounds awesome! Can't wait to see it.",
          timestamp: new Date(Date.now() - 2400000),
        },
      ]
      setMessages(demoMessages)
    }
  }, [selectedUser, currentUser])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedUser) return

    const newMessage: Message = {
      id: messages.length + 1,
      userId: "current",
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: message,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate response after 1 second
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        userId: selectedUser.id,
        userName: selectedUser.name,
        userAvatar: selectedUser.avatar,
        content: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="container mx-auto px-4 py-8">
        <div className="h-[calc(100vh-12rem)]">
          <Card className="h-full overflow-hidden">
            <div className="flex h-full">
              {/* Users List */}
              <div className="w-full md:w-80 border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                  <h2 className="text-xl font-bold">Messages</h2>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2">
                    {users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={cn(
                          "w-full p-3 rounded-lg flex items-center gap-3 hover:bg-accent transition-colors",
                          selectedUser?.id === user.id && "bg-accent",
                        )}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          {user.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{user.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{user.lastMessage}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedUser ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                        <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedUser.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedUser.online ? "Online" : "Offline"}</p>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((msg) => {
                          const isCurrentUser = msg.userId === "current"
                          return (
                            <div key={msg.id} className={cn("flex gap-3", isCurrentUser && "flex-row-reverse")}>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.userAvatar || "/placeholder.svg"} alt={msg.userName} />
                                <AvatarFallback>{msg.userName[0]}</AvatarFallback>
                              </Avatar>
                              <div className={cn("flex flex-col gap-1 max-w-sm", isCurrentUser && "items-end")}>
                                <div
                                  className={cn(
                                    "px-4 py-2 rounded-lg",
                                    isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
                                  )}
                                >
                                  <p className="text-sm">{msg.content}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-4 border-t border-border">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <p className="text-lg font-medium mb-2">No conversation selected</p>
                      <p className="text-sm">Choose a user from the list to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
