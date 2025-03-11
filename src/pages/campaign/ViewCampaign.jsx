"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

function ViewCampaign() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const [currentCampaign, setCurrentCampaign] = useState(null)
  const [creators, setCreators] = useState([])

  useEffect(() => {
    // Fetch campaigns from localStorage
    const campaigns = JSON.parse(localStorage.getItem("campaigns")) || []
    const foundCampaign = campaigns.find((c) => c.id === campaignId)
    if (foundCampaign) setCurrentCampaign(foundCampaign)

       // Get userProfiles from localStorage
    const storedProfiles = JSON.parse(localStorage.getItem("userProfiles")) || [];

    // Filter users where userType is "Creator"
    const filteredCreators = storedProfiles
      .filter(user => user.userType === "Creator")
      .map(user => ({
        id: user.id,
        name: user.creatorDetails?.name || user.name, // Use creatorDetails name if available
        location: user.location || "Unknown Location", // Provide a default value
        views: user.views || "0K", // Provide a default value
        image: user.avatar || "/placeholder.svg", // Provide a default image
      }));

    // const filteredCreators = [
    //   { id: 799774, name: "Ankit Sarpan", location: "Unknown Location", views: "0K", image: "/icons/profile.svg" },
    //   { id: 799775, name: "Manjot Singh", location: "Unknown Location", views: "0K", image: "/icons/profile.svg" },
    //   { id: 799776, name: "Richa Sen", location: "Unknown Location", views: "0K", image: "/icons/profile.svg" },
    // ]

    setCreators(filteredCreators)
  }, [campaignId])

  // Function to fetch last message from localStorage
  const getLastMessage = (creatorName) => {
    const chatKey = `chat_${campaignId}_${creatorName}`
    const messages = JSON.parse(localStorage.getItem(chatKey)) || []
    return messages.length > 0 ? messages[messages.length - 1] : null
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
        <button
          onClick={() => navigate(`/campaign/creator/${campaignId}`)}
          className="text-[#12766A] text-sm font-medium bg-[#E5F0EE] px-3 py-1 rounded-md"
        >
          Edit Brief
        </button>
      </div>

      {/* List of Creators */}
      <div className="p-4 space-y-4">
        {creators.map((creator) => {
          const lastMessage = getLastMessage(creator.name)
          return (
            <div
              key={creator.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              onClick={() => navigate(`/chat/${campaignId}/${creator.name}`)}
            >
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium">{creator.name}</h2>
                  <span className="text-xs text-gray-500">{lastMessage ? timeAgo(lastMessage.timestamp) : ""}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {lastMessage ? lastMessage.text : "The shoot can take place on the 7th"}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ViewCampaign

