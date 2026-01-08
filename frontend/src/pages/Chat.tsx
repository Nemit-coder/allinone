"use client"

import type React from "react"

import { useState } from "react"
import AppLayout from "@/src/components/AppLayout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Search, MoreVertical, Phone, Video } from "lucide-react"

interface ChatProps {
  isAuthenticated: boolean
}

interface User {
  id: number
  name: string
  username: string
  avatar: string
  online: boolean
  lastSeen?: string
}

interface Message {
  id: number
  userId: number
  content: string
  timestamp: string
  isOwn: boolean
}

const users: User[] = [
  { id: 1, name: "Sarah Johnson", username: "@sarahj", avatar: "/placeholder.svg?height=40&width=40", online: true },
  { id: 2, name: "Mike Chen", username: "@mikec", avatar: "/placeholder.svg?height=40&width=40", online: true },
  {
    id: 3,
    name: "Emma Wilson",
    username: "@emmaw",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
    lastSeen: "2h ago",
  },
  { id: 4, name: "David Brown", username: "@davidb", avatar: "/placeholder.svg?height=40&width=40", online: true },
  {
    id: 5,
    name: "Lisa Anderson",
    username: "@lisaa",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
    lastSeen: "5h ago",
  },
  { id: 6, name: "James Taylor", username: "@jamest", avatar: "/placeholder.svg?height=40&width=40", online: true },
  {
    id: 7,
    name: "Rachel Green",
    username: "@rachelg",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
    lastSeen: "1d ago",
  },
  { id: 8, name: "Tom Harris", username: "@tomh", avatar: "/placeholder.svg?height=40&width=40", online: true },
]

export default function Chat({ isAuthenticated }: ChatProps) {
  const [selectedUser, setSelectedUser] = useState<User>(users[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, userId: 1, content: "Hey! How are you doing?", timestamp: "10:30 AM", isOwn: false },
    {
      id: 2,
      userId: 0,
      content: "I'm doing great! Just finished my latest project.",
      timestamp: "10:32 AM",
      isOwn: true,
    },
    { id: 3, userId: 1, content: "That's awesome! Can't wait to see it.", timestamp: "10:33 AM", isOwn: false },
    { id: 4, userId: 0, content: "I'll share it with you soon!", timestamp: "10:35 AM", isOwn: true },
    { id: 5, userId: 1, content: "Looking forward to it! 🎉", timestamp: "10:36 AM", isOwn: false },
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          userId: 0,
          content: messageInput,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOwn: true,
        },
      ])
      setMessageInput("")
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <AppLayout isAuthenticated={isAuthenticated}>
      <div className="container max-w-7xl py-6">
        <div className="grid lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-12rem)]">
          {/* Users Sidebar */}
          <div className="flex flex-col border rounded-lg bg-card overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors ${
                      selectedUser.id === user.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.online ? "Online" : `Last seen ${user.lastSeen}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex flex-col border rounded-lg bg-card overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {selectedUser.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.online ? "Active now" : `Last seen ${selectedUser.lastSeen}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-2 max-w-[70%] ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}>
                      {!message.isOwn && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                          <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"}`}>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">{message.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
