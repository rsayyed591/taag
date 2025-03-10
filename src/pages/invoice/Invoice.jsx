import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PlusCircle, X, Calendar, DollarSign } from 'lucide-react'
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
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState({
    date: new Date().toISOString().split('T')[0],
    method: "Bank Transfer",
    amount: ""
  })

  useEffect(() => {
    loadInvoices();
    setTimeout(() => setShowSpotlight(true), 1000)
  }, [])

  const loadInvoices = () => {
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || []
    setInvoices(storedInvoices)
    setHasInvoices(storedInvoices.length > 0)
    
    // Calculate total and received amounts
    const total = storedInvoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0)
    setTotalAmount(total)
    
    const received = storedInvoices.reduce((sum, invoice) => {
      const invoiceReceived = (invoice.amountDetails.receivedPayments || []).reduce(
        (paymentSum, payment) => paymentSum + (Number(payment.amount) || 0), 0
      );
      return sum + invoiceReceived;
    }, 0);
    
    setReceivedAmount(received);
  }

  const handleInvoiceClick = (brandName) => {
    navigate(`/invoice/${brandName}`)
  }

  const openAddPaymentModal = (invoice) => {
    setSelectedInvoice(invoice);
    setShowAddPaymentModal(true);
  }

  const handleAddPayment = () => {
    if (!selectedInvoice || !paymentDetails.amount || Number(paymentDetails.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    // Update the invoice with the new payment
    const updatedInvoices = invoices.map(invoice => {
      if (invoice.id === selectedInvoice.id) {
        const updatedInvoice = {
          ...invoice,
          amountDetails: {
            ...invoice.amountDetails,
            receivedPayments: [
              ...(invoice.amountDetails.receivedPayments || []),
              paymentDetails
            ]
          }
        };
        
        // Recalculate received amount
        const receivedAmount = updatedInvoice.amountDetails.receivedPayments.reduce(
          (sum, payment) => sum + (Number(payment.amount) || 0), 0
        );
        
        updatedInvoice.receivedAmount = receivedAmount;
        updatedInvoice.dueAmount = updatedInvoice.amount - receivedAmount;
        
        return updatedInvoice;
      }
      return invoice;
    });

    // Save to localStorage
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    
    // Reset and close modal
    setInvoices(updatedInvoices);
    setPaymentDetails({
      date: new Date().toISOString().split('T')[0],
      method: "Bank Transfer",
      amount: ""
    });
    setShowAddPaymentModal(false);
    setSelectedInvoice(null);
    
    // Recalculate totals
    loadInvoices();
  }

  const spotlightSteps = [
    {
      title: "Total Amount",
      description: "Here you can see the total and received invoice amounts.",
      position: { top: "150px", left: "50px" },
    },
    {
      title: "Create New Invoice",
      description: "Click here to create a new invoice instantly.",
      position: { top: "320px", left: "50px" },
    },
    {
      title: "Search & Filter",
      description: "Use this search bar to quickly find invoices.",
      position: { top: "400px", left: "50px" },
    },
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
          onClick={() => {
            // Clear any existing draft
            localStorage.removeItem("invoiceDraft");
            navigate("/invoice/new-invoice");
          }}
          className="w-full max-w-full h-[39px] bg-[#E4E4E4] rounded-b-[5px] text-center font-medium hover:bg-gray-300 transition"
        >
          NEW INVOICE +
        </button>

      <SearchBar onSearch={(term) => console.log("Search:", term)} onFilter={() => console.log("Filter clicked")} className="mt-4" />

      {hasInvoices ? (
        <div className="space-y-4 mt-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => handleInvoiceClick(invoice.brandName)}>
                <div>
                  <h3 className="font-medium">{invoice.brandName}</h3>
                  <p className="text-sm text-gray-500">{invoice.campaignName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{(invoice.amount || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{invoice.date || "N/A"}</p>
                </div>
              </div>
              
              {/* Payment progress */}
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">Payment Status</span>
                  <span className="text-sm font-medium">
                    ₹{(invoice.receivedAmount || 0).toLocaleString()} / ₹{(invoice.amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-[#12766A] h-1.5 rounded-full"
                    style={{ width: invoice.amount > 0 ? `${((invoice.receivedAmount || 0) / invoice.amount) * 100}%` : "0%" }}
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddPaymentModal(invoice);
                    }}
                    className="text-[#12766A] text-sm font-medium flex items-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Payment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState type="invoice" onNext={() => {
          localStorage.removeItem("invoiceDraft");
          navigate("/invoice/new-invoice");
        }} className="mt-4" />
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Add Payment</h2>
              <button onClick={() => setShowAddPaymentModal(false)} className="text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDetails.date}
                  onChange={(e) => setPaymentDetails({...paymentDetails, date: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentDetails.method}
                  onChange={(e) => setPaymentDetails({...paymentDetails, method: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Check">Check</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentDetails.amount}
                  onChange={(e) => setPaymentDetails({...paymentDetails, amount: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPayment}
                  className="px-4 py-2 bg-[#12766A] text-white rounded-md"
                >
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation activeTab="invoice" className="fixed bottom-0 w-full bg-white shadow-md" />
    </div>
  )
}

export default Invoice
