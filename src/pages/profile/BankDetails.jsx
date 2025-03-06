"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Upload, X } from "lucide-react"

function BankDetails() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountType: "savings",
    bankName: "",
    ifscCode: "",
    gstin: "",
    signature: null,
    signatureFile: null,
  })

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("userData")) || {};
    if (savedData.bankDetails) {
      setFormData(savedData.creatorDetails);
    }
  }, []);  

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          signature: reader.result,
          signatureFile: file.name,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    const existingUserData = JSON.parse(localStorage.getItem("userData")) || {}; // Get userData
    existingUserData.bankDetails = formData; // Update bankDetails
  
    localStorage.setItem("userData", JSON.stringify(existingUserData)); // Save updated data
    navigate("/profile");
  };  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-white">
        <button onClick={() => navigate("/profile")} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">Invoice/Bank Details</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Account Number */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">Bank Account No.</label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => handleChange("accountNumber", e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>

        {/* Account Type */}
        <div>
          <div className="flex gap-2">
            <button
              onClick={() => handleChange("accountType", "savings")}
              className={`px-4 py-2 rounded-full ${
                formData.accountType === "savings" ? "bg-[#12766A10] text-[#12766A]" : "bg-gray-100"
              }`}
            >
              Savings
            </button>
            <button
              onClick={() => handleChange("accountType", "current")}
              className={`px-4 py-2 rounded-full ${
                formData.accountType === "current" ? "bg-[#12766A10] text-[#12766A]" : "bg-gray-100"
              }`}
            >
              Current
            </button>
          </div>
        </div>

        {/* Bank Name */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">Bank Name</label>
          <input
            type="text"
            value={formData.bankName}
            onChange={(e) => handleChange("bankName", e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>

        {/* IFSC Code */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">IFSC Code</label>
          <input
            type="text"
            value={formData.ifscCode}
            onChange={(e) => handleChange("ifscCode", e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>

        {/* GSTIN */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">GSTIN</label>
          <input
            type="text"
            value={formData.gstin}
            onChange={(e) => handleChange("gstin", e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>

        {/* Digital Signature */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">Digital Signature</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="signature-upload"
            />
            <label
              htmlFor="signature-upload"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-[#12766A]"
            >
              {formData.signature ? (
                <div className="flex items-center gap-2">
                  <span>{formData.signatureFile}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleChange("signature", null)
                      handleChange("signatureFile", null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500">UPLOAD SIGNATURE (PNG, JPG, PDF) UNDER 3MB</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button onClick={handleSave} className="w-full py-3 bg-[#12766A] text-white rounded-full mt-6">
          Save Details
        </button>
      </div>
    </div>
  )
}

export default BankDetails

