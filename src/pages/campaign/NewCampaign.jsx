"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Range } from "react-range"
import { Calendar, ChevronDown } from "lucide-react"

function NewCampaign() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    platform: "instagram",
    instadeliverable: "",
    instatimeline: "",
    ytdeliverable: "",
    yttimeline: "",
    budget: [25000, 50000],
    creatorTypes: [],
  })

  const creatorTypeOptions = ["Fitness", "Wellness", "Cooking", "Beauty", "Entertainment", "Fashion"]

  const handleSubmit = (e) => {
    e.preventDefault()

    const campaigns = JSON.parse(localStorage.getItem("campaigns")) || []
    const newCampaign = {
      id: Date.now().toString(),
      ...formData,
      status: "Brand Confirmed",
      date: new Date().toLocaleDateString(),
      creators: [],
    }

    campaigns.push(newCampaign)
    localStorage.setItem("campaigns", JSON.stringify(campaigns))
    navigate("/campaign")
  }

  const toggleCreatorType = (type) => {
    setFormData((prev) => ({
      ...prev,
      creatorTypes: prev.creatorTypes.includes(type)
        ? prev.creatorTypes.filter((t) => t !== type)
        : [...prev.creatorTypes, type],
    }))
  }

  const formatCurrency = (value) => {
    return `₹${value >= 100000 ? (value / 100000).toFixed(1) + "L" : (value / 1000).toFixed(0) + "K"}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center p-4 border-b bg-white">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-xl font-medium">New Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Campaign Name */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Campaign Name</label>
          <input
            type="text"
            placeholder="Campaign Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#12766A]"
            required
          />
        </div>

        {/* Platform Selection */}
        <div>
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, platform: "instagram" }))}
              className={`flex-1 py-2 px-4 rounded-full text-sm ${
                formData.platform === "instagram" ? "bg-[#12766A] text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              Instagram
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, platform: "youtube" }))}
              className={`flex-1 py-2 px-4 rounded-full text-sm ${
                formData.platform === "youtube" ? "bg-[#12766A] text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              YouTube
            </button>
          </div>

          {/* Deliverable */}
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">Deliverable</label>
            <div className="relative">
              <select
                value={formData.platform === "instagram" ? formData.instadeliverable : formData.ytdeliverable}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [formData.platform === "instagram" ? "instadeliverable" : "ytdeliverable"]: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-lg border border-gray-200 appearance-none focus:outline-none focus:ring-1 focus:ring-[#12766A] bg-white"
              >
                <option value="">Select Deliverable</option>
                <option value="review">Product Review</option>
                <option value="unboxing">Unboxing</option>
                <option value="tutorial">Tutorial</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown size={16} className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Timeline</label>
            <div className="relative">
              <input
                type="date"
                value={formData.platform === "instagram" ? formData.instatimeline : formData.yttimeline}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [formData.platform === "instagram" ? "instatimeline" : "yttimeline"]: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#12766A] appearance-none"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Calendar size={18} className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Slider */}
        <div>
          <label className="block text-sm text-gray-500 mb-3">Budget (₹)</label>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Min</span>
            <span>Max</span>
          </div>
          <div className="py-6">
            <Range
              step={5000}
              min={10000}
              max={1000000}
              values={formData.budget}
              onChange={(values) => setFormData((prev) => ({ ...prev, budget: values }))}
              renderTrack={({ props, children }) => (
                <div {...props} className="w-full h-1 bg-gray-200 rounded-full" style={{ ...props.style }}>
                  {children}
                </div>
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  {...props}
                  className={`w-5 h-5 rounded-full focus:outline-none ${isDragged ? "bg-[#0D5D53]" : "bg-[#12766A]"}`}
                  style={{ ...props.style, boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)" }}
                />
              )}
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs font-medium">{formatCurrency(formData.budget[0])}</span>
              <span className="text-xs font-medium">{formatCurrency(formData.budget[1])}</span>
            </div>
          </div>
        </div>

        {/* Creator Types */}
        <div>
          <label className="block text-sm text-gray-500 mb-3">Creator Types</label>
          <div className="flex flex-wrap gap-2">
            {creatorTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleCreatorType(type)}
                className={`px-4 py-2 rounded-full text-sm ${
                  formData.creatorTypes.includes(type) ? "bg-[#12766A] text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-[#E5F0EE] text-[#12766A] font-medium py-3 rounded-full mt-8">
          Create Campaign
        </button>
      </form>
    </div>
  )
}

export default NewCampaign

