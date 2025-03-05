import { useState } from "react"
import SearchBar from "../../components/SearchBar"
import ChatList from "./ChatList"
import EmptyState from "../../components/EmptyState"
import OnboardingSpotlight from "../../components/OnboardingSpotlight"
import BottomNavigation from "../../components/BottomNavigation"

function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [filter, setFilter] = useState("all")
  const [hasChats, setHasChats] = useState(false)

  const onboardingSteps = [
    {
      title: "Welcome to Chats",
      description: "This is where you can communicate with companies.",
      position: { top: "50%", left: "10%" },
    },
    {
      title: "Search & Filter",
      description: "Find specific chats or filter by status.",
      position: { top: "80px", left: "20px" },
    },
    {
      title: "Navigation",
      description: "Access different sections of the app.",
      position: { bottom: "80px", left: "20px" },
    },
  ]

  // Sample chat data
  const chats = [
    {
      id: 1,
      name: "MamaEarth",
      message: "The shoot can take place on the 7th",
      time: "2h",
      unread: true,
    },
    {
      id: 2,
      name: "Tusta",
      message: "The charts are ready!",
      time: "12h",
      unread: false,
    },
    {
      id: 3,
      name: "Taag",
      message: "The meetign is scheduled for tomorrow",
      time: "22h",
      unread: false,
    },
    {
      id: 4,
      name: "Amazon",
      message: "The order has been dispatched",
      time: "22h",
      unread: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {showOnboarding && <OnboardingSpotlight steps={onboardingSteps} onComplete={() => setShowOnboarding(false)} />}

      <div className="px-4 py-6 md:px-8 md:py-12">
        <h1 className="header mb-2">Chats</h1>

        <SearchBar onSearch={(term) => console.log("Search:", term)} onFilter={() => console.log("Filter clicked")} />

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1 rounded-full text-sm ${
              filter === "all" ? "bg-[#2dd4bf] text-[#12766A]" : "bg-[#EAEAEA] text-[#979797]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-1 rounded-full text-sm ${
              filter === "unread" ? "bg-[#2dd4bf] text-[#12766A]" : "bg-[#EAEAEA] text-[#979797]"
            }`}
          >
            Unread
          </button>
        </div>

        {hasChats ? (
          <ChatList chats={chats} filter={filter} />
        ) : (
          <EmptyState type="chat" onNext={() => setHasChats(true)} />
        )}
      </div>

      <BottomNavigation activeTab="home" />
    </div>
  )
}

export default Home

