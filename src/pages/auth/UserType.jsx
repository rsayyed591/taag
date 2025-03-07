import { useState } from "react"
import { useNavigate } from "react-router-dom"

function UserType() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState(null)

  const handleContinue = () => {
    if (selectedType) {
      const existingUserData = JSON.parse(localStorage.getItem("currentUser")) || {}; // Get userData
      existingUserData.userType = selectedType;
  
      localStorage.setItem("currentUser", JSON.stringify(existingUserData));
      navigate("/auth/socials")
    }
  }

  return (
    <div className="page-container">
      {/* Content */}
      <div className="content-container pt-6 md:pt-12">
        <h2 className="mb-2 header w-[251px] md:w-full">Select your preferred user type</h2>
        <p className="sub-header2 font-medium text-[#979797] md:text-center mb-8 md:mt-8">
          Select the option defining your role
        </p>

        {/* User Type Options */}
        <div className="flex flex-wrap gap-x-2 gap-y-4 place-items-center md:justify-center md:align-center mb-8">
          <div
            className={`option-card ${selectedType === "Agency" ? "selected" : ""}`}
            onClick={() => setSelectedType("Agency")}
          >
            Agency
          </div>

          <div
            className={`option-card ${selectedType === "Brand" ? "selected" : ""}`}
            onClick={() => setSelectedType("Brand")}
          >
            Brand
          </div>

          <div
            className={`option-card ${selectedType === "Creator" ? "selected" : ""}`}
            onClick={() => setSelectedType("Creator")}
          >
            Creator
          </div>
        </div>
      </div>

      {/* Footer (Fixed at Bottom) */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 z-50">
        <button className="btn-primary2 w-full max-w-xs" onClick={handleContinue} disabled={!selectedType}>
          Continue
        </button>
      </div>
    </div>
  )
}

export default UserType
