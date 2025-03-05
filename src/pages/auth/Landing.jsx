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
          Empower Your Brand, Track Your Value
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
          <button className="btn-primary mt-4 px-6 py-2 text-sm md:text-base">
            Continue
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <hr className="w-1/3 border-t border-[#F6F5EB]" />
          <span className="px-2 text-sm font-medium text-[#F6F5EB]">OR</span>
          <hr className="w-1/3 border-t border-[#F6F5EB]" />
        </div>

        {/* Sign In Section */}
        <div className="flex justify-center">
          <button
            className="btn-secondary mt-2 px-6 py-2 text-sm md:text-base border border-[#2dd4bf] text-[#2dd4bf] rounded-md hover:bg-[#2dd4bf] hover:text-black transition-all"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
