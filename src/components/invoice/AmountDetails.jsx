"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Edit2, Plus, Trash2 } from "lucide-react"

function AmountDetails({ data, onEdit, readOnly = true }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const calculateSubtotal = () => {
    return data.particulars?.reduce((sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0) || 0
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    return (subtotal * (Number.parseFloat(data.taxRate) || 0)) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleAddParticular = () => {
    if (!readOnly) {
      const newParticulars = [...(data.particulars || []), { description: "", amount: 0 }]
      data.onChange("particulars", newParticulars)
    }
  }

  const handleRemoveParticular = (index) => {
    if (!readOnly) {
      const newParticulars = [...data.particulars]
      newParticulars.splice(index, 1)
      data.onChange("particulars", newParticulars)
    }
  }

  const handleParticularChange = (index, field, value) => {
    if (!readOnly) {
      const newParticulars = [...data.particulars]
      newParticulars[index] = { ...newParticulars[index], [field]: value }
      data.onChange("particulars", newParticulars)
    }
  }

  const handleTaxTypeChange = (type) => {
    if (!readOnly) {
      data.onChange("taxType", type)
    }
  }

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <span className="text-gray-600">Amount Details</span>
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
            {(data.particulars || []).map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-sm text-gray-500">Particulars {index + 1}</label>
                  <input
                    type="text"
                    value={item.description || ""}
                    onChange={(e) => handleParticularChange(index, "description", e.target.value)}
                    readOnly={readOnly}
                    className="w-full p-2 mt-1 border border-gray-200 rounded-md"
                  />
                </div>
                <div className="w-1/3">
                  <label className="text-sm text-gray-500">Amount</label>
                  <input
                    type="number"
                    value={item.amount || ""}
                    onChange={(e) => handleParticularChange(index, "amount", e.target.value)}
                    readOnly={readOnly}
                    className="w-full p-2 mt-1 border border-gray-200 rounded-md"
                  />
                </div>
                {!readOnly && (
                  <button onClick={() => handleRemoveParticular(index)} className="mt-6">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
            ))}

            {!readOnly && (
              <button onClick={handleAddParticular} className="flex items-center gap-2 text-[#12766A]">
                <Plus className="w-4 h-4" />
                Add Particulars
              </button>
            )}

            {!readOnly && (
              <div className="mt-4">
                <label className="text-sm text-gray-500">Tax</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="taxType"
                      checked={data.taxType === "CGST/SGST"}
                      onChange={() => handleTaxTypeChange("CGST/SGST")}
                      className="w-4 h-4 text-[#12766A]"
                    />
                    CGST/SGST
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="taxType"
                      checked={data.taxType === "IGST"}
                      onChange={() => handleTaxTypeChange("IGST")}
                      className="w-4 h-4 text-[#12766A]"
                    />
                    IGST
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="taxType"
                      checked={data.taxType === "No Tax"}
                      onChange={() => handleTaxTypeChange("No Tax")}
                      className="w-4 h-4 text-[#12766A]"
                    />
                    No Tax
                  </label>
                </div>
              </div>
            )}

            {data.taxType !== "No Tax" && !readOnly && (
              <div>
                <label className="text-sm text-gray-500">Tax Rate (%)</label>
                <input
                  type="number"
                  value={data.taxRate || ""}
                  onChange={(e) => data.onChange("taxRate", e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-200 rounded-md"
                />
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              {data.taxType !== "No Tax" && (
                <div className="flex justify-between mt-2">
                  <span>Tax ({data.taxRate || 0}%)</span>
                  <span>₹{calculateTax().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mt-2 font-bold">
                <span>Grand Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AmountDetails

