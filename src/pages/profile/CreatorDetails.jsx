"use client"

import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createOrUpdateUserProfile, getUserProfile } from "../../services/userProfile"

function CreatorDetails() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("instagram")
  
  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
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
    category: [],
    language: "",
    location: "",
  })

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { success, profile } = await getUserProfile();
        if (success && profile.creatorDetails) {
          setFormData(profile.creatorDetails);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await createOrUpdateUserProfile({
        creatorDetails: {
          ...formData
        }
      });
      navigate("/profile");
    } catch (error) {
      console.error('Error updating categories:', error);
      alert('Error saving categories. Please try again.');
    }
  };

  const handleChange = (field, value, platform = null) => {
    setFormData((prev) => {
      if (field === "category") {
        const categories = Array.isArray(prev.category) ? prev.category : []; // Ensure it's an array
        return {
          ...prev,
          category: categories.includes(value)
            ? categories.filter((cat) => cat !== value) // Remove if already selected
            : [...categories, value], // Add if not selected
        };
      }
  
      if (platform) {
        return {
          ...prev,
          [platform]: {
            ...prev[platform],
            [field]: value,
          },
        };
      }
  
      return {
        ...prev,
        [field]: value,
      };
    });
  };
  

  const categories = [
    "Tech",
    "Entertainment",
    "Acting",
    "Comedy",
    "Standup",
    "Couple",
    "Gaming",
    "Sports",
    "Music",
    "Education",
    "Lifestyle",
    "Fitness",
  ];

  const languages = ["English", "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "Bengali", "Marathi"]

  return (
    <div className="min-h-screen bg-[#F2F1F1]">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-[#F2F1F1]">
  <button onClick={() => navigate("/profile")} className="inline-flex items-center p-2">
    <ArrowLeft className="w-5 h-5" />
  </button>
  <h1 className="text-lg font-manrope font-medium m-0">Creator Details</h1>
</div>


      <div className="p-4 space-y-6">
        {/* Name */}
        <div>
          <label className="text-sm text-[#6F6F6F] font-manrope block mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-[#6F6F6F] font-manrope block mb-1">Email</label>
          <input
            type="text"
            value={formData.emailId}
            onChange={(e) => handleChange("emailId", e.target.value)}
            className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
          />
        </div>

        {/* Platform Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("instagram")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "instagram" ? "bg-[#12766A] bg-opacity-10 text-[#12766A]" : "bg-[#EAEAEA]"
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
              <label className="text-sm text-[#6F6F6F] block mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagram.url}
                onChange={(e) => handleChange("url", e.target.value, "instagram")}
                className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
              />
            </div>
            <div>
              <label className="text-sm text-[#6F6F6F] block mb-1">Avg. Instagram Views</label>
              <input
                type="number"
                value={formData.instagram.views}
                onChange={(e) => handleChange("views", e.target.value, "instagram")}
                className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
              />
            </div>
            <div>
              <label className="text-sm text-[#6F6F6F] block mb-1">Instagram Reel Cost</label>
              <input
                type="number"
                value={formData.instagram.reelCost}
                onChange={(e) => handleChange("reelCost", e.target.value, "instagram")}
                className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#6F6F6F] block mb-1">YouTube URL</label>
              <input
                type="text"
                value={formData.youtube.url}
                onChange={(e) => handleChange("url", e.target.value, "youtube")}
                className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
              />
            </div>
            <div>
              <label className="text-sm text-[#6F6F6F] block mb-1">Avg. YouTube Views</label>
              <input
                type="number"
                value={formData.youtube.views}
                onChange={(e) => handleChange("views", e.target.value, "youtube")}
                className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
              />
            </div>
            <div>
              <label className="text-sm text-[#6F6F6F] block mb-1">YouTube Video Cost</label>
              <input
                type="number"
                value={formData.youtube.videoCost}
                onChange={(e) => handleChange("videoCost", e.target.value, "youtube")}
                className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
              />
            </div>
          </div>
        )}

        {/* Category */}
        <div className="w-full">
  <label className="text-sm text-[#6F6F6F] block mb-1">Category</label>
  <select
    value=""
    onChange={(e) => handleChange("category", e.target.value)}
    className="w-full p-2 border-[#D7D4D4] border-b rounded-md bg-[#F2F1F1] text-gray-700 
               focus:ring-2 focus:ring-[#12766A] focus:outline-none transition-all 
               sm:text-sm md:text-base"
  >
    <option value="" disabled>Select Category</option>
    {categories.map((category) => (
      <option key={category} value={category} className="p-2 text-gray-700 hover:bg-gray-100">
        {category}
      </option>
    ))}
  </select>

  {/* Display selected categories as a stacked list */}
  {formData.category?.length > 0 && (
    <div className="mt-2 flex flex-wrap gap-2">
      {formData.category.map((cat, index) => (
        <span
          key={index}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center gap-2"
        >
          {cat}
          <button
            onClick={() => handleChange("category", cat)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  )}
</div>

        {/* Language */}
        <div>
          <label className="text-sm text-[#6F6F6F] block mb-1">Language</label>
          <select
            value={formData.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
          >
            <option value="" className="w-10 h-10">Select Language</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm text-[#6F6F6F] block mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center px-6">
        <button className="btn-primary2 w-full max-w-xs mb-2" onClick={handleSave}>
          Save Details
        </button>
      </div>
      </div>
    </div>
  )
}

export default CreatorDetails

