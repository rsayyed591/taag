"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User as UserIcon, Building2, Users, Lock, HelpCircle } from "lucide-react"
import BottomNavigation from "../../components/BottomNavigation"

function Profile() {
  const user = JSON.parse(localStorage.getItem("userData")) || {};
  const navigate = useNavigate();
  const [showSpotlight, setShowSpotlight] = useState(false);

  const [userData, setUserData] = useState({
    name: user?.creatorDetails?.name || "Anonymous",
    username: user?.creatorDetails?.instagram?.url || "@aashna23.s",
    avatar: "/icons/profile.svg",
    coverImage: "/profile-bg.svg",
  });

  useEffect(() => {
    const hasSeenSpotlight = localStorage.getItem("hasSeenProfileSpotlight");
    if (!hasSeenSpotlight) {
      setShowSpotlight(true);
      localStorage.setItem("hasSeenProfileSpotlight", "true");
    }

    const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};
    if (storedUserData.creatorDetails) {
      setUserData({
        name: storedUserData.creatorDetails.name || "Anonymous",
        username: storedUserData.creatorDetails.instagram?.url || "@aashna23.s",
        avatar: "/icons/profile.svg",
        coverImage: "/profile-bg.svg",
      });
    }
  }, []);

  const menuItems = [
    { icon: <UserIcon className="w-5 h-5" />, label: "Creator Details", path: "/profile/creator-details" },
    { icon: <Building2 className="w-5 h-5" />, label: "Invoice/Bank Details", path: "/profile/bank-details" },
    { icon: <Users className="w-5 h-5" />, label: "Add/Remove Managers", path: "/profile/managers" },
    { icon: <Lock className="w-5 h-5" />, label: "Reset Password", path: "/profile/reset-password" },
    { icon: <HelpCircle className="w-5 h-5" />, label: "FAQs", path: "/profile/faqs" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-200">
        <img src={userData.coverImage} alt="Cover" className="w-full h-full object-cover" />

        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-4">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
            <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 px-4">
        <h1 className="text-2xl font-semibold">{userData.name}</h1>
        <p className="text-[#12766A]">{userData.username}</p>
      </div>

      {/* Menu Items */}
      <div className="px-2 mt-3 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-1 p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50"
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="sub-header2">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Spotlight Overlay */}
      {showSpotlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-4 max-w-xs">
            <h3 className="text-lg font-medium mb-2">Complete Your Profile</h3>
            <p className="text-gray-600 mb-4">Don't forget to add your bank details to receive payments</p>
            <button onClick={() => setShowSpotlight(false)} className="w-full py-2 bg-[#12766A] text-white rounded-md">
              Got it
            </button>
          </div>
        </div>
      )}

      <BottomNavigation activeTab="profile" />
    </div>
  );
}

export default Profile;
