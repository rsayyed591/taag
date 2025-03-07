import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, Trash2, Send, Check, Edit2, X } from 'lucide-react';
import { IonAlert } from "@ionic/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
function ViewInvoice() {
  const { brandName } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);
  const [chats, setChats] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertButtons, setAlertButtons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load invoice from localStorage
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    const currentInvoice = invoices.find((inv) => inv.brandName === brandName);
    if (currentInvoice) {
      setInvoice(currentInvoice);
    }

    // Load chats from localStorage
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}");
    
    // Convert chat history object to array for display
    const chatArray = Object.keys(chatHistory).map(chatName => ({
      id: chatName,
      name: chatName
    }));
    
    // If no chats in localStorage, use demo data
    if (chatArray.length === 0) {
      setChats([
        { id: 1, name: "MamaEarth" },
        { id: 2, name: "Nykaa" },
        { id: 3, name: "Adidas" },
        { id: 4, name: "Nike" },
      ]);
    } else {
      setChats(chatArray);
    }
  }, [brandName]);

  const generatePDF = () => {
    if (!invoice) return null;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(18, 118, 106); // #12766A
    doc.text("INVOICE", 105, 20, { align: "center" });
    
    // Add invoice number
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice #: ${invoice.invoiceNumber.invoiceNumber || "N/A"}`, 105, 30, { align: "center" });
    
    // Add company details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${invoice.companyDetails.companyName || "Company Name"}`, 20, 45);
    doc.setFontSize(10);
    doc.text(`${invoice.companyDetails.address || "Address"}`, 20, 52);
    
    if (invoice.companyDetails.gstin) {
      doc.text(`GSTIN: ${invoice.companyDetails.gstin}`, 20, 59);
    }
    
    if (invoice.companyDetails.pan) {
      doc.text(`PAN: ${invoice.companyDetails.pan}`, 20, 66);
    }
    
    // Add invoice details on the right
    doc.setFontSize(10);
    doc.text("Invoice Date:", 150, 45);
    doc.text(`${invoice.invoiceNumber.invoiceDate || new Date().toLocaleDateString()}`, 180, 45);
    
    doc.text("Due Date:", 150, 52);
    doc.text(`${invoice.invoiceNumber.dueDate || new Date().toLocaleDateString()}`, 180, 52);
    
    // Add bill to section
    doc.setFontSize(12);
    doc.text("Bill To:", 20, 80);
    doc.setFontSize(11);
    doc.text(`${invoice.brandName}`, 20, 87);
    doc.setFontSize(10);
    doc.text(`${invoice.campaignName || "Campaign"}`, 20, 94);
    
    // Add invoice items table
    const tableColumn = ["Description", "Amount"];
    const tableRows = [];
    
    invoice.amountDetails.particulars.forEach((item) => {
      const itemData = [
        item.description || "Item",
        `₹${Number.parseFloat(item.amount || 0).toFixed(2)}`
      ];
      tableRows.push(itemData);
    });
    
    autoTable(doc,{
      startY: 105,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [18, 118, 106] }
    });
    
    // Add summary
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Calculate totals
    const subtotal = invoice.amountDetails.particulars.reduce(
      (sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0
    );
    
    const taxRate = invoice.amountDetails.taxRate || 0;
    const taxAmount = invoice.amountDetails.taxType === "No Tax" 
      ? 0 
      : (subtotal * taxRate / 100);
    
    const total = subtotal + taxAmount;
    
    // Add summary table
    doc.setFontSize(10);
    doc.text("Summary", 140, finalY);
    
    doc.text("Subtotal:", 140, finalY + 7);
    doc.text(`₹${subtotal.toFixed(2)}`, 180, finalY + 7, { align: "right" });
    
    if (invoice.amountDetails.taxType !== "No Tax") {
      doc.text(`${invoice.amountDetails.taxType} (${taxRate}%):`, 140, finalY + 14);
      doc.text(`₹${taxAmount.toFixed(2)}`, 180, finalY + 14, { align: "right" });
    }
    
    doc.setFontSize(12);
    doc.text("Total:", 140, finalY + 21);
    doc.text(`₹${total.toFixed(2)}`, 180, finalY + 21, { align: "right" });
    
    // Add payment information
    doc.setFontSize(11);
    doc.text("Payment Information", 20, finalY + 35);
    doc.setFontSize(10);
    doc.text(`Account Type: ${invoice.accountDetails.accountType || "N/A"}`, 20, finalY + 42);
    doc.text(`Beneficiary: ${invoice.accountDetails.beneficiaryName || "N/A"}`, 20, finalY + 49);
    doc.text(`Account No: ${invoice.accountDetails.accountNumber || "N/A"}`, 20, finalY + 56);
    doc.text(`Bank: ${invoice.accountDetails.bankName || "N/A"}`, 20, finalY + 63);
    doc.text(`IFSC: ${invoice.accountDetails.ifscCode || "N/A"}`, 20, finalY + 70);
    
    // Add notes if available
    if (invoice.notes) {
      doc.setFontSize(11);
      doc.text("Notes", 20, finalY + 85);
      doc.setFontSize(10);
      doc.text(invoice.notes, 20, finalY + 92);
    }
    
    // Add footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 105, 280, { align: "center" });
    
    return doc;
  };

  const handleDownloadPDF = () => {
    const pdf = generatePDF();
    if (pdf) {
      pdf.save(`invoice-${invoice.brandName}.pdf`);
    }
    setShowMenu(false);
  };

  const handleShare = async () => {
    try {
      const pdf = generatePDF();
      if (!pdf) return;
      
      const pdfBlob = pdf.output('blob');
      
      if (navigator.share) {
        await navigator.share({
          title: `Invoice - ${invoice.brandName}`,
          text: "Check out this invoice",
          files: [new File([pdfBlob], `invoice-${invoice.brandName}.pdf`, { type: "application/pdf" })]
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      }
      setShowMenu(false);
    } catch (error) {
      console.error("Error sharing:", error);
      showIonicAlert("Error", "Failed to share the invoice. Please try again.");
    }
  };

  const handleDelete = () => {
    setAlertHeader("Confirm Delete");
    setAlertMessage("Are you sure you want to delete this invoice?");
    setAlertButtons([
      {
        text: "Cancel",
        role: "cancel"
      },
      {
        text: "Delete",
        handler: () => {
          const invoices = JSON.parse(localStorage.getItem("invoices") || "[]");
          const updatedInvoices = invoices.filter((inv) => inv.brandName !== brandName);
          localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
          navigate("/invoice");
        }
      }
    ]);
    setShowAlert(true);
    setShowMenu(false);
  };

  const handleEdit = () => {
    // Save current invoice as draft for editing
    localStorage.setItem("invoiceDraft", JSON.stringify(invoice));
    localStorage.setItem("editingInvoiceId", invoice.id); // Store the ID of the invoice being edited
    navigate("/invoice/new-invoice");
    setShowMenu(false);
  };

  const handleForward = () => {
    setShowForwardModal(true);
    setShowMenu(false);
  };

  const toggleChatSelection = (chatId) => {
    if (selectedChats.includes(chatId)) {
      setSelectedChats(selectedChats.filter((id) => id !== chatId));
    } else {
      setSelectedChats([...selectedChats, chatId]);
    }
  };

  const handleForwardToChats = () => {
    // Update chat history in localStorage
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}");

    selectedChats.forEach((chatId) => {
      const chat = chats.find((c) => c.id === chatId);
      if (chat) {
        if (!chatHistory[chat.name]) {
          chatHistory[chat.name] = [];
        }

        chatHistory[chat.name].push({
          id: Math.floor(Math.random() * 1000000),
          type: "invoice",
          content: `Invoice for ${invoice.brandName}`,
          invoiceId: invoice.id,
          timestamp: new Date().toISOString(),
          sender: "me"
        });
      }
    });

    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    setShowForwardModal(false);

    // Show success message
    showIonicAlert("Success", `Invoice forwarded to ${selectedChats.length} chat(s)`);
  };

  const showIonicAlert = (header, message) => {
    setAlertHeader(header);
    setAlertMessage(message);
    setAlertButtons(["OK"]);
    setShowAlert(true);
  };

  if (!invoice) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  // Calculate total amount
  const calculateSubtotal = () => {
    return invoice.amountDetails.particulars?.reduce((sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0) || 0;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return invoice.amountDetails.taxType === "No Tax"
      ? 0
      : (subtotal * (Number.parseFloat(invoice.amountDetails.taxRate) || 0)) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const calculateTotalReceived = () => {
    return (invoice.amountDetails.receivedPayments || []).reduce(
      (sum, payment) => sum + (Number.parseFloat(payment.amount) || 0),
      0,
    );
  };

  const calculateDueAmount = () => {
    return calculateTotal() - calculateTotalReceived();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/invoice")} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-medium">{invoice.brandName}'s Invoice</h1>
        </div>
        <button onClick={() => setShowMenu(!showMenu)} className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Menu Dropdown */}
      {showMenu && (
        <div className="absolute right-4 top-16 bg-white rounded-lg shadow-lg z-50 w-48">
          <button onClick={handleEdit} className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-left">
            <Edit2 className="w-5 h-5" />
            <span>Edit Invoice</span>
          </button>
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-left">
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-left">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
          <button onClick={handleForward} className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-left">
            <Send className="w-5 h-5" />
            <span>Forward</span>
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-left text-red-500">
            <Trash2 className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Forward Modal - More Compact */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-xs overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b">
              <h2 className="text-base font-medium">Forward Invoice</h2>
              <button onClick={() => setShowForwardModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-2 max-h-60 overflow-y-auto">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => toggleChatSelection(chat.id)}
                >
                  <div className="w-8 h-8 bg-[#12766A20] rounded-full flex items-center justify-center text-[#12766A] font-medium text-sm">
                    {chat.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-sm">
                    <h3 className="font-medium">{chat.name}</h3>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedChats.includes(chat.id) ? "bg-[#12766A] border-[#12766A]" : "border-gray-300"
                    }`}
                  >
                    {selectedChats.includes(chat.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-2 p-3 border-t">
              <button
                onClick={() => setShowForwardModal(false)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleForwardToChats}
                className="px-3 py-1.5 text-sm bg-[#12766A] text-white rounded-md flex items-center gap-1"
                disabled={selectedChats.length === 0}
              >
                <Send className="w-3 h-3" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Content */}
      <div id="invoice-content" className="p-4 bg-white mx-4 my-4 rounded-lg shadow-sm max-w-3xl md:mx-auto">
        {/* Professional Invoice Header */}
        <div className="flex flex-row justify-between items-start mb-6 border-b pb-4">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl md:text-2xl font-bold text-[#12766A]">INVOICE</h1>
            <p className="text-sm text-gray-600">{invoice.invoiceNumber.invoiceNumber || "INV-" + Date.now()}</p>
          </div>
          <div className="md:text-right">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-md flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-[#12766A]">{invoice.companyDetails.companyName || "LOGO"}</span>
            </div>
            <p className="text-sm font-medium">{invoice.companyDetails.companyName || "Your Company"}</p>
            <p className="text-xs text-gray-600 whitespace-pre-line">
              {invoice.companyDetails.address || "Company Address"}
            </p>
          </div>
        </div>

        {/* Bill To & Invoice Details */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold mb-1">Bill To:</h2>
            <p className="text-sm font-medium">{invoice.brandName}</p>
            <p className="text-xs text-gray-600">{invoice.campaignName}</p>
          </div>
          <div className="md:text-right">
            <div className="grid grid-cols-2 gap-1 text-xs">
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
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-3 text-left text-xs font-semibold border-b border-gray-200">Description</th>
                <th className="py-2 px-3 text-right text-xs font-semibold border-b border-gray-200">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.amountDetails.particulars?.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 px-3 text-sm">{item.description || "Item Description"}</td>
                  <td className="py-2 px-3 text-right text-sm">₹{Number.parseFloat(item.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="py-2 px-3 text-right text-sm font-medium">Subtotal</td>
                <td className="py-2 px-3 text-right text-sm">₹{calculateSubtotal().toFixed(2)}</td>
              </tr>
              {invoice.amountDetails.taxType !== "No Tax" && (
                <tr>
                  <td className="py-2 px-3 text-right text-sm font-medium">
                    {invoice.amountDetails.taxType} ({invoice.amountDetails.taxRate}%)
                  </td>
                  <td className="py-2 px-3 text-right text-sm">₹{calculateTax().toFixed(2)}</td>
                </tr>
              )}
              <tr className="bg-gray-50">
                <td className="py-2 px-3 text-right text-sm font-bold">Total</td>
                <td className="py-2 px-3 text-right text-sm font-bold">₹{calculateTotal().toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Status */}
        {(invoice.amountDetails.receivedPayments || []).length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-semibold mb-2">Payment Status</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-3 text-left text-xs font-medium border-b border-gray-200">Date</th>
                    <th className="py-2 px-3 text-left text-xs font-medium border-b border-gray-200">Method</th>
                    <th className="py-2 px-3 text-right text-xs font-medium border-b border-gray-200">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.amountDetails.receivedPayments.map((payment, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-3 text-xs">{payment.date}</td>
                      <td className="py-2 px-3 text-xs">{payment.method}</td>
                      <td className="py-2 px-3 text-right text-xs">₹{Number.parseFloat(payment.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td colSpan="2" className="py-2 px-3 text-right text-xs font-medium">
                      Total Received
                    </td>
                    <td className="py-2 px-3 text-right text-xs font-medium">₹{calculateTotalReceived().toFixed(2)}</td>
                  </tr>
                  <tr className="bg-[#12766A10]">
                    <td colSpan="2" className="py-2 px-3 text-right text-xs font-bold">
                      Amount Due
                    </td>
                    <td className="py-2 px-3 text-right text-xs font-bold">₹{calculateDueAmount().toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-6">
            <h2 className="text-base font-semibold mb-2">Notes</h2>
            <p className="p-3 bg-gray-50 rounded-md text-xs text-gray-600">{invoice.notes}</p>
          </div>
        )}

        {/* Payment Information */}
        <div className="mb-6">
          <h2 className="text-base font-semibold mb-2">Payment Information</h2>
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="grid grid-cols-2 gap-2 text-xs">
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
        <div className="flex justify-end mt-6 pt-4 border-t">
          {invoice.signature ? (
            <div className="text-center">
              <img src={invoice.signature || "/placeholder.svg"} alt="Digital Signature" className="max-h-16 mb-1" />
              <p className="text-xs font-medium">Authorized Signature</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="h-12 w-32 border border-dashed border-gray-300 mb-1 flex items-center justify-center text-gray-400 text-xs">
                No Signature
              </div>
              <p className="text-xs font-medium">Authorized Signature</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
          <p>Thank you for your business!</p>
          <p className="text-xs">This is a computer-generated invoice and does not require a physical signature.</p>
        </div>
      </div>

      {/* Ionic Alert */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={alertHeader}
        message={alertMessage}
        buttons={alertButtons}
      />
    </div>
  );
}

export default ViewInvoice;
