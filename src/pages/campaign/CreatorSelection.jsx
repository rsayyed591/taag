import { useState, useRef, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useSwipeable } from "react-swipeable"
import { ChevronLeft, ChevronRight, Table, Layout, X, Check, Clock } from "lucide-react"

function CreatorSelection() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState("card") // "card" or "table"
  const [sliderPosition, setSliderPosition] = useState(38)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [currentCreator, setCurrentCreator] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [creators, setCreators] = useState({
    all: [],
    decideLater: [],
    shortlisted: [],
    rejected: [],
  })
  const [selectedCreators, setSelectedCreators] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)

  useEffect(() => {
    // Load creators from localStorage or use demo data
    const campaigns = JSON.parse(localStorage.getItem("campaigns")) || []
    const foundCampaign = campaigns.find((c) => c.id === campaignId)

    // Get userProfiles from localStorage
    const storedProfiles = JSON.parse(localStorage.getItem("userProfiles")) || []

    // Filter users where userType is "Creator"
    const filteredCreators = storedProfiles
      .filter((user) => user.userType === "Creator")
      .map((user) => ({
        id: user.id,
        name: user.creatorDetails?.name || user.name,
        location: user.location || "Unknown Location",
        views: user.views || "0K",
        image: user.avatar || "/placeholder.svg",
        link: "#",
        deliverables: "2 IG Reels, 1 YT Video",
      }))

    setCreators((prev) => ({ ...prev, all: filteredCreators }))
    if (filteredCreators.length > 0) {
      setCurrentCreator(filteredCreators[0])
    }
  }, [campaignId])

  const cardRef = useRef(null)
  const sliderRef = useRef(null)

  // Improved swipe handlers for smoother experience
  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      if (activeTab === "shortlisted" || activeTab === "rejected") return

      const { deltaX } = eventData
      setIsDragging(true)

      // Update card position and rotation based on swipe
      if (cardRef.current) {
        const translateX = deltaX
        const rotate = deltaX * 0.05
        cardRef.current.style.transform = `translateX(${translateX}px) rotate(${rotate}deg)`
      }

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
      if (activeTab === "shortlisted" || activeTab === "rejected") return

      const { deltaX } = eventData
      setIsDragging(false)

      // Reset card position
      if (cardRef.current) {
        cardRef.current.style.transform = ""
      }

      // Handle swipe actions based on distance
      if (deltaX > 100) {
        handleShortlist()
      } else if (deltaX < -100) {
        handleReject()
      } else if (Math.abs(deltaX) < 50 && activeTab === "all") {
        handleDecideLater()
      }

      // Reset states
      setSliderPosition(38)
      setSwipeDirection(null)
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
    delta: 10,
  })

  // Carousel navigation for shortlisted/rejected views
  const handlePrevious = () => {
    if (!creators[activeTab] || creators[activeTab].length === 0) return

    const currentArray = creators[activeTab]
    const newIndex = currentIndex > 0 ? currentIndex - 1 : currentArray.length - 1
    setCurrentIndex(newIndex)
    setCurrentCreator(currentArray[newIndex])
  }

  const handleNext = () => {
    if (!creators[activeTab] || creators[activeTab].length === 0) return

    const currentArray = creators[activeTab]
    const newIndex = currentIndex < currentArray.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
    setCurrentCreator(currentArray[newIndex])
  }

  // Table view handlers
  const handleCheckboxChange = (creatorId) => {
    setSelectedCreators((prev) =>
      prev.includes(creatorId) ? prev.filter((id) => id !== creatorId) : [...prev, creatorId],
    )
  }

  // Action handlers for moving creators between sections
  const handleReject = (specificCreator = null) => {
    const creatorToMove = specificCreator || currentCreator
    if (!creatorToMove) return

    if (activeTab === "all") {
      setCreators((prev) => {
        const updatedAll = prev.all.filter((c) => c.id !== creatorToMove.id)
        const nextCreator = updatedAll.length > 0 ? updatedAll[0] : null

        // Set next creator immediately to prevent UI glitches
        if (nextCreator) {
          setTimeout(() => setCurrentCreator(nextCreator), 10)
        }

        return {
          ...prev,
          all: updatedAll,
          rejected: [...prev.rejected, creatorToMove],
        }
      })
    } else if (activeTab === "decideLater") {
      setCreators((prev) => {
        const updatedDecideLater = prev.decideLater.filter((c) => c.id !== creatorToMove.id)
        const nextCreator = updatedDecideLater.length > 0 ? updatedDecideLater[0] : null

        // Set next creator immediately to prevent UI glitches
        if (nextCreator) {
          setTimeout(() => setCurrentCreator(nextCreator), 10)
        }

        return {
          ...prev,
          decideLater: updatedDecideLater,
          rejected: [...prev.rejected, creatorToMove],
        }
      })
    } else if (activeTab === "shortlisted") {
      setCreators((prev) => {
        const updatedShortlisted = prev.shortlisted.filter((c) => c.id !== creatorToMove.id)
        const nextCreator = updatedShortlisted.length > 0 ? updatedShortlisted[0] : null

        // Set next creator immediately to prevent UI glitches
        if (nextCreator) {
          setTimeout(() => setCurrentCreator(nextCreator), 10)
        }

        return {
          ...prev,
          shortlisted: updatedShortlisted,
          rejected: [...prev.rejected, creatorToMove],
        }
      })
    }
  }

  const handleShortlist = (specificCreator = null) => {
    const creatorToMove = specificCreator || currentCreator
    if (!creatorToMove) return

    if (activeTab === "all") {
      setCreators((prev) => {
        const updatedAll = prev.all.filter((c) => c.id !== creatorToMove.id)
        const nextCreator = updatedAll.length > 0 ? updatedAll[0] : null

        // Set next creator immediately to prevent UI glitches
        if (nextCreator) {
          setTimeout(() => setCurrentCreator(nextCreator), 10)
        }

        return {
          ...prev,
          all: updatedAll,
          shortlisted: [...prev.shortlisted, creatorToMove],
        }
      })
    } else if (activeTab === "decideLater") {
      setCreators((prev) => {
        const updatedDecideLater = prev.decideLater.filter((c) => c.id !== creatorToMove.id)
        const nextCreator = updatedDecideLater.length > 0 ? updatedDecideLater[0] : null

        // Set next creator immediately to prevent UI glitches
        if (nextCreator) {
          setTimeout(() => setCurrentCreator(nextCreator), 10)
        }

        return {
          ...prev,
          decideLater: updatedDecideLater,
          shortlisted: [...prev.shortlisted, creatorToMove],
        }
      })
    } else if (activeTab === "rejected") {
      setCreators((prev) => {
        const updatedRejected = prev.rejected.filter((c) => c.id !== creatorToMove.id)
        const nextCreator = updatedRejected.length > 0 ? updatedRejected[0] : null

        // Set next creator immediately to prevent UI glitches
        if (nextCreator) {
          setTimeout(() => setCurrentCreator(nextCreator), 10)
        }

        return {
          ...prev,
          rejected: updatedRejected,
          shortlisted: [...prev.shortlisted, creatorToMove],
        }
      })
    }
  }

  const handleDecideLater = (specificCreator = null) => {
    const creatorToMove = specificCreator || currentCreator
    if (!creatorToMove || activeTab === "decideLater") return

    setCreators((prev) => {
      const updatedTab = prev[activeTab].filter((c) => c.id !== creatorToMove.id)
      const nextCreator = updatedTab.length > 0 ? updatedTab[0] : null

      // Set next creator immediately to prevent UI glitches
      if (nextCreator) {
        setTimeout(() => setCurrentCreator(nextCreator), 10)
      }

      return {
        ...prev,
        [activeTab]: updatedTab,
        decideLater: [...prev.decideLater, creatorToMove],
      }
    })
  }

  // Handle slider interactions
  const handleSliderChange = (e) => {
    if (!sliderRef.current) return

    const sliderWidth = sliderRef.current.offsetWidth
    const clickX = e.clientX || e.touches?.[0]?.clientX || 0
    const sliderRect = sliderRef.current.getBoundingClientRect()
    const relativeX = clickX - sliderRect.left
    const newPosition = Math.max(0, Math.min(100, (relativeX / sliderWidth) * 100))

    if (Math.abs(newPosition - sliderPosition) > 1) { // Only update if moved significantly
      setSliderPosition(newPosition)
    }
    setDragStartX(clickX)
    setIsDragging(true)

    // Update swipe direction for visual feedback
    if (newPosition > 66) {
      setSwipeDirection("right")
    } else if (newPosition < 33) {
      setSwipeDirection("left")
    } else {
      setSwipeDirection(null)
    }
  }

  const handleSliderDrag = (e) => {
    if (!isDragging || !sliderRef.current) return

    const clickX = e.clientX || e.touches?.[0]?.clientX || 0
    const sliderWidth = sliderRef.current.offsetWidth
    const sliderRect = sliderRef.current.getBoundingClientRect()
    const relativeX = clickX - sliderRect.left
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
    if (!isDragging) return;
  
    setIsDragging(false);
  
    // Only trigger action if slider moved significantly
    const dragDistance = Math.abs(sliderPosition - 50);
    let action = null;
  
    if (dragDistance > 15) {
      if (sliderPosition < 20) {
        setSwipeDirection("left"); // Keep red color
        action = handleReject;
      } else if (sliderPosition > 53) {
        setSwipeDirection("right"); // Keep green color
        action = handleShortlist;
      } else if (activeTab === "all") {
        setSwipeDirection(null);
        action = handleDecideLater;
      }
  
      if (action) {
        // Keep the card and overlay visible for 1 second before updating the state
        setTimeout(() => {
          action();
          setSwipeDirection(null); // Remove overlay after card disappears
        }, 600);
      }
    }
  
    // Reset slider position
    setSliderPosition(38);
  };
  

  // Start campaign with shortlisted creators
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

  // Handle bulk actions in table view
  const handleBulkAction = (action) => {
    if (selectedCreators.length === 0) return

    // Process each selected creator
    selectedCreators.forEach((creatorId) => {
      const creator = creators[activeTab].find((c) => c.id === creatorId)
      if (creator) {
        if (action === "shortlist") {
          handleShortlist(creator)
        } else if (action === "reject") {
          handleReject(creator)
        } else if (action === "decideLater") {
          handleDecideLater(creator)
        }
      }
    })

    // Clear selection after processing
    setSelectedCreators([])
  }
  const currentArray = useMemo(() => creators[activeTab] || [], [activeTab, creators])


  // Update current creator when tab changes
  useEffect(() => {
    if (currentArray.length > 0 && currentArray[0]?.id !== currentCreator?.id) {
      setCurrentCreator(currentArray[0])
      setCurrentIndex(0)
    }
  }, [currentArray, currentCreator])
  

  // Card View Component
  const CardView = () => (
    <div className="py-4 px-4 h-[calc(100vh-240px)] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {creators[activeTab]?.length > 0 && currentCreator ? (
          <div className="relative w-full max-w-sm">
            {/* Carousel Navigation for Shortlisted/Rejected */}
            {(activeTab === "shortlisted" || activeTab === "rejected") && creators[activeTab].length > 1 && (
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 z-10">
                <button
                  onClick={handlePrevious}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 focus:outline-none"
                  aria-label="Previous creator"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 focus:outline-none"
                  aria-label="Next creator"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

<motion.div
  key={currentCreator?.id}
  ref={cardRef}
  {...(activeTab !== "shortlisted" && activeTab !== "rejected" ? swipeHandlers : {})}
  className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-sm relative"
  initial={{ opacity: 1, scale: 1 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.5, delay: 0.7 }, // Delay exit animation for 1 second
  }}
  transition={{ duration: 0.2 }}
>
  {/* Swipe Overlay - Keeps the color for 1 second */}
  {swipeDirection && (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center z-10 rounded-xl ${
        swipeDirection === "left" ? "bg-red-500/30" : "bg-green-500/30"
      }`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.3, delay: 0.7 }, // Delay removal for 1 sec
      }}
    >
      <motion.div
        className={`text-4xl font-bold ${
          swipeDirection === "left" ? "text-white rotate-12" : "text-white -rotate-12"
        }`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          transition: { duration: 0.3, delay: 0.7 },
        }}
      >
        {swipeDirection === "left" ? "REJECT" : "SHORTLIST"}
      </motion.div>
    </motion.div>
  )}

  <img
    src={currentCreator.image || "/placeholder.svg?height=400&width=400"}
    alt={currentCreator.name}
    className="w-full h-52 object-cover"
  />
  <div className="p-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold">{currentCreator.name}</h3>
      <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-full">{currentCreator.views}</span>
    </div>
    <p className="text-gray-600 mb-1">{currentCreator.location}</p>
    <p className="text-sm text-gray-500">Average Views</p>
    {/* Action Buttons for Shortlisted/Rejected Views */}
    {activeTab === "shortlisted" && (
                  <button
                    onClick={() => handleReject()}
                    className="mt-4 w-full bg-red-100 text-red-600 py-2 rounded-lg font-medium"
                  >
                    Remove from Shortlist
                  </button>
                )}
                {activeTab === "rejected" && (
                  <button
                    onClick={() => handleDecideLater()}
                    className="mt-4 w-full bg-yellow-100 text-yellow-600 py-2 rounded-lg font-medium"
                  >
                    Send to Decide Later
                  </button>
                )}
  </div>
</motion.div>


            {/* Pagination indicator for carousel */}
            {(activeTab === "shortlisted" || activeTab === "rejected") && creators[activeTab].length > 1 && (
              <div className="flex justify-center mt-4 space-x-1">
                {creators[activeTab].map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-[#12766A]" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 bg-white p-8 rounded-xl shadow-sm">
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
              />
            </svg>
            <p className="text-lg font-medium">No creators in this section</p>
            <p className="text-sm text-gray-400 mt-2">
              {activeTab === "all"
                ? "All creators have been reviewed"
                : `No creators in ${activeTab.replace(/([A-Z])/g, " $1").toLowerCase()}`}
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  )

  // Table View Component - Optimized for mobile
  const TableView = () => (
    <div className="p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-3 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkAction("shortlist")}
                disabled={selectedCreators.length === 0}
                className={`flex items-center px-3 py-1 rounded-full text-xs sm:text-sm ${
                  selectedCreators.length > 0
                    ? "bg-green-100 text-green-600 hover:bg-green-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Shortlist
              </button>
              <button
                onClick={() => handleBulkAction("decideLater")}
                disabled={selectedCreators.length === 0}
                className={`flex items-center px-3 py-1 rounded-full text-xs sm:text-sm ${
                  selectedCreators.length > 0
                    ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Decide Later
              </button>
              <button
                onClick={() => handleBulkAction("reject")}
                disabled={selectedCreators.length === 0}
                className={`flex items-center px-3 py-1 rounded-full text-xs sm:text-sm ${
                  selectedCreators.length > 0
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Reject
              </button>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">{selectedCreators.length} selected</span>
          </div>
        </div>

        {/* Mobile-optimized table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-10 px-2 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedCreators.length === creators[activeTab].length && creators[activeTab].length > 0}
                    onChange={() => {
                      if (selectedCreators.length === creators[activeTab].length) {
                        setSelectedCreators([])
                      } else {
                        setSelectedCreators(creators[activeTab].map((c) => c.id))
                      }
                    }}
                  />
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Link
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Deliverables
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {creators[activeTab].length > 0 ? (
                creators[activeTab].map((creator) => (
                  <tr key={creator.id} className="hover:bg-gray-50">
                    <td className="px-2 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedCreators.includes(creator.id)}
                        onChange={() => handleCheckboxChange(creator.id)}
                      />
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={creator.image || "/placeholder.svg"}
                          alt=""
                        />
                        <div className="ml-2 sm:ml-3">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{creator.name}</div>
                          <div className="text-xs text-gray-500">{creator.views} views</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap hidden sm:table-cell">
                      <a href={creator.link} className="text-[#12766A] hover:underline text-xs sm:text-sm">
                        Click here
                      </a>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                      {creator.deliverables}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="flex space-x-1 sm:space-x-2">
                        {activeTab !== "shortlisted" && (
                          <button
                            onClick={() => handleShortlist(creator)}
                            className="text-green-600 hover:text-green-900 p-1"
                            aria-label="Shortlist"
                          >
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                        {activeTab !== "decideLater" && (
                          <button
                            onClick={() => handleDecideLater(creator)}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            aria-label="Decide Later"
                          >
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                        {activeTab !== "rejected" && (
                          <button
                            onClick={() => handleReject(creator)}
                            className="text-red-600 hover:text-red-900 p-1"
                            aria-label="Reject"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-2 py-8 text-center text-gray-500">
                    No creators in this section
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile-friendly action buttons for shortlisted view */}
        {activeTab === "shortlisted" && creators.shortlisted.length > 0 && (
          <div className="p-4 border-t">
            <button
              onClick={handleStartCampaign}
              className="w-full bg-[#E5F0EE] text-[#12766A] font-medium py-3 rounded-lg"
            >
              Start campaign
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-white border-b">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-2">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h1 className="text-lg sm:text-xl font-medium">Creator List</h1>
        </div>
        <button
          onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
          className="p-1 rounded-md hover:bg-gray-100"
          aria-label={viewMode === "card" ? "Switch to table view" : "Switch to card view"}
        >
          {viewMode === "card" ? (
            <Table className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Layout className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-3 sm:p-4 gap-2 overflow-x-auto">
        {[
          { id: "all", label: "All" },
          { id: "decideLater", label: "Decide Later" },
          { id: "shortlisted", label: "Shortlisted" },
          { id: "rejected", label: "Rejected" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setCurrentIndex(0)
              if (creators[tab.id].length > 0) {
                setCurrentCreator(creators[tab.id][0])
              }
            }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap ${
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

      {/* Main Content */}
      {viewMode === "card" ? <CardView /> : <TableView />}

      {/* Action Slider for Card View */}
      {viewMode === "card" && (activeTab === "all" || activeTab === "decideLater") && currentCreator && (
        <div className="fixed bottom-10 left-4 right-4">
          {/* Swipe hint animation */}
          <motion.div
            className="absolute -top-6 transform -translate-x-1/2 text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1, repeat: 3, repeatType: "reverse" }}
          >
            Swipe to select
          </motion.div>

          <div
            ref={sliderRef}
            className="h-14 sm:h-16 rounded-full overflow-hidden relative cursor-pointer shadow-md"
            onMouseDown={handleSliderChange}
            onTouchStart={handleSliderChange}
            onMouseMove={(e) => isDragging && handleSliderDrag(e)}
            onTouchMove={(e) => isDragging && handleSliderDrag(e)}
            onMouseUp={handleSliderRelease}
            onTouchEnd={handleSliderRelease}
            onMouseLeave={handleSliderRelease}
          >
            {/* Gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  activeTab === "decideLater"
                    ? "linear-gradient(to right, #FF4B4B 50%, #12766A 50%)"
                    : "linear-gradient(to right, #FF4B4B, #FF8800 33%, #FFB800 50%, #88C34A 66%, #12766A)",
              }}
            ></div>

            {/* Slider handle with pulse animation */}
            <motion.div
              className="absolute top-0 bottom-0 w-20 sm:w-24 bg-white rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2 transition-all duration-200"
              style={{
                left: `${sliderPosition}%`,
                backgroundColor: sliderPosition < 33 ? "#FF4B4B" : sliderPosition > 66 ? "#12766A" : "#FFB800",
              }}
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              {sliderPosition < 33 ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : sliderPosition > 66 ? (
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </motion.div>

            {/* Labels */}
            
          </div>
          <div className="absolute inset-0 top-16 flex text-black font-medium text-xs sm:text-sm">
              <div className="flex-1 flex items-center justify-center">REJECT</div>
              {activeTab === "all" && <div className="flex-1 flex items-center justify-center">DECIDE LATER</div>}
              <div className="flex-1 flex items-center justify-center">SHORTLIST</div>
            </div>
        </div>
      )}

      {/* Start Campaign Button */}
      {activeTab === "shortlisted" && creators.shortlisted.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4">
          <button
            onClick={handleStartCampaign}
            className="w-full bg-[#E5F0EE] text-[#12766A] font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            Start campaign
          </button>
        </div>
      )}
    </div>
  )
}

export default CreatorSelection

