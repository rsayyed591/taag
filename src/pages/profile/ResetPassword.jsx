"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

function ResetPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", ""])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSendOTP = () => {
    // Simulate sending OTP
    localStorage.setItem("resetEmail", email)
    setStep(2)
  }

  const handleVerifyOTP = () => {
    // Simulate OTP verification
    setStep(3)
  }

  const handleResetPassword = () => {
    if (password === confirmPassword) {
      // Save new password
      localStorage.setItem("userPassword", password)
      navigate("/profile")
    } else {
      alert("Passwords do not match")
    }
  }

  const handleOTPChange = (index, value) => {
    if (value.length <= 1) {
      const newOTP = [...otp]
      newOTP[index] = value
      setOtp(newOTP)

      // Move to next input if value is entered
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus()
      }
    }
  }

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-white">
        <button onClick={() => navigate("/profile")} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">Reset Password</h1>
      </div>

      <div className="p-4">
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-gray-600">We will send an OTP to your registered Email ID. Enter it below.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-200 rounded-md"
            />
            <button onClick={handleSendOTP} className="w-full py-3 bg-[#12766A] text-white rounded-full">
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <p className="text-gray-600">We've sent an one-time passcode to {email}. Enter the code below.</p>
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl border border-gray-200 rounded-md"
                />
              ))}
            </div>
            <button onClick={handleVerifyOTP} className="w-full py-3 bg-[#12766A] text-white rounded-full">
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <p className="text-gray-600">Enter a new password below:</p>
            <div>
              <label className="text-sm text-gray-500 block mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Retype New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
            <button onClick={handleResetPassword} className="w-full py-3 bg-[#12766A] text-white rounded-full">
              Save Details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResetPassword

