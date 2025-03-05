"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SearchBar from "../../components/SearchBar"
import EmptyState from "../../components/EmptyState"
import BottomNavigation from "../../components/BottomNavigation"
import OnboardingSpotlight from "../../components/OnboardingSpotlight"

function Invoice() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [hasInvoices, setHasInvoices] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const [receivedAmount, setReceivedAmount] = useState(0)
  const [showSpotlight, setShowSpotlight] = useState(false)

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || []
    setInvoices(storedInvoices)
    setHasInvoices(storedInvoices.length > 0)
    
    const total = storedInvoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0)
    setTotalAmount(total)
    setReceivedAmount(total * 0.6)
    
    setTimeout(() => setShowSpotlight(true), 1000)
  }, [])

  const handleInvoiceClick = (brandName) => {
    navigate(`/invoice/${brandName}`)
  }

  const spotlightSteps = [
    { title: "Total Amount", description: "Here you can see the total and received invoice amounts.", position: { top: "150px", left: "50px" } },
    { title: "Create New Invoice", description: "Click here to create a new invoice instantly.", position: { top: "320px", left: "50px" } },
    { title: "Search & Filter", description: "Use this search bar to quickly find invoices.", position: { top: "400px", left: "50px" } },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20 px-4 md:px-8 py-6 md:py-12">
      {showSpotlight && <OnboardingSpotlight steps={spotlightSteps} onComplete={() => setShowSpotlight(false)} />}

      <h1 className="text-2xl font-bold mb-4">Invoicing</h1>

      <div className="w-full max-w-full bg-[#EAEAEA] rounded-t-[5px] p-4">
          <div className="my-4">
            <p className="text-[17px] font-medium leading-[23.22px] text-[#1D1D1F]">
              Total amount: <span className="font-extrabold">₹ {totalAmount.toLocaleString()}</span>
            </p>
          </div>

          <div className="w-full bg-[#D9D9D9] rounded-full h-2">
            <div
              className="bg-[#12766A] h-2 rounded-full"
              style={{ width: totalAmount > 0 ? `${(receivedAmount / totalAmount) * 100}%` : "0%" }}
            />
          </div>
          <div className="flex justify-between mt-4 mb-4">
            <span className="flex items-center">
              <div className="w-[11px] h-[11px] bg-[#12766A] rounded-full mr-2" />
              Received: ₹ {receivedAmount.toLocaleString()}
            </span>
            <span className="flex items-center">
              <div className="w-[11px] h-[11px] bg-[#D9D9D9] rounded-full mr-2" />
              Due: ₹ {(totalAmount - receivedAmount).toLocaleString()}
            </span>
          </div>
        </div>

        {/* New Invoice Button */}
        <button
          onClick={() => navigate("/invoice/new-invoice")}
          className="w-full max-w-full h-[39px] bg-[#E4E4E4] rounded-b-[5px] text-center font-medium hover:bg-gray-300 transition"
        >
          NEW INVOICE +
        </button>

      <SearchBar onSearch={(term) => console.log("Search:", term)} onFilter={() => console.log("Filter clicked")} className="mt-4" />

      {hasInvoices ? (
        <div className="space-y-4 mt-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer" onClick={() => handleInvoiceClick(invoice.brandName)}>
              <div>
                <h3 className="font-medium">{invoice.brandName}</h3>
                <p className="text-sm text-gray-500">{invoice.campaignName}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{(invoice.amount || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">{invoice.date || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState type="invoice" onNext={() => navigate("/invoice/new-invoice")} className="mt-4" />
      )}

      <BottomNavigation activeTab="invoice" className="fixed bottom-0 w-full bg-white shadow-md" />
    </div>
  )
}

export default Invoice
