"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import InvoiceHeader from "../../components/invoice/InvoiceHeader"

function NewInvoice() {
  const navigate = useNavigate()
  const [invoiceData, setInvoiceData] = useState({
    brandName: "",
    campaignName: "",
    invoiceNumber: {
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    companyDetails: {
      companyName: "",
      address: "",
      gstin: "",
      pan: "",
    },
    amountDetails: {
      particulars: [{ description: "", amount: 0 }],
      taxType: "CGST/SGST",
      taxRate: 5,
      receivedPayments: [],
    },
    notes: "",
    signature: null,
    accountDetails: {
      accountType: "savings",
      beneficiaryName: "",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
    },
  })

  useEffect(() => {
    // Check if we're editing an existing invoice
    const draft = localStorage.getItem("invoiceDraft")

    if (draft) {
      setInvoiceData(JSON.parse(draft))
    } else {
      // Load bank details from profile if available
      const bankDetails = localStorage.getItem("bankDetails")
      if (bankDetails) {
        const parsedBankDetails = JSON.parse(bankDetails)
        setInvoiceData((prev) => ({
          ...prev,
          accountDetails: {
            accountType: parsedBankDetails.accountType || "savings",
            beneficiaryName: parsedBankDetails.beneficiaryName || "",
            accountNumber: parsedBankDetails.accountNumber || "",
            bankName: parsedBankDetails.bankName || "",
            ifscCode: parsedBankDetails.ifscCode || "",
          },
          signature: parsedBankDetails.signature || null,
        }))
      }
    }
  }, [])

  const handleSave = () => {
    // Calculate total amount
    const subtotal = invoiceData.amountDetails.particulars.reduce(
      (sum, item) => sum + (Number.parseFloat(item.amount) || 0),
      0,
    )
    const taxAmount =
      invoiceData.amountDetails.taxType === "No Tax"
        ? 0
        : (subtotal * (Number.parseFloat(invoiceData.amountDetails.taxRate) || 0)) / 100
    const totalAmount = subtotal + taxAmount

    // Calculate received amount
    const receivedAmount = (invoiceData.amountDetails.receivedPayments || []).reduce(
      (sum, payment) => sum + (Number.parseFloat(payment.amount) || 0),
      0,
    )

    // Save to localStorage
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    const newInvoice = {
      id: Date.now(),
      ...invoiceData,
      amount: totalAmount,
      receivedAmount: receivedAmount,
      dueAmount: totalAmount - receivedAmount,
      date: new Date().toLocaleDateString(),
    }
    invoices.push(newInvoice)
    localStorage.setItem("invoices", JSON.stringify(invoices))

    // Clear draft
    localStorage.removeItem("invoiceDraft")

    // Navigate to the invoice view
    navigate(`/invoice/${invoiceData.brandName}`)
  }

  const handleChange = (section, field, value) => {
    if (section === "main") {
      setInvoiceData((prev) => ({
        ...prev,
        [field]: value,
      }))
    } else {
      setInvoiceData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }))
    }

    // Save draft to localStorage
    localStorage.setItem("invoiceDraft", JSON.stringify(invoiceData))
  }

  const addParticular = () => {
    setInvoiceData((prev) => ({
      ...prev,
      amountDetails: {
        ...prev.amountDetails,
        particulars: [...prev.amountDetails.particulars, { description: "", amount: 0 }],
      },
    }))
  }

  const removeParticular = (index) => {
    setInvoiceData((prev) => ({
      ...prev,
      amountDetails: {
        ...prev.amountDetails,
        particulars: prev.amountDetails.particulars.filter((_, i) => i !== index),
      },
    }))
  }

  const updateParticular = (index, field, value) => {
    setInvoiceData((prev) => {
      const updatedParticulars = [...prev.amountDetails.particulars]
      updatedParticulars[index] = {
        ...updatedParticulars[index],
        [field]: value,
      }
      return {
        ...prev,
        amountDetails: {
          ...prev.amountDetails,
          particulars: updatedParticulars,
        },
      }
    })
  }

  const addPayment = () => {
    setInvoiceData((prev) => ({
      ...prev,
      amountDetails: {
        ...prev.amountDetails,
        receivedPayments: [
          ...(prev.amountDetails.receivedPayments || []),
          { date: new Date().toISOString().split("T")[0], method: "Bank Transfer", amount: 0 },
        ],
      },
    }))
  }

  const removePayment = (index) => {
    setInvoiceData((prev) => ({
      ...prev,
      amountDetails: {
        ...prev.amountDetails,
        receivedPayments: prev.amountDetails.receivedPayments.filter((_, i) => i !== index),
      },
    }))
  }

  const updatePayment = (index, field, value) => {
    setInvoiceData((prev) => {
      const updatedPayments = [...(prev.amountDetails.receivedPayments || [])]
      updatedPayments[index] = {
        ...updatedPayments[index],
        [field]: value,
      }
      return {
        ...prev,
        amountDetails: {
          ...prev.amountDetails,
          receivedPayments: updatedPayments,
        },
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InvoiceHeader title="New Invoice" />

      <div className="p-4 max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
            <input
              type="text"
              placeholder="Enter brand name"
              value={invoiceData.brandName}
              onChange={(e) => handleChange("main", "brandName", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
            <input
              type="text"
              placeholder="Enter campaign name"
              value={invoiceData.campaignName}
              onChange={(e) => handleChange("main", "campaignName", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
            <input
              type="text"
              placeholder="INV-001"
              value={invoiceData.invoiceNumber.invoiceNumber}
              onChange={(e) => handleChange("invoiceNumber", "invoiceNumber", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
              <input
                type="date"
                value={invoiceData.invoiceNumber.invoiceDate}
                onChange={(e) => handleChange("invoiceNumber", "invoiceDate", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={invoiceData.invoiceNumber.dueDate}
                onChange={(e) => handleChange("invoiceNumber", "dueDate", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Company Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              placeholder="Your Company Name"
              value={invoiceData.companyDetails.companyName}
              onChange={(e) => handleChange("companyDetails", "companyName", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              placeholder="Company Address"
              value={invoiceData.companyDetails.address}
              onChange={(e) => handleChange("companyDetails", "address", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
              <input
                type="text"
                placeholder="GSTIN Number"
                value={invoiceData.companyDetails.gstin}
                onChange={(e) => handleChange("companyDetails", "gstin", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
              <input
                type="text"
                placeholder="PAN Number"
                value={invoiceData.companyDetails.pan}
                onChange={(e) => handleChange("companyDetails", "pan", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Amount Details</h2>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Particulars</label>
              <button type="button" onClick={addParticular} className="text-sm text-[#12766A] font-medium">
                + Add Item
              </button>
            </div>

            {invoiceData.amountDetails.particulars.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-2 mb-2 p-3 bg-gray-50 rounded-md">
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateParticular(index, "description", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
                  />
                </div>
                <div className="w-full md:w-32">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) => updateParticular(index, "amount", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
                  />
                </div>
                {invoiceData.amountDetails.particulars.length > 1 && (
                  <button type="button" onClick={() => removeParticular(index)} className="text-red-500 p-2">
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Type</label>
              <select
                value={invoiceData.amountDetails.taxType}
                onChange={(e) => handleChange("amountDetails", "taxType", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
              >
                <option value="No Tax">No Tax</option>
                <option value="GST">GST</option>
                <option value="CGST/SGST">CGST/SGST</option>
                <option value="IGST">IGST</option>
              </select>
            </div>

            {invoiceData.amountDetails.taxType !== "No Tax" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  placeholder="Tax Rate"
                  value={invoiceData.amountDetails.taxRate}
                  onChange={(e) => handleChange("amountDetails", "taxRate", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Received Payments</label>
              <button type="button" onClick={addPayment} className="text-sm text-[#12766A] font-medium">
                + Add Payment
              </button>
            </div>

            {(invoiceData.amountDetails.receivedPayments || []).map((payment, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-2 mb-2 p-3 bg-gray-50 rounded-md">
                <div className="w-full md:w-1/3">
                  <input
                    type="date"
                    value={payment.date}
                    onChange={(e) => updatePayment(index, "date", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <input
                    type="text"
                    placeholder="Payment Method"
                    value={payment.method}
                    onChange={(e) => updatePayment(index, "method", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={payment.amount}
                    onChange={(e) => updatePayment(index, "amount", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
                  />
                </div>
                <button type="button" onClick={() => removePayment(index)} className="text-red-500 p-2">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <textarea
            placeholder="Add notes for your client"
            value={invoiceData.notes}
            onChange={(e) => handleChange("main", "notes", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
            rows="3"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Account Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select
              value={invoiceData.accountDetails.accountType}
              onChange={(e) => handleChange("accountDetails", "accountType", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
            >
              <option value="savings">Savings</option>
              <option value="current">Current</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Name</label>
            <input
              type="text"
              placeholder="Beneficiary Name"
              value={invoiceData.accountDetails.beneficiaryName}
              onChange={(e) => handleChange("accountDetails", "beneficiaryName", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              type="text"
              placeholder="Account Number"
              value={invoiceData.accountDetails.accountNumber}
              onChange={(e) => handleChange("accountDetails", "accountNumber", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input
              type="text"
              placeholder="Bank Name"
              value={invoiceData.accountDetails.bankName}
              onChange={(e) => handleChange("accountDetails", "bankName", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
            <input
              type="text"
              placeholder="IFSC Code"
              value={invoiceData.accountDetails.ifscCode}
              onChange={(e) => handleChange("accountDetails", "ifscCode", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12766A] focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 text-white bg-[#12766A] rounded-md hover:bg-[#0e5d54] transition-colors font-medium text-lg"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default NewInvoice

