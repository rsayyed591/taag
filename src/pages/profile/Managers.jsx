"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, X, Check } from "lucide-react"

function Managers() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [managers, setManagers] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("userData")) || {};
    if (savedData.managers) {
      setManagers(savedData.managers);
    }
    if (savedData.managerRequests) {
      setRequests(savedData.managerRequests);
    }
  }, []);  

  const handleAddManager = (contact) => {
    const newRequest = {
      id: Date.now(),
      name: contact,
      phone: "9293839929",
    }

    setRequests((prev) => {
      const updated = [...prev, newRequest]
      const existingUserData = JSON.parse(localStorage.getItem("userData")) || {}; // Get userData
      existingUserData.managerRequests = updated;
      localStorage.setItem("userData", JSON.stringify(existingUserData));
      return updated
    })

    setSearchTerm("")
  }

  const handleAcceptRequest = (request) => {
    // Remove from requests
    setRequests((prev) => {
      const updated = prev.filter((r) => r.id !== request.id)
      const existingUserData = JSON.parse(localStorage.getItem("userData")) || {}; // Get userData
      existingUserData.managerRequests = updated;
      localStorage.setItem("userData", JSON.stringify(existingUserData));
      return updated
    })

    // Add to managers
    setManagers((prev) => {
      const updated = [...prev, request]
      const existingUserData = JSON.parse(localStorage.getItem("userData")) || {}; // Get userData
      existingUserData.managers = updated;
      localStorage.setItem("userData", JSON.stringify(existingUserData));
      return updated
    })
  }

  const handleRejectRequest = (requestId) => {
    setRequests((prev) => {
      const updated = prev.filter((r) => r.id !== requestId)
      const existingUserData = JSON.parse(localStorage.getItem("userData")) || {}; // Get userData
      existingUserData.managerRequests = updated;
      localStorage.setItem("userData", JSON.stringify(existingUserData));
      return updated
    })
  }

  const handleRemoveManager = (managerId) => {
    setManagers((prev) => {
      const updated = prev.filter((m) => m.id !== managerId)
      const existingUserData = JSON.parse(localStorage.getItem("userData")) || {}; // Get userData
      existingUserData.managers = updated;
      localStorage.setItem("userData", JSON.stringify(existingUserData));
      return updated
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-white">
        <button onClick={() => navigate("/profile")} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">Add/Remove Managers</h1>
      </div>

      <div className="p-4">
        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Add Manager's Phone Number or Email"
            className="w-full p-2 pr-10 border border-gray-200 rounded-md"
          />
          {searchTerm && (
            <button
              onClick={() => handleAddManager(searchTerm)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Plus className="w-5 h-5 text-[#12766A]" />
            </button>
          )}
        </div>

        {/* Manager Requests */}
        {requests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Manager requests</h2>
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                      <img
                        src="/placeholder.svg?height=40&width=40"
                        alt={request.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{request.name}</h3>
                      <p className="text-sm text-gray-500">{request.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRejectRequest(request.id)} className="p-2 text-red-500">
                      <X className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleAcceptRequest(request)} className="p-2 text-[#12766A]">
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your Managers */}
        {managers.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-3">Your Managers</h2>
            <div className="space-y-3">
              {managers.map((manager) => (
                <div key={manager.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                      <img
                        src="/placeholder.svg?height=40&width=40"
                        alt={manager.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{manager.name}</h3>
                      <p className="text-sm text-gray-500">{manager.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveManager(manager.id)} className="p-2 text-red-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Managers

