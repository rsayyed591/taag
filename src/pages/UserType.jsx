import { useState } from "react"
import { useNavigate } from "react-router-dom"

function UserType() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState(null)

  const handleContinue = () => {
    if (selectedType) {
      // Store the selected user type in localStorage
      localStorage.setItem("userType", selectedType)
      navigate("/auth/socials")
    }
  }

  return (
    <div className="page-container">
      {/* Content */}
      <div className="content-container pt-6 md:pt-12">
        <h2 className="mb-2 text-2xl leading-[32.78px] font-manrope font-medium w-[251px] md:w-full md:text-center">Select your preferred user type</h2>
        <p className="text-[15px] leading-[20.49px] font-manrope font-medium text-[#979797] md:text-center mb-8 md:mt-8">Select the option defining your role</p>

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

        {/* Continue Button */}
        <div className="mt-auto flex justify-center mb-12">
          <button className="btn-primary2" onClick={handleContinue} disabled={!selectedType}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserType

