"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import InvoiceHeader from "../../components/invoice/InvoiceHeader"
import InvoiceNumber from "../../components/invoice/InvoiceNumber"
import CompanyDetails from "../../components/invoice/CompanyDetails"
import AmountDetails from "../../components/invoice/AmountDetails"
import Notes from "../../components/invoice/Notes"
import AccountDetails from "../../components/invoice/AccountDetails"
import DigitalSignature from "../../components/invoice/DigitalSignature"

function NewInvoice() {
  const navigate = useNavigate()
  const [invoiceData, setInvoiceData] = useState({
    brandName: "",
    campaignName: "",
    invoiceNumber: {
      invoiceNumber: "",
      invoiceDate: "",
      dueDate: "",
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
    },
    notes: "",
    signature: null,
    accountDetails: {
      accountType: "savings",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
    },
  })

  useEffect(() => {
    // Check if there's a draft in localStorage
    const draft = localStorage.getItem("invoiceDraft")
    if (draft) {
      setInvoiceData(JSON.parse(draft))
    }
  }, [])

  const handleSave = () => {
    // Calculate total amount
    const subtotal = invoiceData.amountDetails.particulars.reduce(
      (sum, item) => sum + (Number.parseFloat(item.amount) || 0),
      0,
    )
    const taxAmount = (subtotal * (Number.parseFloat(invoiceData.amountDetails.taxRate) || 0)) / 100
    const totalAmount = subtotal + taxAmount

    // Save to localStorage
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    const newInvoice = {
      id: Date.now(),
      ...invoiceData,
      amount: totalAmount,
      date: new Date().toLocaleDateString(),
    }
    invoices.push(newInvoice)
    localStorage.setItem("invoices", JSON.stringify(invoices))

    // Clear draft
    localStorage.removeItem("invoiceDraft")

    // Navigate to the invoice view
    navigate(`/invoice/${invoiceData.brandName}`)
  }

  const handleEdit = (section) => {
    // Save current state to localStorage as draft
    localStorage.setItem("invoiceDraft", JSON.stringify(invoiceData))
    navigate(`/invoice/new-invoice/edit-form?section=${section}`)
  }

  const handleBrandChange = (e) => {
    setInvoiceData({
      ...invoiceData,
      brandName: e.target.value,
    })
  }

  const handleCampaignChange = (e) => {
    setInvoiceData({
      ...invoiceData,
      campaignName: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InvoiceHeader title="New Invoice" />

      <div className="p-4">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Brand Name"
            value={invoiceData.brandName}
            onChange={handleBrandChange}
            className="w-full p-2 mb-2 border border-gray-200 rounded-md"
          />
          <input
            type="text"
            placeholder="Campaign Name"
            value={invoiceData.campaignName}
            onChange={handleCampaignChange}
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>

        <InvoiceNumber data={invoiceData.invoiceNumber} onEdit={() => handleEdit("invoiceNumber")} />
        <CompanyDetails data={invoiceData.companyDetails} onEdit={() => handleEdit("companyDetails")} />
        <AmountDetails data={invoiceData.amountDetails} onEdit={() => handleEdit("amountDetails")} />
        <Notes
          data={{
            notes: invoiceData.notes,
            onChange: (field, value) => setInvoiceData({ ...invoiceData, [field]: value }),
          }}
          onEdit={() => handleEdit("notes")}
        />
        <DigitalSignature
          data={{
            signature: invoiceData.signature,
            onChange: (field, value) => setInvoiceData({ ...invoiceData, [field]: value }),
          }}
          onEdit={() => handleEdit("signature")}
        />
        <AccountDetails data={invoiceData.accountDetails} onEdit={() => handleEdit("accountDetails")} />

        <button onClick={handleSave} className="w-full py-3 mt-6 text-white bg-[#12766A] rounded-full">
          Continue
        </button>
      </div>
    </div>
  )
}

export default NewInvoice

