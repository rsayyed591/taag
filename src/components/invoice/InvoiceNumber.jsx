"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react"

function InvoiceNumber({ data, onEdit, readOnly = true }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <span className="text-gray-600">Invoice Number</span>
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
              <label className="text-sm text-gray-500">Invoice Number</label>
              <input
                type="text"
                value={data.invoiceNumber || ""}
                onChange={readOnly ? undefined : (e) => data.onChange("invoiceNumber", e.target.value)}
                readOnly={readOnly}
                className="w-full p-2 mt-1 border border-gray-200 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Invoice Date</label>
                <input
                  type="date"
                  value={data.invoiceDate || ""}
                  onChange={readOnly ? undefined : (e) => data.onChange("invoiceDate", e.target.value)}
                  readOnly={readOnly}
                  className="w-full p-2 mt-1 border border-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Due Date</label>
                <input
                  type="date"
                  value={data.dueDate || ""}
                  onChange={readOnly ? undefined : (e) => data.onChange("dueDate", e.target.value)}
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

export default InvoiceNumber

