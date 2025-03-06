"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react"

function AccountDetails({ data, onEdit, isEditing = false }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localData, setLocalData] = useState({
    accountType: data.accountType || "savings",
    beneficiaryName: data.beneficiaryName || "",
    accountNumber: data.accountNumber || "",
    bankName: data.bankName || "",
    ifscCode: data.ifscCode || "",
  })

  useEffect(() => {
    // Update local data when props change
    setLocalData({
      accountType: data.accountType || "savings",
      beneficiaryName: data.beneficiaryName || "",
      accountNumber: data.accountNumber || "",
      bankName: data.bankName || "",
      ifscCode: data.ifscCode || "",
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
          <span className="text-gray-700 font-medium">Account Details</span>
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
              <label className="text-sm text-gray-500 block mb-1">Account Type</label>
              <div className="flex gap-4 mt-1">
                <button
                  onClick={isEditing ? () => handleChange("accountType", "savings") : undefined}
                  className={`px-4 py-2 rounded-full ${
                    localData.accountType === "savings" ? "bg-[#12766A] text-white" : "bg-gray-200"
                  }`}
                  disabled={!isEditing}
                >
                  Savings
                </button>
                <button
                  onClick={isEditing ? () => handleChange("accountType", "current") : undefined}
                  className={`px-4 py-2 rounded-full ${
                    localData.accountType === "current" ? "bg-[#12766A] text-white" : "bg-gray-200"
                  }`}
                  disabled={!isEditing}
                >
                  Current
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Beneficiary Name</label>
              <input
                type="text"
                value={localData.beneficiaryName}
                onChange={(e) => handleChange("beneficiaryName", e.target.value)}
                readOnly={!isEditing}
                className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Bank Account No.</label>
              <input
                type="text"
                value={localData.accountNumber}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
                readOnly={!isEditing}
                className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Bank Name</label>
              <input
                type="text"
                value={localData.bankName}
                onChange={(e) => handleChange("bankName", e.target.value)}
                readOnly={!isEditing}
                className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">IFSC Code</label>
              <input
                type="text"
                value={localData.ifscCode}
                onChange={(e) => handleChange("ifscCode", e.target.value)}
                readOnly={!isEditing}
                className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountDetails

