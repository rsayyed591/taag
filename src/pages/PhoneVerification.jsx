import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

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
    <div className="min-h-screen flex flex-col px-6">
      {/* Heading at the Top */}
      <div className="pt-6">
        <h2 className="mb-2 text-2xl leading-[32.78px] font-manrope font-medium">
          Welcome to the future!<br /> Automating your accounts <br /> and campaigns
        </h2>
        <p className="text-[15px] font-manrope leading-[20.49px] font-medium text-[#979797]">
          Sign in or create an account
        </p>
      </div>

      {/* Centered Input and Button */}
      <div className="flex-1 flex flex-col items-center justify-center mb-16">
        {/* Phone Number Input */}
        <div className="w-full max-w-sm space-y-4">
          <label className="text-[12px] leading-[16.39px] font-manrope font-medium text-[#12766A]">Mobile Number</label>
          <div className="relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={handleChange}
              className="input-field"
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
        <div className="w-full max-w-sm mt-8">
          <button className="btn-primary2 w-full py-3" onClick={handleContinue} disabled={phoneNumber.length < 10}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhoneVerification;
