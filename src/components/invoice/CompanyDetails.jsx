"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react"

function CompanyDetails({ data, onEdit, isEditing = false }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localData, setLocalData] = useState({
    companyName: data.companyName || "",
    address: data.address || "",
    gstin: data.gstin || "",
    pan: data.pan || "",
  })

  useEffect(() => {
    // Update local data when props change
    setLocalData({
      companyName: data.companyName || "",
      address: data.address || "",
      gstin: data.gstin || "",
      pan: data.pan || "",
    })
  }, [data])

  const handleChange = (field, value) => {
    setLocalData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      }

      // Immediately update parent data
      if (isEditing) {
        data.onChange(field, value)
      }

      return updated
    })
  }

  return (
    <div className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <span className="text-gray-700 font-medium">Company Details</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="text-[#12766A] hover:bg-[#12766A10] p-2 rounded-full"
        >
          {isEditing ? "Save" : <Edit2 className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Company Name</label>
              <input
                type="text"
                value={localData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                readOnly={!isEditing}
                className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Address</label>
              <textarea
                value={localData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                readOnly={!isEditing}
                className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">GSTIN</label>
                <input
                  type="text"
                  value={localData.gstin}
                  onChange={(e) => handleChange("gstin", e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">PAN Number</label>
                <input
                  type="text"
                  value={localData.pan}
                  onChange={(e) => handleChange("pan", e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyDetails

