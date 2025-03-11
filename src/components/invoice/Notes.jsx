"use client"

import { ChevronDown, ChevronUp, Edit2 } from "lucide-react"
import { useState } from "react"
import { useInvoices } from "../../hooks/useInvoices"

function Notes({ invoiceId, data, onEdit, isEditing = false }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { updateInvoice, loading } = useInvoices()

  const handleChange = async (value) => {
    if (!isEditing) return

    try {
      await updateInvoice(invoiceId, {
        notes: value
      })
    } catch (error) {
      console.error('Error updating notes:', error)
      alert('Failed to update notes')
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <span className="text-gray-700 font-medium">Notes</span>
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
          <textarea
            value={data.notes || ""}
            onChange={(e) => handleChange(e.target.value)}
            readOnly={!isEditing}
            className={`w-full p-2 min-h-[100px] border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
            placeholder="Add notes here..."
          />
        </div>
      )}
    </div>
  )
}

export default Notes

