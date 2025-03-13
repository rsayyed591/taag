"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ArrowDownAZ, MessageCircle } from "lucide-react"
import BottomNavigation from "../../components/BottomNavigation"

function Campaign() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState([])
  const [brandName, setBrandName] = useState("")
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [totalInProgress, setTotalInProgress] = useState(0)
  const [user, setUser] = useState({})
  const [userType, setUserType] = useState("brand") // Default to brand
  const [campaignInvites, setCampaignInvites] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeChats, setActiveChats] = useState({})

  useEffect(() => {
    // Get user type from localStorage
    const activeId = localStorage.getItem("activeProfileId")
    const users = JSON.parse(localStorage.getItem("userProfiles")) || []
    const user = users.find((c) => c.id === Number(activeId)) || { userType: "brand" }
    setUser(user)
    setUserType(user.userType.toLowerCase())
    loadCampaigns()
    loadActiveChats()

    // If user is a creator, load campaign invites
    if (user.userType.toLowerCase() === "creator") {
      loadCampaignInvites(user)
    }

    // Set up storage event listener for real-time chat updates
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith("chat_")) {
        loadActiveChats()
      }
    }

    // Set up custom event listener for real-time chat updates
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
  }, [])

  // Function to load all active chats from localStorage
  const loadActiveChats = () => {
    const chats = {}
    const currentUserType = userType.toLowerCase()

    // Scan localStorage for chat keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith("chat_")) {
        try {
          const messages = JSON.parse(localStorage.getItem(key)) || []
          const [_, campaignId, creatorId] = key.split("_")

          if (messages.length > 0) {
            // Count unread messages (messages not from the current user type and not marked as read)
            const unreadCount = messages.filter((m) => !m.read && m.sender !== currentUserType && !m.isStatus).length

            chats[campaignId] = {
              creatorName: creatorId,
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

    // Update campaigns with chat data
    loadCampaigns(chats)
  }

  const loadCampaigns = (chatData = activeChats) => {
    const storedCampaigns = JSON.parse(localStorage.getItem("campaigns")) || []

    // Add chat data to campaigns
    const campaignsWithChatData = storedCampaigns.map((campaign) => {
      const chat = chatData[campaign.id]
      return {
        ...campaign,
        hasUnreadMessages: chat?.unreadCount > 0,
        lastMessage: chat?.lastMessage,
        unreadCount: chat?.unreadCount || 0,
      }
    })

    setCampaigns(campaignsWithChatData)

    // Calculate statistics
    const completed = storedCampaigns.filter((c) => c.status === "completed").length
    const inProgress = storedCampaigns.filter((c) => c.status !== "completed").length

    setTotalCompleted(completed)
    setTotalInProgress(inProgress)
  }

  const loadCampaignInvites = (user) => {
    const storedCampaigns = JSON.parse(localStorage.getItem("campaigns")) || [];
const userCreatorTypes = user.creatorDetails?.category || [];
const activeId = Number(localStorage.getItem("activeProfileId")); // Ensure activeId is a number

// Filter campaigns where the creator's ID is in campaign.creators OR matches category
const relevantCampaigns = storedCampaigns.filter((campaign) =>
  campaign.creators?.some((creator) => creator.id === activeId) ||  // Match creator ID
  (campaign.creatorTypes?.length && campaign.creatorTypes.some((type) => userCreatorTypes.includes(type))) // Match category
);
console.log("Relevant campaigns:", relevantCampaigns);
// Transform campaigns into invites
const invites = relevantCampaigns.map((campaign) => {
  const chatData = activeChats[campaign.id] || {}; // Safe fallback for chat data

  return {
    id: campaign.id,
    name: campaign.name,
    brandName: campaign.name || "MamaEarth",
    date: campaign.date,
    budget: campaign.budget || [25000, 50000],
    platform: campaign.platform || "instagram",
    status: "pending",
    creatorTypes: campaign.creatorTypes || [],
    hasUnreadMessages: chatData.unreadCount > 0, // Safe access
    lastMessage: chatData.lastMessage || "", // Safe fallback
  };
});

setCampaignInvites(invites);


  }

  const handleInterested = (campaignId, brandName) => {
    // Update the campaign invite status
    setCampaignInvites((prev) =>
      prev.map((invite) => (invite.id === campaignId ? { ...invite, status: "interested" } : invite)),
    )
    setBrandName(brandName)
    // Create a chat key for this conversation
    const chatKey = `chat_${campaignId}_${user.name} + ${brandName}`
    console.log("Chat key:", chatKey)

    // Check if chat already exists
    const existingChat = localStorage.getItem(chatKey)
    if (!existingChat) {
      // Initialize chat with a system message
      const initialMessage = {
        id: Date.now(),
        text: "Campaign started successfully!",
        sender: "system",
        timestamp: new Date().toISOString(),
        isStatus: true,
      }

      localStorage.setItem(chatKey, JSON.stringify([initialMessage]))

      // Broadcast chat update
      const event = new CustomEvent("chatUpdate", {
        detail: {
          key: chatKey,
          messages: [initialMessage],
        },
      })
      window.dispatchEvent(event)
    }

    // Navigate to the chat
    navigate(`/chat/${campaignId}/${user.name} + ${brandName}`)
  }

  const navigateToChat = (campaignId, creatorName) => {
    // Mark messages as read when navigating to chat
    const chatKey = `chat_${campaignId}_${user.name} + ${campaign.brandName}`
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
    navigate(`/chat/${campaignId}/${creatorName}`)
  }

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredInvites = campaignInvites.filter((invite) =>
    invite.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format timestamp for display
  const formatTime = (timestamp) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    const today = new Date()

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  // Brand view - shows campaign management UI
  const BrandView = () => (
    <>
      {/* Stats Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="mb-4">
          <p className="text-base text-gray-700">Total Campaigns: {campaigns.length > 0 ? campaigns.length : "-"}</p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
          <div
            className="bg-[#12766A] h-2.5 rounded-full transition-all"
            style={{
              width: `${campaigns.length ? (totalCompleted / campaigns.length) * 100 : 0}%`,
            }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#12766A] mr-2" />
            <span className="text-gray-600">Completed: {totalCompleted}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-2" />
            <span className="text-gray-600">In Progress: {totalInProgress}</span>
          </div>
        </div>
      </div>

      {/* New Campaign Button */}
      <button
        onClick={() => navigate("/campaign/new-campaign")}
        className="w-full bg-white text-center py-3 rounded-lg font-medium tracking-wide mb-6 shadow-sm hover:shadow-md transition-shadow"
      >
        NEW CAMPAIGN <span className="text-[#12766A]">+</span>
      </button>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search by name, amount, etc."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#12766A]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="absolute inset-y-0 right-3 flex items-center">
          <ArrowDownAZ className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Campaign List */}
      {filteredCampaigns.length > 0 ? (
        <div className="space-y-3">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div onClick={() => navigate(`/campaign/view/${campaign.id}`)}>
                  <h3 className="font-medium">{campaign.name || "Campaign Name"}</h3>
                  <p className="text-sm text-gray-500">{campaign.creators?.length || 0} Creators</p>
                </div>
                <div className="flex flex-col items-end">
                  <p
                    className={`text-sm font-medium ${
                      campaign.status === "Brand Confirmed" ? "text-[#12766A]" : "text-amber-500"
                    }`}
                  >
                    {campaign.status || "In Progress"}
                  </p>
                  <p className="text-xs text-gray-500">{campaign.date || "Today"}</p>

                  {/* Chat button with notification indicator */}
                  {campaign.creators?.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigateToChat(campaign.id, campaign.creators[0])
                      }}
                      className="mt-2 flex items-center text-[#12766A]"
                    >
                      <MessageCircle size={18} />
                      {activeChats[campaign.id]?.unreadCount > 0 && (
                        <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {activeChats[campaign.id]?.unreadCount}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-12 text-center">
          <div className="mb-6">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto opacity-50"
            >
              <path
                d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10ZM60 100C37.9 100 20 82.1 20 60C20 37.9 37.9 20 60 20C82.1 20 100 37.9 100 60C100 82.1 82.1 100 60 100Z"
                fill="#CCCCCC"
              />
              <path d="M65 40H55V65H80V55H65V40Z" fill="#CCCCCC" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-1">No Campaigns yet!</h3>
          <p className="text-gray-500 mb-6">Create a campaign by tapping "+"</p>
        </div>
      )}
    </>
  )

  // Creator view - shows campaign invites
  const CreatorView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-medium">Creator Chats with brand</h2>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search campaigns"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#12766A]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="absolute inset-y-0 right-3 flex items-center">
          <ArrowDownAZ className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {filteredInvites.length > 0 ? (
        <div className="space-y-4">
          {filteredInvites.map((invite) => (
            <div key={invite.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{invite.brandName}</h3>
                  <span className="text-xs text-gray-500">
                    {invite.lastMessage ? formatTime(invite.lastMessage.timestamp) : invite.date}
                  </span>
                </div>

                {invite.lastMessage && !invite.lastMessage.isStatus ? (
                  <p className="text-sm text-gray-600 mb-2 truncate">{invite.lastMessage.text}</p>
                ) : (
                  <div className="space-y-2 mb-2">
                    <p className="text-sm text-gray-500">
                      Platform: {invite.platform.charAt(0).toUpperCase() + invite.platform.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Budget: ₹{invite.budget[0].toLocaleString()} - ₹{invite.budget[1].toLocaleString()}
                    </p>
                  </div>
                )}

                {invite.status === "pending" ? (
                  <button
                    onClick={() => handleInterested(invite.id, invite.brandName)}
                    className="w-full mt-2 bg-[#E5F0EE] text-[#12766A] font-medium py-2 rounded-lg hover:bg-[#D5E8E5] transition-colors"
                  >
                    Interested
                  </button>
                ) : (
                  <button
                    onClick={() => navigateToChat(invite.id, invite.brandName)}
                    className="w-full mt-2 bg-[#E5F0EE] text-[#12766A] font-medium py-2 rounded-lg hover:bg-[#D5E8E5] transition-colors flex items-center justify-center"
                  >
                    <span>View Chat</span>
                    {invite.hasUnreadMessages && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {activeChats[invite.id]?.unreadCount || 1}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-12 text-center">
          <div className="mb-6">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto opacity-50"
            >
              <path
                d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10ZM60 100C37.9 100 20 82.1 20 60C20 37.9 37.9 20 60 20C82.1 20 100 37.9 100 60C100 82.1 82.1 100 60 100Z"
                fill="#CCCCCC"
              />
              <path d="M65 40H55V65H80V55H65V40Z" fill="#CCCCCC" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-1">No Campaign Invites</h3>
          <p className="text-gray-500 mb-6">You'll see relevant campaign invites here</p>
        </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Campaigns</h1>

        {userType === "brand" ? <BrandView /> : <CreatorView />}
      </div>

      <BottomNavigation />
    </div>
  )
}

export default Campaign

