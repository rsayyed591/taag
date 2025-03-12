"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useSwipeable } from "react-swipeable"

function CreatorSelection() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const [activeTab, setActiveTab] = useState("all")
  const [sliderPosition, setSliderPosition] = useState(50) // Middle position (0-100)
  const [swipeDirection, setSwipeDirection] = useState(null) // null, 'left', 'right'
  const [currentCreator, setCurrentCreator] = useState(null)
  const [creators, setCreators] = useState({
    all: [],
    decideLater: [],
    shortlisted: [],
  })

  useEffect(() => {
    // Static list of creators for demo
    const filteredCreators = [
      {
        id: 799774,
        name: "Anshul Bhat",
        location: "Mumbai, MH",
        views: "129K",
        image: "/placeholder.svg?height=400&width=400",
      },
      {
        id: 799775,
        name: "Rohan",
        location: "Delhi, DL",
        views: "85K",
        image: "/placeholder.svg?height=400&width=400",
      },
      {
        id: 799776,
        name: "Rihan",
        location: "Bangalore, KA",
        views: "210K",
        image: "/placeholder.svg?height=400&width=400",
      },
    ]

    setCreators((prev) => ({ ...prev, all: filteredCreators }))
    if (filteredCreators.length > 0) {
      setCurrentCreator(filteredCreators[0])
    }
  }, [])

  const cardRef = useRef(null)
  const sliderRef = useRef(null)

  // Handle swipe gestures on the card
  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      const { deltaX } = eventData

      // Update slider position based on swipe
      const newSliderPosition = Math.max(0, Math.min(100, 50 + deltaX / 3))
      setSliderPosition(newSliderPosition)

      // Set swipe direction for visual feedback
      if (deltaX > 50) {
        setSwipeDirection("right")
      } else if (deltaX < -50) {
        setSwipeDirection("left")
      } else {
        setSwipeDirection(null)
      }
    },
    onSwiped: (eventData) => {
      const { deltaX } = eventData

      // Handle swipe actions
      if (deltaX > 100) {
        handleShortlist()
      } else if (deltaX < -100) {
        handleReject()
      } else if (Math.abs(deltaX) < 50) {
        handleDecideLater()
      }

      // Reset states
      setSliderPosition(50)
      setSwipeDirection(null)
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  })

  const handleSliderChange = (e) => {
    const sliderWidth = sliderRef.current?.offsetWidth || 300
    const clickX = e.clientX || e.touches?.[0]?.clientX || 0
    const sliderRect = sliderRef.current?.getBoundingClientRect()
    const relativeX = clickX - (sliderRect?.left || 0)
    const newPosition = Math.max(0, Math.min(100, (relativeX / sliderWidth) * 100))
    setSliderPosition(newPosition)

    // Update swipe direction for visual feedback
    if (newPosition > 66) {
      setSwipeDirection("right")
    } else if (newPosition < 33) {
      setSwipeDirection("left")
    } else {
      setSwipeDirection(null)
    }
  }

  const handleSliderRelease = () => {
    if (sliderPosition < 33) {
      handleReject()
    } else if (sliderPosition > 66) {
      handleShortlist()
    } else {
      handleDecideLater()
    }

    // Reset states
    setSliderPosition(50)
    setSwipeDirection(null)
  }

  const handleReject = () => {
    if (!currentCreator) return

    if (activeTab === "all") {
      setCreators((prev) => ({
        ...prev,
        all: prev.all.filter((c) => c.id !== currentCreator.id),
      }))

      // Find next creator
      const nextCreator = creators.all.find((c) => c.id !== currentCreator.id)
      setCurrentCreator(nextCreator || null)
    } else if (activeTab === "decideLater") {
      setCreators((prev) => ({
        ...prev,
        decideLater: prev.decideLater.filter((c) => c.id !== currentCreator.id),
      }))

      // Find next creator
      const nextCreator = creators.decideLater.find((c) => c.id !== currentCreator.id)
      setCurrentCreator(nextCreator || null)
    }
  }

  const handleShortlist = () => {
    if (!currentCreator) return

    if (activeTab === "all") {
      setCreators((prev) => ({
        ...prev,
        all: prev.all.filter((c) => c.id !== currentCreator.id),
        shortlisted: [...prev.shortlisted, currentCreator],
      }))

      // Find next creator
      const nextCreator = creators.all.find((c) => c.id !== currentCreator.id)
      setCurrentCreator(nextCreator || null)
    } else if (activeTab === "decideLater") {
      setCreators((prev) => ({
        ...prev,
        decideLater: prev.decideLater.filter((c) => c.id !== currentCreator.id),
        shortlisted: [...prev.shortlisted, currentCreator],
      }))

      // Find next creator
      const nextCreator = creators.decideLater.find((c) => c.id !== currentCreator.id)
      setCurrentCreator(nextCreator || null)
    }
  }

  const handleDecideLater = () => {
    if (!currentCreator || activeTab !== "all") return

    setCreators((prev) => ({
      ...prev,
      all: prev.all.filter((c) => c.id !== currentCreator.id),
      decideLater: [...prev.decideLater, currentCreator],
    }))

    // Find next creator
    const nextCreator = creators.all.find((c) => c.id !== currentCreator.id)
    setCurrentCreator(nextCreator || null)
  }

  const handleStartCampaign = () => {
    const campaigns = JSON.parse(localStorage.getItem("campaigns")) || []
    const campaignIndex = campaigns.findIndex((c) => c.id === campaignId)

    if (campaignIndex !== -1) {
      campaigns[campaignIndex].creators = creators.shortlisted
      campaigns[campaignIndex].status = "Script Confirmation"
      localStorage.setItem("campaigns", JSON.stringify(campaigns))
    }

    navigate(`/campaign`)
  }

  useEffect(() => {
    // Update current creator when tab changes
    if (activeTab === "all" && creators.all.length > 0) {
      setCurrentCreator(creators.all[0])
    } else if (activeTab === "decideLater" && creators.decideLater.length > 0) {
      setCurrentCreator(creators.decideLater[0])
    } else if (activeTab === "shortlisted" && creators.shortlisted.length > 0) {
      setCurrentCreator(creators.shortlisted[0])
    } else {
      setCurrentCreator(null)
    }
  }, [activeTab, creators])

  // Get action label based on swipe direction or slider position
  const getActionLabel = () => {
    if (swipeDirection === "left" || sliderPosition < 33) {
      return "REJECT"
    } else if (swipeDirection === "right" || sliderPosition > 66) {
      return "SHORTLIST"
    } else {
      return "DECIDE LATER"
    }
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

      {/* Action Label */}
      {(activeTab === "all" || activeTab === "decideLater") && currentCreator && (
        <div className="text-center py-2">
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              getActionLabel() === "REJECT"
                ? "bg-red-100 text-red-600"
                : getActionLabel() === "SHORTLIST"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {getActionLabel()}
          </span>
        </div>
      )}

      {/* Creator Cards */}
      <div className="p-4 h-[calc(100vh-250px)] flex items-center justify-center">
        <AnimatePresence>
          {currentCreator ? (
            <motion.div
              key={currentCreator.id}
              ref={cardRef}
              {...swipeHandlers}
              className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-sm relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: swipeDirection === "left" ? -50 : swipeDirection === "right" ? 50 : 0,
                rotate: swipeDirection === "left" ? -5 : swipeDirection === "right" ? 5 : 0,
                boxShadow: swipeDirection
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              exit={{
                opacity: 0,
                x: swipeDirection === "left" ? -200 : swipeDirection === "right" ? 200 : 0,
                scale: 0.8,
                transition: { duration: 0.3 },
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Swipe Overlay */}
              {swipeDirection && (
                <div
                  className={`absolute inset-0 flex items-center justify-center z-10 rounded-xl ${
                    swipeDirection === "left" ? "bg-red-500/30" : "bg-green-500/30"
                  }`}
                >
                  <div
                    className={`text-4xl font-bold ${
                      swipeDirection === "left" ? "text-white rotate-12" : "text-white -rotate-12"
                    }`}
                  >
                    {swipeDirection === "left" ? "REJECT" : "SHORTLIST"}
                  </div>
                </div>
              )}

              <img
                src={currentCreator.image || "/placeholder.svg"}
                alt={currentCreator.name}
                className="w-full h-96 object-cover"
              />
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">{currentCreator.name}</h3>
                  <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-full">{currentCreator.views}</span>
                </div>
                <p className="text-gray-600 mb-1">{currentCreator.location}</p>
                <p className="text-sm text-gray-500">Average Views</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 bg-white p-8 rounded-xl shadow-sm">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
              <p className="text-lg font-medium">No creators in this section</p>
              {activeTab === "all" && <p className="text-sm text-gray-400 mt-2">All creators have been reviewed</p>}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Slider for All and Decide Later tabs */}
      {(activeTab === "all" || activeTab === "decideLater") && currentCreator && (
        <div className="fixed bottom-8 left-4 right-4">
          <div
            ref={sliderRef}
            className="h-16 rounded-full overflow-hidden relative cursor-pointer shadow-md"
            onMouseDown={handleSliderChange}
            onTouchStart={handleSliderChange}
            onMouseUp={handleSliderRelease}
            onTouchEnd={handleSliderRelease}
          >
            {/* Gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to right, #FF4B4B, #FF8800 33%, #FFB800 50%, #88C34A 66%, #12766A)",
              }}
            ></div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-24 bg-white rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2 transition-all duration-200"
              style={{
                left: `${sliderPosition}%`,
                backgroundColor: sliderPosition < 33 ? "#FF4B4B" : sliderPosition > 66 ? "#12766A" : "#FFB800",
              }}
            >
              {sliderPosition < 33 ? (
                <span className="text-white text-xl">✕</span>
              ) : sliderPosition > 66 ? (
                <span className="text-white text-xl">✓</span>
              ) : (
                <span className="text-white text-xl">?</span>
              )}
            </div>

            {/* Labels */}
            <div className="absolute inset-0 flex text-white font-medium">
              <div className="flex-1 flex items-center justify-center">REJECT</div>
              <div className="flex-1 flex items-center justify-center">DECIDE LATER</div>
              <div className="flex-1 flex items-center justify-center">SHORTLIST</div>
            </div>
          </div>
        </div>
      )}

      {/* Start Campaign Button */}
      {activeTab === "shortlisted" && creators.shortlisted.length > 0 && (
        <div className="fixed bottom-8 left-4 right-4">
          <button
            onClick={handleStartCampaign}
            className="w-full bg-[#E5F0EE] text-[#12766A] font-medium py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            Start campaign
          </button>
        </div>
      )}
    </div>
  )
}

export default CreatorSelection

