import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import Marquee from "../../components/layout/Marquee/Marquee";
import {
  Category,
  SubCategory,
  categoryService,
  productService,
  uploadService,
} from "../../services/api";
import { createImagePreview, validateImageSize } from "../../utils/imageUtils";

// Type for the product form data
interface ProductFormData {
  title: string;
  description: string;
  price: string;
  quantity: string;
  images: File[];
  category: string;
  subCategories: string[];
}

// Type for image preview
interface ImagePreview {
  file: File;
  preview: string;
  size: number;
}

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: "",
    quantity: "",
    images: [],
    category: "",
    subCategories: [],
  });

  // UI state
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [totalImageSize, setTotalImageSize] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [sizeError, setSizeError] = useState("");

  // Categories and subcategories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // Constants
  const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  // Add state for toast notification
  const [toastMessage, setToastMessage] = useState<{
    visible: boolean;
    text: string;
    type: "success" | "error";
  }>({
    visible: false,
    text: "",
    type: "success",
  });

  // Add the CSS animation for the toast
  useEffect(() => {
    // Add the CSS animation for the toast to the document head
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-20px); }
        10% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
      }
    `;
    document.head.appendChild(style);

    // Clean up
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Redirect non-sellers or sellers without a store to appropriate pages
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "seller") {
      navigate("/");
    } else if (user?.role === "seller" && !user?.isStoreCreated) {
      navigate("/business-info");
    }
  }, [isAuthenticated, user, navigate]);

  // Add useEffect for fetching categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await categoryService.getCategories();
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Handle numeric fields (price and quantity)
    if (name === "price" || name === "quantity") {
      // Allow empty value for backspacing
      if (value === "") {
        setFormData((prev) => ({ ...prev, [name]: "" }));
        return;
      }

      // Only allow numeric values
      if (/^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      // Handle text fields normally
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
    const sizeValidation = validateImageSize(newTotalSize, MAX_TOTAL_SIZE);
    if (!sizeValidation.isValid) {
      setSizeError(
        sizeValidation.errorMessage || "Total image size cannot exceed 10MB"
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
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles],
    }));
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

    // Update form data
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages }));

    // Update total size
    setTotalImageSize((prev) => prev - imageToRemove.size);

    // Clear size error if we're now under the limit
    if (totalImageSize - imageToRemove.size <= MAX_TOTAL_SIZE) {
      setSizeError("");
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (Number(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";
    if (Number(formData.quantity) <= 0)
      newErrors.quantity = "Quantity must be greater than 0";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";
    if (!formData.category) newErrors.category = "Please select a category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format bytes to human-readable size
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload images first
      const imageUrls = await uploadService.uploadMultipleImages(
        formData.images
      );

      // Create product data
      const productData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price) * 100, // Convert to cents
        quantity: Number(formData.quantity),
        images: imageUrls,
        seller_id: user?._id || "",
        category: formData.category,
        subCategories: formData.subCategories,
      };

      // Call API to create product
      await productService.createProduct(productData);

      // Store success message in localStorage for dashboard
      localStorage.setItem(
        "dashboardFlash",
        JSON.stringify({
          type: "success",
          message: `Product "${formData.title}" was successfully created!`,
          timestamp: Date.now(),
        })
      );

      // Navigate to dashboard immediately
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating product:", err);
      setErrors({
        submit:
          err instanceof Error
            ? err.message
            : "Failed to create product. Please try again.",
      });

      // Show error toast that fades out after 5 seconds
      setToastMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Failed to create product. Please try again.",
        visible: true,
      });

      setTimeout(() => {
        setToastMessage((prev) => ({ ...prev, visible: false }));
      }, 5000);

      setIsSubmitting(false);
    }
  };

  // Add a function to handle category selection and fetch subcategories
  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const categoryId = e.target.value;

    console.log("Selected category ID:", categoryId);

    // Update the form data with the selected category
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      subCategories: [], // Reset subcategories when category changes
    }));

    // Clear any error on the category field
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }

    // If no category is selected, clear subcategories
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    // Fetch subcategories for the selected category
    try {
      setLoadingSubcategories(true);

      // Use the real API endpoint
      console.log("Fetching subcategories for category ID:", categoryId);
      const response = await categoryService.getSubCategories(categoryId);

      // Log the full response to debug
      console.log(
        "Subcategories API response:",
        JSON.stringify(response, null, 2)
      );

      // Check different possible response structures
      if (response.status) {
        // Check different possible response structures
        if (response.data && Array.isArray(response.data)) {
          // Direct array in data
          console.log("Found subcategories as direct array in data");
          setSubcategories(response.data);
        } else if (
          response.data &&
          response.data.subcategories &&
          Array.isArray(response.data.subcategories)
        ) {
          // Nested within data.subcategories (lowercase)
          console.log("Found subcategories in data.subcategories");
          setSubcategories(response.data.subcategories);
        } else if (Array.isArray(response)) {
          // Direct array response
          console.log("Found subcategories as direct array response");
          setSubcategories(response);
        } else {
          console.error(
            "Unexpected subcategories response structure:",
            response
          );
          setSubcategories([]);
        }
      } else {
        console.error("API returned an error status:", response);
        setSubcategories([]);
      }
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      setSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Marquee />
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-6 mt-28 md:mt-32">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              List a New Product
            </h1>
            <p className="mt-2 text-gray-600">
              Fill in the details below to create a new product listing
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-4 px-6">
              <h2 className="text-white text-lg font-medium">
                Product Information
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Basic Information
                </h3>

                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter a descriptive title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Describe your product in detail"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Inventory Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Price & Inventory
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.price ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.quantity ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Number of items in stock"
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.quantity}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Categories & Subcategories Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Categories
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Dropdown */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.category ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select a category</option>
                        {loadingCategories ? (
                          <option disabled>Loading categories...</option>
                        ) : (
                          categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))
                        )}
                      </select>
                      {loadingCategories && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                        </div>
                      )}
                    </div>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Subcategories Multi-select */}
                  <div>
                    <label
                      htmlFor="subCategories"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subcategories
                    </label>
                    <div
                      className={`relative rounded-lg border ${
                        errors.subCategories
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500`}
                    >
                      {/* Selected subcategories tags */}
                      <div className="p-2 flex flex-wrap gap-2 min-h-[100px] max-h-[200px] overflow-y-auto">
                        {loadingSubcategories ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                          </div>
                        ) : subcategories.length > 0 ? (
                          <>
                            {/* Show selected subcategories as tags */}
                            {formData.subCategories.length > 0 ? (
                              formData.subCategories.map((subCatId) => {
                                const subCat = subcategories.find(
                                  (sc) => sc._id === subCatId
                                );
                                return subCat ? (
                                  <div
                                    key={subCat._id}
                                    className="bg-indigo-100 text-indigo-800 pl-1 pr-2 py-1 rounded-md text-sm flex items-center"
                                  >
                                    {subCat.imageUrl && (
                                      <img
                                        src={subCat.imageUrl}
                                        alt={subCat.name}
                                        className="w-5 h-5 rounded-full object-cover mr-1.5"
                                      />
                                    )}
                                    <span>{subCat.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          subCategories:
                                            prev.subCategories.filter(
                                              (id) => id !== subCat._id
                                            ),
                                        }));
                                      }}
                                      className="ml-1.5 text-indigo-500 hover:text-indigo-700"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
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
                                ) : null;
                              })
                            ) : (
                              <div className="text-gray-500 text-sm py-1 px-2">
                                Click on subcategories below to select them
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-500 text-sm w-full h-full flex items-center justify-center">
                            {formData.category
                              ? "No subcategories available"
                              : "Select a category first"}
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      {subcategories.length > 0 && (
                        <div className="border-t border-gray-200"></div>
                      )}

                      {/* Available subcategories list */}
                      {subcategories.length > 0 && !loadingSubcategories && (
                        <div className="p-2 max-h-[150px] overflow-y-auto">
                          <div className="text-xs text-gray-500 mb-1">
                            Available subcategories:
                          </div>
                          <div className="space-y-1">
                            {subcategories
                              .filter(
                                (sub) =>
                                  !formData.subCategories.includes(sub._id)
                              )
                              .map((subcategory) => (
                                <div
                                  key={subcategory._id}
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      subCategories: [
                                        ...prev.subCategories,
                                        subcategory._id,
                                      ],
                                    }));
                                  }}
                                  className="flex items-center gap-2 text-sm px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                                >
                                  {subcategory.imageUrl && (
                                    <img
                                      src={subcategory.imageUrl}
                                      alt={subcategory.name}
                                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                    />
                                  )}
                                  {subcategory.name}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {formData.category && subcategories.length > 0 && (
                      <p className="mt-1 text-xs text-gray-500">
                        Click on subcategories to select multiple
                      </p>
                    )}
                    {errors.subCategories && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.subCategories}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Product Images
                  </h3>
                  <div className="text-sm flex items-center">
                    <span
                      className={`${
                        totalImageSize > MAX_TOTAL_SIZE * 0.8
                          ? "text-amber-600"
                          : "text-gray-500"
                      }`}
                    >
                      {formatBytes(totalImageSize)}
                    </span>
                    <span className="mx-1 text-gray-500">/</span>
                    <span className="text-gray-500">10MB</span>
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
                      PNG, JPG, GIF up to 10MB total
                    </p>

                    {sizeError && (
                      <p className="text-sm text-red-600">{sizeError}</p>
                    )}

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

              {/* Form submission error */}
              {errors.submit && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || totalImageSize > MAX_TOTAL_SIZE}
                  className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center ${
                    isSubmitting || totalImageSize > MAX_TOTAL_SIZE
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Product...
                    </>
                  ) : (
                    "Create Product"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Toast Notification */}
        {toastMessage.visible && (
          <div
            className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-500 transform translate-y-0 opacity-100 ${
              toastMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
            style={{
              animation: "fadeInOut 3s forwards",
            }}
          >
            <div className="flex items-center">
              {toastMessage.type === "success" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <p>{toastMessage.text}</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CreateProductPage;
