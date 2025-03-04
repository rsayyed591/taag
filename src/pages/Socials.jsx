import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"

function Socials() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    instagramId: "",
    youtubeId: "",
    instagramReelCost: "",
    youtubeVideoCost: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContinue = () => {
    // Store social media information in localStorage
    localStorage.setItem("socials", JSON.stringify(formData))
    navigate("/categories")
  }

  const clearField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: "" }))
  }

  return (
    <div className="h-[852px] min-h-screen flex flex-col px-6 pt-6">
      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h2 className="mb-2 text-2xl leading-[32.78px] font-manrope font-medium">Add your socials to help us <br /> find you for better <br /> campaigns!</h2>

        {/* Social Media Form */}
        <div className="space-y-6 mt-8">
          {/* Instagram ID */}
          <div className="relative">
            <label className="text-[12px] leading-[16.39px] text-[#12766A]">Instagram ID</label>
            <div className="phone-container">
              <input
                type="text"
                name="instagramId"
                value={formData.instagramId}
                onChange={handleChange}
                className="input-field"
                placeholder="@username123"
              />
              {formData.instagramId && (
                <button className="clear-btn" onClick={() => clearField("instagramId")}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* YouTube ID */}
          <div>
            <label className="text-[12px] leading-[16.39px] text-[#12766A]">YouTube ID</label>
            <div className="phone-container">
              <input
                type="text"
                name="youtubeId"
                value={formData.youtubeId}
                onChange={handleChange}
                className="input-field"
                placeholder="channel-name"
              />
              {formData.youtubeId && (
                <button className="clear-btn" onClick={() => clearField("youtubeId")}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Cost Fields */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[12px] leading-[16.39px] text-[#6F6F6F]">Instagram Reel Cost</label>
              <div className="phone-container">
                <input
                  type="number"
                  name="instagramReelCost"
                  value={formData.instagramReelCost}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="₹"
                />
                {formData.instagramReelCost && (
                  <button className="clear-btn" onClick={() => clearField("instagramReelCost")}>
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1">
              <label className="text-[12px] leading-[16.39px] text-[#6F6F6F]">YT Integrated Video Cost</label>
              <div className="phone-container">
                <input
                  type="number"
                  name="youtubeVideoCost"
                  value={formData.youtubeVideoCost}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="₹"
                />
                {formData.youtubeVideoCost && (
                  <button className="clear-btn" onClick={() => clearField("youtubeVideoCost")}>
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-auto flex justify-center">
          <button className="btn-primary2 mb-12" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Socials

