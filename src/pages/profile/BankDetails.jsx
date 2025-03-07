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
    beneficiaryName: "",
    ifscCode: "",
    gstin: "",
    signature: null,
    signatureFile: null,
  })

  useEffect(() => {
    const storedProfiles = JSON.parse(localStorage.getItem("userProfiles")) || [];
    const activeProfileId = localStorage.getItem("activeProfileId"); // Get active profile ID

    if (activeProfileId) {
      const activeProfile = storedProfiles.find(profile => String(profile.id) === String(activeProfileId));
      
      if (activeProfile?.bankDetails) {
        setFormData(activeProfile.bankDetails);
      }
    }
}, []);

const handleChange = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        signature: reader.result,
        signatureFile: file.name,
      }));
    };
    reader.readAsDataURL(file);
  }
};

const handleSave = () => {
  const storedProfiles = JSON.parse(localStorage.getItem("userProfiles")) || []; // Get userProfiles
  const activeProfileId = localStorage.getItem("activeProfileId"); // Get active profile ID

  const activeIndex = storedProfiles.findIndex(p => String(p.id) === String(activeProfileId)); // Find profile by ID

  if (activeIndex !== -1) {
      storedProfiles[activeIndex] = {
          ...storedProfiles[activeIndex],
          bankDetails: formData, // Update bank details
      };
      console.log(formData)

      localStorage.setItem("userProfiles", JSON.stringify(storedProfiles)); // Save updated profiles
  }

  navigate("/profile");
};


  return (
    <div className="min-h-screen bg-[#F2F1F1]">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-[#F2F1F1]">
  <button onClick={() => navigate("/profile")} className="inline-flex items-center p-2">
    <ArrowLeft className="w-5 h-5" />
  </button>
  <h1 className="text-lg font-medium m-0">Invoice/Bank Details</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Account Number */}
        <div>
          <label className="text-sm text-[#6F6F6F] block mb-1">Bank Account No.</label>
          <input
            type="number"
            value={formData.accountNumber}
            placeholder="Enter your bank account number"
            onChange={(e) => handleChange("accountNumber", e.target.value)}
            className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
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
            placeholder="Enter your bank name"
            onChange={(e) => handleChange("bankName", e.target.value)}
            className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
          />
        </div>

        {/* Beneficiary Name */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">Beneficiary Name</label>
          <input
            type="text"
            value={formData.beneficiaryName}
            placeholder="Enter the beneficiary name"
            onChange={(e) => handleChange("beneficiaryName", e.target.value)}
            className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
          />
        </div>
        {/* IFSC Code */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">IFSC Code</label>
          <input
            type="text"
            value={formData.ifscCode}
            placeholder="Enter the IFSC code"
            onChange={(e) => handleChange("ifscCode", e.target.value)}
            className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
          />
        </div>

        {/* GSTIN */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">GSTIN</label>
          <input
            type="text"
            value={formData.gstin}
            placeholder="Enter your GSTIN number"
            onChange={(e) => handleChange("gstin", e.target.value)}
            className="w-full p-2 bg-[#F2F1F1] border-[#D7D4D4] border-b"
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
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-[#D7D4D4] rounded-md cursor-pointer hover:border-[#12766A]"
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
                  <span className="text-xs text-[#6F6F6F] text-center">UPLOAD SIGNATURE (PNG, JPG, PDF) UNDER 3MB</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center px-6">
        <button className="btn-primary2 w-full max-w-xs mb-2" onClick={handleSave}>
          Save Details
        </button>
      </div>
      </div>
    </div>
  )
}

export default BankDetails

