"use client"

import { IonAlert } from "@ionic/react"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { ArrowLeft, Upload, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid/v4"
import { useAuth } from "../../context/AuthContext"
import { useInvoices } from "../../hooks/useInvoices"
import { getUserProfile } from "../../services/userProfile"

function NewInvoice() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createInvoice, loading } = useInvoices()
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const [invoiceData, setInvoiceData] = useState({
    brandName: "",
    campaignName: "",
    invoiceDetails: {
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
    accountDetails: {
      accountType: "savings",
      beneficiaryName: "",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
    },
    notes: "",
    signature: null,
    signatureFile: null,
  })

  // Fetch and fill user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { success, profile } = await getUserProfile();
        if (success && profile) {
          // Pre-fill invoice data with user profile data
          setInvoiceData(prev => ({
            ...prev,
            companyDetails: {
              ...prev.companyDetails,
              companyName: profile.creatorDetails?.name || "",
              address: profile.creatorDetails?.location || "",
              gstin: profile.bankDetails?.gstin || "",
              pan: profile.bankDetails?.pan || "",
            },
            accountDetails: {
              ...prev.accountDetails,
              accountType: profile.bankDetails?.accountType || "savings",
              beneficiaryName: profile.bankDetails?.beneficiaryName || "",
              accountNumber: profile.bankDetails?.accountNumber || "",
              bankName: profile.bankDetails?.bankName || "",
              ifscCode: profile.bankDetails?.ifscCode || "",
            },
            signature: profile.bankDetails?.signature || null,
            signatureFile: profile.bankDetails?.signatureFile || null,
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData((prev) => ({
          ...prev,
          signature: reader.result,
          signatureFile: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  // Validation functions
  const validateAmount = (value) => {
    const amount = Number(value);
    return !isNaN(amount) && amount >= 0;
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateGSTIN = (gstin) => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const validateAccountNumber = (number) => {
    const accountRegex = /^\d{9,18}$/;  // Between 9 and 18 digits
    return accountRegex.test(number);
  };

  const validateIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s.'-]+$/;
    return nameRegex.test(name);
  };

  // Remove validation from change handlers and only collect data
  const handleParticularChange = (index, field, value) => {
    const newParticulars = [...invoiceData.amountDetails.particulars];
    newParticulars[index] = { ...newParticulars[index], [field]: value };
    handleChange("amountDetails", {
      ...invoiceData.amountDetails,
      particulars: newParticulars,
    });
  };

  const handleCompanyDetailsChange = (field, value) => {
    handleChange("companyDetails", {
      ...invoiceData.companyDetails,
      [field]: field === "pan" ? value.toUpperCase() : value,
    });
  };

  const handleBankDetailsChange = (field, value) => {
    handleChange("accountDetails", {
      ...invoiceData.accountDetails,
      [field]: field === "ifscCode" ? value.toUpperCase() : value,
    });
  };

  const calculateSubtotal = () => {
    return invoiceData.amountDetails.particulars.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    )
  }

  const calculateTax = () => {
    if (invoiceData.amountDetails.taxType === "No Tax") return 0
    return (calculateSubtotal() * invoiceData.amountDetails.taxRate) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSignatureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Validate file size (2MB limit)
      const TWO_MB = 2 * 1024 * 1024;
      if (file.size > TWO_MB) {
        setAlertMessage("Signature file size must be less than 2MB");
        setShowAlert(true);
        return;
      }

      // Validate file type
      const fileType = file.type;
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(fileType)) {
        setAlertMessage("Only PNG and JPG files are allowed");
        setShowAlert(true);
        return;
      }

      // Store the file in invoiceData for later upload
      handleChange("signature", file);
    } catch (error) {
      console.error("Error handling signature:", error);
      setAlertMessage("Error handling signature file");
      setShowAlert(true);
    }
  };

  // Modified handleSave with all validations
  const handleSave = async () => {
    try {
      const errors = [];

      // Required fields validation
      if (!invoiceData.brandName.trim()) {
        errors.push("Please enter a brand name");
      }

      // Validate all particulars
      invoiceData.amountDetails.particulars.forEach((item, index) => {
        if (!item.description.trim()) {
          errors.push(`Description is required for particular ${index + 1}`);
        }
        if (!validateAmount(item.amount)) {
          errors.push(`Invalid amount for particular ${index + 1}`);
        }
      });

      // Bank details validation if any bank detail is provided
      const hasBankDetails = Object.values(invoiceData.accountDetails).some(value => value);
      if (hasBankDetails) {
        if (!validateAccountNumber(invoiceData.accountDetails.accountNumber)) {
          errors.push("Invalid account number (should be 9-18 digits)");
        }
        if (!validateIFSC(invoiceData.accountDetails.ifscCode)) {
          errors.push("Invalid IFSC code (should be like SBIN0123456)");
        }
        if (!validateName(invoiceData.accountDetails.beneficiaryName)) {
          errors.push("Beneficiary name should contain only letters and spaces");
        }
      }

      // Company details validation if provided
      if (invoiceData.companyDetails.pan && !validatePAN(invoiceData.companyDetails.pan)) {
        errors.push("Invalid PAN format (should be like ABCDE1234F)");
      }
      if (invoiceData.companyDetails.gstin && !validateGSTIN(invoiceData.companyDetails.gstin)) {
        errors.push("Invalid GSTIN format");
      }

      // If there are any errors, show them and stop
      if (errors.length > 0) {
        setAlertMessage(errors.join('\n'));
        setShowAlert(true);
        return;
      }

      // If all validations pass, proceed with save
      let signatureURL = null;
      if (invoiceData.signature instanceof File) {
        const storage = getStorage();
        const signatureRef = ref(storage, `signatures/${user.uid}/${uuidv4()}-${invoiceData.signature.name}`);
        await uploadBytes(signatureRef, invoiceData.signature);
        signatureURL = await getDownloadURL(signatureRef);
      }

      const invoiceWithTotals = {
        ...invoiceData,
        userId: user.uid,
        signature: signatureURL,
        amountDetails: {
          ...invoiceData.amountDetails,
          subtotal: calculateSubtotal(),
          tax: calculateTax(),
          total: calculateTotal(),
        },
        status: "active",
      };

      const newInvoice = await createInvoice(invoiceWithTotals);
      setAlertMessage("Invoice created successfully");
      setShowAlert(true);
      navigate(`/invoice/${newInvoice.id}`);
    } catch (error) {
      console.error("Error creating invoice:", error);
      setAlertMessage("Failed to create invoice");
      setShowAlert(true);
    }
  };

  const addParticular = () => {
    setInvoiceData(prev => ({
      ...prev,
      amountDetails: {
        ...prev.amountDetails,
        particulars: [
          ...prev.amountDetails.particulars,
          { description: "", amount: "" }
        ]
      }
    }));
  };

  const removeParticular = (index) => {
    setInvoiceData(prev => ({
      ...prev,
      amountDetails: {
        ...prev.amountDetails,
        particulars: prev.amountDetails.particulars.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-white shadow-sm">
        <button onClick={() => navigate("/invoice")} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">New Invoice</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Basic Info */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name*
                </label>
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
                  value={invoiceData.invoiceDetails.invoiceNumber}
                  onChange={(e) => handleChange("invoiceDetails", { ...invoiceData.invoiceDetails, invoiceNumber: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="INV-001"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceData.invoiceDetails.invoiceDate}
                    onChange={(e) => handleChange("invoiceDetails", { ...invoiceData.invoiceDetails, invoiceDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoiceData.invoiceDetails.dueDate}
                    onChange={(e) => handleChange("invoiceDetails", { ...invoiceData.invoiceDetails, dueDate: e.target.value })}
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
                  value={invoiceData.companyDetails.companyName}
                  onChange={(e) => handleCompanyDetailsChange("companyName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={invoiceData.companyDetails.address}
                  onChange={(e) => handleChange("companyDetails", { ...invoiceData.companyDetails, address: e.target.value })}
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
                    value={invoiceData.companyDetails.gstin}
                    onChange={(e) => handleCompanyDetailsChange("gstin", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="GSTIN number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
                  <input
                    type="text"
                    value={invoiceData.companyDetails.pan}
                    onChange={(e) => handleCompanyDetailsChange("pan", e.target.value.toUpperCase())}
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

                {invoiceData.amountDetails.particulars.map((item, index) => (
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

                    {invoiceData.amountDetails.particulars.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParticular(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addParticular}
                  className="mt-2 flex items-center gap-1 text-[#12766A] hover:text-[#0d5951]"
                >
                  <span className="text-xl">+</span> Add Particular
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Settings</label>

                <div className="flex flex-wrap gap-4 mb-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="taxType"
                      checked={invoiceData.amountDetails.taxType === "CGST/SGST"}
                      onChange={() => handleChange("amountDetails", { ...invoiceData.amountDetails, taxType: "CGST/SGST" })}
                      className="w-4 h-4 text-[#12766A]"
                    />
                    CGST/SGST
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="taxType"
                      checked={invoiceData.amountDetails.taxType === "IGST"}
                      onChange={() => handleChange("amountDetails", { ...invoiceData.amountDetails, taxType: "IGST" })}
                      className="w-4 h-4 text-[#12766A]"
                    />
                    IGST
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="taxType"
                      checked={invoiceData.amountDetails.taxType === "No Tax"}
                      onChange={() => handleChange("amountDetails", { ...invoiceData.amountDetails, taxType: "No Tax" })}
                      className="w-4 h-4 text-[#12766A]"
                    />
                    No Tax
                  </label>
                </div>

                {invoiceData.amountDetails.taxType !== "No Tax" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={invoiceData.amountDetails.taxRate}
                      onChange={(e) => handleChange("amountDetails", { ...invoiceData.amountDetails, taxRate: e.target.value })}
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

                {invoiceData.amountDetails.taxType !== "No Tax" && (
                  <div className="flex justify-between mb-1">
                    <span>Tax ({invoiceData.amountDetails.taxRate}%)</span>
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
           {/* Digital Signature */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">Digital Signature</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="signature-upload"
            />
            <label
              htmlFor="signature-upload"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-[#D7D4D4] rounded-md cursor-pointer hover:border-[#12766A]"
            >
              {invoiceData.signature ? (
                <div className="flex items-center gap-2">
                  <span>{invoiceData.signatureFile}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleChange("signature", null)
                      handleChange("signatureFile", null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-[#6F6F6F] text-center">UPLOAD SIGNATURE (PNG, JPG, PDF) UNDER 3MB</span>
                </div>
              )}
            </label>
          </div>
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
                    onClick={() => handleChange("accountDetails", { ...invoiceData.accountDetails, accountType: "savings" })}
                    className={`px-4 py-2 rounded-full ${
                      invoiceData.accountDetails.accountType === "savings" ? "bg-[#12766A] text-white" : "bg-gray-200"
                    }`}
                  >
                    Savings
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange("accountDetails", { ...invoiceData.accountDetails, accountType: "current" })}
                    className={`px-4 py-2 rounded-full ${
                      invoiceData.accountDetails.accountType === "current" ? "bg-[#12766A] text-white" : "bg-gray-200"
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
                  value={invoiceData.accountDetails.beneficiaryName}
                  onChange={(e) => handleBankDetailsChange("beneficiaryName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Account holder name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account No.</label>
                <input
                  type="text"
                  value={invoiceData.accountDetails.accountNumber}
                  onChange={(e) => handleBankDetailsChange("accountNumber", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={invoiceData.accountDetails.bankName}
                  onChange={(e) => handleChange("accountDetails", { ...invoiceData.accountDetails, bankName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Bank name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={invoiceData.accountDetails.ifscCode}
                  onChange={(e) => handleBankDetailsChange("ifscCode", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="IFSC code"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="w-full max-w-md bg-[#12766A] text-white py-3 rounded-lg font-medium"
            >
              {loading ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>

      {/* Alert */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={"Alert"}
        message={alertMessage}
        buttons={["OK"]}
      />
    </div>
  )
}

export default NewInvoice

