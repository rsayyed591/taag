"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

function CreatorSelection() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const [activeTab, setActiveTab] = useState("all")
  const [creators, setCreators] = useState({
    all: [],
    decideLater: [],
    shortlisted: [],
  })

  useEffect(() => {
    // Static list of creators for demo
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
    //   {
    //     id: 799774,
    //     name: "Anshul Bhat",
    //     location: "Mumbai, MH",
    //     views: "129K",
    //     image: "/placeholder.svg?height=400&width=400",
    //   },
    //   {
    //     id: 799775,
    //     name: "Rohan",
    //     location: "Delhi, DL",
    //     views: "85K",
    //     image: "/placeholder.svg?height=400&width=400",
    //   },
    //   {
    //     id: 799776,
    //     name: "Rihan",
    //     location: "Bangalore, KA",
    //     views: "210K",
    //     image: "/placeholder.svg?height=400&width=400",
    //   },
    // ]

    // Update state
    setCreators((prev) => ({ ...prev, all: filteredCreators }))
  }, [])

  const dragConstraints = useRef(null)
  const dragStartX = useRef(0)

  const handleDragStart = (e) => {
    dragStartX.current = e.clientX
  }

  const handleDragEnd = (e, creator, currentList) => {
    const dragDistance = e.clientX - dragStartX.current
    const threshold = 100

    if (dragDistance > threshold) {
      // Swipe right - Shortlist
      moveCreator(creator, currentList, "shortlisted")
    } else if (dragDistance < -threshold) {
      // Swipe left - Reject
      removeCreator(creator, currentList)
    }
  }

  const moveCreator = (creator, fromList, toList) => {
    setCreators((prev) => ({
      ...prev,
      [fromList]: prev[fromList].filter((c) => c.id !== creator.id),
      [toList]: [...prev[toList], creator],
    }))
  }

  const removeCreator = (creator, fromList) => {
    setCreators((prev) => ({
      ...prev,
      [fromList]: prev[fromList].filter((c) => c.id !== creator.id),
    }))
  }

  const handleStartCampaign = () => {
    const campaigns = JSON.parse(localStorage.getItem("campaigns")) || []
    const campaignIndex = campaigns.findIndex((c) => c.name === campaignId)
    console.log(campaignIndex)

    if (campaignIndex !== -1) {
      campaigns[campaignIndex].creators = creators.shortlisted
      campaigns[campaignIndex].status = "Script Confirmation"
      localStorage.setItem("campaigns", JSON.stringify(campaigns))
    }

    navigate(`/campaign`)
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-2">
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
          <h1 className="text-xl font-medium">Creator List</h1>
        </div>
        <button>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
              stroke="#111827"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M16 2V6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 2V6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 10H21" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-4 gap-2">
        {[
          { id: "all", label: "All" },
          { id: "decideLater", label: "Decide Later" },
          { id: "shortlisted", label: "Shortlisted" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === tab.id ? "bg-[#12766A] text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats for Shortlisted */}
      {activeTab === "shortlisted" && creators.shortlisted.length > 0 && (
        <div className="px-4 pb-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Creators: {creators.shortlisted.length}/07</span>
            <span>Total Cost: ₹5,00,000</span>
            <span>Views: 100K</span>
          </div>
        </div>
      )}

      {/* Creator Cards */}
      <div className="p-4" ref={dragConstraints}>
        <AnimatePresence>
          {creators[activeTab].length > 0 ? (
            creators[activeTab].map((creator) => (
              <motion.div
                key={creator.id}
                drag="x"
                dragConstraints={dragConstraints}
                onDragStart={handleDragStart}
                onDragEnd={(e) => handleDragEnd(e, creator, activeTab)}
                className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={creator.image || "/placeholder.svg"}
                  alt={creator.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{creator.name}</h3>
                    <span className="text-sm font-medium">{creator.views}</span>
                  </div>
                  <p className="text-sm text-gray-500">{creator.location}</p>
                  <p className="text-sm text-gray-500">Average Views</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <p>No creators in this section</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      {activeTab === "all" && creators.all.length > 0 && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-6 px-4">
          <button
            onClick={() => {
              const current = creators.all[0]
              if (current) removeCreator(current, "all")
            }}
            className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg"
          >
            ✕
          </button>
          <button
            onClick={() => {
              const current = creators.all[0]
              if (current) moveCreator(current, "all", "decideLater")
            }}
            className="w-14 h-14 rounded-full bg-yellow-500 text-white flex items-center justify-center shadow-lg"
          >
            ?
          </button>
          <button
            onClick={() => {
              const current = creators.all[0]
              if (current) moveCreator(current, "all", "shortlisted")
            }}
            className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg"
          >
            ✓
          </button>
        </div>
      )}

      {/* Start Campaign Button */}
      {activeTab === "shortlisted" && creators.shortlisted.length > 0 && (
        <div className="fixed bottom-8 left-4 right-4">
          <button
            onClick={handleStartCampaign}
            className="w-full bg-[#E5F0EE] text-[#12766A] font-medium py-4 rounded-lg"
          >
            Start campaign
          </button>
        </div>
      )}
    </div>
  )
}

export default CreatorSelection

