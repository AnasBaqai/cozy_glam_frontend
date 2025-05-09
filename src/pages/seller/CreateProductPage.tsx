import React from "react";
import Navbar from "../../components/layout/Navbar/Navbar";
import Marquee from "../../components/layout/Marquee/Marquee";
import ProductBasicInfoFields from "../../components/seller/product/ProductBasicInfoFields";
import ProductPricingFields from "../../components/seller/product/ProductPricingFields";
import ProductCategorySelector from "../../components/seller/product/ProductCategorySelector";
import ProductImageUpload from "../../components/seller/product/ProductImageUpload";
import ProductFormActions from "../../components/seller/product/ProductFormActions";
import ToastNotification from "../../components/seller/product/ToastNotification";
import useProductForm from "../../hooks/useProductForm";
import SellerSidebar from "../../components/seller/dashboard/SellerSidebar";
import "../../components/seller/dashboard/dashboard.css";
import { useProductContext } from "../../context/ProductContext";
import useSidebarState from "../../hooks/useSidebarState";

const CreateProductPage: React.FC = () => {
  // Get the refreshListings function from ProductContext
  const { refreshListings } = useProductContext();

  // Replace the useState with our custom hook
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const {
    formData,
    imagePreviews,
    totalImageSize,
    isSubmitting,
    errors,
    sizeError,
    categories,
    subcategories,
    loadingCategories,
    loadingSubcategories,
    toastMessage,
    MAX_TOTAL_SIZE,
    handleInputChange,
    handleCategoryChange,
    handleSubcategorySelect,
    handleSubcategoryRemove,
    handleImagesChange,
    handleSubmit: originalHandleSubmit,
    handleSaveAsDraft: originalHandleSaveAsDraft,
    setImagePreviews,
    setTotalImageSize,
    setSizeError,
  } = useProductForm();

  // Wrap the original handlers to update product listings
  const handleSubmit = async (e: React.FormEvent) => {
    await originalHandleSubmit(e);
    // After successful submission, refresh product listings
    refreshListings();
  };

  const handleSaveAsDraft = async (e: React.FormEvent) => {
    await originalHandleSaveAsDraft(e);
    // After successful draft saving, refresh product listings
    refreshListings();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Marquee />
      <Navbar />

      {/* Sidebar */}
      <SellerSidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content with adjusted margin */}
      <main
        className={`flex-1 p-4 md:p-6 mt-28 md:mt-32 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Product
            </h1>
            <p className="text-gray-600">
              Fill in the details below to list your product for sale
            </p>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Progress Steps */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-glam-primary text-white flex items-center justify-center font-semibold">
                    1
                  </div>
                  <span className="text-sm mt-2 font-medium text-glam-primary">
                    Basic Info
                  </span>
                </div>
                <div className="flex-1 h-1 bg-glam-primary/20 mx-4"></div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-glam-primary/20 text-gray-600 flex items-center justify-center font-semibold">
                    2
                  </div>
                  <span className="text-sm mt-2 text-gray-600">Media</span>
                </div>
                <div className="flex-1 h-1 bg-glam-primary/20 mx-4"></div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-glam-primary/20 text-gray-600 flex items-center justify-center font-semibold">
                    3
                  </div>
                  <span className="text-sm mt-2 text-gray-600">Categories</span>
                </div>
              </div>
            </div>

            {/* Form Sections */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
              {/* Left Column - Basic Info & Pricing */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Basic Information
                    </h2>
                    <ProductBasicInfoFields
                      title={formData.title}
                      description={formData.description}
                      errors={errors}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Pricing & Inventory
                    </h2>
                    <ProductPricingFields
                      price={formData.price}
                      quantity={formData.quantity}
                      errors={errors}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Images Section */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Product Images
                    </h2>
                    <ProductImageUpload
                      imagePreviews={imagePreviews}
                      setImagePreviews={setImagePreviews}
                      onImagesChange={handleImagesChange}
                      totalImageSize={totalImageSize}
                      setTotalImageSize={setTotalImageSize}
                      sizeError={sizeError}
                      setSizeError={setSizeError}
                      maxTotalSize={MAX_TOTAL_SIZE}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Categories & Actions */}
              <div className="space-y-8">
                {/* Categories Section */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Categories
                    </h2>
                    <ProductCategorySelector
                      categories={categories}
                      subcategories={subcategories}
                      selectedCategory={formData.category}
                      selectedSubcategories={formData.subCategories}
                      loadingCategories={loadingCategories}
                      loadingSubcategories={loadingSubcategories}
                      errors={errors}
                      onCategoryChange={handleCategoryChange}
                      onSubcategorySelect={handleSubcategorySelect}
                      onSubcategoryRemove={handleSubcategoryRemove}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <ProductFormActions
                      isSubmitting={isSubmitting}
                      isDisabled={totalImageSize > MAX_TOTAL_SIZE}
                      onSaveAsDraft={handleSaveAsDraft}
                    />
                  </div>
                </div>

                {/* Tips Card */}
                <div className="bg-glam-light rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-glam-dark mb-4">
                    Tips for Success
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-glam-primary mr-2 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Use high-quality images from multiple angles
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-glam-primary mr-2 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Write detailed, accurate descriptions
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-glam-primary mr-2 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Set competitive prices
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-glam-primary mr-2 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Choose relevant categories
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Toast Notification */}
        <ToastNotification
          visible={toastMessage.visible}
          type={toastMessage.type}
          message={toastMessage.message}
        />
      </main>
    </div>
  );
};

export default CreateProductPage;
