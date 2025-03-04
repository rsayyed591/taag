import { useNavigate } from "react-router-dom"

function UserType() {
  const navigate = useNavigate()

  const handleContinue = () => {
    navigate("/user-type")
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src="/hero.png" alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 p-6 text-white">
        {/* Logo */}
        <div className="bg-black rounded-full w-24 h-24 flex items-center justify-center mb-4">
          <h1 className="text-2xl font-bold">Taag</h1>
        </div>

        {/* Tagline */}
        <p className="text-lg mb-12">Track Your Brand Value</p>

        {/* Get Started Text */}
        <p className="mb-2">Get Started as</p>

        {/* Continue Button */}
        <button className="btn-primary mt-4" onClick={handleContinue}>
          Continue
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-white z-10">
        <p className="text-xs">© Taag {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}

export default UserType

