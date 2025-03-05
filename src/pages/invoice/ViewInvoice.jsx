"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import InvoiceHeader from "../../components/invoice/InvoiceHeader"
import { Download, Share2, Trash2, Send } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

function ViewInvoice() {
  const { brandName } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [selectedChat, setSelectedChat] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Load invoice from localStorage
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    console.log("invoices", invoices)
    const currentInvoice = invoices.find((inv) => inv.brandName === brandName)
    if (currentInvoice) {
      setInvoice(currentInvoice)
    }
  }, [brandName])

  const handleDownloadPDF = async () => {
    const element = document.getElementById("invoice-content"); // Your invoice container
    const pdf = new jsPDF("p", "mm", "a4"); // A4 size in portrait
  
    await pdf.html(element, {
      callback: function (pdf) {
        pdf.save(`invoice-${brandName}.pdf`);
      },
      x: 10, // Adjust margins
      y: 10,
      width: 190, // Fit to A4 width
      windowWidth: element.scrollWidth, // Capture full width
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

  const handleForward = () => {
    setShowForwardModal(true)
    setShowMenu(false)
  }

  const handleForwardToChat = () => {
    // Implement forward to selected chat
    console.log("Forwarding to chat:", selectedChat)
    setShowForwardModal(false)
  }

  if (!invoice) return <div>Loading...</div>

  // Calculate total amount
  const calculateSubtotal = () => {
    return invoice.amountDetails.particulars?.reduce((sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0) || 0
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    return (subtotal * (Number.parseFloat(invoice.amountDetails.taxRate) || 0)) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
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
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100">
            <Download className="w-4 h-4" />
            Download as PDF
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
            Delete Invoice
          </button>
          <button onClick={handleForward} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100">
            <Send className="w-4 h-4" />
            Forward to Chats
          </button>
        </div>
      )}

      {showForwardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-80">
            <h2 className="text-lg font-medium mb-4">Forward Invoice to:</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {["MamaEarth", "Nykaa", "Adidas", "Nike"].map((chat) => (
                <label key={chat} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
                  <input
                    type="radio"
                    name="chat"
                    value={chat}
                    checked={selectedChat === chat}
                    onChange={() => setSelectedChat(chat)}
                    className="w-4 h-4"
                  />
                  {chat}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowForwardModal(false)} className="px-4 py-2 border border-gray-300 rounded">
                Cancel
              </button>
              <button
                onClick={handleForwardToChat}
                className="px-4 py-2 bg-[#12766A] text-white rounded"
                disabled={!selectedChat}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="invoice-content" className="p-4 bg-white">
        <div className="mb-6">
          <h2 className="text-xl font-medium">{invoice.brandName}</h2>
          <p className="text-gray-500">{invoice.campaignName}</p>
        </div>

        <div className="space-y-4">
          {/* Invoice Number */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Invoice Number</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Invoice #</p>
                <p>{invoice.invoiceNumber.invoiceNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Invoice Date</p>
                <p>{invoice.invoiceNumber.invoiceDate || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p>{invoice.invoiceNumber.dueDate || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Company Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p>{invoice.companyDetails.companyName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p>{invoice.companyDetails.address || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GSTIN</p>
                <p>{invoice.companyDetails.gstin || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PAN</p>
                <p>{invoice.companyDetails.pan || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Amount Details */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Amount Details</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-2">Particulars</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.amountDetails.particulars?.map((item, index) => (
                  <tr key={index}>
                    <td className="py-1">{item.description}</td>
                    <td className="py-1 text-right">₹{Number.parseFloat(item.amount).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="border-t">
                  <td className="py-1 font-medium">Subtotal</td>
                  <td className="py-1 text-right">₹{calculateSubtotal().toFixed(2)}</td>
                </tr>
                {invoice.amountDetails.taxType !== "No Tax" && (
                  <tr>
                    <td className="py-1">Tax ({invoice.amountDetails.taxRate}%)</td>
                    <td className="py-1 text-right">₹{calculateTax().toFixed(2)}</td>
                  </tr>
                )}
                <tr className="font-bold">
                  <td className="py-1">Grand Total</td>
                  <td className="py-1 text-right">₹{calculateTotal().toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Notes</h3>
            <p>{invoice.notes || "No notes added"}</p>
          </div>

          {/* Digital Signature */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Digital Signature</h3>
            {invoice.signature ? (
              <img src={invoice.signature || "/placeholder.svg"} alt="Signature" className="max-h-20" />
            ) : (
              <p>No signature added</p>
            )}
          </div>

          {/* Account Details */}
          <div>
            <h3 className="font-medium mb-2">Account Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p>{invoice.accountDetails.accountType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Beneficiary Name</p>
                <p>{invoice.accountDetails.beneficiaryName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Number</p>
                <p>{invoice.accountDetails.accountNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bank Name</p>
                <p>{invoice.accountDetails.bankName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IFSC Code</p>
                <p>{invoice.accountDetails.ifscCode || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewInvoice

