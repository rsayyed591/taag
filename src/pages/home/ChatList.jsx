"use client"

import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { Check } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../../../firebase.config"
import { useAuth } from "../../context/AuthContext"

function ChatList({ filter }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Query messages collection for chats involving current user
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', user.uid),
      orderBy('timestamp', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatMap = new Map()
      
      snapshot.docs.forEach(doc => {
        const message = { id: doc.id, ...doc.data() }
        const chatId = message.chatId
        
        // Only create a chat entry if we haven't seen this chat yet
        if (!chatMap.has(chatId)) {
          chatMap.set(chatId, {
            id: chatId,
            name: message.senderId === user.uid ? message.receiverName : message.senderName,
            lastMessage: {
              content: message.content,
              type: message.type,
              timestamp: message.timestamp?.toDate(),
              sender: message.senderId === user.uid ? 'me' : 'them',
              status: message.status
            },
            unread: message.receiverId === user.uid && !message.read ? 1 : 0
          })
        }
      })

      const chatList = Array.from(chatMap.values())
      setChats(chatList)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  // Filter chats if needed
  const filteredChats = filter === "unread" ? chats.filter((chat) => chat.unread) : chats

  const formatTime = (timestamp) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const renderLastMessage = (chat) => {
    if (!chat.lastMessage) return "No messages yet"

    if (chat.lastMessage.type === "text") {
      return chat.lastMessage.content
    } else if (chat.lastMessage.type === "invoice") {
      return "📄 Invoice"
    } else if (chat.lastMessage.type === "image") {
      return "📷 Photo"
    } else {
      return "New message"
    }
  }

  const renderMessageStatus = (status) => {
    if (!status) return null

    switch (status) {
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />
      case "delivered":
        return (
          <div className="flex">
            <Check className="w-3 h-3 text-gray-400" />
            <Check className="w-3 h-3 text-gray-400 -ml-1" />
          </div>
        )
      case "read":
        return (
          <div className="flex">
            <Check className="w-3 h-3 text-blue-500" />
            <Check className="w-3 h-3 text-blue-500 -ml-1" />
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#12766A]" />
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {filteredChats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {filter === "unread" ? "No unread messages" : "No messages yet"}
        </div>
      ) : (
        filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-3 cursor-pointer hover:bg-gray-50"
          >
            <div className="w-12 h-12 bg-[#12766A20] rounded-full flex items-center justify-center text-[#12766A] font-medium overflow-hidden">
              {chat.avatar ? (
                <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
              ) : (
                chat.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium truncate">{chat.name}</h3>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatTime(chat.lastMessage?.timestamp)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 truncate flex-1">
                  {chat.lastMessage?.sender === "me" && (
                    <span className="flex items-center gap-1">
                      {renderMessageStatus(chat.lastMessage?.status)}
                      <span>{renderLastMessage(chat)}</span>
                    </span>
                  )}
                  {(!chat.lastMessage || chat.lastMessage?.sender !== "me") && renderLastMessage(chat)}
                </p>

                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-[#12766A] rounded-full flex items-center justify-center text-white text-xs ml-2">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ChatList

