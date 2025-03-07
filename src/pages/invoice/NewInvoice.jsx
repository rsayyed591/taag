"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { IonAlert } from "@ionic/react"
import DigitalSignature from "../../components/invoice/DigitalSignature"

function NewInvoice() {
  const navigate = useNavigate()
  const activeProfileId = localStorage.getItem("activeProfileId")
  const [invoiceData, setInvoiceData] = useState({
    id: null, // Add id field to track if we're editing an existing invoice
    profileId: activeProfileId,
    brandName: "",
    campaignName: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    companyName: "",
    address: "",
    gstin: "",
    pan: "",
    particulars: [{ description: "", amount: 0 }],
    taxType: "CGST/SGST",
    taxRate: 5,
    receivedPayments: [],
    notes: "",
    signature: null,
    accountType: "savings",
    beneficiaryName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    // Check if we're editing an existing invoice
    const draft = localStorage.getItem("invoiceDraft")
    const editingInvoiceId = localStorage.getItem("editingInvoiceId")

    if (draft) {
      const parsedDraft = JSON.parse(draft)

      // Flatten the structure for easier form handling
      setInvoiceData({
        id: editingInvoiceId ? Number.parseInt(editingInvoiceId) : null,
        profileId: activeProfileId,
        brandName: parsedDraft.brandName || "",
        campaignName: parsedDraft.campaignName || "",
        invoiceNumber: parsedDraft.invoiceNumber?.invoiceNumber || "",
        invoiceDate: parsedDraft.invoiceNumber?.invoiceDate || new Date().toISOString().split("T")[0],
        dueDate:
          parsedDraft.invoiceNumber?.dueDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        companyName: parsedDraft.companyDetails?.companyName || "",
        address: parsedDraft.companyDetails?.address || "",
        gstin: parsedDraft.companyDetails?.gstin || "",
        pan: parsedDraft.companyDetails?.pan || "",
        particulars: parsedDraft.amountDetails?.particulars || [{ description: "", amount: 0 }],
        taxType: parsedDraft.amountDetails?.taxType || "CGST/SGST",
        taxRate: parsedDraft.amountDetails?.taxRate || 5,
        receivedPayments: parsedDraft.amountDetails?.receivedPayments || [],
        notes: parsedDraft.notes || "",
        signature: parsedDraft.signature || null,
        accountType: parsedDraft.accountDetails?.accountType || "savings",
        beneficiaryName: parsedDraft.accountDetails?.beneficiaryName || "",
        accountNumber: parsedDraft.accountDetails?.accountNumber || "",
        bankName: parsedDraft.accountDetails?.bankName || "",
        ifscCode: parsedDraft.accountDetails?.ifscCode || "",
      })

      // Set editing mode if we have an invoice ID
      if (editingInvoiceId) {
        setIsEditing(true)
      }
    } else {
      // Load bank details from profile if available
      const userProfiles = JSON.parse(localStorage.getItem("userProfiles")) || []
      const activeProfileId = localStorage.getItem("activeProfileId")

      if (activeProfileId) {
        const activeProfile = userProfiles.find((profile) => String(profile.id) === String(activeProfileId))
        if (activeProfile?.bankDetails) {
          setInvoiceData((prev) => ({
            ...prev,
            accountType: activeProfile.bankDetails.accountType || "savings",
            beneficiaryName: activeProfile.bankDetails.beneficiaryName || "",
            accountNumber: activeProfile.bankDetails.accountNumber || "",
            bankName: activeProfile.bankDetails.bankName || "",
            ifscCode: activeProfile.bankDetails.ifscCode || "",
            signature: activeProfile.bankDetails.signature || null,
          }))
        }
      }
    }
  }, [])

  const handleChange = (field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleParticularChange = (index, field, value) => {
    const newParticulars = [...invoiceData.particulars]
    newParticulars[index] = { ...newParticulars[index], [field]: value }
    handleChange("particulars", newParticulars)
  }

  const handleAddParticular = () => {
    handleChange("particulars", [...invoiceData.particulars, { description: "", amount: 0 }])
  }

  const handleRemoveParticular = (index) => {
    const newParticulars = [...invoiceData.particulars]
    newParticulars.splice(index, 1)
    handleChange("particulars", newParticulars)
  }

  const calculateSubtotal = () => {
    return invoiceData.particulars.reduce((sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0)
  }

  const calculateTax = () => {
    return invoiceData.taxType === "No Tax"
      ? 0
      : (calculateSubtotal() * (Number.parseFloat(invoiceData.taxRate) || 0)) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSave = () => {
    // Validate required fields
    if (!invoiceData.brandName.trim()) {
      setAlertMessage("Please enter a brand name")
      setShowAlert(true)
      return
    }

    // Restructure data for storage
    const formattedInvoice = {
      id: invoiceData.id || Math.floor(Math.random() * 1000000),
      brandName: invoiceData.brandName,
      campaignName: invoiceData.campaignName,
      invoiceNumber: {
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceDate: invoiceData.invoiceDate,
        dueDate: invoiceData.dueDate,
      },
      companyDetails: {
        companyName: invoiceData.companyName,
        address: invoiceData.address,
        gstin: invoiceData.gstin,
        pan: invoiceData.pan,
      },
      amountDetails: {
        particulars: invoiceData.particulars,
        taxType: invoiceData.taxType,
        taxRate: invoiceData.taxRate,
        receivedPayments: invoiceData.receivedPayments,
      },
      notes: invoiceData.notes,
      signature: invoiceData.signature,
      accountDetails: {
        accountType: invoiceData.accountType,
        beneficiaryName: invoiceData.beneficiaryName,
        accountNumber: invoiceData.accountNumber,
        bankName: invoiceData.bankName,
        ifscCode: invoiceData.ifscCode,
      },
      amount: calculateTotal(),
      receivedAmount: (invoiceData.receivedPayments || []).reduce(
        (sum, payment) => sum + (Number.parseFloat(payment.amount) || 0),
        0,
      ),
      date: new Date().toLocaleDateString(),
    }

    formattedInvoice.dueAmount = formattedInvoice.amount - formattedInvoice.receivedAmount

    // Get existing invoices
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")

    if (isEditing) {
      // Update existing invoice
      const updatedInvoices = invoices.map((invoice) => (invoice.id === invoiceData.id ? formattedInvoice : invoice))
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices))

      setAlertMessage("Invoice updated successfully")
    } else {
      // Add new invoice
      invoices.push(formattedInvoice)
      localStorage.setItem("invoices", JSON.stringify(invoices))

      setAlertMessage("Invoice created successfully")
    }

    // Show success alert
    setShowAlert(true)

    // Clear draft and editing ID
    localStorage.removeItem("invoiceDraft")
    localStorage.removeItem("editingInvoiceId")
  }

  const handleAlertDismiss = () => {
    // Navigate to the invoice view
    navigate(`/invoice/${invoiceData.brandName}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-white shadow-sm">
        <button onClick={() => navigate("/invoice")} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">{isEditing ? "Edit Invoice" : "New Invoice"}</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <form className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name*</label>
                <input
                  type="text"
                  value={invoiceData.brandName}
                  onChange={(e) => handleChange("brandName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={invoiceData.campaignName}
                  onChange={(e) => handleChange("campaignName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter campaign name"
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Invoice Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => handleChange("invoiceNumber", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="INV-001"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceData.invoiceDate}
                    onChange={(e) => handleChange("invoiceDate", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Company Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={invoiceData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={invoiceData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                  placeholder="Company address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={invoiceData.gstin}
                    onChange={(e) => handleChange("gstin", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="GSTIN number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
                  <input
                    type="text"
                    value={invoiceData.pan}
                    onChange={(e) => handleChange("pan", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="PAN number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Amount Details */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Amount Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Particulars</label>

                {invoiceData.particulars.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleParticularChange(index, "description", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="w-1/3">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={item.amount}
                        onChange={(e) => handleParticularChange(index, "amount", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveParticular(index)}
                      className="text-red-500 p-1"
                      disabled={invoiceData.particulars.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button type="button" onClick={handleAddParticular} className="mt-2 text-[#12766A] text-sm font-medium">
                  + Add Item
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Settings</label>

                <div className="flex flex-wrap gap-4 mb-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="taxType"
                      checked={invoiceData.taxType === "CGST/SGST"}
                      onChange={() => handleChange("taxType", "CGST/SGST")}
                      className="w-4 h-4 text-[#12766A]"
                    />
                    CGST/SGST
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="taxType"
                      checked={invoiceData.taxType === "IGST"}
                      onChange={() => handleChange("taxType", "IGST")}
                      className="w-4 h-4 text-[#12766A]"
                    />
                    IGST
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="taxType"
                      checked={invoiceData.taxType === "No Tax"}
                      onChange={() => handleChange("taxType", "No Tax")}
                      className="w-4 h-4 text-[#12766A]"
                    />
                    No Tax
                  </label>
                </div>

                {invoiceData.taxType !== "No Tax" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={invoiceData.taxRate}
                      onChange={(e) => handleChange("taxRate", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between mb-1">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>

                {invoiceData.taxType !== "No Tax" && (
                  <div className="flex justify-between mb-1">
                    <span>Tax ({invoiceData.taxRate}%)</span>
                    <span>₹{calculateTax().toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-medium border-t border-gray-300 pt-1 mt-1">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Notes</h2>

            <textarea
              value={invoiceData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
              placeholder="Add any additional notes here..."
            />
          </div>

          {/* Digital Signature */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Digital Signature</h2>

            <DigitalSignature data={{ signature: invoiceData.signature }} onChange={handleChange} />
          </div>

          {/* Bank Details */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Bank Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleChange("accountType", "savings")}
                    className={`px-4 py-2 rounded-full ${
                      invoiceData.accountType === "savings" ? "bg-[#12766A] text-white" : "bg-gray-200"
                    }`}
                  >
                    Savings
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange("accountType", "current")}
                    className={`px-4 py-2 rounded-full ${
                      invoiceData.accountType === "current" ? "bg-[#12766A] text-white" : "bg-gray-200"
                    }`}
                  >
                    Current
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Name</label>
                <input
                  type="text"
                  value={invoiceData.beneficiaryName}
                  onChange={(e) => handleChange("beneficiaryName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Account holder name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account No.</label>
                <input
                  type="text"
                  value={invoiceData.accountNumber}
                  onChange={(e) => handleChange("accountNumber", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={invoiceData.bankName}
                  onChange={(e) => handleChange("bankName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Bank name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={invoiceData.ifscCode}
                  onChange={(e) => handleChange("ifscCode", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="IFSC code"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 bg-[#12766A] text-white rounded-full font-medium"
          >
            {isEditing ? "Update Invoice" : "Save Invoice"}
          </button>
        </form>
      </div>

      {/* Success Alert */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={handleAlertDismiss}
        header="Success"
        message={alertMessage}
        buttons={["OK"]}
      />
    </div>
  )
}

export default NewInvoice

