import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Success() {
  const navigate = useNavigate()
  const [userType, setUserType] = useState("")

  useEffect(() => {
    // Get user type from localStorage
    const storedUserType = localStorage.getItem("userType") || "user"
    setUserType(storedUserType.toLowerCase())
  }, [])

  const handleContinue = () => {
    // Navigate to home page
    navigate("/home")
  }

  return (
    <div className="min-h-screen flex flex-col px-6">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* User Avatar */}
        <div className="bg-gray-100 rounded-full p-4 mb-6">
          <img src="/user.png" alt="User" width={40} height={40} className="rounded-full" />
        </div>

        {/* Success Message */}
        <h2 className="px-6 text-2xl leading-[32.78px] font-manrope font-medium mb-2 text-center">Successfully Logged in as a {userType}!</h2>

        <p className="text-center text-[15px] font-manrope leading-[20.49px] font-medium text-[#979797] mb-8 w-[213px]">
          Browse to explore all the features <span className="font-semibold text-[#12766A]">Taag</span> has to offer.
        </p>
        </div>

        {/* Continue Button */}
       <div className="mt-auto flex justify-center">
          <button className="btn-primary2 mb-12" onClick={handleContinue}>
            Continue
          </button>
        </div>
    </div>
  )
}

export default Success

