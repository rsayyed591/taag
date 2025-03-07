import { useState } from "react";
import { Upload, X } from 'lucide-react';

function DigitalSignature({ data, onChange }) {
  const [preview, setPreview] = useState(data?.signature || null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange("signature", reader.result); // Save as base64
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    setPreview(null);
    onChange("signature", null);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Digital Signature</label>
      
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="signature-upload"
        />
        
        {preview ? (
          <div className="border border-gray-300 rounded-md p-4 mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Signature uploaded</span>
              <button 
                onClick={clearSignature}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img 
              src={preview || "/placeholder.svg"} 
              alt="Signature Preview" 
              className="max-h-24 mx-auto"
            />
          </div>
        ) : (
          <label
            htmlFor="signature-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-[#12766A]"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
            </div>
          </label>
        )}
      </div>
    </div>
  );
}

export default DigitalSignature;
