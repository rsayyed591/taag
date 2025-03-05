import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/auth/user-type");
  };

  const handleSignIn = () => {
    navigate("/auth/phone-verification");
  };

  return (
    <div className="page-container">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src="/hero.png" alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 p-6 text-white">
        {/* Logo */}
        <div className="bg-black rounded-full w-[153px] h-[148px] md:w-[200px] md:h-[200px] flex items-center justify-center mb-6">
          <img src="/logo.png" alt="logo" className="w-full h-full" />
        </div>

        {/* Tagline */}
        <p className="sub-header2 font-medium text-center mb-12 md:text-xl md:mb-16">
          Track Your Brand Value
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-[#F6F5EB] z-10 mb-8 md:mb-12">
        {/* Get Started Text */}
        <p className="mb-2 text-[12px] leading-[16.39px] tracking-[0.16em] font-manrope font-medium text-center md:text-base">
          GET STARTED AS
        </p>
        
        {/* Continue Button */}
        <div className="flex justify-center">
          <button className="btn-primary mt-4" onClick={handleContinue}>
            Continue
          </button>
        </div>

        {/* Already a user? Sign in */}
        <p className="mt-4 text-sm text-[#F6F5EB] font-medium md:text-base">
          Already a user?{" "}
          <button className="text-[#2dd4bf] underline font-semibold" onClick={handleSignIn}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Landing;