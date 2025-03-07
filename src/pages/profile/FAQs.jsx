"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"

function FAQs() {
  const navigate = useNavigate()
  const [expandedIndex, setExpandedIndex] = useState(null)

  const faqs = [
    {
      question: "How do I create an invoice?",
      answer:
        'To create an invoice, go to the Invoice tab and click on "NEW INVOICE +". Fill in all the required details and click Save.',
    },
    {
      question: "How do I add my bank details?",
      answer: "Go to Profile > Invoice/Bank Details. Enter your bank account information and save the details.",
    },
    {
      question: "How do I manage my managers?",
      answer: "Visit Profile > Add/Remove Managers. Here you can add new managers and manage existing ones.",
    },
    {
      question: "What payment methods are supported?",
      answer: "We support bank transfers, UPI, and other digital payment methods. All payments are processed securely.",
    },
    {
      question: "How can users contact Taag for any problems?",
      answer:
        "You can reach us through: \n\nEmail: support@taag.com\nPhone: 1800-123-4567\nChat: Open the support chat in the app\n\nOur support team is available 24/7 to help you.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F2F1F1]">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-[#F2F1F1]">
  <button onClick={() => navigate("/profile")} className="inline-flex items-center p-2">
    <ArrowLeft className="w-5 h-5" />
  </button>
  <h1 className="text-lg font-medium m-0">FAQs</h1>
      </div>

      <div className="px-4">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#F2F1F1] border-[#D7D4D4] border-b overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                {expandedIndex === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedIndex === index && (
                <div className="px-4 pb-4 text-gray-600 whitespace-pre-line">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQs

