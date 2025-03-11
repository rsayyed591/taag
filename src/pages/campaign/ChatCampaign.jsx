"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"

function ChatCampaign() {
  const { campaignId, creatorName } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Load chat history from localStorage
    const chatKey = `chat_${campaignId}_${creatorName}`
    const savedMessages = JSON.parse(localStorage.getItem(chatKey)) || []
    setMessages(savedMessages)
  }, [campaignId, creatorName])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, message]
    setMessages(updatedMessages)
    setNewMessage("")

    // Save to localStorage
    const chatKey = `chat_${campaignId}_${creatorName}`
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages))
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-white border-b">
        <button onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h1 className="font-medium">{creatorName}</h1>
          <p className="text-sm text-gray-500">{campaignId}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "user" ? "bg-[#12766A] text-white" : "bg-white"
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === "user" ? "text-gray-200" : "text-gray-500"}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#12766A]"
          />
          <button type="submit" className="px-6 py-3 bg-[#12766A] text-white rounded-lg">
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatCampaign

