import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function OtpVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canRetry, setCanRetry] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const inputRefs = useRef([]);
  const timerInterval = useRef(null);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);

    const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
    setPhoneNumber(storedPhoneNumber);

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    startTimer();

    return () => {
      clearInterval(timerInterval.current);
    };
  }, []);

  const startTimer = () => {
    setTimer(30);
    setCanRetry(false);

    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    timerInterval.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval.current);
          setCanRetry(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleRetry = () => {
    setOtp(["", "", "", ""]);
    startTimer();
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  const handleContinue = () => {
    if (otp.every((digit) => digit !== "")) {
      navigate("/auth/success");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="page-container">
      <div className="content-container">
        {/* Heading at the Top */}
        <div className="pt-6 md:pt-12">
          <h2 className="mb-2 header">
            Please verify your Phone number
          </h2>
          <p className="sub-header2 font-medium text-[#979797] md:text-center md:mt-6">
            We've sent a one-time passcode to <span className="font-semibold text-[#12766A]">+91 {phoneNumber}</span>. Enter the code below.
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center mt-8 mb-16 md:my-12">
          {/* OTP Input */}
          <div className="w-full max-w-sm mb-6 md:max-w-md">
            <label className="sub-header mb-6 ml-8 block text-[#1D1D1F] md:text-sm md:ml-0">Verification code</label>
            <div className="flex gap-3 justify-center md:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input md:w-16 md:h-16 md:text-3xl"
                />
              ))}
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="sub-header2 font-medium text-[#979797]">
              Didn't receive a code?{" "}
              {canRetry ? (
                <button className="text-[#12766A] font-medium" onClick={handleRetry}>
                  Retry
                </button>
              ) : (
                <span><span className="font-semibold text-[#12766A]">Retry</span> in {formatTime(timer)}</span>
              )}
            </p>
          </div>

          {/* Continue Button */}
          <div className="w-full max-w-sm md:max-w-md">
            <button className="btn-primary2 w-full py-3" onClick={handleContinue} disabled={!otp.every((digit) => digit !== "")}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;