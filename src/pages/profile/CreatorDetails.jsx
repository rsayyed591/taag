"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

function CreatorDetails() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("instagram")
  const [formData, setFormData] = useState({
    name: "",
    instagram: {
      url: "",
      views: "",
      reelCost: "",
    },
    youtube: {
      url: "",
      views: "",
      videoCost: "",
    },
    category: "",
    language: "",
    location: "",
  })

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("userData")) || {};
    if (savedData.creatorDetails) {
      setFormData(savedData.creatorDetails);
    }
  }, []);  

  const handleChange = (field, value, platform = null) => {
    if (platform) {
      setFormData((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSave = () => {
    const existingUserData = JSON.parse(localStorage.getItem("userData")) || {}; // Get userData
    existingUserData.creatorDetails = formData; // Update creatorDetails
  
    localStorage.setItem("userData", JSON.stringify(existingUserData)); // Save updated data
    navigate("/profile");
  };  

  const categories = ["Tech", "Entertainment", "Lifestyle", "Fashion", "Food", "Travel", "Gaming", "Education"]

  const languages = ["English", "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "Bengali", "Marathi"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-white">
        <button onClick={() => navigate("/profile")} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">Creator Details</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>

        {/* Platform Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("instagram")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "instagram" ? "bg-[#12766A10] text-[#12766A]" : "bg-gray-100"
            }`}
          >
            Instagram
          </button>
          <button
            onClick={() => setActiveTab("youtube")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "youtube" ? "bg-[#12766A10] text-[#12766A]" : "bg-gray-100"
            }`}
          >
            YouTube
          </button>
        </div>

        {/* Platform Fields */}
        {activeTab === "instagram" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagram.url}
                onChange={(e) => handleChange("url", e.target.value, "instagram")}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Avg. Instagram Views</label>
              <input
                type="number"
                value={formData.instagram.views}
                onChange={(e) => handleChange("views", e.target.value, "instagram")}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Instagram Reel Cost</label>
              <input
                type="number"
                value={formData.instagram.reelCost}
                onChange={(e) => handleChange("reelCost", e.target.value, "instagram")}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">YouTube URL</label>
              <input
                type="text"
                value={formData.youtube.url}
                onChange={(e) => handleChange("url", e.target.value, "youtube")}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Avg. YouTube Views</label>
              <input
                type="number"
                value={formData.youtube.views}
                onChange={(e) => handleChange("views", e.target.value, "youtube")}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">YouTube Video Cost</label>
              <input
                type="number"
                value={formData.youtube.videoCost}
                onChange={(e) => handleChange("videoCost", e.target.value, "youtube")}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">Language</label>
          <select
            value={formData.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
          >
            <option value="">Select Language</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>

        {/* Save Button */}
        <button onClick={handleSave} className="w-full py-3 bg-[#12766A] text-white rounded-full mt-6">
          Save Details
        </button>
      </div>
    </div>
  )
}

export default CreatorDetails

