import { IonAlert } from "@ionic/react"
import { Building2, Camera, ChevronDown, HelpCircle, Lock, LogOut, User, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BottomNavigation from "../../components/BottomNavigation"

function Profile() {
  const navigate = useNavigate()
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [profiles, setProfiles] = useState([])
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showProfileList, setShowProfileList] = useState(false)
  const [showImageOptions, setShowImageOptions] = useState(null) // 'avatar' or 'cover' or null

  useEffect(() => {
    const storedProfiles = JSON.parse(localStorage.getItem("userProfiles")) || []
    setProfiles(storedProfiles)

    const activeProfileId = localStorage.getItem("activeProfileId")

    if (activeProfileId) {
      const activeProfile = storedProfiles.find((profile) => String(profile.id) === String(activeProfileId))
      setSelectedProfile(activeProfile || storedProfiles[0])
    } else if (storedProfiles.length > 0) {
      setSelectedProfile(storedProfiles[0])
      localStorage.setItem("activeProfileId", storedProfiles[0].id)
    }

    const hasSeenSpotlight = localStorage.getItem("hasSeenProfileSpotlight")
    if (!hasSeenSpotlight) {
      setShowSpotlight(true)
    }
  }, [])

  const switchProfile = (profile) => {
    setSelectedProfile(profile)
    localStorage.setItem("activeProfileId", profile.id)
    setShowProfileList(false)
  }

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const updatedProfile = { ...selectedProfile }

      if (type === "avatar") {
        updatedProfile.avatar = reader.result
      } else if (type === "cover") {
        updatedProfile.coverImage = reader.result
      }

      // Update the profile in state
      setSelectedProfile(updatedProfile)

      // Update the profile in localStorage
      const updatedProfiles = profiles.map((profile) =>
        String(profile.id) === String(selectedProfile.id) ? updatedProfile : profile,
      )

      setProfiles(updatedProfiles)
      localStorage.setItem("userProfiles", JSON.stringify(updatedProfiles))

      // Close the image options
      setShowImageOptions(null)
    }

    reader.readAsDataURL(file)
  }

  const menuItems = [
    { icon: <User className="w-5 h-5" />, label: "Creator Details", path: "/profile/creator-details" },
    { icon: <Building2 className="w-5 h-5" />, label: "Invoice/Bank Details", path: "/profile/bank-details" },
    { icon: <Users className="w-5 h-5" />, label: "Add/Remove Managers", path: "/profile/managers" },
    { icon: <Lock className="w-5 h-5" />, label: "Reset Password", path: "/profile/reset-password" },
    { icon: <HelpCircle className="w-5 h-5" />, label: "FAQs", path: "/profile/faqs" },
  ]

  const handleSignOut = () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    navigate('/');
  };

  if (!selectedProfile) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-[#F2F1F1] pb-20">
      {/* Cover Image with Edit Button */}
      <div className="relative h-48 bg-gray-200">
        <img src={selectedProfile.coverImage || "/profile-bg.svg"} alt="Cover" className="w-full h-full object-cover" />

        <button
          onClick={() => setShowImageOptions("cover")}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
        >
          <Camera className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Profile Picture with Edit Button */}
      <div className="relative -mt-16 ml-4">
        <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
          <img
            src={selectedProfile.avatar || "/icons/profile.svg"}
            alt={selectedProfile.creatorDetails.name}
            className="w-full h-full object-cover"
          />
          <button
          onClick={() => setShowImageOptions("avatar")}
          className="absolute bottom-0 left-0 bg-white p-2 rounded-full shadow-md"
        >
          <Camera className="w-5 h-5 text-gray-700" />
        </button>
        </div>

        
      </div>

      {/* Profile Info */}
      <div className="mt-1 px-4">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <h1 className="header truncate min-w-0">
            {selectedProfile.creatorDetails.name || "Anonymous"}
          </h1>
          <button
            onClick={() => setShowProfileList(!showProfileList)}
            className="sub-header2 flex items-center text-[#12766A] bg-[#12766A10] px-3 py-1.5 rounded-full whitespace-nowrap"
          >
            Switch Profile
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>
        <p className="text-[#12766A]">{selectedProfile.creatorDetails.instagram.url || "@anonymous"}</p>
      </div>


      {/* Profile List Dropdown */}
      {showProfileList && (
        <div className="fixed top-52 right-4 bg-white rounded-lg shadow-lg z-50 p-2 w-48">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => switchProfile(profile)}
              className={`w-full text-left p-2 rounded flex items-center gap-2 ${
                String(profile.id) === String(selectedProfile.id)
                  ? "bg-[#12766A10] text-[#12766A]"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={profile.avatar || "/icons/profile.svg"}
                  alt={profile.creatorDetails.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="sub-header2">{profile.creatorDetails.name || "Anonymous"}</span>
            </button>
          ))}

          <div className="border-t mt-2 pt-2">
            <button
              onClick={() => {
                navigate("/");
              }}
              className="w-full text-left p-2 text-[#12766A] hover:bg-gray-100 rounded flex items-center gap-2"
            >
              <span className="text-xl font-bold">+</span>
              <span>Add New Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="mt-3">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className=" w-full flex items-center gap-3 p-4 border-[#EAEAEA] border-y-2"
            onClick={() => navigate(item.path)}
          >
            <div className="text-[#12766A]">{item.icon}</div>
            <span className="text-[#1D1D1F]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Image Upload Options */}
      {showImageOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-xs">
            <h3 className="text-lg font-medium mb-4">
              Change {showImageOptions === "avatar" ? "Profile Picture" : "Cover Image"}
            </h3>

            <div className="space-y-3">
              <label className="block w-full py-2 px-4 bg-[#12766A] text-white rounded-md text-center cursor-pointer">
                Upload from Gallery
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, showImageOptions)}
                />
              </label>

              <button
                onClick={() => setShowImageOptions(null)}
                className="block w-full py-2 px-4 border border-gray-300 rounded-md text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spotlight Alert */}
      <IonAlert
        isOpen={showSpotlight}
        header="Complete Your Profile"
        message="Don't forget to add your bank details to receive payments"
        buttons={[
          {
            text: "Got it",
            handler: () => {
              setShowSpotlight(false)
              localStorage.setItem("hasSeenProfileSpotlight", "true")
            },
          },
        ]}
        onDidDismiss={() => {
          setShowSpotlight(false)
          localStorage.setItem("hasSeenProfileSpotlight", "true")
        }}
      />

<div className="px-6 mt-0">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-medium py-3.5 rounded-full hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  )
}

export default Profile

