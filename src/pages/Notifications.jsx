import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Notifications() {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(true);

  const handleContinue = () => {
    navigate("/phone-verification");
  };

  const handleAllow = () => {
    localStorage.setItem("notifications", "allowed");
    navigate("/phone-verification");
  };

  const handleDontAllow = () => {
    localStorage.setItem("notifications", "denied");
    setShowNotification(false);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 pt-6">
      {/* Heading */}
      <h2 className="text-2xl leading-[32.78px] font-manrope font-medium">
        Enable notifications to get more opportunities
      </h2>

      {/* Notification Box with Animation */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-[315px] bg-[#E7E7E7] rounded-lg overflow-hidden shadow-md"
            >
              <div className="p-6 text-center">
                <p className="text-[15px] font-manrope font-semibold leading-[20.49px]">
                  Turn on notifications <br />
                  from <span className="text-[#12766A] font-bold">"TAAG"</span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex border-t border-gray-300">
                <button
                  className="flex-1 py-4 text-[#12766A] text-[15px] font-manrope font-bold border-r border-gray-300"
                  onClick={handleAllow}
                >
                  ALLOW
                </button>

                <button
                  className="flex-1 py-4 text-[15px] font-manrope leading-[20.49px] text-[#A3A3A3] font-medium"
                  onClick={handleDontAllow}
                >
                  DON'T ALLOW
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center mb-12">
        <button className="btn-primary2" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default Notifications;
