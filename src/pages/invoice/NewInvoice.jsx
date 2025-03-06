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
  const [editingSections, setEditingSections] = useState({})

  useEffect(() => {
    // Check if there's a draft in localStorage
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

  const handleEdit = (section) => {
    setEditingSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
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

  return (
    <div className="min-h-screen bg-gray-50">
      <InvoiceHeader title="New Invoice" />

      <div className="p-4">
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Brand Name"
            value={invoiceData.brandName}
            onChange={(e) => {
              const newValue = e.target.value
              setInvoiceData((prev) => {
                const updated = {
                  ...prev,
                  brandName: newValue,
                }
                localStorage.setItem("invoiceDraft", JSON.stringify(updated))
                return updated
              })
            }}
            className="w-full p-2 mb-2 border border-gray-200 rounded-md"
          />
          <input
            type="text"
            placeholder="Campaign Name"
            value={invoiceData.campaignName}
            onChange={(e) => {
              const newValue = e.target.value
              setInvoiceData((prev) => {
                const updated = {
                  ...prev,
                  campaignName: newValue,
                }
                localStorage.setItem("invoiceDraft", JSON.stringify(updated))
                return updated
              })
            }}
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>

        <InvoiceNumber
          data={{
            ...invoiceData.invoiceNumber,
            onChange: (field, value) => handleChange("invoiceNumber", field, value),
          }}
          onEdit={() => handleEdit("invoiceNumber")}
          isEditing={editingSections.invoiceNumber}
        />

        <CompanyDetails
          data={{
            ...invoiceData.companyDetails,
            onChange: (field, value) => handleChange("companyDetails", field, value),
          }}
          onEdit={() => handleEdit("companyDetails")}
          isEditing={editingSections.companyDetails}
        />

        <AmountDetails
          data={{
            ...invoiceData.amountDetails,
            onChange: (field, value) => handleChange("amountDetails", field, value),
          }}
          onEdit={() => handleEdit("amountDetails")}
          isEditing={editingSections.amountDetails}
        />

        <Notes
          data={{
            notes: invoiceData.notes,
            onChange: (field, value) => handleChange("main", field, value),
          }}
          onEdit={() => handleEdit("notes")}
          isEditing={editingSections.notes}
        />

        <DigitalSignature
          data={{
            signature: invoiceData.signature,
            onChange: (field, value) => handleChange("main", field, value),
          }}
          onEdit={() => handleEdit("signature")}
          isEditing={editingSections.signature}
        />

        <AccountDetails
          data={{
            ...invoiceData.accountDetails,
            onChange: (field, value) => handleChange("accountDetails", field, value),
          }}
          onEdit={() => handleEdit("accountDetails")}
          isEditing={editingSections.accountDetails}
        />

        <button onClick={handleSave} className="w-full py-3 mt-6 text-white bg-[#12766A] rounded-full">
          Save Invoice
        </button>
      </div>
    </div>
  )
}

export default NewInvoice

