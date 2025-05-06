import React, { useRef } from "react";
import {
  createImagePreview,
  validateImageSize,
} from "../../../utils/imageUtils";
import { LogoUploadFieldProps } from "../../../types/business.types";

const LogoUploadField: React.FC<LogoUploadFieldProps> = ({
  previewImage,
  setPreviewImage,
  onFileSelect,
  uploadLoading = false,
  sizeError,
  setSizeError,
  isRequired = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = React.useState(false);

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleLogoFile(files[0]);
  };

  const handleLogoFile = async (file: File) => {
    // Validate file size
    const validation = validateImageSize(file.size);
    if (!validation.isValid) {
      setSizeError(validation.errorMessage || "File is too large");
      setTimeout(() => setSizeError(null), 5000); // Clear error after 5 seconds
      return;
    }

    // Clear previous errors
    setSizeError(null);

    try {
      // Create image preview
      const preview = await createImagePreview(file);
      setPreviewImage(preview);

      // Pass the file to parent for later upload
      onFileSelect(file);
    } catch (err) {
      console.error("Failed to create preview:", err);
      setSizeError("Failed to create image preview");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-5">
      <label className="block text-base font-medium text-glam-dark mb-2">
        Business Logo {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`relative group ${
          uploadLoading ? "pointer-events-none opacity-70" : ""
        }`}
        onDragEnter={handleDrag}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Preview Container */}
          <div
            className={`
            w-full md:w-1/3 border-2 
            ${
              dragActive
                ? "border-glam-primary bg-glam-primary/5"
                : "border-dashed border-glam-accent"
            } 
            rounded-xl transition-all duration-200 flex items-center justify-center
            h-[120px] hover:border-glam-primary hover:bg-glam-primary/5
          `}
            onClick={triggerFileInput}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {previewImage ? (
              <div className="relative w-full h-full">
                <img
                  src={previewImage}
                  alt="Logo Preview"
                  className="w-full h-full object-contain rounded-lg p-2"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center rounded-lg transition-all">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}
                    className="bg-white text-glam-dark p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-glam-primary hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mx-auto text-glam-accent group-hover:text-glam-primary transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm font-medium text-glam-dark mt-1">
                  Upload logo
                </p>
              </div>
            )}

            {uploadLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-xl">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glam-primary"></div>
                  <p className="mt-2 text-sm text-glam-dark">Uploading...</p>
                </div>
              </div>
            )}
          </div>

          {/* Description & Button */}
          <div className="flex-1 text-sm text-gray-600">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <p className="mb-1">Upload your business logo (max 5MB)</p>
                <p className="text-xs text-gray-500">
                  PNG or JPG format, 500x500px recommended
                </p>
              </div>
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-3 py-1.5 bg-glam-primary text-white rounded-lg hover:bg-glam-dark text-sm transition-colors whitespace-nowrap"
                disabled={uploadLoading}
              >
                {uploadLoading ? "Uploading..." : "Choose Image"}
              </button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
          required={isRequired && !previewImage}
        />

        {sizeError && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
            {sizeError}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoUploadField;
