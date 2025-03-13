"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MessageCircle, Edit, Calendar, ChevronDown } from "lucide-react"
import { Range } from "react-range"

function ViewCampaign() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const [currentCampaign, setCurrentCampaign] = useState(null)
  const [creators, setCreators] = useState([])
  const [userType, setUserType] = useState("brand")
  const [activeChats, setActiveChats] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState(null)

  const creatorTypeOptions = ["Fitness", "Wellness", "Cooking", "Beauty", "Entertainment", "Fashion"]

  useEffect(() => {
    // Get user type from localStorage
    const activeId = localStorage.getItem("activeProfileId")
    const users = JSON.parse(localStorage.getItem("userProfiles")) || []
    const user = users.find((u) => u.id === activeId) || { userType: "brand" }
    setUserType(user.userType.toLowerCase())

    // Fetch campaigns from localStorage
    const campaigns = JSON.parse(localStorage.getItem("campaigns")) || []
    const foundCampaign = campaigns.find((c) => c.id === campaignId)
    if (foundCampaign) {
      setCurrentCampaign(foundCampaign)
      setEditFormData(foundCampaign)
    }

    // Get creators from the campaign
    const storedProfiles = foundCampaign?.creators || []
    const filteredCreators = storedProfiles.map((user) => ({
      id: user.id,
      name: user.creatorDetails?.name || user.name,
      location: user.location || "Unknown Location",
      views: user.views || "0K",
      image: user.avatar || "/placeholder.svg",
    }))

    setCreators(filteredCreators)

    // Load active chats
    loadActiveChats()

    // Set up event listeners for real-time updates
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith("chat_")) {
        loadActiveChats()
      }
    }

    const handleChatUpdate = (e) => {
      if (e.detail && e.detail.key && e.detail.key.startsWith("chat_")) {
        loadActiveChats()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("chatUpdate", handleChatUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("chatUpdate", handleChatUpdate)
    }
  }, [campaignId])

  // Function to load active chats
  const loadActiveChats = () => {
    const chats = {}
    const currentUserType = userType.toLowerCase()

    // Scan localStorage for chat keys related to this campaign
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith(`chat_${campaignId}_`)) {
        try {
          const messages = JSON.parse(localStorage.getItem(key)) || []
          const [_, campaignId, creatorName] = key.split("_")

          if (messages.length > 0) {
            // Count unread messages
            const unreadCount = messages.filter((m) => !m.read && m.sender !== currentUserType && !m.isStatus).length

            chats[creatorName] = {
              lastMessage: messages[messages.length - 1],
              unreadCount: unreadCount,
            }
          }
        } catch (error) {
          console.error(`Error parsing chat data for key ${key}:`, error)
        }
      }
    }

    setActiveChats(chats)
  }

  // Function to navigate to chat and mark messages as read
  const navigateToChat = (creatorName) => {
    // Mark messages as read when navigating to chat
    const chatKey = `chat_${campaignId}_${creatorName} + ${currentCampaign?.name}`
    console.log("Navigating to chat:", chatKey)
    const messages = JSON.parse(localStorage.getItem(chatKey)) || []

    // Only mark messages as read if they're from the other user type
    const updatedMessages = messages.map((msg) => ({
      ...msg,
      read: msg.sender !== userType.toLowerCase() ? true : msg.read,
    }))

    localStorage.setItem(chatKey, JSON.stringify(updatedMessages))

    // Broadcast chat update
    const event = new CustomEvent("chatUpdate", {
      detail: {
        key: chatKey,
        messages: updatedMessages,
      },
    })
    window.dispatchEvent(event)

    // Navigate to chat
    navigate(`/chat/${campaignId}/${creatorName} + ${currentCampaign?.name}`)
  }

  // Convert timestamp to readable format (e.g., 2hr, 1d)
  const timeAgo = (timestamp) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffMs = now - messageTime // Difference in milliseconds
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d`
    if (diffHours > 0) return `${diffHours}hr`
    if (diffMinutes > 0) return `${diffMinutes}m`
    return "Just now"
  }

  const toggleCreatorType = (type) => {
    setEditFormData((prev) => ({
      ...prev,
      creatorTypes: prev.creatorTypes.includes(type)
        ? prev.creatorTypes.filter((t) => t !== type)
        : [...prev.creatorTypes, type],
    }))
  }

  const formatCurrency = (value) => {
    return `₹${value >= 100000 ? (value / 100000).toFixed(1) + "L" : (value / 1000).toFixed(0) + "K"}`
  }

  const handleSaveEdit = () => {
    // Update campaign in localStorage
    const campaigns = JSON.parse(localStorage.getItem("campaigns")) || []
    const updatedCampaigns = campaigns.map((campaign) => (campaign.id === campaignId ? editFormData : campaign))

    localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns))
    setCurrentCampaign(editFormData)
    setIsEditing(false)
  }

  if (isEditing && editFormData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center p-4 border-b bg-white">
          <button onClick={() => setIsEditing(false)} className="mr-4 text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M12 19L5 12L12 5"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-xl font-medium">MamaEarth</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Campaign Name</label>
            <input
              type="text"
              placeholder="Campaign Name"
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#12766A]"
              required
            />
          </div>

          {/* Platform Selection */}
          <div>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setEditFormData((prev) => ({ ...prev, platform: "instagram" }))}
                className={`flex-1 py-2 px-4 rounded-full text-sm ${
                  editFormData.platform === "instagram" ? "bg-[#12766A] text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                Instagram
              </button>
              <button
                type="button"
                onClick={() => setEditFormData((prev) => ({ ...prev, platform: "youtube" }))}
                className={`flex-1 py-2 px-4 rounded-full text-sm ${
                  editFormData.platform === "youtube" ? "bg-[#12766A] text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                YouTube
              </button>
            </div>

            {/* Deliverable */}
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">Deliverable</label>
              <div className="relative">
                <select
                  value={
                    editFormData.platform === "instagram" ? editFormData.instadeliverable : editFormData.ytdeliverable
                  }
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      [editFormData.platform === "instagram" ? "instadeliverable" : "ytdeliverable"]: e.target.value,
                    }))
                  }
                  className="w-full p-3 rounded-lg border border-gray-200 appearance-none focus:outline-none focus:ring-1 focus:ring-[#12766A] bg-white"
                >
                  <option value="">Select Deliverable</option>
                  <option value="review">Product Review</option>
                  <option value="unboxing">Unboxing</option>
                  <option value="tutorial">Tutorial</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Timeline</label>
              <div className="relative">
                <input
                  type="date"
                  value={editFormData.platform === "instagram" ? editFormData.instatimeline : editFormData.yttimeline}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      [editFormData.platform === "instagram" ? "instatimeline" : "yttimeline"]: e.target.value,
                    }))
                  }
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#12766A] appearance-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Calendar size={18} className="text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Slider */}
          <div>
            <label className="block text-sm text-gray-500 mb-3">Budget (₹)</label>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Min</span>
              <span>Max</span>
            </div>
            <div className="py-6">
              <Range
                step={5000}
                min={10000}
                max={1000000}
                values={editFormData.budget}
                onChange={(values) => setEditFormData((prev) => ({ ...prev, budget: values }))}
                renderTrack={({ props, children }) => (
                  <div {...props} className="w-full h-1 bg-gray-200 rounded-full" style={{ ...props.style }}>
                    {children}
                  </div>
                )}
                renderThumb={({ props, isDragged }) => (
                  <div
                    {...props}
                    className={`w-5 h-5 rounded-full focus:outline-none ${isDragged ? "bg-[#0D5D53]" : "bg-[#12766A]"}`}
                    style={{ ...props.style, boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)" }}
                  />
                )}
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs font-medium">{formatCurrency(editFormData.budget[0])}</span>
                <span className="text-xs font-medium">{formatCurrency(editFormData.budget[1])}</span>
              </div>
            </div>
          </div>

          {/* Creator Types */}
          <div>
            <label className="block text-sm text-gray-500 mb-3">Creator Types</label>
            <div className="flex flex-wrap gap-2">
              {creatorTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleCreatorType(type)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    editFormData.creatorTypes.includes(type) ? "bg-[#12766A] text-white" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSaveEdit}
            className="w-full bg-[#E5F0EE] text-[#12766A] font-medium py-3 rounded-full mt-8"
          >
            Update Campaign
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => navigate(-1)} className="mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex-1 mx-4">
          <h1 className="text-xl font-medium">{currentCampaign?.name} Creators</h1>
          <p className="text-sm text-gray-500">{creators.length} Selected Creators</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-[#12766A] text-sm font-medium bg-[#E5F0EE] px-3 py-1 rounded-md flex items-center"
          >
            <Edit size={14} className="mr-1" />
            Edit
          </button>
          <button
            onClick={() => navigate(`/campaign/creator/${campaignId}`)}
            className="text-[#12766A] text-sm font-medium bg-[#E5F0EE] px-3 py-1 rounded-md"
          >
            Edit Brief
          </button>
        </div>
      </div>

      {/* List of Creators */}
      <div className="p-4 space-y-4">
        {creators.map((creator) => {
          const chatData = activeChats[creator.name] || {}
          const lastMessage = chatData.lastMessage
          const hasUnreadMessages = chatData.unreadCount > 0

          return (
            <div
              key={creator.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              onClick={() => navigateToChat(creator.name)}
            >
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h2 className="font-medium">{creator.name}</h2>
                    {hasUnreadMessages && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chatData.unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{lastMessage ? timeAgo(lastMessage.timestamp) : ""}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 truncate pr-2">
                    {lastMessage ? lastMessage.text : "No messages yet"}
                  </p>
                  <button
                    className="text-[#12766A] p-1 rounded-full hover:bg-[#E5F0EE]"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateToChat(creator.name)
                    }}
                  >
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ViewCampaign

