"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import BottomNavigation from "../../components/BottomNavigation"
import OnboardingSpotlight from "../../components/OnboardingSpotlight"

function Campaign() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState([])
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [totalInProgress, setTotalInProgress] = useState(0)
  const [showSpotlight, setShowSpotlight] = useState(true)
  const [userType, setUserType] = useState("brand") // Default to brand
  const [campaignInvites, setCampaignInvites] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Get user type from localStorage
    const user = JSON.parse(localStorage.getItem("currentUser")) || { userType: "brand" }
    setUserType(user.userType)

    loadCampaigns()

    // If user is a creator, load campaign invites
    if (user.userType === "creator") {
      loadCampaignInvites(user)
    }
  }, [])

  const loadCampaigns = () => {
    const storedCampaigns = JSON.parse(localStorage.getItem("campaigns")) || []
    setCampaigns(storedCampaigns)

    // Calculate statistics
    const completed = storedCampaigns.filter((c) => c.status === "completed").length
    const inProgress = storedCampaigns.filter((c) => c.status !== "completed").length

    setTotalCompleted(completed)
    setTotalInProgress(inProgress)
  }

  const loadCampaignInvites = (user) => {
    const storedCampaigns = JSON.parse(localStorage.getItem("campaigns")) || []

    // Filter campaigns based on creator type matching or show all if no types defined
    const relevantCampaigns = user.creatorTypes?.length
      ? storedCampaigns.filter((campaign) => campaign.creatorTypes?.some((type) => user.creatorTypes.includes(type)))
      : storedCampaigns

    // Transform campaigns into invites
    const invites = relevantCampaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      brandName: campaign.brandName || "Brand Name",
      date: campaign.date,
      budget: campaign.budget || [25000, 50000],
      platform: campaign.platform || "instagram",
      status: "pending",
      creatorTypes: campaign.creatorTypes || [],
    }))

    setCampaignInvites(invites)
  }

  const handleInterested = (campaignId) => {
    // Update the campaign invite status
    setCampaignInvites((prev) =>
      prev.map((invite) => (invite.id === campaignId ? { ...invite, status: "interested" } : invite)),
    )

    // In a real app, this would send a notification to the brand
    // For now, we'll navigate to the chat
    navigate(`/chat/${campaignId}/Brand`)
  }

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredInvites = campaignInvites.filter((invite) =>
    invite.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const spotlightSteps = [
    {
      title: "Welcome to Campaigns",
      description: "Create and manage your campaigns on this page!",
    },
    {
      title: "Campaign Stats",
      description: "Track your completed and in-progress campaigns here.",
    },
    {
      title: "Create Campaign",
      description: "Click the + button to start a new campaign.",
    },
  ]

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
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name, amount, etc."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#12766A]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            ></path>
          </svg>
        </button>
      </div>

      {/* Campaign List */}
      {filteredCampaigns.length > 0 ? (
        <div className="space-y-3">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => navigate(`/campaign/view/${campaign.id}`)}
              className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{campaign.name}</h3>
                  <p className="text-sm text-gray-500">{campaign.creators?.length || 0} Creators</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      campaign.status === "Brand Confirmed" ? "text-[#12766A]" : "text-amber-500"
                    }`}
                  >
                    {campaign.status}
                  </p>
                  <p className="text-xs text-gray-500">{campaign.date}</p>
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
        <p className="text-sm text-gray-500 mb-1">Brand Name</p>
        <h2 className="text-lg font-medium">Campaigns</h2>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search campaigns"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#12766A]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            ></path>
          </svg>
        </button>
      </div>

      {filteredInvites.length > 0 ? (
        <div className="space-y-4">
          {filteredInvites.map((invite) => (
            <div key={invite.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{invite.name}</h3>
                  <span className="text-xs text-gray-500">{invite.date}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Platform: {invite.platform.charAt(0).toUpperCase() + invite.platform.slice(1)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Budget: ₹{invite.budget[0].toLocaleString()} - ₹{invite.budget[1].toLocaleString()}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {invite.creatorTypes.map((type) => (
                      <span key={type} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {invite.status === "pending" ? (
                  <button
                    onClick={() => handleInterested(invite.id)}
                    className="w-full mt-4 bg-[#E5F0EE] text-[#12766A] font-medium py-2 rounded-lg hover:bg-[#D5E8E5] transition-colors"
                  >
                    Interested
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/chat/${invite.id}/Brand`)}
                    className="w-full mt-4 bg-[#E5F0EE] text-[#12766A] font-medium py-2 rounded-lg hover:bg-[#D5E8E5] transition-colors"
                  >
                    View Chat
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
      {showSpotlight && <OnboardingSpotlight steps={spotlightSteps} onComplete={() => setShowSpotlight(false)} />}

      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Campaigns</h1>

        {userType === "brand" ? <BrandView /> : <CreatorView />}
      </div>

      <BottomNavigation />
    </div>
  )
}

export default Campaign

