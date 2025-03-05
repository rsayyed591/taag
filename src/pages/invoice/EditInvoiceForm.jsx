"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import InvoiceHeader from "../../components/invoice/InvoiceHeader"
import InvoiceNumber from "../../components/invoice/InvoiceNumber"
import CompanyDetails from "../../components/invoice/CompanyDetails"
import AmountDetails from "../../components/invoice/AmountDetails"
import Notes from "../../components/invoice/Notes"
import AccountDetails from "../../components/invoice/AccountDetails"
import DigitalSignature from "../../components/invoice/DigitalSignature"

function EditInvoiceForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const section = searchParams.get("section")
  const [invoiceData, setInvoiceData] = useState(null)

  useEffect(() => {
    // Load draft from localStorage
    const draft = localStorage.getItem("invoiceDraft")
    if (draft) {
      setInvoiceData(JSON.parse(draft))
    }
  }, [])

  const handleSave = () => {
    // Save updated draft to localStorage
    localStorage.setItem("invoiceDraft", JSON.stringify(invoiceData))
    navigate("/invoice/new-invoice")
  }

  const handleChange = (field, value) => {
    if (section === "invoiceNumber") {
      setInvoiceData({
        ...invoiceData,
        invoiceNumber: {
          ...invoiceData.invoiceNumber,
          [field]: value,
        },
      })
    } else if (section === "companyDetails") {
      setInvoiceData({
        ...invoiceData,
        companyDetails: {
          ...invoiceData.companyDetails,
          [field]: value,
        },
      })
    } else if (section === "amountDetails") {
      setInvoiceData({
        ...invoiceData,
        amountDetails: {
          ...invoiceData.amountDetails,
          [field]: value,
        },
      })
    } else if (section === "accountDetails") {
      setInvoiceData({
        ...invoiceData,
        accountDetails: {
          ...invoiceData.accountDetails,
          [field]: value,
        },
      })
    } else {
      setInvoiceData({
        ...invoiceData,
        [field]: value,
      })
    }
  }

  if (!invoiceData) {
    return <div>Loading...</div>
  }

  const renderEditForm = () => {
    switch (section) {
      case "invoiceNumber":
        return (
          <InvoiceNumber
            data={{
              ...invoiceData.invoiceNumber,
              onChange: handleChange,
            }}
            readOnly={false}
          />
        )
      case "companyDetails":
        return (
          <CompanyDetails
            data={{
              ...invoiceData.companyDetails,
              onChange: handleChange,
            }}
            readOnly={false}
          />
        )
      case "amountDetails":
        return (
          <AmountDetails
            data={{
              ...invoiceData.amountDetails,
              onChange: handleChange,
            }}
            readOnly={false}
          />
        )
      case "notes":
        return (
          <Notes
            data={{
              notes: invoiceData.notes,
              onChange: handleChange,
            }}
            readOnly={false}
          />
        )
      case "signature":
        return (
          <DigitalSignature
            data={{
              signature: invoiceData.signature,
              onChange: handleChange,
            }}
            readOnly={false}
          />
        )
      case "accountDetails":
        return (
          <AccountDetails
            data={{
              ...invoiceData.accountDetails,
              onChange: handleChange,
            }}
            readOnly={false}
          />
        )
      default:
        return <div>Select a section to edit</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InvoiceHeader title={`Edit ${section?.charAt(0).toUpperCase()}${section?.slice(1)}`} />

      <div className="p-4">
        {renderEditForm()}

        <button onClick={handleSave} className="w-full py-3 mt-6 text-white bg-[#12766A] rounded-full">
          Save
        </button>
      </div>
    </div>
  )
}

export default EditInvoiceForm

