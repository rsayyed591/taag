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
    <div className="page-container h-screen overflow-hidden relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img src="/hero.png" alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Centered Content (Fixed) */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-10 p-6 text-white mb-20 md:mb-40">
        {/* Logo */}
        <div className="bg-black rounded-full w-[153px] h-[148px] md:w-[200px] md:h-[200px] flex items-center justify-center mb-6">
          <img src="/logo.png" alt="logo" className="w-full h-full" />
        </div>

        {/* Tagline */}
        <p className="sub-header2 font-medium text-center md:text-xl">
          Track Your Brand Value
        </p>
      </div>

      {/* Footer (Fixed at Bottom) */}
      <div className="fixed bottom-6 left-0 right-0 flex flex-col items-center text-[#F6F5EB] z-50">
        {/* Get Started Text */}
        <p className="mb-2 text-[12px] leading-[16.39px] tracking-[0.16em] font-manrope font-medium text-center md:text-base">
          GET STARTED AS
        </p>

        {/* Buttons Section */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
          {/* Continue Button */}
          <button className="btn-primary px-6 py-3 w-full" onClick={handleContinue}>
            Continue
          </button>

          {/* Divider with "OR" */}
          <div className="flex items-center w-full my-2">
            <hr className="flex-grow border-t border-gray-400" />
            <span className="mx-3 text-gray-400 text-sm font-medium">OR</span>
            <hr className="flex-grow border-t border-gray-400" />
          </div>

          {/* Sign In Button */}
          <button className="btn-outline px-6 pb-3 w-full" onClick={handleSignIn}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
