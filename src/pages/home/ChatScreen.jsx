"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Send,
  FileText,
  Image,
  MessageSquare,
  Check,
  Paperclip,
  Mic,
  MoreVertical,
  Clock,
} from "lucide-react"

function ChatScreen() {
  const { chatName } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    // Load chat history from localStorage
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}")
    const chatMessages = chatHistory[chatName] || []
    setMessages(chatMessages)

    // Scroll to bottom
    scrollToBottom()

    // Simulate online status
    const onlineStatus = Math.random() > 0.3 // 70% chance of being online
    if (onlineStatus) {
      setIsTyping(true)
      const typingTimeout = setTimeout(() => {
        setIsTyping(false)
      }, 3000)

      return () => clearTimeout(typingTimeout)
    }
  }, [chatName])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // Create new message
    const message = {
      id: Math.floor(Math.random() * 1000000),
      type: "text",
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: "me",
      status: "sent", // sent, delivered, read
    }

    // Update state
    const updatedMessages = [...messages, message]
    setMessages(updatedMessages)

    // Save to localStorage
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}")
    chatHistory[chatName] = updatedMessages
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory))

    // Clear input
    setNewMessage("")

    // Focus input field
    inputRef.current?.focus()

    // Simulate message status updates
    simulateMessageStatusUpdates(message.id)

    // Simulate reply after some time
    if (Math.random() > 0.7) {
      // 30% chance of getting a reply
      simulateReply()
    }
  }

  const simulateMessageStatusUpdates = (messageId) => {
    // Update to delivered after 1 second
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, status: "delivered" } : msg)),
      )

      // Update localStorage
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}")
      if (chatHistory[chatName]) {
        chatHistory[chatName] = chatHistory[chatName].map((msg) =>
          msg.id === messageId ? { ...msg, status: "delivered" } : msg,
        )
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory))
      }
    }, 1000)

    // Update to read after 2 seconds
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, status: "read" } : msg)),
      )

      // Update localStorage
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}")
      if (chatHistory[chatName]) {
        chatHistory[chatName] = chatHistory[chatName].map((msg) =>
          msg.id === messageId ? { ...msg, status: "read" } : msg,
        )
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory))
      }
    }, 2000)
  }

  const simulateReply = () => {
    // Show typing indicator
    setIsTyping(true)

    // Random delay between 2-5 seconds
    const replyDelay = 2000 + Math.random() * 3000

    setTimeout(() => {
      setIsTyping(false)

      // Create reply message
      const replyMessages = [
        "Thanks for the message!",
        "I'll check this out and get back to you.",
        "Looks good! When can we discuss further?",
        "Got it, thanks for sharing.",
        "I appreciate the information.",
        "Let me review this and I'll respond soon.",
      ]

      const randomReply = replyMessages[Math.floor(Math.random() * replyMessages.length)]

      const replyMessage = {
        id: Math.floor(Math.random() * 1000000),
        type: "text",
        content: randomReply,
        timestamp: new Date().toISOString(),
        sender: "other",
      }

      // Update state
      const updatedMessages = [...messages, replyMessage]
      setMessages(updatedMessages)

      // Save to localStorage
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}")
      chatHistory[chatName] = updatedMessages
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory))
    }, replyDelay)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInvoiceClick = (invoiceId) => {
    // Find the invoice in localStorage
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    const invoice = invoices.find((inv) => inv.id === invoiceId)

    if (invoice) {
      navigate(`/invoice/${invoice.brandName}`)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    }
  }

  const renderMessageStatus = (status) => {
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
        return <Clock className="w-3 h-3 text-gray-400" />
    }
  }

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = []
    let currentDate = null
    let currentGroup = []

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toDateString()

      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentGroup,
          })
        }

        currentDate = messageDate
        currentGroup = [message]
      } else {
        currentGroup.push(message)
      }
    })

    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: currentGroup,
      })
    }

    return groups
  }

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-[#f0f2f5] border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#12766A20] rounded-full flex items-center justify-center text-[#12766A] font-medium overflow-hidden">
              {/* {chatName.charAt(0).toUpperCase()} */}
            </div>
            <div>
              <h1 className="font-medium text-sm">{chatName}</h1>
              <p className="text-xs text-gray-500">{isTyping ? "typing..." : "online"}</p>
            </div>
          </div>
        </div>

        <button className="p-2">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Chat Background */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-2"
        style={{
          backgroundImage: "url('/whatsapp-bg.png')",
          backgroundSize: "contain",
          backgroundRepeat: "repeat",
        }}
      >
        {groupMessagesByDate().map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-1">
            {/* Date Separator */}
            <div className="flex justify-center mb-2">
              <div className="bg-[#e1f2fa] text-[#55748a] text-xs px-3 py-1 rounded-md shadow-sm">
                {formatDate(group.messages[0].timestamp)}
              </div>
            </div>

            {/* Messages */}
            {group.messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-lg p-2 ${
                    message.sender === "me" ? "bg-[#dcf8c6] rounded-tr-none" : "bg-white rounded-tl-none"
                  }`}
                >
                  {message.type === "text" && <p className="text-sm">{message.content}</p>}

                  {message.type === "invoice" && (
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleInvoiceClick(message.invoiceId)}
                    >
                      <FileText className="w-5 h-5 text-[#12766A]" />
                      <div>
                        <p className="text-sm font-medium">{message.content}</p>
                        <p className="text-xs text-gray-500">Click to view</p>
                      </div>
                    </div>
                  )}

                  <div className={`flex justify-end items-center gap-1 mt-1 text-xs text-gray-500`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.sender === "me" && renderMessageStatus(message.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none p-3 max-w-[75%]">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "200ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "400ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-[#f0f2f5] p-2 flex items-center gap-2">
        <div className="flex gap-2">
          <button className="p-2 text-gray-500 rounded-full" onClick={() => setShowAttachMenu(!showAttachMenu)}>
            <Paperclip className="w-6 h-6" />
          </button>

          {showAttachMenu && (
            <div className="absolute bottom-16 left-4 bg-white rounded-lg shadow-lg p-2 grid grid-cols-3 gap-2">
              <button className="p-3 bg-purple-100 rounded-full flex flex-col items-center">
                <Image className="w-6 h-6 text-purple-500" />
                <span className="text-xs mt-1">Photos</span>
              </button>
              <button className="p-3 bg-green-100 rounded-full flex flex-col items-center">
                <FileText className="w-6 h-6 text-green-500" />
                <span className="text-xs mt-1">Document</span>
              </button>
              <button className="p-3 bg-blue-100 rounded-full flex flex-col items-center">
                <MessageSquare className="w-6 h-6 text-blue-500" />
                <span className="text-xs mt-1">Contact</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 bg-white rounded-full overflow-hidden flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="flex-1 py-2 px-4 bg-transparent outline-none text-sm"
            ref={inputRef}
          />
        </div>

        <button
          onClick={handleSendMessage}
          className="p-2 bg-[#12766A] text-white rounded-full"
          disabled={!newMessage.trim()}
        >
          {newMessage.trim() ? <Send className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}

export default ChatScreen

