"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react"

function AccountDetails({ data, onEdit, readOnly = true }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <span className="text-gray-600">Account Details</span>
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
              <label className="text-sm text-gray-500">Account Type</label>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={readOnly ? undefined : () => data.onChange("accountType", "savings")}
                  className={`px-4 py-2 rounded-full ${
                    data.accountType === "savings" ? "bg-[#12766A] text-white" : "bg-gray-200"
                  }`}
                  disabled={readOnly}
                >
                  Savings
                </button>
                <button
                  onClick={readOnly ? undefined : () => data.onChange("accountType", "current")}
                  className={`px-4 py-2 rounded-full ${
                    data.accountType === "current" ? "bg-[#12766A] text-white" : "bg-gray-200"
                  }`}
                  disabled={readOnly}
                >
                  Current
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Bank Account No.</label>
              <input
                type="text"
                value={data.accountNumber || ""}
                onChange={readOnly ? undefined : (e) => data.onChange("accountNumber", e.target.value)}
                readOnly={readOnly}
                className="w-full p-2 mt-1 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Bank Name</label>
              <input
                type="text"
                value={data.bankName || ""}
                onChange={readOnly ? undefined : (e) => data.onChange("bankName", e.target.value)}
                readOnly={readOnly}
                className="w-full p-2 mt-1 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">IFSC Code</label>
              <input
                type="text"
                value={data.ifscCode || ""}
                onChange={readOnly ? undefined : (e) => data.onChange("ifscCode", e.target.value)}
                readOnly={readOnly}
                className="w-full p-2 mt-1 border border-gray-200 rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountDetails

