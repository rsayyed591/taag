"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react"

function Notes({ data, onEdit, readOnly = true }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <span className="text-gray-600">Notes</span>
        </div>
        {readOnly && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Edit2 className="w-5 h-5 text-[#12766A]" />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="p-4 bg-gray-50">
          <textarea
            value={data.notes || ""}
            onChange={readOnly ? undefined : (e) => data.onChange("notes", e.target.value)}
            readOnly={readOnly}
            className="w-full p-2 min-h-[100px] border border-gray-200 rounded-md"
            placeholder="Add notes here..."
          />
        </div>
      )}
    </div>
  )
}

export default Notes

