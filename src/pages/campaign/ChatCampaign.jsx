"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, MoreVertical, Send, FileText, Image, Camera, Check, MessageCircle } from "lucide-react"

function ChatCampaign() {
  const { campaignId, creatorName } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [userType, setUserType] = useState("brand")
  const [campaignDetails, setCampaignDetails] = useState(null)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [showBrandBrief, setShowBrandBrief] = useState(false)
  const messagesEndRef = useRef(null)
  const messageListenerRef = useRef(null)
  const inputRef = useRef(null)

  // Campaign progress states
  const [campaignProgress, setCampaignProgress] = useState({
    creatorLocked: true,
    brandConfirmation: true,
    scriptConfirmation: false,
    videoApproval: false,
  })

  // Function to generate a unique chat key for this conversation
  const getChatKey = () => `chat_${campaignId}_${creatorName} + ${campaignDetails?.name}` 

  useEffect(() => {
    // Get user type from localStorage
    const activeId = localStorage.getItem("activeProfileId")
    const users = JSON.parse(localStorage.getItem("userProfiles")) || []
    const user = users.find((u) => u.id === Number(activeId)) || { userType: "brand" }
    setUserType(user.userType.toLowerCase())

    // Load campaign details
    const campaigns = JSON.parse(localStorage.getItem("campaigns")) || []
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (campaign) {
      setCampaignDetails(campaign)

      // Set progress based on campaign status
      if (campaign.status === "Brand Confirmed") {
        setCampaignProgress({
          creatorLocked: true,
          brandConfirmation: true,
          scriptConfirmation: false,
          videoApproval: false,
        })
      }
    }

    // Load chat history from localStorage
    loadMessages()

    // Set up storage event listener for real-time updates
    const handleStorageChange = (e) => {
      if (e.key === getChatKey()) {
        loadMessages()
      }
    }

    // Set up custom event listener for real-time updates
    const handleChatUpdate = (e) => {
      if (e.detail && e.detail.key === getChatKey()) {
        setMessages(e.detail.messages)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("chatUpdate", handleChatUpdate)
    messageListenerRef.current = { storage: handleStorageChange, chatUpdate: handleChatUpdate }

    return () => {
      if (messageListenerRef.current) {
        window.removeEventListener("storage", messageListenerRef.current.storage)
        window.removeEventListener("chatUpdate", messageListenerRef.current.chatUpdate)
      }
    }
  }, [campaignId, creatorName])

  // Function to load messages from localStorage
  const loadMessages = () => {
    const chatKey = getChatKey()
    const savedMessages = JSON.parse(localStorage.getItem(chatKey)) || []

    // If no messages, add default messages
    if (savedMessages.length === 0) {
      const defaultMessages = [
        {
          id: Date.now() - 3000,
          text: "The shoot can take place on the 7th",
          sender: userType === "brand" ? "creator" : "brand",
          timestamp: new Date().toISOString(),
          read: true,
        },
        {
          id: Date.now() - 2000,
          text: "Makes sense, we can do that!",
          sender: userType === "brand" ? "brand" : "creator",
          timestamp: new Date().toISOString(),
          read: true,
        },
        {
          id: Date.now() - 1000,
          text: "See you there, at 7!",
          sender: userType === "brand" ? "creator" : "brand",
          timestamp: new Date().toISOString(),
          read: true,
        },
        {
          id: Date.now(),
          text: "Sure!",
          sender: userType === "brand" ? "brand" : "creator",
          timestamp: new Date().toISOString(),
          read: true,
        },
      ]

      setMessages(defaultMessages)
      localStorage.setItem(chatKey, JSON.stringify(defaultMessages))

      // Trigger storage event for other tabs/windows
      broadcastChatUpdate(defaultMessages)
    } else {
      setMessages(savedMessages)
    }
  }

  // Improve the broadcastChatUpdate function to ensure real-time updates
  const broadcastChatUpdate = (updatedMessages) => {
    try {
      // Update localStorage to ensure persistence
      localStorage.setItem(getChatKey(), JSON.stringify(updatedMessages))

      // Create a custom event for real-time updates
      const event = new CustomEvent("chatUpdate", {
        detail: {
          key: getChatKey(),
          messages: updatedMessages,
        },
      })
      window.dispatchEvent(event)

      // Dispatch a storage event for other tabs/windows
      // This is a workaround since programmatically triggering storage events is not directly possible
      const storageEvent = new Event("storage")
      storageEvent.key = getChatKey()
      storageEvent.newValue = JSON.stringify(updatedMessages)
      window.dispatchEvent(storageEvent)
    } catch (error) {
      console.error("Error broadcasting chat update:", error)
    }
  }

  // Listen for custom chat update events
  useEffect(() => {
    const handleChatUpdate = (e) => {
      if (e.detail.key === getChatKey()) {
        setMessages(e.detail.messages)
      }
    }

    window.addEventListener("chatUpdate", handleChatUpdate)
    return () => window.removeEventListener("chatUpdate", handleChatUpdate)
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Add a campaign status update message
  const addCampaignStatusMessage = () => {
    const statusMessage = {
      id: Date.now(),
      text: "Campaign started successfully!",
      sender: "system",
      timestamp: new Date().toISOString(),
      isStatus: true,
    }

    const updatedMessages = [...messages, statusMessage]
    setMessages(updatedMessages)
    localStorage.setItem(getChatKey(), JSON.stringify(updatedMessages))
    broadcastChatUpdate(updatedMessages)
  }

  // Update the handleSend function to mark messages as unread for the recipient
  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: userType,
      timestamp: new Date().toISOString(),
      read: false,
    }

    const updatedMessages = [...messages, message]
    setMessages(updatedMessages)
    setNewMessage("")

    // Save to localStorage
    localStorage.setItem(getChatKey(), JSON.stringify(updatedMessages))

    // Broadcast update to other tabs/windows
    broadcastChatUpdate(updatedMessages)

    // Focus back on input
    inputRef.current?.focus()
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    }

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })
  }

  const handleAttachment = (type) => {
    setShowAttachmentMenu(false)
    // In a real app, this would open file picker or camera
    console.log(`Opening ${type}`)
  }

  const handleVideoLink = () => {
    setShowOptionsMenu(false)
    // Add a video link message
    const message = {
      id: Date.now(),
      text: "Here's the video link: https://example.com/video",
      sender: userType,
      timestamp: new Date().toISOString(),
      isVideoLink: true,
      read: false,
    }

    const updatedMessages = [...messages, message]
    setMessages(updatedMessages)
    localStorage.setItem(getChatKey(), JSON.stringify(updatedMessages))
    broadcastChatUpdate(updatedMessages)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-white border-b">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-medium text-center">{campaignDetails?.name}</h1>
        </div>
        <button onClick={() => setShowOptionsMenu(!showOptionsMenu)} className="text-gray-700 relative">
          <MoreVertical size={20} />

          {/* Options Menu */}
          {showOptionsMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md w-48 z-10">
              <div className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer" onClick={handleVideoLink}>
                <span>Video link</span>
                <Check size={16} className="text-green-600 ml-auto" />
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-between p-2 bg-white border-b overflow-x-auto">
        <div className="flex flex-col items-center px-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${campaignProgress.creatorLocked ? "bg-[#12766A]" : "bg-gray-200"}`}
          >
            {campaignProgress.creatorLocked && <Check size={14} className="text-white" />}
          </div>
          <span className="text-[10px] uppercase mt-1 text-center">
            Creator
            <br />
            Locked
          </span>
        </div>

        <div className="flex flex-col items-center px-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${campaignProgress.brandConfirmation ? "bg-[#12766A]" : "bg-gray-200"}`}
          >
            {campaignProgress.brandConfirmation && <Check size={14} className="text-white" />}
          </div>
          <span className="text-[10px] uppercase mt-1 text-center">
            Brand
            <br />
            Confirmation
          </span>
        </div>

        <div className="flex flex-col items-center px-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${campaignProgress.scriptConfirmation ? "bg-[#12766A]" : "bg-gray-200"}`}
          >
            {campaignProgress.scriptConfirmation && <Check size={14} className="text-white" />}
          </div>
          <span className="text-[10px] uppercase mt-1 text-center">
            Script
            <br />
            Confirmation
          </span>
        </div>

        <div className="flex flex-col items-center px-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${campaignProgress.videoApproval ? "bg-[#12766A]" : "bg-gray-200"}`}
          >
            {campaignProgress.videoApproval && <Check size={14} className="text-white" />}
          </div>
          <span className="text-[10px] uppercase mt-1 text-center">
            Video
            <br />
            Approval
          </span>
        </div>
      </div>

      {/* Brand Brief Popup */}
      {showBrandBrief && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-5 z-20 w-4/5">
          <h3 className="text-center font-medium mb-2">Access the Brand brief from here!</h3>
          <button
            onClick={() => {
              setShowBrandBrief(false)
              addCampaignStatusMessage()
            }}
            className="w-full bg-[#E5F0EE] text-[#12766A] rounded-full py-2 mt-2"
          >
            Got it!
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => {
            // Check if we need to show date separator
            const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center my-4">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      {formatDate(message.timestamp)} {formatTime(message.timestamp)}
                    </span>
                  </div>
                )}

                {message.isStatus ? (
                  <div className="flex justify-center my-4">
                    <div className="bg-[#E5F0EE] text-[#12766A] rounded-lg px-4 py-2 flex items-center">
                      <MessageCircle size={16} className="mr-2" />
                      <span>{message.text}</span>
                    </div>
                  </div>
                ) : (
                  <div className={`flex ${message.sender === userType ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === userType ? "bg-[#12766A] text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.isVideoLink ? (
                        <div>
                          <p>{message.text}</p>
                          <div className="mt-1 flex items-center">
                            <Check size={14} className="text-green-400 mr-1" />
                            <span className="text-xs">Sent</span>
                          </div>
                        </div>
                      ) : (
                        <p>{message.text}</p>
                      )}
                      <p className={`text-xs mt-1 ${message.sender === userType ? "text-gray-200" : "text-gray-500"}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} className="text-gray-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#12766A]"
            ref={inputRef}
          />

          <button type="submit" className="text-[#12766A]" disabled={!newMessage.trim()}>
            <Send size={24} />
          </button>
        </div>

        {/* Attachment Menu */}
        {showAttachmentMenu && (
          <div className="bg-white shadow-lg rounded-lg absolute bottom-20 right-4 w-48 z-10">
            <div
              className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleAttachment("document")}
            >
              <FileText size={18} />
              <span>Document</span>
            </div>
            <div
              className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleAttachment("photos")}
            >
              <Image size={18} />
              <span>Photos & Videos</span>
            </div>
            <div
              className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleAttachment("camera")}
            >
              <Camera size={18} />
              <span>Camera</span>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default ChatCampaign

