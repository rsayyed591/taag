"use client"

import { ChevronDown, ChevronUp, Edit2 } from "lucide-react"
import { useState } from "react"
import { useInvoices } from "../../hooks/useInvoices"

function CompanyDetails({ invoiceId, data, onEdit, isEditing = false }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { updateInvoice, loading } = useInvoices()

  const handleChange = async (field, value) => {
    if (!isEditing) return

    try {
      const updatedData = {
        ...data,
        [field]: value,
      }
      
      await updateInvoice(invoiceId, {
        companyDetails: updatedData
      })
    } catch (error) {
      console.error('Error updating company details:', error)
      alert('Failed to update company details')
    }
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
          disabled={loading}
        >
          {loading ? "Saving..." : (isEditing ? "Save" : <Edit2 className="w-5 h-5" />)}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Company Name</label>
              <input
                type="text"
                value={data.companyName || ""}
                onChange={(e) => handleChange("companyName", e.target.value)}
                readOnly={!isEditing}
                className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Address</label>
              <textarea
                value={data.address || ""}
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
                  value={data.gstin || ""}
                  onChange={(e) => handleChange("gstin", e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">PAN Number</label>
                <input
                  type="text"
                  value={data.pan || ""}
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
