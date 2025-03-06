"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Edit2, Plus, Trash2 } from "lucide-react"

function AmountDetails({ data, onEdit, isEditing = false }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localData, setLocalData] = useState({
    particulars: data.particulars || [{ description: "", amount: 0 }],
    taxType: data.taxType || "CGST/SGST",
    taxRate: data.taxRate || 5,
    receivedPayments: data.receivedPayments || [],
  })

  useEffect(() => {
    // Update local data when props change
    setLocalData({
      particulars: data.particulars || [{ description: "", amount: 0 }],
      taxType: data.taxType || "CGST/SGST",
      taxRate: data.taxRate || 5,
      receivedPayments: data.receivedPayments || [],
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

  const handleParticularChange = (index, field, value) => {
    const newParticulars = [...localData.particulars]
    newParticulars[index] = { ...newParticulars[index], [field]: value }
    handleChange("particulars", newParticulars)
  }

  const handleAddParticular = () => {
    handleChange("particulars", [...localData.particulars, { description: "", amount: 0 }])
  }

  const handleRemoveParticular = (index) => {
    const newParticulars = [...localData.particulars]
    newParticulars.splice(index, 1)
    handleChange("particulars", newParticulars)
  }

  const handleAddPayment = () => {
    const newPayment = {
      id: Date.now(),
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      method: "Bank Transfer",
    }
    handleChange("receivedPayments", [...localData.receivedPayments, newPayment])
  }

  const handlePaymentChange = (index, field, value) => {
    const newPayments = [...localData.receivedPayments]
    newPayments[index] = { ...newPayments[index], [field]: value }
    handleChange("receivedPayments", newPayments)
  }

  const handleRemovePayment = (index) => {
    const newPayments = [...localData.receivedPayments]
    newPayments.splice(index, 1)
    handleChange("receivedPayments", newPayments)
  }

  const calculateSubtotal = () => {
    return localData.particulars.reduce((sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0)
  }

  const calculateTax = () => {
    const taxRate = localData.taxRate
    const taxType = localData.taxType
    return taxType === "No Tax" ? 0 : (calculateSubtotal() * (Number.parseFloat(taxRate) || 0)) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const calculateTotalReceived = () => {
    return localData.receivedPayments.reduce((sum, payment) => sum + (Number.parseFloat(payment.amount) || 0), 0)
  }

  const calculateDueAmount = () => {
    return calculateTotal() - calculateTotalReceived()
  }

  return (
    <div className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <span className="text-gray-700 font-medium">Amount Details</span>
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
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Particulars</h3>
              {localData.particulars.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleParticularChange(index, "description", e.target.value)}
                      readOnly={!isEditing}
                      className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
                    />
                  </div>
                  <div className="w-1/3">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={item.amount}
                      onChange={(e) => handleParticularChange(index, "amount", e.target.value)}
                      readOnly={!isEditing}
                      className={`w-full p-2 border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
                    />
                  </div>
                  {isEditing && (
                    <button onClick={() => handleRemoveParticular(index)} className="text-red-500 p-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              {isEditing && (
                <button onClick={handleAddParticular} className="flex items-center gap-2 text-[#12766A] mt-2">
                  <Plus className="w-4 h-4" />
                  Add Particular
                </button>
              )}
            </div>

            {isEditing && (
              <div>
                <h3 className="font-medium mb-2">Tax Settings</h3>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="taxType"
                      checked={localData.taxType === "CGST/SGST"}
                      onChange={() => handleChange("taxType", "CGST/SGST")}
                      className="w-4 h-4 text-[#12766A]"
                    />
                    CGST/SGST
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="taxType"
                      checked={localData.taxType === "IGST"}
                      onChange={() => handleChange("taxType", "IGST")}
                      className="w-4 h-4 text-[#12766A]"
                    />
                    IGST
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="taxType"
                      checked={localData.taxType === "No Tax"}
                      onChange={() => handleChange("taxType", "No Tax")}
                      className="w-4 h-4 text-[#12766A]"
                    />
                    No Tax
                  </label>
                </div>

                {localData.taxType !== "No Tax" && (
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={localData.taxRate}
                      onChange={(e) => handleChange("taxRate", e.target.value)}
                      className="w-full p-2 border border-[#12766A] rounded-md"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">Summary</h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between mb-1">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                {localData.taxType !== "No Tax" && (
                  <div className="flex justify-between mb-1">
                    <span>Tax ({localData.taxRate}%)</span>
                    <span>₹{calculateTax().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium border-t border-gray-300 pt-1 mt-1">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Received Payments</h3>
              {localData.receivedPayments.length > 0 ? (
                <div className="space-y-3">
                  {localData.receivedPayments.map((payment, index) => (
                    <div key={payment.id} className="bg-gray-50 p-3 rounded-md">
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div>
                          <label className="text-xs text-gray-500 block">Amount</label>
                          <input
                            type="number"
                            value={payment.amount}
                            onChange={(e) => handlePaymentChange(index, "amount", e.target.value)}
                            readOnly={!isEditing}
                            className={`w-full p-1 text-sm border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block">Date</label>
                          <input
                            type="date"
                            value={payment.date}
                            onChange={(e) => handlePaymentChange(index, "date", e.target.value)}
                            readOnly={!isEditing}
                            className={`w-full p-1 text-sm border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block">Method</label>
                          <select
                            value={payment.method}
                            onChange={(e) => handlePaymentChange(index, "method", e.target.value)}
                            disabled={!isEditing}
                            className={`w-full p-1 text-sm border ${isEditing ? "border-[#12766A]" : "border-gray-200"} rounded-md ${!isEditing && "bg-gray-50"}`}
                          >
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Check">Check</option>
                          </select>
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => handleRemovePayment(index)}
                          className="text-red-500 text-sm flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No payments received yet.</p>
              )}

              {isEditing && (
                <button onClick={handleAddPayment} className="flex items-center gap-2 text-[#12766A] mt-2">
                  <Plus className="w-4 h-4" />
                  Add Payment
                </button>
              )}

              <div className="bg-[#12766A10] p-3 rounded-md mt-3">
                <div className="flex justify-between mb-1">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Total Received</span>
                  <span>₹{calculateTotalReceived().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium border-t border-gray-300 pt-1 mt-1">
                  <span>Due Amount</span>
                  <span>₹{calculateDueAmount().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AmountDetails

