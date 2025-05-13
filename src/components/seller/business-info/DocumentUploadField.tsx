import React, { useRef } from "react";
import { DocumentUploadFieldProps } from "../../../types/business.types";

const DocumentUploadField: React.FC<DocumentUploadFieldProps> = ({
  label,
  required = false,
  file,
  setFile,
  uploadLoading = false,
  sizeError,
  setSizeError,
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
      handleDocumentFile(e.dataTransfer.files[0]);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleDocumentFile(files[0]);
  };

  const handleDocumentFile = (file: File) => {
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setSizeError(`File is too large. Maximum size is 10MB.`);
      setTimeout(() => setSizeError(null), 5000); // Clear error after 5 seconds
      return;
    }

    // Validate file type (PDF, DOC, DOCX, JPG, PNG)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      setSizeError(
        "Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG files."
      );
      setTimeout(() => setSizeError(null), 5000);
      return;
    }

    // Clear previous errors
    setSizeError(null);

    // Set the file
    setFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="mb-5">
      <label className="block text-base font-medium text-glam-dark mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`relative group ${
          uploadLoading ? "pointer-events-none opacity-70" : ""
        }`}
        onDragEnter={handleDrag}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Upload Container */}
          <div
            className={`
              w-full border-2 
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
            {file ? (
              <div className="flex flex-col items-center justify-center p-4">
                <div className="bg-glam-primary/10 p-2 rounded-full mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-glam-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-glam-dark truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
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
                  Upload document
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
        </div>

        <div className="mt-2 text-sm text-gray-600">
          <p>Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
          onChange={handleDocumentUpload}
          className="hidden"
          required={required && !file}
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

export default DocumentUploadField;
