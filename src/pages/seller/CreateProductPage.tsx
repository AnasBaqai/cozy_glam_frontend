import React from "react";
import Navbar from "../../components/layout/Navbar/Navbar";
import Marquee from "../../components/layout/Marquee/Marquee";
import ProductFormHeader from "../../components/seller/product/ProductFormHeader";
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
        className={`flex-1 flex flex-col items-center justify-start p-4 md:p-6 mt-28 md:mt-32 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <div className="w-full max-w-4xl">
          {/* Header */}
          <ProductFormHeader
            title="List a New Product"
            subtitle="Fill in the details below to create a new product listing"
          />

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-gradient-to-r from-amber-500 to-yellow-600 py-4 px-6">
              <h2 className="text-white text-lg font-medium">
                Product Information
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information Section */}
              <ProductBasicInfoFields
                title={formData.title}
                description={formData.description}
                errors={errors}
                onChange={handleInputChange}
              />

              {/* Price & Inventory Section */}
              <ProductPricingFields
                price={formData.price}
                quantity={formData.quantity}
                errors={errors}
                onChange={handleInputChange}
              />

              {/* Categories & Subcategories Section */}
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

              {/* Images Section */}
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

              {/* Form submission error */}
              {errors.submit && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <ProductFormActions
                isSubmitting={isSubmitting}
                isDisabled={totalImageSize > MAX_TOTAL_SIZE}
                onSaveAsDraft={handleSaveAsDraft}
              />
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
