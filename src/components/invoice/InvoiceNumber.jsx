"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react"

function InvoiceNumber({ data, onEdit, isEditing = false }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localData, setLocalData] = useState({
    invoiceNumber: data.invoiceNumber || "",
    invoiceDate: data.invoiceDate || "",
    dueDate: data.dueDate || "",
  })

  useEffect(() => {
    // Update local data when props change
    setLocalData({
      invoiceNumber: data.invoiceNumber || "",
      invoiceDate: data.invoiceDate || "",
      dueDate: data.dueDate || "",
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
          <span className="text-gray-700 font-medium">Invoice Number</span>
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
              <label className="text-sm text-gray-500 block mb-1">Invoice Number</label>
              <input
                type="text"
                value={localData.invoiceNumber}
                onChange={(e) => handleChange("invoiceNumber", e.target.value)}
                readOnly={!isEditing}
                className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={localData.invoiceDate}
                  onChange={(e) => handleChange("invoiceDate", e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={localData.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
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

export default InvoiceNumber

