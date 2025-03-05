import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from 'lucide-react';

function PhoneVerification() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleContinue = () => {
    if (phoneNumber.length >= 10) {
      localStorage.setItem("phoneNumber", phoneNumber);
      navigate("/auth/otp-verification");
    }
  };

  const clearPhoneNumber = () => {
    setPhoneNumber("");
  };

  return (
    <div className="page-container">
      <div className="content-container">
        {/* Heading at the Top */}
        <div className="pt-6 md:pt-12">
          <h2 className="mb-2 header">
            Welcome to the future!<br className="md:hidden" /> Automating your accounts <br className="md:hidden" /> and campaigns
          </h2>
          <p className="sub-header2 font-medium text-[#979797] md:mt-6 md:text-center">
            Sign in or create an account
          </p>
        </div>

        {/* Centered Input and Button */}
        <div className="flex-1 flex flex-col items-center justify-center mt-8 mb-16 md:my-12">
          {/* Phone Number Input */}
          <div className="w-full max-w-sm space-y-4 md:max-w-md">
            <label className="sub-header text-[#12766A] md:text-sm">Mobile Number</label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={handleChange}
                className="input-field md:text-lg md:py-3"
                placeholder="+919293839930"
              />
              {phoneNumber && (
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" onClick={clearPhoneNumber}>
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <div className="w-full max-w-sm mt-8 md:max-w-md md:flex md:justify-center mb">
            <button className="btn-primary2 w-full py-3" onClick={handleContinue} disabled={phoneNumber.length < 10}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneVerification;