"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"

function ChatCampaign() {
  const { campaignId, creatorName } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [userType, setUserType] = useState("brand")
  const [campaignDetails, setCampaignDetails] = useState(null)
  const [campaignProgress, setProgress] = useState({
    briefing: true,
    confirmation: false,
    scriptApproval: false,
    contentCreation: false,
    approval: false,
  })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Get user type from localStorage
    const user = JSON.parse(localStorage.getItem("currentUser")) || { userType: "brand" }
    setUserType(user.userType)

    // Load campaign details
    const campaigns = JSON.parse(localStorage.getItem("campaigns")) || []
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (campaign) {
      setCampaignDetails(campaign)

      // Set progress based on campaign status
      if (campaign.status === "Script Confirmation") {
        setProgress({
          briefing: true,
          confirmation: true,
          scriptApproval: false,
          contentCreation: false,
          approval: false,
        })
      }
    }

    // Load chat history from localStorage
    const chatKey = `chat_${campaignId}_${creatorName}`
    const savedMessages = JSON.parse(localStorage.getItem(chatKey)) || []

    // If no messages, add a default message
    if (savedMessages.length === 0) {
      const defaultMessage = {
        id: Date.now(),
        text: "The shoot can take place on the 7th",
        sender: user.userType === "brand" ? "creator" : "brand",
        timestamp: new Date().toISOString(),
      }
      setMessages([defaultMessage])
      localStorage.setItem(chatKey, JSON.stringify([defaultMessage]))
    } else {
      setMessages(savedMessages)
    }
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
      sender: userType,
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

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
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
        <div className="flex-1">
          <h1 className="font-medium">{userType === "brand" ? creatorName : campaignDetails?.name || "Campaign"}</h1>
          <p className="text-sm text-gray-500">{userType === "brand" ? campaignDetails?.name : "Brand"}</p>
        </div>
        <button>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
              stroke="#111827"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
              stroke="#111827"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
              stroke="#111827"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="flex p-2 bg-white border-b overflow-x-auto">
        <div className="flex space-x-1 min-w-full">
          {Object.entries(campaignProgress).map(([stage, completed], index) => (
            <div key={stage} className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  completed ? "bg-[#12766A]" : "bg-gray-200"
                }`}
              >
                {completed && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              {index < Object.entries(campaignProgress).length - 1 && (
                <div className={`h-0.5 w-4 ${completed ? "bg-[#12766A]" : "bg-gray-200"}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => {
            // Check if we need to show date separator
            const showDate =
              index === 0 ||
              new Date(message.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString()

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center my-4">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}
                <div className={`flex ${message.sender === userType ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === userType ? "bg-[#12766A] text-white" : "bg-white"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === userType ? "text-gray-200" : "text-gray-500"}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
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
            placeholder="Message..."
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

