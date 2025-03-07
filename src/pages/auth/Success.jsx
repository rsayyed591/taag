import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");

  useEffect(() => {
    // Get user type from localStorage
    const userProfile = JSON.parse(localStorage.getItem("userProfiles")) || {}; // Get userData
    const storedUserType = userProfile.userType || "User";
    setUserType(storedUserType.toLowerCase());
  }, []);

  const handleContinue = () => {
    // Navigate to home page
    navigate("/home");
  };

  return (
    <div className="page-container mt-24">
      <div className="content-container">
        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center my-8 md:my-12">
          {/* User Avatar */}
          <div className="bg-gray-100 rounded-full p-4 mb-6 md:p-6 md:mb-8">
            <img
              src="/user.png"
              alt="User"
              width={40}
              height={40}
              className="rounded-full md:w-16 md:h-16"
            />
          </div>

          {/* Success Message */}
          <h2 className="px-6 header mb-2 text-center">
            Successfully Logged in as a {userType}!
          </h2>

          <p className="text-center sub-header2 font-medium text-[#979797] mb-8 w-[213px] md:w-auto md:max-w-md">
            Browse to explore all the features{" "}
            <span className="font-semibold text-[#12766A]">Taag</span> has to offer.
          </p>
        </div>
      </div>

      {/* Footer (Fixed at Bottom) */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 z-50">
        <button className="btn-primary2 w-full max-w-xs" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default Success;
