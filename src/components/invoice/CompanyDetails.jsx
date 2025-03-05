"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react"

function CompanyDetails({ data, onEdit, readOnly = true }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <span className="text-gray-600">Company Details</span>
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
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Company Name</label>
              <input
                type="text"
                value={data.companyName || ""}
                onChange={readOnly ? undefined : (e) => data.onChange("companyName", e.target.value)}
                readOnly={readOnly}
                className="w-full p-2 mt-1 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Address</label>
              <textarea
                value={data.address || ""}
                onChange={readOnly ? undefined : (e) => data.onChange("address", e.target.value)}
                readOnly={readOnly}
                className="w-full p-2 mt-1 border border-gray-200 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">GSTIN</label>
                <input
                  type="text"
                  value={data.gstin || ""}
                  onChange={readOnly ? undefined : (e) => data.onChange("gstin", e.target.value)}
                  readOnly={readOnly}
                  className="w-full p-2 mt-1 border border-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">PAN Number</label>
                <input
                  type="text"
                  value={data.pan || ""}
                  onChange={readOnly ? undefined : (e) => data.onChange("pan", e.target.value)}
                  readOnly={readOnly}
                  className="w-full p-2 mt-1 border border-gray-200 rounded-md"
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

