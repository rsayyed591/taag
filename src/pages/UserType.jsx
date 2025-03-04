import { useState } from "react"
import { useNavigate } from "react-router-dom"

function UserType() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState(null)

  const handleContinue = () => {
    if (selectedType) {
      // Store the selected user type in localStorage
      localStorage.setItem("userType", selectedType)
      navigate("/socials")
    }
  }

  return (
    <div className="h-[852px] min-h-screen flex flex-col px-6 pt-6">
      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h2 className="mb-2 text-2xl leading-[32.78px] font-manrope font-medium">Select your preferred <br/> user type</h2>
        <p className="text-[15px] leading-[20.49px] font-manrope font-medium text-[#979797] mb-8">Select the option defining your role</p>

        {/* User Type Options */}
        <div className="grid grid-cols-2 gap-4 place-items-center mb-8">
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
        <div className="mt-auto flex justify-center">
          <button className="btn-primary2 mb-12" onClick={handleContinue} disabled={!selectedType}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserType

