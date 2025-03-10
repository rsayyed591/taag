import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { IonAlert } from "@ionic/react"
import SearchBar from "../../components/SearchBar"
import ChatList from "./ChatList"
import EmptyState from "../../components/EmptyState"
import BottomNavigation from "../../components/BottomNavigation"

function Home() {
  const navigate = useNavigate()
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0)
  const [filter, setFilter] = useState("all")
  const [chats, setChats] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadChats()
    checkOnboardingStatus()
  }, [])

  const loadChats = () => {
    // Get chat history from localStorage
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}")

    // Convert chat history to array format with additional metadata
    const chatArray = Object.keys(chatHistory).map((chatName) => {
      const messages = chatHistory[chatName] || []
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null
      const unreadCount = messages.filter((msg) => msg.sender !== "me" && !msg.read).length

      return {
        id: chatName,
        name: chatName,
        lastMessage: lastMessage,
        unread: unreadCount,
        messages: messages,
      }
    })

    // If no chats in localStorage, use demo data
    if (chatArray.length === 0) {
      const demoChats = [
        {
          id: "MamaEarth",
          name: "MamaEarth",
          lastMessage: {
            type: "text",
            content: "We'd like to discuss a new campaign",
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            sender: "other",
          },
          unread: 2,
        },
        {
          id: "Nykaa",
          name: "Nykaa",
          lastMessage: {
            type: "text",
            content: "Thanks for sending the invoice!",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            sender: "other",
          },
          unread: 0,
        },
        {
          id: "Adidas",
          name: "Adidas",
          lastMessage: {
            type: "text",
            content: "Let me check and get back to you",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            sender: "me",
            status: "read",
          },
          unread: 0,
        },
        {
          id: "Nike",
          name: "Nike",
          lastMessage: {
            type: "invoice",
            content: "Invoice for Nike Campaign",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            sender: "me",
            status: "delivered",
          },
          unread: 0,
        },
      ]

      setChats(demoChats)

      // Save demo chats to localStorage
      const demoChatHistory = {}
      demoChats.forEach((chat) => {
        if (chat.lastMessage) {
          demoChatHistory[chat.name] = [chat.lastMessage]
        }
      })

      localStorage.setItem("chatHistory", JSON.stringify(demoChatHistory))
      localStorage.setItem("chats", JSON.stringify(demoChats))
    } else {
      // Sort chats by last message timestamp (most recent first)
      chatArray.sort((a, b) => {
        const timeA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0
        const timeB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0
        return timeB - timeA
      })

      setChats(chatArray)
    }
  }

  const checkOnboardingStatus = () => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenHomeOnboarding")
    if (hasSeenOnboarding) {
      setShowOnboarding(false)
    }
  }

  const onboardingSteps = [
    {
      title: "Welcome to Chats",
      description: "This is where you can communicate with companies and manage your conversations.",
      position: { top: "50%", left: "10%" },
    },
    {
      title: "Search & Filter",
      description: "Find specific chats or filter by status to stay organized.",
      position: { top: "80px", left: "20px" },
    },
    {
      title: "Navigation",
      description: "Access different sections of the app using the bottom navigation.",
      position: { bottom: "80px", left: "20px" },
    },
  ]

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleCompleteOnboarding = () => {
    setCurrentOnboardingStep((prevStep) => {
      const nextStep = prevStep + 1
      if (nextStep >= onboardingSteps.length) {
        setShowOnboarding(false)
        localStorage.setItem("hasSeenHomeOnboarding", "true")
        return 0
      }
      return nextStep
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {showOnboarding && (
        <IonAlert
          isOpen={true}
          header={onboardingSteps[currentOnboardingStep].title}
          message={onboardingSteps[currentOnboardingStep].description}
          buttons={[
            {
              text: currentOnboardingStep === onboardingSteps.length - 1 ? "Finish" : "Next",
              handler: handleCompleteOnboarding,
            },
          ]}
        />
      )}

      <div className="px-4 py-6 md:px-8 md:py-12">
        <h1 className="text-2xl font-bold mb-4">Chats</h1>

        <SearchBar onSearch={handleSearch} onFilter={() => console.log("Filter clicked")} />

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1 rounded-full text-sm ${
              filter === "all" ? "bg-[#12766A10] text-[#12766A]" : "bg-[#EAEAEA] text-[#979797]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-1 rounded-full text-sm ${
              filter === "unread" ? "bg-[#12766A10] text-[#12766A]" : "bg-[#EAEAEA] text-[#979797]"
            }`}
          >
            Unread
          </button>
        </div>

        {filteredChats.length > 0 ? (
          <ChatList chats={filteredChats} filter={filter} />
        ) : (
          <EmptyState type="chat" onNext={() => console.log("Create new chat")} />
        )}
      </div>

      <BottomNavigation activeTab="home" />
    </div>
  )
}

export default Home

