import React, { useRef } from "react";
import {
  createImagePreview,
  validateImageSize,
} from "../../../utils/imageUtils";
import {
  ProductImageUploadProps,
  ImagePreview,
} from "../../../types/product.types";

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  imagePreviews,
  setImagePreviews,
  onImagesChange,
  totalImageSize,
  setTotalImageSize,
  sizeError,
  setSizeError,
  maxTotalSize,
  errors,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format bytes to human-readable size
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle image selection
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Convert FileList to Array
    const newFiles = Array.from(selectedFiles);

    // Calculate new total size
    const newFilesSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    const newTotalSize = totalImageSize + newFilesSize;

    // Check if exceeds max size
    const sizeValidation = validateImageSize(newTotalSize, maxTotalSize);
    if (!sizeValidation.isValid) {
      setSizeError(
        sizeValidation.errorMessage ||
          `Total image size cannot exceed ${maxTotalSize / (1024 * 1024)}MB`
      );
      return;
    }

    setSizeError("");

    // Process each file
    const newImagePreviews: ImagePreview[] = [];

    for (const file of newFiles) {
      try {
        const preview = await createImagePreview(file);
        newImagePreviews.push({
          file,
          preview,
          size: file.size,
        });
      } catch (error) {
        console.error("Failed to create preview for file:", file.name, error);
      }
    }

    // Update state
    setImagePreviews((prev) => [...prev, ...newImagePreviews]);
    onImagesChange(newFiles);
    setTotalImageSize(newTotalSize);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove image from previews
  const handleRemoveImage = (index: number) => {
    const imageToRemove = imagePreviews[index];

    // Update previews
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);

    // Update form data by passing new files array
    const updatedFiles = updatedPreviews.map((preview) => preview.file);
    onImagesChange(updatedFiles);

    // Update total size
    setTotalImageSize((prev) => prev - imageToRemove.size);

    // Clear size error if we're now under the limit
    if (totalImageSize - imageToRemove.size <= maxTotalSize) {
      setSizeError("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
        <div className="text-sm flex items-center">
          <span
            className={`${
              totalImageSize > maxTotalSize * 0.8
                ? "text-amber-600"
                : "text-gray-500"
            }`}
          >
            {formatBytes(totalImageSize)}
          </span>
          <span className="mx-1 text-gray-500">/</span>
          <span className="text-gray-500">{formatBytes(maxTotalSize)}</span>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          sizeError
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
        } transition-colors duration-200`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          multiple
          accept="image/*"
          className="hidden"
          id="image-upload"
        />

        <div className="space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <div className="text-sm text-gray-600">
            <label
              htmlFor="image-upload"
              className="relative cursor-pointer text-indigo-600 hover:text-indigo-500 font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload product images</span>
            </label>
            <p className="mt-1">or drag and drop</p>
          </div>

          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to {maxTotalSize / (1024 * 1024)}MB total
          </p>

          {sizeError && <p className="text-sm text-red-600">{sizeError}</p>}

          {errors.images && (
            <p className="text-sm text-red-600">{errors.images}</p>
          )}
        </div>
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Images
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  src={preview.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1">
                  {formatBytes(preview.size)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
