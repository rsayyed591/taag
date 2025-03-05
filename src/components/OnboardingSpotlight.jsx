import { useState } from "react"

function OnboardingSpotlight({ steps, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete?.()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div
        className="absolute bg-white rounded-xl p-6 max-w-xs w-full"
        style={{
          top: steps[currentStep].position.top,
          left: steps[currentStep].position.left,
        }}
      >
        <h3 className="text-lg font-semibold mb-2">{steps[currentStep].title}</h3>
        <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentStep ? "bg-[#12766A]" : "bg-gray-200"}`}
              />
            ))}
          </div>

          <button onClick={handleNext} className="px-6 py-2 bg-[#12766A] text-white rounded-full text-sm">
            {currentStep === steps.length - 1 ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingSpotlight

