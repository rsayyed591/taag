import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

function Socials() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    instagramId: "",
    youtubeId: "",
    instagramReelCost: "",
    youtubeVideoCost: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    localStorage.setItem("socials", JSON.stringify(formData));
    navigate("/auth/categories");
  };

  const clearField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="page-container">
      <div className="content-container pt-6 md:pt-12">
        <h2 className="mb-2 header">
          Add your socials to help us find you for better campaigns!
        </h2>

        {/* Social Media Form */}
        <div className="space-y-6 mt-8">
          {/* Instagram ID */}
          <div className="relative">
            <label className="sub-header text-[#12766A]">Instagram ID</label>
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
            <label className="sub-header text-[#12766A]">YouTube ID</label>
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
              <label className="sub-header text-[#6F6F6F]">Instagram Reel Cost</label>
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
              <label className="sub-header text-[#6F6F6F]">YT Integrated Video Cost</label>
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
      </div>

      {/* Footer (Fixed at Bottom) */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 z-50">
        <button className="btn-primary2 w-full max-w-xs" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default Socials;
