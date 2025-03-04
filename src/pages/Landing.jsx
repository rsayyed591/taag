import { useNavigate } from "react-router-dom"

function Landing() {
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
        <div className="bg-black rounded-full w-[153px] h-[148px] flex items-center justify-center mb-6">
            <img src="/logo.png" alt="logo" className="w-full h-full" />
        </div>


        {/* Tagline */}
        <p className="text-[15px] leading-[20.49px] tracking-[0] font-manrope font-medium text-center mb-12">
  Track Your Brand Value
</p>


      </div>

      {/* Footer */}
      <div className="text-center text-[#F6F5EB] z-10">
        {/* Get Started Text */}
        <p className="mb-2 text-[12px] leading-[16.39px] tracking-[0.16em] font-manrope font-medium text-center">
            GET STARTED AS
        </p>
        {/* Continue Button */}
        <button className="btn-primary mt-4 mb-12" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}

export default Landing

