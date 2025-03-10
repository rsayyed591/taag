import { useNavigate } from "react-router-dom"
import { Check } from "lucide-react"

function ChatList({ chats, filter }) {
  const navigate = useNavigate()

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

  return (
    <div className="space-y-1">
      {filteredChats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => navigate(`/chat/${chat.name}`)}
          className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-3 cursor-pointer hover:bg-gray-50"
        >
          <div className="w-12 h-12 bg-[#12766A20] rounded-full flex items-center justify-center text-[#12766A] font-medium overflow-hidden">
            {chat.avatar ? (
              <img src={chat.avatar || "/placeholder.svg"} alt={chat.name} className="w-full h-full object-cover" />
            ) : (
              chat.name.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h3 className="font-medium truncate">{chat.name}</h3>
              <span className="text-xs text-gray-500 whitespace-nowrap">{formatTime(chat.lastMessage?.timestamp)}</span>
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
      ))}
    </div>
  )
}

export default ChatList

