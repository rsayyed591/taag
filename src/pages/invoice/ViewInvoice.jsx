"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import InvoiceHeader from "../../components/invoice/InvoiceHeader"
import { Download, Share2, Trash2, Send, Check, Edit2 } from 'lucide-react'
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

function ViewInvoice() {
  const { brandName } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [selectedChats, setSelectedChats] = useState([])
  const [chats, setChats] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Load invoice from localStorage
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    const currentInvoice = invoices.find((inv) => inv.brandName === brandName)
    if (currentInvoice) {
      setInvoice(currentInvoice)
    }

    // Load chats from localStorage
    const storedChats = JSON.parse(localStorage.getItem("chats") || "[]")
    setChats(
      storedChats.length > 0
        ? storedChats
        : [
            { id: 1, name: "MamaEarth" },
            { id: 2, name: "Nykaa" },
            { id: 3, name: "Adidas" },
            { id: 4, name: "Nike" },
          ],
    )
  }, [brandName])

  const handleDownloadPDF = () => {
    const element = document.getElementById("invoice-content");
    const pdf = new jsPDF("p", "pt", "a4");
    
    pdf.html(element, {
      callback: function(pdf) {
        pdf.save(`invoice-${brandName}.pdf`);
      },
      x: 15,
      y: 15,
      width: pdf.internal.pageSize.getWidth() - 30,
      windowWidth: 1000
    });
    
    setShowMenu(false);
  };

  const handleShare = async () => {
    try {
      const element = document.getElementById("invoice-content")
      const canvas = await html2canvas(element)
      const data = canvas.toDataURL("image/png")

      if (navigator.share) {
        await navigator.share({
          title: `Invoice - ${brandName}`,
          text: "Check out this invoice",
          files: [new File([data], "invoice.png", { type: "image/png" })],
        })
      }
      setShowMenu(false)
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")
      const updatedInvoices = invoices.filter((inv) => inv.brandName !== brandName)
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
      navigate("/invoice")
    }
    setShowMenu(false)
  }

  const handleEdit = () => {
    // Save current invoice as draft
    localStorage.setItem("invoiceDraft", JSON.stringify(invoice))
    navigate("/invoice/new-invoice")
    setShowMenu(false)
  }

  const handleForward = () => {
    setShowForwardModal(true)
    setShowMenu(false)
  }

  const toggleChatSelection = (chatId) => {
    if (selectedChats.includes(chatId)) {
      setSelectedChats(selectedChats.filter((id) => id !== chatId))
    } else {
      setSelectedChats([...selectedChats, chatId])
    }
  }

  const handleForwardToChats = () => {
    // Implement forward to selected chats
    console.log(
      "Forwarding to chats:",
      selectedChats.map((id) => chats.find((chat) => chat.id === id).name),
    )

    // Update chat history in localStorage
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}")

    selectedChats.forEach((chatId) => {
      const chat = chats.find((c) => c.id === chatId)
      if (chat) {
        if (!chatHistory[chat.name]) {
          chatHistory[chat.name] = []
        }

        chatHistory[chat.name].push({
          id: Date.now(),
          type: "invoice",
          content: `Invoice for ${invoice.brandName}`,
          invoiceId: invoice.id,
          timestamp: new Date().toISOString(),
        })
      }
    })

    localStorage.setItem("chatHistory", JSON.stringify(chatHistory))
    setShowForwardModal(false)

    // Show success message
    alert(`Invoice forwarded to ${selectedChats.length} chat(s)`)
  }

  if (!invoice) return <div>Loading...</div>

  // Calculate total amount
  const calculateSubtotal = () => {
    return invoice.amountDetails.particulars?.reduce((sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0) || 0
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    return invoice.amountDetails.taxType === "No Tax"
      ? 0
      : (subtotal * (Number.parseFloat(invoice.amountDetails.taxRate) || 0)) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const calculateTotalReceived = () => {
    return (invoice.amountDetails.receivedPayments || []).reduce(
      (sum, payment) => sum + (Number.parseFloat(payment.amount) || 0),
      0,
    )
  }

  const calculateDueAmount = () => {
    return calculateTotal() - calculateTotalReceived()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InvoiceHeader
        title={`${invoice.brandName}'s Invoice`}
        showMenu={true}
        onMenuClick={() => setShowMenu(!showMenu)}
      />

      {showMenu && (
        <div className="absolute right-4 top-16 bg-white rounded-lg shadow-lg z-50">
          <button onClick={handleEdit} className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-left">
            <Edit2 className="w-5 h-5" />
            Edit Invoice
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-left"
          >
            <Download className="w-5 h-5" />
            Download as PDF
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-left"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
          <button
            onClick={handleForward}
            className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-left"
          >
            <Send className="w-5 h-5" />
            Forward to Chats
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-left text-red-500"
          >
            <Trash2 className="w-5 h-5" />
            Delete Invoice
          </button>
        </div>
      )}

      {showForwardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-[90%] max-w-md max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Forward Invoice</h2>
              <span className="text-sm text-gray-500">{selectedChats.length} selected</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => toggleChatSelection(chat.id)}
                >
                  <div className="w-10 h-10 bg-[#12766A20] rounded-full flex items-center justify-center text-[#12766A] font-medium">
                    {chat.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{chat.name}</h3>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedChats.includes(chat.id) ? "bg-[#12766A] border-[#12766A]" : "border-gray-300"
                    }`}
                  >
                    {selectedChats.includes(chat.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
              <button
                onClick={() => setShowForwardModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleForwardToChats}
                className="px-4 py-2 bg-[#12766A] text-white rounded-md flex items-center gap-2"
                disabled={selectedChats.length === 0}
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="invoice-content" className="p-4 bg-white m-4 rounded-lg shadow-sm max-w-4xl mx-auto overflow-x-auto">
        {/* Professional Invoice Header */}
        <div className="flex flex-row justify-between items-start mb-8 border-b pb-4">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-[#12766A]">INVOICE</h1>
            <p className="text-gray-600">{invoice.invoiceNumber.invoiceNumber || "INV-" + Date.now()}</p>
          </div>
          <div className="md:text-right">
            <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mb-2">
              <span className="text-xl font-bold text-[#12766A]">{invoice.companyDetails.companyName}</span>
            </div>
            <p className="font-medium">{invoice.companyDetails.companyName || "Your Company"}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {invoice.companyDetails.address || "Company Address"}
            </p>
          </div>
        </div>

        {/* Bill To & Invoice Details */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
            <p className="font-medium">{invoice.brandName}</p>
            <p className="text-gray-600">{invoice.campaignName}</p>
          </div>
          <div className="md:text-right">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-600 text-left">Invoice Date:</p>
              <p className="font-medium">{invoice.invoiceNumber.invoiceDate || new Date().toLocaleDateString()}</p>

              <p className="text-gray-600 text-left">Due Date:</p>
              <p className="font-medium">{invoice.invoiceNumber.dueDate || new Date().toLocaleDateString()}</p>

              {invoice.companyDetails.gstin && (
                <>
                  <p className="text-gray-600 text-left">GSTIN:</p>
                  <p className="font-medium">{invoice.companyDetails.gstin}</p>
                </>
              )}

              {invoice.companyDetails.pan && (
                <>
                  <p className="text-gray-600 text-left">PAN:</p>
                  <p className="font-medium">{invoice.companyDetails.pan}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-8">
          <table className="w-full border-collapse min-w-full overflow-x-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200">Description</th>
                <th className="py-3 px-4 text-right font-semibold border-b border-gray-200">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.amountDetails.particulars?.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">{item.description || "Item Description"}</td>
                  <td className="py-3 px-4 text-right">₹{Number.parseFloat(item.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="py-3 px-4 text-right font-medium">Subtotal</td>
                <td className="py-3 px-4 text-right">₹{calculateSubtotal().toFixed(2)}</td>
              </tr>
              {invoice.amountDetails.taxType !== "No Tax" && (
                <tr>
                  <td className="py-3 px-4 text-right font-medium">
                    {invoice.amountDetails.taxType} ({invoice.amountDetails.taxRate}%)
                  </td>
                  <td className="py-3 px-4 text-right">₹{calculateTax().toFixed(2)}</td>
                </tr>
              )}
              <tr className="bg-gray-50">
                <td className="py-3 px-4 text-right font-bold">Total</td>
                <td className="py-3 px-4 text-right font-bold">₹{calculateTotal().toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Status */}
        {(invoice.amountDetails.receivedPayments || []).length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Payment Status</h2>
            <table className="w-full border-collapse min-w-full overflow-x-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 text-left font-medium border-b border-gray-200">Date</th>
                  <th className="py-2 px-4 text-left font-medium border-b border-gray-200">Method</th>
                  <th className="py-2 px-4 text-right font-medium border-b border-gray-200">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.amountDetails.receivedPayments.map((payment, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-4">{payment.date}</td>
                    <td className="py-2 px-4">{payment.method}</td>
                    <td className="py-2 px-4 text-right">₹{Number.parseFloat(payment.amount).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan="2" className="py-2 px-4 text-right font-medium">
                    Total Received
                  </td>
                  <td className="py-2 px-4 text-right font-medium">₹{calculateTotalReceived().toFixed(2)}</td>
                </tr>
                <tr className="bg-[#12766A10]">
                  <td colSpan="2" className="py-2 px-4 text-right font-bold">
                    Amount Due
                  </td>
                  <td className="py-2 px-4 text-right font-bold">₹{calculateDueAmount().toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Notes</h2>
            <p className="p-3 bg-gray-50 rounded-md text-gray-600">{invoice.notes}</p>
          </div>
        )}

        {/* Payment Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p className="text-gray-600">Account Type:</p>
              <p className="font-medium capitalize">{invoice.accountDetails.accountType || "N/A"}</p>

              <p className="text-gray-600">Beneficiary Name:</p>
              <p className="font-medium">{invoice.accountDetails.beneficiaryName || "N/A"}</p>

              <p className="text-gray-600">Bank Account:</p>
              <p className="font-medium">{invoice.accountDetails.accountNumber || "N/A"}</p>

              <p className="text-gray-600">Bank Name:</p>
              <p className="font-medium">{invoice.accountDetails.bankName || "N/A"}</p>

              <p className="text-gray-600">IFSC Code:</p>
              <p className="font-medium">{invoice.accountDetails.ifscCode || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="flex justify-end mt-8 pt-4 border-t">
          {invoice.signature ? (
            <div className="text-center">
              <img src={invoice.signature || "/placeholder.svg"} alt="Digital Signature" className="max-h-16 mb-2" />
              <p className="text-sm font-medium">Authorized Signature</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="h-16 w-40 border border-dashed border-gray-300 mb-2 flex items-center justify-center text-gray-400 text-sm">
                No Signature
              </div>
              <p className="text-sm font-medium">Authorized Signature</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p>This is a computer-generated invoice and does not require a physical signature.</p>
        </div>
      </div>
    </div>
  )
}

export default ViewInvoice
